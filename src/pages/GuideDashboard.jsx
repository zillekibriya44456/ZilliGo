import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, Star, Users, DollarSign, Calendar, Play,
  BarChart3, Clock, CheckCircle, AlertCircle, MapPin,
  Upload, CreditCard, Bell, XCircle, MessageCircle, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './Dashboard.css';
import './GuideDashboard.css';

const DEFAULT_STATS = { netEarnings: 0, totalBookings: 0, avgRating: 0, reviewCount: 0, totalTours: 0, monthlyEarnings: [] };

const StatusBadge = ({ status }) => {
  const map = {
    pending:   { cls: 'badge-amber',  label: '⏳ Pending' },
    confirmed: { cls: 'badge-teal',   label: '✅ Confirmed' },
    completed: { cls: 'badge-purple', label: '🏁 Completed' },
    declined:  { cls: 'badge-error',  label: '🚫 Declined' },
    cancelled: { cls: 'badge-error',  label: '❌ Cancelled' },
  };
  const s = map[status] || { cls: 'badge-amber', label: status };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

export default function GuideDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  if (!user) return <Navigate to="/auth" />;
  if (user.role !== 'guide' && user.role !== 'admin') return <Navigate to="/dashboard" />;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bData, sData, nData] = await Promise.all([
          api.getGuideBookings().catch(() => null),
          api.getGuideStats().catch(() => null),
          api.getNotifications().catch(() => []),
        ]);
        setBookings(Array.isArray(bData) ? bData : []);
        setNotifications(Array.isArray(nData) ? nData : []);
        if (sData && sData.totalTours !== undefined) setStats(sData);
      } catch (err) {
        setBookings([]);
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleStartLiveTour = async (tourId) => {
    try {
      if (!tourId) return alert('Tour ID not found');
      const data = await api.startLiveStream(tourId);
      if (data.liveStreamId) {
        navigate(`/live/${data.liveStreamId}`);
      } else {
        alert(data.message || 'Error starting live stream');
      }
    } catch (err) {
      alert('Network error starting stream');
      console.error(err);
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    setActionLoading(bookingId);
    try {
      await api.updateBookingStatus(bookingId, status).catch(() => {});
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const monthlyData = stats.monthlyEarnings && stats.monthlyEarnings.length > 0 ? stats.monthlyEarnings : [{month: 'No Data', amount: 0}];
  const maxEarning = Math.max(...monthlyData.map(d => d.amount), 1);

  return (
    <div className="gd-page">
      {/* ── Header ── */}
      <div className="gd-header">
        <div className="container">
          <div className="gd-welcome">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8B5CF6&color=fff`}
              alt={user.name}
              className="db-avatar"
            />
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Guide Dashboard
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', margin: 0 }}>
                Welcome back, <strong style={{ color: '#F8FAFC' }}>{user.name}</strong>
                {unreadCount > 0 && <span style={{ color: '#FBBF24', marginLeft: '8px' }}>· {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</span>}
              </p>
            </div>
          </div>
          <div className="gd-header-actions">
            <button
              className={`gd-status-pill ${!isAvailable ? 'gd-status-offline' : ''}`}
              onClick={() => setIsAvailable(p => !p)}
              style={{ cursor: 'pointer', border: 'none' }}
            >
              {isAvailable ? '🟢 Available for Bookings' : '🔴 Not Available'}
            </button>
            <Link to="/explore" className="db-btn-secondary">View My Tours</Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── KPI Cards ── */}
        <div className="gd-kpis">
          {[
            { icon: <DollarSign size={22} />, label: 'Net Earnings', value: `$${stats.netEarnings.toLocaleString()}`, sub: '85% after platform fee', color: 'teal' },
            { icon: <Star size={22} />, label: 'Rating', value: stats.avgRating.toFixed(1), sub: `${stats.reviewCount} reviews`, color: 'amber' },
            { icon: <Users size={22} />, label: 'Total Bookings', value: stats.totalBookings, sub: `${pendingRequests.length} pending`, color: 'purple' },
            { icon: <Calendar size={22} />, label: 'Active Listings', value: stats.totalTours, sub: 'Published tours', color: 'blue' },
          ].map(k => (
            <div key={k.label} className={`gd-kpi glass-card gd-kpi--${k.color}`}>
              <div className="gd-kpi__icon">{k.icon}</div>
              <div className="gd-kpi__value">{k.value}</div>
              <div className="gd-kpi__label">{k.label}</div>
              <div className="gd-kpi__sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="db-tabs">
          {[
            { id: 'requests', label: 'Booking Requests', count: pendingRequests.length },
            { id: 'confirmed', label: 'Confirmed', count: confirmedBookings.length },
            { id: 'completed', label: 'Completed', count: completedBookings.length },
            { id: 'earnings', label: 'Earnings' },
            { id: 'create',   label: '+ New Listing' },
            { id: 'settings', label: 'Settings' },
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

        {/* ── Booking Requests ── */}
        {activeTab === 'requests' && (
          <div className="db-content">
            {loading ? (
              <div className="db-loading"><div className="db-spinner" /> Loading requests...</div>
            ) : pendingRequests.length === 0 ? (
              <div className="db-empty">
                <span>📬</span>
                <h3>No pending requests</h3>
                <p>New booking requests from travelers will appear here.</p>
              </div>
            ) : (
              pendingRequests.map(b => (
                <div key={b.id} className={`gd-request-card ${b.status}`}>
                  <img
                    src={b.tourCoverImage || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=120`}
                    alt={b.tourTitle}
                    className="gd-request-img"
                  />
                  <div className="gd-request-info">
                    <div className="gd-request-title">{b.tourTitle}</div>
                    <div className="gd-request-meta">
                      <span><Calendar size={12} /> {b.bookingDate}</span>
                      <span><Clock size={12} /> {b.bookingTime?.slice(0,5)}</span>
                      <span><Users size={12} /> {b.participants || 1} participant{(b.participants || 1) !== 1 ? 's' : ''}</span>
                      <span><DollarSign size={12} /> ${b.totalAmount}</span>
                    </div>
                    <div className="gd-request-traveler">
                      <img
                        src={b.travelerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.travelerName || 'T')}&background=00F5D4&color=030712`}
                        alt={b.travelerName}
                      />
                      <span>Traveler: <strong>{b.travelerName}</strong></span>
                    </div>
                  </div>
                  <div className="gd-request-actions">
                    <StatusBadge status={b.status} />
                    <button
                      className="db-btn-primary btn-sm"
                      disabled={actionLoading === b.id}
                      onClick={() => handleBookingAction(b.id, 'confirmed')}
                    >
                      {actionLoading === b.id ? '...' : <><CheckCircle size={13} /> Accept</>}
                    </button>
                    <button
                      className="db-btn-ghost btn-sm"
                      style={{ color: '#FB7185', borderColor: 'rgba(244,63,94,0.2)' }}
                      disabled={actionLoading === b.id}
                      onClick={() => handleBookingAction(b.id, 'declined')}
                    >
                      <XCircle size={13} /> Decline
                    </button>
                    <Link to="/messages" className="db-btn-ghost btn-sm">
                      <MessageCircle size={13} /> Message
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Confirmed Bookings ── */}
        {activeTab === 'confirmed' && (
          <div className="db-content">
            {confirmedBookings.length === 0 ? (
              <div className="db-empty"><span>✅</span><h3>No confirmed bookings</h3><p>Accept pending requests to fill your calendar.</p></div>
            ) : confirmedBookings.map(b => (
              <div key={b.id} className="gd-request-card confirmed">
                <img src={b.tourCoverImage || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=120`} alt={b.tourTitle} className="gd-request-img" />
                <div className="gd-request-info">
                  <div className="gd-request-title">{b.tourTitle}</div>
                  <div className="gd-request-meta">
                    <span><Calendar size={12} /> {b.bookingDate}</span>
                    <span><Clock size={12} /> {b.bookingTime?.slice(0,5)}</span>
                    <span><Users size={12} /> {b.participants || 1} travelers</span>
                  </div>
                  <div className="gd-request-traveler">
                    <img src={b.travelerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.travelerName || 'T')}&background=00F5D4&color=030712`} alt="" />
                    <span>{b.travelerName}</span>
                  </div>
                </div>
                <div className="gd-request-actions">
                  <StatusBadge status="confirmed" />
                  <button onClick={() => handleStartLiveTour(b.tourId)} className="db-btn-primary btn-sm">
                    <Play size={13} /> Start Tour
                  </button>
                  <button className="db-btn-ghost btn-sm" onClick={() => handleBookingAction(b.id, 'completed')}>
                    <CheckCircle size={13} /> Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Completed ── */}
        {activeTab === 'completed' && (
          <div className="db-content">
            {completedBookings.length === 0 ? (
              <div className="db-empty"><span>🏁</span><h3>No completed tours yet</h3></div>
            ) : completedBookings.map(b => (
              <div key={b.id} className="gd-request-card">
                <img src={b.tourCoverImage || `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=120`} alt={b.tourTitle} className="gd-request-img" />
                <div className="gd-request-info">
                  <div className="gd-request-title">{b.tourTitle}</div>
                  <div className="gd-request-meta">
                    <span><Calendar size={12} /> {b.bookingDate}</span>
                    <span><DollarSign size={12} /> ${(b.totalAmount * 0.85).toFixed(0)} earned</span>
                  </div>
                  <div className="gd-request-traveler">
                    <img src={b.travelerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.travelerName || 'T')}&background=00F5D4&color=030712`} alt="" />
                    <span>{b.travelerName}</span>
                  </div>
                </div>
                <div className="gd-request-actions">
                  <StatusBadge status="completed" />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00F5D4' }}>${(b.totalAmount * 0.85).toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Earnings ── */}
        {activeTab === 'earnings' && (
          <div className="db-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Wallet */}
              <div className="db-wallet-card">
                <div className="db-wallet-label"><DollarSign size={18} /> Available Balance</div>
                <div className="db-wallet-amount">${stats.netEarnings.toLocaleString()}</div>
                <p>Cleared funds ready for withdrawal</p>
                <button className="db-btn-primary" onClick={() => alert('Initiating Stripe Connect payout...')}>
                  Withdraw Funds
                </button>
              </div>

              {/* Pending */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="gd-kpi glass-card gd-kpi--amber">
                  <div className="gd-kpi__label">Pending (Escrow)</div>
                  <div className="gd-kpi__value">$1,200</div>
                  <div className="gd-kpi__sub">Funds from upcoming confirmed tours</div>
                </div>
                <div className="gd-kpi glass-card">
                  <div className="gd-kpi__label">Lifetime Gross</div>
                  <div className="gd-kpi__value" style={{ color: '#F8FAFC' }}>$18,450</div>
                  <div className="gd-kpi__sub">Total across {stats.totalBookings} bookings</div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="gd-chart-header">
                <h3>Monthly Earnings</h3>
                <span className="badge badge-teal">+18% ↑</span>
              </div>
              <div className="gd-bar-chart">
                {monthlyData.map(d => (
                  <div key={d.month} className="gd-chart-col">
                    <div className="gd-bar-wrap">
                      <div className="gd-bar" style={{ height: `${(d.amount / maxEarning) * 100}%` }}>
                        <span className="gd-bar-tip">${d.amount}</span>
                      </div>
                    </div>
                    <span className="gd-bar-label">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Create Listing ── */}
        {activeTab === 'create' && (
          <div className="db-content">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>Create a New Tour Listing</h2>
              <p style={{ color: '#94A3B8', marginBottom: '2rem', fontSize: '0.9rem' }}>
                Publish a virtual or in-person experience. Travelers can discover and book it immediately.
              </p>
              <form onSubmit={async e => { 
                e.preventDefault(); 
                try {
                  const fd = new FormData(e.target);
                  await api.createTour({
                    title: fd.get('title'),
                    location: fd.get('location'),
                    price: parseFloat(fd.get('price')),
                    duration_minutes: parseInt(fd.get('duration')),
                    max_participants: parseInt(fd.get('max_participants') || 20),
                    description: fd.get('description'),
                    category: 'Culture',
                    kid_friendly: true,
                    cover_image: 'https://images.unsplash.com/photo-1542051812899-2531021487f5?w=800&q=80'
                  });
                  alert('✅ Listing published! Travelers can now book it.'); 
                  window.location.reload();
                } catch(err) {
                  alert('Error publishing listing');
                }
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="gd-label">Tour Title *</label>
                    <input name="title" type="text" className="gd-input" placeholder="e.g. Kyoto Cherry Blossom Walk" required />
                  </div>
                  <div>
                    <label className="gd-label">Location *</label>
                    <input name="location" type="text" className="gd-input" placeholder="e.g. Kyoto, Japan" required />
                  </div>
                  <div>
                    <label className="gd-label">Price (USD) *</label>
                    <input name="price" type="number" className="gd-input" placeholder="45" min="1" required />
                  </div>
                  <div>
                    <label className="gd-label">Duration</label>
                    <select name="duration" className="gd-input">
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                    </select>
                  </div>
                  <div>
                    <label className="gd-label">Max Participants</label>
                    <input name="max_participants" type="number" className="gd-input" placeholder="20" min="1" />
                  </div>
                  <div>
                    <label className="gd-label">Category</label>
                    <select className="gd-input">
                      <option>Cultural</option>
                      <option>Food</option>
                      <option>Historical</option>
                      <option>Adventure</option>
                      <option>Nature</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="gd-label">Description *</label>
                  <textarea name="description" className="gd-input" rows={4} placeholder="Describe what travelers will see and do..." required style={{ resize: 'vertical' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="gd-label">Cover Photo</label>
                  <label className="gd-upload-zone" htmlFor="cover-photo">
                    {coverPhoto ? (
                      <div style={{ color: '#00F5D4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} /> {coverPhoto.name}
                      </div>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: '#64748B', marginBottom: '8px' }} />
                        <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Click to upload cover image</span>
                      </>
                    )}
                    <input id="cover-photo" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setCoverPhoto(e.target.files[0])} />
                  </label>
                </div>
                <button type="submit" className="db-btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                  Publish Listing
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {activeTab === 'settings' && (
          <div className="db-content">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Profile */}
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={18} /> Profile Settings
                </h3>
                <form onSubmit={e => { e.preventDefault(); alert('✅ Profile updated!'); }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="gd-label">Full Name</label>
                    <input type="text" className="gd-input" defaultValue={user.name} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="gd-label">Location</label>
                    <input type="text" className="gd-input" defaultValue={user.location || ''} placeholder="Your city" />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="gd-label">Bio</label>
                    <textarea className="gd-input" rows={4} defaultValue={user.bio || ''} placeholder="Tell travelers about yourself..." style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="db-btn-primary">Save Changes</button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Payout */}
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} /> Payout Method
                  </h3>
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.2)', borderRadius: '10px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#00F5D4', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Stripe Connected</div>
                    <div style={{ fontWeight: 700 }}>Bank ending in ****4242</div>
                  </div>
                  <button className="db-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Update Payout Method
                  </button>
                </div>

                {/* Notifications */}
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} /> Notifications
                  </h3>
                  {[
                    { label: 'New Booking Requests', sub: 'Instant email & push' },
                    { label: 'Traveler Messages', sub: 'In-app & push' },
                    { label: 'Payout Confirmations', sub: 'Email when funds clear' },
                  ].map(n => (
                    <label key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{n.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{n.sub}</div>
                      </div>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#00F5D4' }} />
                    </label>
                  ))}
                </div>

                {/* Availability */}
                <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <h3 style={{ marginBottom: '0.75rem', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} /> Availability
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1rem' }}>
                    Toggle to control if travelers can book you via Instant Match.
                  </p>
                  <button
                    className={isAvailable ? 'db-btn-amber' : 'db-btn-primary'}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setIsAvailable(p => !p)}
                  >
                    {isAvailable ? '🔴 Go Offline' : '🟢 Go Online'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
