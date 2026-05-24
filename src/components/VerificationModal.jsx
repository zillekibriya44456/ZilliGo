import { useState } from 'react';
import { Upload, CheckCircle, Shield, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './VerificationModal.css';

export default function VerificationModal({ onClose }) {
  const { user, updateUserStatus } = useAuth();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    // Simulate API call for verification
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Success step
      
      // Actually verify the user globally
      updateUserStatus(user.id, { verified: true });
      
      setTimeout(() => {
        onClose();
      }, 2500);
    }, 1500);
  };

  return (
    <div className="vm-overlay">
      <div className="vm-modal glass-card">
        <button className="vm-close" onClick={onClose}><X size={20} /></button>
        
        {step === 1 ? (
          <>
            <div className="vm-header">
              <Shield size={32} style={{ color: 'var(--accent-teal)', marginBottom: '1rem' }} />
              <h2>Verify Your Identity</h2>
              <p>Please upload a valid government-issued ID (Passport, Driver's License, or National ID) to secure your account and book live tours.</p>
            </div>

            <form onSubmit={handleSubmit} className="vm-form">
              <div className="vm-upload-area">
                <input type="file" accept="image/*" onChange={handleUpload} required />
                <div className="vm-upload-content">
                  {file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={32} style={{ color: 'var(--accent-teal)' }} />
                      <strong style={{ color: 'var(--text-primary)' }}>{file}</strong>
                      <span style={{ fontSize: '0.75rem' }}>Click to change file</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ marginTop: '8px', fontWeight: 600 }}>Click to upload or drag & drop</span>
                      <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>PNG, JPG or PDF (max. 10MB)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="vm-actions">
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!file || loading}>
                  {loading ? <div className="spinner" /> : <>Submit for Verification <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="vm-success">
            <div className="vm-success-icon">
              <CheckCircle size={48} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <h2>Verification Complete!</h2>
            <p>Your ID has been successfully verified. You now have full access to book and join live virtual tours securely.</p>
          </div>
        )}
      </div>
    </div>
  );
}
