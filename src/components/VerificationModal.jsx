import { useState } from 'react';
import { Upload, CheckCircle, Shield, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './VerificationModal.css';

export default function VerificationModal({ onClose }) {
  const { user, updateUserStatus } = useAuth();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);
  const [selfie, setSelfie] = useState(false);
  const [loading, setLoading] = useState(false);
  const [livenessState, setLivenessState] = useState('idle'); // idle, scanning, success

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0].name);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && !docType) return;
    if (step === 2 && !file) return;
    
    if (step === 3) {
      // Start Liveness Simulation
      setLivenessState('scanning');
      setTimeout(() => setLivenessState('success'), 2000);
      setTimeout(() => {
        setSelfie(true);
      }, 2500);
      return;
    }

    if (step === 4) {
      setLoading(true);
      // Simulate AI AI OCR & Face Matching
      setTimeout(() => {
        setLoading(false);
        setStep(5); // Success step
        updateUserStatus(user.id, { verified: true });
        setTimeout(() => onClose(), 2500);
      }, 2500);
      return;
    }

    setStep(step + 1);
  };

  return (
    <div className="vm-overlay">
      <div className="vm-modal glass-card" style={{ maxWidth: '500px' }}>
        <button className="vm-close" onClick={onClose}><X size={20} /></button>
        
        {step === 1 && (
          <>
            <div className="vm-header">
              <Shield size={32} style={{ color: 'var(--accent-teal)', marginBottom: '1rem' }} />
              <h2>Verify Your Identity</h2>
              <p>Select the type of official government document you wish to upload.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
              {['Passport', 'National ID Card', 'Driver\'s License'].map(type => (
                <button key={type} onClick={() => setDocType(type)} className={`btn ${docType === type ? 'btn-primary' : 'btn-ghost'}`} style={{ border: '1px solid var(--border-glass-strong)' }}>
                  {type}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!docType} onClick={handleNext}>Continue</button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="vm-header">
              <h2>Upload {docType}</h2>
              <p>Ensure all text is clearly visible and there is no glare.</p>
            </div>
            <div className="vm-upload-area" style={{ margin: '20px 0' }}>
              <input type="file" accept="image/*" onChange={handleUpload} required />
              <div className="vm-upload-content">
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={32} style={{ color: 'var(--accent-teal)' }} />
                    <strong style={{ color: 'var(--text-primary)' }}>{file}</strong>
                  </div>
                ) : (
                  <>
                    <Upload size={32} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ marginTop: '8px', fontWeight: 600 }}>Upload Front of Document</span>
                  </>
                )}
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!file} onClick={handleNext}>Continue to Liveness Check</button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="vm-header">
              <h2>Face Verification</h2>
              <p>We need to match your face to your {docType} to prevent fraud.</p>
            </div>
            <div style={{ background: '#000', borderRadius: '12px', height: '250px', margin: '20px 0', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {livenessState === 'idle' && <span style={{ color: '#fff' }}>Camera Ready. Position your face in the oval.</span>}
               {livenessState === 'scanning' && <div className="spinner" style={{ borderColor: 'var(--accent-teal)', borderTopColor: 'transparent', width: '50px', height: '50px' }} />}
               {livenessState === 'success' && <CheckCircle size={64} style={{ color: 'var(--accent-teal)' }} />}
               <div style={{ position: 'absolute', inset: '10%', border: `2px dashed ${livenessState === 'success' ? 'var(--accent-teal)' : 'var(--text-muted)'}`, borderRadius: '50%' }} />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleNext} disabled={selfie}>
              {selfie ? 'Selfie Captured' : 'Start Liveness Scan'}
            </button>
            {selfie && <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }} onClick={() => setStep(4)}>Submit for AI Verification</button>}
          </>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ width: '60px', height: '60px', margin: '0 auto 20px', borderColor: 'var(--accent-purple)' }} />
            <h2>Analyzing Documents...</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Our AI is extracting OCR data and matching your biometric vectors. This takes a few seconds.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px', textAlign: 'left', background: 'var(--bg-glass)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ color: 'var(--accent-teal)' }}>✓ Document Authenticity Confirmed</div>
              <div style={{ color: 'var(--accent-teal)' }}>✓ OCR Extraction Complete</div>
              <div style={{ color: 'var(--accent-teal)' }}>✓ 98.4% Face Match Confidence</div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="vm-success" style={{ textAlign: 'center' }}>
            <div className="vm-success-icon" style={{ margin: '0 auto 20px' }}>
              <CheckCircle size={64} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <h2>Verification Approved!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>You are now a Verified ZilliGO User. Your Trust Score has been initialized.</p>
          </div>
        )}
      </div>
    </div>
  );
}
