const { v4: uuidv4 } = require('uuid');

module.exports = function setupRandomChat(io) {
  // Simple in-memory matching engine
  let waitingQueue = [];
  // Maps roomId -> Array of 2 socket IDs
  const activeRooms = new Map();
  // Maps socketId -> roomId
  const userRooms = new Map();

  io.on('connection', (socket) => {
    // 1. User wants to find a match
    socket.on('rc_find_match', () => {
      // If user is already in a room or queue, clean up first
      cleanupUser(socket);

      if (waitingQueue.length > 0) {
        // Someone is waiting! Match them.
        const partnerSocket = waitingQueue.shift();
        
        // Ensure partner hasn't disconnected while waiting
        if (!partnerSocket.connected) {
          waitingQueue.push(socket);
          return;
        }

        const roomId = uuidv4();
        
        // Join socket.io room for simple message broadcasting
        socket.join(roomId);
        partnerSocket.join(roomId);

        activeRooms.set(roomId, [socket.id, partnerSocket.id]);
        userRooms.set(socket.id, roomId);
        userRooms.set(partnerSocket.id, roomId);

        // Tell both users they are matched. 
        // We designate one as the "initiator" who will create the WebRTC Offer.
        socket.emit('rc_match_found', { roomId, role: 'initiator' });
        partnerSocket.emit('rc_match_found', { roomId, role: 'responder' });
        
        console.log(`[RandomChat] Matched ${socket.id} & ${partnerSocket.id} in ${roomId}`);
      } else {
        // Nobody waiting, join queue
        waitingQueue.push(socket);
        console.log(`[RandomChat] ${socket.id} joined waiting queue. Queue size: ${waitingQueue.length}`);
      }
    });

    // 2. WebRTC Signaling (Offers, Answers, ICE Candidates)
    socket.on('rc_signal', (data) => {
      // Relay the signal to the specific room, but exclude the sender
      const roomId = userRooms.get(socket.id);
      if (roomId) {
        socket.to(roomId).emit('rc_signal', data);
      }
    });

    // 3. Anonymous Text Chat Message
    socket.on('rc_message', (text) => {
      const roomId = userRooms.get(socket.id);
      if (roomId) {
        // Broadcast to room
        socket.to(roomId).emit('rc_message', {
          senderId: socket.id,
          text,
          timestamp: Date.now()
        });
      }
    });

    // 4. User skips the current match
    socket.on('rc_skip', () => {
      const roomId = userRooms.get(socket.id);
      cleanupUser(socket);
      // Immediately try to find a new match
      socket.emit('rc_skipped'); // Ack
    });

    // 5. Disconnect handling
    socket.on('disconnect', () => {
      cleanupUser(socket);
    });

    // Helper: clean up user from queue or active rooms
    function cleanupUser(sock) {
      // Remove from queue
      waitingQueue = waitingQueue.filter(s => s.id !== sock.id);

      // Remove from active room
      const roomId = userRooms.get(sock.id);
      if (roomId) {
        sock.leave(roomId);
        userRooms.delete(sock.id);

        const peers = activeRooms.get(roomId);
        if (peers) {
          const partnerId = peers.find(id => id !== sock.id);
          if (partnerId) {
            // Notify partner that peer left
            io.to(partnerId).emit('rc_peer_left');
            // Remove partner from room mapping
            userRooms.delete(partnerId);
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) partnerSocket.leave(roomId);
          }
          activeRooms.delete(roomId);
          console.log(`[RandomChat] Destroyed room ${roomId}`);
        }
      }
    }
  });
};
