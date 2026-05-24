import { useState } from 'react';
import { MapPin, ChevronRight, Globe, Search, ArrowLeft, X } from 'lucide-react';
import { HIERARCHICAL_LOCATIONS, getCountries, getStates, getCities } from '../data/locations';
import './LocationNavigator.css';

export default function LocationNavigator({ onSelect }) {
  const [step, setStep] = useState('country'); // country, state, city
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const countries = getCountries().filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const states = getStates(country);
  const cities = getCities(country, state);

  const handleCountrySelect = (c) => {
    setCountry(c);
    setStep('state');
    setSearchTerm('');
    onSelect({ country: c, state: '', city: '' });
  };

  const handleStateSelect = (s) => {
    setState(s);
    setStep('city');
    onSelect({ country, state: s, city: '' });
  };

  const handleCitySelect = (city) => {
    onSelect({ country, state, city });
  };

  const reset = () => {
    setCountry('');
    setState('');
    setStep('country');
    setSearchTerm('');
    onSelect({ country: '', state: '', city: '' });
  };

  const goBack = () => {
    if (step === 'city') setStep('state');
    else if (step === 'state') setStep('country');
  };

  return (
    <div className="location-navigator glass-card">
      <div className="location-nav-header">
        {step !== 'country' ? (
          <button className="nav-back-btn" onClick={goBack}>
            <ArrowLeft size={16} />
          </button>
        ) : <Globe size={18} style={{ color: 'var(--accent-teal)' }} />}
        
        <div className="nav-breadcrumbs">
          <span className={step === 'country' ? 'active' : ''} onClick={reset}>World</span>
          {country && (
            <>
              <ChevronRight size={14} />
              <span className={step === 'state' ? 'active' : ''} onClick={() => setStep('state')}>{country}</span>
            </>
          )}
          {state && (
            <>
              <ChevronRight size={14} />
              <span className={step === 'city' ? 'active' : ''}>{state}</span>
            </>
          )}
        </div>

        {step === 'country' && (
          <div className="nav-search-wrap">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search 195 countries..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nav-search-input"
            />
            {searchTerm && <X size={14} className="clear-icon" onClick={() => setSearchTerm('')} />}
          </div>
        )}
      </div>

      <div className="location-nav-content">
        {step === 'country' && (
          <div className="location-grid animate-fade-in">
            {countries.map(c => (
              <button key={c} className="location-card" onClick={() => handleCountrySelect(c)}>
                <div className="location-card__icon">
                  {c === 'India' ? '🇮🇳' : c === 'USA' ? '🇺🇸' : c === 'UK' ? '🇬🇧' : c === 'UAE' ? '🇦🇪' : c === 'France' ? '🇫🇷' : c === 'Japan' ? '🇯🇵' : c === 'China' ? '🇨🇳' : c === 'Brazil' ? '🇧🇷' : c === 'Australia' ? '🇦🇺' : '🌍'}
                </div>
                <div className="location-card__name">{c}</div>
                <div className="location-card__count">Explore</div>
              </button>
            ))}
            {countries.length === 0 && (
              <div className="nav-no-results">
                <Globe size={32} style={{ opacity: 0.3 }} />
                <p>No country found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}

        {step === 'state' && (
          <div className="location-list animate-slide-right">
            <h4 className="nav-section-title">Select Region in {country}</h4>
            <div className="location-list-grid">
              {states.map(s => (
                <button key={s} className="list-item-btn" onClick={() => handleStateSelect(s)}>
                  <MapPin size={14} />
                  <span>{s}</span>
                  <ChevronRight size={14} className="arrow" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'city' && (
          <div className="location-list animate-slide-right">
            <h4 className="nav-section-title">Select City in {state}</h4>
            <div className="location-list-grid">
              {cities.map(c => (
                <button key={c} className="list-item-btn" onClick={() => handleCitySelect(c)}>
                  <div className="city-dot" />
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
