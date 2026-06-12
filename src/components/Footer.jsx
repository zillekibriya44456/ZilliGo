import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Apple, Smartphone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { t } from '../utils/translations';
import './Footer.css';

export default function Footer() {
  const { language, setLanguage, currency, setCurrency, currencies } = useSettings();
  
  return (
    <footer className="liquid-footer">
      <div className="container">
        <div className="footer-top-row">
          
          {/* Brand & Newsletter */}
          <div className="footer-brand-sect">
            <Link to="/" className="footer-logo">
              <Globe size={20} strokeWidth={2.5} className="logo-icon" />
              <span>Zilli<span>GO</span></span>
            </Link>
            <p className="footer-tagline">
              {t('footer_tagline', language) || 'Immersive live virtual tours connecting the globe. Explore the world from anywhere.'}
            </p>
            
            <div className="footer-newsletter-compact">
              <div className="fn-input-wrapper">
                <Mail size={14} className="fn-icon" />
                <input type="email" placeholder="Enter email for updates" />
                <button className="fn-btn">Subscribe</button>
              </div>
            </div>

            <div className="footer-app-badges">
              <div className="app-badge">
                <Apple size={18} />
                <div>
                  <div className="badge-sub">Download on the</div>
                  <div className="badge-main">App Store</div>
                </div>
              </div>
              <div className="app-badge">
                <Smartphone size={18} />
                <div>
                  <div className="badge-sub">GET IT ON</div>
                  <div className="badge-main">Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="footer-nav-grid">
            <div className="footer-col">
              <h4>Explore</h4>
              <Link to="/explore">Marketplace</Link>
              <Link to="/explore?type=live">Live Tours</Link>
              <Link to="/explore?type=recorded">Recorded</Link>
              <Link to="/guides">Global Guides</Link>
              <Link to="/leaderboard">Leaderboard</Link>
            </div>
            
            <div className="footer-col">
              <h4>Creators</h4>
              <Link to="/become-guide">Become a Guide</Link>
              <Link to="/guide-dashboard">Dashboard</Link>
              <Link to="/trust-safety">Verification</Link>
              <Link to="/community-guidelines">Guidelines</Link>
              <Link to="/become-guide#earnings">Earnings</Link>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/press">Press</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
              <Link to="/safety">Safety</Link>
              <Link to="/help">Help Center</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="fb-left">
            © 2026 ZilliGo Inc. All rights reserved. Built for global explorers.
            <div className="fb-socials">
              <a href="#">𝕏</a>
              <a href="#">IG</a>
              <a href="#">YT</a>
              <a href="#">in</a>
            </div>
          </div>
          
          <div className="fb-right">
            <div className="selector-group">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="footer-select">
                <option value="en">🌐 English (US)</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="ja">🇯🇵 日本語</option>
              </select>
            </div>
            <div className="selector-group">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="footer-select">
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
