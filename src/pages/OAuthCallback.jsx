import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * OAuthCallback
 * This page handles the redirect from the backend after Google/GitHub/Facebook login.
 * The backend encodes the user object in the URL query param `?user=...`
 * or an error in `?error=...`
 */
export default function OAuthCallback() {
  const [params] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const userParam = params.get('user');
    const errorParam = params.get('error');

    if (errorParam) {
      setStatus('error');
      setErrorMsg(decodeURIComponent(errorParam));
      setTimeout(() => navigate('/auth'), 3500);
      return;
    }

    if (!userParam) {
      setStatus('error');
      setErrorMsg('Invalid callback. No user data received.');
      setTimeout(() => navigate('/auth'), 3000);
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      if (!user.token || !user.email) throw new Error('Incomplete user data');

      // Store in AuthContext + localStorage
      loginWithToken(user);
      setStatus('success');

      // Redirect based on role
      setTimeout(() => {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'guide') navigate('/guide-dashboard');
        else navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to complete login. Please try again.');
      setTimeout(() => navigate('/auth'), 3000);
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '2rem',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <div style={{ width: 40, height: 40, background: 'var(--grad-teal)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#060b16' }}>
          <Globe size={22} strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Zill<span style={{ color: 'var(--accent-teal)' }}>GO</span>
        </span>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: 380, width: '100%', textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div className="spinner" style={{ width: 48, height: 48, margin: '0 auto 1.5rem', borderWidth: 3 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Signing you in...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Verifying your account, please wait.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: 64, height: 64, background: 'var(--accent-teal-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={36} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Login Successful! 🎉</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Welcome to ZilliGO! Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ width: 64, height: 64, background: 'rgba(244,63,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <AlertCircle size={36} style={{ color: 'var(--accent-rose)' }} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-rose)' }}>Login Failed</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {errorMsg}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/auth')} style={{ width: '100%' }}>
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
