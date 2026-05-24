import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Calendar, Star, Heart, Clock, Play, MapPin, Globe, TrendingUp, Award, Bell, ShieldAlert, Sparkles, ArrowRight, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { TOURS, getGuideById } from '../data/mockData';
import TourCard from '../components/TourCard';
import VerificationModal from '../components/VerificationModal';
import './Dashboard.css';

const UPCOMING = [
  { id: 'b1', tour: TOURS[0], date: 'May 5, 2026', time: '2:00 PM', status: 'confirmed', guide: 'g1' },
  { id: 'b2', tour: TOURS[3], date: 'May 8, 2026', time: '11:00 AM', status: 'pending', guide: 'g4' },
];

const PAST = [
  { id: 'p1', tour: TOURS[1], date: 'Apr 18, 2026', rating: 5 },
  { id: 'p2', tour: TOURS[5], date: 'Apr 10, 2026', rating: 4 },
  { id: 'p3', tour: TOURS[6], date: 'Mar 29, 2026', rating: 5 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showVerification, setShowVerification] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getMyBookings();
        if (data && Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings');
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);
  
  const upcomingTours = bookings.length > 0 
    ? bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
    : UPCOMING;
    
  const pastTours = bookings.length > 0 
    ? bookings.filter(b => b.status === 'completed')
    : PAST;

  const wishlistTours = TOURS.filter(t => ['2', '5', '7'].includes(t.id));

  if (!user) return <Navigate to="/auth" />;
  if (user.role === 'guide') return <Navigate to="/guide-dashboard" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;

  return (
    <div className="page-wrapper dashboard-page">
      {showVerification && <VerificationModal onClose={() => setShowVerification(false)} />}
      
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-welcome">
            <img src={user.avatar} alt={user.name} className="dashboard-avatar" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1>Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>! 👋</h1>
                {user.verified && <span className="badge badge-teal" style={{ padding: '4px 8px' }}>Verified</span>}
              </div>
              <p>Ready to explore somewhere new today?</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/planner" className="btn btn-secondary" style={{ background: 'rgba(0, 212, 170, 0.1)', color: 'var(--accent-teal)', borderColor: 'rgba(0, 212, 170, 0.3)' }}>
              <Sparkles size={16} /> AI Trip Planner
            </Link>
            <Link to="/explore" className="btn btn-primary">Browse Tours <Globe size={16} /></Link>
          </div>
        </div>
      </div>

      {!user.verified && (
        <div className="container" style={{ marginTop: 'var(--space-2xl)' }}>
          <div className="glass-card" style={{ padding: 'var(--space-lg)', border: '1px solid var(--accent-amber)', background: 'rgba(245, 158, 11, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <h3 style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} /> Action Required: Verify your Identity
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                To ensure community safety and allow you to book live tours, please upload a valid government ID.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowVerification(true)}>
              Verify Now
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="container">
        <div className="dashboard-stats">
          {[
            { icon: '🎥', label: 'Tours Completed', value: 14 },
            { icon: '⭐', label: 'Avg Rating Given', value: '4.9' },
            { icon: '❤️', label: 'Wishlist Items', value: 3 },
            { icon: '🌍', label: 'Countries Visited', value: 6 },
          ].map(s => (
            <div key={s.label} className="dashboard-stat glass-card">
              <span className="dashboard-stat__icon">{s.icon}</span>
              <span className="dashboard-stat__value">{s.value}</span>
              <span className="dashboard-stat__label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="dashboard-ai-section" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)', marginBottom: 'var(--space-lg)' }}>
            <Sparkles size={20} className="spin-slow" />
            <h3 style={{ margin: 0 }}>AI-Powered Suggestions for You</h3>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            {TOURS.filter(t => t.rating > 4.8).slice(0, 3).map(t => (
              <div key={t.id} className="glass-card" style={{ display: 'flex', gap: '15px', padding: '12px', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)' }}>
                <img src={t.coverImage} alt={t.title} style={{ width: 80, height: 80, borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 600, textTransform: 'uppercase' }}>{t.category}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', margin: '4px 0', lineHeight: 1.2 }}>{t.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <MapPin size={12} /> {t.location}
                  </div>
                </div>
                <Link to={`/tour/${t.id}`} className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {[
            { id: 'upcoming', label: 'Upcoming', icon: <Calendar size={15} /> },
            { id: 'past', label: 'Past Tours', icon: <Clock size={15} /> },
            { id: 'orders', label: 'My Orders', icon: <Package size={15} /> },
            { id: 'wishlist', label: 'Wishlist', icon: <Heart size={15} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`dashboard-tab ${activeTab === t.id ? 'active' : ''}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Upcoming */}
        {activeTab === 'upcoming' && (
          <div className="dashboard-section">
            {upcomingTours.length === 0 ? (
              <div className="dashboard-empty">
                <div>📅</div>
                <h3>No upcoming tours</h3>
                <p>Book your next adventure!</p>
                <Link to="/explore" className="btn btn-primary">Explore Tours</Link>
              </div>
            ) : (
              <div className="upcoming-list">
                {upcomingTours.map(b => {
                  const tour = b.tour || TOURS.find(t => t.id == b.tourId) || TOURS[0];
                  const guide = getGuideById(b.guideId || 'g1');
                  return (
                    <div key={b.id} className="upcoming-item glass-card">
                      <div className="upcoming-img">
                        <img src={tour.coverImage} alt={tour.title} />
                        <span className={`upcoming-status upcoming-status--${b.status}`}>{b.status}</span>
                      </div>
                      <div className="upcoming-info">
                        <h3>{tour.title}</h3>
                        <div className="upcoming-meta">
                          <span><MapPin size={13} /> {tour.location}</span>
                          <span><Calendar size={13} /> {b.bookingDate || b.date} · {b.bookingTime || b.time}</span>
                          <span><Clock size={13} /> {tour.duration || 90} min</span>
                        </div>
                        {guide && (
                          <div className="upcoming-guide">
                            <img src={guide.avatar} alt={guide.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                            <span>Guide: <strong>{guide.name}</strong></span>
                            <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>★ {guide.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="upcoming-actions">
                        <Link to={`/live/${b.tour.id}`} className="btn btn-primary btn-sm">
                          <Play size={14} /> Join Now
                        </Link>
                        <button className="btn btn-secondary btn-sm">Reschedule</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Past */}
        {activeTab === 'past' && (
          <div className="dashboard-section">
            <div className="past-list">
              {pastTours.map(p => {
                const tour = p.tour || TOURS.find(t => t.id == p.tourId) || TOURS[0];
                return (
                  <div key={p.id} className="past-item glass-card">
                    <img src={tour.coverImage} alt={tour.title} className="past-img" />
                    <div className="past-info">
                      <h4>{tour.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tour.location}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>· {p.bookingDate || p.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
                        {Array.from({ length: p.rating || 5 }).map((_, i) => <Star key={i} size={12} fill="var(--accent-amber)" stroke="none" />)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/tour/${tour.id}`} className="btn btn-secondary btn-sm">Book Again</Link>
                      <button className="btn btn-ghost btn-sm" onClick={() => alert('Continuous Feedback portal opened. Thank you for helping us improve!')}>Give Feedback</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="dashboard-section">
            <div className="orders-list">
              {[
                { id: 'ORD-122', item: 'Handcrafted Sandalwood Box', price: '$45.00', status: 'Shipped', date: 'May 1, 2026', img: 'https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=100' },
                { id: 'ORD-109', item: 'Organic Darjeeling Tea (Set of 3)', price: '$28.50', status: 'Delivered', date: 'Apr 25, 2026', img: 'https://images.unsplash.com/photo-1594631252845-29fc45865157?w=100' },
              ].map(o => (
                <div key={o.id} className="order-item glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', marginBottom: '12px' }}>
                  <img src={o.img} alt={o.item} style={{ width: 60, height: 60, borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.id} · {o.date}</div>
                    <div style={{ fontWeight: 700 }}>{o.item}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--accent-teal)' }}>{o.price}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${o.status === 'Shipped' ? 'badge-amber' : 'badge-teal'}`} style={{ fontSize: '0.7rem' }}>{o.status}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {o.status === 'Shipped' ? 'Tracking: ZG-99812' : 'Receipt #8822'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="dashboard-section">
            <div className="grid-4">
              {wishlistTours.map(t => <TourCard key={t.id} tour={t} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
