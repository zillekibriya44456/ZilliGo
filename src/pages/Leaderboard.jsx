import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Medal, Award, MapPin, Search, ChevronRight } from 'lucide-react';
import { GUIDES } from '../data/mockData';
import './Leaderboard.css';

// Sort guides by rating * tours count (a simple points algorithm)
const sortedGuides = [...GUIDES].map(g => ({
  ...g,
  points: Math.floor(g.rating * g.tours * 15),
})).sort((a, b) => b.points - a.points);

const topThree = sortedGuides.slice(0, 3);
const restOfGuides = sortedGuides.slice(3, 10); // Show top 10

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('month');

  return (
    <div className="page-wrapper leaderboard-page">
      <div className="leaderboard-header">
        <div className="leaderboard-glow" />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', color: 'var(--accent-amber)', marginBottom: '1rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <Trophy size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Global Rankings</span>
          </div>
          <h1>Top Quality Guides</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', marginBottom: 'var(--space-xl)' }}>
            Recognizing our most exceptional guides based on traveler ratings, session quality, and completed tours.
          </p>
          
          <div className="leaderboard-tabs">
            {['week', 'month', 'all-time'].map(t => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`lb-tab ${timeframe === t ? 'active' : ''}`}
              >
                {t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--space-4xl)' }}>
        
        {/* Podium */}
        <div className="podium-container">
          {/* 2nd Place */}
          <div className="podium-item podium-second">
            <div className="podium-avatar-wrap">
              <div className="podium-badge badge-silver"><Medal size={16} /> 2</div>
              <img src={topThree[1].avatar} alt={topThree[1].name} />
            </div>
            <div className="podium-name">{topThree[1].name}</div>
            <div className="podium-points">{topThree[1].points.toLocaleString()} pts</div>
            <div className="podium-block block-silver" />
          </div>

          {/* 1st Place */}
          <div className="podium-item podium-first">
            <div className="podium-avatar-wrap">
              <div className="podium-badge badge-gold"><Trophy size={20} /> 1</div>
              <img src={topThree[0].avatar} alt={topThree[0].name} className="avatar-lg" />
            </div>
            <div className="podium-name">{topThree[0].name}</div>
            <div className="podium-points gradient-text">{topThree[0].points.toLocaleString()} pts</div>
            <div className="podium-block block-gold" />
          </div>

          {/* 3rd Place */}
          <div className="podium-item podium-third">
            <div className="podium-avatar-wrap">
              <div className="podium-badge badge-bronze"><Award size={16} /> 3</div>
              <img src={topThree[2].avatar} alt={topThree[2].name} />
            </div>
            <div className="podium-name">{topThree[2].name}</div>
            <div className="podium-points">{topThree[2].points.toLocaleString()} pts</div>
            <div className="podium-block block-bronze" />
          </div>
        </div>

        {/* Rest of the List */}
        <div className="lb-list glass-card">
          <div className="lb-list-header">
            <div>Rank</div>
            <div>Guide</div>
            <div>Location</div>
            <div style={{ textAlign: 'right' }}>Score</div>
          </div>
          
          <div className="lb-list-body">
            {restOfGuides.map((guide, index) => (
              <Link to={`/guide/${guide.id}`} key={guide.id} className="lb-row">
                <div className="lb-rank">#{index + 4}</div>
                <div className="lb-guide">
                  <img src={guide.avatar} alt={guide.name} />
                  <div>
                    <div className="lb-guide-name">{guide.name}</div>
                    <div className="lb-guide-rating"><Star size={12} fill="var(--accent-amber)" stroke="none" /> {guide.rating}</div>
                  </div>
                </div>
                <div className="lb-location"><MapPin size={14} /> {guide.location}</div>
                <div className="lb-score">
                  {guide.points.toLocaleString()} <span className="lb-pts-label">pts</span>
                  <ChevronRight size={16} className="lb-chevron" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
