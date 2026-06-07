import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Globe, MapPin, Play, CheckCircle, Share2, Heart, Calendar, Shield, Award, ChevronRight } from 'lucide-react';
import { getTourById, getGuideById, TOURS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import MatchingOverlay from '../components/MatchingOverlay';
import PaymentOverlay from '../components/PaymentOverlay';
import TourCard from '../components/TourCard';
import './TourDetail.css';

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startMatching, matchingState } = useBooking();
  const tour = getTourById(id);
  const guide = tour ? getGuideById(tour.guide) : null;
  const [wishlist, setWishlist] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [bookingType, setBookingType] = useState('instant'); // instant, request, waitlist
  const [showMatching, setShowMatching] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const availableTimes = ['10:00 AM', '02:00 PM', '06:00 PM'];
  const capacityStatus = {
    '10:00 AM': { available: 5, status: 'instant' },
    '02:00 PM': { available: 0, status: 'waitlist' },
    '06:00 PM': { available: 2, status: 'request' }
  };

  const similarTours = TOURS.filter(t => t.id !== id && t.category === tour?.category).slice(0, 4);

  if (!tour || !guide) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <h2>Tour not found</h2>
        <Link to="/explore" className="btn btn-primary">Browse Tours</Link>
      </div>
    );
  }

  const handleBook = async () => {
    if (!user) { navigate('/auth'); return; }
    if (tour.type === 'live') {
      if (!selectedDate || !selectedTime) return alert('Please select a date and time slot.');
      
      if (bookingType === 'waitlist') {
        alert('You have been added to the waitlist! We will notify you if a spot opens up.');
        return;
      }
      
      try {
        const response = await api.requestBooking({
          tourId: tour.id,
          guideId: guide.id,
          date: selectedDate,
          time: selectedTime,
          participants,
          bookingType,
        });

        if (bookingType === 'request') {
          alert('✅ Booking request sent to the guide. They will review it shortly. You can check the status in your Dashboard.');
          navigate('/dashboard');
          return;
        }

        // For instant booking, proceed to payment
        setCreatedBooking(response.booking);
        setShowPayment(true);
      } catch (err) {
        alert('Error creating booking. Please try again later.');
      }
    } else {
      navigate(`/live/${tour.id}`);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate('/dashboard');
  };

  const total = tour.price * participants;

  return (
    <div className="page-wrapper tour-detail">
      {showMatching && matchingState !== 'idle' && (
        <MatchingOverlay onClose={() => setShowMatching(false)} />
      )}

      {showPayment && (
        <PaymentOverlay 
          amount={total} 
          tourId={tour.id}
          booking={createdBooking}
          onPaymentSuccess={handlePaymentSuccess} 
          onClose={() => setShowPayment(false)} 
        />
      )}

      {/* Hero */}
      <div className="td-hero">
        <img src={tour.coverImage} alt={tour.title} className="td-hero__img" />
        <div className="td-hero__overlay" />
        <div className="container td-hero__content">
          <div className="td-breadcrumb">
            <Link to="/explore">Explore</Link> <ChevronRight size={14} /> <span>{tour.category}</span> <ChevronRight size={14} /> <span>{tour.title}</span>
          </div>
          <div className="td-hero__badges">
            {tour.type === 'live' ? (
              <span className="badge badge-live">🔴 LIVE</span>
            ) : (
              <span className="badge badge-purple">🎬 Recorded</span>
            )}
            {tour.featured && <span className="badge badge-amber">⭐ Featured</span>}
          </div>
          <h1 className="td-hero__title">{tour.title}</h1>
          <div className="td-hero__meta">
            <span><MapPin size={15} /> {tour.location}</span>
            <span><Star size={15} fill="var(--accent-amber)" stroke="none" /> {tour.rating} ({tour.reviewCount.toLocaleString()} reviews)</span>
            <span><Clock size={15} /> {tour.duration} min</span>
            <span><Globe size={15} /> {tour.language}</span>
            {tour.type === 'live' && <span><Users size={15} /> {tour.maxParticipants - tour.currentParticipants} spots left</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container td-body">
        <div className="td-main">
          {/* Description */}
          <section className="td-section">
            <h2>About This Tour</h2>
            <p className="td-description">{tour.description}</p>
            <div className="td-tags">
              {tour.tags.map(tag => <span key={tag} className="badge badge-teal">{tag}</span>)}
            </div>
          </section>

          {/* What's Included */}
          <section className="td-section">
            <h2>What's Included</h2>
            <div className="td-includes">
              {[
                { icon: '🎥', text: `${tour.type === 'live' ? 'HD Live' : 'HD Recorded'} Video` },
                { icon: '💬', text: 'Live Chat with Guide' },
                { icon: '📱', text: 'Mobile App Access' },
                { icon: '🌐', text: 'Multi-Language Support' },
                { icon: '⭐', text: '24/7 Support' },
                { icon: '🔄', text: 'Free Rescheduling (48h notice)' },
              ].map(item => (
                <div key={item.text} className="td-include-item">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                  <CheckCircle size={14} style={{ color: 'var(--accent-teal)', marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </section>

          {/* Guide */}
          <section className="td-section">
            <h2>Your Guide</h2>
            <Link to={`/guide/${guide.id}`} className="td-guide glass-card">
              <div className="td-guide__header">
                <img src={guide.avatar} alt={guide.name} className="td-guide__avatar" />
                <div className="td-guide__info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3>{guide.name}</h3>
                    {guide.verified && <CheckCircle size={16} style={{ color: 'var(--accent-teal)' }} />}
                  </div>
                  <div className="td-guide__rating">
                    <Star size={14} fill="var(--accent-amber)" stroke="none" />
                    {guide.rating} · {guide.reviewCount} reviews · {guide.toursCompleted.toLocaleString()} tours done
                  </div>
                  <div className="td-guide__location"><MapPin size={13} /> {guide.location}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{guide.bio}</p>
              <div className="td-guide__badges">
                {guide.badges.map(b => <span key={b} className="guide-card__badge-item">{b}</span>)}
              </div>
              <div className="td-guide__langs">
                <Globe size={14} /> Speaks: {guide.languages.join(', ')}
              </div>
            </Link>
          </section>

          {/* Similar Tours */}
          {similarTours.length > 0 && (
            <section className="td-section">
              <h2>Similar Tours</h2>
              <div className="grid-4">
                {similarTours.map(t => <TourCard key={t.id} tour={t} />)}
              </div>
            </section>
          )}
        </div>

        {/* Booking Sidebar */}
        <aside className="td-sidebar">
          <div className="td-booking-card glass-card">
            <div className="td-booking-price">
              <span className="td-booking-amount">${tour.price}</span>
              <span className="td-booking-per">per person</span>
            </div>
            <div className="td-booking-rating">
              <Star size={14} fill="var(--accent-amber)" stroke="none" />
              <strong>{tour.rating}</strong>
              <span>· {tour.reviewCount.toLocaleString()} reviews</span>
            </div>
            <hr className="divider" style={{ margin: '1rem 0' }} />

            {tour.type === 'live' && (
              <>
                <div className="td-booking-field">
                  <label>Date</label>
                  <input type="date" className="input" value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                {selectedDate && (
                  <div className="td-booking-field">
                    <label>Available Time Slots</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                      {availableTimes.map(time => {
                        const info = capacityStatus[time];
                        const isSelected = selectedTime === time;
                        return (
                          <button 
                            key={time}
                            onClick={() => { setSelectedTime(time); setBookingType(info.status); }}
                            style={{
                              padding: '8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                              background: isSelected ? 'var(--accent-teal)' : 'rgba(255,255,255,0.05)',
                              color: isSelected ? '#000' : 'var(--text-primary)',
                              border: `1px solid ${isSelected ? 'var(--accent-teal)' : 'var(--border-glass)'}`,
                              cursor: 'pointer', textAlign: 'center', opacity: info.status === 'waitlist' ? 0.6 : 1
                            }}
                          >
                            {time}
                            <div style={{ fontSize: '0.65rem', fontWeight: 400, marginTop: '2px', color: isSelected ? '#000' : 'var(--text-muted)' }}>
                              {info.status === 'waitlist' ? 'Waitlist Only' : `${info.available} spots left`}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="td-booking-field">
              <label>Guests</label>
              <div className="td-booking-participants">
                <button onClick={() => setParticipants(p => Math.max(1, p - 1))}>−</button>
                <span>{participants}</span>
                <button onClick={() => setParticipants(p => Math.min(tour.maxParticipants, p + 1))}>+</button>
              </div>
            </div>

            <div className="td-booking-total" style={{ borderTop: '1px solid var(--border-glass-strong)', paddingTop: '1rem', marginTop: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Total (Taxes included)</span>
              <span className="td-booking-total-amount">${total}</span>
            </div>

            <button 
              className={`btn ${bookingType === 'waitlist' ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ width: '100%', marginBottom: '0.75rem', marginTop: '1rem', opacity: (!selectedDate || !selectedTime) && tour.type === 'live' ? 0.5 : 1 }} 
              onClick={handleBook}
            >
              {tour.type !== 'live' ? '▶ Watch Now' : 
               bookingType === 'waitlist' ? 'Join Waitlist' : 
               bookingType === 'request' ? 'Request to Book' : 
               'Instant Book'}
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }}

              onClick={() => setWishlist(!wishlist)}>
              <Heart size={16} fill={wishlist ? 'currentColor' : 'none'} />
              {wishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>

            <div className="td-booking-trust">
              <div className="td-trust-item"><Shield size={14} /> Secure Payment</div>
              <div className="td-trust-item"><CheckCircle size={14} /> Free Cancellation (48h)</div>
              <div className="td-trust-item"><Award size={14} /> Verified Guide</div>
            </div>
          </div>

          {/* Share */}
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: '0.5rem' }}>
            <Share2 size={16} /> Share this tour
          </button>
        </aside>
      </div>
    </div>
  );
}
