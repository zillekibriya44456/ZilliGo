import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, ChevronRight, CheckCircle, AlertCircle, ArrowLeft, Upload, Globe, Compass, MessageSquare, Shield, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../utils/config';
import './Auth.css';

/* ─── Premium Inline Brand SVGs ─── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

/* ─── Premium value cards ─── */
const PREMIUM_CARDS = [
  { icon: '🌍', title: 'Explore 180+ Cities', desc: 'Discover cultures, landmarks, food, and local life worldwide.' },
  { icon: '🗣', title: 'AI Live Translation', desc: 'Join experiences in different languages without barriers.' },
  { icon: '🎙', title: 'Meet Local Guides', desc: 'Learn directly from passionate locals around the world.' },
  { icon: '🛂', title: 'Digital Travel Passport', desc: 'Track every destination you visit virtually.' },
  { icon: '🤝', title: 'Global Friend Matching', desc: 'Connect with travelers and locals who share your interests.' },
  { icon: '🎥', title: 'Live Experiences', desc: 'Join immersive real-time virtual tours and events.' }
];

/* ─── Trust markers ─── */
const TRUST_BADGES = [
  { label: '🔒 Secure Authentication' },
  { label: '🌍 Available Worldwide' },
  { label: '🛡 Privacy Protected' },
  { label: '🗣 100+ Languages' },
  { label: '👥 Global Community' }
];

