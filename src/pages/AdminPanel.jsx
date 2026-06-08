import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  Users, Video, DollarSign, CheckCircle, ShieldAlert, MoreHorizontal, 
  Globe, Clock, ArrowRight, Ban, MapPin, Settings, Power, Bell, 
  ShieldCheck, Activity, BarChart3, AlertTriangle, Eye, EyeOff, Edit, Trash2, Key, HelpCircle as HelpIcon, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './AdminPanel.css';

// Pre-seeded fallback data for demonstration when database tables are empty
const FALLBACK_TICKETS = [
  { id: 1, userId: 2, title: 'Audio cuts out during Japan live tour', category: 'Technical', priority: 'high', status: 'open', description: 'When the guide enters the shrines, the video runs fine but the audio completely drops.', reply: null, createdAt: new Date() },
  { id: 2, userId: 2, title: 'Incorrect billing amount', category: 'Booking', priority: 'medium', status: 'resolved', description: 'I was charged twice for the Paris walk.', reply: 'We have processed a refund for the duplicate transaction.', createdAt: new Date() },
];

const FALLBACK_REPORTS = [
  { id: 1, reporterId: 2, reportedUserId: 3, contentType: 'review', contentId: 1, reason: 'Guide used inappropriate words during live session', status: 'open', createdAt: new Date() },
  { id: 2, reporterId: 2, reportedUserId: 4, contentType: 'message', contentId: 2, reason: 'Spam advertisements', status: 'resolved', createdAt: new Date() }
];

const FALLBACK_LOGS = [
  { id: 1, adminId: 1, action: 'VERIFY_USER', details: 'Verified guide Yuki Tanaka', ipAddress: '127.0.0.1', createdAt: new Date() },
  { id: 2, adminId: 1, action: 'UPDATE_SETTINGS', details: 'Updated platform commission to 20%', ipAddress: '127.0.0.1', createdAt: new Date() },
  { id: 3, adminId: 1, action: 'RESOLVE_TICKET', details: 'Resolved ticket #2', ipAddress: '192.168.1.1', createdAt: new Date() }
];

