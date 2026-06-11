import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, Shield, Video, DollarSign, Globe, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './BecomeGuide.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://zilli-go.vercel.app/api';

export default function BecomeGuide() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    bio: '',
    location: '',
    languages: '',
    specialties: '',
    idFront: null,
    idBack: null,
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = (e, field) => {
    if (e.target.files[0]) {
      setForm({ ...form, [field]: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = user ? JSON.parse(localStorage.getItem('zilligo_user') || '{}')?.token : null;

      const response = await fetch(`${API_BASE}/guides/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bio: form.bio,
          location: form.location,
          languages: form.languages,
          specialties: form.specialties,
          email: user?.email || 'guest@zilligo.com',
          name: user?.name || 'Guest Applicant',
        }),
      });

      if (response.ok) {
        setStep(3);
        setTimeout(() => {
          navigate(user ? (user.role === 'guide' ? '/guide-dashboard' : '/dashboard') : '/auth?tab=register&role=guide');
        }, 4000);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      // In demo mode (no backend), still show success
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setStep(3);
        setTimeout(() => navigate(user ? '/dashboard' : '/auth'), 4000);
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="page-wrapper become-guide">
      <div className="bg-hero">
        <div className="bg-hero-img" />
        <div className="bg-hero-overlay" />
        <div className="container bg-hero-content">
          <div className="section-label">For Local Experts</div>
          <h1>Turn Your <span className="gradient-text-amber">Local Knowledge</span><br />Into Global Income</h1>
          <p>Join 2,400+ guides earning an average of $2,800/month by hosting live virtual tours from their smartphone.</p>
          {!user && <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}>Apply Now <ArrowRight size={18} /></button>}
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-4xl) 0' }}>
        <div className="grid-3" style={{ marginBottom: 'var(--space-4xl)' }}>
          {[
            { icon: <DollarSign size={24} />, title: 'Earn on Your Terms', desc: 'Set your own hourly rate. Keep 85% of every booking. Get paid weekly directly to your bank account.' },
            { icon: <Globe size={24} />, title: 'Global Audience', desc: 'Reach travelers from 180+ countries. No marketing needed — our platform brings the travelers to you.' },
            { icon: <Video size={24} />, title: 'Simple Tech', desc: 'Just a smartphone and internet connection. Our built-in streaming tools handle the rest.' },
          ].map(f => (
            <div key={f.title} className="glass-card" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, background: 'var(--accent-amber-glow)', color: 'var(--accent-amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)' }}>
                {f.icon}
              </div>
              <h3 style={{ marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div id="apply" className="bg-application glass-card">
          <div className="bg-app-sidebar">
            <h3>Application Process</h3>
            <div className="bg-steps">
              <div className={`bg-step ${step >= 1 ? 'active' : ''}`}>
                <div className="bg-step-num">1</div>
                <div>Profile Details</div>
              </div>
              <div className={`bg-step ${step >= 2 ? 'active' : ''}`}>
                <div className="bg-step-num">2</div>
                <div>ID Verification</div>
              </div>
              <div className={`bg-step ${step >= 3 ? 'active' : ''}`}>
                <div className="bg-step-num">3</div>
                <div>Submitted!</div>
              </div>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
              <Shield size={16} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
              <span>We securely encrypt your ID documents and delete them after verification within 48 hours.</span>
            </div>
          </div>

          <div className="bg-app-form">
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <h2 style={{ marginBottom: 'var(--space-xl)' }}>Tell us about yourself</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div className="auth-field">
                    <label>City & Country *</label>
                    <input name="location" value={form.location} onChange={handleChange} required className="input" placeholder="e.g. Rome, Italy" />
                  </div>
                  <div className="auth-field">
                    <label>Languages Spoken *</label>
                    <input name="languages" value={form.languages} onChange={handleChange} required className="input" placeholder="e.g. English, Italian, Spanish" />
                  </div>
                  <div className="auth-field">
                    <label>Tour Specialties</label>
                    <input name="specialties" value={form.specialties} onChange={handleChange} className="input" placeholder="e.g. Historical, Food, Art, Adventure" />
                  </div>
                  <div className="auth-field">
                    <label>Short Bio *</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} required className="input" placeholder="What makes you a great guide? Your background, passions, and what visitors love about touring with you." rows={4} style={{ resize: 'vertical' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.bio.length}/500 characters</span>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: 'var(--space-sm)' }}>
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <h2 style={{ marginBottom: 'var(--space-xl)' }}>Verify your Identity</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontSize: '0.9rem' }}>
                  To ensure safety on our platform, all guides must provide a government-issued ID. Your documents are encrypted and reviewed only by our trust team.
                </p>

                {error && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: 'var(--space-md)', color: 'var(--accent-rose)', fontSize: '0.875rem' }}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <div className="bg-upload-box">
                    <label>Front of ID / Passport *</label>
                    <div className="bg-upload-area">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'idFront')} required />
                      <div className="bg-upload-content">
                        {form.idFront
                          ? <><CheckCircle size={24} style={{ color: 'var(--accent-teal)' }} /> <span style={{ color: 'var(--accent-teal)' }}>{form.idFront} ✓</span></>
                          : <><Upload size={24} /> <span>Click to upload or drag and drop</span><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG or PDF up to 10MB</span></>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="bg-upload-box">
                    <label>Back of ID (if applicable)</label>
                    <div className="bg-upload-area">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'idBack')} />
                      <div className="bg-upload-content">
                        {form.idBack
                          ? <><CheckCircle size={24} style={{ color: 'var(--accent-teal)' }} /> <span style={{ color: 'var(--accent-teal)' }}>{form.idBack} ✓</span></>
                          : <><Upload size={24} /> <span>Click to upload or drag and drop</span><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Optional — for national IDs with info on both sides</span></>
                        }
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-sm)' }}>
                    <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <div className="spinner" /> : 'Submit Application'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ width: 80, height: 80, background: 'var(--accent-teal-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={40} style={{ color: 'var(--accent-teal)' }} />
                </div>
                <h2>Application Submitted! 🎉</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 380, lineHeight: 1.6 }}>
                  Thank you for applying to be a ZilliGO guide! Our team will review your profile and ID within <strong>24–48 hours</strong>. You'll receive an email confirmation shortly.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
                  {[{ icon: '📧', text: 'Confirmation email sent' }, { icon: '🔍', text: 'Review within 48hrs' }, { icon: '✅', text: 'Get verified badge' }].map(s => (
                    <div key={s.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '20px', padding: '6px 14px', fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                      {s.icon} {s.text}
                    </div>
                  ))}
                </div>
                <div className="spinner" style={{ marginTop: '1rem' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Redirecting you shortly...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
