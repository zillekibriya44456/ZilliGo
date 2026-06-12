import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Globe, CheckCircle, Clock, Award, MessageCircle, Calendar, TrendingUp, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
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
  const [guide, setGuide] = useState(null);
  const [guideTours, setGuideTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatching, setShowMatching] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchGuideData = async () => {
      setLoading(true);
      try {
        const [gData, tData] = await Promise.all([
          api.getMarketplaceGuide(id).catch(() => null),
          api.getTours(`guideId=${id}`).catch(() => [])
        ]);
        if (gData && !gData.message) setGuide(gData);
        if (tData && tData.tours) setGuideTours(tData.tours.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuideData();
  }, [id]);

  if (loading) {
    return (
      <div className="gp-loading">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="spinner-lg" />
        <p>Loading guide profile...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="gp-empty">
        <span className="gp-empty-icon">👤</span>
        <h2>Guide not found</h2>
        <Link to="/guides" className="btn-liquid">Browse Guides</Link>
      </div>
    );
  }

  const handleBook = () => {
    if (!user) { navigate('/auth'); return; }
    setShowMatching(true);
    startMatching([guide]);
  };

  return (
    <div className="guide-profile-liquid">
      {showMatching && matchingState !== 'idle' && <MatchingOverlay onClose={() => setShowMatching(false)} />}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gp-hero">
        <div className="gp-hero-bg" />
        <div className="container gp-hero-content">
          <div className="gp-avatar-wrap">
            <img src={guide.avatar} alt={guide.name} className="gp-avatar" />
            <span className={`gp-status ${guide.available ? 'available' : 'busy'}`}>
              <span className="status-dot" /> {guide.available ? 'Available Now' : 'Busy'}
            </span>
          </div>

          <div className="gp-hero-info">
            <div className="gp-hero-title-row">
              <h1>{guide.name}</h1>
              {guide.verified && <CheckCircle size={24} className="text-teal" />}
              {guide.topGuide && <span className="badge-liquid badge-amber">⭐ Top Guide</span>}
            </div>

            <div className="gp-hero-meta">
              <span><MapPin size={16} /> {guide.location || 'Global'}</span>
              <span><Star size={16} fill="var(--accent-amber)" color="var(--accent-amber)" /> {guide.avgRating || 0} ({(guide.reviewCount || 0).toLocaleString()} reviews)</span>
              <span><Globe size={16} /> English</span>
              <span><Calendar size={16} /> Joined {guide.createdAt ? new Date(guide.createdAt).getFullYear() : '2026'}</span>
            </div>

            <div className="gp-badges">
              <span className="badge-glass">Cultural Expert</span>
              <span className="badge-glass">Local Verified</span>
            </div>
          </div>

          <div className="gp-hero-actions glass-panel">
            <div className="gp-rate">
              <span className="gp-rate-amount">${guide.hourlyRate || 40}</span>
              <span className="gp-rate-per">/hr starting rate</span>
            </div>
            <button className="btn-liquid" onClick={handleBook}>Book a Live Tour</button>
            <button className="btn-ghost"><MessageCircle size={16} /> Message Guide</button>
          </div>
        </div>
      </motion.div>

      <div className="gp-stats-bar">
        <div className="container gp-stats-grid">
          {[
            { label: 'Tours Completed', value: (guide.toursCompleted || 0).toLocaleString(), icon: '🎥' },
            { label: 'Reward Points', value: Math.floor((guide.avgRating || 5) * (guide.toursCompleted || 1) * 15).toLocaleString(), icon: '🏆' },
            { label: 'Overall Rating', value: guide.avgRating || 0, icon: '⭐' },
            { label: 'Total Reviews', value: (guide.reviewCount || 0).toLocaleString(), icon: '💬' },
            { label: 'Response Time', value: '< 1 hr', icon: '⚡' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="gp-stat-item glass-panel">
              <span className="gp-stat-icon">{s.icon}</span>
              <div className="gp-stat-info">
                <span className="gp-stat-value">{s.value}</span>
                <span className="gp-stat-label">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container gp-body">
        <div className="gp-tabs">
          {['about', 'tours', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`gp-tab-btn ${activeTab === tab ? 'active' : ''}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="gp-about-grid">
              <div className="gp-about-main glass-panel">
                <h3>About {guide.name}</h3>
                <p className="gp-bio">{guide.bio}</p>
                <div className="gp-details-row">
                  <div className="gp-details-col">
                    <h5>Specialties</h5>
                    <div className="gp-tags">
                      {(guide.specialties || ['Cultural Explorer', 'Historian']).map(s => <span key={s} className="tag-glass">{s}</span>)}
                    </div>
                  </div>
                  <div className="gp-details-col">
                    <h5>Languages</h5>
                    <div className="gp-tags">
                      {(guide.languages || ['English']).map(l => <span key={l} className="tag-glass">{l}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="gp-about-sidebar glass-panel">
                <h4>Trust & Safety</h4>
                <ul className="gp-trust-list">
                  <li><CheckCircle size={16} className="text-teal" /> Identity Verified</li>
                  <li><CheckCircle size={16} className="text-teal" /> Secure Payment via Stripe</li>
                  <li><CheckCircle size={16} className="text-teal" /> Free Cancellation (48h)</li>
                </ul>
                <hr className="divider" />
                <button className="btn-liquid w-100" onClick={handleBook}>Book a Live Tour</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'tours' && (
            <motion.div key="tours" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {guideTours.length > 0 ? (
                <div className="grid-4">
                  {guideTours.map((t, i) => <TourCard key={t.id} tour={t} delay={i * 0.1} />)}
                </div>
              ) : (
                <div className="gp-empty-state glass-panel">
                  <span className="icon">🎥</span>
                  <p>No tours listed yet</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="gp-reviews-layout">
              <div className="gp-rating-summary glass-panel">
                <div className="gp-rs-left">
                  <div className="gp-rs-score">{guide.avgRating || 0}</div>
                  <div className="gp-rs-stars">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="var(--accent-amber)" stroke="none" />)}
                  </div>
                  <div className="gp-rs-count">{guide.reviewCount || 0} reviews</div>
                </div>
                <div className="gp-rs-bars">
                  {[5, 4, 3, 2, 1].map(n => (
                    <div key={n} className="gp-rs-bar-row">
                      <span>{n}</span>
                      <Star size={12} fill="var(--accent-amber)" stroke="none" />
                      <div className="gp-rs-track">
                        <div className="gp-rs-fill" style={{ width: `${[90, 7, 2, 1, 0][5 - n]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gp-reviews-list">
                {REVIEWS.map(r => (
                  <div key={r.id} className="gp-review-card glass-panel">
                    <div className="gp-rc-header">
                      <img src={r.avatar} alt={r.user} className="gp-rc-avatar" />
                      <div className="gp-rc-meta">
                        <div className="gp-rc-user">{r.user}</div>
                        <div className="gp-rc-rating-row">
                          <div className="gp-rc-stars">
                            {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} fill="var(--accent-amber)" stroke="none" />)}
                          </div>
                          <span className="gp-rc-date">{r.date} · {r.tour}</span>
                        </div>
                      </div>
                    </div>
                    <p className="gp-rc-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
