import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Globe, MapPin, Play, CheckCircle, Share2, Heart, Calendar, Shield, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import MatchingOverlay from '../components/MatchingOverlay';
import PaymentOverlay from '../components/PaymentOverlay';
import TourCard from '../components/TourCard';
import { api } from '../utils/api';
import './TourDetail.css';

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startMatching, matchingState } = useBooking();

  const [tour, setTour] = useState(null);
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  const [wishlist, setWishlist] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [bookingType, setBookingType] = useState('instant');
  const [showMatching, setShowMatching] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [bookingError, setBookingError] = useState('');

  const availableTimes = ['10:00 AM', '02:00 PM', '06:00 PM'];
  const capacityStatus = {
    '10:00 AM': { available: 5, status: 'instant' },
    '02:00 PM': { available: 0, status: 'waitlist' },
    '06:00 PM': { available: 2, status: 'request' }
  };

  useEffect(() => {
    const fetchTourAndGuide = async () => {
      setLoading(true);
      try {
        const data = await api.getTourById(id);
        if (data && !data.message) {
          setTour(data);
          const guideId = data.guideId || data.guide_id;
          if (guideId) {
            const guideData = await api.getMarketplaceGuide(guideId);
            if (guideData && guideData.guide) {
              setGuide(guideData.guide);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching tour detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTourAndGuide();
  }, [id]);

  if (loading) {
    return (
      <div className="td-loading">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="spinner-lg" />
        <p>Loading experience details...</p>
      </div>
    );
  }

  if (!tour || !guide) {
    return (
      <div className="td-empty">
        <span className="td-empty-icon">🔍</span>
        <h2>Experience not found</h2>
        <Link to="/explore" className="btn-liquid">Browse Tours</Link>
      </div>
    );
  }

  const ratingVal = tour.rating !== undefined && tour.rating !== null ? parseFloat(tour.rating) : 0.0;
  const reviewCountVal = tour.reviewCount !== undefined && tour.reviewCount !== null ? parseInt(tour.reviewCount, 10) : 0;
  const maxParticipantsVal = tour.maxParticipants || 20;
  const currentParticipantsVal = tour.currentParticipants || 0;
  const spotsLeft = maxParticipantsVal - currentParticipantsVal;
  const durationVal = tour.duration || tour.durationMinutes || 0;
  const coverImg = tour.coverImage || tour.cover_image || "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80";
  const tagsVal = tour.tags || ['Travel', 'Sightseeing'];

  const handleBook = async () => {
    try {
      if (!user) { navigate('/auth'); return; }
      setBookingError('');
      if (!selectedDate || !selectedTime) {
        setBookingError('Please select a date and time slot first.');
        return;
      }
      if (bookingType === 'waitlist') {
        alert('You have been added to the waitlist! We will notify you if a spot opens up.');
        return;
      }
        
      const requestData = { tourId: tour?.id, guideId: guide?.id, date: selectedDate, time: selectedTime, participants, bookingType };
      const response = await api.requestBooking(requestData);

      if (!response || response.error || !response.booking) {
        throw new Error(response?.message || 'Error creating booking: Backend validation failed');
      }

      if (bookingType === 'request') {
        alert('✅ Booking request sent to the guide. They will review it shortly. You can check the status in your Dashboard.');
        navigate('/dashboard');
        return;
      }

      setCreatedBooking(response.booking);
      setShowPayment(true);
    } catch (err) {
      setBookingError(`API Error: ${err.message}`);
    }
  };

  const total = tour.price * participants;

  return (
    <div className="tour-detail-page">
      {showMatching && matchingState !== 'idle' && <MatchingOverlay onClose={() => setShowMatching(false)} />}
      {showPayment && <PaymentOverlay amount={total} tourId={tour.id} booking={createdBooking} onPaymentSuccess={() => {setShowPayment(false); navigate('/dashboard');}} onClose={() => setShowPayment(false)} />}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="td-hero-liquid">
        <div className="td-hero-bg" style={{ backgroundImage: `url(${coverImg})` }} />
        <div className="td-hero-gradient" />
        <div className="container td-hero-content">
          <div className="td-breadcrumb">
            <Link to="/explore">Explore</Link> <ChevronRight size={14} /> <span>{tour.category}</span> <ChevronRight size={14} /> <span className="td-breadcrumb-active">{tour.title}</span>
          </div>
          
          <div className="td-hero-badges">
            {tour.type === 'live' ? <span className="badge-liquid badge-live"><span className="live-dot"/> LIVE</span> : <span className="badge-liquid badge-purple">🎬 Recorded</span>}
            {tour.featured && <span className="badge-liquid badge-amber">⭐ Editor's Pick</span>}
          </div>
          
          <h1 className="td-title">{tour.title}</h1>
          
          <div className="td-meta-row">
            <span><MapPin size={16} /> {tour.location}</span>
            <span><Star size={16} fill="var(--accent-amber)" color="var(--accent-amber)" /> {ratingVal.toFixed(1)} ({reviewCountVal.toLocaleString()} reviews)</span>
            <span><Clock size={16} /> {durationVal} min</span>
            <span><Globe size={16} /> {tour.language}</span>
          </div>
        </div>
      </motion.div>

      <div className="container td-layout-split">
        {/* Main Content Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="td-main-content">
          <section className="td-section">
            <h2>About this experience</h2>
            <p className="td-desc-text">{tour.description}</p>
            <div className="td-tags-liquid">
              {tagsVal.map(tag => <span key={tag} className="tag-glass">{tag}</span>)}
            </div>
          </section>

          <section className="td-section">
            <h2>What's included</h2>
            <div className="td-includes-grid">
              {[
                { icon: '🎥', text: `${tour.type === 'live' ? 'Ultra HD Live' : 'HD Recorded'} Video Stream` },
                { icon: '💬', text: 'Real-time Interactive Chat' },
                { icon: '⚡', text: 'Instant AI Voice Translation' },
                { icon: '📱', text: 'Cross-platform App Access' },
                { icon: '⭐', text: '24/7 Global Support' },
                { icon: '🔄', text: 'Free Rescheduling (48h notice)' },
              ].map(item => (
                <div key={item.text} className="td-include-card glass-panel">
                  <span className="td-inc-icon">{item.icon}</span>
                  <span className="td-inc-text">{item.text}</span>
                  <CheckCircle size={16} className="td-inc-check" />
                </div>
              ))}
            </div>
          </section>

          <section className="td-section">
            <h2>Meet your Guide</h2>
            <Link to={`/guide/${guide.id}`} className="td-guide-card glass-panel">
              <div className="td-guide-header">
                <img src={guide.avatar} alt={guide.name} className="td-guide-avatar" />
                <div className="td-guide-info">
                  <div className="td-guide-name-row">
                    <h3>{guide.name}</h3>
                    {guide.verified && <CheckCircle size={16} className="text-teal" />}
                  </div>
                  <div className="td-guide-stats">
                    <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
                    {parseFloat(guide.rating || guide.avgRating || 0).toFixed(1)} · {guide.reviewCount || 0} reviews · {parseInt(guide.toursCompleted || guide.totalTours || 0, 10).toLocaleString()} tours completed
                  </div>
                  <div className="td-guide-loc"><MapPin size={14} /> {guide.location}</div>
                </div>
              </div>
              <p className="td-guide-bio">{guide.bio}</p>
              <div className="td-guide-badges">
                {(guide.badges || ['Local Expert']).map(b => <span key={b} className="g-badge">{b}</span>)}
              </div>
            </Link>
          </section>
        </motion.div>

        {/* Sticky Booking Widget */}
        <div className="td-sidebar">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="td-booking-widget glass-panel">
            <div className="td-bw-header">
              <div className="td-bw-price">
                <span className="amount">${tour.price}</span>
                <span className="per">/ person</span>
              </div>
              <div className="td-bw-rating">
                <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
                <strong>{ratingVal.toFixed(1)}</strong>
              </div>
            </div>

            <div className="td-bw-body">
              {tour.type === 'live' && (
                <>
                  <div className="bw-field">
                    <label>Date</label>
                    <input type="date" className="bw-input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  
                  {selectedDate && (
                    <div className="bw-field">
                      <label>Time Slots</label>
                      <div className="bw-times-grid">
                        {availableTimes.map(time => {
                          const info = capacityStatus[time];
                          const isSelected = selectedTime === time;
                          return (
                            <button 
                              key={time}
                              onClick={() => { setSelectedTime(time); setBookingType(info.status); }}
                              className={`bw-time-btn ${isSelected ? 'selected' : ''} ${info.status === 'waitlist' ? 'disabled' : ''}`}
                            >
                              <span>{time}</span>
                              <small>{info.status === 'waitlist' ? 'Waitlist' : `${info.available} spots`}</small>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="bw-field">
                <label>Guests</label>
                <div className="bw-counter">
                  <button onClick={() => setParticipants(p => Math.max(1, p - 1))}>−</button>
                  <span>{participants}</span>
                  <button onClick={() => setParticipants(p => Math.min(maxParticipantsVal, p + 1))}>+</button>
                </div>
              </div>
            </div>

            <div className="td-bw-footer">
              <div className="bw-total">
                <span>Total (Taxes incl.)</span>
                <span className="bw-total-amount">${total}</span>
              </div>

              {bookingError && <div className="bw-error">{bookingError}</div>}

              <button 
                className={`btn-liquid bw-book-btn ${bookingType === 'waitlist' ? 'waitlist' : ''}`}
                disabled={tour.type === 'live' && (!selectedDate || !selectedTime)}
                onClick={handleBook}
              >
                {bookingType === 'waitlist' ? 'Join Waitlist' : bookingType === 'request' ? 'Request to Book' : 'Instant Book'}
              </button>

              <button className="btn-ghost bw-save-btn" onClick={() => setWishlist(!wishlist)}>
                <Heart size={16} fill={wishlist ? 'var(--accent-rose)' : 'none'} color={wishlist ? 'var(--accent-rose)' : 'currentColor'} />
                {wishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>

              <div className="bw-trust-badges">
                <span><Shield size={14}/> Secure</span>
                <span><CheckCircle size={14}/> Verified Guide</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
