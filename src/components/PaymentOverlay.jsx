import { useState } from 'react';
import { Shield, CreditCard, Lock, CheckCircle, ArrowRight, X, Smartphone, Globe, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './PaymentOverlay.css';

export default function PaymentOverlay({ amount, onPaymentSuccess, onClose, tourId, booking }) {
  const { user } = useAuth();
  const [method, setMethod] = useState('card'); // card, upi, paypal, razorpay
  const [step, setStep] = useState('input'); // input, processing, success
  const [cardName, setCardName] = useState('');
  const [error, setError] = useState('');

  const triggerConfirmPayment = async (paymentMethod, transactionId) => {
    try {
      if (booking?.id) {
        await api.confirmPayment({
          bookingId: booking.id,
          paymentMethod,
          amount,
          transactionId: transactionId || `TXN_${Date.now()}`
        });
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPay = async () => {
    setStep('processing');
    setError('');

    try {
      if (!booking?.id) {
        throw new Error('No active booking found for checkout.');
      }

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Are you offline?');
      }

      const order = await api.createRazorpayOrder({
        bookingId: booking.id
      });

      if (!order || !order.id) {
        // Safe check for production vs development/demo modes
        if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
          throw new Error('Unable to initialize payment gateway.');
        }
        
        console.warn('Razorpay order creation returned placeholder response. Triggering development mock fallback.');
        setTimeout(async () => {
          await triggerConfirmPayment('razorpay', `MOCK_${Date.now()}`);
          setStep('success');
          setTimeout(() => {
            onPaymentSuccess();
          }, 1500);
        }, 2500);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'ZilliGo',
        description: 'Virtual Tour Booking',
        order_id: order.id,
        handler: async function (response) {
          setStep('processing');
          try {
            const verifyResult = await api.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResult.status === 'success') {
              setStep('success');
              setTimeout(() => {
                onPaymentSuccess();
              }, 1500);
            } else {
              setError('Payment verification failed: signature invalid.');
              setStep('input');
            }
          } catch (err) {
            setError('Error verifying payment on backend.');
            setStep('input');
          }
        },
        prefill: {
          name: user?.name || 'Guest User',
          email: user?.email || 'guest@zilligo.com',
        },
        theme: {
          color: '#00F5D4',
        },
        modal: {
          ondismiss: function () {
            setStep('input');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
        setError(err.message || 'Payment initiation failed.');
        setStep('input');
        return;
      }

      console.warn('Fallback mock payment handler triggered due to error:', err);
      setTimeout(async () => {
        await triggerConfirmPayment('razorpay', `MOCK_${Date.now()}`);
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      }, 2500);
    }
  };

  const handlePay = (e) => {
    if (e) e.preventDefault();
    if (method === 'razorpay') {
      handleRazorpayPay();
      return;
    }
    setStep('processing');
    setTimeout(async () => {
      await triggerConfirmPayment(method, `CARD_${Date.now()}`);
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="payment-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="payment-modal glass-card animate-bounce-in">
        <div className="payment-header">
          <div className="payment-header-title">
            <h3>Secure Checkout</h3>
            <p>ZilliGO Payment Protection Active</p>
          </div>
          <button className="payment-close" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div className="payment-error-banner">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        {step === 'input' && (
          <div className="payment-body">
            <div className="payment-summary">
              <div className="summary-label">Amount to Pay</div>
              <div className="summary-value">${amount.toFixed(2)}</div>
            </div>

            {/* Payment Method Tabs */}
            <div className="payment-tabs">
              <button className={`tab-btn ${method === 'card' ? 'active' : ''}`} onClick={() => setMethod('card')}>
                <CreditCard size={14} /> Cards
              </button>
              <button className={`tab-btn ${method === 'upi' ? 'active' : ''}`} onClick={() => setMethod('upi')}>
                <Smartphone size={14} /> UPI
              </button>
              <button className={`tab-btn ${method === 'paypal' ? 'active' : ''}`} onClick={() => setMethod('paypal')}>
                <Globe size={14} /> PayPal
              </button>
              <button className={`tab-btn ${method === 'razorpay' ? 'active' : ''}`} onClick={() => setMethod('razorpay')}>
                <span className="razor-logo">R</span> Razorpay
              </button>
            </div>

            {/* Method Content */}
            <div className="method-content">
              {method === 'card' && (
                <form className="payment-form" onSubmit={handlePay}>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input type="text" className="input" placeholder="Name on Card" required value={cardName} onChange={(e) => setCardName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <div className="input-with-icon">
                      <CreditCard size={16} />
                      <input type="text" className="input" placeholder="4242 4242 4242 4242" required />
                    </div>
                  </div>
                  <div className="grid-2">
                    <input type="text" className="input" placeholder="MM/YY" required />
                    <input type="password" className="input" placeholder="CVV" required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>
                    Pay Securely <ArrowRight size={18} />
                  </button>
                </form>
              )}

              {method === 'upi' && (
                <div className="upi-content">
                  <div className="upi-qr-placeholder">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ZilliGO-Payment" alt="UPI QR" />
                    <p>Scan with Google Pay, PhonePe, or Paytm</p>
                  </div>
                  <div className="divider">OR ENTER VPA</div>
                  <input type="text" className="input" placeholder="username@upi" />
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handlePay}>
                    Verify & Pay
                  </button>
                </div>
              )}

              {method === 'paypal' && (
                <div className="paypal-content">
                  <div className="paypal-btn-mock">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '24px' }} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                    You'll be redirected to PayPal to complete your purchase safely.
                  </p>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#0070ba' }} onClick={handlePay}>
                    Continue to PayPal
                  </button>
                </div>
              )}

              {method === 'razorpay' && (
                <div className="razorpay-content">
                  <div className="razor-badge">
                    <span className="razor-logo">R</span> Razorpay Trusted
                  </div>
                  <p style={{ textAlign: 'center', margin: '1rem 0' }}>All Indian payment methods (Netbanking, UPI, Wallets) supported.</p>
                  <button className="btn btn-primary" style={{ width: '100%', background: '#3399cc' }} onClick={handlePay}>
                    Pay with Razorpay
                  </button>
                </div>
              )}
            </div>

            <div className="payment-trust-badge">
              <Lock size={12} /> <span>SSL Secure | PCI DSS | 256-bit Encryption</span>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="payment-processing">
            <div className="spinner" />
            <p>Authorizing through {method.toUpperCase()}...</p>
            <div className="payment-trust">
              <Shield size={16} /> Payment Protected by ZilliGO
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="payment-success animate-fade-in">
            <div className="payment-success-icon"><CheckCircle size={48} /></div>
            <h4>Payment Successful!</h4>
            <p>Confirmation ID: ZG-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
