import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { t } from '../utils/translations';
import './Footer.css';

export default function Footer() {
  const { language, setLanguage, currency, setCurrency, currencies, languages } = useSettings();
  return (
    <footer className="footer">
      <div className="footer__glow footer__glow--left" />
      <div className="footer__glow footer__glow--right" />
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon"><Globe size={18} strokeWidth={2.5} /></div>
              <span>Zill<span>GO</span></span>
            </Link>
            <p className="footer__tagline">
              {t('footer_tagline', language) || 'Explore the world through the eyes of local experts. Live virtual tours from every corner of the globe.'}
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" aria-label="Twitter">X</a>
              <a href="#" className="footer__social" aria-label="Instagram">IG</a>
              <a href="#" className="footer__social" aria-label="YouTube">YT</a>
              <a href="#" className="footer__social" aria-label="LinkedIn">IN</a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer__col">
            <h4>{t('explore', language) || 'Explore'}</h4>
            <Link to="/explore">{t('browse_tours', language) || 'Browse Tours'}</Link>
            <Link to="/guides">{t('find_guides', language) || 'Find Guides'}</Link>
            <Link to="/live/1">{t('live_tours', language) || 'Live Tours'}</Link>
            <Link to="/explore?type=recorded">{t('recorded_tours', language) || 'Recorded Tours'}</Link>
            <Link to="/explore?category=featured">{t('featured', language) || 'Featured'}</Link>
          </div>

          {/* For Guides */}
          <div className="footer__col">
            <h4>{t('for_guides', language) || 'For Guides'}</h4>
            <Link to="/become-guide">{t('become_a_guide', language) || 'Become a Guide'}</Link>
            <Link to="/guide-dashboard">{t('guide_dashboard', language) || 'Guide Dashboard'}</Link>
            <Link to="/become-guide#pricing">{t('earnings', language) || 'Earnings'}</Link>
            <a href="#">{t('guide_resources', language) || 'Guide Resources'}</a>
            <a href="#">{t('verification_process', language) || 'Verification Process'}</a>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4>Company</h4>
            <a href="#">About ZillGO</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Blog</a>
            <a href="#">Sustainability</a>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4>Support</h4>
            <a href="#" className="footer__contact-link"><Mail size={14} /> help@zillgo.com</a>
            <a href="#" className="footer__contact-link"><Phone size={14} /> +1 (800) ZILLGO</a>
            <a href="#" className="footer__contact-link"><MapPin size={14} /> Global Support 24/7</a>
            <a href="#">Help Center</a>
            <a href="#">Safety Guidelines</a>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <p>© 2026 ZillGO Technologies Inc. All rights reserved.</p>
          </div>
          <div className="footer__bottom-right">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <div style={{ marginLeft: '20px', display: 'flex', gap: '12px' }}>
              <select 
                className="footer__selector" 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '4px', fontSize: '0.75rem', padding: '2px 8px', cursor: 'pointer' }}
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <select 
                className="footer__selector" 
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
