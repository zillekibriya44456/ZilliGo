import { Link } from 'react-router-dom';
import { Star, Clock, Users, Globe, Play, Video } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function TourCard({ tour, featured = false }) {
  const { formatPrice } = useSettings();
  if (!tour) return null;

  const isLive = tour.type === 'live';
  const spotsLeft = tour.maxParticipants - tour.currentParticipants;
  const fillPercent = (tour.currentParticipants / tour.maxParticipants) * 100;

  return (
    <Link to={`/tour/${tour.id}`} className={`tour-card glass-card glass-card-hover ${featured ? 'tour-card--featured' : ''}`}>
      {/* Image */}
      <div className="tour-card__img-wrap">
        <img src={tour.coverImage} alt={tour.title} className="tour-card__img" loading="lazy" />
        <div className="tour-card__img-overlay" />

        {/* Badges */}
        <div className="tour-card__badges">
          {isLive ? (
            <span className="badge badge-live">
              <span style={{ width: 6, height: 6, background: 'currentColor', borderRadius: '50%', display: 'inline-block' }} />
              LIVE
            </span>
          ) : (
            <span className="badge badge-purple">
              <Play size={10} fill="currentColor" /> RECORDED
            </span>
          )}
          {tour.featured && <span className="badge badge-amber">⭐ Featured</span>}
          {tour.kidFriendly && <span className="badge badge-teal">🧸 Kids</span>}
        </div>

        {/* Price */}
        <div className="tour-card__price">
          <span className="tour-card__price-amount">{formatPrice(tour.price)}</span>
          <span className="tour-card__price-per">/ person</span>
        </div>

        {/* Play Overlay */}
        <div className="tour-card__play">
          <div className="tour-card__play-btn">
            <Play size={20} fill="white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="tour-card__body">
        <div className="tour-card__category">{tour.category}</div>
        <h3 className="tour-card__title">{tour.title}</h3>

        <div className="tour-card__meta">
          <span className="tour-card__meta-item">
            <Globe size={13} /> {tour.location}
          </span>
          <span className="tour-card__meta-item">
            <Clock size={13} /> {tour.duration} min
          </span>
        </div>

        <div className="tour-card__footer">
          <div className="tour-card__rating">
            <Star size={13} fill="var(--accent-amber)" stroke="none" />
            <span>{tour.rating}</span>
            <span className="text-muted">({tour.reviewCount.toLocaleString()})</span>
          </div>

          {isLive && (
            <div className="tour-card__spots">
              <Users size={13} />
              <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</span>
            </div>
          )}
        </div>

        {/* Capacity Bar for live tours */}
        {isLive && (
          <div className="tour-card__capacity">
            <div
              className="tour-card__capacity-bar"
              style={{ width: `${fillPercent}%`, background: fillPercent > 80 ? 'var(--accent-rose)' : 'var(--accent-teal)' }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
