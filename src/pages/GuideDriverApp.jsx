import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api from '../utils/api';
import './GuideDriverApp.css';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';
import io from 'socket.io-client';

function IncomingRequestModal({ request, onAccept, onReject }) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onReject(); // Auto-reject/expire if timer hits 0
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onReject]);

  return (
    <div className="incoming-req-overlay">
      <div className="incoming-req-modal">
        <h3 style={{color: '#00d4aa', margin: '0 0 10px 0'}}>New Booking Request!</h3>
        <div className="req-timer" style={{borderColor: timeLeft < 15 ? '#ff4d4f' : '#00d4aa'}}>
          {timeLeft}
        </div>
        
        <div className="req-amount">${parseFloat(request.amount).toFixed(2)}</div>
        <p style={{margin: '0 0 20px', color: '#aaa'}}>for {request.duration} minutes</p>

        <div className="req-details">
          <div style={{display:'flex', gap: '10px', marginBottom: '10px'}}>
            <User size={18} color="#00d4aa" /> 
            <span><strong>{request.travelerName || 'Traveler'}</strong> (★ 4.9)</span>
          </div>
          <div style={{display:'flex', gap: '10px', marginBottom: '10px'}}>
            <MapPin size={18} color="#00d4aa" /> 
            <span>{request.distance} km away</span>
          </div>
          <div style={{display:'flex', gap: '10px'}}>
            <Clock size={18} color="#00d4aa" /> 
            <span>Pickup: ASAP</span>
          </div>
        </div>

        <div className="req-actions">
          <button className="btn-reject" onClick={onReject}>Decline</button>
          <button className="btn-accept" onClick={onAccept}>Accept</button>
        </div>
      </div>
    </div>
  );
}

export default function GuideDriverApp() {
  const { user } = useAuth();
  const { formatPrice } = useSettings();
  
  const [socket, setSocket] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [error, setError] = useState('');

  const watchId = useRef(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    // If we have a socket, listen for incoming requests
    if (!socket || !user) return;

    const handleNewRequest = (data) => {
      // Only show popup if it's meant for this specific guide
      if (data.guideId === user.id && isOnline) {
        setIncomingRequest(data);
      }
    };

    const handleExpired = (data) => {
      if (data.guideId === user.id && incomingRequest?.requestId === data.requestId) {
        setIncomingRequest(null); // Remove popup if time ran out backend-side
      }
    };

    socket.on('booking_request', handleNewRequest);
    socket.on('booking_expired', handleExpired);

    return () => {
      socket.off('booking_request', handleNewRequest);
      socket.off('booking_expired', handleExpired);
    };
  }, [socket, user, isOnline, incomingRequest]);

  const toggleOnline = () => {
    const newStatus = !isOnline;
    
    if (newStatus) {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        return;
      }

      watchId.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          
          try {
            await api.setGuideStatus({
              latitude: lat,
              longitude: lon,
              online_status: 'online'
            });
            setIsOnline(true);
            setError('');
          } catch (err) {
            setError(err.message || 'Failed to go online');
            setIsOnline(false);
          }
        },
        (err) => {
          setError('Location access denied. Cannot go online.');
          setIsOnline(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      // Go Offline
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      setIsOnline(false);
      api.setGuideStatus({
        latitude: 0,
        longitude: 0,
        online_status: 'offline'
      }).catch(e => console.error(e));
    }
  };

  const handleAccept = async () => {
    if (!incomingRequest) return;
    try {
      await api.acceptBookingRequest(incomingRequest.requestId);
      setActiveBooking(incomingRequest);
      setIncomingRequest(null);
      // Automatically go busy/offline for new requests
      setIsOnline(false); 
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    } catch (err) {
      setError(err.message || 'Failed to accept booking. It may have expired.');
      setIncomingRequest(null);
    }
  };

  const handleReject = async () => {
    if (!incomingRequest) return;
    try {
      await api.rejectBookingRequest(incomingRequest.requestId);
    } catch (err) {
      console.error(err);
    }
    setIncomingRequest(null);
  };

  if (!user || user.role !== 'guide') {
    return <div className="driver-app-container"><h2>Access Denied. Guide account required.</h2></div>;
  }

  return (
    <div className="driver-app-container">
      {error && <div style={{color: '#ff4d4f', marginBottom: '20px', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '10px'}}>{error}</div>}

      {!activeBooking ? (
        <div className="driver-status-card">
          <button 
            className={`go-online-btn ${isOnline ? 'online' : ''}`}
            onClick={toggleOnline}
          >
            {isOnline ? 'ONLINE' : 'GO ONLINE'}
          </button>
          
          <h3>{isOnline ? "You're visible to travelers!" : "You're offline"}</h3>
          <p style={{color: 'var(--text-muted)'}}>
            {isOnline 
              ? "Keep this app open. We will ping you when a traveler requests a tour near you."
              : "Tap the button above to start receiving live tour requests."}
          </p>
        </div>
      ) : (
        <div className="driver-status-card" style={{border: '1px solid #00d4aa'}}>
          <h2 style={{color: '#00d4aa'}}>Active Tour</h2>
          <p>You are now connected with <strong>{activeBooking.travelerName}</strong>!</p>
          <div style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', margin: '20px 0'}}>
            <p><strong>Pickup Location:</strong> {activeBooking.distance} km away</p>
            <p><strong>Duration:</strong> {activeBooking.duration} mins</p>
            <p><strong>Earnings:</strong> {formatPrice(activeBooking.amount)}</p>
          </div>
          <button className="btn-primary" style={{width: '100%'}} onClick={() => setActiveBooking(null)}>
            Complete Tour
          </button>
        </div>
      )}

      {incomingRequest && (
        <IncomingRequestModal 
          request={incomingRequest} 
          onAccept={handleAccept} 
          onReject={handleReject} 
        />
      )}
    </div>
  );
}
