import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, Clock, Calendar, CheckCircle, XCircle,
  MessageCircle, Globe, ChevronRight, AlertTriangle, Play,
  Wallet, CreditCard, RefreshCw, ShieldAlert, Heart, Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { TOURS, GUIDES } from '../data/mockData';
import TourCard from '../components/TourCard';
import RatingModal from '../components/RatingModal';
import VerificationModal from '../components/VerificationModal';
import './Dashboard.css';

/* ── Status badge helper ── */
const StatusBadge = ({ status }) => {
  const map = {
    pending:   { cls: 'badge-amber',  label: '⏳ Pending' },
    confirmed: { cls: 'badge-teal',   label: '✅ Confirmed' },
    completed: { cls: 'badge-purple', label: '🏁 Completed' },
    cancelled: { cls: 'badge-error',  label: '❌ Cancelled' },
    declined:  { cls: 'badge-error',  label: '🚫 Declined' },
  };
  const s = map[status] || { cls: 'badge-amber', label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

/* ── Demo booking data (shown when DB is offline) ── */
const DEMO_BOOKINGS = [
  { id: 'b1', tourTitle: 'Tokyo Neon Lights Tour', tourLocation: 'Tokyo, Japan', coverImage: TOURS[0]?.coverImage, bookingDate: '2026-06-12', bookingTime: '14:00', status: 'confirmed', totalAmount: 45, guideName: 'Yuki Tanaka', guideAvatar: GUIDES?.[0]?.avatar, tourId: '1' },
  { id: 'b2', tourTitle: 'Rajasthan Desert Safari', tourLocation: 'Jaipur, India', coverImage: TOURS[3]?.coverImage, bookingDate: '2026-06-18', bookingTime: '10:00', status: 'pending', totalAmount: 35, guideName: 'Priya Sharma', guideAvatar: GUIDES?.[1]?.avatar, tourId: '4' },
  { id: 'b3', tourTitle: 'Paris Midnight Walk', tourLocation: 'Paris, France', coverImage: TOURS[1]?.coverImage, bookingDate: '2026-05-20', bookingTime: '20:00', status: 'completed', totalAmount: 55, guideName: 'Sophie Dubois', guideAvatar: GUIDES?.[2]?.avatar, tourId: '2', rating: 5 },
];

const DEMO_WISHLIST = TOURS.filter(t => ['2','5','7'].includes(t.id));

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifications, setNotifications] = useState([]);

  if (!user) return <Navigate to="/auth" />;
  if (user.role === 'guide') return <Navigate to="/guide-dashboard" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [bData, nData] = await Promise.all([
          api.getTravelerBookings().catch(() => null),
          api.getNotifications().catch(() => []),
        ]);
        setBookings(Array.isArray(bData) && bData.length > 0 ? bData : DEMO_BOOKINGS);
        setNotifications(Array.isArray(nData) ? nData : []);
      } catch (_) {
        setBookings(DEMO_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.tourTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.guideName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const upcoming = bookings.filter(b => ['pending','confirmed'].includes(b.status));
  const completed = bookings.filter(b => b.status === 'completed');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="db-page">
      {showVerification && <VerificationModal onClose={() => setShowVerification(false)} />}
      {reviewTarget && (
        <RatingModal
          tour={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={async ({ rating, comment }) => {
            await api.submitReview({ tourId: reviewTarget.tourId, rating, comment }).catch(() => {});
            setReviewTarget(null);
          }}
        />
      )}

      {/* ── Header ── */}
      <div className="db-header">
        <div className="container">
          <div className="db-header-left">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00F5D4&color=030712`} alt={user.name} className="db-avatar" />
            <div>
              <h1 className="db-greeting">Welcome back, <span className="db-name">{user.name?.split(' ')[0]}</span> 👋</h1>
              <p className="db-sub">Ready to explore somewhere amazing today?</p>
            </div>
          </div>
          <div className="db-header-actions">
            {unreadCount > 0 && (
              <div className="db-notif-pill">{unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</div>
            )}
            <Link to="/guides" className="db-btn-primary">
              <Search size={15} /> Find a Guide
            </Link>
            <Link to="/explore" className="db-btn-secondary">
              <Globe size={15} /> Browse Tours
            </Link>
          </div>
        </div>
      </div>

      {/* ── Verification Banner ── */}
      {!user.verified && (
        <div className="container">
          <div className="db-verify-banner">
            <ShieldAlert size={20} />
            <div>
              <strong>Verify your identity</strong>
              <span>Upload a government ID to unlock all features and book tours.</span>
            </div>
            <button className="db-btn-amber" onClick={() => setShowVerification(true)}>Verify Now</button>
          </div>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="container">
        <div className="db-stats">
          {[
            { icon: '🗓️', label: 'Upcoming Tours', value: upcoming.length, accent: 'teal' },
            { icon: '🏁', label: 'Completed', value: completed.length, accent: 'purple' },
            { icon: '⭐', label: 'Avg Rating Given', value: completed.filter(b => b.rating).length > 0 ? (completed.reduce((s, b) => s + (b.rating || 0), 0) / completed.filter(b => b.rating).length).toFixed(1) : '—', accent: 'amber' },
            { icon: '❤️', label: 'Wishlist', value: DEMO_WISHLIST.length, accent: 'rose' },
          ].map(s => (
            <div key={s.label} className={`db-stat-card db-stat-${s.accent}`}>
              <span className="db-stat-icon">{s.icon}</span>
              <span className="db-stat-value">{s.value}</span>
              <span className="db-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="container">
        <div className="db-tabs">
          {[
            { id: 'bookings', label: 'My Bookings', count: bookings.length },
            { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
            { id: 'completed', label: 'Completed', count: completed.length },
            { id: 'wishlist', label: 'Wishlist', count: DEMO_WISHLIST.length },
            { id: 'payments', label: 'Payments' },
          ].map(t => (
            <button
              key={t.id}
              className={`db-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.count !== undefined && <span className="db-tab-count">{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="container db-content">
        {/* ── Bookings Tab ── */}
        {activeTab === 'bookings' && (
          <>
            <div className="db-filter-row">
              <div className="db-search-wrap">
                <Search size={15} />
                <input
                  placeholder="Search by tour or guide..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="db-status-filters">
                {['all','pending','confirmed','completed','cancelled'].map(s => (
                  <button
                    key={s}
                    className={`db-filter-pill ${filterStatus === s ? 'active' : ''}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="db-loading">
                <div className="db-spinner" /> Loading your bookings...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="db-empty">
                <span>🌍</span>
                <h3>No bookings yet</h3>
                <p>Find an amazing local guide and book your first experience!</p>
                <Link to="/guides" className="db-btn-primary">Find a Guide</Link>
              </div>
            ) : (
              <div className="db-bookings-list">
                {filteredBookings.map(b => (
                  <div key={b.id} className="db-booking-card">
                    <img src={b.coverImage || b.tourCoverImage || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=120`} alt={b.tourTitle} className="db-booking-img" />
                    <div className="db-booking-info">
                      <div className="db-booking-title">{b.tourTitle || 'Virtual Tour'}</div>
                      <div className="db-booking-meta">
                        <span><MapPin size={12} /> {b.tourLocation || b.location}</span>
                        <span><Calendar size={12} /> {b.bookingDate}</span>
                        <span><Clock size={12} /> {b.bookingTime?.slice(0,5)}</span>
                      </div>
                      {b.guideName && (
                        <div className="db-booking-guide">
                          <img src={b.guideAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.guideName)}&background=8B5CF6&color=fff`} alt={b.guideName} />
                          <span>Guide: <strong>{b.guideName}</strong></span>
                        </div>
                      )}
                    </div>
                    <div className="db-booking-right">
                      <StatusBadge status={b.status} />
                      <div className="db-booking-amount">${b.totalAmount}</div>
                      <div className="db-booking-actions">
                        {b.status === 'confirmed' && (
                          <Link to={`/live/${b.tourId || '1'}`} className="db-btn-primary btn-sm">
                            <Play size={13} /> Join
                          </Link>
                        )}
                        {b.status === 'completed' && !b.rating && (
                          <button className="db-btn-secondary btn-sm" onClick={() => setReviewTarget(b)}>
                            <Star size={13} /> Review
                          </button>
                        )}
                        {b.status === 'completed' && b.rating && (
                          <span className="db-reviewed">★ {b.rating} Reviewed</span>
                        )}
                        <Link to={`/messages`} className="db-btn-ghost btn-sm">
                          <MessageCircle size={13} /> Chat
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Upcoming Tab ── */}
        {activeTab === 'upcoming' && (
          <div className="db-bookings-list">
            {upcoming.length === 0 ? (
              <div className="db-empty">
                <span>📅</span>
                <h3>No upcoming tours</h3>
                <p>Book your next adventure!</p>
                <Link to="/explore" className="db-btn-primary">Browse Tours</Link>
              </div>
            ) : upcoming.map(b => (
              <div key={b.id} className="db-booking-card db-booking-card--upcoming">
                <img src={b.coverImage || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=120`} alt={b.tourTitle} className="db-booking-img" />
                <div className="db-booking-info">
                  <div className="db-booking-title">{b.tourTitle}</div>
                  <div className="db-booking-meta">
                    <span><MapPin size={12} /> {b.tourLocation}</span>
                    <span><Calendar size={12} /> {b.bookingDate} · {b.bookingTime?.slice(0,5)}</span>
                  </div>
                  {b.guideName && (
                    <div className="db-booking-guide">
                      <img src={b.guideAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.guideName || 'G')}&background=8B5CF6&color=fff`} alt="" />
                      <span>Guide: <strong>{b.guideName}</strong></span>
                    </div>
                  )}
                </div>
                <div className="db-booking-right">
                  <StatusBadge status={b.status} />
                  {b.status === 'confirmed' && (
                    <Link to={`/live/${b.tourId || '1'}`} className="db-btn-primary" style={{ marginTop: '12px' }}>
                      <Play size={14} /> Join Tour
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Completed Tab ── */}
        {activeTab === 'completed' && (
          <div className="db-bookings-list">
            {completed.length === 0 ? (
              <div className="db-empty"><span>🏁</span><h3>No completed tours yet</h3><p>Complete your first tour and earn a stamp!</p></div>
            ) : completed.map(b => (
              <div key={b.id} className="db-booking-card">
                <img src={b.coverImage || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=120`} alt={b.tourTitle} className="db-booking-img" />
                <div className="db-booking-info">
                  <div className="db-booking-title">{b.tourTitle}</div>
                  <div className="db-booking-meta">
                    <span><MapPin size={12} /> {b.tourLocation}</span>
                    <span><Calendar size={12} /> {b.bookingDate}</span>
                  </div>
                  {b.rating && (
                    <div className="db-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} fill={i < b.rating ? '#FBBF24' : 'none'} stroke={i < b.rating ? '#FBBF24' : '#64748B'} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="db-booking-right">
                  <StatusBadge status="completed" />
                  <div className="db-booking-amount">${b.totalAmount}</div>
                  {!b.rating ? (
                    <button className="db-btn-primary btn-sm" onClick={() => setReviewTarget(b)}>
                      <Star size={13} /> Leave Review
                    </button>
                  ) : (
                    <Link to={`/tour/${b.tourId || '1'}`} className="db-btn-secondary btn-sm">Book Again</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Wishlist Tab ── */}
        {activeTab === 'wishlist' && (
          <div className="db-grid">
            {DEMO_WISHLIST.map(t => <TourCard key={t.id} tour={t} />)}
          </div>
        )}

        {/* ── Payments Tab ── */}
        {activeTab === 'payments' && (
          <div className="db-payments">
            <div className="db-wallet-card">
              <div className="db-wallet-label"><Wallet size={18} /> ZilliGo Wallet</div>
              <div className="db-wallet-amount">$0.00</div>
              <p>Funds from cancellations & promos appear here.</p>
              <button className="db-btn-primary">Top Up Wallet</button>
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Transaction History</h3>
            <div className="db-tx-list">
              {bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').map(b => (
                <div key={b.id} className="db-tx-row">
                  <div className="db-tx-icon"><CreditCard size={20} /></div>
                  <div className="db-tx-info">
                    <div>{b.tourTitle}</div>
                    <div className="db-tx-meta">{b.bookingDate} · Tour Booking</div>
                  </div>
                  <div className="db-tx-right">
                    <div className="db-tx-amount">-${b.totalAmount}</div>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
