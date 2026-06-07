import { useState } from 'react';
import './CompanyPages.css';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', department: 'general', message: '' });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="company-page page-wrapper">
      <div className="container">
        
        {/* Hero */}
        <div className="company-hero">
          <h1>Contact ZilliGo</h1>
          <p>
            Have a question, partnership inquiry, or technical request? We're here to help you get connected.
          </p>
        </div>

        {/* Contact Block Grid */}
        <div className="company-section company-grid-2">
          
          {/* Info Blocks */}
          <div className="contact-info-block">
            <h2>Get in Touch</h2>
            <p className="text-content">
              Select the appropriate department in our contact form, or write to our team directly. We strive to respond to all inquiries within 24 hours.
            </p>

            <div className="contact-info-item">
              <Mail className="text-teal" size={20} />
              <div>
                <h4>General Inquiries</h4>
                <p>hello@zilligo.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <Mail className="text-teal" size={20} />
              <div>
                <h4>Partnership & Business</h4>
                <p>partnerships@zilligo.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <Phone className="text-teal" size={20} />
              <div>
                <h4>Phone Hotline</h4>
                <p>+1 (800) ZILLIGO (Mon-Fri, 9AM - 5PM EST)</p>
              </div>
            </div>

            <div className="contact-info-item">
              <MapPin className="text-teal" size={20} />
              <div>
                <h4>Global Office Address</h4>
                <p>
                  ZilliGo Technologies Inc.<br />
                  120 University Avenue, Suite 400<br />
                  Toronto, ON M5H 3M7, Canada
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-container">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }} className="animate-fade-in">
                <CheckCircle2 size={48} className="text-teal" style={{ margin: '0 auto 1rem' }} />
                <h3>Message Received!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                  Thank you for reaching out. A ZilliGo representative will respond to your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="input" 
                    required 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="input" 
                    required 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="department">Department</label>
                  <select 
                    id="department" 
                    name="department" 
                    className="input" 
                    value={formData.department}
                    onChange={handleChange}
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="partnerships">Partnerships & Creators</option>
                    <option value="guide-success">Guide Partnerships</option>
                    <option value="press">Media & Press</option>
                    <option value="technical">Technical Support</option>
                    <option value="bizdev">Business Development</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    className="input" 
                    required 
                    rows={5} 
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
