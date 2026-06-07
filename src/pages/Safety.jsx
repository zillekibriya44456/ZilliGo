import './CompanyPages.css';

export default function Safety() {
  const sections = [
    {
      icon: '🛡️',
      title: 'Traveler Safety',
      items: [
        'ZilliGo connects you only with verified guides who have completed our identity verification process.',
        'All financial transactions happen within the platform. Never pay a guide directly outside of ZilliGo.',
        'Review a guide\'s profile, ratings, and reviews before booking. Look for the Verified badge.',
        'Do not share personal contact information such as phone numbers, home addresses, or financial details in chat messages.',
        'If a guide requests off-platform payment or makes you uncomfortable, report it immediately using the in-session report button.',
        'All live sessions are initiated through secure, encrypted video connections. You control your own camera and microphone.',
      ]
    },
    {
      icon: '🎙️',
      title: 'Guide Safety',
      items: [
        'You are never required to share your personal contact information with travelers. Use the platform\'s messaging system.',
        'If a traveler is abusive, threatening, or violating guidelines, end the session and report the user immediately.',
        'Do not accept payments outside the ZilliGo platform. All earnings are processed securely through our payment partner.',
        'Your physical home address is never shared with travelers. Only your general city and region are visible on your profile.',
        'ZilliGo\'s support team investigates all guide safety reports and takes appropriate action.',
        'If you feel unsafe or threatened during any interaction, contact local authorities if necessary and then report to ZilliGo.',
      ]
    },
    {
      icon: '🎬',
      title: 'Creator Safety',
      items: [
        'Only post content that you have created or have explicit permission to share.',
        'Do not include personal identifying information in your publicly posted content that could compromise your safety.',
        'If your content is used without permission, use our DMCA reporting process to request removal.',
        'Creators should not accept direct payments outside ZilliGo\'s monetization system.',
        'You control who can comment on your content. Use moderation tools to manage your creator space.',
        'Report any coordinated harassment or abuse targeting your creator account to our Trust & Safety team.',
      ]
    },
    {
      icon: '📹',
      title: 'Virtual Tour Safety',
      items: [
        'Never record, screenshot, or distribute live tour sessions without the guide\'s explicit consent.',
        'Virtual tours are private sessions between booked participants. Do not share session links with non-participants.',
        'ZilliGo guides are not responsible for decisions you make based on information shared during a virtual tour.',
        'Children under 13 should not attend virtual tours without parental supervision.',
        'If inappropriate content is shared during a live session, leave immediately and report the incident.',
        'Our platform monitors for patterns of policy-violating behavior and takes action against repeat offenders.',
      ]
    },
    {
      icon: '💬',
      title: 'Communication Safety',
      items: [
        'Use only ZilliGo\'s built-in messaging system to communicate with guides and travelers before bookings.',
        'Never share passwords, financial information, or government ID numbers through the chat system.',
        'Be skeptical of any message asking you to move communication off-platform.',
        'ZilliGo staff will never ask for your password or payment details through chat.',
        'You can block any user from messaging you through your privacy settings.',
        'All reported messages are reviewed by our Trust & Safety team.',
      ]
    },
    {
      icon: '🔐',
      title: 'Account Protection',
      items: [
        'Use a strong, unique password for your ZilliGo account.',
        'Enable two-factor authentication (coming soon) for additional account security.',
        'Do not use the same password across multiple websites.',
        'Log out of ZilliGo when using shared or public devices.',
        'ZilliGo will never send unsolicited emails asking for your password. Any such email is a phishing attempt — report it.',
        'If you suspect your account has been compromised, change your password immediately and contact support.',
      ]
    },
    {
      icon: '🚨',
      title: 'Reporting Abuse',
      items: [
        'Use the "Report" button available on every user profile, guide listing, and live session.',
        'Report content that violates our Community Guidelines using the flag icon.',
        'For urgent safety concerns during a live session, use the in-session emergency report option.',
        'Email serious safety concerns to safety@zilligo.com.',
        'All reports are confidential. The reported user will not be told who reported them.',
        'Our Trust & Safety team reviews all reports within 24 hours. Severe cases are prioritized.',
      ]
    },
    {
      icon: '🌍',
      title: 'Community Trust',
      items: [
        'Our guide verification system includes identity document review and profile validation.',
        'Reviews and ratings are only submitted by users who have completed a booking.',
        'We investigate and remove fake, biased, or manipulated reviews.',
        'Guides with persistent safety violations are permanently removed from the platform.',
        'ZilliGo maintains a zero-tolerance policy for discrimination based on race, gender, nationality, religion, or disability.',
        'Trust is the foundation of the ZilliGo community. We continuously improve our safety systems based on user feedback.',
      ]
    },
  ];

  return (
    <div className="company-page page-wrapper">
      <div className="container">

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>🛡️ Safety</div>
          <h1>Safety Guidelines</h1>
          <p>ZilliGo is built on trust. Our safety guidelines exist to protect every member of our community — travelers, guides, and creators alike.</p>
        </div>

        {/* Emergency Banner */}
        <div style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🚨</span>
          <div>
            <strong style={{ color: '#FB7185' }}>Immediate Safety Concern?</strong>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
              If you are in immediate danger, contact your local emergency services first.
              Then email <a href="mailto:safety@zilligo.com" style={{ color: '#FB7185' }}>safety@zilligo.com</a> to report the incident to our team.
            </p>
          </div>
        </div>

        <div className="company-grid-2">
          {sections.map((section, i) => (
            <div key={i} className="company-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{section.icon}</div>
              <h3>{section.title}</h3>
              <ul className="company-list" style={{ marginTop: '0.75rem' }}>
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Commitment */}
        <div className="company-section" style={{ marginTop: '3rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.6rem' }}>Our Safety Commitment</h2>
            <p style={{ maxWidth: 600, margin: '1rem auto', color: 'var(--text-secondary)' }}>
              ZilliGo's Trust & Safety team works continuously to maintain a safe, respectful, and trustworthy platform for all users. We invest in moderation technology, human review systems, and community reporting tools to ensure everyone can explore the world safely.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <a href="mailto:safety@zilligo.com" className="btn btn-primary">Report Safety Issue</a>
              <a href="/trust-safety" className="btn btn-secondary">Trust & Safety Center</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
