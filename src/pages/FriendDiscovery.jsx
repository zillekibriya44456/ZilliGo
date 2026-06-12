import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, Users, MessageCircle, Heart, Star, MapPin, Zap, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './FriendDiscovery.css';



export default function FriendDiscovery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('suggested');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!user) {
        setSuggestions([]);
        setLoading(false);
        return;
      }
      try {
        const data = await api.getSuggestions(user.id);
        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    loadSuggestions();
  }, [user]);

  const handleConnect = (friendId) => {
    setConnectingId(friendId);
    setTimeout(() => {
      setConnectingId(null);
      alert('Connection Request Sent! Once they accept, they will show up in your Chats.');
    }, 1200);
  };

  const handleChat = (friend) => {
    // Save active chat target in localStorage so the chat page can auto-create the thread
    localStorage.setItem('start_chat_with', JSON.stringify({
      id: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      country: friend.country || 'Global',
      flag: friend.flag || '🌍',
      nativeLang: friend.nativeLang || 'English',
    }));
    navigate('/messages');
  };

  const getLanguageLabel = (langCode) => {
    const map = {
      en: 'English',
      ja: 'Japanese',
      it: 'Italian',
      hi: 'Hindi',
      es: 'Spanish',
      fr: 'French',
      ar: 'Arabic'
    };
    return map[langCode] || langCode;
  };

  return (
    <div className="friend-discovery-page">
      <div className="fd-header">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="fd-badge"><Globe size={14} /> ZilliGo Global Matching™</div>
          <h1 className="fd-title">Meet The World, <br/><span className="gradient-text">One Friend At A Time.</span></h1>
          <p className="fd-subtitle">Connect with people globally based on your travel interests, culture, and language goals.</p>
          
          <div className="fd-search-bar">
            <Search size={20} className="fd-search-icon" />
            <input type="text" placeholder="Find friends in Japan, food lovers, or history enthusiasts..." />
            <button className="fd-search-btn">Discover</button>
          </div>
        </div>
      </div>

      <div className="container fd-content">
        <div className="fd-tabs">
          <button className={`fd-tab ${filter === 'suggested' ? 'active' : ''}`} onClick={() => setFilter('suggested')}>
            <Zap size={16} /> AI Matches
          </button>
          <button className={`fd-tab ${filter === 'map' ? 'active' : ''}`} onClick={() => setFilter('map')}>
            <MapPin size={16} /> Global Map
          </button>
          <button className={`fd-tab ${filter === 'communities' ? 'active' : ''}`} onClick={() => setFilter('communities')}>
            <Users size={16} /> Communities
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Loader className="passport-spin" size={36} style={{ color: 'var(--accent-teal)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Calculating similarity compatibility vectors...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--text-muted)' }}>No suggestions available at the moment. Try updating your profile interests!</p>
          </div>
        ) : (
          <div className="fd-grid">
            {suggestions.map(friend => (
              <div key={friend.id} className="friend-card animate-fade-in">
                <div className="fc-match-badge">
                  <Zap size={12} fill="currentColor" /> {friend.matchScore}% Match
                </div>
                
                <div className="fc-header">
                  <img src={friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}`} alt={friend.name} className="fc-avatar" />
                  <div className="fc-info">
                    <h3 className="fc-name">{friend.name}</h3>
                    <div className="fc-location"><span className="fc-flag">{friend.flag || '🌍'}</span> {friend.country}</div>
                  </div>
                </div>

                <div className="fc-explorer-type">{friend.explorerType || 'Cultural Explorer'}</div>
                
                <p className="fc-bio">{friend.bio}</p>

                <div className="fc-section">
                  <div className="fc-section-title">Shared Interests</div>
                  <div className="fc-tags">
                    {(friend.sharedInterests || []).map(i => <span key={i} className="fc-tag fc-tag-shared">✓ {i}</span>)}
                  </div>
                </div>

                <div className="fc-section">
                  <div className="fc-section-title">Languages</div>
                  <div className="fc-tags">
                    {(friend.sharedLanguages || friend.languages || []).map(l => (
                      <span key={typeof l === 'object' ? l.language_code : l} className="fc-tag">
                        {typeof l === 'object' ? `${getLanguageLabel(l.language_code)} (${l.proficiency})` : getLanguageLabel(l)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Icebreaker */}
                <div className="fc-icebreaker">
                  <div className="fc-icebreaker-title"><SparklesIcon /> AI Conversation Starter</div>
                  <p>{friend.aiIcebreaker || `You both have traveler goals in common. Introduce yourself!`}</p>
                </div>

                <div className="fc-actions">
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleConnect(friend.id)} disabled={connectingId === friend.id}>
                    {connectingId === friend.id ? 'Connecting...' : <><Heart size={18} /> Connect</>}
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleChat(friend)}><MessageCircle size={18} /> Chat</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SparklesIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}
