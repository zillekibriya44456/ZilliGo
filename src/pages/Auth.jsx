import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, X, Send, ExternalLink, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PROVIDER_INFO = {
  google: {
    name: 'Google', color: '#4285F4',
    devUrl: 'https://console.cloud.google.com/apis/credentials',
    steps: [
      'Go to console.cloud.google.com → Create Project → APIs & Services → Credentials',
      'Click + Create Credentials → OAuth 2.0 Client IDs → Web application',
      'Add Authorized redirect URI: http://localhost:5001/api/auth/google/callback',
      'Copy Client ID + Secret → add to server/.env as GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
      'Restart the backend server, then Google login will work!',
    ],
  },
  github: {
    name: 'GitHub', color: '#ffffff',
    devUrl: 'https://github.com/settings/developers',
    steps: [
      'Go to github.com/settings/developers → New OAuth App',
      'Set Authorization callback URL: http://localhost:5001/api/auth/github/callback',
      'Click Register application → then Generate a new client secret',
      'Copy Client ID + Client Secret → add to server/.env as GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET',
      'Restart the backend server, then GitHub login will work!',
    ],
  },
  facebook: {
    name: 'Facebook', color: '#1877F2',
    devUrl: 'https://developers.facebook.com/apps',
    steps: [
      'Go to developers.facebook.com → My Apps → Create App',
      'Select "Authenticate and request data from users"',
      'Add product: Facebook Login → set Valid OAuth Redirect URI: http://localhost:5001/api/auth/facebook/callback',
      'Go to Settings → Basic → copy App ID + App Secret',
      'Add to server/.env as FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET, then restart server',
    ],
  },
  linkedin: {
    name: 'LinkedIn', color: '#0A66C2',
    devUrl: 'https://www.linkedin.com/developers/apps',
    steps: [
      'Go to linkedin.com/developers/apps → Create app',
      'Go to Auth tab → add redirect URL: http://localhost:5001/api/auth/linkedin/callback',
      'Go to Products tab → Request "Sign In with LinkedIn using OpenID Connect"',
      'Copy Client ID + Client Secret → add to server/.env as LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET',
      'Restart the backend server, then LinkedIn login will work!',
    ],
  },
  instagram: {
    name: 'Instagram', color: '#E1306C',
    devUrl: null,
    steps: ['Instagram login requires Facebook Business account review which takes weeks. Please use Google, GitHub, or email/password instead.'],
  },
};

