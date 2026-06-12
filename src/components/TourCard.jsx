import { Link } from 'react-router-dom';
import { Star, Clock, Users, Globe, Play, BadgeCheck, Heart, Share2, Calendar } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';
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

export default function TourCard({ tour, featured = false, delay = 0 }) {
  const { formatPrice } = useSettings();
  if (!tour) return null;

  const isLive = tour.type === 'live';
  
  // Safe parsing for database values vs mock values
  const ratingVal = tour.rating !== undefined && tour.rating !== null ? parseFloat(tour.rating) : 0.0;
  const reviewCountVal = tour.reviewCount !== undefined && tour.reviewCount !== null ? parseInt(tour.reviewCount, 10) : 0;
  const maxParticipantsVal = tour.maxParticipants !== undefined && tour.maxParticipants !== null ? parseInt(tour.maxParticipants, 10) : 20;
  const currentParticipantsVal = tour.currentParticipants !== undefined && tour.currentParticipants !== null ? parseInt(tour.currentParticipants, 10) : 0;
  const spotsLeft = maxParticipantsVal - currentParticipantsVal;
  const durationVal = tour.duration || tour.durationMinutes || 60;
  const coverImg = tour.coverImage || tour.cover_image || "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80";
  const guideLevel = tour.guideLevel || 'Super Guide';
  const category = tour.category || 'Cultural Walk';
  const nextSlot = tour.nextSlot || 'Today, 10:00 AM';

  const flag = getFlag(tour.location);

  const handleActionClick = (e) => {
    e.preventDefault(); // prevent navigation
    // Add logic for wishlist or share
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%' }}
    >
      <Link to={`/tours/${tour.id}`} className="liquid-tour-card">
        
        {/* ── Image Section (16:10) ── */}
        <div className="ltc-image-wrap">
          <img src={coverImg} alt={tour.title} className="ltc-image" loading="lazy" />
          <div className="ltc-image-overlay" />
          
          {/* Actions Menu */}
          <div className="ltc-actions">
            <button className="ltc-action-btn" onClick={handleActionClick}>
              <Heart size={16} />
            </button>
            <button className="ltc-action-btn" onClick={handleActionClick}>
              <Share2 size={16} />
            </button>
          </div>

          {/* Top Badges */}
          <div className="ltc-badges-top">
            {isLive ? (
              <div className="ltc-badge live-badge">
                <span className="live-dot" /> LIVE NOW
              </div>
            ) : (
              <div className="ltc-badge category-badge">
                {category}
              </div>
            )}
            {tour.featured && <div className="ltc-badge" style={{ background: 'var(--grad-amber)', color: '#000' }}>⭐ FEATURED</div>}
          </div>

          {/* Viewers / Rating Block */}
          {isLive ? (
            <div className="ltc-viewers">
              <span className="live-dot" /> {Math.floor(Math.random() * 500 + 100)} Watching
            </div>
          ) : (
            <div className="ltc-viewers" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <Star size={12} fill="#FFD700" stroke="#FFD700" /> {ratingVal.toFixed(1)} ({reviewCountVal})
            </div>
          )}
        </div>

        {/* ── Content Section ── */}
        <div className="ltc-body">
          
          {/* Location */}
          <div className="ltc-location">
            <span style={{ fontSize: '1.2em' }}>{flag}</span> {tour.location}
          </div>

          {/* Title */}
          <h3 className="ltc-title">{tour.title}</h3>

          {/* Guide Profile Strip */}
          <div className="ltc-guide-strip">
            <img src={tour.guideAvatar || tour.guide_avatar || `https://i.pravatar.cc/150?u=${tour.id}`} alt="Guide" className="ltc-guide-avatar" />
            <div className="ltc-guide-info">
              <span className="ltc-guide-name">
                {tour.guideName || tour.guide_name || 'Local Expert'} 
                <BadgeCheck size={14} className="verified-icon" />
              </span>
              <span className="ltc-guide-level">{guideLevel}</span>
            </div>
          </div>

          {/* Tour Details Grid */}
          <div className="ltc-details-grid">
            <div className="ltc-detail-item">
              <Clock size={14} className="detail-icon" /> {durationVal} Minutes
            </div>
            <div className="ltc-detail-item">
              <Users size={14} className="detail-icon" /> {spotsLeft > 0 ? `${spotsLeft} Spots Left` : 'Sold Out'}
            </div>
            <div className="ltc-detail-item">
              <Globe size={14} className="detail-icon" /> {tour.language || 'English'}
            </div>
            <div className="ltc-detail-item">
              <Star size={14} className="detail-icon" style={{color: 'var(--accent-amber)'}} /> {ratingVal.toFixed(1)} Rating
            </div>
          </div>

          {/* Next Slot */}
          <div className="ltc-slot">
            <Calendar size={14} className="detail-icon" />
            Next slot: <span className="ltc-slot-time">{nextSlot}</span>
          </div>

          {/* Footer (Price & CTA) */}
          <div className="ltc-footer">
            <div className="ltc-price-box">
              <span className="ltc-price-label">Price</span>
              <div className="ltc-price-value">{formatPrice(tour.price)}<span className="ltc-price-per">/person</span></div>
            </div>
            <button className="ltc-book-btn">
              View Details
            </button>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
