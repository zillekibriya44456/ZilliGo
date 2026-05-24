import { useState } from 'react';
import { Sparkles, Map, Calendar, Users, ArrowRight, Loader, Globe, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import './TripPlanner.css';

// Smart itinerary generation based on user input keywords
function generateItinerary(prompt) {
  const p = prompt.toLowerCase();

  const detectCity = () => {
    if (p.includes('tokyo') || p.includes('japan')) return { city: 'Tokyo', country: 'Japan', emoji: '🗼' };
    if (p.includes('paris') || p.includes('france')) return { city: 'Paris', country: 'France', emoji: '🗺️' };
    if (p.includes('rome') || p.includes('italy')) return { city: 'Rome', country: 'Italy', emoji: '🏛️' };
    if (p.includes('bali') || p.includes('indonesia')) return { city: 'Bali', country: 'Indonesia', emoji: '🌴' };
    if (p.includes('new york') || p.includes('nyc')) return { city: 'New York', country: 'USA', emoji: '🗽' };
    if (p.includes('dubai') || p.includes('uae')) return { city: 'Dubai', country: 'UAE', emoji: '🏙️' };
    if (p.includes('london') || p.includes('uk')) return { city: 'London', country: 'UK', emoji: '🎡' };
    if (p.includes('singapore')) return { city: 'Singapore', country: 'Singapore', emoji: '🌆' };
    if (p.includes('barcelona') || p.includes('spain')) return { city: 'Barcelona', country: 'Spain', emoji: '⛪' };
    if (p.includes('istanbul') || p.includes('turkey')) return { city: 'Istanbul', country: 'Turkey', emoji: '🕌' };
    if (p.includes('cairo') || p.includes('egypt')) return { city: 'Cairo', country: 'Egypt', emoji: '🏺' };
    if (p.includes('mumbai') || p.includes('india') || p.includes('bangalore') || p.includes('delhi')) return { city: 'Mumbai', country: 'India', emoji: '🇮🇳' };
    // Default to the first city-like word
    return { city: 'Your Destination', country: 'Global', emoji: '🌍' };
  };

  const detectDays = () => {
    const match = p.match(/(\d+)\s*(day|night)/);
    if (match) return parseInt(match[1]);
    if (p.includes('week')) return 7;
    if (p.includes('weekend')) return 2;
    return 3;
  };

  const detectBudget = () => {
    if (p.includes('budget') || p.includes('cheap') || p.includes('affordable')) return 'Budget';
    if (p.includes('luxury') || p.includes('premium') || p.includes('5 star')) return 'Luxury';
    return 'Mid-Range';
  };

  const detectInterests = () => {
    const interests = [];
    if (p.includes('food') || p.includes('eat') || p.includes('culinary') || p.includes('cuisine')) interests.push('food');
    if (p.includes('history') || p.includes('museum') || p.includes('ancient') || p.includes('heritage')) interests.push('history');
    if (p.includes('art') || p.includes('gallery') || p.includes('culture')) interests.push('art');
    if (p.includes('nature') || p.includes('hike') || p.includes('outdoor') || p.includes('beach')) interests.push('nature');
    if (p.includes('shop') || p.includes('market') || p.includes('souvenir')) interests.push('shopping');
    if (p.includes('night') || p.includes('bar') || p.includes('club')) interests.push('nightlife');
    if (p.includes('family') || p.includes('kid') || p.includes('children')) interests.push('family');
    if (p.includes('anime') || p.includes('tech') || p.includes('geek')) interests.push('tech');
    if (interests.length === 0) interests.push('culture', 'food');
    return interests;
  };

  const { city, country, emoji } = detectCity();
  const days = Math.min(Math.max(detectDays(), 1), 7);
  const budget = detectBudget();
  const interests = detectInterests();

  const dayTemplates = {
    'Tokyo': [
      { title: 'Traditional Asakusa & Ueno', events: [
        { time: '08:00 AM', title: 'Senso-ji Temple', desc: 'Arrive early to experience the temple before crowds. Try melon pan from the street stalls.' },
        { time: '11:00 AM', title: 'Ueno Park & Museums', desc: interests.includes('history') ? 'Explore the Tokyo National Museum — largest collection of Japanese art in the world.' : 'Stroll through Ueno Park, visit Ameyoko Market.' },
        { time: '02:00 PM', title: '🔴 Live Virtual Tour: Akihabara Electronics', desc: 'Join Kenji live as he walks through Electric Town — gadgets, anime, and retro gaming.', isLive: true, link: '/live/1' },
      ]},
      { title: 'Shibuya & Harajuku', events: [
        { time: '09:00 AM', title: 'Meiji Shrine', desc: 'A peaceful forest walk surrounding the shrine dedicated to Emperor Meiji.' },
        { time: '01:00 PM', title: interests.includes('shopping') ? 'Harajuku Takeshita Street Shopping' : 'Harajuku Street Culture', desc: 'Explore quirky fashion, crepe shops and youth culture.' },
        { time: '05:00 PM', title: 'Shibuya Scramble Crossing', desc: 'Witness the world\'s busiest crossing at rush hour from Starbucks overlooking the intersection.' },
      ]},
      { title: 'Shinjuku & Local Experience', events: [
        { time: '10:00 AM', title: interests.includes('food') ? 'Tsukiji Outer Market Food Tour' : 'Shinjuku Gyoen Garden', desc: interests.includes('food') ? 'Fresh sushi breakfast, tamagoyaki and seasonal street food from legendary market vendors.' : 'Explore the beautiful 144-acre national garden — a perfect contrast to city life.' },
        { time: '03:00 PM', title: '🔴 Live Food Tour: Ramen Secrets', desc: 'Go behind the scenes of a traditional ramen restaurant with guide Yuki.', isLive: true, link: '/live/2' },
      ]},
    ],
    'Paris': [
      { title: 'Classic Paris', events: [
        { time: '08:00 AM', title: 'Eiffel Tower (Early Access)', desc: 'Beat the crowds at opening. Take the lift to the summit for panoramic views.' },
        { time: '12:00 PM', title: interests.includes('food') ? 'Le Marais Food Walk' : 'Champs-Élysées Stroll', desc: interests.includes('food') ? 'Artisan cheese, fresh baguettes, and wine at historic market stalls.' : 'Walk the iconic avenue from Arc de Triomphe to Place de la Concorde.' },
        { time: '03:00 PM', title: '🔴 Live Tour: Louvre Hidden Gems', desc: 'Guide Sophie reveals the lesser-known masterpieces beyond the Mona Lisa.', isLive: true, link: '/live/3' },
      ]},
    ],
    'Rome': [
      { title: 'Ancient Rome', events: [
        { time: '09:00 AM', title: 'Colosseum & Roman Forum', desc: 'Walk where gladiators fought. Book fast-track entry to avoid 2+ hour queues.' },
        { time: '02:00 PM', title: '🔴 Live Tour: Vatican Secrets', desc: 'Guide Marco shares the hidden history of the Vatican Museums and Sistine Chapel.', isLive: true, link: '/live/4' },
        { time: '06:00 PM', title: interests.includes('food') ? 'Trastevere Food & Wine Tour' : 'Trevi Fountain at Sunset', desc: interests.includes('food') ? 'Authentic Roman pasta, supplì, and local wines in the most charming neighborhood.' : 'Visit the fountain as golden hour light hits the baroque facade.' },
      ]},
    ],
  };

  // Build days array
  const template = dayTemplates[city] || [
    { title: `Day in ${city} — Highlights`, events: [
      { time: '09:00 AM', title: `${emoji} Morning Orientation Walk`, desc: `Start your day with a walk through the most iconic area of ${city}. Orient yourself and discover hidden gems.` },
      { time: '01:00 PM', title: interests.includes('food') ? `Local Food Market` : `Cultural Landmark Visit`, desc: interests.includes('food') ? `Sample authentic local cuisine at a famous market or street food hub.` : `Visit the most significant historical or cultural site in ${city}.` },
      { time: '04:00 PM', title: `🔴 Live Virtual Tour: ${city} with a Local`, desc: `Connect live with a ZillGO guide who will walk you through ${city}'s hidden gems in real time.`, isLive: true, link: '/live/1' },
    ]},
  ];

  const builtDays = Array.from({ length: days }, (_, i) => {
    const templateDay = template[i % template.length];
    return {
      day: i + 1,
      title: templateDay.title + (i >= template.length ? ` (Continued)` : ''),
      events: templateDay.events,
    };
  });

  const budgetEstimate = budget === 'Budget' ? '$40–80/day' : budget === 'Luxury' ? '$300–600/day' : '$100–200/day';

  return {
    title: `${days}-Day ${interests.includes('food') ? 'Food & Culture' : interests.includes('history') ? 'Historical' : 'Immersive'} Trip to ${city}, ${country}`,
    city,
    days,
    budget,
    budgetEstimate,
    interests,
    dayPlan: builtDays,
  };
}

export default function TripPlanner() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [showOptions, setShowOptions] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setItinerary(null);

    // Simulate AI processing delay then generate
    setTimeout(() => {
      const result = generateItinerary(prompt);
      setLoading(false);
      setItinerary(result);
    }, 2000);
  };

  const handleSave = () => {
    if (!itinerary) return;
    const data = JSON.stringify(itinerary, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZillGO_Itinerary_${itinerary.city}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper trip-planner-page">
      <div className="container" style={{ maxWidth: 800, padding: 'var(--space-4xl) 0' }}>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 212, 170, 0.1)', color: 'var(--accent-teal)', padding: '6px 16px', borderRadius: '20px', marginBottom: '1rem', fontWeight: 600 }}>
            <Sparkles size={16} /> AI Trip Planner
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>Design your dream trip in seconds.</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Tell us where you want to go, what you love doing, and we'll craft a personalized itinerary blending real-world spots with interactive live tours.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-3xl)' }}>
          <form onSubmit={handleGenerate}>
            <div className="planner-input-wrap">
              <textarea
                className="planner-input"
                rows="4"
                placeholder="e.g., 'I want to spend 3 days in Tokyo. I love street food, traditional architecture, and anime culture. Keep it family-friendly and mid-range budget.'"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className="planner-actions">
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button type="button" className="planner-filter-btn" onClick={() => setShowOptions(!showOptions)}>
                  <Calendar size={14} /> Options {showOptions ? '▲' : '▼'}
                </button>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading || !prompt.trim()}>
                {loading ? <><Loader className="spin" size={18} /> Generating...</> : <><Sparkles size={18} /> Generate Itinerary</>}
              </button>
            </div>

            {showOptions && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Travel Dates (optional)</label>
                  <input type="date" className="input" value={dates} onChange={e => setDates(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Number of Travelers</label>
                  <select className="input" value={travelers} onChange={e => setTravelers(e.target.value)} style={{ width: '100%' }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'traveler' : 'travelers'}</option>)}
                  </select>
                </div>
              </div>
            )}
          </form>
        </div>

        {loading && (
          <div className="planner-loading">
            <div className="loader-bars">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <p>Crafting your personalized adventure...</p>
          </div>
        )}

        {itinerary && !loading && (
          <div className="itinerary-result slide-up">
            {/* Summary Header */}
            <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-2xl)', borderLeft: '3px solid var(--accent-teal)' }}>
              <h2 style={{ marginBottom: '1rem' }}>{itinerary.title}</h2>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} style={{ color: 'var(--accent-teal)' }} />
                  <span>{itinerary.days} Days</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <DollarSign size={14} style={{ color: 'var(--accent-amber)' }} />
                  <span>{itinerary.budget} · {itinerary.budgetEstimate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Users size={14} style={{ color: 'var(--accent-purple)' }} />
                  <span>{travelers} {travelers == 1 ? 'traveler' : 'travelers'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Globe size={14} style={{ color: 'var(--accent-rose)' }} />
                  <span>{itinerary.interests.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="itinerary-days">
              {itinerary.dayPlan.map(d => (
                <div key={d.day} className="itinerary-day">
                  <div className="day-marker">Day {d.day}</div>
                  <div className="day-content">
                    <h3 style={{ marginBottom: 'var(--space-lg)' }}>{d.title}</h3>
                    <div className="day-events">
                      {d.events.map((ev, i) => (
                        <div key={i} className={`day-event glass-card ${ev.isLive ? 'event-live' : ''}`}>
                          <div className="event-time">
                            <Clock size={12} style={{ opacity: 0.6 }} />
                            {ev.time}
                          </div>
                          <div className="event-details">
                            <h4>{ev.title} {ev.isLive && <span className="badge badge-rose" style={{ marginLeft: 8 }}>🔴 Live Tour</span>}</h4>
                            <p>{ev.desc}</p>
                            {ev.isLive && (
                              <Link to={ev.link} className="btn btn-sm btn-primary" style={{ marginTop: '12px' }}>
                                Book Live Tour <ArrowRight size={14} />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-lg" onClick={handleSave}>
                💾 Download Itinerary
              </button>
              <button className="btn btn-primary btn-lg" onClick={() => { setItinerary(null); setPrompt(''); }}>
                <Sparkles size={18} /> Plan Another Trip
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
