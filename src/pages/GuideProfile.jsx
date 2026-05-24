import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Globe, CheckCircle, Clock, Award, MessageCircle, Calendar, TrendingUp, Heart } from 'lucide-react';
import { getGuideById, TOURS } from '../data/mockData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import MatchingOverlay from '../components/MatchingOverlay';
import TourCard from '../components/TourCard';
import './GuideProfile.css';

const REVIEWS = [
  { id: 1, user: 'Sarah C.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', rating: 5, date: 'Apr 2026', tour: 'Walking Tour', text: 'Absolutely incredible! The best virtual experience I\'ve ever had. So knowledgeable and passionate!' },
  { id: 2, user: 'David O.', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=60&q=80', rating: 5, date: 'Mar 2026', tour: 'Food Tour', text: 'Amazing guide. Answered every question and made the tour feel completely personal. 100% recommended.' },
  { id: 3, user: 'James W.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', rating: 4, date: 'Mar 2026', tour: 'Historical Tour', text: 'Great experience. Very professional and passionate about the history. Would book again!' },
];

export default function GuideProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startMatching, matchingState } = useBooking();
  const guide = getGuideById(id);
  const [showMatching, setShowMatching] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const guideTours = TOURS.filter(t => t.guide === id).slice(0, 4);

  if (!guide) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexDirection: 'column' }}>
        <div style={{ fontSize: '3rem' }}>👤</div>
        <h2>Guide not found</h2>
        <Link to="/guides" className="btn btn-primary">Browse Guides</Link>
      </div>
    );
  }

  const handleBook = () => {
    if (!user) { navigate('/auth'); return; }
    setShowMatching(true);
    startMatching([guide]);
  };

  return (
    <div className="page-wrapper guide-profile">
      {showMatching && matchingState !== 'idle' && (
        <MatchingOverlay onClose={() => setShowMatching(false)} />
      )}

      {/* Hero */}
      <div className="gp-hero">
        <div className="gp-hero-bg" />
        <div className="container gp-hero-content">
          <div className="gp-avatar-wrap">
            <img src={guide.avatar} alt={guide.name} className="gp-avatar" />
            <span className={`gp-status ${guide.available ? 'available' : 'busy'}`}>
              {guide.available ? 'Available Now' : 'Busy'}
            </span>
          </div>
          <div className="gp-hero-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ marginBottom: 0 }}>{guide.name}</h1>
              {guide.verified && <CheckCircle size={24} style={{ color: 'var(--accent-teal)' }} />}
              {guide.topGuide && <span className="badge badge-amber">⭐ Top Guide</span>}
            </div>
            <div className="gp-hero-meta">
              <span><MapPin size={15} /> {guide.location}</span>
              <span><Star size={15} fill="var(--accent-amber)" stroke="none" /> {guide.rating} ({guide.reviewCount.toLocaleString()} reviews)</span>
              <span><Globe size={15} /> {guide.languages.join(', ')}</span>
              <span><Calendar size={15} /> Joined {guide.joinedYear}</span>
            </div>
            <div className="gp-badges">
              {guide.badges.map(b => <span key={b} className="guide-card__badge-item">{b}</span>)}
            </div>
          </div>
          <div className="gp-hero-actions">
            <div className="gp-rate">
              <span className="gp-rate-amount">${guide.hourlyRate}</span>
              <span className="gp-rate-per">/hr</span>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleBook}>
              Book This Guide
            </button>
            <button className="btn btn-secondary"><MessageCircle size={16} /> Message</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="gp-stats-bar">
        <div className="container gp-stats">
          {[
            { label: 'Tours Done', value: guide.toursCompleted.toLocaleString(), icon: '🎥' },
            { label: 'Reward Points', value: Math.floor(guide.rating * guide.toursCompleted * 15).toLocaleString(), icon: '🏆' },
            { label: 'Rating', value: guide.rating, icon: '⭐' },
            { label: 'Reviews', value: guide.reviewCount.toLocaleString(), icon: '💬' },
            { label: 'Response', value: guide.responseTime, icon: '⚡' },
          ].map(s => (
            <div key={s.label} className="gp-stat">
              <span className="gp-stat__icon">{s.icon}</span>
              <span className="gp-stat__value">{s.value}</span>
              <span className="gp-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Body */}
      <div className="container gp-body">
        <div className="gp-tabs">
          {['about', 'tours', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`gp-tab ${activeTab === tab ? 'active' : ''}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'about' && (
          <div className="gp-about">
            <div className="gp-about-main">
              <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h3>About {guide.name}</h3>
                <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginTop: '1rem' }}>{guide.bio}</p>
                <div className="gp-specialties" style={{ marginTop: 'var(--space-lg)' }}>
                  <h4 style={{ marginBottom: '0.75rem' }}>Specialties</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {guide.specialties.map(s => <span key={s} className="badge badge-teal">{s}</span>)}
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <h4 style={{ marginBottom: '0.75rem' }}>Languages</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {guide.languages.map(l => <span key={l} className="badge badge-purple">{l}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="gp-about-sidebar">
              <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-lg)' }}>Book {guide.name.split(' ')[0]}</h4>
                <div className="gp-book-rate">
                  <span className="gp-rate-amount">${guide.hourlyRate}</span>
                  <span className="gp-rate-per"> / hour</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>
                  ⚡ Usually responds {guide.responseTime}
                </p>
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }} onClick={handleBook}>
                  Book a Live Tour
                </button>
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  <MessageCircle size={15} /> Send Message
                </button>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['Free cancellation (48h)', 'Secure payment', 'Verified guide'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <CheckCircle size={13} style={{ color: 'var(--accent-teal)' }} /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tours' && (
          <div>
            {guideTours.length > 0 ? (
              <div className="grid-4">
                {guideTours.map(t => <TourCard key={t.id} tour={t} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem' }}>🎥</div>
                <p style={{ marginTop: '1rem' }}>No tours listed yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="gp-rating-summary glass-card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--accent-teal)' }}>{guide.rating}</div>
                  <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '4px 0' }}>
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="var(--accent-amber)" stroke="none" />)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{guide.reviewCount} reviews</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[5, 4, 3, 2, 1].map(n => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 8 }}>{n}</span>
                      <Star size={11} fill="var(--accent-amber)" stroke="none" />
                      <div style={{ flex: 1, height: 6, background: 'var(--border-glass)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--accent-amber)', borderRadius: 3, width: `${[90, 7, 2, 1, 0][5 - n]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {REVIEWS.map(r => (
              <div key={r.id} className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <img src={r.avatar} alt={r.user} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.user}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} fill="var(--accent-amber)" stroke="none" />)}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date} · {r.tour}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
