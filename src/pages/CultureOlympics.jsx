import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Globe, Heart, Music, Utensils, MapPin, PlayCircle, Star, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './CultureOlympics.css';

const DEFAULT_LEADERBOARD = [
  { rank: 1, country: 'India', flag: '🇮🇳', points: '142,500', trend: 'up' },
  { rank: 2, country: 'Japan', flag: '🇯🇵', points: '138,200', trend: 'up' },
  { rank: 3, country: 'Italy', flag: '🇮🇹', points: '125,900', trend: 'down' },
  { rank: 4, country: 'Spain', flag: '🇪🇸', points: '110,400', trend: 'up' },
  { rank: 5, country: 'Egypt', flag: '🇪🇬', points: '98,000', trend: 'down' },
];

const CHAMPIONSHIPS = [
  {
    id: 'food',
    title: 'Food Championship',
    desc: 'Countries showcase traditional dishes, street food, and cooking methods. Vote for Best Taste & Presentation.',
    icon: <Utensils size={20} />,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    liveNow: 12,
    entryId: 1
  },
  {
    id: 'music',
    title: 'Music & Dance Championship',
    desc: 'Live performances featuring classical music, traditional instruments, and folk dances.',
    icon: <Music size={20} />,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    liveNow: 8,
    entryId: 2
  },
  {
    id: 'heritage',
    title: 'Historical Heritage',
    desc: 'Guides present ancient monuments, UNESCO sites, and national heritage in stunning live 4k.',
    icon: <Globe size={20} />,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
    liveNow: 24,
    entryId: 3
  }
];

export default function CultureOlympics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD);
  const [credits, setCredits] = useState(user?.rewardPoints || 0);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const fetchStandings = async () => {
    try {
      const data = await api.getOlympicLeaderboard();
      if (Array.isArray(data) && data.length > 0) {
        const codeToCountry = { JPN: 'Japan', ITA: 'Italy', IND: 'India', ESP: 'Spain', EGY: 'Egypt' };
        const codeToFlag = { JPN: '🇯🇵', ITA: '🇮🇹', IND: '🇮🇳', ESP: '🇪🇸', EGY: '🇪🇬' };
        const formatted = data.map((item, idx) => ({
          rank: idx + 1,
          country: codeToCountry[item.country_code] || item.country_code,
          flag: codeToFlag[item.country_code] || '🌍',
          points: parseInt(item.total_points || item.totalPoints).toLocaleString(),
          trend: 'up'
        }));
        setLeaderboard(formatted);
      }
    } catch (err) {
      console.error('Error fetching standings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  useEffect(() => {
    if (user) {
      setCredits(user.rewardPoints || 0);
    }
  }, [user]);

  const handleVote = async (entryId) => {
    if (!user) {
      alert('Please log in to cast your vote.');
      navigate('/auth');
      return;
    }
    if (credits <= 0) {
      alert('Insufficient voting credits! Book more tours to earn reward points/credits.');
      return;
    }

    setVoting(true);
    try {
      const res = await api.castOlympicVote({
        userId: user.id,
        entryId: entryId || 1,
        category: 'best_taste'
      });

      if (res.error) {
        alert(res.error);
      } else {
        alert('🎉 Vote cast successfully! 10 points awarded to country team.');
        setCredits(c => c - 1);
        await fetchStandings();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to cast vote.');
    } finally {
      setVoting(false);
    }
  };

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
            <button className="btn btn-primary btn-lg" 
              style={{ background: 'linear-gradient(to right, #D4AF37, #DAA520)', color: '#000', border: 'none', boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)' }}
              onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}>
              Vote Now
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/passport')}>
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
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your Voting Credits (Reward Points)</div>
              <div style={{ fontWeight: 800, color: 'var(--accent-teal)', fontSize: '1.2rem' }}>{credits} Credits</div>
            </div>
          </div>

          <div className="leaderboard-card">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="passport-spin" /></div>
            ) : (
              leaderboard.map((item) => (
                <div key={item.country} className="leaderboard-row">
                  <div className={`rank-number rank-${item.rank}`}>#{item.rank}</div>
                  <div className="country-info">
                    <span className="country-flag">{item.flag}</span>
                    <span className="country-name">{item.country}</span>
                  </div>
                  <div className="points-display">{item.points} pts</div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Championships */}
        <section id="categories" className="championships-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
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
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleVote(champ.entryId)} disabled={voting}>
                    {voting ? 'Casting Vote...' : 'Vote with 1 Credit'}
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
           <button className="btn btn-primary" style={{ background: '#D4AF37', color: '#000' }} onClick={() => navigate('/passport')}>Open Passport</button>
        </section>
      </div>
    </div>
  );
}
