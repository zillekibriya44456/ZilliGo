import { useState, useEffect } from 'react';
import { Globe, Shield, Star, Award, CheckCircle, Clock, MapPin, Compass, ArrowRight, Loader } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './DigitalPassport.css';

export default function DigitalPassport() {
  const { user } = useAuth();
  const [stamps, setStamps] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingStamp, setAddingStamp] = useState(false);
  const [simCountry, setSimCountry] = useState('Japan');
  const [simStamp, setSimStamp] = useState('Kyoto Shrines');

  const fetchPassportData = async () => {
    try {
      const data = await api.getPassport();
      if (data && data.stamps) {
        setStamps(data.stamps);
        setAchievements(data.achievements || []);
      }
    } catch (err) {
      console.error('Failed to load digital passport', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPassportData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSimulateStamp = async (e) => {
    e.preventDefault();
    if (!user) return;
    setAddingStamp(true);
    try {
      const countryCodes = {
        'Japan': 'JPN',
        'Italy': 'ITA',
        'India': 'IND',
        'France': 'FRA',
        'USA': 'USA',
        'UAE': 'ARE',
        'UK': 'GBR',
        'Brazil': 'BRA',
        'Egypt': 'EGY'
      };
      const code = countryCodes[simCountry] || 'GLO';
      await api.addPassportStamp({ countryCode: code, stampName: simStamp });
      await fetchPassportData();
      setSimStamp('');
    } catch (err) {
      console.error(err);
    } finally {
      setAddingStamp(false);
    }
  };

  const getEmoji = (country) => {
    const emojis = {
      'Japan': '🌸',
      'Italy': '🏛️',
      'India': '🪔',
      'France': '🗼',
      'USA': '🗽',
      'UAE': '🐫',
      'UK': '🏰',
      'Brazil': '💃',
      'Egypt': '🏺'
    };
    return emojis[country] || '✈️';
  };

  // Calculate Level & Milestones
  const stampCount = stamps.length;
  const xp = stampCount * 120;
  const currentLevel = Math.floor(xp / 300) + 1;
  const xpNeeded = 300;
  const xpProgress = xp % 300;
  const progressPercent = Math.min((xpProgress / xpNeeded) * 100, 100);

  if (loading) {
    return (
      <div className="passport-loading">
        <Loader className="passport-spin" size={32} />
        <p>Opening digital passport ledger...</p>
      </div>
    );
  }

  return (
    <div className="passport-page">
      <div className="container">
        
        {/* Header Block */}
        <div className="passport-header">
          <div className="passport-badge-wrap">
            <Compass className="passport-compass-icon" size={36} />
          </div>
          <h1>Digital Travel Passport</h1>
          <p>Your verifiable ledger of global exploration. Uncover cities, attend live tours, and unlock achievements.</p>
        </div>

        {!user ? (
          <div className="passport-anonymous">
            <div className="passport-anon-card">
              <span>🛂</span>
              <h3>Lock In Your Passport</h3>
              <p>Sign in to start collecting stamps, tracking milestones, and recording achievements as you travel virtually.</p>
              <a href="/auth" className="passport-btn-primary">Connect Account</a>
            </div>
          </div>
        ) : (
          <div className="passport-grid">
            
            {/* Left Column: Passport Ledger Booklet */}
            <div className="passport-book-side">
              <div className="passport-booklet">
                <div className="passport-booklet-inner">
                  
                  {/* Booklet Header */}
                  <div className="passport-booklet-header">
                    <div>
                      <span className="booklet-meta-label">Passport Holder</span>
                      <h3 className="booklet-holder-name">{user.name}</h3>
                      <span className="booklet-meta-sub">{user.email}</span>
                    </div>
                    <div className="booklet-stamp-metric">
                      <span className="booklet-meta-label">Stamps Collected</span>
                      <div className="booklet-stamp-val">{stampCount}</div>
                    </div>
                  </div>

                  {/* Traveler Stats & Experience progress */}
                  <div className="passport-xp-card">
                    <div className="xp-row">
                      <span>Explorer Level {currentLevel}</span>
                      <span>{xpProgress} / {xpNeeded} XP</span>
                    </div>
                    <div className="xp-progress-bar">
                      <div className="xp-progress-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p className="xp-hint">Earn 120 XP for every virtual destination stamp you claim.</p>
                  </div>

                  {/* Stamp Grid */}
                  <div className="passport-stamps-shelf">
                    <h4 className="shelf-title">Stamps & Visas ({stampCount})</h4>
                    
                    {stamps.length === 0 ? (
                      <div className="passport-empty-shelf">
                        <p>No stamps collected yet. Claim your first stamp below or join a live tour to get started!</p>
                      </div>
                    ) : (
                      <div className="stamps-grid">
                        {stamps.map(stamp => (
                          <div key={stamp.id} className="passport-stamp-circle">
                            <span className="stamp-circle-emoji">{getEmoji(stamp.countryCode === 'JPN' ? 'Japan' : stamp.countryCode === 'ITA' ? 'Italy' : stamp.countryCode === 'IND' ? 'India' : stamp.countryCode === 'FRA' ? 'France' : stamp.countryCode === 'USA' ? 'USA' : stamp.countryCode === 'ARE' ? 'UAE' : stamp.countryCode === 'GBR' ? 'UK' : stamp.countryCode === 'BRA' ? 'Brazil' : stamp.countryCode === 'EGY' ? 'Egypt' : 'Global')}</span>
                            <h5 className="stamp-circle-country">{stamp.stampName?.split(' ')[0]}</h5>
                            <span className="stamp-circle-date">{new Date(stamp.acquiredAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                          </div>
                        ))}

                        {/* Next stamp preview placeholder */}
                        <div className="passport-stamp-circle placeholder">
                          <span className="stamp-circle-emoji">+</span>
                          <h5 className="stamp-circle-country">Next Destination</h5>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Actions & Achievements */}
            <div className="passport-action-side">
              
              {/* Simulation Stamp Award (Self-Serve Stamp claim) */}
              <div className="passport-side-card">
                <h3>Claim Destination Stamp</h3>
                <p className="card-hint-text">Simulate visiting a landmark to claim a stamp and record it in the database.</p>
                
                <form onSubmit={handleSimulateStamp} className="simulation-form">
                  <div className="form-group">
                    <label>Select Country</label>
                    <select value={simCountry} onChange={e => setSimCountry(e.target.value)}>
                      <option value="Japan">Japan 🇯🇵</option>
                      <option value="Italy">Italy 🇮🇹</option>
                      <option value="India">India 🇮🇳</option>
                      <option value="France">France 🇫🇷</option>
                      <option value="USA">USA 🇺🇸</option>
                      <option value="UAE">UAE 🇦🇪</option>
                      <option value="UK">UK 🇬🇧</option>
                      <option value="Brazil">Brazil 🇧🇷</option>
                      <option value="Egypt">Egypt 🇪🇬</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Landmark Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Taj Mahal, Eiffel Tower" 
                      value={simStamp} 
                      onChange={e => setSimStamp(e.target.value)} 
                      required 
                    />
                  </div>

                  <button type="submit" className="passport-btn-primary" disabled={addingStamp}>
                    {addingStamp ? 'Verifying Coordinates...' : 'Claim Digital Stamp'}
                  </button>
                </form>
              </div>

              {/* Achievements list */}
              <div className="passport-side-card">
                <h3>Milestones & Achievements</h3>
                <div className="achievements-list">
                  <div className="achievement-row unlocked">
                    <div className="achievement-icon">🏆</div>
                    <div className="achievement-details">
                      <h4>First Explorer</h4>
                      <p>Created your virtual passport profile</p>
                    </div>
                    <span className="achievement-status">Unlocked</span>
                  </div>

                  <div className={`achievement-row ${stampCount >= 1 ? 'unlocked' : 'locked'}`}>
                    <div className="achievement-icon">✈️</div>
                    <div className="achievement-details">
                      <h4>Globe Trotter</h4>
                      <p>Claimed 1 passport destination stamp</p>
                    </div>
                    <span className="achievement-status">{stampCount >= 1 ? 'Unlocked' : 'Locked'}</span>
                  </div>

                  <div className={`achievement-row ${stampCount >= 3 ? 'unlocked' : 'locked'}`}>
                    <div className="achievement-icon">👑</div>
                    <div className="achievement-details">
                      <h4>Cultural Ambassador</h4>
                      <p>Claimed 3 passport destination stamps</p>
                    </div>
                    <span className="achievement-status">{stampCount >= 3 ? 'Unlocked' : 'Locked'}</span>
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
