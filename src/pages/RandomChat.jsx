import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Video, VideoOff, Mic, MicOff, SkipForward, PhoneOff, Send, MessageCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import './RandomChat.css';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function RandomChat() {
  const [appState, setAppState] = useState('idle'); // idle, loading, matching, matched
  const [socket, setSocket] = useState(null);
  
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  
  const [messages, setMessages] = useState([]);
  const [chatMsg, setChatMsg] = useState('');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatBottomRef = useRef(null);
  
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Initialize socket once
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001');
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  // Setup WebRTC and Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('rc_match_found', async ({ roomId, role }) => {
      console.log('Match found! Role:', role);
      setAppState('matched');
      setMessages([]);
      
      try {
        await initPeerConnection(role);
      } catch (err) {
        console.error('Failed to init PC', err);
        handleSkip(); // Try matching someone else if hardware fails
      }
    });

    socket.on('rc_signal', async (data) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        if (data.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('rc_signal', { type: 'answer', answer });
        } else if (data.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === 'ice-candidate') {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error('Error handling signal:', err);
      }
    });

    socket.on('rc_message', (data) => {
      setMessages(prev => [...prev, { id: Math.random(), sender: 'Stranger', text: data.text }]);
    });

    socket.on('rc_peer_left', () => {
      cleanupPeerConnection();
      setAppState('matching');
      socket.emit('rc_find_match'); // Automatically find next
    });

    socket.on('rc_skipped', () => {
      cleanupPeerConnection();
      setAppState('matching');
      socket.emit('rc_find_match');
    });

    return () => {
      socket.off('rc_match_found');
      socket.off('rc_signal');
      socket.off('rc_message');
      socket.off('rc_peer_left');
      socket.off('rc_skipped');
    };
  }, [socket]);

  const initLocalStream = async () => {
    if (localStreamRef.current) return localStreamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      alert('Camera/Microphone permission denied.');
      throw err;
    }
  };

  const initPeerConnection = async (role) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('rc_signal', { type: 'ice-candidate', candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const stream = await initLocalStream();
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    if (role === 'initiator') {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('rc_signal', { type: 'offer', offer });
    }
  };

  const cleanupPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const stopAllMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };

  const startRandomChat = async () => {
    setAppState('loading');
    try {
      await initLocalStream();
      setAppState('matching');
      socket.emit('rc_find_match');
    } catch (err) {
      setAppState('idle');
    }
  };

  const handleSkip = () => {
    socket.emit('rc_skip');
  };

  const handleEndCall = () => {
    socket.emit('rc_skip'); // Triggers disconnect from room on server
    cleanupPeerConnection();
    stopAllMedia();
    setAppState('idle');
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoOn;
        setVideoOn(!videoOn);
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    
    setMessages(prev => [...prev, { id: Math.random(), sender: 'You', text: chatMsg }]);
    socket.emit('rc_message', chatMsg);
    setChatMsg('');
  };

  return (
    <div className="random-chat-container">
      {appState === 'idle' && (
        <div className="rc-idle-screen animate-fade-in">
          <div className="rc-idle-content glass-card">
            <div className="rc-icon-pulse">
              <Video size={48} color="var(--accent-teal)" />
            </div>
            <h2>ZilliGO Random Chat</h2>
            <p>Instantly connect with people worldwide. 100% free. 100% anonymous.</p>
            
            <div className="rc-rules">
              <div className="rc-rule"><ShieldAlert size={16}/> No registration required</div>
              <div className="rc-rule"><ShieldAlert size={16}/> No chats or videos are saved</div>
              <div className="rc-rule"><ShieldAlert size={16}/> Be respectful. Report abuse immediately.</div>
            </div>

            <button className="btn btn-primary btn-lg rc-start-btn" onClick={startRandomChat}>
              Start Chatting <Video size={18} />
            </button>
          </div>
        </div>
      )}

      {(appState === 'loading' || appState === 'matching') && (
        <div className="rc-matching-screen">
          <video ref={localVideoRef} autoPlay playsInline muted className="rc-bg-video-blur" />
          <div className="rc-matching-overlay">
            <div className="spinner rc-spinner" />
            <h2>{appState === 'loading' ? 'Accessing Camera...' : 'Finding a stranger...'}</h2>
            <button className="btn btn-secondary" onClick={handleEndCall} style={{ marginTop: '2rem' }}>Cancel</button>
          </div>
        </div>
      )}

      {appState === 'matched' && (
        <div className="rc-active-call">
          <div className="rc-video-grid">
            <div className="rc-video-wrapper rc-remote-video">
              <video ref={remoteVideoRef} autoPlay playsInline className="rc-video-element" />
              <div className="rc-video-label">Stranger</div>
            </div>
            <div className="rc-video-wrapper rc-local-video">
              <video ref={localVideoRef} autoPlay playsInline muted className="rc-video-element" />
              <div className="rc-video-label">You</div>
            </div>
          </div>

          <div className={`rc-chat-overlay ${showChat ? 'visible' : ''}`}>
            <div className="rc-chat-messages">
              {messages.map(msg => (
                <div key={msg.id} className={`rc-msg ${msg.sender === 'You' ? 'rc-msg-you' : 'rc-msg-stranger'}`}>
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
            <form className="rc-chat-input" onSubmit={sendMessage}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={chatMsg} 
                onChange={(e) => setChatMsg(e.target.value)} 
              />
              <button type="submit"><Send size={16} /></button>
            </form>
          </div>

          <div className="rc-controls-bar">
            <button className={`rc-control-btn ${!micOn ? 'off' : ''}`} onClick={toggleMute} title="Toggle Audio">
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button className={`rc-control-btn ${!videoOn ? 'off' : ''}`} onClick={toggleVideo} title="Toggle Video">
              {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button className={`rc-control-btn ${!showChat ? 'off' : ''}`} onClick={() => setShowChat(!showChat)} title="Toggle Chat">
              <MessageCircle size={20} />
            </button>
            <button className="rc-control-btn skip-btn" onClick={handleSkip} title="Next Person">
              <SkipForward size={20} /> Next
            </button>
            <button className="rc-control-btn report-btn" title="Report & Skip" onClick={() => { alert('User reported. Finding next match...'); handleSkip(); }}>
              <AlertTriangle size={20} />
            </button>
            <button className="rc-control-btn end-btn" onClick={handleEndCall} title="End Call">
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
