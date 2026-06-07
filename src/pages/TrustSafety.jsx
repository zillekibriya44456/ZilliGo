import './CompanyPages.css';

export default function TrustSafety() {
  const verificationSteps = [
    { step: '01', title: 'Identity Submission', desc: 'Guides submit a government-issued photo ID and a recent selfie for automated biometric verification.' },
    { step: '02', title: 'Profile Review', desc: 'Our onboarding team manually reviews profile information, tour descriptions, and qualifications for accuracy.' },
    { step: '03', title: 'Test Session', desc: 'New guides may be asked to complete a brief orientation session to confirm language skills and professionalism.' },
    { step: '04', title: 'Verified Badge', desc: 'Approved guides receive the ZilliGo Verified badge on their profile, visible to all travelers.' },
    { step: '05', title: 'Ongoing Monitoring', desc: 'Verified status is maintained through consistent ratings, no major policy violations, and periodic profile reviews.' },
  ];

  const protections = [
    { icon: '🔐', title: 'Encrypted Payments', desc: 'All financial transactions are handled by PCI-compliant payment partners. ZilliGo never stores card details.' },
    { icon: '🚨', title: 'Real-Time Reporting', desc: 'Every profile, message, review, and live session includes an instant report button connected to our safety team.' },
    { icon: '🤖', title: 'Automated Detection', desc: 'Our systems automatically flag suspicious patterns including spam, fake reviews, and potential fraud attempts.' },
    { icon: '👁️', title: 'Human Review', desc: 'All serious reports are reviewed by a human Trust & Safety specialist, not just automated systems.' },
    { icon: '🔒', title: 'Secure Messaging', desc: 'In-platform messaging keeps personal contact details private until both parties choose to share them.' },
    { icon: '⭐', title: 'Verified Reviews', desc: 'Reviews can only be left by users who completed a legitimate booking. No anonymous or unverified reviews.' },
    { icon: '🛑', title: 'Instant Content Removal', desc: 'Content that violates our policies is removed promptly following review. Appeals are available within 30 days.' },
    { icon: '🌐', title: 'Global Compliance', desc: 'We comply with GDPR, applicable data protection laws, and platform safety standards for our global user base.' },
  ];

  return (
    <div className="company-page page-wrapper">
      <div className="container">

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>🛡️ Trust & Safety</div>
          <h1>Trust & Safety Center</h1>
          <p>ZilliGo's Trust & Safety infrastructure is designed to make every interaction safe, transparent, and trustworthy for travelers, guides, and creators worldwide.</p>
        </div>

        {/* Trust Stats */}
        <div className="company-section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {[
              { value: '< 24h', label: 'Report Review Time' },
              { value: '100%', label: 'Verified Guide Checks' },
              { value: '7 Days', label: 'Support Availability' },
              { value: '0 Tolerance', label: 'Policy on Harassment' },
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-teal)', marginBottom: '0.5rem' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Guide Verification */}
        <div className="company-section">
          <h2>Guide Verification Process</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Every guide on ZilliGo undergoes a multi-step verification process before they can host tours. Look for the <strong style={{ color: 'var(--accent-teal)' }}>✓ Verified</strong> badge on guide profiles.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {verificationSteps.map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
                padding: '1.25rem 1.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--accent-teal-glow)',
                  border: '2px solid rgba(0,212,170,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-teal)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>{s.step}</div>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{s.title}</strong>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protection Features */}
        <div className="company-section">
          <h2>How We Protect You</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Our safety infrastructure includes both automated systems and dedicated human review to ensure a trustworthy platform.</p>
          <div className="company-grid-2">
            {protections.map((p, i) => (
              <div key={i} className="company-card">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reporting */}
        <div className="company-section">
          <h2>Reporting Tools</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Reporting is easy and confidential. Here is how to report different types of issues:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '👤', label: 'Report a User', how: 'Click the ⋮ menu on any profile or message, then select "Report"' },
              { icon: '🎥', label: 'Report a Live Session', how: 'Click the flag icon in the session toolbar during any active live tour' },
              { icon: '⭐', label: 'Report a Review', how: 'Click "Report Review" below any review you believe violates our guidelines' },
              { icon: '📝', label: 'Report a Tour Listing', how: 'Click "Report this Tour" on any tour detail page' },
              { icon: '💬', label: 'Report a Message', how: 'In the messages section, click the flag icon next to any specific message' },
              { icon: '📧', label: 'Email Safety Team', how: 'Send details to safety@zilligo.com for complex or urgent issues' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '1.25rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px', fontSize: '0.95rem' }}>{item.label}</strong>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.how}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Moderation */}
        <div className="company-section">
          <h2>Content Review Process</h2>
          <div className="company-grid-2">
            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Automated Review</h3>
              <ul className="company-list">
                <li>Spam and bulk messaging detection</li>
                <li>Known prohibited content hash matching</li>
                <li>Unusual account activity flagging</li>
                <li>Fraudulent payment pattern detection</li>
                <li>Fake review pattern identification</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Human Review</h3>
              <ul className="company-list">
                <li>All user-submitted reports reviewed manually</li>
                <li>Complex harassment and abuse cases</li>
                <li>Appeal decisions on enforcement actions</li>
                <li>Guide onboarding verification review</li>
                <li>Legal and law enforcement requests</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Safety Commitment */}
        <div className="company-section">
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.04))' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.6rem', marginBottom: '1rem' }}>Our Safety Promise</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: 1.8 }}>
              ZilliGo is committed to continuous improvement of our safety infrastructure. We listen to user feedback, monitor emerging threats, invest in safety technology, and hold ourselves accountable for maintaining a platform our global community can trust.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:safety@zilligo.com" className="btn btn-primary">Contact Safety Team</a>
              <a href="/community-guidelines" className="btn btn-secondary">Read Community Guidelines</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
