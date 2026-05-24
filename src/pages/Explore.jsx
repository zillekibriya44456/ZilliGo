import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Map, Grid3X3, X, MapPin, Globe } from 'lucide-react';
import TourCard from '../components/TourCard';
import { TOURS, CATEGORIES } from '../data/mockData';
import { api } from '../utils/api';
import { HIERARCHICAL_LOCATIONS, getCountries, getStates, getCities } from '../data/locations';
import LocationNavigator from '../components/LocationNavigator';
import './Explore.css';

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
        console.warn('Backend not reachable, using mock data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const allTours = dbTours.length > 0 ? dbTours : TOURS;

  const filtered = useMemo(() => {
    let result = [...allTours];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
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

    // Hierarchical Location Filtering
    if (selectedCountry) {
      result = result.filter(t => t.location.toLowerCase().includes(selectedCountry.toLowerCase()));
    }
    if (selectedState) {
      result = result.filter(t => t.location.toLowerCase().includes(selectedState.toLowerCase()));
    }
    if (selectedCity) {
      result = result.filter(t => t.location.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    if (sort === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    else if (sort === 'Highest Rated') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'Most Reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return result;
  }, [search, typeFilter, categoryFilter, sort, priceFilter, durationFilter, kidFriendlyFilter]);

  return (
    <div className="page-wrapper explore-page">
      {/* Header */}
      <div className="explore-header">
        <div className="container">
          <h1>Explore <span className="gradient-text">Tours</span></h1>
          <p>Discover {allTours.length * 15}+ live and recorded tours from 180+ cities</p>

          {/* Search Bar */}
          <div className="explore-search">
            <div className="input-group explore-search__input">
              <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                id="explore-search-input"
                type="text"
                placeholder="Search cities, landmarks, guides..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="explore-quick-filters">
            <div className="explore-type-tabs">
              {['all', 'live', 'recorded'].map(type => (
                <button key={type} onClick={() => setTypeFilter(type)}
                  className={`explore-type-tab ${typeFilter === type ? 'active' : ''}`}>
                  {type === 'all' ? '🌍 All' : type === 'live' ? '🔴 Live' : '🎬 Recorded'}
                </button>
              ))}
            </div>
            <div className="explore-filter-actions">
              <select value={sort} onChange={e => setSort(e.target.value)} className="explore-select">
                {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <button className={`btn btn-secondary btn-sm ${showFilters ? 'active-filter' : ''}`}
                onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal size={15} /> Filters {showFilters ? '▲' : '▼'}
              </button>
              <button className="explore-view-btn" onClick={() => setViewMode(v => v === 'grid' ? 'map' : 'grid')} title={viewMode === 'grid' ? 'Switch to Map View' : 'Switch to Grid View'}>
                {viewMode === 'grid' ? <Map size={18} /> : <Grid3X3 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="explore-filters-panel">
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
              <div className="explore-filter-group">
                <label>Duration</label>
                <div className="explore-filter-chips">
                  {DURATION_OPTIONS.map(d => (
                    <button key={d} onClick={() => setDurationFilter(d)}
                      className={`explore-chip ${durationFilter === d ? 'active' : ''}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="explore-filter-group">
                <label>Family</label>
                <div className="explore-filter-chips">
                  <button onClick={() => setKidFriendlyFilter(!kidFriendlyFilter)}
                    className={`explore-chip ${kidFriendlyFilter ? 'active' : ''}`}>
                    🧸 Kid-Friendly Only
                  </button>
                </div>
              </div>
            </div>
            {/* Location Visual Navigator */}
            <LocationNavigator onSelect={({ country, state, city }) => {
              setSelectedCountry(country);
              setSelectedState(state);
              setSelectedCity(city);
            }} />

            <button onClick={() => { 
              setCategoryFilter('all'); 
              setPriceFilter('Any'); 
              setDurationFilter('Any'); 
              setKidFriendlyFilter(false);
              setSelectedCountry('');
              setSelectedState('');
              setSelectedCity('');
            }}
              className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }}>
              <X size={14} /> Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container explore-results">
        <div className="explore-results-header">
          <span className="explore-results-count">
            <strong>{filtered.length}</strong> tours found
          </span>
          <div className="explore-active-filters">
            {search && <span className="explore-filter-tag">{search} <button onClick={() => setSearch('')}><X size={10} /></button></span>}
            {typeFilter !== 'all' && <span className="explore-filter-tag">{typeFilter} <button onClick={() => setTypeFilter('all')}><X size={10} /></button></span>}
            {selectedCountry && (
              <span className="explore-filter-tag explore-filter-tag--location">
                <Globe size={10} /> {selectedCountry} 
                {selectedState && ` > ${selectedState}`}
                {selectedCity && ` > ${selectedCity}`}
                <button onClick={() => { setSelectedCountry(''); setSelectedState(''); setSelectedCity(''); }}><X size={10} /></button>
              </span>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="explore-empty">
            <div className="explore-empty__icon">🔍</div>
            <h3>No tours found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          viewMode === 'map' ? (
            <div className="explore-map-container" style={{ position: 'relative', height: '600px', background: '#1a2235', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) invert(100%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Map size={48} color="var(--accent-teal)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h3 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Interactive Map View</h3>
                <p style={{ color: 'var(--text-secondary)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Showing {filtered.length} locations (Simulated Mapbox API)</p>
              </div>
              {filtered.map((t, i) => (
                <div key={t.id} style={{ position: 'absolute', top: `${20 + (i * 15) % 60}%`, left: `${10 + (i * 20) % 80}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>
                  <div style={{ background: 'var(--accent-rose)', color: '#fff', padding: '4px 8px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)' }}>
                    ${t.price}
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid var(--accent-rose)', margin: '0 auto' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-4">
              {filtered.map(t => <TourCard key={t.id} tour={t} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}
