import React, { useEffect, useRef, useState } from 'react';
import api from '../utils/api';
import './UberMatchingMap.css';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function UberMatchingMap({ socket, user }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const travelerMarker = useRef(null);
  const guideMarkers = useRef({});
  
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, searching, found, accepted
  const [matchedGuide, setMatchedGuide] = useState(null);
  const [error, setError] = useState('');

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    
    // Default to New York or somewhere if geolocation fails
    mapInstance.current = window.L.map(mapRef.current).setView([40.7128, -74.0060], 13);
    
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance.current);

    // Get User Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation({ lat, lon });
          
          mapInstance.current.setView([lat, lon], 14);
          
          // Traveler Icon
          const tIcon = window.L.divIcon({
            className: 'traveler-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          travelerMarker.current = window.L.marker([lat, lon], { icon: tIcon }).addTo(mapInstance.current);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Location access denied. Please allow location to find nearby guides.');
        }
      );
    }
  }, []);

  // Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleRouting = (data) => {
      // Guide didn't answer, re-routed
      if (data.travelerId === user?.id) {
        setStatus('searching');
        setMatchedGuide({ name: data.newGuideName, distance: data.distance });
      }
    };

    const handleAccepted = (data) => {
      if (data.travelerId === user?.id) {
        setStatus('accepted');
        // Calculate ETA roughly (assuming 30km/h average city speed)
        const distanceKm = parseFloat(matchedGuide?.distance || 1.2);
        const etaMins = Math.max(1, Math.ceil((distanceKm / 30) * 60));
        setMatchedGuide(prev => ({ ...prev, eta: etaMins }));
      }
    };

    const handleFailed = (data) => {
      if (data.travelerId === user?.id) {
        setStatus('idle');
        setError(data.message);
      }
    };

    socket.on('booking_routing', handleRouting);
    socket.on('booking_accepted', handleAccepted);
    socket.on('booking_failed', handleFailed);

    return () => {
      socket.off('booking_routing', handleRouting);
      socket.off('booking_accepted', handleAccepted);
      socket.off('booking_failed', handleFailed);
    };
  }, [socket, user, matchedGuide]);

  const handleBookNow = async () => {
    if (!location) {
      setError('Waiting for location...');
      return;
    }
    if (!user) {
      setError('Please log in first.');
      return;
    }
    
    setStatus('searching');
    setError('');

    try {
      const res = await api.requestGuide({
        city: 'Current Location', // In a real app, reverse geocode this
        latitude: location.lat,
        longitude: location.lon,
        amount: 25.00,
        durationMinutes: 60
      });

      if (res.success) {
        setMatchedGuide(res.guide);
        
        // Add guide marker to map
        if (res.guide.latitude && res.guide.longitude) {
          const gIcon = window.L.divIcon({
            className: 'guide-marker',
            html: `<div style="width:100%;height:100%;border-radius:50%;background-image:url(${res.guide.avatar || 'https://i.pravatar.cc/150'});background-size:cover;"></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          
          if (guideMarkers.current['current']) {
            mapInstance.current.removeLayer(guideMarkers.current['current']);
          }
          guideMarkers.current['current'] = window.L.marker([res.guide.latitude, res.guide.longitude], { icon: gIcon }).addTo(mapInstance.current);
          
          // Fit bounds
          const bounds = window.L.latLngBounds(
            [location.lat, location.lon],
            [res.guide.latitude, res.guide.longitude]
          );
          mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    } catch (err) {
      setStatus('idle');
      setError(err.message || 'Failed to request guide. Are there any online?');
    }
  };

  return (
    <div className="uber-matching-wrapper">
      <div ref={mapRef} className="uber-map-container"></div>
      
      <div className="uber-overlay-ui">
        {error && <div style={{color: '#ff4d4f', marginBottom: '10px'}}>{error}</div>}
        
        {status === 'idle' && (
          <>
            <div className="uber-status">Ready to explore?</div>
            <button className="btn-primary" style={{width: '100%'}} onClick={handleBookNow}>
              Find Nearest Guide Now
            </button>
          </>
        )}

        {status === 'searching' && (
          <>
            <div className="uber-status" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
              <Loader2 className="spinner" size={20} /> Contacting Guide...
            </div>
            {matchedGuide && (
              <div className="uber-guide-info">
                <img src={matchedGuide.avatar || `https://i.pravatar.cc/150?u=${matchedGuide.guide_id}`} alt="Guide" />
                <div className="uber-guide-details">
                  <h4>{matchedGuide.guide_name || matchedGuide.name}</h4>
                  <p>{matchedGuide.distance || 1.2} km away</p>
                </div>
              </div>
            )}
            <p style={{fontSize: '0.8rem', color: '#aaa'}}>Waiting for them to accept...</p>
          </>
        )}

        {status === 'accepted' && (
          <>
            <div className="uber-status" style={{color: '#00d4aa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
              <CheckCircle2 size={24} /> Guide Accepted!
            </div>
            {matchedGuide && (
              <div className="uber-guide-info" style={{background: 'rgba(0, 212, 170, 0.1)'}}>
                <img src={matchedGuide.avatar || `https://i.pravatar.cc/150?u=${matchedGuide.guide_id}`} alt="Guide" />
                <div className="uber-guide-details">
                  <h4>{matchedGuide.guide_name || matchedGuide.name} is on the way</h4>
                  <p style={{color: '#fff', fontWeight: 'bold'}}>ETA: {matchedGuide.eta || 3} mins</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
