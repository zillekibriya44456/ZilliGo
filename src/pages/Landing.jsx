import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play, Globe, Shield, Zap, Users, Star, ArrowRight,
  MapPin, Clock, ChevronRight, Video, CheckCircle, Award, Search
} from 'lucide-react';
import TourCard from '../components/TourCard';
import { TOURS, GUIDES, STATS, TESTIMONIALS, CATEGORIES } from '../data/mockData';
import { useSettings } from '../context/SettingsContext';
import { api } from '../utils/api';
import { t } from '../utils/translations';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { language } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [dynamicData, setDynamicData] = useState({ 
    tours: [], guides: [], liveStreams: [], activities: [], 
    stats: { tours: 0, guides: 0, cities: 180, travelers: 340000 } 
  });

  // Auto-rotating search placeholder
  const SEARCH_PLACEHOLDERS = ['Tokyo', 'Rome', 'Paris', 'Dubai', 'Jaipur', 'New York'];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // Auto-rotating AI translations
  const TRANSLATIONS = [
    { lang: 'English', text: '“Welcome to Tokyo, let me show you the neon lights!”' },
    { lang: 'Hindi', text: '“टोक्यो में आपका स्वागत है, मैं आपको नियॉन लाइट दिखाता हूँ!”' },
    { lang: 'Arabic', text: '“مرحباً بكم في طوكيو، دعوني أريكم أضواء النيون!”' },
    { lang: 'Spanish', text: '“¡Bienvenido a Tokio, déjame mostrarte las luces de neón!”' },
    { lang: 'French', text: '“Bienvenue à Tokyo, laissez-moi vous montrer les néons !”' }
  ];
  const [translationIdx, setTranslationIdx] = useState(0);

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);

    // Fetch Smart Launch Real/Seed Data Priority
    api.getPublicHomepage().then(data => {
      setDynamicData(data);
    }).catch(console.error);

    const placeholderInterval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000);

    const translationInterval = setInterval(() => {
      setTranslationIdx(prev => (prev + 1) % TRANSLATIONS.length);
    }, 4000);

    return () => {
      clearInterval(placeholderInterval);
      clearInterval(translationInterval);
    };
  }, []);

  const featuredTours = dynamicData.tours.length > 0 ? dynamicData.tours : TOURS.filter(t => t.featured).slice(0, 4);
  const liveTours = dynamicData.liveStreams.length > 0 
    ? dynamicData.liveStreams.map(l => ({ ...l, type: 'live' })) 
    : TOURS.filter(t => t.type === 'live').slice(0, 4);
  const dbStats = dynamicData.stats;

  // Real database live streams driving the portal deck
  const dbLiveStreams = dynamicData.liveStreams.map(l => ({
    id: l.id, 
    title: l.title, 
    guideName: l.guideName || l.guide_name, 
    viewerCount: l.viewerCount || l.viewer_count, 
    coverImage: l.coverImage || l.cover_image, 
    location: l.location,
    language: l.language,
    durationMinutes: l.durationMinutes || l.duration_minutes
  }));

  const fullLivePortals = dbLiveStreams.slice(0, 6);
  const showcasePortal = fullLivePortals.length > 0 ? fullLivePortals[0] : null;
  const dbActivities = dynamicData.activities.slice(0, 5);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(searchQuery || SEARCH_PLACEHOLDERS[placeholderIdx])}`);
  };

  return (
    <div className="landing">
      {/* ── Award-Winning Cyber-Luxury Hero ── */}
      <section className="landing__hero">
        
        {/* Animated Background Map & Grid */}
        <div className="hero-bg">
          <div className="hero-bg__gradient-overlay" />
          <div className="hero-bg__grid-glow" />
          
          {/* Animated Holographic World Map */}
          <svg className="holographic-map" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Pulsing City Nodes */}
            <circle cx="150" cy="180" r="5" fill="#00D9FF" filter="drop-shadow(0 0 8px #00D9FF)" />
            <text x="140" y="165" fill="#F8FAFC" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.8">New York</text>
            
            <circle cx="480" cy="150" r="5" fill="#00F5D4" filter="drop-shadow(0 0 8px #00F5D4)" />
            <text x="470" y="135" fill="#F8FAFC" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.8">Paris</text>
            
            <circle cx="580" cy="220" r="5" fill="#8B5CF6" filter="drop-shadow(0 0 8px #8B5CF6)" />
            <text x="570" y="205" fill="#F8FAFC" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.8">Dubai</text>
            
            <circle cx="680" cy="210" r="5" fill="#00F5D4" filter="drop-shadow(0 0 8px #00F5D4)" />
            <text x="670" y="195" fill="#F8FAFC" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.8">Jaipur</text>
            
            <circle cx="850" cy="160" r="5" fill="#00D9FF" filter="drop-shadow(0 0 8px #00D9FF)" />
            <text x="840" y="145" fill="#F8FAFC" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.8">Tokyo</text>
            
            <circle cx="820" cy="340" r="5" fill="#8B5CF6" filter="drop-shadow(0 0 8px #8B5CF6)" />
            <text x="810" y="325" fill="#F8FAFC" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600" opacity="0.8">Sydney</text>

            {/* Pulsing Light Routes */}
            <path d="M 150 180 Q 315 120 480 150" className="map-route" />
            <path d="M 480 150 Q 530 185 580 220" className="map-route" />
            <path d="M 580 220 Q 630 215 680 210" className="map-route" />
            <path d="M 680 210 Q 765 185 850 160" className="map-route" />
            <path d="M 850 160 Q 835 250 820 340" className="map-route" />
            <path d="M 820 340 Q 485 370 150 180" className="map-route" />
          </svg>
        </div>

        <div className={`container hero-content ${heroLoaded ? 'hero-content--visible' : ''}`}>
          <div className="hero-content__inner">
            
            {/* Floating Indicators */}
            <div className="live-presence-tags">
              <div className="presence-tag">
                <span className="dot-live" />
                <span>1,200 LIVE TOURS NOW</span>
              </div>
              <div className="presence-tag">
                <Globe size={13} color="#00F5D4" />
                <span>180+ CITIES</span>
              </div>
              <div className="presence-tag">
                <Users size={13} color="#8B5CF6" />
                <span>340,000+ EXPLORERS</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="hero-heading animate-fade-up">
              Explore The World <br />
              From Your <span className="hero-heading__gradient">Living Room.</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-sub animate-fade-up">
              Experience cities, cultures, food, history, festivals, and local life through immersive real-time virtual tours hosted by passionate local guides around the world.
            </p>

            {/* Cyber Search Bar */}
            <form className="hero-search-wrapper animate-fade-up" onSubmit={handleSearch}>
              <div className="search-input-group">
                <Search size={22} className="search-icon-glow" />
                <input 
                  type="text" 
                  placeholder={`Where do you want to go today? Try "${SEARCH_PLACEHOLDERS[placeholderIdx]}"`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-field-custom"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-search-glow">
                Search
              </button>
            </form>

            {/* Quick Travel Links */}
            <div className="hero-popular-cities animate-fade-up">
              <span>Worldwide exploration hubs:</span>
              {['Tokyo', 'Rome', 'Paris', 'Dubai', 'Jaipur', 'New York'].map(city => (
                <button key={city} onClick={() => navigate(`/explore?q=${city}`)} className="popular-tag-btn">
                  {city}
                </button>
              ))}
            </div>

            {/* Primary / Secondary CTA Buttons */}
            <div className="hero-action-buttons animate-fade-up">
              <button onClick={() => navigate('/explore')} className="btn btn-primary btn-glow-teal btn-lg">
                Explore Live Tours
              </button>
              <button onClick={() => navigate('/become-guide')} className="btn btn-secondary btn-glow-purple btn-lg">
                Become A Guide
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Cyber-Luxury Portal Deck & Widgets */}
          <div className="portal-deck-wrapper animate-fade-up">
            
            {/* Center: AR / XR Smart Glasses Traveler */}
            <div className="avatar-scene-container">
              <div className="ar-avatar-circle">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" 
                  alt="Immersive AR Traveler" 
                />
                <div className="hologram-effect-overlay" />
                <div className="ar-glasses-glow" />
              </div>
            </div>

            {/* Dynamic Real-Time Live Portals */}
            {fullLivePortals.map((stream, idx) => (
              <div 
                key={stream.id || idx} 
                className={`hologram-portal-floating portal-p${idx + 1}`} 
                onClick={() => navigate(`/tour/${stream.id}`)}
              >
                <div className="portal-media-frame">
                  <img src={stream.coverImage} alt={stream.title} />
                  <div className="portal-badge-live">LIVE</div>
                  <div className="portal-title-overlay">
                    <h5 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stream.title}</h5>
                    <p>{stream.guideName} • {stream.viewerCount} watching</p>
                  </div>
                </div>
              </div>
            ))}

            {/* AI Language Companion Widget */}
            <div className="ai-translator-widget">
              <div className="translator-title">
                <span className="dot-live" />
                <span>AI Live Translation</span>
              </div>
              <div className="translator-original">
                {TRANSLATIONS[translationIdx].text}
              </div>
              <div className="translator-divider" />
              <div className="translator-waves-container">
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <span className="translator-output-language">
                  🗣 {TRANSLATIONS[translationIdx].lang}
                </span>
              </div>
            </div>

            {/* Global Activity Feed Widget */}
            <div className="digital-passport-widget" style={{ padding: '15px' }}>
              <div className="passport-header-glow" style={{ marginBottom: '10px' }}>Global Platform Activity</div>
              <div className="passport-stamps-deck" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                {dbActivities.length > 0 ? dbActivities.map((act, i) => (
                  <div key={i} className="passport-stamp-item" style={{ fontSize: '0.75rem', justifyContent: 'flex-start', padding: '6px 10px', width: '100%' }}>
                    <span className="dot-live" style={{ marginRight: '8px' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-color)' }}>{act.description}</span>
                  </div>
                )) : (
                  <div className="passport-stamp-item" style={{ fontSize: '0.75rem' }}>Waiting for activity...</div>
                )}
              </div>
            </div>

            {/* Floating Live Tour Showcase Widget */}
            {showcasePortal && (
              <div className="live-showcase-floating-card" onClick={() => navigate(`/tour/${showcasePortal.id}`)} style={{ cursor: 'pointer' }}>
                <div className="showcase-header">
                  <span className="showcase-red-badge">🔴 LIVE NOW</span>
                  <span className="showcase-watching">{showcasePortal.viewerCount} Watching</span>
                </div>
                <div className="showcase-body">
                  <h6 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{showcasePortal.title}</h6>
                  <div className="showcase-guide-line">
                    <span>{showcasePortal.guideName}</span>
                    <span style={{ color: '#FFD166' }}>★★★★★ 4.9</span>
                  </div>
                  <div className="showcase-ai-indicator">
                    ⚡ {showcasePortal.language || 'AI Real-Time Translation Enabled'}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Global Activity Counter Bar */}
        <div className="container animate-fade-up" style={{ position: 'relative', zIndex: 12, marginTop: '5vh' }}>
          <div className="stats-bar-glow-card">
            {[
              { label: '🔴 LIVE TOURS NOW', value: `${dbStats.tours > 100 ? dbStats.tours : 1200 + dbStats.tours}+` },
              { label: '🌍 WORLDWIDE CITIES', value: `${dbStats.cities > 50 ? dbStats.cities : 180 + dbStats.cities}+` },
              { label: '🗣 AI LANGUAGES', value: '100+' },
              { label: '👥 HAPPY EXPLORERS', value: `${(dbStats.travelers > 1000 ? dbStats.travelers : 340000 + dbStats.travelers).toLocaleString()}+` },
              { label: '🎙 VERIFIED GUIDES', value: `${(dbStats.guides > 50 ? dbStats.guides : 2400 + dbStats.guides).toLocaleString()}+` }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center', flex: 1, minWidth: '130px' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#00F5D4', filter: 'drop-shadow(0 0 5px rgba(0, 245, 212, 0.4))' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(248, 250, 252, 0.65)', fontWeight: 700, letterSpacing: '0.05em', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Tours Now ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">🔴 Happening Now</div>
              <h2>Live Tours Right Now</h2>
              <p>Join thousands of travelers experiencing the world in real-time</p>
            </div>
            <Link to="/explore?type=live" className="btn btn-secondary">See All Live <ArrowRight size={15} /></Link>
          </div>
          <div className="grid-4">
            {liveTours.map(t => <TourCard key={t.id} tour={t} />)}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-label">Browse by Type</div>
          <div className="categories-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); navigate(`/explore?category=${cat.id}`); }}
                className={`category-btn ${activeCategory === cat.id ? 'category-btn--active' : ''}`}
              >
                <span className="category-btn__icon">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="category-btn__count">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Tours ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">⭐ Editor's Picks</div>
              <h2>Featured Tours</h2>
              <p>Handpicked experiences from our top-rated guides</p>
            </div>
            <Link to="/explore" className="btn btn-secondary">View All <ArrowRight size={15} /></Link>
          </div>
          <div className="grid-4">
            {featuredTours.map(t => <TourCard key={t.id} tour={t} featured />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section how-it-works">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Simple Process</div>
            <h2>How ZilliGO Works</h2>
            <p>From booking to live tour in minutes — powered by our smart guide matching engine</p>
          </div>
          <div className="how-steps">
            {[
              { icon: '🔍', num: '01', title: 'Discover & Choose', desc: 'Browse hundreds of tours by city, category, or guide. Filter by live or recorded, language, and price.' },
              { icon: '📅', num: '02', title: 'Book & Pay Securely', desc: 'Choose your date and time. Pay securely via Stripe. Instant confirmation with full refund protection.' },
              { icon: '🗺️', num: '03', title: 'Smart Guide Matching', desc: 'Our algorithm finds the nearest available guide using geolocation — just like Uber, but for tours.' },
              { icon: '🎥', num: '04', title: 'Experience Live', desc: 'Connect via HD video with your guide. Chat, ask questions, and get a truly personalized tour.' },
            ].map((step, i) => (
              <div key={i} className="how-step glass-card">
                <div className="how-step__num">{step.num}</div>
                <div className="how-step__icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {i < 3 && <div className="how-step__arrow"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guide Matching Feature ── */}
      <section className="section matching-feature">
        <div className="container matching-feature__inner">
          <div className="matching-feature__content">
            <div className="section-label">🚀 Smart Technology</div>
            <h2>Uber-Style Guide Matching</h2>
            <p>When you book a tour in any city, our algorithm instantly finds the nearest available guide using GPS geolocation. The closest guide is notified first — if they accept, you're connected. If not, the next guide is notified automatically.</p>
            <div className="matching-feature__steps">
              {[
                { icon: '📍', text: 'You select a city and tour' },
                { icon: '🔎', text: 'System locates nearest guides via GPS' },
                { icon: '📲', text: 'Closest guide gets instant notification' },
                { icon: '✅', text: "Guide accepts → You're connected live" },
              ].map((s, i) => (
                <div key={i} className="matching-feature__step">
                  <span className="matching-feature__step-icon">{s.icon}</span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
            <Link to="/explore" className="btn btn-primary">Book a Tour Now <ArrowRight size={16} /></Link>
          </div>
          <div className="matching-feature__visual">
            <div className="matching-visual glass-card">
              <div className="matching-visual__radar">
                <div className="mv-ring mv-ring--1" />
                <div className="mv-ring mv-ring--2" />
                <div className="mv-ring mv-ring--3" />
                <div className="mv-center">📍</div>
                {[
                  { top: '20%', left: '65%', name: 'Arjun', time: '2 min', active: true },
                  { top: '60%', left: '20%', name: 'Priya', time: '5 min', active: false },
                  { top: '35%', left: '75%', name: 'Ravi', time: '8 min', active: false },
                ].map((g, i) => (
                  <div key={i} className={`mv-guide ${g.active ? 'mv-guide--active' : ''}`} style={{ top: g.top, left: g.left }}>
                    <div className="mv-guide__dot" />
                    <div className="mv-guide__label glass-card">
                      <strong>{g.name}</strong>
                      <span>{g.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="matching-visual__status">
                <div className="mv-status mv-status--searching">
                  <div className="spinner" />
                  <span>Finding nearest guide...</span>
                </div>
                <div className="mv-status mv-status--matched">
                  <CheckCircle size={16} /> <span>Arjun matched! ETA: 2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>What Travelers Say</div>
            <h2>Loved by 340,000+ Travelers</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="testimonial-card glass-card">
                <div className="testimonial-card__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent-amber)" stroke="none" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__footer">
                  <img src={t.avatar} alt={t.name} className="avatar" style={{ width: 40, height: 40 }} />
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__loc">{t.location}</div>
                  </div>
                </div>
                <div className="testimonial-card__tour">Tour: {t.tour}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Become a Guide CTA ── */}
      <section className="section guide-cta">
        <div className="container">
          <div className="guide-cta__inner glass-card">
            <div className="glow-line glow-purple" style={{ width: 500, height: 500, top: -200, right: -200 }} />
            <div className="guide-cta__content">
              <div className="section-label">💰 Earn with ZilliGO</div>
              <h2>Share Your City with the World</h2>
              <p>Join 2,400+ guides earning an average of $2,800/month by sharing their local expertise through live virtual tours.</p>
              <div className="guide-cta__perks">
                {['Set your own schedule & rates', 'Keep 85% of every booking', 'Get verified guide badge', 'Reach global audiences instantly'].map(p => (
                  <div key={p} className="guide-cta__perk"><CheckCircle size={16} style={{ color: 'var(--accent-teal)' }} /> {p}</div>
                ))}
              </div>
              <div className="guide-cta__btns">
                <Link to="/become-guide" className="btn btn-primary btn-lg">Become a Guide <ArrowRight size={18} /></Link>
                <Link to="/guides" className="btn btn-secondary btn-lg">Meet Our Guides</Link>
              </div>
            </div>
            <div className="guide-cta__visual">
              <div className="guide-cta__earnings glass-card">
                <div className="guide-cta__earnings-label">Avg. Monthly Earnings</div>
                <div className="guide-cta__earnings-value">$2,800</div>
                <div className="guide-cta__earnings-bar">
                  <div className="guide-cta__earnings-fill" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>$0</span><span>$5,000+</span>
                </div>
              </div>
              <div className="guide-cta__badges">
                {[{ icon: <Award size={20} />, label: 'Top Guide', sub: '2,400+ verified' }, { icon: <Shield size={20} />, label: 'Safe & Secure', sub: 'ID verified' }].map((b, i) => (
                  <div key={i} className="guide-cta__badge-card glass-card">
                    <div className="guide-cta__badge-icon" style={{ color: 'var(--accent-teal)' }}>{b.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{b.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section final-cta">
        <div className="container text-center">
          <h2>Ready to Explore the World?</h2>
          <p style={{ maxWidth: 500, margin: '1rem auto 2rem' }}>Join 340,000+ travelers experiencing authentic destinations through the eyes of local experts.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn btn-primary btn-lg">Browse Tours <Globe size={18} /></Link>
            <Link to="/auth?tab=register" className="btn btn-secondary btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
