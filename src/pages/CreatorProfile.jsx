import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Users, PlayCircle, Eye, Link as LinkIcon, CheckCircle, Video } from 'lucide-react';

export default function CreatorProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    api.getCreatorProfile(id)
      .then(data => {
        setProfile(data.profile);
        setVideos(data.videos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleFollow = async () => {
    try {
      const res = await api.followCreator(id);
      setFollowing(res.following);
      setProfile(prev => ({
        ...prev,
        followerCount: res.following ? parseInt(prev.followerCount) + 1 : parseInt(prev.followerCount) - 1
      }));
    } catch (err) {
      alert('Error following creator');
    }
  };

  if (loading) return <div className="page-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><div className="spinner" /></div>;

  if (!profile) return <div className="page-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><h2>Creator not found</h2></div>;

  return (
    <div className="page-wrapper" style={{ padding: '2rem' }}>
      <div className="glass-card" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(90deg, var(--accent-indigo), var(--accent-teal))', opacity: 0.2 }} />
        
        <img src={profile.avatar} alt={profile.name} style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid var(--bg-card)', zIndex: 1, objectFit: 'cover' }} />
        
        <div style={{ flex: 1, zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{profile.name}</h1>
            {profile.isVerified && <CheckCircle size={24} color="var(--accent-teal)" />}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: '600px' }}>
            {profile.bio || 'This creator hasn\'t added a bio yet.'}
          </p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Users size={18} /> <span style={{ fontWeight: 'bold', color: 'white' }}>{profile.followerCount || 0}</span> Followers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Video size={18} /> <span style={{ fontWeight: 'bold', color: 'white' }}>{videos.length}</span> Videos
            </div>
            <button className={`btn ${following ? 'btn-outline' : 'btn-primary'}`} onClick={handleFollow}>
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', width: '200px', justifyContent: 'center' }}><LinkIcon size={16}/> YouTube</a>}
          {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', width: '200px', justifyContent: 'center' }}><LinkIcon size={16}/> Instagram</a>}
          {profile.tiktokUrl && <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', width: '200px', justifyContent: 'center' }}><LinkIcon size={16}/> TikTok</a>}
        </div>
      </div>

      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PlayCircle size={24} color="var(--accent-rose)" /> Uploaded Content
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {videos.map(v => (
          <div key={v.id} className="glass-card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <img src={v.thumbnailUrl} alt={v.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }} className="hover-play">
                <PlayCircle size={48} color="white" />
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{v.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>{v.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Eye size={14} /> {v.views}</span>
              </div>
            </div>
          </div>
        ))}
        {videos.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>{profile.name} hasn't uploaded any videos yet.</p>}
      </div>
    </div>
  );
}
