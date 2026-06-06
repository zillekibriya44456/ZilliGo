import { useState } from 'react';
import { Users, Video, MessageCircle, Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';
import './ExchangeRooms.css';

const ACTIVE_ROOMS = [
  { id: 'room_1', title: 'India 🇮🇳 Meets Japan 🇯🇵', topic: 'Food & Culture', participants: 124, language: 'English / EN-JP Translation', host: 'Yuki & Priya', live: true },
  { id: 'room_2', title: 'France 🇫🇷 Meets Brazil 🇧🇷', topic: 'Art & Music', participants: 89, language: 'French / Portuguese', host: 'Carlos', live: true },
  { id: 'room_3', title: 'Korean Language Exchange 🇰🇷', topic: 'Beginner Korean Practice', participants: 256, language: 'Korean / English', host: 'Min-Jun', live: true },
  { id: 'room_4', title: 'Global Tech Nomads 🌍', topic: 'Working while traveling', participants: 42, language: 'English', host: 'Sarah', live: false, scheduled: 'Starts in 2 hrs' },
];

export default function ExchangeRooms() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatMsg, setChatMsg] = useState('');
  const [roomChat, setRoomChat] = useState([
    { user: 'Yuki 🇯🇵', text: 'Welcome everyone! So excited to talk about street food today.' },
    { user: 'Priya 🇮🇳', text: 'Yes! Im going to show you how we make Dosa.' }
  ]);

  const handleJoin = (room) => {
    setActiveRoom(room);
  };

  const handleLeave = () => {
    setActiveRoom(null);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    setRoomChat([...roomChat, { user: 'You', text: chatMsg }]);
    setChatMsg('');
  };

  if (activeRoom) {
    return (
      <div className="live-exchange-room">
        {/* Top Navigation */}
        <div className="le-header">
          <div className="le-header-left">
            <h2 className="le-title">{activeRoom.title}</h2>
            <div className="le-topic-badge">{activeRoom.topic}</div>
            <div className="le-live-badge"><span className="pulse-dot"></span> LIVE</div>
          </div>
          <div className="le-header-right">
            <Users size={16} /> {activeRoom.participants} watching
          </div>
        </div>

        <div className="le-main">
          {/* Video Grid Area */}
          <div className="le-video-area">
            <div className="le-video-grid">
              {/* Host 1 */}
              <div className="le-video-stream">
                <img src="https://i.pravatar.cc/300?u=yuki" alt="Yuki" className="le-video-placeholder" />
                <div className="le-stream-name">Yuki 🇯🇵 (Host)</div>
                {/* Simulated AI Translation Subtitles */}
                <div className="le-ai-captions">
                  <span style={{color: '#00d4aa', fontSize: '12px'}}>✨</span> <span>AI: "In Tokyo, takoyaki is a must-try..."</span>
                </div>
              </div>
              
              {/* Host 2 */}
              <div className="le-video-stream">
                <img src="https://i.pravatar.cc/300?u=priya" alt="Priya" className="le-video-placeholder" />
                <div className="le-stream-name">Priya 🇮🇳 (Host)</div>
              </div>
              
              {/* User Self View */}
              {camOn && (
                <div className="le-video-stream self-view">
                  <div className="le-camera-active-placeholder">
                    <Video size={40} opacity={0.5} />
                    <span>Your Camera is On</span>
                  </div>
                  <div className="le-stream-name">You</div>
                </div>
              )}
            </div>

            {/* WebRTC Controls */}
            <div className="le-controls">
              <button className={`le-control-btn ${!micOn ? 'muted' : ''}`} onClick={() => setMicOn(!micOn)}>
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button className={`le-control-btn ${!camOn ? 'muted' : ''}`} onClick={() => setCamOn(!camOn)}>
                {camOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
              </button>
              <button className="le-control-btn le-leave-btn" onClick={handleLeave}>
                Leave
              </button>
            </div>
          </div>

          {/* Sidebar Chat */}
          <div className="le-sidebar">
            <div className="le-sidebar-header">
              <h3>Live Chat & Translation</h3>
            </div>
            <div className="le-chat-messages">
              {roomChat.map((msg, idx) => (
                <div key={idx} className={`le-msg ${msg.user === 'You' ? 'le-msg-self' : ''}`}>
                  <span className="le-msg-user">{msg.user}</span>
                  <p className="le-msg-text">{msg.text}</p>
                </div>
              ))}
            </div>
            <form className="le-chat-input" onSubmit={handleSendChat}>
              <input 
                type="text" 
                placeholder="Type a message (Auto-translates)..." 
                value={chatMsg} 
                onChange={e => setChatMsg(e.target.value)} 
              />
              <button type="submit"><MessageCircle size={18} /></button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exchange-directory-page">
      <div className="ed-header">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="ed-badge">🌍 Global Cultural Exchange</div>
          <h1 className="ed-title">Connect Across <span className="gradient-text">Borders.</span></h1>
          <p className="ed-subtitle">Join live video rooms to practice languages, share culture, and meet global friends in real-time with AI-powered translation.</p>
        </div>
      </div>

      <div className="container ed-content">
        <div className="ed-section-title">
          <h2>Happening Right Now</h2>
          <span className="ed-live-count"><span className="pulse-dot"></span> 42 Live Rooms</span>
        </div>

        <div className="ed-grid">
          {ACTIVE_ROOMS.map(room => (
            <div key={room.id} className="ed-room-card glass-card">
              <div className="ed-room-top">
                {room.live ? (
                  <span className="ed-tag live"><span className="pulse-dot"></span> LIVE NOW</span>
                ) : (
                  <span className="ed-tag scheduled">{room.scheduled}</span>
                )}
                <span className="ed-tag participants"><Users size={12} /> {room.participants}</span>
              </div>
              
              <h3 className="ed-room-title">{room.title}</h3>
              
              <div className="ed-room-details">
                <div className="ed-detail-row">
                  <span className="text-muted">Topic:</span> <span className="fw-bold">{room.topic}</span>
                </div>
                <div className="ed-detail-row">
                  <span className="text-muted">Host:</span> <span>{room.host}</span>
                </div>
                <div className="ed-detail-row">
                  <span className="text-muted">Lang:</span> <span className="text-teal">{room.language}</span>
                </div>
              </div>

              <div className="ed-room-footer">
                <div className="ed-avatars">
                  <img src={`https://i.pravatar.cc/150?u=${room.id}_1`} alt="P" className="ed-avatar" />
                  <img src={`https://i.pravatar.cc/150?u=${room.id}_2`} alt="P" className="ed-avatar" />
                  <img src={`https://i.pravatar.cc/150?u=${room.id}_3`} alt="P" className="ed-avatar" />
                  <div className="ed-avatar-more">+{room.participants - 3}</div>
                </div>
                <button 
                  className={`btn ${room.live ? 'btn-primary' : 'btn-secondary'}`} 
                  onClick={() => room.live && handleJoin(room)}
                  disabled={!room.live}
                >
                  <Video size={16} /> {room.live ? 'Join Room' : 'Remind Me'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
