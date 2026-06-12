import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play, Globe, Shield, Zap, Users, Star, ArrowRight,
  MapPin, Clock, ChevronRight, Video, CheckCircle, Award, Search, Calendar, Heart, TrendingUp, Mic, Wifi, Map as MapIcon, Languages, X, Sparkles, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOURS } from '../data/mockData';
import { api } from '../utils/api';
import { io } from 'socket.io-client';
import TourCard from '../components/TourCard';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import './Landing.css';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
const GEO_URL = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const FLOATING_PINS = [
  { id: 'p1', guide: 'Marco Rossi', title: 'Rome Walk', city: 'Rome', rating: 4.9, viewers: 528, coords: [12.4964, 41.9028] },
  { id: 'p2', guide: 'Kenji Sato', title: 'Tokyo Night', city: 'Tokyo', rating: 4.8, viewers: 742, coords: [139.6917, 35.6895] },
  { id: 'p3', guide: 'Priya R.', title: 'Mysuru Palace', city: 'Mysuru', rating: 4.7, viewers: 310, coords: [76.6394, 12.2958] },
  { id: 'p4', guide: 'Marie L.', title: 'Paris Sunset', city: 'Paris', rating: 4.9, viewers: 1205, coords: [2.3522, 48.8566] },
  { id: 'p5', guide: 'Sarah C.', title: 'NYC Walk', city: 'New York', rating: 4.6, viewers: 890, coords: [-74.006, 40.7128] },
  { id: 'p6', guide: 'Ahmed M.', title: 'Dubai Safari', city: 'Dubai', rating: 4.8, viewers: 450, coords: [55.2708, 25.2048] },
];

const Counter = ({ from, to, suffix = '' }) => {
  const [count, setCount] = useState(from);
  useEffect(() => {
    let start = from;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / (to - from)));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= to) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [from, to]);
  return <>{count}{suffix}</>;
};

