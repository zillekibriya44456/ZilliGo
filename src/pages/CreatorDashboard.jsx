import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Video, BarChart2, Settings, Users, Link as LinkIcon, Plus, PlayCircle, Eye, Heart } from 'lucide-react';
import './Dashboard.css';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ bio: '', youtubeUrl: '', instagramUrl: '', tiktokUrl: '' });
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.getCreatorProfile(user.id)
        .then(data => {
          setProfile(data.profile || { bio: '', youtubeUrl: '', instagramUrl: '', tiktokUrl: '' });
          setVideos(data.videos || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateCreatorProfile(profile);
      alert('Creator profile updated!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      const newVideo = await api.uploadVideo({
        title: fd.get('title'),
        description: fd.get('description'),
        videoUrl: fd.get('videoUrl') || 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: fd.get('thumbnailUrl') || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'
      });
      setVideos([newVideo, ...videos]);
      alert('Video published!');
      setActiveTab('videos');
    } catch (err) {
      alert('Error uploading video');
    }
  };

  if (loading) return <div className="page-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><div className="spinner" /></div>;

  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0) + (profile.totalViews || 0);

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar glass-card">
        <div className="sidebar-header">
          <img src={user?.avatar} alt={user?.name} className="sidebar-avatar" />
          <h3 className="sidebar-name">{user?.name}</h3>
          <span className="badge badge-indigo" style={{ marginTop: '0.5rem' }}>Creator</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <BarChart2 size={18} /> Overview
          </button>
          <button className={`nav-btn ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
            <Video size={18} /> My Content
          </button>
          <button className={`nav-btn ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
            <Plus size={18} /> Upload Video
          </button>
          <button className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Profile Settings
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header glass-card">
          <h1>Creator Studio</h1>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setActiveTab('upload')}><Plus size={16} /> New Upload</button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="db-content">
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-icon"><Users size={24} color="var(--accent-teal)" /></div>
                <div className="stat-info">
                  <h4>Total Followers</h4>
                  <p>{profile.followerCount || 0}</p>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon"><Eye size={24} color="var(--accent-indigo)" /></div>
                <div className="stat-info">
                  <h4>Total Views</h4>
                  <p>{totalViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-icon"><Video size={24} color="var(--accent-rose)" /></div>
                <div className="stat-info">
                  <h4>Videos Uploaded</h4>
                  <p>{videos.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
              <h2>Recent Content</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                {videos.slice(0, 3).map(v => (
                  <div key={v.id} style={{ background: 'var(--bg-elevated)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                      <img src={v.thumbnailUrl} alt={v.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{v.title}</h4>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Eye size={12} /> {v.views}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Heart size={12} /> {v.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {videos.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No videos uploaded yet.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="db-content">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>My Content Library</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {videos.map(v => (
                  <div key={v.id} style={{ display: 'flex', gap: '1.5rem', background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '12px', alignItems: 'center' }}>
                    <img src={v.thumbnailUrl} alt={v.title} style={{ width: '160px', height: '90px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{v.title}</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        <span>Published: {new Date(v.createdAt).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Eye size={12} /> {v.views} views</span>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlayCircle size={16} /> View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="db-content">
            <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '2rem' }}>Upload New Video</h2>
              <form onSubmit={handleVideoUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Video Title *</label>
                  <input name="title" type="text" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} required placeholder="e.g. Kyoto Street Food Tour 2026" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
                  <textarea name="description" rows={4} className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} placeholder="Tell viewers about this experience..." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Thumbnail URL</label>
                  <input name="thumbnailUrl" type="url" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} placeholder="https://..." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Video URL (MP4 or HLS)</label>
                  <input name="videoUrl" type="url" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} placeholder="https://..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>Publish Video</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="db-content">
            <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '2rem' }}>Creator Profile</h2>
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Creator Bio</label>
                  <textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} rows={4} className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} placeholder="Tell the world about your travels..." />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><LinkIcon size={16}/> YouTube Link</label>
                  <input value={profile.youtubeUrl || ''} onChange={e => setProfile({...profile, youtubeUrl: e.target.value})} type="url" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} placeholder="https://youtube.com/c/..." />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><LinkIcon size={16}/> Instagram Link</label>
                  <input value={profile.instagramUrl || ''} onChange={e => setProfile({...profile, instagramUrl: e.target.value})} type="url" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><LinkIcon size={16}/> TikTok Link</label>
                  <input value={profile.tiktokUrl || ''} onChange={e => setProfile({...profile, tiktokUrl: e.target.value})} type="url" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'white' }} placeholder="https://tiktok.com/@..." />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>Save Changes</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
