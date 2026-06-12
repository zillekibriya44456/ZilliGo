import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, MessageCircle, Users, Heart, Share2, Phone, Settings, Send, Star, Globe, Clock, ShieldAlert, ShoppingBasket, Glasses, PlayCircle, HelpCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import AgoraRTC from 'agora-rtc-sdk-ng';
import RatingModal from '../components/RatingModal';
import './LiveRoom.css';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

export default function LiveRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [viewers, setViewers] = useState(0);
  const [tipSent, setTipSent] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [showRating, setShowRating] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [vrMode, setVrMode] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const [agoraClient, setAgoraClient] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [agoraStatus, setAgoraStatus] = useState('Initializing stream...');

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.getPublicLiveStream(id).catch(() => null),
      api.getLiveChat(id).catch(() => []),
      api.getLiveQuestions(id).catch(() => [])
    ]).then(([data, chatHistory, questionsHistory]) => {
      if (data) { setStreamData(data); if (data.viewerCount) setViewers(data.viewerCount); }
      if (Array.isArray(chatHistory)) {
        setChatMessages(chatHistory.map(c => ({
          id: c.id, user: c.senderName, msg: c.text, avatar: c.avatar || `https://ui-avatars.com/api/?name=${c.senderName}`,
          isSystem: c.isSystem, time: new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        })));
      }
      if (Array.isArray(questionsHistory)) setQuestions(questionsHistory);
      setLoading(false);
    }).catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  const tour = React.useMemo(() => streamData ? {
    id: streamData.id, title: streamData.title, location: streamData.location, language: streamData.language || 'English',
    duration: streamData.durationMinutes || streamData.duration_minutes || 60, coverImage: streamData.coverImage || streamData.cover_image,
    rating: 4.9, tags: ['Live', 'Culture', 'Interactive'],
    description: `Experience ${streamData.title} live from ${streamData.location}. Interact directly with your guide.`
  } : null, [streamData]);

  const guide = React.useMemo(() => streamData ? {
    id: streamData.guideId || streamData.guide_id, name: streamData.guideName || streamData.guide_name,
    avatar: streamData.guideAvatar || streamData.guide_avatar || `https://i.pravatar.cc/150?u=${streamData.guideId}`,
    rating: 4.9, location: streamData.guideLocation || streamData.guide_location
  } : null, [streamData]);

  const isGuide = user && guide && user.id === guide.id;

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], timeout: 5000 });
    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join_room', `live_${id}`);
      socket.emit('send_message', { roomId: `live_${id}`, sender: '__system__', senderName: user?.name || 'A viewer', text: `${user?.name || 'A viewer'} joined the tour 👋`, isSystem: true });
      setViewers(v => v + 1);
    });
    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('connect_error', () => setSocketConnected(false));
    socket.on('receive_message', (data) => {
      if (data.roomId === `live_${id}`) {
        setChatMessages(prev => [...prev, { id: Date.now() + Math.random(), user: data.senderName || 'Viewer', avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.senderName || 'V')}`, msg: data.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystem: data.isSystem }]);
      }
    });
    socket.on('new_question', (q) => { if (q.roomId === `live_${id}`) setQuestions(prev => [...prev, q]); });
    socket.on('tour_ended', () => { alert('The guide has ended this tour.'); setShowRating(true); });
    socketRef.current = socket;
    return () => { socket.disconnect(); setViewers(v => Math.max(0, v - 1)); };
  }, [id, user?.name]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  useEffect(() => {
    if (loading || !tour || !guide) return;
    let client = null; let localVideo = null; let localAudio = null;
    const initAgora = async () => {
      try {
        setAgoraStatus('Authenticating...');
        const role = isGuide ? 'publisher' : 'subscriber';
        const tokenData = await api.getAgoraToken(`live_${id}`, role);
        
        if (!tokenData || !tokenData.token) {
          setAgoraStatus('No Agora Credentials Found. Fallback required.');
          return;
        }

        if (tokenData.appId === 'dummy_app_id') {
          setAgoraStatus('Simulation Mode (Bypassing WebRTC)');
          if (isGuide) {
            try {
              const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
              localAudio = audioTrack; localVideo = videoTrack; setLocalTracks([audioTrack, videoTrack]);
              if (videoContainerRef.current) { videoContainerRef.current.innerHTML = ''; videoTrack.play(videoContainerRef.current); }
              setAgoraStatus('Live (Camera Active)');
            } catch(e) { setAgoraStatus('Simulation Mode (No Camera)'); }
          } else { setAgoraStatus('Simulation Mode (Live Stream Connected)'); }
          return;
        }

        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        setAgoraClient(client);
        setAgoraStatus('Connecting to Live Network...');
        await client.join(tokenData.appId, `live_${id}`, tokenData.token, tokenData.uid);

        if (isGuide) {
          setAgoraStatus('Starting Camera...');
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          localAudio = audioTrack; localVideo = videoTrack; setLocalTracks([audioTrack, videoTrack]);
          if (videoContainerRef.current) { videoContainerRef.current.innerHTML = ''; videoTrack.play(videoContainerRef.current); }
          await client.publish([audioTrack, videoTrack]);
          setAgoraStatus('Live');
        } else {
          setAgoraStatus('Waiting for Guide...');
          client.on('user-published', async (remoteUser, mediaType) => {
            await client.subscribe(remoteUser, mediaType);
            setAgoraStatus('Live');
            if (mediaType === 'video' && videoContainerRef.current) { videoContainerRef.current.innerHTML = ''; remoteUser.videoTrack.play(videoContainerRef.current); }
            if (mediaType === 'audio') { remoteUser.audioTrack.play(); }
          });
          client.on('user-unpublished', (remoteUser, mediaType) => { if (mediaType === 'video') setAgoraStatus('Guide paused video.'); });
        }
      } catch (err) { setAgoraStatus('Failed to connect to Agora WebRTC.'); }
    };
    initAgora();
    return () => { if (localVideo) { localVideo.stop(); localVideo.close(); } if (localAudio) { localAudio.stop(); localAudio.close(); } if (client) { client.leave(); } };
  }, [loading, tour, guide, isGuide, id]);

  const toggleMic = async () => { if (isGuide && localTracks[0]) { await localTracks[0].setMuted(micOn); setMicOn(!micOn); } };
  const toggleVideo = async () => { if (isGuide && localTracks[1]) { await localTracks[1].setMuted(videoOn); setVideoOn(!videoOn); } };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    const newMsg = { id: Date.now(), user: user?.name || 'You', avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Me')}`, msg: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    if (socketRef.current?.connected) { socketRef.current.emit('send_message', { roomId: `live_${id}`, sender: user?.id || 'anonymous', senderName: user?.name || 'You', avatar: user?.avatar, text: chatMsg }); }
    setChatMsg('');
  };

  const sendQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    if (socketRef.current?.connected) { socketRef.current.emit('ask_question', { roomId: `live_${id}`, askerId: user?.id, askerName: user?.name || 'Viewer', question: questionText }); }
    setQuestionText('');
  };

  const endTour = async () => {
    if (window.confirm("Are you sure you want to end this live tour?")) {
      if (socketRef.current?.connected) socketRef.current.emit('tour_ended', { roomId: `live_${id}` });
      setShowRating(true);
    }
  };

  const sendTip = (amount) => { setTipSent(true); setTimeout(() => setTipSent(false), 3000); };

  if (loading) {
    return (
      <div className="lr-loading">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="spinner-lg" />
        <p>Connecting to Live Server...</p>
      </div>
    );
  }

  if (!tour || !guide) {
    return (
      <div className="lr-empty">
        <span className="lr-empty-icon">📡</span>
        <h2>Stream Offline</h2>
        <p>This session may have ended or does not exist.</p>
        <Link to="/explore" className="btn-liquid">Browse Live Tours</Link>
      </div>
    );
  }

  return (
    <div className="live-room-liquid">
      <div className="lr-main">
        {/* Cinematic Video Area */}
        <div className={`lr-video-viewport ${vrMode ? 'vr-mode-active' : ''}`}>
          {/* Fallback BG */}
          <div className="lr-video-bg" style={{ backgroundImage: `url(${tour.coverImage})` }} />
          
          {/* Agora Render Surface */}
          <div ref={videoContainerRef} className="lr-video-surface" />

          {/* VR Overlay Splitter */}
          {vrMode && (
            <div className="lr-vr-overlay">
              <div className="vr-eye vr-left"><Glasses size={48} className="vr-icon" /><span>Left Eye Matrix</span></div>
              <div className="vr-divider" />
              <div className="vr-eye vr-right"><Glasses size={48} className="vr-icon" /><span>Right Eye Matrix</span></div>
            </div>
          )}

          {/* Glowing Vignette Border */}
          <div className="lr-video-vignette" />

          {/* Premium HUD (Heads Up Display) */}
          <div className="lr-hud-top">
            <div className="hud-badge-live"><span className="live-dot" /> LIVE</div>
            <div className="hud-viewers glass-panel"><Users size={14} className="text-teal" /> {viewers.toLocaleString()}</div>
            <div className="hud-status glass-panel">
               <span className={`status-dot ${socketConnected ? 'on' : 'off'}`} /> 
               {agoraStatus}
            </div>
          </div>

          <div className="lr-hud-bottom">
            <div className="hud-guide-glass glass-panel">
              <img src={guide.avatar} alt={guide.name} className="hud-guide-img" />
              <div className="hud-guide-info">
                <span className="hud-guide-name">{guide.name}</span>
                <span className="hud-guide-title">{tour.title} <Globe size={10} style={{display:'inline', marginLeft:4}} /> {tour.location}</span>
              </div>
            </div>

            <div className="hud-controls glass-panel">
              {isGuide && (
                <>
                  <button className={`hud-btn ${!micOn ? 'danger' : ''}`} onClick={toggleMic}>{micOn ? <Mic size={18} /> : <MicOff size={18} />}</button>
                  <button className={`hud-btn ${!videoOn ? 'danger' : ''}`} onClick={toggleVideo}>{videoOn ? <Video size={18} /> : <VideoOff size={18} />}</button>
                </>
              )}
              <button className={`hud-btn ${vrMode ? 'active-teal' : ''}`} onClick={() => setVrMode(!vrMode)}><Glasses size={18} /></button>
              <button className="hud-btn warning" onClick={() => { setEmergencyActive(true); setTimeout(() => setEmergencyActive(false), 5000); }}><ShieldAlert size={18} /></button>
              {!isGuide && (
                <button className="hud-btn danger" onClick={() => setShowRating(true)}><Phone size={18} /></button>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {tipSent && (
              <motion.div initial={{opacity: 0, y: 50, scale: 0.8}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: -50}} className="hud-toast toast-rose">
                💖 Tip sent to {guide.name}!
              </motion.div>
            )}
            {emergencyActive && (
              <motion.div initial={{opacity: 0, y: 50, scale: 0.8}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: -50}} className="hud-toast toast-amber">
                <ShieldAlert size={16} /> Support connected. Monitoring session.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Glass Sidebar Panel */}
      <div className="lr-sidebar glass-panel">
        <div className="lr-sidebar-nav">
          <button className={`lr-nav-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}><MessageCircle size={16}/> Chat</button>
          <button className={`lr-nav-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}><HelpCircle size={16}/> Q&A</button>
          <button className={`lr-nav-btn ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}><ShoppingBasket size={16}/> Shop</button>
        </div>

        <div className="lr-sidebar-body">
          {activeTab === 'chat' && (
            <div className="lr-chat-container">
              <div className="lr-chat-feed">
                {chatMessages.length === 0 && <div className="lr-empty-state">Say hello to the guide!</div>}
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-bubble ${msg.isSystem ? 'system-bubble' : ''}`}>
                    {!msg.isSystem && <img src={msg.avatar} alt="avatar" className="chat-avatar" />}
                    <div className="chat-content">
                      <span className="chat-user">{msg.user} <span className="chat-time">{msg.time}</span></span>
                      <p className="chat-text">{msg.msg}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form className="lr-chat-input-area" onSubmit={sendMessage}>
                <input type="text" placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} disabled={!socketConnected} className="chat-input" />
                <button type="submit" disabled={!chatMsg.trim() || !socketConnected} className="chat-send"><Send size={16} /></button>
              </form>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="lr-chat-container">
              <div className="lr-chat-feed">
                {questions.length === 0 && <div className="lr-empty-state">Ask the guide a question!</div>}
                {questions.map(q => (
                  <div key={q.id} className="chat-bubble qa-bubble">
                    <div className="chat-content">
                      <span className="chat-user text-teal">{q.askerName || q.asker_name}</span>
                      <p className="chat-text">{q.question}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form className="lr-chat-input-area" onSubmit={sendQuestion}>
                <input type="text" placeholder="Ask a question..." value={questionText} onChange={e => setQuestionText(e.target.value)} disabled={!socketConnected} className="chat-input" />
                <button type="submit" disabled={!questionText.trim() || !socketConnected} className="chat-send"><Send size={16} /></button>
              </form>
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="lr-shop-container">
              <div className="lr-shop-header">
                <ShoppingBasket size={18} className="text-teal" /> <span>Live Commerce</span>
              </div>
              <div className="lr-shop-list">
                {[
                  { id: '1', name: 'Silk Scarf', price: '$45', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=150&q=80' },
                  { id: '2', name: 'Vintage Compass', price: '$85', image: 'https://images.unsplash.com/photo-1577083165230-07e15d862e31?w=150&q=80' }
                ].map(item => (
                  <div key={item.id} className="shop-item glass-panel">
                    <img src={item.image} alt={item.name} className="shop-item-img" />
                    <div className="shop-item-info">
                      <span className="shop-item-name">{item.name}</span>
                      <span className="shop-item-price text-teal">{item.price}</span>
                      <button className="btn-liquid btn-sm" onClick={() => alert('Checkout initiated!')}>Buy & Ship</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showRating && (
         <RatingModal
           tour={tour}
           guide={guide}
           onSubmit={async (rating, review) => {
             try {
               await api.submitReview({ tourId: tour.id, rating, comment: review });
               await api.addPassportStamp(tour.id).catch(() => {});
             } catch (err) { console.error(err); } finally {
               setShowRating(false);
               window.location.href = '/dashboard';
             }
           }}
         />
      )}
    </div>
  );
}