export default function Landing() {
  const navigate = useNavigate();
  const [dynamicData, setDynamicData] = useState({ tours: [], liveStreams: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeed, setActiveFeed] = useState([
    { text: "Sarah joined Tokyo Tour", time: "Just now", type: "join" },
    { text: "Marco went LIVE in Rome", time: "2s ago", type: "live" },
    { text: "Maria left 5★ review", time: "12s ago", type: "review" },
    { text: "Ahmed verified account", time: "1m ago", type: "verify" }
  ]);

  useEffect(() => {
    api.getPublicHomepage().then(data => setDynamicData(data)).catch(console.error);

    const socket = io(SOCKET_URL);
    const feedInterval = setInterval(() => {
      setActiveFeed(prev => {
        const newFeed = [...prev];
        const item = newFeed.pop();
        newFeed.unshift(item);
        return newFeed;
      });
    }, 3000);

    return () => { socket.disconnect(); clearInterval(feedInterval); };
  }, []);

  const featuredTours = (dynamicData.tours || []).length > 0 ? dynamicData.tours : TOURS.filter(t => t.featured).slice(0, 4);

  return (
    <div className="landing-ultra">
      {/* ── Immersive Ecosystem Hero ── */}
      <section className="hero-ecosystem">
        {/* Background Layer: Animated World Map */}
        <div className="hero-bg-map">
          <div className="aurora-glow a-left"></div>
          <div className="aurora-glow a-right"></div>
          <div className="aurora-glow a-center"></div>
          
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }} width={1600} height={900}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => geographies.map(geo => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill="rgba(255,255,255,0.02)" 
                  stroke="rgba(0, 245, 212, 0.15)" 
                  strokeWidth={0.5} 
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                />
              ))}
            </Geographies>
            {FLOATING_PINS.map((pin) => (
              <Marker key={pin.id} coordinates={pin.coords}>
                <circle r={3} fill="var(--accent-teal)" className="eco-pulse" />
                <circle r={1.5} fill="#FFF" />
              </Marker>
            ))}
            {/* Animated SVG Routes */}
            <path d="M 800,200 Q 1000,100 1300,300" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="1" strokeDasharray="5,5" className="eco-route" />
            <path d="M 1300,300 Q 1100,500 500,400" fill="none" stroke="rgba(0,245,212,0.4)" strokeWidth="1" strokeDasharray="5,5" className="eco-route r-delay" />
          </ComposableMap>
          
          {/* Dynamic Grid Overlay */}
          <div className="eco-grid-overlay"></div>
        </div>

        {/* Foreground Layer: 55/45 Split */}
        <div className="eco-container">
          
          {/* Left: Typography & Search */}
          <div className="eco-left">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="eco-badge">
                <span className="live-dot-glow"></span> OVER 1,200 LIVE TOURS NOW
              </div>
              
              <h1 className="eco-title">
                Explore The World.<br />
                <span className="eco-gradient-text">From Your Living Room.</span>
              </h1>
              
              <p className="eco-subtitle">
                A world-class global virtual tourism platform. Experience ultra-HD live tours hosted by locals in 180+ countries, with real-time AI voice translation.
              </p>

              {/* Advanced Search Bar */}
              <div className="eco-search-bar glass-card">
                <div className="es-inputs">
                  <div className="es-field">
                    <Search size={16} className="text-teal" />
                    <input type="text" placeholder="Where do you want to go?" />
                  </div>
                  <div className="es-divider"></div>
                  <div className="es-field">
                    <Calendar size={16} className="text-purple" />
                    <input type="text" placeholder="Dates" disabled />
                  </div>
                </div>
                <div className="es-actions">
                  <button className="es-btn-icon"><Mic size={18} /></button>
                  <button className="es-btn-ai"><Sparkles size={16} /> AI Trip</button>
                  <button className="es-btn-primary" onClick={() => navigate('/explore')}>Search</button>
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="eco-popular">
                <span>Popular:</span>
                <span className="ep-tag">🇯🇵 Tokyo</span>
                <span className="ep-tag">🇫🇷 Paris</span>
                <span className="ep-tag">🇦🇪 Dubai</span>
                <span className="ep-tag">🇮🇹 Rome</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Floating Ecosystem */}
          <div className="eco-right">
            <div className="eco-floating-universe">
              
              {/* Tour Card - Top Left */}
              <motion.div className="ef-card tour-preview-card glass-card"
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
                <div className="tpc-header">
                  <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&q=80" alt="Tokyo" className="tpc-bg" />
                  <span className="tpc-live-badge">🔴 LIVE</span>
                </div>
                <div className="tpc-body">
                  <h4>Tokyo Neon Lights</h4>
                  <div className="tpc-meta">
                    <span><img src="https://i.pravatar.cc/150?u=kenji" alt="Guide" /> Kenji S.</span>
                    <span><Users size={12}/> 742</span>
                  </div>
                </div>
              </motion.div>

              {/* Tour Card - Bottom Right */}
              <motion.div className="ef-card tour-preview-card glass-card" style={{ top: 'auto', bottom: '20px', left: 'auto', right: '0' }}
                animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}>
                <div className="tpc-header">
                  <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&q=80" alt="Rome" className="tpc-bg" />
                  <span className="tpc-live-badge">🔴 LIVE</span>
                </div>
                <div className="tpc-body">
                  <h4>Ancient Rome Walk</h4>
                  <div className="tpc-meta">
                    <span><img src="https://i.pravatar.cc/150?u=marco" alt="Guide" /> Marco R.</span>
                    <span><Users size={12}/> 528</span>
                  </div>
                </div>
              </motion.div>

              {/* Activity Feed */}
              <motion.div className="ef-card global-feed-card glass-card" style={{ top: '40%', right: '10%' }}
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}>
                <div className="gfc-header"><Globe size={12} className="text-teal"/> Live Activity</div>
                <div className="gfc-list">
                  <AnimatePresence mode="popLayout">
                    {activeFeed.map((act, i) => (
                      <motion.div key={act.text + i} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, scale:0.9}} className="gfc-item">
                        <span className={`gfc-icon ${act.type}`}></span>
                        <div>
                          <p>{act.text}</p>
                          <small>{act.time}</small>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Translation Card */}
              <motion.div className="ef-card translation-card glass-card" style={{ bottom: '20%', left: '-10%' }}
                animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}>
                <div className="tc-header"><Zap size={12} className="text-purple"/> AI Translation</div>
                <p className="tc-source">"Welcome to Paris!" <span className="lang-tag">EN</span></p>
                <div className="tc-divider"><div className="wave-bar"></div><div className="wave-bar"></div><div className="wave-bar"></div></div>
                <p className="tc-target">"Bienvenue à Paris!" <span className="lang-tag">FR</span></p>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Real-Time Platform Stats Bar */}
        <div className="eco-stats-bar glass-card">
          <div className="esb-stat">
            <span className="esb-val"><Counter from={1100} to={1200} suffix="+" /></span>
            <span className="esb-label">Live Tours</span>
          </div>
          <div className="esb-divider"></div>
          <div className="esb-stat">
            <span className="esb-val text-teal"><Counter from={150} to={180} suffix="+" /></span>
            <span className="esb-label">Cities</span>
          </div>
          <div className="esb-divider"></div>
          <div className="esb-stat">
            <span className="esb-val text-purple"><Counter from={330} to={340} suffix="k+" /></span>
            <span className="esb-label">Explorers</span>
          </div>
          <div className="esb-divider"></div>
          <div className="esb-stat">
            <span className="esb-val text-amber"><Counter from={2300} to={2400} suffix="+" /></span>
            <span className="esb-label">Verified Guides</span>
          </div>
        </div>
      </section>

      {/* ── Featured Experiences ── */}
      <section className="section eco-section">
        <div className="container eco-container-wide">
          <div className="section-header">
            <div>
              <span className="section-badge badge-amber"><Star size={14} /> Top Rated</span>
              <h2>Featured Experiences</h2>
            </div>
            <Link to="/explore" className="btn-outline">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="grid-4">
            {featuredTours.map((t, i) => (
              <TourCard key={t.id || i} tour={t} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