function OAuthSetupModal({ provider, onClose }) {
  const info = PROVIDER_INFO[provider] || {};
  return (
    <div className="auth-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal glass-card animate-bounce-in" style={{ maxWidth: 480 }}>
        <button className="auth-modal-close" onClick={onClose}><X size={18} /></button>
        <div className="auth-modal-icon" style={{ background: `${info.color}18`, color: info.color, width: 56, height: 56, borderRadius: 14 }}>
          <Settings size={28} />
        </div>
        <h3 style={{ margin: 0 }}>{info.name} Login — Setup Required</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '4px 0 8px' }}>
          {info.name} login needs a free developer app. Here's how to set it up in ~5 minutes:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '4px 0 12px' }}>
          {(info.steps || []).map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${info.color}25`, color: info.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {info.devUrl && (
            <a href={info.devUrl} target="_blank" rel="noreferrer" className="btn btn-primary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', fontSize: '0.875rem' }}>
              Open {info.name} Console <ExternalLink size={14} />
            </a>
          )}
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: info.devUrl ? '0 0 auto' : 1 }}>
            Close
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0 0' }}>
          💡 In the meantime, you can use <strong>email/password</strong> to sign in.
        </p>
      </div>
    </div>
  );
}


function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending reset email (backend endpoint can be added later)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="auth-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal glass-card animate-bounce-in">
        <button className="auth-modal-close" onClick={onClose}><X size={18} /></button>
        {!sent ? (
          <>
            <div className="auth-modal-icon"><Mail size={28} /></div>
            <h3>Reset your password</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="reset-email">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? <div className="spinner" /> : <><Send size={16} /> Send Reset Link</>}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 64, height: 64, background: 'var(--accent-teal-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle size={32} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <h3>Check your inbox!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              If an account with <strong>{email}</strong> exists, you'll receive a password reset link within a few minutes.
            </p>
            <button className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={onClose}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Auth() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'traveler' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(params.get('error') ? decodeURIComponent(params.get('error')) : '');
  const [showForgot, setShowForgot] = useState(false);
  const [oauthSetup, setOauthSetup] = useState(null); // which provider to show setup modal for
  const [socialLoading, setSocialLoading] = useState(null);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await register(form.name, form.email, form.password, form.role);
      }
      navigate(form.role === 'guide' ? '/guide-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (platform) => {
    setSocialLoading(platform);
    try {
      // Check if this provider is configured on the backend before redirecting
      const res = await fetch(`${API_BASE}/auth/check-oauth?provider=${platform}`);
      const data = await res.json();
      if (data.configured) {
        // Provider is ready — do the real redirect
        const backendBase = API_BASE.replace('/api', '');
        window.location.href = `${backendBase}/api/auth/${platform}`;
      } else {
        // Not configured — show setup instructions instead of hitting Google 400
        setSocialLoading(null);
        setOauthSetup(platform);
      }
    } catch {
      // Backend unreachable — show setup guide
      setSocialLoading(null);
      setOauthSetup(platform);
    }
  };

  return (
    <div className="auth-page">
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      {oauthSetup && <OAuthSetupModal provider={oauthSetup} onClose={() => setOauthSetup(null)} />}

      <div className="auth-bg" />
      <div className="glow-line glow-teal" style={{ width: 500, height: 500, top: -200, left: -200, opacity: 0.08 }} />
      <div className="glow-line glow-purple" style={{ width: 400, height: 400, bottom: -200, right: -100, opacity: 0.08 }} />

      <div className="auth-card glass-card animate-bounce-in">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon"><Globe size={18} strokeWidth={2.5} /></div>
          <span>Zill<span>GO</span></span>
        </Link>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Create Account</button>
        </div>

        {/* Social Logins */}
        <div className="auth-social-grid">
          <button className="auth-social-btn google" title="Continue with Google" onClick={() => handleSocialLogin('google')} disabled={loading || socialLoading !== null}>
            {socialLoading === 'google' ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
          </button>
          <button className="auth-social-btn github" title="Continue with GitHub" onClick={() => handleSocialLogin('github')} disabled={loading}>
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </button>
          <button className="auth-social-btn facebook" title="Continue with Facebook" onClick={() => handleSocialLogin('facebook')} disabled={loading}>
            <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </button>
          <button className="auth-social-btn linkedin" title="Continue with LinkedIn" onClick={() => handleSocialLogin('linkedin')} disabled={loading}>
            <svg width="20" height="20" fill="#0A66C2" viewBox="0 0 24 24"><path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.208 24 24 23.227 24 22.271V1.729C24 .774 23.208 0 22.225 0zM7.12 20.452H3.558V8.995H7.12v11.457zM5.339 7.433c-1.146 0-2.074-.928-2.074-2.074 0-1.144.928-2.074 2.074-2.074 1.144 0 2.074.93 2.074 2.074 0 1.146-.93 2.074-2.074 2.074zm15.113 13.019h-3.562v-5.579c0-1.33-.024-3.041-1.852-3.041-1.855 0-2.139 1.448-2.139 2.945v5.675h-3.558V8.995h3.413v1.561h.049c.475-.9 1.636-1.85 3.367-1.85 3.603 0 4.269 2.37 4.269 5.455v6.291z"/></svg>
          </button>
          <button className="auth-social-btn instagram" title="Continue with Instagram" onClick={() => handleSocialLogin('instagram')} disabled={loading}>
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </button>
        </div>

        <div className="auth-divider"><span>or continue with email</span></div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {tab === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input id="auth-name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required className="input" />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input id="auth-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className="input" style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>

          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="auth-password">Password</label>
              {tab === 'login' && (
                <button type="button" className="auth-forgot" onClick={() => setShowForgot(true)}>
                  Forgot password?
                </button>
              )}
            </div>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input id="auth-password" name="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={handleChange} required className="input" style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }} />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <div className="auth-field">
              <label>I am a...</label>
              <div className="auth-role-select">
                {['traveler', 'guide'].map(role => (
                  <label key={role} className={`auth-role-option ${form.role === role ? 'active' : ''}`}>
                    <input type="radio" name="role" value={role} checked={form.role === role} onChange={handleChange} />
                    <span>{role === 'traveler' ? '🌍 Traveler' : '🎓 Guide'}</span>
                    {form.role === role && <CheckCircle size={14} />}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <div className="spinner" /> : (
              <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="auth-switch">
          {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')} className="auth-switch-btn">
            {tab === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>

        <p className="auth-terms">
          By continuing, you agree to ZillGO's <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
