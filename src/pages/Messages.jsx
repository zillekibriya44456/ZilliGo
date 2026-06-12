import { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Image, Smile, Wifi, WifiOff, Globe2, Sparkles, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { io } from 'socket.io-client';
import './Messages.css';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';



export default function Messages() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiTranslationOn, setAiTranslationOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const loadConversations = async () => {
    try {
      const data = await api.getConversations();
      
      const startChatWithRaw = localStorage.getItem('start_chat_with');
      let selectTarget = null;
      let updatedChats = Array.isArray(data) ? [...data] : [];

      if (startChatWithRaw) {
        const target = JSON.parse(startChatWithRaw);
        localStorage.removeItem('start_chat_with');
        
        const exists = updatedChats.find(c => c.id === target.id);
        if (!exists) {
          updatedChats.unshift({
            ...target,
            lastMsg: 'Starting a new conversation...',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            online: true
          });
        }
        selectTarget = target;
      }



      setChats(updatedChats);
      if (selectTarget) {
        setActiveChat(selectTarget);
      } else if (!activeChat && updatedChats.length > 0) {
        setActiveChat(updatedChats[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!activeChat?.id) return;
    const loadHistory = async () => {
      try {
        const historyData = await api.getChatHistory(activeChat.id);
        if (Array.isArray(historyData) && historyData.length > 0) {
          setHistory(historyData);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setHistory([]);
      }
    };
    loadHistory();
  }, [activeChat?.id]);

  useEffect(() => {
    if (!activeChat?.id) return;

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
  }, [activeChat?.id, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msg.trim() || !activeChat?.id) return;

    const clientMsg = msg;
    setMsg('');

    try {
      // 1. Save to DB
      const result = await api.sendMessage({
        receiverId: activeChat.id,
        content: clientMsg
      });

      // 2. Append to local history
      setHistory(prev => [...prev, result]);

      // 3. Emit via Socket.io
      if (socketRef.current?.connected) {
        socketRef.current.emit('send_message', {
          roomId: `chat_${activeChat.id}`,
          sender: user?.id || 'me',
          text: clientMsg,
          senderName: user?.name || 'You',
          targetLang: activeChat.nativeLang || 'English'
        });
      }

      // Refresh conversations to update last message preview
      await loadConversations();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredChats = chats.filter(c =>
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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}><Loader className="passport-spin" /></div>
          ) : (
            <div className="msg-list">
              {filteredChats.map(chat => (
                <div key={chat.id} className={`msg-item ${activeChat?.id === chat.id ? 'active' : ''}`} onClick={() => setActiveChat(chat)}>
                  <div className="msg-avatar-wrap">
                    <img src={chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}`} alt={chat.name} className="msg-avatar" />
                    {chat.online && <div className="msg-online-dot" />}
                  </div>
                  <div className="msg-item-info">
                    <div className="msg-item-top">
                      <span className="msg-item-name">{chat.name} {chat.flag || '🌍'}</span>
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
          )}
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className="msg-window">
            {/* Window Header */}
            <div className="msg-window-header">
              <div className="msg-user-info">
                <img src={activeChat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}`} alt={activeChat.name} className="msg-header-avatar" />
                <div>
                  <h3 className="msg-header-name">{activeChat.name} {activeChat.flag || '🌍'}</h3>
                  <span className="msg-header-status">{activeChat.online ? 'Online' : 'Offline'}</span>
                </div>
              </div>

              <div className="msg-header-actions">
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
                  {m.sender === 'friend' && <img src={activeChat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}`} alt="Friend" className="msg-bubble-avatar" />}
                  
                  <div className="msg-bubble-content">
                    <div className="msg-bubble-text">
                      {m.text}
                    </div>
                    
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
        ) : (
          <div className="msg-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>No Active Conversations</h3>
              <p>Select a friend or guide from the matching page to start chatting.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
