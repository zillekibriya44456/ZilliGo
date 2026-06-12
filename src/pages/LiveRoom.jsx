import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, MessageCircle, Users, Heart, Share2, Phone, Settings, MoreHorizontal, Send, Star, Globe, Clock, ShieldAlert, ShoppingBasket, Glasses } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import RatingModal from '../components/RatingModal';
import { io } from 'socket.io-client';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './LiveRoom.css';

const MOCK_CHAT = [
  { id: 1, user: 'Sarah C.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80', msg: 'This is incredible! 😍', time: '2:34 PM' },
  { id: 2, user: 'David O.', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=40&q=80', msg: 'How old is that building?', time: '2:35 PM' },
  { id: 3, user: 'Maria G.', avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=40&q=80', msg: '🔥🔥🔥 Amazing!', time: '2:36 PM' },
  { id: 4, user: 'James W.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80', msg: 'What\'s the best time to visit?', time: '2:37 PM' },
];

export default function LiveRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [viewers, setViewers] = useState(213);
  const [tipSent, setTipSent] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [showRating, setShowRating] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [vrMode, setVrMode] = useState(false);
  const [agoraActive, setAgoraActive] = useState(false);

  useEffect(() => {
    // Fetch live stream from database
    api.getPublicLiveStream(id)
      .then(data => {
        setStreamData(data);
        if (data.viewerCount) setViewers(data.viewerCount);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001');
    setSocket(newSocket);
    
    newSocket.emit('join_room', id);

    newSocket.on('receive_message', (data) => {
      setChatMessages(prev => [...prev, {
        id: data.id || Date.now() + Math.random(),
        user: data.senderName,
        avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.senderName)}&background=00F5D4&color=030712`,
        msg: data.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    });

    const interval = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random() * 3 - 1));
    }, 3000);

    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
  }, [id]);

  // Agora Integration
  useEffect(() => {
    const appId = import.meta.env.VITE_AGORA_APP_ID;
    if (!appId || appId === 'your_agora_app_id_here' || !guide) return;

    setAgoraActive(true);
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    let localTracks = [];

    const initAgora = async () => {
      try {
        const isGuide = user?.id === guide.id;
        
        if (isGuide) {
          // Broadcaster
          await client.setClientRole('host');
          await client.join(appId, id, null, user?.id || null);
          localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
          localTracks[1].play('agora-video-container');
          await client.publish(localTracks);
        } else {
          // Audience
          await client.setClientRole('audience');
          await client.join(appId, id, null, user?.id || null);
          
          client.on('user-published', async (agoraUser, mediaType) => {
            await client.subscribe(agoraUser, mediaType);
            if (mediaType === 'video') {
              agoraUser.videoTrack.play('agora-video-container');
            }
            if (mediaType === 'audio') {
              agoraUser.audioTrack.play();
            }
          });
        }
      } catch (err) {
        console.error('Agora Error:', err);
        setAgoraActive(false);
      }
    };

    initAgora();

    return () => {
      localTracks.forEach(track => {
        track.stop();
        track.close();
      });
      client.leave();
    };
  }, [id, guide, user]);

  const tour = streamData ? {
    id: streamData.id,
    title: streamData.title,
    location: streamData.location,
    language: streamData.language || 'English',
    duration: streamData.durationMinutes || 60,
    coverImage: streamData.coverImage || streamData.cover_image,
    rating: 4.9,
    tags: ['Live', 'Culture', 'Interactive'],
    description: `Experience ${streamData.title} live from ${streamData.location}. Interact directly with your guide and viewers from around the world.`
  } : null;

  const guide = streamData ? {
    id: streamData.guideId || streamData.guide_id,
    name: streamData.guideName || streamData.guide_name,
    avatar: streamData.guideAvatar || streamData.guide_avatar || `https://i.pravatar.cc/150?u=${streamData.guideId}`,
    rating: 4.9,
    location: streamData.guideLocation || streamData.guide_location
  } : null;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !socket) return;
    
    const senderName = user ? user.name : 'Traveler';
    const senderAvatar = user ? user.avatar : `https://ui-avatars.com/api/?name=Traveler&background=00F5D4&color=030712`;
    
    socket.emit('send_message', {
      roomId: id,
      sender: user ? user.id : null,
      senderName,
      avatar: senderAvatar,
      text: chatMsg,
      isSystem: false
    });

    setChatMsg('');
  };

  const sendTip = (amount) => {
    setTipSent(true);
    setTimeout(() => setTipSent(false), 3000);
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!tour || !guide) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>📡</div>
          <h2>Live Stream not available</h2>
          <p style={{ color: 'var(--text-muted)' }}>This session may have ended or does not exist.</p>
          <Link to="/explore" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Live Tours</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="live-room">
      {/* Video Area */}
      <div className="live-video-area">
        <img src={tour.coverImage} alt={tour.title} className="live-video-bg" />
        <div className="live-video-overlay" />

        {/* Top Bar */}
        <div className="live-top-bar">
          <div className="live-top-left">
            <span className="badge badge-live">🔴 LIVE</span>
            <div className="live-viewers">
              <Users size={14} /> {viewers.toLocaleString()} watching
            </div>
          </div>
          <div className="live-top-center">
            <h3 className="live-title">{tour.title}</h3>
            <div className="live-location"><Globe size={13} /> {tour.location}</div>
          </div>
          <div className="live-top-right">
            <button className="live-icon-btn"><Share2 size={18} /></button>
            <button className="live-icon-btn"><Settings size={18} /></button>
          </div>
        </div>

        {/* Guide Info */}
        <div className="live-guide-info">
          <img src={guide.avatar} alt={guide.name} className="live-guide-avatar" />
          <div>
            <div className="live-guide-name">{guide.name}</div>
            <div className="live-guide-rating"><Star size={11} fill="var(--accent-amber)" stroke="none" /> {guide.rating} · Your Guide</div>
          </div>
        </div>

        {/* Simulated Video Placeholder */}
        <div className="live-video-placeholder" id="agora-video-container" style={{ display: vrMode ? 'flex' : 'block', background: vrMode ? '#000' : '' }}>
          {vrMode ? (
            <>
              <div style={{ flex: 1, borderRight: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <Glasses size={48} color="var(--accent-teal)" style={{ opacity: 0.5, zIndex: 1 }} />
                <span style={{ position: 'absolute', bottom: 20, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', zIndex: 1 }}>Left Eye</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <Glasses size={48} color="var(--accent-teal)" style={{ opacity: 0.5, zIndex: 1 }} />
                <span style={{ position: 'absolute', bottom: 20, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', zIndex: 1 }}>Right Eye</span>
              </div>
            </>
          ) : (
            !agoraActive && (
              <div className="live-video-text">
                <div className="live-connecting">
                  <div className="live-connecting__pulse" />
                  <span>Live stream powered by Agora RTC</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
                  Connect Agora App ID in .env to enable real video streaming
                </p>
              </div>
            )
          )}
        </div>

        {/* Controls */}
        <div className="live-controls">
          <button className={`live-control-btn ${!micOn ? 'live-control-btn--off' : ''}`} onClick={() => setMicOn(!micOn)}>
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button className={`live-control-btn ${!videoOn ? 'live-control-btn--off' : ''}`} onClick={() => setVideoOn(!videoOn)}>
            {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button className={`live-control-btn ${!vrMode ? 'live-control-btn--off' : ''}`} onClick={() => setVrMode(!vrMode)} title="Toggle VR Headset Mode">
            <Glasses size={20} />
          </button>
          <button className="live-control-btn" style={{ background: 'rgba(245, 158, 11, 0.2)', borderColor: 'var(--accent-amber)' }} onClick={() => { setEmergencyActive(true); setTimeout(() => setEmergencyActive(false), 5000); }} title="Emergency Support">
            <ShieldAlert size={20} style={{ color: 'var(--accent-amber)' }} />
          </button>
          <button className="live-control-btn live-control-btn--end" onClick={() => setShowRating(true)}>
            <Phone size={20} />
          </button>
          <button className="live-control-btn" onClick={() => sendTip(5)}>
            <Heart size={20} style={{ color: tipSent ? 'var(--accent-rose)' : 'inherit' }} />
          </button>
        </div>

        {tipSent && (
          <div className="live-tip-toast">💰 Tip sent to {guide.name}!</div>
        )}

        {emergencyActive && (
          <div className="live-tip-toast" style={{ background: 'var(--accent-amber)', color: '#060b16' }}>
            <ShieldAlert size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> 
            Emergency Support connected. We are monitoring this session.
          </div>
        )}
      </div>

      {showRating && (
         <RatingModal 
           tour={tour} 
           guide={guide} 
           onSubmit={(rating, review) => {
             setShowRating(false);
             window.location.href = '/dashboard';
           }} 
         />
      )}

      {/* Sidebar */}
      <div className="live-sidebar">
        {/* Tabs */}
        <div className="live-tabs">
          {['chat', 'shop', 'info', 'tips'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`live-tab ${activeTab === tab ? 'active' : ''}`}>
              {tab === 'chat' ? <><MessageCircle size={14} /> Chat</> :
               tab === 'shop' ? <><ShoppingBasket size={14} /> Shop</> :
               tab === 'info' ? <><Globe size={14} /> Info</> :
               <><Heart size={14} /> Tips</>}
            </button>
          ))}
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <div className="live-chat">
              {chatMessages.map(msg => (
                <div key={msg.id} className="live-chat-msg">
                  <img src={msg.avatar} alt={msg.user} className="live-chat-avatar" />
                  <div className="live-chat-body">
                    <div className="live-chat-user">{msg.user} <span className="live-chat-time">{msg.time}</span></div>
                    <div className="live-chat-text">{msg.msg}</div>
                  </div>
                </div>
              ))}
            </div>
            <form className="live-chat-input" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Send a message..."
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                id="live-chat-input"
              />
              <button type="submit"><Send size={16} /></button>
            </form>
          </>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="live-shop">
            <div style={{ padding: '0 0 var(--space-md) 0', borderBottom: '1px solid var(--border-glass)', marginBottom: 'var(--space-md)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingBasket size={16} color="var(--accent-teal)" /> Live Commerce</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Guide purchases these items live and ships them to you.</p>
            </div>
            <div className="live-shop-items" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { id: 'item1', name: 'Handwoven Silk Scarf', price: '$45', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=150&q=80', desc: 'Local artisan craft, 100% pure silk.' },
                { id: 'item2', name: 'Vintage Brass Compass', price: '$85', image: 'https://images.unsplash.com/photo-1577083165230-07e15d862e31?w=150&q=80', desc: 'Antique market find, working condition.' },
                { id: 'item3', name: 'Spices Gift Box', price: '$25', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=150&q=80', desc: 'Assorted local spices and herbs.' }
              ].map(item => (
                <div key={item.id} className="glass-card" style={{ padding: 'var(--space-sm)', display: 'flex', gap: '12px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 6px 0' }}>{item.desc}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>{item.price}</span>
                      <button className="btn btn-primary btn-sm" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => alert('Secure Checkout Started (Simulated Stripe Flow)')}>Buy & Ship</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="live-info">
            <h4 style={{ marginBottom: 'var(--space-md)' }}>{tour.title}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{tour.description}</p>
            <div className="live-info-stats">
              <div className="live-info-stat"><Clock size={14} /> {tour.duration} min</div>
              <div className="live-info-stat"><Globe size={14} /> {tour.language}</div>
              <div className="live-info-stat"><Star size={14} fill="var(--accent-amber)" stroke="none" /> {tour.rating}</div>
              <div className="live-info-stat"><Users size={14} /> {viewers} watching</div>
            </div>
            <div style={{ marginTop: 'var(--space-md)' }}>
              {tour.tags.map(t => <span key={t} className="badge badge-teal" style={{ marginRight: '6px', marginBottom: '6px' }}>{t}</span>)}
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="live-tips">
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
              Show your appreciation for {guide.name}'s amazing tour!
            </p>
            <div className="live-tips-grid">
              {[5, 10, 20, 50].map(amount => (
                <button key={amount} className="btn btn-secondary" onClick={() => sendTip(amount)}>
                  💰 ${amount}
                </button>
              ))}
            </div>
            <div className="live-top-tippers">
              <div className="live-tippers-label">Recent Tips</div>
              {[{ name: 'Sarah', amount: 20 }, { name: 'David', amount: 10 }, { name: 'Maria', amount: 50 }].map(t => (
                <div key={t.name} className="live-tipper-item">
                  <span>❤️ {t.name} sent ${t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
