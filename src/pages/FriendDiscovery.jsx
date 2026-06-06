import { useState } from 'react';
import { Search, Globe, Users, MessageCircle, Heart, Star, MapPin, Zap } from 'lucide-react';
import './FriendDiscovery.css';

const MOCK_SUGGESTIONS = [
  {
    id: 1,
    name: "Yuki Tanaka",
    country: "Japan",
    flag: "🇯🇵",
    avatar: "https://i.pravatar.cc/150?u=yuki",
    explorerType: "Cultural Explorer",
    matchScore: 96,
    sharedInterests: ["Food", "Technology", "History"],
    languages: ["Japanese (Native)", "English (Fluent)"],
    bio: "Tokyo local who loves exploring hidden temples and trying new street food. Always happy to practice English!"
  },
  {
    id: 2,
    name: "Mateo Rossi",
    country: "Italy",
    flag: "🇮🇹",
    avatar: "https://i.pravatar.cc/150?u=mateo",
    explorerType: "Food Explorer",
    matchScore: 88,
    sharedInterests: ["Food", "Art", "Architecture"],
    languages: ["Italian (Native)", "English (Learning)"],
    bio: "Chef in Rome. I love showing people the real Italian cuisine. Let's exchange recipes!"
  },
  {
    id: 3,
    name: "Priya Sharma",
    country: "India",
    flag: "🇮🇳",
    avatar: "https://i.pravatar.cc/150?u=priya",
    explorerType: "Tech Explorer",
    matchScore: 92,
    sharedInterests: ["Technology", "Startups", "Travel"],
    languages: ["Hindi (Native)", "English (Fluent)"],
    bio: "Software engineer in Bangalore. Planning a trip to Japan next year. Looking for travel buddies!"
  }
];

export default function FriendDiscovery() {
  const [filter, setFilter] = useState('suggested');

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

        <div className="fd-grid">
          {MOCK_SUGGESTIONS.map(friend => (
            <div key={friend.id} className="friend-card">
              <div className="fc-match-badge">
                <Zap size={12} fill="currentColor" /> {friend.matchScore}% Match
              </div>
              
              <div className="fc-header">
                <img src={friend.avatar} alt={friend.name} className="fc-avatar" />
                <div className="fc-info">
                  <h3 className="fc-name">{friend.name}</h3>
                  <div className="fc-location"><span className="fc-flag">{friend.flag}</span> {friend.country}</div>
                </div>
              </div>

              <div className="fc-explorer-type">{friend.explorerType}</div>
              
              <p className="fc-bio">{friend.bio}</p>

              <div className="fc-section">
                <div className="fc-section-title">Shared Interests</div>
                <div className="fc-tags">
                  {friend.sharedInterests.map(i => <span key={i} className="fc-tag fc-tag-shared">✓ {i}</span>)}
                </div>
              </div>

              <div className="fc-section">
                <div className="fc-section-title">Languages</div>
                <div className="fc-tags">
                  {friend.languages.map(l => <span key={l} className="fc-tag">{l}</span>)}
                </div>
              </div>

              {/* AI Icebreaker */}
              <div className="fc-icebreaker">
                <div className="fc-icebreaker-title"><SparklesIcon /> AI Conversation Starter</div>
                <p>You both love <strong>{friend.sharedInterests[0]}</strong>. Ask what their favorite dish is!</p>
              </div>

              <div className="fc-actions">
                <button className="btn btn-secondary" style={{ flex: 1 }}><Heart size={18} /> Connect</button>
                <button className="btn btn-primary" style={{ flex: 1 }}><MessageCircle size={18} /> Chat</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SparklesIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}
