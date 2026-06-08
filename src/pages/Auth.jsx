import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ChevronRight, CheckCircle, AlertCircle, ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../utils/config';
import './Auth.css';

/* ─── Inline SVG brand icons (no lucide-react dependency) ─── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.3-164-39.3c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.7 0 178.3 0 98.7C0 44.5 23.3 1.3 71.9 1.3c45.8 0 92.7 30.4 123.1 57.3 38.4 34.6 62 74.5 62 74.5s-26.5 20.9-26.5 87.4c0 80.8 62.8 126.8 63.4 127.1z"/>
  </svg>
);

/* ─── Feature Highlights for left panel ─── */
const FEATURES = [
  { emoji: '🌍', title: 'Explore the World', desc: '10,000+ live virtual tours across 150+ countries' },
  { emoji: '🤝', title: 'Meet Global Friends', desc: 'Connect with travelers and locals who share your passions' },
  { emoji: '🎭', title: 'Discover Cultures', desc: 'Join live exchange rooms and cultural experiences' },
  { emoji: '💰', title: 'Earn as a Guide', desc: 'Turn your local knowledge into a global income stream' },
];

/* ─── Country list (top 30) ─── */
const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium',
  'Brazil','Canada','Chile','China','Colombia','Egypt','Ethiopia','France','Germany','Ghana',
  'India','Indonesia','Iran','Iraq','Italy','Japan','Kenya','Malaysia','Mexico','Morocco',
  'Nepal','Netherlands','New Zealand','Nigeria','Norway','Pakistan','Peru','Philippines',
  'Poland','Portugal','Russia','Saudi Arabia','Singapore','South Africa','South Korea','Spain',
  'Sri Lanka','Sweden','Switzerland','Thailand','Turkey','UAE','UK','USA','Ukraine','Vietnam',
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, loginWithToken, updateProfile } = useAuth();

  /* ── Tab & Step state ── */
  const [tab, setTab] = useState('signup'); // 'login' | 'signup'
  const [step, setStep] = useState(1);       // signup: 1=form, 2=role, 3=guide-upload | login: 1=form

  /* ── Form state ── */
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '', agree: false, rememberMe: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [role, setRole] = useState(''); // 'traveler' | 'guide'
  const [idFile, setIdFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [createdUser, setCreatedUser] = useState(null);

  /* ── Prefill tab from query string ── */
  useEffect(() => {
    if (searchParams.get('mode') === 'login') setTab('login');
    const err = searchParams.get('error');
    if (err) setError(decodeURIComponent(err));
  }, [searchParams]);

  const update = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setError('');
  };

  /* ── Social Login (redirects to backend) ── */
  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE}/auth/${provider}`;
  };

  /* ── Email Signup ── */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.agree) { setError('Please accept the terms to continue.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await register(form.name, form.email, form.password, 'traveler');
      setCreatedUser(data);
      setStep(2); // go to role selection
    } catch (err) {
      setError(err.message?.includes('already exists')
        ? 'An account with this email already exists. Try logging in.'
        : "We couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Email Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password, form.rememberMe);
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'guide') navigate('/guide-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError("We couldn't sign you in. Check your email and password and try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Role Selection ── */
  const handleRoleSelect = async (selectedRole) => {
    setRole(selectedRole);
    try {
      await updateProfile({ role: selectedRole });
      if (selectedRole === 'guide') {
        setStep(3);
      } else {
        // Traveler → go straight to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to update your role. Please try again.');
    }
  };

  /* ── Guide Upload Submit ── */
  const handleGuideSubmit = () => {
    // Guide verification happens later — just navigate
    navigate('/guide-dashboard');
  };

  const switchTab = (t) => {
    setTab(t);
    setStep(1);
    setError('');
    setSuccessMsg('');
    setForm({ name: '', email: '', password: '', country: '', agree: false, rememberMe: false });
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-left">
        <div className="auth-left-glow" />
        <div className="auth-left-content">
          <div className="auth-logo">
            <span className="auth-logo-icon">🌐</span>
            <span className="auth-logo-text">Zilli<span>Go</span></span>
          </div>
          <h2 className="auth-hero-title">
            Your World.<br />
            <span className="auth-hero-accent">Unlocked.</span>
          </h2>
          <p className="auth-hero-sub">
            Join 2 million travelers exploring the world through live, immersive experiences.
          </p>
          <div className="auth-features">
            {FEATURES.map(f => (
              <div key={f.title} className="auth-feature-item">
                <span className="auth-feature-emoji">{f.emoji}</span>
                <div>
                  <div className="auth-feature-title">{f.title}</div>
                  <div className="auth-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="auth-trust-badges">
            <div className="auth-trust-badge">🔒 SSL Encrypted</div>
            <div className="auth-trust-badge">✅ GDPR Compliant</div>
            <div className="auth-trust-badge">🌍 150+ Countries</div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-right">
        <div className="auth-card">

          {/* ─── STEP 1: Signup Form ─── */}
          {tab === 'signup' && step === 1 && (
            <div className="auth-form-wrapper animate-fade-up">
              {/* Tab switcher */}
              <div className="auth-tab-row">
                <button className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</button>
                <button className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>Log In</button>
              </div>

              <h2 className="auth-form-title">Create your account</h2>
              <p className="auth-form-sub">Join millions exploring the world. Takes under 30 seconds.</p>

              {/* Social Buttons */}
              <div className="auth-social-grid">
                <button className="auth-social-btn google" onClick={() => handleSocialLogin('google')} type="button">
                  <GoogleIcon /> Continue with Google
                </button>
                <button className="auth-social-btn github" onClick={() => handleSocialLogin('github')} type="button">
                  <GitHubIcon /> Continue with GitHub
                </button>
                <button className="auth-social-btn apple" onClick={() => handleSocialLogin('apple')} type="button">
                  <AppleIcon /> Continue with Apple
                </button>
              </div>

              <div className="auth-divider"><span>or sign up with email</span></div>

              {error && <div className="auth-error-banner"><AlertCircle size={16} /> {error}</div>}

              <form onSubmit={handleSignup} className="auth-email-form">
                <div className="auth-field">
                  <label>Full Name</label>
                  <div className="auth-input-wrap">
                    <User size={16} className="auth-input-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label>Email Address</label>
                  <div className="auth-input-wrap">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      id="signup-password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      required
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                    />
                    <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Country</label>
                  <select
                    id="signup-country"
                    value={form.country}
                    onChange={e => update('country', e.target.value)}
                    required
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <label className="auth-checkbox-row">
                  <input type="checkbox" checked={form.agree} onChange={e => update('agree', e.target.checked)} id="agree-terms" />
                  <span>I agree to the <a href="/terms" className="auth-link" target="_blank">Terms</a> &amp; <a href="/privacy" className="auth-link" target="_blank">Privacy Policy</a></span>
                </label>
                <button id="signup-submit" type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="auth-spinner" /> : <>Create Account <ChevronRight size={18} /></>}
                </button>
              </form>
              <p className="auth-footer-note">
                Already have an account? <button className="auth-link-btn" onClick={() => switchTab('login')}>Log in</button>
              </p>
            </div>
          )}

          {/* ─── STEP 2: Role Selection ─── */}
          {tab === 'signup' && step === 2 && (
            <div className="auth-form-wrapper animate-fade-up">
              <div className="auth-step-badge">✅ Account created!</div>
              <h2 className="auth-form-title">How will you use ZilliGo?</h2>
              <p className="auth-form-sub">Choose your primary role. You can always switch later.</p>

              <div className="auth-role-grid">
                <button
                  id="role-traveler"
                  className={`auth-role-card ${role === 'traveler' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('traveler')}
                >
                  <span className="auth-role-emoji">🧳</span>
                  <h3>Traveler</h3>
                  <p>Explore virtual tours, meet global friends, and discover new cultures from anywhere.</p>
                  <div className="auth-role-cta">Start exploring <ChevronRight size={16} /></div>
                </button>
                <button
                  id="role-guide"
                  className={`auth-role-card ${role === 'guide' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('guide')}
                >
                  <span className="auth-role-emoji">🎙️</span>
                  <h3>Local Guide</h3>
                  <p>Share your city, earn globally, and become a certified cultural ambassador.</p>
                  <div className="auth-role-cta">Become a guide <ChevronRight size={16} /></div>
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Guide Upload ─── */}
          {tab === 'signup' && step === 3 && (
            <div className="auth-form-wrapper animate-fade-up">
              <button className="auth-back-btn" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="auth-form-title">Quick Verification</h2>
              <p className="auth-form-sub">Upload one ID and a profile photo. Full verification happens after account creation.</p>

              <div className="auth-upload-zones">
                <label className="auth-upload-zone" htmlFor="id-upload">
                  <span className="auth-upload-emoji">🛡️</span>
                  <h4>Government ID</h4>
                  <p>Passport, National ID, or Driver's License</p>
                  {idFile ? (
                    <div className="auth-upload-success"><CheckCircle size={16} /> {idFile.name}</div>
                  ) : (
                    <div className="auth-upload-cta"><Upload size={14} /> Select File</div>
                  )}
                  <input id="id-upload" type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                    onChange={e => setIdFile(e.target.files[0])} />
                </label>

                <label className="auth-upload-zone" htmlFor="photo-upload">
                  <span className="auth-upload-emoji">📷</span>
                  <h4>Profile Photo</h4>
                  <p>A clear photo of your face</p>
                  {photoFile ? (
                    <div className="auth-upload-success"><CheckCircle size={16} /> {photoFile.name}</div>
                  ) : (
                    <div className="auth-upload-cta"><Upload size={14} /> Upload Photo</div>
                  )}
                  <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => setPhotoFile(e.target.files[0])} />
                </label>
              </div>

              <button id="guide-submit" className="auth-submit-btn" onClick={handleGuideSubmit}>
                Create Guide Account <CheckCircle size={18} />
              </button>
              <p className="auth-footer-note" style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', opacity: 0.6 }}>
                Bank details and availability collected after verification is approved.
              </p>
            </div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {tab === 'login' && (
            <div className="auth-form-wrapper animate-fade-up">
              <div className="auth-tab-row">
                <button className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</button>
                <button className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>Log In</button>
              </div>

              <h2 className="auth-form-title">Welcome back</h2>
              <p className="auth-form-sub">Sign in to continue your journey.</p>

              {/* Social Buttons */}
              <div className="auth-social-grid">
                <button className="auth-social-btn google" onClick={() => handleSocialLogin('google')} type="button">
                  <GoogleIcon /> Continue with Google
                </button>
                <button className="auth-social-btn github" onClick={() => handleSocialLogin('github')} type="button">
                  <GitHubIcon /> Continue with GitHub
                </button>
                <button className="auth-social-btn apple" onClick={() => handleSocialLogin('apple')} type="button">
                  <AppleIcon /> Continue with Apple
                </button>
              </div>

              <div className="auth-divider"><span>or login with email</span></div>

              {error && <div className="auth-error-banner"><AlertCircle size={16} /> {error}</div>}

              <form onSubmit={handleLogin} className="auth-email-form">
                <div className="auth-field">
                  <label>Email Address</label>
                  <div className="auth-input-wrap">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <div className="auth-field-header">
                    <label>Password</label>
                    <button type="button" className="auth-link-btn" onClick={() => navigate('/reset-password')}>Forgot password?</button>
                  </div>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      id="login-password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Your password"
                      required
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                    />
                    <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <label className="auth-checkbox-row">
                  <input id="remember-me" type="checkbox" checked={form.rememberMe} onChange={e => update('rememberMe', e.target.checked)} />
                  <span>Remember me for 30 days</span>
                </label>
                <button id="login-submit" type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="auth-spinner" /> : <>Sign In <ChevronRight size={18} /></>}
                </button>
              </form>

              <p className="auth-footer-note">
                Don't have an account? <button className="auth-link-btn" onClick={() => switchTab('signup')}>Sign up free</button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
