import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Globe, Play, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
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

const getCityImages = (location, title, defaultImg) => {
  const query = `${location || ''} ${title || ''}`.toLowerCase();
  
  if (query.includes('taj') || query.includes('agra')) {
    return [
      'https://images.unsplash.com/photo-1564507592208-02722130c242?w=800&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
      'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=800&q=80'
    ];
  }
  if (query.includes('mumbai')) {
    return [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80',
      'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=800&q=80'
    ];
  }
  if (query.includes('mysuru') || query.includes('mysore')) {
    return [
      'https://images.unsplash.com/photo-1600100397608-f010f41cb8e1?w=800&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
      'https://images.unsplash.com/photo-1514222025134-2e5fbf2b5e13?w=800&q=80'
    ];
  }
  if (query.includes('bangalore') || query.includes('bengaluru')) {
    return [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
      'https://images.unsplash.com/photo-1514222025134-2e5fbf2b5e13?w=800&q=80',
      'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=80'
    ];
  }
  if (query.includes('tokyo') || query.includes('japan')) {
    return [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
      'https://images.unsplash.com/photo-1590559899731-a382839cecd5?w=800&q=80'
    ];
  }
  if (query.includes('rome') || query.includes('italy')) {
    return [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4085ee6b63b?w=800&q=80',
      'https://images.unsplash.com/photo-1543429776-27826ac5e6e3?w=800&q=80'
    ];
  }
  
  // Fallback: If defaultImg is valid Unsplash, put it first, then add some general travel images
  const isValidUrl = defaultImg && defaultImg.startsWith('http') && !defaultImg.includes('source.unsplash.com');
  const baseArray = isValidUrl ? [defaultImg] : [];
  
  return [
    ...baseArray,
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'
  ].slice(0, 3);
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
  const coverImg = tour.coverImage || tour.cover_image || null;
  const images = getCityImages(tour.location, tour.title, coverImg);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const flag = getFlag(tour.location);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Link to={`/tours/${tour.id}`} className={`premium-tour-card ${featured ? 'featured-card' : ''}`}>
      
      {/* ── Image Section (16:9) ── */}
      <div className="ptc-image-wrap">
        <img src={images[currentImageIndex]} alt={tour.title} className="ptc-image" loading="lazy" />
        <div className="ptc-image-overlay" />
        
        {images.length > 1 && (
          <>
            <button className="ptc-slider-btn left" onClick={prevImage}>
              <ChevronLeft size={16} />
            </button>
            <button className="ptc-slider-btn right" onClick={nextImage}>
              <ChevronRight size={16} />
            </button>
            <div className="ptc-slider-dots">
              {images.map((_, i) => (
                <span key={i} className={`ptc-slider-dot ${i === currentImageIndex ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
        
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
          <img src={tour.guideAvatar || tour.guide_avatar || `https://i.pravatar.cc/150?u=${tour.id}`} alt="Guide" className="ptc-guide-avatar" />
          <div className="ptc-guide-info">
            <span className="ptc-guide-name">{tour.guideName || tour.guide_name || 'Local Expert'}</span>
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
            View Details
          </button>
        </div>

      </div>
    </Link>
  );
}