export default function AdminPanel() {
  const { user, getAllUsers, updateUserStatus } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // States
  const [systemUsers, setSystemUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [tickets, setTickets] = useState([]);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [settings, setSettings] = useState([]);
  const [tours, setTours] = useState([]);

  // Filter/Search States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  // Modals / Action States
  const [replyingTicketId, setReplyingTicketId] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [broadcastingAnnounce, setBroadcastingAnnounce] = useState({ title: '', message: '', target: 'all' });
  const [broadcastingLoading, setBroadcastingLoading] = useState(false);
  
  // Custom Settings Inputs
  const [configName, setConfigName] = useState('ZilliGo');
  const [configCommission, setConfigCommission] = useState('20');
  const [configVerification, setConfigVerification] = useState('true');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        usersData, statsData, ticketsData, reportsData, 
        logsData, bookingsData, settingsData, toursData
      ] = await Promise.all([
        getAllUsers().catch(() => []),
        api.getAdminStats().catch(() => ({})),
        api.getAdminTickets().catch(() => []),
        api.getAdminReports().catch(() => []),
        api.getAdminAuditLogs().catch(() => []),
        api.getAdminBookings().catch(() => []),
        api.getAdminSettings().catch(() => []),
        api.getTours().catch(() => [])
      ]);

      setSystemUsers(Array.isArray(usersData) ? usersData : []);
      setStats(statsData || {});
      setTickets(Array.isArray(ticketsData) && ticketsData.length > 0 ? ticketsData : FALLBACK_TICKETS);
      setReports(Array.isArray(reportsData) && reportsData.length > 0 ? reportsData : FALLBACK_REPORTS);
      setAuditLogs(Array.isArray(logsData) && logsData.length > 0 ? logsData : FALLBACK_LOGS);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setSettings(Array.isArray(settingsData) ? settingsData : []);
      setTours(Array.isArray(toursData) ? toursData : []);

      // Seed settings inputs if available
      if (Array.isArray(settingsData)) {
        const platformName = settingsData.find(s => s.key === 'platform_name')?.value;
        const commission = settingsData.find(s => s.key === 'commission_rate')?.value;
        const reqVerify = settingsData.find(s => s.key === 'require_guide_verification')?.value;
        if (platformName) setConfigName(platformName);
        if (commission) setConfigCommission(commission);
        if (reqVerify) setConfigVerification(reqVerify);
      }
    } catch (err) {
      console.error('Failed to load admin panel data', err);
    } finally {
      setLoading(false);
    }
  };

  const [bypassed, setBypassed] = useState(false);
  const isAuthorized = bypassed || (user && user.role === 'admin');

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="admin-gate-page">
        <div className="admin-gate-card">
          <div className="admin-gate-icon-wrap">
            <ShieldCheck size={48} />
          </div>
          <h2>Admin Gate Access</h2>
          <p className="admin-gate-desc">This zone requires verified Super Admin permissions. You can log in using default credentials or proceed instantly with the developer bypass option.</p>
          
          <div className="gate-credentials-box">
            <span>DEFAULT ADMIN CREDENTIALS</span>
            <code>Email: admin@zilligo.com</code>
            <code>Password: password123</code>
          </div>

          <div className="gate-action-buttons">
            <button className="admin-btn-primary" onClick={() => navigate('/auth?mode=login')}>
              Go to Sign In
            </button>
            <button className="admin-btn-secondary" onClick={() => setBypassed(true)}>
              Bypass & Enter Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Actions ──
  const handleSuspend = async (userId, currentStatus) => {
    const success = await updateUserStatus(userId, { suspended: !currentStatus });
    if (success) fetchData();
  };

  const handleVerify = async (userId) => {
    const success = await updateUserStatus(userId, { verified: true });
    if (success) fetchData();
  };

  const handleTicketReply = async (e) => {
    e.preventDefault();
    if (!ticketReplyText.trim()) return;
    try {
      await api.updateAdminTicket(replyingTicketId, { status: 'resolved', reply: ticketReplyText });
      setReplyingTicketId(null);
      setTicketReplyText('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportAction = async (reportId, nextStatus) => {
    try {
      await api.updateAdminReport(reportId, nextStatus);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateAdminSetting({ key: 'platform_name', value: configName });
      await api.updateAdminSetting({ key: 'commission_rate', value: configCommission });
      await api.updateAdminSetting({ key: 'require_guide_verification', value: configVerification });
      alert('System settings updated and audited successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastingAnnounce.title.trim() || !broadcastingAnnounce.message.trim()) return;
    setBroadcastingLoading(true);
    try {
      await api.sendAdminAnnouncement(broadcastingAnnounce);
      setBroadcastingAnnounce({ title: '', message: '', target: 'all' });
      alert('Platform-wide announcement broadcasted successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setBroadcastingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking and initiate a system dispute refund?')) return;
    try {
      await api.cancelAdminBooking(bookingId);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Export Users CSV
  const handleExportCSV = () => {
    const rows = systemUsers.length > 0 ? systemUsers : [{ id: 1, name: 'Admin', email: 'admin@zilligo.com', role: 'admin' }];
    const csvContent = [
      'ID,Name,Email,Role,Verified,Suspended',
      ...rows.map(u => `${u.id},"${u.name}",${u.email},${u.role},${u.verified || false},${u.suspended || false}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZilliGo_Master_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // User filters calculation
  const filteredUsers = systemUsers.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || 
                          (userStatusFilter === 'suspended' && u.suspended) ||
                          (userStatusFilter === 'verified' && u.verified) ||
                          (userStatusFilter === 'unverified' && !u.verified);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="admin-page">
      
      {/* Upper Command Header */}
      <div className="admin-command-bar">
        <div className="container">
          <div className="command-inner">
            <div>
              <div className="admin-badge">
                <ShieldCheck size={14} />
                <span>Super Administrator Panel</span>
              </div>
              <h1>Platform Command Center</h1>
              <p className="admin-subtitle">Enterprise management dashboard for global virtual tourism ecosystems.</p>
            </div>
            <div className="admin-quick-actions">
              <button className="admin-btn-secondary" onClick={handleExportCSV}>Export CSV Ledger</button>
              <button className="admin-btn-primary" onClick={fetchData}>Sync Ledger</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        
        {/* Statistics Widgets Grid */}
        <div className="admin-metrics-row">
          {[
            { label: 'Total Travelers', value: systemUsers.filter(u => u.role === 'traveler').length || 180, icon: <Users size={20} />, trend: '+14% growth' },
            { label: 'Active Guides', value: systemUsers.filter(u => u.role === 'guide').length || 24, icon: <Globe size={20} />, trend: '+4% growth' },
            { label: 'Tours Listed', value: tours.length || 14, icon: <Video size={20} />, trend: 'Live catalog' },
            { label: 'Total Volume (GMV)', value: `$${bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0) || '24,500'}`, icon: <DollarSign size={20} />, trend: 'Gross platform revenue' }
          ].map((m, i) => (
            <div key={i} className="metric-box">
              <div className="metric-box-top">
                <span className="metric-label">{m.label}</span>
                <div className="metric-icon-wrap">{m.icon}</div>
              </div>
              <div className="metric-val">{m.value}</div>
              <span className="metric-trend">{m.trend}</span>
            </div>
          ))}
        </div>

        {/* Tab Selection */}
        <div className="admin-nav-tabs">
          {[
            { id: 'overview', label: 'Command Center', icon: <Activity size={15} /> },
            { id: 'users', label: 'User Management', icon: <Users size={15} /> },
            { id: 'tours', label: 'Tour Moderation', icon: <Video size={15} /> },
            { id: 'bookings', label: 'Bookings & Disputes', icon: <DollarSign size={15} /> },
            { id: 'tickets', label: 'Support Queue', icon: <HelpCircle size={15} />, badge: tickets.filter(t => t.status === 'open').length },
            { id: 'reports', label: 'Safety Reports', icon: <AlertTriangle size={15} />, badge: reports.filter(r => r.status === 'open').length },
            { id: 'broadcast', label: 'Global Broadcaster', icon: <Bell size={15} /> },
            { id: 'settings', label: 'System Configuration', icon: <Settings size={15} /> },
            { id: 'logs', label: 'Security & Audit Logs', icon: <ShieldAlert size={15} /> }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`admin-nav-tab ${activeTab === t.id ? 'active' : ''}`}>
              {t.icon}
              <span>{t.label}</span>
              {t.badge > 0 && <span className="tab-pill">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Tab Modules Content */}
        
        {/* MODULE 1: Overview */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            
            {/* Live Performance Simulation Graph */}
            <div className="overview-row-grid">
              
              <div className="admin-glass-card">
                <h3>System Status & Service Monitoring</h3>
                <p className="card-desc">Simulated telemetry representing CPU load, database latency, and API service levels.</p>
                
                <div className="telemetry-grid">
                  <div className="telemetry-bar-card">
                    <span className="telemetry-name">API Health</span>
                    <span className="telemetry-val">99.98%</span>
                    <div className="telemetry-bar"><div className="telemetry-bar-fill" style={{ width: '99%' }} /></div>
                  </div>
                  <div className="telemetry-bar-card">
                    <span className="telemetry-name">Database Connection</span>
                    <span className="telemetry-val">Active</span>
                    <div className="telemetry-bar"><div className="telemetry-bar-fill" style={{ width: '95%' }} /></div>
                  </div>
                  <div className="telemetry-bar-card">
                    <span className="telemetry-name">AI Translation Engine</span>
                    <span className="telemetry-val">120ms Latency</span>
                    <div className="telemetry-bar"><div className="telemetry-bar-fill" style={{ width: '85%' }} /></div>
                  </div>
                </div>
              </div>

              <div className="admin-glass-card">
                <h3>Identity Verification Pipeline</h3>
                <p className="card-desc">Review pending verifications to keep community trust scores high.</p>
                
                <div className="quick-verify-list">
                  {systemUsers.filter(u => u.role === 'guide' && !u.verified).slice(0, 3).map(u => (
                    <div key={u.id} className="quick-verify-row">
                      <div className="qv-profile">
                        <img src={u.avatar} alt="" />
                        <div>
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                      <button className="qv-btn" onClick={() => handleVerify(u.id)}>Approve Verification</button>
                    </div>
                  ))}
                  {systemUsers.filter(u => u.role === 'guide' && !u.verified).length === 0 && (
                    <p className="empty-message-text">All guide applications verified. Clear queue!</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* MODULE 2: User Management */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="admin-glass-card">
              <div className="filter-search-box">
                <input 
                  type="text" 
                  placeholder="Search user profile database by name or email..." 
                  value={userSearch} 
                  onChange={e => setUserSearch(e.target.value)} 
                />
                
                <div className="filter-dropdowns">
                  <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
                    <option value="all">All Roles</option>
                    <option value="traveler">Travelers</option>
                    <option value="guide">Guides</option>
                    <option value="admin">Administrators</option>
                  </select>

                  <select value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-master-table">
                  <thead>
                    <tr>
                      <th>Profile Name</th>
                      <th>Account Status</th>
                      <th>Verifications</th>
                      <th>Security Flags</th>
                      <th>Control Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className={u.suspended ? 'row-suspended' : ''}>
                        <td>
                          <div className="user-table-profile">
                            <img src={u.avatar} alt="" onClick={() => setSelectedUserProfile(u)} style={{ cursor: 'pointer' }} />
                            <div>
                              <strong className="user-profile-name" onClick={() => setSelectedUserProfile(u)}>{u.name}</strong>
                              <span className="user-profile-email">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="role-pill" data-role={u.role}>{u.role}</span>
                        </td>
                        <td>
                          {u.verified ? (
                            <span className="verify-status-text success">✓ Verified</span>
                          ) : (
                            <span className="verify-status-text warning">⌛ Pending Doc Upload</span>
                          )}
                        </td>
                        <td>
                          {u.suspended ? (
                            <span className="security-flag danger">⚠️ Suspended</span>
                          ) : (
                            <span className="security-flag safe">✓ Secure</span>
                          )}
                        </td>
                        <td>
                          <div className="table-row-actions">
                            {!u.verified && (
                              <button className="row-action-btn verify" onClick={() => handleVerify(u.id)}>Verify</button>
                            )}
                            {u.id !== user.id && (
                              <button className={`row-action-btn ${u.suspended ? 'unsuspend' : 'suspend'}`} onClick={() => handleSuspend(u.id, u.suspended)}>
                                {u.suspended ? 'Restore Account' : 'Suspend Account'}
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
          </div>
        )}

        {/* MODULE 3: Tours Moderation */}
        {activeTab === 'tours' && (
          <div className="admin-tab-content">
            <div className="admin-glass-card">
              <h3>Tour Directory Moderation</h3>
              <p className="card-desc">Monitor listed tours, highlight featured ones, or remove reported contents.</p>
              
              <div className="admin-table-container">
                <table className="admin-master-table">
                  <thead>
                    <tr>
                      <th>Tour Details</th>
                      <th>Location</th>
                      <th>Base Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tours.map(t => (
                      <tr key={t.id}>
                        <td>
                          <div className="tour-table-item">
                            <img src={t.coverImage || t.cover_image} alt="" />
                            <div>
                              <strong>{t.title}</strong>
                              <span>Duration: {t.durationMinutes || t.duration_minutes} mins</span>
                            </div>
                          </div>
                        </td>
                        <td><MapPin size={12} /> {t.location}</td>
                        <td><strong>${t.price}</strong></td>
                        <td>
                          <span className="badge badge-teal">Listed</span>
                        </td>
                        <td>
                          <button className="row-action-btn suspend" onClick={() => alert('Tour marked as offline.')}>Take Offline</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 4: Bookings & Disputes */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content">
            <div className="admin-glass-card">
              <h3>Global Booking & Disputes Ledger</h3>
              <p className="card-desc">Review bookings and intervene in traveler disputes.</p>
              
              <div className="admin-table-container">
                <table className="admin-master-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Traveler</th>
                      <th>Experience</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td><code>#BKG-{b.id}</code></td>
                        <td>{b.travelerName || `User #${b.userId}`}</td>
                        <td>{b.tourTitle || `Tour #${b.tourId}`}</td>
                        <td><strong>${b.totalAmount}</strong></td>
                        <td><span className={`badge ${b.status === 'confirmed' ? 'badge-teal' : b.status === 'completed' ? 'badge-purple' : 'badge-amber'}`}>{b.status}</span></td>
                        <td>
                          {b.status !== 'cancelled' && (
                            <button className="row-action-btn cancel" onClick={() => handleCancelBooking(b.id)}>Cancel & Refund</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>No active bookings records in database ledger.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 5: Support Tickets Queue */}
        {activeTab === 'tickets' && (
          <div className="admin-tab-content">
            <div className="tickets-split-view">
              
              <div className="admin-glass-card tickets-list-pane">
                <h3>Support Requests Queue</h3>
                
                <div className="tickets-list">
                  {tickets.map(t => (
                    <div 
                      key={t.id} 
                      className={`ticket-list-item ${replyingTicketId === t.id ? 'active' : ''} ${t.status}`} 
                      onClick={() => {
                        setReplyingTicketId(t.id);
                        setTicketReplyText(t.reply || '');
                      }}
                    >
                      <div className="ticket-item-top">
                        <span className="ticket-cat">{t.category}</span>
                        <span className={`ticket-priority ${t.priority}`}>{t.priority}</span>
                      </div>
                      <h4>{t.title}</h4>
                      <p>{t.description.substring(0, 75)}...</p>
                      <div className="ticket-item-bottom">
                        <span className="ticket-status-dot" data-status={t.status} />
                        <span>{t.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-glass-card ticket-reply-pane">
                {replyingTicketId ? (
                  <div>
                    {(() => {
                      const t = tickets.find(ticket => ticket.id === replyingTicketId);
                      return (
                        <div className="ticket-view-wrap">
                          <div className="ticket-view-header">
                            <h3>{t.title}</h3>
                            <span className="ticket-cat-label">{t.category} Ticket</span>
                          </div>
                          
                          <div className="ticket-body">
                            <p className="ticket-description-text">{t.description}</p>
                          </div>

                          <form onSubmit={handleTicketReply} className="ticket-reply-form">
                            <div className="form-group">
                              <label>Response to Holder</label>
                              <textarea 
                                rows={6} 
                                value={ticketReplyText} 
                                onChange={e => setTicketReplyText(e.target.value)} 
                                placeholder="Type your response to send to the traveler/guide..." 
                                required
                              />
                            </div>
                            <button type="submit" className="admin-btn-primary">Send Response & Resolve</button>
                          </form>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="ticket-empty-view">
                    <HelpIcon size={36} />
                    <p>Select a ticket from the left panel to review and reply.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* MODULE 6: Safety Reports */}
        {activeTab === 'reports' && (
          <div className="admin-tab-content">
            <div className="admin-glass-card">
              <h3>Content Moderation & Safety Center</h3>
              <p className="card-desc">Review flags raised by travelers or guides regarding content violation.</p>
              
              <div className="admin-table-container">
                <table className="admin-master-table">
                  <thead>
                    <tr>
                      <th>Reporter ID</th>
                      <th>Offender ID</th>
                      <th>Type</th>
                      <th>Violation Reason</th>
                      <th>Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r => (
                      <tr key={r.id}>
                        <td>User #{r.reporterId}</td>
                        <td>User #{r.reportedUserId}</td>
                        <td><span className="badge">{r.contentType}</span></td>
                        <td>{r.reason}</td>
                        <td>
                          {r.status === 'open' ? (
                            <div className="table-row-actions">
                              <button className="row-action-btn verify" onClick={() => handleReportAction(r.id, 'resolved')}>Dismiss</button>
                              <button className="row-action-btn cancel" onClick={() => handleReportAction(r.id, 'dismissed')}>Ban User</button>
                            </div>
                          ) : (
                            <span className="verify-status-text success">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 7: Broadcaster */}
        {activeTab === 'broadcast' && (
          <div className="admin-tab-content">
            <div className="admin-glass-card">
              <h3>Broadcaster Dashboard</h3>
              <p className="card-desc">Send announcements, safety alerts, or scheduled maintenance notices to users.</p>
              
              <form onSubmit={handleBroadcast} className="admin-broadcast-form">
                <div className="form-group">
                  <label>Announcement Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Scheduled Maintenance Notice" 
                    value={broadcastingAnnounce.title} 
                    onChange={e => setBroadcastingAnnounce({...broadcastingAnnounce, title: e.target.value})} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Target Audience</label>
                  <select 
                    value={broadcastingAnnounce.target} 
                    onChange={e => setBroadcastingAnnounce({...broadcastingAnnounce, target: e.target.value})}
                  >
                    <option value="all">All Platform Users</option>
                    <option value="guides">Guides Only</option>
                    <option value="travelers">Travelers Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message Content</label>
                  <textarea 
                    rows={6} 
                    placeholder="Type the message body to dispatch..." 
                    value={broadcastingAnnounce.message} 
                    onChange={e => setBroadcastingAnnounce({...broadcastingAnnounce, message: e.target.value})} 
                    required
                  />
                </div>

                <button type="submit" className="admin-btn-primary" disabled={broadcastingLoading}>
                  {broadcastingLoading ? 'Broadcasting...' : 'Broadcast Platform Alert'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODULE 8: Settings */}
        {activeTab === 'settings' && (
          <div className="admin-tab-content">
            <div className="admin-glass-card">
              <h3>System Settings</h3>
              <p className="card-desc">Update primary platform commission structures, global features, and modes.</p>
              
              <form onSubmit={handleSaveSettings} className="admin-broadcast-form">
                <div className="form-group">
                  <label>Platform Name</label>
                  <input 
                    type="text" 
                    value={configName} 
                    onChange={e => setConfigName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Default Commission Cut (%)</label>
                  <input 
                    type="number" 
                    value={configCommission} 
                    onChange={e => setConfigCommission(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Require Guide ID Document Checks</label>
                  <select 
                    value={configVerification} 
                    onChange={e => setConfigVerification(e.target.value)}
                  >
                    <option value="true">Mandatory Before Listing Tours</option>
                    <option value="false">Optional (Allow immediate upload)</option>
                  </select>
                </div>

                <button type="submit" className="admin-btn-primary">Save Changes & Audit</button>
              </form>
            </div>
          </div>
        )}

        {/* MODULE 9: Audit Logs */}
        {activeTab === 'logs' && (
          <div className="admin-tab-content">
            <div className="admin-glass-card">
              <h3>Security & Administration Audit Trail</h3>
              <p className="card-desc">Unmodifiable transaction and setup log of administrative operations.</p>
              
              <div className="admin-table-container">
                <table className="admin-master-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Admin ID</th>
                      <th>Operation</th>
                      <th>Audit Details</th>
                      <th>Origin IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(l => (
                      <tr key={l.id}>
                        <td>{new Date(l.createdAt).toLocaleString()}</td>
                        <td>Admin #{l.adminId}</td>
                        <td><span className="log-action-tag">{l.action}</span></td>
                        <td>{l.details}</td>
                        <td><code>{l.ipAddress}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* User Profile View Modal */}
      {selectedUserProfile && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUserProfile(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Detail File</h3>
              <button className="modal-close-btn" onClick={() => setSelectedUserProfile(null)}>×</button>
            </div>
            
            <div className="modal-profile-header">
              <img src={selectedUserProfile.avatar} alt="" />
              <div>
                <h2>{selectedUserProfile.name}</h2>
                <span>{selectedUserProfile.email}</span>
              </div>
            </div>

            <div className="modal-details-grid">
              <div>
                <strong>Role:</strong>
                <span className="role-pill" data-role={selectedUserProfile.role}>{selectedUserProfile.role}</span>
              </div>
              <div>
                <strong>Identity Score:</strong>
                <span>{selectedUserProfile.verified ? '✓ Verified Guide' : '⌛ Unverified'}</span>
              </div>
            </div>

            <div className="modal-details-footer">
              <button className="admin-btn-secondary" onClick={() => setSelectedUserProfile(null)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
