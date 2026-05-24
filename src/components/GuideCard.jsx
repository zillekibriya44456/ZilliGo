import { Link } from 'react-router-dom';
import { Star, MapPin, MessageCircle, CheckCircle, Globe } from 'lucide-react';

export default function GuideCard({ guide }) {
  if (!guide) return null;
  return (
    <Link to={`/guide/${guide.id}`} className="guide-card glass-card glass-card-hover" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="guide-card__header">
        <div className="guide-card__avatar-wrap">
          <img src={guide.avatar} alt={guide.name} className="guide-card__avatar" />
          <span className={`guide-card__status ${guide.available ? 'available' : 'busy'}`} title={guide.available ? 'Available' : 'Busy'} />
        </div>
        <div className="guide-card__info">
          <div className="guide-card__name-row">
            <h4 className="guide-card__name">{guide.name}</h4>
            {guide.verified && <CheckCircle size={14} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />}
          </div>
          <span className="guide-card__location"><MapPin size={11} /> {guide.location}</span>
          <div className="guide-card__rating">
            <Star size={12} fill="var(--accent-amber)" stroke="none" />
            <strong>{guide.rating}</strong>
            <span className="text-muted">({guide.reviewCount.toLocaleString()} reviews)</span>
          </div>
        </div>
      </div>

      <p className="guide-card__bio">{guide.bio.substring(0, 110)}...</p>

      <div className="guide-card__tags">
        {guide.specialties.map(s => (
          <span key={s} className="badge badge-teal" style={{ fontSize: '0.68rem' }}>{s}</span>
        ))}
      </div>

      <div className="guide-card__footer">
        <div className="guide-card__langs">
          <Globe size={12} />
          <span>{guide.languages.slice(0, 2).join(', ')}{guide.languages.length > 2 ? ` +${guide.languages.length - 2}` : ''}</span>
        </div>
        <div className="guide-card__rate">
          <span className="guide-card__rate-amount">${guide.hourlyRate}</span>
          <span className="guide-card__rate-label">/hr</span>
        </div>
      </div>

      <div className="guide-card__badges">
        {guide.badges.map(b => (
          <span key={b} className="guide-card__badge-item">{b}</span>
        ))}
      </div>

      <div className="guide-card__response">
        <MessageCircle size={12} /> Response: <strong>{guide.responseTime}</strong>
      </div>
    </Link>
  );
}
