import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { api } from '../utils/api';
import './Auth.css';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const res = await api.resetPassword({ token, newPassword: password });
      if (res.message !== 'Password updated successfully') throw new Error(res.message);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card glass-card" style={{ textAlign: 'center' }}>
          <h3>Invalid Request</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>No reset token provided.</p>
          <Link to="/auth" className="btn btn-primary">Return to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="glow-line glow-teal" style={{ width: 500, height: 500, top: -200, left: -200, opacity: 0.08 }} />
      
      <div className="auth-card glass-card animate-bounce-in">
        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 64, height: 64, background: 'var(--accent-teal-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle size={32} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <h3>Password Reset!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Your password has been successfully updated. You can now sign in.
            </p>
            <Link to="/auth" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: '0.5rem' }}>Set new password</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Please enter your new strong password below.
            </p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>New Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="input" style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }} />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              
              <div className="auth-field">
                <label>Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="input" style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }} />
                </div>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? <div className="spinner" /> : <>Update Password <ArrowRight size={16} /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
