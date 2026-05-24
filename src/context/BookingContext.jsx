import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

const MATCHING_STAGES = ['idle', 'searching', 'found', 'accepted', 'confirmed'];

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(null);
  const [matchingState, setMatchingState] = useState('idle');
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [step, setStep] = useState(1);

  const startBooking = useCallback((tour) => {
    setBooking({ tour, date: null, time: null, participants: 1 });
    setStep(1);
  }, []);

  const updateBooking = useCallback((data) => {
    setBooking(prev => ({ ...prev, ...data }));
  }, []);

  const startMatching = useCallback((guides) => {
    setMatchingState('searching');
    // Simulate Uber-style guide matching
    const sorted = [...guides].sort(() => Math.random() - 0.5);
    let idx = 0;
    const tryNextGuide = () => {
      if (idx >= sorted.length) {
        setMatchingState('idle');
        return;
      }
      const guide = sorted[idx];
      idx++;
      setTimeout(() => {
        setMatchingState('found');
        setMatchedGuide(guide);
        // Simulate guide accepting after 2-4 seconds
        setTimeout(() => {
          setMatchingState('accepted');
          setTimeout(() => setMatchingState('confirmed'), 1500);
        }, 2000 + Math.random() * 2000);
      }, 1500 + idx * 500);
    };
    tryNextGuide();
  }, []);

  const resetMatching = useCallback(() => {
    setMatchingState('idle');
    setMatchedGuide(null);
  }, []);

  const clearBooking = useCallback(() => {
    setBooking(null);
    setMatchingState('idle');
    setMatchedGuide(null);
    setStep(1);
  }, []);

  return (
    <BookingContext.Provider value={{
      booking, step, setStep, startBooking, updateBooking, clearBooking,
      matchingState, matchedGuide, startMatching, resetMatching,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
