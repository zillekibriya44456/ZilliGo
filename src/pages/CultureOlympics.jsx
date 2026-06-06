import { useState } from 'react';
import { Trophy, Globe, Heart, Music, Utensils, MapPin, PlayCircle, Star, ArrowRight } from 'lucide-react';
import './CultureOlympics.css';

const LEADERBOARD = [
  { rank: 1, country: 'India', flag: '🇮🇳', points: '142,500', trend: 'up' },
  { rank: 2, country: 'Japan', flag: '🇯🇵', points: '138,200', trend: 'up' },
  { rank: 3, country: 'Italy', flag: '🇮🇹', points: '125,900', trend: 'down' },
  { rank: 4, country: 'Brazil', flag: '🇧🇷', points: '110,400', trend: 'up' },
  { rank: 5, country: 'France', flag: '🇫🇷', points: '98,000', trend: 'down' },
];

const CHAMPIONSHIPS = [
  {
    id: 'food',
    title: 'Food Championship',
    desc: 'Countries showcase traditional dishes, street food, and cooking methods. Vote for Best Taste & Presentation.',
    icon: <Utensils size={20} />,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    liveNow: 12
  },
  {
    id: 'music',
    title: 'Music & Dance Championship',
    desc: 'Live performances featuring classical music, traditional instruments, and folk dances.',
    icon: <Music size={20} />,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    liveNow: 8
  },
  {
    id: 'heritage',
    title: 'Historical Heritage',
    desc: 'Guides present ancient monuments, UNESCO sites, and national heritage in stunning live 4k.',
    icon: <Globe size={20} />,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
    liveNow: 24
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gem Championship',
    desc: 'Discover secret destinations, unknown villages, and local treasures from around the globe.',
    icon: <MapPin size={20} />,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
    liveNow: 5
  }
];

export default function CultureOlympics() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="olympics-page">
      {/* Hero Section */}
      <section className="olympics-hero">
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="olympics-badge">
            <Trophy size={16} /> Global Culture Olympics™
          </div>
          <h1 className="olympics-title">
            One World. <br />
            <span style={{ background: 'linear-gradient(to right, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Many Cultures.
            </span>
          </h1>
          <p className="olympics-subtitle">
            The world's largest digital cultural celebration. Watch countries compete through heritage, food, music, and storytelling. Vote for your favorites and collect digital passport stamps.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(to right, #D4AF37, #DAA520)', color: '#000', border: 'none', boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}>
              Vote Now
            </button>
            <button className="btn btn-secondary btn-lg">
              View Digital Passport
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Live Leaderboard */}
        <section className="leaderboard-section animate-fade-up">
          <div className="section-header">
            <div>
              <div className="section-label" style={{ color: '#FFD700' }}>🏆 Real-Time Rankings</div>
              <h2>Global Leaderboard</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Voting Credits Available</div>
              <div style={{ fontWeight: 800, color: 'var(--accent-teal)', fontSize: '1.2rem' }}>145 Credits</div>
            </div>
          </div>

          <div className="leaderboard-card">
            {LEADERBOARD.map((item, idx) => (
              <div key={item.country} className="leaderboard-row">
                <div className={`rank-number rank-${item.rank}`}>#{item.rank}</div>
                <div className="country-info">
                  <span className="country-flag">{item.flag}</span>
                  <span className="country-name">{item.country}</span>
                </div>
                <div className="points-display">{item.points} pts</div>
              </div>
            ))}
          </div>
        </section>

        {/* Championships */}
        <section className="championships-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <div>
              <div className="section-label">LIVE EVENTS</div>
              <h2>Competition Categories</h2>
            </div>
          </div>

          <div className="championship-grid">
            {CHAMPIONSHIPS.map(champ => (
              <div key={champ.id} className="champ-card">
                <div style={{ position: 'relative' }}>
                  <img src={champ.image} alt={champ.title} className="champ-img" />
                  <div style={{ position: 'absolute', top: 12, right: 12 }} className="badge badge-live">
                    ● {champ.liveNow} LIVE
                  </div>
                </div>
                <div className="champ-body">
                  <div className="champ-tag">
                    {champ.icon} {champ.title.split(' ')[0]} Event
                  </div>
                  <h3 style={{ marginBottom: '8px' }}>{champ.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {champ.desc}
                  </p>
                  <button className="btn btn-ghost" style={{ width: '100%', border: '1px solid var(--border-glass-strong)' }}>
                    Watch & Vote <PlayCircle size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Passport Teaser */}
        <section className="animate-fade-up" style={{ animationDelay: '0.4s', margin: '4rem 0', background: 'var(--bg-glass)', borderRadius: '24px', padding: '3rem', border: '1px solid rgba(212, 175, 55, 0.3)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '150%', height: '200%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
           <Globe size={48} style={{ color: '#D4AF37', margin: '0 auto 1rem' }} />
           <h2>Your Digital Cultural Passport</h2>
           <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '1rem auto 2rem' }}>Attend events, vote for cultures, and collect exclusive stamps from over 180 countries. Unlock premium travel rewards as your passport fills up.</p>
           <button className="btn btn-primary" style={{ background: '#D4AF37', color: '#000' }}>Open Passport</button>
        </section>
      </div>
    </div>
  );
}
