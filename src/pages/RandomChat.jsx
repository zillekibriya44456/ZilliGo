import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, SkipForward, PhoneOff, Send, MessageCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { api } from '../utils/api';
import './RandomChat.css';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function RandomChat() {
  const [appState, setAppState] = useState('idle'); // idle, loading, matching, matched
  
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
  
  // State for polling
  const [roomId, setRoomId] = useState(null);
  const [myRole, setMyRole] = useState(null); // 'initiator' or 'responder'
  const pollingInterval = useRef(null);
  
  const appStateRef = useRef('idle');
  const messagesRef = useRef([]);
  
  const lastProcessedIceCount = useRef({ local: 0, remote: 0 });

  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      cleanupPeerConnection();
      stopAllMedia();
      if (roomId) api.rcLeaveRoom(roomId).catch(()=>{});
    };
  }, [roomId]);

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

  const startPolling = (rId, role) => {
    stopPolling();
    lastProcessedIceCount.current = { local: 0, remote: 0 };
    
    pollingInterval.current = setInterval(async () => {
      try {
        const room = await api.rcGetRoomStatus(rId);
        
        // Check if partner skipped
        if (!room) {
           handlePartnerLeft();
           return;
        }

        if (appStateRef.current !== 'matched' && room.status === 'matched') {
          setAppState('matched');
          await initPeerConnection(role, rId);
        }

        // Process WebRTC Signaling if matched
        if (room.status === 'matched') {
           const pc = peerConnectionRef.current;
           if (!pc) return;

           // Initiator creates offer, Responder waits for offer to create answer
           if (role === 'responder' && room.offer && pc.signalingState === 'stable') {
             const offerDesc = new RTCSessionDescription(JSON.parse(room.offer));
             await pc.setRemoteDescription(offerDesc);
             const answer = await pc.createAnswer();
             await pc.setLocalDescription(answer);
             await api.rcSendSignal(rId, role, 'answer', answer);
           }

           // Initiator waits for answer
           if (role === 'initiator' && room.answer && pc.signalingState === 'have-local-offer') {
             const answerDesc = new RTCSessionDescription(JSON.parse(room.answer));
             await pc.setRemoteDescription(answerDesc);
           }

           // Process Remote ICE Candidates
           const remoteIceField = role === 'initiator' ? 'user2_ice' : 'user1_ice';
           const remoteIceStr = room[remoteIceField];
           
           if (remoteIceStr) {
             const remoteIce = JSON.parse(remoteIceStr);
             if (remoteIce.length > lastProcessedIceCount.current.remote) {
               for (let i = lastProcessedIceCount.current.remote; i < remoteIce.length; i++) {
                 if (pc.remoteDescription) {
                    await pc.addIceCandidate(new RTCIceCandidate(remoteIce[i])).catch(e=>console.warn('ICE Error',e));
                 }
               }
               lastProcessedIceCount.current.remote = remoteIce.length;
             }
           }
           
           // Fetch Messages
           if (room.messages) {
              const msgs = JSON.parse(room.messages);
              if (msgs.length > messagesRef.current.length) {
                 const newMsgs = msgs.map((m, i) => ({
                    id: m.timestamp + i,
                    sender: 'Stranger', // Will be parsed below
                    text: m.text
                 }));
                 setMessages(newMsgs);
              }
           }
        }
      } catch (err) {
        if (err.message && err.message.includes('404')) {
           handlePartnerLeft();
        }
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const initPeerConnection = async (role, rId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        api.rcSendSignal(rId, role, 'ice-candidate', event.candidate).catch(()=>{});
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    
    // Stop polling once fully connected to save resources!
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
         // Only polling for messages now, or we could slow polling down to 5s
         console.log('WebRTC P2P connected!');
      } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
         handlePartnerLeft();
      }
    };

    const stream = await initLocalStream();
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    if (role === 'initiator') {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await api.rcSendSignal(rId, role, 'offer', offer);
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
      
      const myTempId = 'user_' + Math.floor(Math.random() * 1000000);
      const res = await api.rcJoinQueue(myTempId);
      
      setRoomId(res.roomId);
      setMyRole(res.role);
      startPolling(res.roomId, res.role);
    } catch (err) {
      console.error(err);
      setAppState('idle');
    }
  };

  const handleSkip = async () => {
    stopPolling();
    cleanupPeerConnection();
    if (roomId) {
       await api.rcLeaveRoom(roomId).catch(()=>{});
    }
    setRoomId(null);
    setMessages([]);
    
    // Immediately jump back in
    startRandomChat();
  };
  
  const handlePartnerLeft = () => {
    stopPolling();
    cleanupPeerConnection();
    setRoomId(null);
    setMessages([]);
    
    // Auto find new partner
    setAppState('matching');
    startRandomChat();
  };

  const handleEndCall = () => {
    stopPolling();
    if (roomId) {
       api.rcLeaveRoom(roomId).catch(()=>{});
    }
    cleanupPeerConnection();
    stopAllMedia();
    setAppState('idle');
    setRoomId(null);
    setMessages([]);
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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !roomId) return;
    
    const msgText = chatMsg;
    setChatMsg('');
    
    // Optimistic UI
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: msgText }]);
    
    try {
      await api.rcSendMessage(roomId, `[${myRole === 'initiator' ? 'User A' : 'User B'}] ` + msgText);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter messages to hide the prefix wrapper if possible
  const displayMsgs = messages.map(m => {
     let text = m.text;
     let sender = m.sender;
     if (text.startsWith('[User A]') || text.startsWith('[User B]')) {
        const isMe = (text.startsWith('[User A]') && myRole === 'initiator') || 
                     (text.startsWith('[User B]') && myRole === 'responder');
        sender = isMe ? 'You' : 'Stranger';
        text = text.replace(/\[User [AB]\]\s/, '');
     }
     return { ...m, sender, text };
  });

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
              {displayMsgs.map(msg => (
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
