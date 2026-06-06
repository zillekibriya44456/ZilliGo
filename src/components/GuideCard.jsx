import { Link } from 'react-router-dom';
import { Star, MapPin, MessageCircle, BadgeCheck, Globe, Clock, ArrowRight } from 'lucide-react';
import './GuideCard.css';

export default function GuideCard({ guide }) {
  if (!guide) return null;
  
  const isAvailable = guide.available;

  return (
    <Link to={`/guide/${guide.id}`} className="premium-guide-card">
      {/* Header Profile Section */}
      <div className="pgc-header">
        <div className="pgc-avatar-wrap">
          <img src={guide.avatar} alt={guide.name} className="pgc-avatar" loading="lazy" />
          <div className={`pgc-status-indicator ${isAvailable ? 'pgc-status--available' : 'pgc-status--busy'}`} />
        </div>
        <div className="pgc-info">
          <div className="pgc-name-row">
            <h3 className="pgc-name">{guide.name}</h3>
            {guide.verified && <BadgeCheck size={16} className="pgc-verified-icon" />}
          </div>
          <div className="pgc-location">
            <MapPin size={12} /> {guide.location}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="pgc-stats-row">
        <div className="pgc-stat">
          <Star size={14} fill="#FFD700" stroke="none" />
          <div className="pgc-stat-text">
            <strong>{guide.rating}</strong> <span>({guide.reviewCount})</span>
          </div>
        </div>
        <div className="pgc-stat-divider" />
        <div className="pgc-stat">
          <Globe size={14} className="pgc-icon-teal" />
          <div className="pgc-stat-text">
            <strong>{guide.languages.length}</strong> <span>Langs</span>
          </div>
        </div>
        <div className="pgc-stat-divider" />
        <div className="pgc-stat">
          <Clock size={14} className="pgc-icon-teal" />
          <div className="pgc-stat-text">
            <strong>{guide.responseTime}</strong>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="pgc-bio">{guide.bio}</p>

      {/* Specialties Tags */}
      <div className="pgc-tags">
        {guide.specialties.slice(0, 3).map(s => (
          <span key={s} className="pgc-tag">{s}</span>
        ))}
        {guide.specialties.length > 3 && <span className="pgc-tag-more">+{guide.specialties.length - 3}</span>}
      </div>

      {/* Footer / CTA */}
      <div className="pgc-footer">
        <div className="pgc-price">
          <span className="pgc-price-amount">${guide.hourlyRate}</span>
          <span className="pgc-price-per">/hr</span>
        </div>
        <button className="pgc-view-btn">
          View Profile <ArrowRight size={14} />
        </button>
      </div>
    </Link>
  );
}
