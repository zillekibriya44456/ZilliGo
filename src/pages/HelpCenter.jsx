import { useState } from 'react';
import './CompanyPages.css';

const FAQS = [
  {
    category: '🔐 Login & Account',
    items: [
      { q: 'How do I create a ZilliGo account?', a: 'Click "Sign Up" on the top navigation bar. You can register with your email address or sign in using your Google account. Fill in your name, email, and password, then choose your role (Traveler, Guide, or Creator) to get started.' },
      { q: 'I forgot my password. How do I reset it?', a: 'Click "Sign In", then select "Forgot Password". Enter your registered email address and we will send you a secure password reset link. The link expires after 60 minutes for security reasons.' },
      { q: 'Why is my login not working?', a: 'First, double-check your email and password. Make sure Caps Lock is not enabled. If you signed up using Google login, try clicking "Continue with Google" instead of entering a password. If you continue to have issues, contact support@zilligo.com.' },
      { q: 'Can I change my email address?', a: 'Yes. Go to your Account Settings, navigate to Profile, and update your email. You will need to verify the new email address before the change takes effect.' },
      { q: 'How do I delete my account?', a: 'Go to Account Settings → Privacy → Delete Account. Deletion is permanent and most data is removed within 30 days. Some transaction records may be retained for legal compliance. See our Account Deletion Policy for details.' },
    ]
  },
  {
    category: '🎥 Tours & Bookings',
    items: [
      { q: 'How does booking a virtual tour work?', a: 'Browse tours on the Explore page, select a tour you like, choose your date and time slot, add the number of guests, and click "Instant Book". Complete payment via Razorpay. Your guide will be notified immediately and you will receive a booking confirmation.' },
      { q: 'What is the difference between Live Tours and Recorded Tours?', a: 'Live Tours are real-time sessions with a local guide via HD video. You can ask questions and interact with your guide. Recorded Tours are pre-filmed experiences you can watch at any time at your own pace.' },
      { q: 'Can I cancel a booking? What is the refund policy?', a: 'Cancellations made more than 24 hours before the scheduled tour are eligible for a full refund. Cancellations within 24 hours may receive a partial refund depending on the guide\'s cancellation policy. No-shows are generally non-refundable.' },
      { q: 'What if my guide does not show up?', a: 'If your guide fails to start the session within 15 minutes of the scheduled time without prior notice, you are entitled to a full refund. Contact support@zilligo.com within 24 hours of the missed session.' },
      { q: 'How do I join a live tour session?', a: 'Go to your Dashboard, find your upcoming booking, and click "Join Tour" at the scheduled time. You will need a stable internet connection and a device with camera and microphone access.' },
      { q: 'Can I request a custom private tour?', a: 'Yes! Many guides offer private bookings. On a guide\'s profile page, click "Request Private Tour" and send a message describing your interests, group size, and preferred dates.' },
    ]
  },
  {
    category: '👤 Guide Questions',
    items: [
      { q: 'How do I become a guide on ZilliGo?', a: 'Click "Become a Guide" in the navigation or visit zilligo.com/become-guide. Complete the application form, submit your identity verification, create your first tour listing, and set your availability. Our team reviews applications within 3-5 business days.' },
      { q: 'How much can I earn as a guide?', a: 'Guides keep 85% of each booking fee. Earnings vary based on your tour price, availability, ratings, and demand. Top guides on ZilliGo earn on average $2,800/month. You set your own prices.' },
      { q: 'How and when do I get paid?', a: 'Earnings are processed 48 hours after tour completion to allow for potential disputes. Payouts are sent weekly to your registered bank account or payment method via our payment partner. Minimum payout threshold is $10.' },
      { q: 'What happens if a traveler cancels?', a: 'If a traveler cancels more than 24 hours in advance, the booking is simply removed. If they cancel within 24 hours or are a no-show, you may be eligible for a partial compensation payment. Contact support for details.' },
      { q: 'Can I offer tours in multiple cities or locations?', a: 'Yes! You can create multiple tour listings for different locations and categories. Many of our top guides offer tours in their home city plus nearby areas they know well.' },
    ]
  },
  {
    category: '💳 Payments & Billing',
    items: [
      { q: 'What payment methods does ZilliGo accept?', a: 'We accept major credit and debit cards (Visa, Mastercard, American Express), UPI, net banking, and digital wallets through our payment partner Razorpay. Available methods may vary by country.' },
      { q: 'Is my payment information secure?', a: 'Yes. All payment processing is handled by Razorpay, a PCI DSS-compliant payment provider. ZilliGo never stores your full card number or banking credentials on our servers.' },
      { q: 'I was charged but did not receive a confirmation. What should I do?', a: 'First, check your email spam folder for the confirmation. If you still cannot find it, log into your dashboard and check the "My Bookings" section. If the booking does not appear, contact support@zilligo.com with your payment reference number.' },
      { q: 'How do I request a refund?', a: 'Refund requests can be made by contacting support@zilligo.com with your booking ID and reason for the refund. Eligible refunds are processed within 5-7 business days and will appear on your original payment method.' },
    ]
  },
  {
    category: '🌍 Creator Questions',
    items: [
      { q: 'How do I become a content creator on ZilliGo?', a: 'Apply through your account settings or the Creator Center page. Submit your portfolio and content samples. Our Creator team reviews applications and provides access to creator tools including upload, monetization, and analytics features.' },
      { q: 'What kind of content can creators post?', a: 'Creators can post travel vlogs, destination guides, cultural explainers, local tips, photography tours, food and cuisine content, and educational cultural videos. All content must comply with our Content Policy and Community Guidelines.' },
      { q: 'How do creators earn on ZilliGo?', a: 'Creators can earn through content monetization (ad revenue share), sponsored content partnerships, virtual tip jars from engaged viewers, and promoting their own tour bookings. Creator monetization tools are rolling out progressively.' },
    ]
  },
  {
    category: '⚙️ Technical Support',
    items: [
      { q: 'The video stream is lagging or choppy. What can I do?', a: 'Check your internet connection speed (minimum 5 Mbps recommended for live tours). Close other browser tabs and bandwidth-heavy applications. Try refreshing the page. If the issue persists, contact your guide to reschedule or contact support.' },
      { q: 'The platform is not loading correctly. What should I do?', a: 'Clear your browser cache and cookies, then reload the page. Try a different browser or device. Make sure your browser is up to date. If the issue continues, report it to support@zilligo.com including your browser version and a description of the problem.' },
      { q: 'How do I report a bug or technical issue?', a: 'Use the support widget (bottom right corner) to report issues while using the platform, or email support@zilligo.com. Include as much detail as possible: what you were doing, what happened, and any error messages you saw.' },
    ]
  },
];

