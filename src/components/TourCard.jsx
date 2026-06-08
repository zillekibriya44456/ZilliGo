import { Link } from 'react-router-dom';
import { Star, Clock, Users, Globe, Play, BadgeCheck, Zap } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './TourCard.css';

// Helper to map country to flag
const getFlag = (location) => {
  if (!location) return '🌍';
  const loc = location.toLowerCase();
  if (loc.includes('india') || loc.includes('bangalore') || loc.includes('jaipur')) return '🇮🇳';
  if (loc.includes('japan') || loc.includes('tokyo') || loc.includes('kyoto')) return '🇯🇵';
  if (loc.includes('italy') || loc.includes('rome') || loc.includes('venice')) return '🇮🇹';
  if (loc.includes('france') || loc.includes('paris')) return '🇫🇷';
  if (loc.includes('brazil') || loc.includes('rio')) return '🇧🇷';
  if (loc.includes('usa') || loc.includes('york')) return '🇺🇸';
  return '🌍';
};

export default function TourCard({ tour, featured = false }) {
  const { formatPrice } = useSettings();
  if (!tour) return null;

  const isLive = tour.type === 'live';
  
  // Safe parsing for database values vs mock values
  const ratingVal = tour.rating !== undefined && tour.rating !== null ? parseFloat(tour.rating) : 0.0;
  const reviewCountVal = tour.reviewCount !== undefined && tour.reviewCount !== null ? parseInt(tour.reviewCount, 10) : 0;
  const maxParticipantsVal = tour.maxParticipants !== undefined && tour.maxParticipants !== null ? parseInt(tour.maxParticipants, 10) : 20;
  const currentParticipantsVal = tour.currentParticipants !== undefined && tour.currentParticipants !== null ? parseInt(tour.currentParticipants, 10) : 0;
  const spotsLeft = maxParticipantsVal - currentParticipantsVal;
  const durationVal = tour.duration || tour.durationMinutes || 0;
  const coverImg = tour.coverImage || tour.cover_image || "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80";

  const flag = getFlag(tour.location);

  return (
    <Link to={`/tour/${tour.id}`} className={`premium-tour-card ${featured ? 'featured-card' : ''}`}>
      
      {/* ── Image Section (16:9) ── */}
      <div className="ptc-image-wrap">
        <img src={coverImg} alt={tour.title} className="ptc-image" loading="lazy" />
        <div className="ptc-image-overlay" />
        
        {/* Top Badges */}
        <div className="ptc-badges-top">
          {isLive ? (
            <div className="ptc-badge live-badge">
              <span className="live-dot" /> LIVE NOW
            </div>
          ) : (
            <div className="ptc-badge recorded-badge">
              <Play size={10} fill="currentColor" /> RECORDED
            </div>
          )}
          {tour.featured && <div className="ptc-badge featured-badge">⭐ FEATURED</div>}
          <div className="ptc-badge ai-badge"><Globe size={10} /> AI TRANSLATION</div>
        </div>

        {/* Viewers Counter (Bottom Left of Image) */}
        {isLive && (
          <div className="ptc-viewers">
            <span className="live-dot" /> 284 Watching
          </div>
        )}
      </div>

      {/* ── Content Section ── */}
      <div className="ptc-body">
        
        {/* Location */}
        <div className="ptc-location">
          <span className="ptc-flag">{flag}</span> {tour.location}
        </div>

        {/* Title */}
        <h3 className="ptc-title">{tour.title}</h3>

        {/* Guide Info */}
        <div className="ptc-guide">
          <img src={`https://i.pravatar.cc/150?u=${tour.id}`} alt="Guide" className="ptc-guide-avatar" />
          <div className="ptc-guide-info">
            <span className="ptc-guide-name">Sarah Johnson</span>
            <span className="ptc-guide-verified"><BadgeCheck size={12} className="verified-icon" /> Verified Guide</span>
          </div>
        </div>

        {/* Rating */}
        <div className="ptc-rating">
          <Star size={14} fill="#FFD700" stroke="#FFD700" /> 
          <span className="ptc-rating-score">{ratingVal.toFixed(1)}</span>
          <span className="ptc-rating-count">({reviewCountVal.toLocaleString()} Reviews)</span>
        </div>

        {/* Tour Details Grid */}
        <div className="ptc-details-grid">
          <div className="ptc-detail-item">
            <Clock size={14} className="detail-icon" /> {durationVal} Minutes
          </div>
          <div className="ptc-detail-item">
            <Users size={14} className="detail-icon" /> {spotsLeft > 0 ? `${spotsLeft} Spots Left` : 'Full'}
          </div>
          <div className="ptc-detail-item">
            <Globe size={14} className="detail-icon" /> AI Translation
          </div>
        </div>

        {/* Footer (Price & CTA) */}
        <div className="ptc-footer">
          <div className="ptc-price-box">
            <span className="ptc-price-label">Price</span>
            <div className="ptc-price-value">{formatPrice(tour.price)}<span className="ptc-price-per">/person</span></div>
          </div>
          <button className="ptc-book-btn">
            {isLive ? 'Join Live Tour' : 'Book Now'}
          </button>
        </div>

      </div>
    </Link>
  );
}
