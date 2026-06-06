import { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Image, Smile, Wifi, WifiOff, Globe2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import './Messages.css';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

const CHATS = [
  { id: 1, name: 'Yuki Tanaka', country: 'Japan', flag: '🇯🇵', nativeLang: 'Japanese', avatar: 'https://i.pravatar.cc/150?u=yuki', lastMsg: 'I can definitely show you the best sushi spots in Tokyo!', time: '10:45 AM', online: true, unread: 2 },
  { id: 2, name: 'Mateo Rossi', country: 'Italy', flag: '🇮🇹', nativeLang: 'Italian', avatar: 'https://i.pravatar.cc/150?u=mateo', lastMsg: 'The colosseum is beautiful at night.', time: 'Yesterday', online: false, unread: 0 },
  { id: 3, name: 'Priya Sharma', country: 'India', flag: '🇮🇳', nativeLang: 'Hindi', avatar: 'https://i.pravatar.cc/150?u=priya', lastMsg: 'See you in the cultural exchange room at 2 PM!', time: '2 days ago', online: true, unread: 0 },
];

const INITIAL_HISTORY = [
  { id: 1, sender: 'friend', text: 'Konnichiwa! I saw we have a 96% match. I love technology too!', original: 'こんにちは！96％のマッチングですね。私もテクノロジーが大好きです！', time: '10:30 AM' },
  { id: 2, sender: 'user', text: 'Hi Yuki! Yes, I am really excited. Do you know any good tech markets in Tokyo?', original: '', time: '10:35 AM' },
  { id: 3, sender: 'friend', text: 'Akihabara is the best place! I can show you around when you visit.', original: '秋葉原が一番いいですよ！来た時に案内しますよ。', time: '10:45 AM' },
];

export default function Messages() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiTranslationOn, setAiTranslationOn] = useState(true);
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
      socket.emit('join_room', `chat_${activeChat.id}`);
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    socket.on('receive_message', (data) => {
      if (data.roomId === `chat_${activeChat.id}` && data.sender !== (user?.id || 'me')) {
        setHistory(prev => [...prev, {
          id: Date.now(),
          sender: 'friend',
          text: data.translatedText || data.text,
          original: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', `chat_${activeChat.id}`);
    }
    setHistory(INITIAL_HISTORY);
  }, [activeChat.id]);

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

    // Emit via Socket.io
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', {
        roomId: `chat_${activeChat.id}`,
        sender: user?.id || 'me',
        text: msg,
        senderName: user?.name || 'You',
        targetLang: activeChat.nativeLang // Pass language for backend AI translation
      });
    }

    setMsg('');

    // Simulate AI Translated reply
    if (!connected || true) {
      const replies = [
        { text: "That sounds amazing! Let's do it.", original: "それは素晴らしいですね！やりましょう。" },
        { text: "I can teach you some Japanese words if you want.", original: "よかったら日本語の単語をいくつか教えますよ。" },
        { text: "Are you free for a video call later?", original: "後でビデオ通話する時間はありますか？" },
      ];
      setTimeout(() => {
        const reply = replies[Math.floor(Math.random() * replies.length)];
        setHistory(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'friend',
          text: reply.text,
          original: reply.original,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 1500);
    }
  };

  const filteredChats = CHATS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page">
      <div className="container msg-container">
        
        {/* Sidebar */}
        <div className="msg-sidebar">
          <div className="msg-sidebar-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Chats</h2>
            <div className="msg-connection">
              {connected ? <Wifi size={14} color="#00d4aa" /> : <WifiOff size={14} color="var(--text-muted)" />}
            </div>
          </div>
          
          <div className="msg-search">
            <Search size={16} className="msg-search-icon" />
            <input type="text" placeholder="Search friends..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <div className="msg-list">
            {filteredChats.map(chat => (
              <div key={chat.id} className={`msg-item ${activeChat.id === chat.id ? 'active' : ''}`} onClick={() => setActiveChat(chat)}>
                <div className="msg-avatar-wrap">
                  <img src={chat.avatar} alt={chat.name} className="msg-avatar" />
                  {chat.online && <div className="msg-online-dot" />}
                </div>
                <div className="msg-item-info">
                  <div className="msg-item-top">
                    <span className="msg-item-name">{chat.name} {chat.flag}</span>
                    <span className="msg-item-time">{chat.time}</span>
                  </div>
                  <div className="msg-item-bottom">
                    <span className="msg-item-preview">{chat.lastMsg}</span>
                    {chat.unread > 0 && <span className="msg-unread">{chat.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="msg-window">
          {/* Window Header */}
          <div className="msg-window-header">
            <div className="msg-user-info">
              <img src={activeChat.avatar} alt={activeChat.name} className="msg-header-avatar" />
              <div>
                <h3 className="msg-header-name">{activeChat.name} {activeChat.flag}</h3>
                <span className="msg-header-status">{activeChat.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            <div className="msg-header-actions">
              {/* AI Translation Toggle */}
              <button 
                className={`ai-translate-toggle ${aiTranslationOn ? 'active' : ''}`}
                onClick={() => setAiTranslationOn(!aiTranslationOn)}
                title="Toggle AI Translation"
              >
                <Sparkles size={14} /> AI Translate
              </button>

              <button className="msg-icon-btn"><Phone size={18} /></button>
              <button className="msg-icon-btn"><Video size={18} /></button>
              <button className="msg-icon-btn"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="msg-chat-area">
            {history.map(m => (
              <div key={m.id} className={`msg-bubble-wrap ${m.sender === 'user' ? 'sent' : 'received'}`}>
                {m.sender === 'friend' && <img src={activeChat.avatar} alt="Friend" className="msg-bubble-avatar" />}
                
                <div className="msg-bubble-content">
                  <div className="msg-bubble-text">
                    {m.text}
                  </div>
                  
                  {/* Show original language if AI translation is ON and original exists */}
                  {aiTranslationOn && m.original && m.sender === 'friend' && (
                    <div className="msg-bubble-original">
                      <Globe2 size={10} /> {m.original}
                    </div>
                  )}
                  
                  <span className="msg-bubble-time">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="msg-input-area">
            <button className="msg-attach-btn"><Image size={20} /></button>
            
            <form className="msg-form" onSubmit={handleSend}>
              <input
                type="text"
                placeholder={aiTranslationOn ? `Type in English... (Auto-translating to ${activeChat.nativeLang})` : "Type a message..."}
                value={msg}
                onChange={e => setMsg(e.target.value)}
              />
              <button type="submit" className="msg-send-btn" disabled={!msg.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