export default function HelpCenter() {
  const [openItem, setOpenItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredFAQs = FAQS.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section =>
    (activeCategory === null || section.category === activeCategory) &&
    section.items.length > 0
  );

  return (
    <div className="company-page page-wrapper">
      <div className="container">

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>💡 Help Center</div>
          <h1>How Can We Help You?</h1>
          <p>Find answers to common questions about ZilliGo tours, bookings, accounts, and more.</p>
          <div style={{ marginTop: '2rem', maxWidth: 520, margin: '2rem auto 0' }}>
            <div className="input-group">
              <span style={{ color: 'var(--text-muted)', padding: '0 0.5rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveCategory(null)}
            className={`btn btn-sm ${activeCategory === null ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Topics
          </button>
          {FAQS.map(section => (
            <button
              key={section.category}
              onClick={() => setActiveCategory(activeCategory === section.category ? null : section.category)}
              className={`btn btn-sm ${activeCategory === section.category ? 'btn-primary' : 'btn-secondary'}`}
            >
              {section.category}
            </button>
          ))}
        </div>

        {/* FAQ Sections */}
        {filteredFAQs.length === 0 ? (
          <div className="company-section" style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No results found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try a different search term or contact our support team directly.</p>
            <a href="mailto:support@zilligo.com" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Contact Support
            </a>
          </div>
        ) : (
          filteredFAQs.map((section, si) => (
            <div key={si} className="company-section">
              <h2>{section.category}</h2>
              <div className="support-accordion">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={ii} className="accordion-item">
                      <div
                        className="accordion-header"
                        onClick={() => setOpenItem(isOpen ? null : key)}
                      >
                        <span>{item.q}</span>
                        <span style={{ color: 'var(--accent-teal)', fontSize: '1.2rem', flexShrink: 0 }}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </div>
                      {isOpen && (
                        <div className="accordion-body">{item.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Contact Banner */}
        <div className="company-section">
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.04))' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Still need help?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
              Our support team is available 7 days a week to help you with any questions.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:support@zilligo.com" className="btn btn-primary">Email Support</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
              Average response time: under 24 hours
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
