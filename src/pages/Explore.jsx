import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Map, Grid3X3, X, MapPin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TourCard from '../components/TourCard';
import { CATEGORIES } from '../data/constants';
import { api } from '../utils/api';
import LocationNavigator from '../components/LocationNavigator';
import { io } from 'socket.io-client';
import './Explore.css';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

const SORT_OPTIONS = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Most Reviews'];
const DURATION_OPTIONS = ['Any', '< 60 min', '60-90 min', '90-120 min', '120+ min'];
const PRICE_OPTIONS = ['Any', 'Under $20', '$20-$40', '$40-$60', '$60+'];

export default function Explore() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [typeFilter, setTypeFilter] = useState(params.get('type') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(params.get('category') || 'all');
  const [sort, setSort] = useState('Recommended');
  const [priceFilter, setPriceFilter] = useState('Any');
  const [durationFilter, setDurationFilter] = useState('Any');
  const [kidFriendlyFilter, setKidFriendlyFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Hierarchical Location State
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  const [dbTours, setDbTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const data = await api.getTours();
        if (data && Array.isArray(data)) {
          setDbTours(data);
        }
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();

    const socket = io(SOCKET_URL);
    socket.on('new_tour', (newTour) => {
      setDbTours(prev => [newTour, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filtered = useMemo(() => {
    let result = [...dbTours];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== 'all') result = result.filter(t => t.type === typeFilter);
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category.toLowerCase().includes(categoryFilter.replace('-', ' ')));
    }
    if (priceFilter === 'Under $20') result = result.filter(t => t.price < 20);
    else if (priceFilter === '$20-$40') result = result.filter(t => t.price >= 20 && t.price <= 40);
    else if (priceFilter === '$40-$60') result = result.filter(t => t.price > 40 && t.price <= 60);
    else if (priceFilter === '$60+') result = result.filter(t => t.price > 60);

    if (kidFriendlyFilter) result = result.filter(t => t.kidFriendly);

    if (selectedCountry) result = result.filter(t => t.location.toLowerCase().includes(selectedCountry.toLowerCase()));
    if (selectedState) result = result.filter(t => t.location.toLowerCase().includes(selectedState.toLowerCase()));
    if (selectedCity) result = result.filter(t => t.location.toLowerCase().includes(selectedCity.toLowerCase()));

    if (sort === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    else if (sort === 'Highest Rated') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'Most Reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return result;
  }, [search, typeFilter, categoryFilter, sort, priceFilter, durationFilter, kidFriendlyFilter, dbTours, selectedCountry, selectedState, selectedCity]);

  return (
    <div className="explore-page">
      {/* Liquid Header */}
      <div className="explore-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="explore-title"
          >
            Explore <span className="text-gradient">Tours</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="explore-subtitle"
          >
            Discover over 2,400+ live and recorded virtual tours from 180+ cities.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="explore-search-liquid glass-panel"
          >
            <Search size={20} className="esl-icon" />
            <input
              type="text"
              placeholder="Search cities, landmarks, guides..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="esl-clear"><X size={16} /></button>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="explore-quick-filters"
          >
            <div className="explore-type-tabs glass-panel">
              {['all', 'live', 'recorded'].map(type => (
                <button key={type} onClick={() => setTypeFilter(type)}
                  className={`explore-type-tab ${typeFilter === type ? 'active' : ''}`}>
                  {type === 'all' ? '🌍 All' : type === 'live' ? '🔴 Live' : '🎬 Recorded'}
                </button>
              ))}
            </div>
            
            <div className="explore-filter-actions">
              <select value={sort} onChange={e => setSort(e.target.value)} className="explore-select glass-panel">
                {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <button className={`btn-ghost ${showFilters ? 'active-filter' : ''}`}
                onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal size={16} style={{marginRight: '8px'}} /> Filters {showFilters ? '▲' : '▼'}
              </button>
              <button className="btn-icon glass-panel" onClick={() => setViewMode(v => v === 'grid' ? 'map' : 'grid')}>
                {viewMode === 'grid' ? <Map size={18} /> : <Grid3X3 size={18} />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="explore-filters-panel glass-panel"
          >
            <div className="container">
              <div className="explore-filters-grid">
                <div className="explore-filter-group">
                  <label>Category</label>
                  <div className="explore-filter-chips">
                    {CATEGORIES.map(c => (
                      <button key={c.id} onClick={() => setCategoryFilter(c.id)}
                        className={`explore-chip ${categoryFilter === c.id ? 'active' : ''}`}>
                        {c.icon} {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="explore-filter-group">
                  <label>Price Range</label>
                  <div className="explore-filter-chips">
                    {PRICE_OPTIONS.map(p => (
                      <button key={p} onClick={() => setPriceFilter(p)}
                        className={`explore-chip ${priceFilter === p ? 'active' : ''}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <LocationNavigator onSelect={({ country, state, city }) => {
                setSelectedCountry(country);
                setSelectedState(state);
                setSelectedCity(city);
              }} />
              <button onClick={() => { 
                setCategoryFilter('all'); setPriceFilter('Any'); setDurationFilter('Any'); setKidFriendlyFilter(false); setSelectedCountry(''); setSelectedState(''); setSelectedCity(''); 
              }} className="btn-ghost" style={{ marginTop: '24px' }}>
                <X size={14} style={{marginRight: '8px'}} /> Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container explore-results">
        <div className="explore-results-header">
          <span className="explore-results-count"><strong>{filtered.length}</strong> tours found</span>
        </div>

        {loading ? (
          <div className="explore-loading">Loading amazing experiences...</div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="explore-empty glass-panel">
            <Search size={48} color="var(--accent-teal)" />
            <h3>No tours found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn-liquid" onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all'); }}>
              Reset Filters
            </button>
          </motion.div>
        ) : viewMode === 'map' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="explore-map-container glass-panel">
            <div className="explore-map-bg" />
            <div className="explore-map-overlay">
              <Map size={48} color="var(--accent-teal)" />
              <h3>Interactive Map View</h3>
              <p>Showing {filtered.length} locations (Simulated Mapbox API)</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {filtered.map((t, i) => <TourCard key={t.id} tour={t} delay={0} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}
