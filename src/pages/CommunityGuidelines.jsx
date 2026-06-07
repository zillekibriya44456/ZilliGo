import './CompanyPages.css';

export default function CommunityGuidelines() {
  const sections = [
    {
      icon: '🤝',
      title: 'Respectful Conduct',
      content: 'ZilliGo is a global community that celebrates diversity and human connection. All users — travelers, guides, and creators — are expected to treat each other with dignity and respect. Rude, dismissive, or contemptuous behavior toward other community members is not acceptable, even if it does not constitute harassment.'
    },
    {
      icon: '🚫',
      title: 'Harassment Policy',
      content: 'We have zero tolerance for harassment of any kind. This includes repeatedly sending unwanted messages, making threatening or intimidating comments, coordinating group attacks on a user\'s content or profile, pressuring users to communicate off-platform, or any behavior intended to distress another person. Harassment reports result in immediate investigation and may lead to permanent account removal.'
    },
    {
      icon: '❌',
      title: 'Hate Speech Policy',
      content: 'Content or behavior that attacks, degrades, or dehumanizes individuals or groups based on race, ethnicity, national origin, religion, gender, gender identity, sexual orientation, disability, age, or any other protected characteristic is strictly prohibited. This includes slurs, stereotypes used to demean groups, and content designed to incite hatred. Cultural discussion and education are welcome; dehumanization is not.'
    },
    {
      icon: '📧',
      title: 'Spam & Solicitation',
      content: 'Do not send unsolicited promotional messages, bulk messages, or repeated identical messages to other users. Do not use ZilliGo to advertise services or products unrelated to the platform. Do not recruit users to other platforms or services through ZilliGo\'s messaging system. Off-platform solicitation for payments or bookings is prohibited and may result in permanent suspension.'
    },
    {
      icon: '👤',
      title: 'Authentic Identity',
      content: 'You must represent yourself honestly on ZilliGo. Creating fake profiles, impersonating real individuals (including public figures, guides, or ZilliGo staff), or misrepresenting your credentials, location, or qualifications is strictly prohibited. Guides must not create fake reviews or ratings for their own profiles. Misleading profile content will result in removal and potential permanent ban.'
    },
    {
      icon: '📰',
      title: 'Accurate Information',
      content: 'Guides and creators must provide accurate, truthful information in their profiles, tour descriptions, and content. Do not make false claims about destinations, experiences, cultural facts, or safety conditions. Do not advertise features or inclusions in a tour that are not actually provided. Inaccurate information that materially misleads travelers may result in refund obligations and account penalties.'
    },
    {
      icon: '🔞',
      title: 'Adult Content Policy',
      content: 'ZilliGo is a family-accessible platform. Sexually explicit content, nudity, or adult material of any kind is strictly prohibited in all areas of the platform — including profile photos, tour descriptions, live session content, and messages. Content that sexualizes minors in any way will result in immediate account termination and reporting to relevant authorities.'
    },
    {
      icon: '⚔️',
      title: 'Violence & Dangerous Content',
      content: 'Content that depicts, glorifies, or promotes real-world violence, self-harm, dangerous activities, or illegal acts is not permitted. This applies to tour content, messages, profile material, and any other Platform area. Threats of violence against any individual or group — even if expressed as jokes — are taken seriously and investigated immediately.'
    },
    {
      icon: '💸',
      title: 'Scams & Fraud',
      content: 'ZilliGo has zero tolerance for financial fraud. This includes requesting payment outside the platform, creating fake bookings to manipulate earnings or reviews, chargebacks on completed legitimate services, and any attempt to deceive other users for financial gain. Fraudulent activity is reported to relevant authorities in addition to platform-level enforcement.'
    },
    {
      icon: '📣',
      title: 'Reporting Abuse',
      content: 'Every profile, tour listing, message, and review on ZilliGo has a "Report" option. Use it to flag content or behavior that violates these guidelines. All reports are confidential and reviewed by our Trust & Safety team within 24 hours. For urgent safety issues, email safety@zilligo.com. False or malicious reports designed to harm other users are themselves a violation of these guidelines.'
    },
  ];

  const enforcements = [
    { icon: '⚠️', level: 'Warning', desc: 'First-time minor violations receive a formal warning with an explanation of the violated guideline.' },
    { icon: '🔇', level: 'Content Removal', desc: 'Violating content is removed. The user is notified and given an opportunity to understand the violation.' },
    { icon: '⏸️', level: 'Temporary Suspension', desc: 'Repeated violations or moderate offenses result in a temporary account suspension (1-30 days).' },
    { icon: '🚫', level: 'Permanent Ban', desc: 'Severe violations, including harassment, fraud, hate speech, and illegal content, result in permanent account removal.' },
    { icon: '🏛️', level: 'Legal Referral', desc: 'Illegal activities including content that sexualizes minors, fraud, and credible threats are reported to relevant authorities.' },
  ];

  return (
    <div className="company-page page-wrapper">
      <div className="container">

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>🌍 Community</div>
          <h1>Community Guidelines</h1>
          <p>ZilliGo connects people across cultures and continents. These guidelines ensure our community remains safe, respectful, and welcoming for everyone.</p>
        </div>

        {/* Intro */}
        <div className="company-section">
          <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-teal)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0, lineHeight: 1.8 }}>
              These Community Guidelines apply to all users of ZilliGo, including travelers, guides, creators, and visitors. By using the platform, you agree to follow these standards. Violations may result in content removal, account suspension, or permanent ban — depending on severity. Our Trust & Safety team reviews all reports and has final discretion over enforcement decisions.
            </p>
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="company-section">
          <div className="company-grid-2">
            {sections.map((s, i) => (
              <div key={i} className="company-card">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enforcement */}
        <div className="company-section">
          <h2>Enforcement Actions</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Our Trust & Safety team applies the following enforcement framework, with severity determined by the nature and frequency of violations:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enforcements.map((e, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                padding: '1.25rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{e.icon}</span>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{e.level}</strong>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appeals */}
        <div className="company-section">
          <h2>Appeals Process</h2>
          <p>If you believe an enforcement action was applied in error, you may appeal by emailing <a href="mailto:appeals@zilligo.com" style={{ color: 'var(--accent-teal)' }}>appeals@zilligo.com</a> within 30 days of the action. Include your account email, the specific action you are appealing, and your explanation. Our team will review your appeal and respond within 5-7 business days.</p>
          <p>Appeals are reviewed by a different member of the Trust & Safety team than the one who made the original decision.</p>
        </div>

        {/* Contact */}
        <div className="company-section">
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>See something that violates these guidelines?</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
              Report it using the in-platform report button, or email our safety team directly.
            </p>
            <a href="mailto:safety@zilligo.com" className="btn btn-primary">Report Violation</a>
          </div>
        </div>

      </div>
    </div>
  );
}
