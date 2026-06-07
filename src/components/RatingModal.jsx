import { useState } from 'react';
import { Star, Send, X, ShieldCheck } from 'lucide-react';
import './RatingModal.css';

export default function RatingModal({ tourName, guideName, onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="modal-overlay">
        <div className="glass-card rating-modal rating-modal--success slide-up">
          <div className="success-icon">✓</div>
          <h2>Thank you!</h2>
          <p>Your feedback helps <strong>{guideName}</strong> and the ZilliGO community.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="glass-card rating-modal slide-up">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="rating-header">
          <div className="badge badge-teal"><ShieldCheck size={12} /> Verified Session</div>
          <h2>How was your tour?</h2>
          <p>Rate your experience with <strong>{guideName}</strong> in <em>{tourName}</em></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${(hover || rating) >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star size={32} fill={(hover || rating) >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: 'var(--space-xl)' }}>
            <label className="form-label">Write a review (Optional)</label>
            <textarea 
              className="input" 
              rows="4" 
              placeholder="What did you love? Any tips for other travelers?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: 'var(--space-lg)' }}
            disabled={rating === 0}
          >
            Submit Review <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
