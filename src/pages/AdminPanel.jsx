import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Users, Video, DollarSign, CheckCircle, ShieldAlert, MoreHorizontal, Globe, Clock, ArrowRight, Ban, MapPin, Settings, Power } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_STATS } from '../data/mockData';
import { api } from '../utils/api';
import './AdminPanel.css';

const PENDING_VERIFICATIONS = [
  { id: 'v1', name: 'Sophia Martinez', location: 'Barcelona, Spain', date: '2 hours ago', status: 'pending' },
  { id: 'v2', name: 'Liam Chen', location: 'Singapore', date: '5 hours ago', status: 'pending' },
  { id: 'v3', name: 'Amira Hassan', location: 'Cairo, Egypt', date: '1 day ago', status: 'pending' },
];

const RECENT_TRANSACTIONS = [
  { id: 'tx1', tour: 'Ancient Rome Walk', user: 'alex@...', amount: '$29.00', status: 'success', time: '10 min ago' },
  { id: 'tx2', tour: 'Tokyo Food', user: 'sarah@...', amount: '$35.00', status: 'success', time: '45 min ago' },
  { id: 'tx3', tour: 'Paris Art', user: 'mike@...', amount: '$32.00', status: 'refunded', time: '2 hours ago' },
];

export default function AdminPanel() {
  const { user, getAllUsers, updateUserStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemUsers, setSystemUsers] = useState([]);
  const [stats, setStats] = useState(ADMIN_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, statsData] = await Promise.all([
          getAllUsers(),
          api.getAdminStats()
        ]);
        setSystemUsers(usersData);
        if (statsData && !statsData.message) {
          setStats({ ...ADMIN_STATS, ...statsData });
        }
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAllUsers]);

  if (!user) return <Navigate to="/auth" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;

  const handleSuspend = async (userId, currentStatus) => {
    const success = await updateUserStatus(userId, { suspended: !currentStatus });
    if (success) {
      const updatedUsers = await getAllUsers();
      setSystemUsers(updatedUsers);
    }
  };

  const handleVerify = async (userId) => {
    const success = await updateUserStatus(userId, { verified: true });
    if (success) {
      const updatedUsers = await getAllUsers();
      setSystemUsers(updatedUsers);
    }
  };

  // Export users as CSV
  const handleExport = () => {
    const rows = systemUsers.length > 0 ? systemUsers : [{ id: 1, name: 'Admin', email: 'admin@zillgo.com', role: 'admin' }];
    const csv = ['ID,Name,Email,Role,Verified,Suspended', ...rows.map(u => `${u.id},"${u.name}",${u.email},${u.role},${u.verified},${u.suspended}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZillGO_Users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate report summary
  const handleReport = () => {
    const report = `ZillGO Platform Report\n========================\nGenerated: ${new Date().toLocaleString()}\n\nUsers: ${stats.users || stats.totalUsers || 0}\nTours: ${stats.tours || stats.totalGuides || 0}\nBookings: ${stats.bookings || 0}\nRevenue: $${stats.revenue || stats.monthlyRevenue || 0}\n\nExport this report from the admin panel for detailed analytics.`;
    alert(report);
  };

  return (
    <div className="page-wrapper admin-panel">
      <div className="admin-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)' }}>
                <ShieldAlert size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>System Admin</span>
              </div>
              <h1>Platform Command Center</h1>
            </div>
            <div className="admin-actions">
              <button className="btn btn-secondary btn-sm" onClick={handleExport}>Export CSV</button>
              <button className="btn btn-primary btn-sm" onClick={handleReport}>View Report</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
        {/* KPI Grid */}
        <div className="admin-kpis">
          {[
            { label: 'Total Users', value: stats.totalUsers?.toLocaleString() || stats.users?.toLocaleString(), icon: <Users size={20} />, change: '+12%' },
            { label: 'Active Guides', value: stats.totalGuides?.toLocaleString() || stats.tours?.toLocaleString(), icon: <Globe size={20} />, change: '+5%' },
            { label: 'Live Tours Now', value: stats.activeToursToday, icon: <Video size={20} />, change: '', color: 'var(--accent-rose)' },
            { label: 'Monthly Revenue', value: `$${(stats.monthlyRevenue / 1000).toFixed(1)}k`, icon: <DollarSign size={20} />, change: '+22%' },
          ].map(k => (
            <div key={k.label} className="admin-kpi glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ color: k.color || 'var(--accent-teal)', background: k.color ? 'rgba(244,63,94,0.1)' : 'var(--accent-teal-glow)', padding: '8px', borderRadius: '8px' }}>
                  {k.icon}
                </div>
                {k.change && <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 600 }}>↑ {k.change}</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-tabs" style={{ marginTop: 'var(--space-2xl)' }}>
          {['overview', 'users', 'verifications', 'transactions', 'system'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'verifications' && <span className="badge badge-amber" style={{ marginLeft: 6, padding: '2px 6px', fontSize: '0.65rem' }}>{stats.pendingVerifications || 0}</span>}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="glass-card" style={{ padding: 'var(--space-xl)', border: '1px solid var(--accent-rose)', background: 'rgba(244, 63, 94, 0.05)', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-rose)', marginBottom: 'var(--space-md)' }}>
                <ShieldAlert size={20} />
                <h3 style={{ margin: 0 }}>Active Emergency Alerts</h3>
              </div>
              <div style={{ padding: '12px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>Emergency Triggered: Rome History Tour</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Triggered by User: alex@example.com · 2 mins ago</div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}>Respond Now</button>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                <h3>Pending Guide Verifications</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('verifications')}>View All <ArrowRight size={14} /></button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Submitted</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PENDING_VERIFICATIONS.map(v => (
                      <tr key={v.id}>
                        <td style={{ fontWeight: 600 }}>{v.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}><MapPin size={12} /> {v.location}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{v.date}</td>
                        <td>
                          <button className="btn btn-primary btn-sm" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Review ID</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
                <h3>Recent Transactions</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('transactions')}>View All <ArrowRight size={14} /></button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tour</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_TRANSACTIONS.map(tx => (
                      <tr key={tx.id}>
                        <td style={{ fontWeight: 500 }}>{tx.tour}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.user}</td>
                        <td style={{ fontWeight: 600, color: 'var(--accent-teal)' }}>{tx.amount}</td>
                        <td>
                          <span className={`badge ${tx.status === 'success' ? 'badge-teal' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Account Moderation</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {systemUsers.map(u => (
                    <tr key={u.id} style={{ opacity: u.suspended ? 0.6 : 1 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={u.avatar} alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {u.suspended ? (
                            <span className="badge badge-rose" style={{ fontSize: '0.65rem', width: 'fit-content' }}><Ban size={10} /> Suspended</span>
                          ) : (
                            <span className="badge badge-teal" style={{ fontSize: '0.65rem', width: 'fit-content' }}>Active</span>
                          )}
                          {!u.verified && <span className="badge badge-amber" style={{ fontSize: '0.65rem', width: 'fit-content' }}>Unverified</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                           {!u.verified && (
                             <button onClick={() => handleVerify(u.id)} className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Verify</button>
                           )}
                           {u.id !== user.id && (
                             <button onClick={() => handleSuspend(u.id, u.suspended)} className={`btn btn-sm ${u.suspended ? 'btn-secondary' : 'btn-ghost'}`} style={{ padding: '4px 10px', fontSize: '0.7rem', color: u.suspended ? 'var(--text-primary)' : 'var(--accent-rose)' }}>
                               {u.suspended ? 'Unsuspend' : 'Suspend'}
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Pending Identity Verifications</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guide/User</th>
                    <th>Document Type</th>
                    <th>Submitted</th>
                    <th>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {PENDING_VERIFICATIONS.map(v => (
                    <tr key={v.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{v.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.location}</div>
                      </td>
                      <td>Passport / National ID</td>
                      <td>{v.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-primary btn-sm" style={{ fontSize: '0.75rem' }}>Approve</button>
                          <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h3>Platform Transactions</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select className="input btn-sm" style={{ width: '150px' }}>
                  <option>All Time</option>
                  <option>This Month</option>
                  <option>Today</option>
                </select>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction Details</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Guide Split</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'May 02, 10:15 AM', item: 'Ancient Rome Tour', type: 'Booking', amount: '$29.00', split: '$23.20', status: 'success' },
                    { date: 'May 02, 09:45 AM', item: 'Silk Scarf (Shopping)', type: 'Product', amount: '$45.00', split: '$36.00', status: 'success' },
                    { date: 'May 02, 08:30 AM', item: 'Tokyo Street Food', type: 'Booking', amount: '$35.00', split: '$28.00', status: 'refunded' },
                  ].map((tx, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.date}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{tx.item}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TXID: ZGO-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                      </td>
                      <td><span className="badge btn-sm" style={{ fontSize: '0.65rem' }}>{tx.type}</span></td>
                      <td style={{ fontWeight: 700 }}>{tx.amount}</td>
                      <td style={{ color: 'var(--accent-teal)' }}>{tx.split}</td>
                      <td><span className={`badge ${tx.status === 'success' ? 'badge-teal' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'system' && (
          <div className="admin-system slide-up">
            <div className="grid-2">
              <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={20} /> Platform Configuration
                </h3>
                <form className="form" onSubmit={(e) => { e.preventDefault(); alert('System settings saved!'); }}>
                  <div className="form-group">
                    <label className="form-label">Platform Commission (%)</label>
                    <input type="number" className="input" defaultValue="20" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Global Payout Threshold ($)</label>
                    <input type="number" className="input" defaultValue="50" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Featured Cities (CSV)</label>
                    <input type="text" className="input" defaultValue="Rome, Tokyo, Paris, Dubai" />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Platform</button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                <div className="glass-card" style={{ padding: 'var(--space-xl)', border: '1px solid var(--accent-rose)', background: 'rgba(244, 63, 94, 0.05)' }}>
                  <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)' }}>
                    <Power size={20} /> Maintenance Mode
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>When enabled, all public pages will redirect to a maintenance screen. Admin access remains active.</p>
                  <button className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)', width: '100%' }}
                    onClick={() => {
                      if (window.confirm('Enable maintenance mode? All public pages will redirect to a maintenance screen. You can disable this anytime.')) {
                        alert('Maintenance mode enabled. To disable, redeploy with MAINTENANCE_MODE=false env variable.');
                      }
                    }}
                  >Enable Maintenance Mode</button>
                </div>

                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                  <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={20} /> Security Settings
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Require Guide ID', sub: 'Mandatory ID for new guides' },
                      { label: 'Moderate Chat', sub: 'AI filtering for inappropriate messages' },
                      { label: 'Global 2FA', sub: 'Require 2FA for all admin actions' },
                    ].map(s => (
                      <label key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{s.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.sub}</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--accent-teal)' }} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
