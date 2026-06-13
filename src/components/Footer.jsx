import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { t } from '../utils/translations';
import './Footer.css';

export default function Footer() {
  const { language, setLanguage, currency, setCurrency, currencies } = useSettings();
  return (
    <footer className="footer">
      <div className="footer__glow footer__glow--left" />
      <div className="footer__glow footer__glow--right" />
      <div className="container-fluid">
        <div className="footer__top" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr' }}>

          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon"><Globe size={18} strokeWidth={2.5} /></div>
              <span>Zilli<span>GO</span></span>
            </Link>
            <p className="footer__tagline">
              {t('footer_tagline', language) || 'Explore the world through the eyes of local experts. Live virtual tours from every corner of the globe.'}
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" aria-label="Twitter / X">𝕏</a>
              <a href="#" className="footer__social" aria-label="Instagram">IG</a>
              <a href="#" className="footer__social" aria-label="YouTube">YT</a>
              <a href="#" className="footer__social" aria-label="LinkedIn">in</a>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} /> Global Platform · Available Worldwide
            </div>
          </div>

          {/* Explore */}
          <div className="footer__col">
            <h4>Explore</h4>
            <Link to="/explore">Browse Tours</Link>
            <Link to="/guides">Find Guides</Link>
            <Link to="/explore?type=live">Live Tours</Link>
            <Link to="/explore?type=recorded">Recorded Tours</Link>
            <Link to="/map">Global Map</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </div>

          {/* For Guides & Creators */}
          <div className="footer__col">
            <h4>Guides & Creators</h4>
            <Link to="/become-guide">Become a Guide</Link>
            <Link to="/guide-dashboard">Guide Dashboard</Link>
            <Link to="/trust-safety">Guide Verification</Link>
            <Link to="/become-guide#earnings">Earnings & Payouts</Link>
            <Link to="/community-guidelines">Creator Guidelines</Link>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4>Company</h4>
            <Link to="/about">About ZilliGo</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press Center</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/sustainability">Sustainability</Link>
            <Link to="/contact">Partnerships</Link>
          </div>

          {/* Resources */}
          <div className="footer__col">
            <h4>Resources</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/safety">Safety Guidelines</Link>
            <Link to="/community-guidelines">Community Guidelines</Link>
            <Link to="/trust-safety">Trust & Safety</Link>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/contact">Contact Support</Link>
          </div>

          {/* Legal */}
          <div className="footer__col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/dmca">DMCA Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/account-deletion">Account Deletion</Link>
          </div>

        </div>

        {/* Newsletter Strip */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '1.5rem 0',
          margin: '1rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>
              Stay Updated with ZilliGo
            </p>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>
              New tours, guide spotlights, and platform updates.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div className="input-group" style={{ maxWidth: 300 }}>
              <Mail size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input type="email" placeholder="Your email address" style={{ fontSize: '0.875rem' }} />
            </div>
            <button className="btn btn-primary btn-sm">Subscribe</button>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <p>© 2026 ZilliGo. All rights reserved. Built with ❤️ for global explorers.</p>
          </div>
          <div className="footer__bottom-right">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/accessibility">Accessibility</Link>
            <div style={{ marginLeft: '8px', display: 'flex', gap: '8px' }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '4px', fontSize: '0.75rem', padding: '2px 8px', cursor: 'pointer' }}
              >
                <option value="en">🌐 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '4px', fontSize: '0.75rem', padding: '2px 8px', cursor: 'pointer' }}
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
