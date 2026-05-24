import { useState } from 'react';
import { Search, Filter, Star, MapPin, Globe, CheckCircle } from 'lucide-react';
import GuideCard from '../components/GuideCard';
import { GUIDES } from '../data/mockData';
import './GuideDirectory.css';

export default function GuideDirectory() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [availOnly, setAvailOnly] = useState(false);
  const [sort, setSort] = useState('rating');

  const specialties = ['all', 'Historical', 'Food & Culture', 'Adventure', 'Art & Culture', 'Nature & Scenic', 'Tech & Innovation', 'Urban Exploration'];

  const filtered = GUIDES
    .filter(g => {
      const q = search.toLowerCase();
      if (q && !g.name.toLowerCase().includes(q) && !g.location.toLowerCase().includes(q) && !g.specialties.some(s => s.toLowerCase().includes(q))) return false;
      if (specialty !== 'all' && !g.specialties.includes(specialty)) return false;
      if (availOnly && !g.available) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'reviews') return b.reviewCount - a.reviewCount;
      if (sort === 'price') return a.hourlyRate - b.hourlyRate;
      return b.toursCompleted - a.toursCompleted;
    });

  return (
    <div className="page-wrapper guide-directory">
      <div className="guide-directory-header">
        <div className="container">
          <div className="section-label">Our Experts</div>
          <h1>Find Your <span className="gradient-text">Perfect Guide</span></h1>
          <p>2,400+ verified local experts ready to show you their city</p>

          <div className="guide-dir-search">
            <div className="input-group" style={{ flex: 1 }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search guides by name, city, or specialty..."
                value={search} onChange={e => setSearch(e.target.value)} id="guide-search-input" />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="explore-select">
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="tours">Most Tours</option>
              <option value="price">Lowest Price</option>
            </select>
            <label className="guide-avail-toggle">
              <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} />
              <span>Available Now</span>
            </label>
          </div>

          <div className="guide-specialty-tabs">
            {specialties.map(s => (
              <button key={s} onClick={() => setSpecialty(s)}
                className={`category-btn ${specialty === s ? 'category-btn--active' : ''}`}>
                {s === 'all' ? '🌍 All Guides' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div style={{ marginBottom: 'var(--space-lg)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> guides
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}>
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <h3 style={{ marginTop: '1rem' }}>No guides found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid-4">
            {filtered.map(g => <GuideCard key={g.id} guide={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
