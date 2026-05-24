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
      {/* ── Hero ── */}
      <section className="landing__hero">
        {/* Background elements */}
        <div className="hero-bg">
          <div className="hero-bg__img" />
          <div className="hero-bg__overlay" />
          <div className="hero-bg__grid" />
        </div>
        <div className="glow-line glow-teal" style={{ width: 600, height: 600, top: -200, left: -200 }} />
        <div className="glow-line glow-amber" style={{ width: 400, height: 400, top: '50%', right: -100 }} />

        <div className={`container hero-content ${heroLoaded ? 'hero-content--visible' : ''}`}>
          <div className="hero-content__inner">
            {/* Label */}
            <div className="hero-label animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="badge badge-live">🔴 LIVE</span>
              <span>47 tours happening right now worldwide</span>
            </div>

            {/* Heading */}
            <h1 className="hero-heading animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {language === 'ar' ? 'استكشف العالم من' : language === 'zh' ? '从家中探索世界' : 'Explore the world from'} <br />
              <span className="gradient-text">{language === 'ar' ? 'منزلك مباشرة' : language === 'zh' ? '就在你的客厅里' : 'your living room.'}</span>
            </h1>

            <p className="hero-sub animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {t('hero_subtitle', language) || 'Expert-led live virtual tours that bring the globe to your screen. Interactive, immersive, and 100% live.'}
            </p>

            {/* Search */}
            <form className="hero-search animate-fade-up" onSubmit={handleSearch} style={{ animationDelay: '0.4s' }}>
              <div className="input-group hero-search__input">
                <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input 
                  type="text" 
                  placeholder={t('search_placeholder', language)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary hero-search__btn">
                {t('explore', language)} <ArrowRight size={16} />
              </button>
            </form>

            {/* Popular */}
            <div className="hero-popular animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <span>Popular:</span>
              {['Rome', 'Tokyo', 'Santorini', 'New York', 'Bali'].map(city => (
                <button key={city} onClick={() => navigate(`/explore?q=${city}`)} className="hero-popular__tag">
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Cards */}
          <div className="hero-cards animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="hero-card hero-card--main glass-card">
              <div className="hero-card__img-wrap">
                <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80" alt="Rome Tour" />
                <div className="hero-card__live-badge badge badge-live">🔴 LIVE NOW</div>
                <div className="hero-card__viewers">👁 213 watching</div>
              </div>
              <div className="hero-card__body">
                <p className="hero-card__cat">Historical · Rome, Italy</p>
                <h4>Ancient Rome Walking Tour</h4>
                <div className="hero-card__guide">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80" alt="Marco" className="avatar" style={{ width: 28, height: 28 }} />
                  <span>Marco Rossi</span>
                  <span className="hero-card__rating"><Star size={11} fill="var(--accent-amber)" stroke="none" /> 4.9</span>
                </div>
              </div>
            </div>

            <div className="hero-card hero-card--sm glass-card">
              <span>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Guide Matched!</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bangalore · 2 min away</div>
              </div>
              <span className="badge badge-teal">✓</span>
            </div>

            <div className="hero-card hero-card--sm hero-card--sm2 glass-card">
              <div className="hero-card__stars"><Star size={12} fill="var(--accent-amber)" stroke="none" /><Star size={12} fill="var(--accent-amber)" stroke="none" /><Star size={12} fill="var(--accent-amber)" stroke="none" /><Star size={12} fill="var(--accent-amber)" stroke="none" /><Star size={12} fill="var(--accent-amber)" stroke="none" /></div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0' }}>"Absolutely mind-blowing experience!"</p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>— Sarah Chen, NYC</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="hero-stats container">
          {STATS.map((s, i) => (
            <div key={i} className="hero-stat">
              <span className="hero-stat__icon">{s.icon}</span>
              <div>
                <div className="hero-stat__value">{s.value}</div>
                <div className="hero-stat__label">{s.label}</div>
              </div>
            </div>
          ))}
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
