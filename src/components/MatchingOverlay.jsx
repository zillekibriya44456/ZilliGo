import { useEffect } from 'react';
import { CheckCircle, X, MapPin, Star, Clock, Phone, Zap } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import './MatchingOverlay.css';

export default function MatchingOverlay({ onClose }) {
  const { matchingState, matchedGuide, resetMatching } = useBooking();

  const handleClose = () => {
    resetMatching();
    if (onClose) onClose();
  };

  return (
    <div className="matching-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="matching-modal glass-card animate-bounce-in">
        {/* Header */}
        <div className="matching-modal__header">
          <h3>
            {matchingState === 'searching' && 'Finding Your Guide...'}
            {matchingState === 'found' && 'Guide Found! 🎉'}
            {matchingState === 'accepted' && 'Guide Accepted! ✅'}
            {matchingState === 'confirmed' && 'Booking Confirmed! 🚀'}
          </h3>
          <button className="matching-modal__close" onClick={handleClose}><X size={18} /></button>
        </div>

        {/* Searching State */}
        {matchingState === 'searching' && (
          <div className="matching-searching">
            <div className="matching-radar">
              <div className="matching-radar__ring matching-radar__ring--1" />
              <div className="matching-radar__ring matching-radar__ring--2" />
              <div className="matching-radar__ring matching-radar__ring--3" />
              <div className="matching-radar__center">
                <MapPin size={22} />
              </div>
              {/* Guide dots */}
              <div className="matching-radar__dot" style={{ top: '20%', left: '60%' }} />
              <div className="matching-radar__dot" style={{ top: '65%', left: '25%' }} />
              <div className="matching-radar__dot" style={{ top: '40%', left: '75%' }} />
            </div>
            <p className="matching-searching__text">Scanning for nearest available guides in your area...</p>
            <div className="matching-searching__steps">
              <div className="matching-step matching-step--active"><Zap size={14} /> Locating guides</div>
              <div className="matching-step"><Clock size={14} /> Checking availability</div>
              <div className="matching-step"><Phone size={14} /> Notifying guide</div>
            </div>
          </div>
        )}

        {/* Found / Accepted / Confirmed State */}
        {(matchingState === 'found' || matchingState === 'accepted' || matchingState === 'confirmed') && matchedGuide && (
          <div className="matching-found">
            <div className="matching-found__guide">
              <div className="matching-found__avatar-wrap">
                <img src={matchedGuide.avatar} alt={matchedGuide.name} className="matching-found__avatar" />
                {matchingState === 'confirmed' && (
                  <div className="matching-found__check"><CheckCircle size={20} fill="var(--accent-teal)" /></div>
                )}
              </div>
              <div className="matching-found__info">
                <h4>{matchedGuide.name}</h4>
                <div className="matching-found__rating">
                  <Star size={13} fill="var(--accent-amber)" stroke="none" />
                  <span>{matchedGuide.rating} · {matchedGuide.reviewCount} reviews</span>
                </div>
                <div className="matching-found__location"><MapPin size={12} /> {matchedGuide.location}</div>
              </div>
            </div>

            <div className="matching-found__stats">
              <div className="matching-stat">
                <span className="matching-stat__value">{matchedGuide.responseTime}</span>
                <span className="matching-stat__label">Response Time</span>
              </div>
              <div className="matching-stat">
                <span className="matching-stat__value">{matchedGuide.toursCompleted.toLocaleString()}</span>
                <span className="matching-stat__label">Tours Done</span>
              </div>
              <div className="matching-stat">
                <span className="matching-stat__value">{matchedGuide.languages.length} lang</span>
                <span className="matching-stat__label">Languages</span>
              </div>
            </div>

            {matchingState === 'found' && (
              <div className="matching-waiting">
                <div className="spinner" />
                <p>Waiting for guide to accept...</p>
                <div className="matching-timer">
                  <div className="matching-timer__bar" />
                </div>
              </div>
            )}

            {matchingState === 'accepted' && (
              <div className="matching-accepted">
                <div className="matching-accepted__icon">✅</div>
                <p><strong>{matchedGuide.name}</strong> accepted your booking!</p>
              </div>
            )}

            {matchingState === 'confirmed' && (
              <div className="matching-confirmed">
                <div className="matching-confirmed__icon">🎉</div>
                <h4>You're all set!</h4>
                <p>Your guide is ready. You can join the live room now or view details in your dashboard.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.5rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', background: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }} 
                    onClick={() => { window.location.href = `/live/original-1`; }}
                  >
                    Join Live Tour Now 🎬
                  </button>
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => { window.location.href = '/dashboard'; }}>
                    View Booking in Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
