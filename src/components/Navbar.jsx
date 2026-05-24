import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { t } from '../utils/translations';
import {
  Globe, Search, Bell, Menu, X, ChevronDown,
  User, LayoutDashboard, LogOut, Star, Map, Video, Trophy, MessageSquare, ShoppingBasket
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, languages } = useSettings();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const currentLang = languages?.find(l => l.code === language) || languages?.[0] || { flag: '🇺🇸', label: 'English' };

  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.role === 'guide') return '/guide-dashboard';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Globe size={20} strokeWidth={2.5} />
          </div>
          <span className="navbar__logo-text">Zill<span>GO</span></span>
        </Link>

        {/* Nav Links */}
        <div className="navbar__links">
          <NavLink to="/explore" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>
            <Map size={15} /> {t('explore', language)}
          </NavLink>
          <NavLink to="/guides" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>
            <User size={15} /> {t('guides', language)}
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>
            <Trophy size={15} /> {t('leaderboard', language)}
          </NavLink>
          <NavLink to="/live/1" className={({ isActive }) => `navbar__link navbar__link--live ${isActive ? 'active' : ''}`}>
            <span className="live-dot" /> {t('live_now', language)}
          </NavLink>
          <NavLink to="/shop" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>
            <ShoppingBasket size={15} /> Shop
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="navbar__right" ref={profileRef}>
          {/* Language Selector */}
          <div className="navbar__lang-wrapper">
            <button className="navbar__lang-btn" onClick={() => setLangOpen(!langOpen)}>
              <Globe size={15} />
              <span>{currentLang.flag} {currentLang.label}</span>
              <ChevronDown size={13} className={langOpen ? 'rotate' : ''} />
            </button>
            {langOpen && (
              <div className="navbar__dropdown navbar__lang-dropdown">
                {languages?.map(l => (
                  <button key={l.code} className={`navbar__dropdown-item ${language === l.code ? 'active' : ''}`}
                    onClick={() => { setLanguage(l.code); setLangOpen(false); }}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <button className="navbar__icon-btn" title="Notifications">
                <Bell size={18} />
                <span className="navbar__notif-dot" />
              </button>
              <div className="navbar__profile-wrapper">
                <button className="navbar__profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <img src={user.avatar} alt={user.name} className="navbar__avatar" />
                  <span className="navbar__profile-name">{user.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown size={14} className={profileOpen ? 'rotate' : ''} />
                </button>
                {profileOpen && (
                  <div className="navbar__dropdown navbar__profile-dropdown">
                    <div className="navbar__dropdown-header">
                      <img src={user.avatar} alt={user.name} className="navbar__dropdown-avatar" />
                      <div>
                        <div className="navbar__dropdown-name">{user.name}</div>
                        <div className="navbar__dropdown-role">{user.role}</div>
                      </div>
                    </div>
                    <hr className="navbar__dropdown-divider" />
                    <Link to={getDashboardPath()} className="navbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                      <LayoutDashboard size={15} /> {t('dashboard', language)}
                    </Link>
                    <Link to="/messages" className="navbar__dropdown-item" onClick={() => setProfileOpen(false)}>
                      <MessageSquare size={15} /> {t('messages', language)}
                      <span className="badge badge-rose" style={{ marginLeft: 'auto', padding: '1px 5px', fontSize: '0.65rem' }}>2</span>
                    </Link>
                    <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                      <LogOut size={15} /> {t('logout', language)}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/auth" className="btn btn-ghost btn-sm">{t('sign_in', language)}</Link>
              <Link to="/auth?tab=register" className="btn btn-primary btn-sm">{t('join', language)}</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="navbar__mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <NavLink to="/explore" onClick={() => setMenuOpen(false)}>🗺️ {t('explore', language)}</NavLink>
          <NavLink to="/guides" onClick={() => setMenuOpen(false)}>👤 {t('guides', language)}</NavLink>
          <NavLink to="/live/1" onClick={() => setMenuOpen(false)}>🔴 {t('live_now', language)}</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)}>🛍️ Shop</NavLink>
          {user ? (
            <>
              <NavLink to={getDashboardPath()} onClick={() => setMenuOpen(false)}>📊 {t('dashboard', language)}</NavLink>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>{t('logout', language)}</button>
            </>
          ) : (
            <>
              <NavLink to="/auth" onClick={() => setMenuOpen(false)}>{t('sign_in', language)}</NavLink>
              <NavLink to="/auth?tab=register" onClick={() => setMenuOpen(false)}>{t('join', language)}</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