/* ─── Country lists ─── */
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
  const { login, register, updateProfile } = useAuth();

  /* ── Tab & Step state ── */
  const [tab, setTab] = useState('signup'); // 'signup' | 'login'
  const [step, setStep] = useState(1);       // 1 = signup/login form, 2 = role selection onboarding, 3 = guide verification upload

  /* ── Form state ── */
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '', agree: false, rememberMe: false });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'linkedin' | null
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  /* ── Auto-Detect Preferred Country ── */
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        if (tz.includes('Kolkata') || tz.includes('Calcutta')) update('country', 'India');
        else if (tz.includes('London')) update('country', 'UK');
        else if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles')) update('country', 'USA');
        else if (tz.includes('Paris')) update('country', 'France');
        else if (tz.includes('Berlin')) update('country', 'Germany');
        else if (tz.includes('Tokyo')) update('country', 'Japan');
        else if (tz.includes('Sydney')) update('country', 'Australia');
        else if (tz.includes('Toronto') || tz.includes('Vancouver')) update('country', 'Canada');
        else if (tz.includes('Singapore')) update('country', 'Singapore');
      }
    } catch (e) {
      console.warn('Country auto-detection failed', e);
    }
  }, []);

  /* ── Prefill tab from queryMode ── */
  useEffect(() => {
    const mode = searchParams.get('mode') || searchParams.get('tab');
    if (mode === 'login' || mode === 'signin') setTab('login');
    else if (mode === 'register' || mode === 'signup') setTab('signup');
    else if (mode === 'onboarding') setStep(2);
    
    const err = searchParams.get('error');
    if (err) setError(decodeURIComponent(err));
  }, [searchParams]);

  const update = (field, val) => {
    setForm(p => ({ ...p, [field]: val }));
    setError('');
  };

  /* ── Social Login ── */
  const handleSocialLogin = (provider) => {
    setSocialLoading(provider);
    setError('');
    try {
      window.location.assign(`${API_BASE}/auth/${provider}`);
    } catch (err) {
      console.error('Redirect failed', err);
      window.location.href = `${API_BASE}/auth/${provider}`;
    }
  };

  /* ── Email Signup ── */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.agree) { setError('Please agree to the Terms & Privacy Policy.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      // Sign up initially registers the user. Role selection is onboarding afterwards.
      await register(form.name, form.email, form.password, 'traveler');
      setStep(2); // advance to role selection onboarding
    } catch (err) {
      setError(err.message?.includes('already exists')
        ? 'An account with this email already exists. Try logging in.'
        : "Failed to create account. Please try again.");
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
      setError("Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Onboarding Role Selection ── */
  const handleRoleSelect = async (selectedRole) => {
    setRole(selectedRole);
    setLoading(true);
    try {
      await updateProfile({ role: selectedRole });
      if (selectedRole === 'guide') {
        setStep(3); // guide verification file uploads
      } else if (selectedRole === 'creator') {
        navigate('/creator-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to configure your onboarding role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Guide Upload Submit ── */
  const handleGuideSubmit = () => {
    navigate('/guide-dashboard');
  };

  const switchTab = (t) => {
    setTab(t);
    setStep(1);
    setError('');
    setForm(p => ({ ...p, name: '', email: '', password: '', agree: false }));
  };

  return (
    <div className="auth-page">
      {/* ── Left Side Panel: Premium Value Cards ── */}
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
            Join a global community exploring real-time landmarks and sharing cultures through interactive live virtual tours.
          </p>

          <div className="auth-premium-grid">
            {PREMIUM_CARDS.map(c => (
              <div key={c.title} className="auth-value-card">
                <span className="auth-value-emoji">{c.icon}</span>
                <div className="auth-value-details">
                  <h4 className="auth-value-title">{c.title}</h4>
                  <p className="auth-value-desc">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="auth-trust-badges">
            {TRUST_BADGES.map(b => (
              <span key={b.label} className="auth-trust-badge">{b.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Side Panel: Simplified Action Cards ── */}
      <div className="auth-right">
        <div className="auth-card">

          {/* ─── STEP 1: Signup / Login Forms ─── */}
          {step === 1 && (
            <div className="auth-form-wrapper animate-fade-up">
              {/* Simplified Tab Switcher */}
              <div className="auth-tab-row">
                <button className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>SIGN UP</button>
                <button className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>LOG IN</button>
              </div>

              <h2 className="auth-form-title">
                {tab === 'signup' ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="auth-form-sub">
                {tab === 'signup' ? 'Get started in under 30 seconds.' : 'Sign in to resume exploring.'}
              </p>

              {/* Secure Social Logins */}
              <div className="auth-social-grid">
                <button 
                  className="auth-social-btn google" 
                  onClick={() => handleSocialLogin('google')} 
                  type="button"
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'google' ? (
                    <span className="auth-button-spinner" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </button>
                <button 
                  className="auth-social-btn linkedin" 
                  onClick={() => handleSocialLogin('linkedin')} 
                  type="button"
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'linkedin' ? (
                    <span className="auth-button-spinner" />
                  ) : (
                    <LinkedInIcon />
                  )}
                  Continue with LinkedIn
                </button>
              </div>

              <div className="auth-divider">
                <span>or continue with email</span>
              </div>

              {error && (
                <div className="auth-error-banner">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {tab === 'signup' ? (
                /* SIGN UP FORM (Minimal Fields) */
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
                        placeholder="name@domain.com"
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
                        placeholder="At least 6 characters"
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
                    <div className="auth-input-wrap">
                      <Globe size={16} className="auth-input-icon" />
                      <select
                        id="signup-country"
                        value={form.country}
                        onChange={e => update('country', e.target.value)}
                        required
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <label className="auth-checkbox-row">
                    <input 
                      type="checkbox" 
                      checked={form.agree} 
                      onChange={e => update('agree', e.target.checked)} 
                      id="agree-terms" 
                    />
                    <span>I agree to the <a href="/terms" className="auth-link" target="_blank">Terms</a> &amp; <a href="/privacy" className="auth-link" target="_blank">Privacy Policy</a></span>
                  </label>

                  <button id="signup-submit" type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? <span className="auth-spinner" /> : <>Continue <ChevronRight size={18} /></>}
                  </button>
                </form>
              ) : (
                /* LOG IN FORM */
                <form onSubmit={handleLogin} className="auth-email-form">
                  <div className="auth-field">
                    <label>Email Address</label>
                    <div className="auth-input-wrap">
                      <Mail size={16} className="auth-input-icon" />
                      <input
                        id="login-email"
                        type="email"
                        placeholder="you@domain.com"
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
                        placeholder="Password"
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
                    {loading ? <span className="auth-spinner" /> : <>Log In <ChevronRight size={18} /></>}
                  </button>
                </form>
              )}

              <p className="auth-footer-note">
                {tab === 'signup' ? (
                  <>Already have an account? <button className="auth-link-btn" onClick={() => switchTab('login')}>Log in</button></>
                ) : (
                  <>Don't have an account? <button className="auth-link-btn" onClick={() => switchTab('signup')}>Sign up free</button></>
                )}
              </p>
            </div>
          )}

          {/* ─── STEP 2: Onboarding Role Selection ─── */}
          {step === 2 && (
            <div className="auth-form-wrapper onboarding-wrapper animate-fade-up">
              <div className="auth-step-badge">
                <ShieldCheck size={14} /> Account Created Successfully
              </div>
              <h2 className="auth-form-title">How would you like to use ZilliGo?</h2>
              <p className="auth-form-sub">Select your primary role. You can switch this at any time later.</p>

              <div className="auth-onboarding-grid">
                {/* Traveler */}
                <button
                  id="role-traveler"
                  className="auth-onboarding-card"
                  onClick={() => handleRoleSelect('traveler')}
                  disabled={loading}
                >
                  <div className="auth-onboarding-top">
                    <span className="auth-onboarding-emoji">🌍</span>
                    <div className="auth-onboarding-info">
                      <h4>Traveler</h4>
                      <p>Explore cities, cultures, and live virtual tours.</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="auth-onboarding-chevron" />
                </button>

                {/* Guide */}
                <button
                  id="role-guide"
                  className="auth-onboarding-card"
                  onClick={() => handleRoleSelect('guide')}
                  disabled={loading}
                >
                  <div className="auth-onboarding-top">
                    <span className="auth-onboarding-emoji">🎙</span>
                    <div className="auth-onboarding-info">
                      <h4>Guide</h4>
                      <p>Host virtual tours and share local experiences.</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="auth-onboarding-chevron" />
                </button>

                {/* Creator */}
                <button
                  id="role-creator"
                  className="auth-onboarding-card"
                  onClick={() => handleRoleSelect('creator')}
                  disabled={loading}
                >
                  <div className="auth-onboarding-top">
                    <span className="auth-onboarding-emoji">🎥</span>
                    <div className="auth-onboarding-info">
                      <h4>Creator</h4>
                      <p>Upload travel content and livestream experiences.</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="auth-onboarding-chevron" />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Guide Upload Verification ─── */}
          {step === 3 && (
            <div className="auth-form-wrapper animate-fade-up">
              <button className="auth-back-btn" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="auth-form-title">Upload Credentials</h2>
              <p className="auth-form-sub">Provide your credentials for review. Verification is typically completed within 24 hours.</p>

              <div className="auth-upload-zones">
                <label className="auth-upload-zone" htmlFor="id-upload">
                  <span className="auth-upload-emoji">🛡️</span>
                  <h4>Government ID</h4>
                  <p>Passport, National ID Card, or Driver's License</p>
                  {idFile ? (
                    <div className="auth-upload-success"><CheckCircle size={16} /> {idFile.name}</div>
                  ) : (
                    <div className="auth-upload-cta"><Upload size={14} /> Browse ID File</div>
                  )}
                  <input id="id-upload" type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                    onChange={e => setIdFile(e.target.files[0])} />
                </label>

                <label className="auth-upload-zone" htmlFor="photo-upload">
                  <span className="auth-upload-emoji">📷</span>
                  <h4>Ambassador Photo</h4>
                  <p>A high-quality picture of yourself</p>
                  {photoFile ? (
                    <div className="auth-upload-success"><CheckCircle size={16} /> {photoFile.name}</div>
                  ) : (
                    <div className="auth-upload-cta"><Upload size={14} /> Upload Portrait</div>
                  )}
                  <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => setPhotoFile(e.target.files[0])} />
                </label>
              </div>

              <button id="guide-submit" className="auth-submit-btn" onClick={handleGuideSubmit}>
                Submit Credentials <CheckCircle size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
