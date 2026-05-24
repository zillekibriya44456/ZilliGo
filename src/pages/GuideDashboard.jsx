import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { TrendingUp, Star, Users, DollarSign, Calendar, Play, BarChart3, Clock, CheckCircle, AlertCircle, MapPin, Upload, CreditCard, Bell, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TOURS } from '../data/mockData';
import './GuideDashboard.css';

const EARNINGS_DATA = [
  { month: 'Nov', amount: 1200 },
  { month: 'Dec', amount: 1800 },
  { month: 'Jan', amount: 1500 },
  { month: 'Feb', amount: 2200 },
  { month: 'Mar', amount: 2800 },
  { month: 'Apr', amount: 3100 },
];

const UPCOMING_SESSIONS = [
  { id: 1, title: 'Bangalore Tech Tour', time: 'Today, 11:00 AM', participants: 6, status: 'confirmed' },
  { id: 2, title: 'Silicon Valley of India', time: 'May 5, 2:00 PM', participants: 8, status: 'confirmed' },
  { id: 3, title: 'Food Trail Bangalore', time: 'May 8, 10:00 AM', participants: 4, status: 'pending' },
];

export default function GuideDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [coverPhoto, setCoverPhoto] = useState(null);

  if (!user) return <Navigate to="/auth" />;
  if (user.role !== 'guide') return <Navigate to="/dashboard" />;

  const maxEarning = Math.max(...EARNINGS_DATA.map(d => d.amount));

  return (
    <div className="page-wrapper gd-page">
      <div className="gd-header">
        <div className="container">
          <div className="gd-welcome">
            <img src={user.avatar} alt={user.name} className="dashboard-avatar" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1>Guide Dashboard</h1>
                <span className="badge badge-teal">✓ Verified</span>
              </div>
              <p>Welcome back, <strong>{user.name}</strong> · {user.location}</p>
            </div>
          </div>
          <div className="gd-header-actions">
            <span className="gd-status-pill">🟢 Available for Bookings</span>
            <Link to="/explore" className="btn btn-secondary btn-sm">View My Tours</Link>
          </div>
        </div>
      </div>

      <div className="container gd-body">
        {/* KPI Cards */}
        <div className="gd-kpis">
          {[
            { icon: <DollarSign size={22} />, label: 'Total Earnings', value: `$${user.earnings?.toLocaleString() || '8,450'}`, sub: '+18% this month', color: 'teal' },
            { icon: <Star size={22} />, label: 'Rating', value: user.rating || '4.7', sub: '389 reviews', color: 'amber' },
            { icon: <Users size={22} />, label: 'Total Travelers', value: '1,247', sub: '47 this month', color: 'purple' },
            { icon: <Calendar size={22} />, label: 'Tours Done', value: '456', sub: '12 this month', color: 'blue' },
          ].map(k => (
            <div key={k.label} className={`gd-kpi glass-card gd-kpi--${k.color}`}>
              <div className="gd-kpi__icon">{k.icon}</div>
              <div className="gd-kpi__value">{k.value}</div>
              <div className="gd-kpi__label">{k.label}</div>
              <div className="gd-kpi__sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {['overview', 'sessions', 'earnings', 'create', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}>
              {tab === 'create' ? '+ Create Listing' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="gd-overview">
            {/* Earnings Chart */}
            <div className="gd-chart-card glass-card">
              <div className="gd-chart-header">
                <h3>Earnings (6 months)</h3>
                <span className="badge badge-teal">+18% ↑</span>
              </div>
              <div className="gd-bar-chart">
                {EARNINGS_DATA.map(d => (
                  <div key={d.month} className="gd-bar-item">
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

            {/* Upcoming Sessions */}
            <div className="gd-sessions-preview">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h3>Upcoming Sessions</h3>
                <button onClick={() => setActiveTab('sessions')} className="btn btn-ghost btn-sm">View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {UPCOMING_SESSIONS.map(s => (
                  <div key={s.id} className="gd-session-item glass-card">
                    <div className="gd-session-info">
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.title}</div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><Clock size={11} /> {s.time}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><Users size={11} /> {s.participants} travelers</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge ${s.status === 'confirmed' ? 'badge-teal' : 'badge-amber'}`}>{s.status}</span>
                      <Link to="/live/1" className="btn btn-primary btn-sm"><Play size={13} /> Start</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="gd-tips glass-card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>📈 Pro Tips</h3>
              {[
                { icon: '📸', tip: 'Add high-quality photos to your profile to get 3x more bookings.' },
                { icon: '🌍', tip: 'Guides who speak 3+ languages earn 40% more on average.' },
                { icon: '⭐', tip: 'Respond to bookings within 2 minutes for Top Guide status.' },
              ].map(t => (
                <div key={t.tip} className="gd-tip-item">
                  <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions */}
        {activeTab === 'sessions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-3xl)' }}>
            {UPCOMING_SESSIONS.map(s => (
              <div key={s.id} className="gd-session-item glass-card" style={{ padding: 'var(--space-lg)' }}>
                <div className="gd-session-info">
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><Clock size={12} /> {s.time}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><Users size={12} /> {s.participants} participants</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`badge ${s.status === 'confirmed' ? 'badge-teal' : 'badge-amber'}`}>{s.status}</span>
                  <Link to="/live/1" className="btn btn-primary btn-sm">Join</Link>
                  <button className="btn btn-ghost btn-sm">Reschedule</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings */}
        {activeTab === 'earnings' && (
          <div className="gd-earnings-tab" style={{ paddingBottom: 'var(--space-3xl)' }}>
            <div className="grid-3">
              {[
                { label: 'This Month', value: '$3,100', change: '+18%' },
                { label: 'Last Month', value: '$2,800', change: '+12%' },
                { label: 'All Time', value: '$8,450', change: '' },
              ].map(e => (
                <div key={e.label} className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--accent-teal)', margin: '8px 0' }}>{e.value}</div>
                  {e.change && <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)' }}>↑ {e.change}</div>}
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Payout History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[{ date: 'Apr 30', amount: '$2,635', status: 'paid' }, { date: 'Mar 31', amount: '$2,380', status: 'paid' }, { date: 'Feb 28', amount: '$1,870', status: 'paid' }].map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{p.date}</span>
                    <strong style={{ color: 'var(--accent-teal)' }}>{p.amount}</strong>
                    <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>✓ {p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Listing */}
        {activeTab === 'create' && (
          <div className="gd-create-tab glass-card" style={{ padding: 'var(--space-2xl)' }}>
            <h2 style={{ marginBottom: 'var(--space-sm)' }}>Create a New Listing</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>Publish a standard tour or monetize a special live event (like a wedding or festival).</p>
            
            <form className="form" onSubmit={(e) => { e.preventDefault(); alert('Listing published successfully!'); setActiveTab('overview'); }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Listing Title</label>
                  <input type="text" className="input" placeholder="e.g. Kyoto Cherry Blossom Walk" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location (City, Country)</label>
                  <input type="text" className="input" placeholder="e.g. Kyoto, Japan" required />
                </div>
              </div>
              
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Listing Type</label>
                  <select className="input" required>
                    <option value="standard">Standard Virtual Tour</option>
                    <option value="event">Special Event (Wedding, Concert)</option>
                    <option value="shopping">Live Personal Shopping</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ticket Price (USD)</label>
                  <input type="number" className="input" placeholder="25" required />
                </div>
              </div>

              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <select className="input" required>
                    <option value="30">30 mins</option>
                    <option value="60">60 mins</option>
                    <option value="90">90 mins</option>
                    <option value="120">120 mins</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Participants</label>
                  <input type="number" className="input" placeholder="20" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Language</label>
                  <select className="input" required>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Included Features</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginTop: '8px' }}>
                  {['Interactive Q&A', 'High-Res Photos', 'Post-tour Guidebook', 'Live Polling', 'Shopping Access'].map(feature => (
                    <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--accent-teal)' }} />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="input" rows="4" placeholder="Describe the experience..." required></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Photo</label>
                <div style={{ position: 'relative', border: '2px dashed var(--border-glass-strong)', borderRadius: 'var(--radius-md)', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.2s ease' }}
                     onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-teal)'}
                     onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-glass-strong)'}>
                   <input type="file" accept="image/*" onChange={(e) => setCoverPhoto(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                   {coverPhoto ? (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)' }}>
                       <CheckCircle size={20} />
                       <strong>{coverPhoto.name}</strong>
                     </div>
                   ) : (
                     <>
                       <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                       <p style={{ color: 'var(--text-muted)', margin: 0 }}>Drag and drop an image, or click to browse.</p>
                     </>
                   )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-lg)' }}>
                Publish Listing
              </button>
            </form>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="gd-settings slide-up">
            <div className="grid-2">
              <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} /> Profile Settings
                </h3>
                <form className="form" onSubmit={(e) => { e.preventDefault(); alert('Profile updated!'); }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="input" defaultValue={user.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="input" rows="4" defaultValue={user.bio || "Professional guide dedicated to sharing local stories..."}></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="input" defaultValue={user.location} />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                  <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={20} /> Payout Settings
                  </h3>
                  <div style={{ background: 'rgba(0, 212, 170, 0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-teal)', marginBottom: 'var(--space-md)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: 600, marginBottom: '4px' }}>STRIPE CONNECTED</div>
                    <div style={{ fontWeight: 700 }}>Bank Account ending in ****4242</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>Update Payout Method</button>
                </div>

                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                  <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={20} /> Notifications
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Booking Requests', sub: 'Instant email for new tour requests' },
                      { label: 'Chat Messages', sub: 'Mobile push for traveler messages' },
                      { label: 'Payout Alerts', sub: 'Notifications when funds are cleared' },
                    ].map(n => (
                      <label key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{n.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.sub}</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent-teal)' }} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: 'var(--space-xl)', border: '1px solid var(--accent-amber)', background: 'rgba(245, 158, 11, 0.05)' }}>
                  <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
                    <AlertCircle size={20} /> Availability
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Toggle your status to control if you appear in "Instant Match" results.</p>
                  <button className="btn btn-primary" style={{ background: 'var(--accent-amber)', borderColor: 'var(--accent-amber)', color: '#000', width: '100%' }}>Go Offline</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
