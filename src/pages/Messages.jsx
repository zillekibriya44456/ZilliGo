import { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Image, Smile, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import './Messages.css';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

const CHATS = [
  { id: 1, name: 'Arjun Sharma', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', lastMsg: 'I can definitely help with that shopping request!', time: '10:45 AM', online: true, unread: 2 },
  { id: 2, name: 'Sophia Martinez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', lastMsg: 'The cherry blossoms are peak right now.', time: 'Yesterday', online: false, unread: 0 },
  { id: 3, name: 'Liam Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', lastMsg: 'See you in the virtual room at 2 PM!', time: '2 days ago', online: true, unread: 0 },
];

const INITIAL_HISTORY = [
  { id: 1, sender: 'guide', text: 'Hello! I saw your interest in the Bangalore Tech Tour.', time: '10:30 AM' },
  { id: 2, sender: 'user', text: 'Hi Arjun! Yes, I am really excited. Can we also look at some local gadgets?', time: '10:35 AM' },
  { id: 3, sender: 'guide', text: 'I can definitely help with that shopping request!', time: '10:45 AM' },
];

export default function Messages() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io server
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    socket.on('connect', () => {
      setConnected(true);
      // Join the room for this conversation
      socket.emit('join_room', `chat_${activeChat.id}`);
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    socket.on('receive_message', (data) => {
      if (data.roomId === `chat_${activeChat.id}` && data.sender !== (user?.id || 'me')) {
        setHistory(prev => [...prev, {
          id: Date.now(),
          sender: 'guide',
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  // Rejoin room when switching chats
  useEffect(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', `chat_${activeChat.id}`);
    }
    setHistory(INITIAL_HISTORY);
  }, [activeChat.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory(prev => [...prev, newMsg]);

    // Emit via Socket.io if connected
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', {
        roomId: `chat_${activeChat.id}`,
        sender: user?.id || 'me',
        text: msg,
        senderName: user?.name || 'You',
      });
    }

    setMsg('');

    // Simulate guide reply (for demo mode when socket isn't connected to a real guide)
    if (!connected || true) {
      const replies = [
        "Great! I'll prepare a special route just for you.",
        "Sounds perfect! Should we meet at the landmark or shall I guide you virtually?",
        "Excellent choice! This time of year is perfect for that experience.",
        "I know exactly the spot you'll love. See you soon!",
        "Absolutely! I've done this tour over 200 times and have great insider tips.",
      ];
      setTimeout(() => {
        setHistory(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'guide',
          text: replies[Math.floor(Math.random() * replies.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 1200 + Math.random() * 800);
    }
  };

  const filteredChats = CHATS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper messages-page">
      <div className="container messages-container glass-card">
        {/* Sidebar */}
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Messages</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: connected ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                {connected ? 'Live' : 'Offline'}
              </div>
            </div>
            <div className="search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="chat-list">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${activeChat.id === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="chat-avatar">
                  <img src={chat.avatar} alt={chat.name} />
                  {chat.online && <span className="online-indicator" />}
                </div>
                <div className="chat-info">
                  <div className="chat-top">
                    <span className="chat-name">{chat.name}</span>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <div className="chat-bottom">
                    <span className="chat-preview">{chat.lastMsg}</span>
                    {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-user">
              <img src={activeChat.avatar} alt={activeChat.name} />
              <div>
                <h4>{activeChat.name}</h4>
                <span className="status">{activeChat.online ? '🟢 Online' : '⚫ Offline'}</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="icon-btn" title="Voice Call (Coming Soon)" onClick={() => alert('Voice calls coming soon! Use the Live Room for video.')}>
                <Phone size={20} />
              </button>
              <button className="icon-btn" title="Start Live Tour" onClick={() => window.location.href = '/live/1'}>
                <Video size={20} />
              </button>
              <button className="icon-btn" title="More Options">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {history.map(m => (
              <div key={m.id} className={`message-wrap ${m.sender === 'user' ? 'sent' : 'received'}`}>
                {m.sender === 'guide' && (
                  <img src={activeChat.avatar} alt={activeChat.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div className="message-bubble">
                  {m.text}
                  <span className="message-time">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <div className="footer-actions">
              <button className="icon-btn" title="Attach image (coming soon)" onClick={() => alert('Image sharing coming in the next update!')}>
                <Image size={20} />
              </button>
              <button className="icon-btn" title="Emoji">
                <Smile size={20} />
              </button>
            </div>
            <form className="msg-input-wrap" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type your message..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!msg.trim()}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
