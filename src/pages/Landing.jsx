import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play, Globe, Shield, Zap, Users, Star, ArrowRight,
  MapPin, Clock, ChevronRight, Video, CheckCircle, Award, Search
} from 'lucide-react';
import TourCard from '../components/TourCard';
import { TOURS, GUIDES, STATS, TESTIMONIALS, CATEGORIES } from '../data/mockData';
import { useSettings } from '../context/SettingsContext';
import { t } from '../utils/translations';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { language } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);

  const featuredTours = TOURS.filter(t => t.featured).slice(0, 4);
  const liveTours = TOURS.filter(t => t.type === 'live').slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="landing">
      {/* ── Minimalist Premium Hero ── */}
      <section className="landing__hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', position: 'relative', overflow: 'hidden', paddingBottom: 'var(--space-3xl)' }}>
        {/* Simple Background elements */}
        <div className="hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 212, 170, 0.1) 0%, transparent 50%)' }} />
          <div className="hero-bg__grid" style={{ opacity: 0.15, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="glow-line glow-teal" style={{ width: 600, height: 600, top: -300, left: -200, opacity: 0.3 }} />
        <div className="glow-line glow-purple" style={{ width: 400, height: 400, top: '40%', right: -100, opacity: 0.2 }} />

        <div className={`container hero-content ${heroLoaded ? 'hero-content--visible' : ''}`} style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-content__inner" style={{ paddingTop: '15vh' }}>

            {/* Heading */}
            <h1 className="hero-heading animate-fade-up" style={{ animationDelay: '0.2s', fontSize: 'clamp(72px, 8vw, 96px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', margin: '0' }}>
              Explore the world <br />
              from your <span style={{ background: 'linear-gradient(135deg, #00d4aa 0%, #0088ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(0, 212, 170, 0.4)' }}>living room.</span>
            </h1>

            <p className="hero-sub animate-fade-up" style={{ animationDelay: '0.3s', fontSize: 'clamp(24px, 3vw, 28px)', fontWeight: 300, color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.5, marginTop: '1.5rem' }}>
              Join live immersive tours with passionate local guides in real-time.
            </p>

            {/* Search */}
            <form className="hero-search animate-fade-up" onSubmit={handleSearch} style={{ animationDelay: '0.4s', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(24px)', padding: '8px', borderRadius: '100px', marginTop: '3rem', maxWidth: '600px', boxShadow: '0 0 30px rgba(0, 212, 170, 0.15), 0 20px 40px rgba(0,0,0,0.5)', transition: 'box-shadow 0.3s ease' }}>
              <div className="input-group hero-search__input" style={{ border: 'none', background: 'transparent' }}>
                <Search size={24} style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: '16px' }} />
                <input 
                  type="text" 
                  placeholder="Where do you want to go today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', color: '#fff', fontSize: '1.2rem', padding: '12px 16px', outline: 'none' }}
                />
              </div>
              <button type="submit" className="btn btn-primary hero-search__btn" style={{ borderRadius: '100px', padding: '16px 32px', fontSize: '1.1rem', fontWeight: 600, boxShadow: '0 0 20px rgba(0, 212, 170, 0.4)' }}>
                Explore Tours
              </button>
            </form>

            {/* Popular */}
            <div className="hero-popular animate-fade-up" style={{ animationDelay: '0.5s', marginTop: '2rem', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '1rem' }}>Popular:</span>
              {['Rome', 'Tokyo', 'Bali', 'Santorini', 'New York'].map(city => (
                <button key={city} onClick={() => navigate(`/explore?q=${city}`)} className="hero-popular__tag" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.9rem' }}>
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Cards - Overlapping */}
          <div className="hero-cards animate-fade-up" style={{ animationDelay: '0.4s', right: '-20px', top: '10vh', transform: 'scale(1.1)', transformOrigin: 'right center', zIndex: 20 }}>
            <div className="hero-card hero-card--main glass-card" style={{ background: 'rgba(20, 20, 25, 0.65)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0, 212, 170, 0.1)', padding: '20px', borderRadius: '28px' }}>
              <div className="hero-card__img-wrap" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80" alt="Rome Tour" style={{ transform: 'scale(1.02)' }} />
                <div className="hero-card__live-badge badge badge-rose" style={{ background: 'var(--accent-rose)', color: '#fff', fontSize: '0.8rem', padding: '4px 12px' }}>● LIVE</div>
              </div>
              <div className="hero-card__body" style={{ marginTop: '20px', padding: '0 8px' }}>
                <h4 style={{ fontSize: '1.4rem', margin: '0 0 16px 0', fontWeight: 700 }}>Ancient Rome Walking Tour</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="hero-card__guide" style={{ background: 'transparent', padding: 0 }}>
                    <div style={{ position: 'relative', display: 'flex' }}>
                       <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80" alt="Marco" className="avatar" style={{ width: 40, height: 40, border: '2px solid var(--bg-main)' }} />
                       <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80" alt="Sara" className="avatar" style={{ width: 40, height: 40, border: '2px solid var(--bg-main)', marginLeft: '-16px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', textAlign: 'right' }}>
                    <div>
                      <div style={{ color: 'var(--accent-teal)', fontWeight: 800, fontSize: '1.25rem' }}>32%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Guide</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--accent-teal)', fontWeight: 800, fontSize: '1.25rem' }}>35.8k</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Stats</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra-Premium Stats Bar */}
        <div className="container animate-fade-up" style={{ animationDelay: '0.6s', marginTop: '10vh', position: 'relative', zIndex: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', backdropFilter: 'blur(20px)' }}>
            {[
              { icon: <Users size={24} />, value: '2,400+', label: 'Active Guides' },
              { icon: <MapPin size={24} />, value: '180+', label: 'Cities' },
              { icon: <Video size={24} />, value: '89,000+', label: 'Tours Completed' },
              { icon: <Star size={24} />, value: '340,000+', label: 'Happy Travelers' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(0, 212, 170, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)' }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
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
          <div className="grid-3">
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
            <h2>How ZillGO Works</h2>
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
              <div className="section-label">💰 Earn with ZillGO</div>
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
