import './CompanyPages.css';

export default function Privacy() {
  return (
    <div className="company-page page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>🔒 Legal</div>
          <h1>Privacy Policy</h1>
          <p>Last Updated: June 7, 2026 · Effective Date: June 7, 2026</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>Your privacy matters to us. This policy explains exactly what information ZilliGo collects, how we use it, and the rights you have over your personal data.</p>
        </div>

        <div className="company-section legal-text">

          <h2>1. Introduction</h2>
          <p>Welcome to ZilliGo ("we", "our", "us", or "the Platform"). ZilliGo is a global virtual tourism platform that connects travelers with local guides and cultural creators for live and on-demand virtual experiences.</p>
          <p>This Privacy Policy describes how we collect, use, share, and protect your personal information when you use our website, mobile applications, and related services (collectively, the "Services"). By using ZilliGo, you agree to the practices described in this policy.</p>
          <p>If you do not agree to this Privacy Policy, please discontinue use of the Platform.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect information to provide, improve, and personalize our Services. The categories of information we collect include:</p>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>2.1 Account Information</h3>
          <ul>
            <li>Full name and display name</li>
            <li>Email address</li>
            <li>Password (stored as encrypted hash — never in plaintext)</li>
            <li>Profile photograph or avatar</li>
            <li>User role (Traveler, Guide, Creator, or Admin)</li>
            <li>Social login identifiers when signing in via Google, LinkedIn, or other OAuth providers</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>2.2 Guide & Creator Profile Information</h3>
          <ul>
            <li>City, country, and geographic region</li>
            <li>Languages spoken and specialties offered</li>
            <li>Hourly rate and availability settings</li>
            <li>Identity verification documents (stored securely, used for onboarding only)</li>
            <li>Professional biography and uploaded media</li>
            <li>Bank account or payment withdrawal details (processed by third-party payment providers)</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>2.3 Usage & Technical Data</h3>
          <ul>
            <li>IP address and approximate geolocation</li>
            <li>Browser type, version, and device information</li>
            <li>Pages visited, features used, and session duration</li>
            <li>Tour viewing history and booking activity</li>
            <li>Network connection speed (for streaming quality optimization)</li>
            <li>Error logs and diagnostic data</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>2.4 Payment & Transaction Data</h3>
          <ul>
            <li>Booking amounts, currencies, and transaction identifiers</li>
            <li>Payment method type (card, UPI, wallet — but NOT full card numbers)</li>
            <li>Refund and dispute records</li>
          </ul>
          <p><strong>Important:</strong> ZilliGo does not store full credit or debit card numbers. All payment processing is handled by third-party providers (Razorpay). Their privacy policies govern how payment data is stored and processed.</p>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>2.5 Communications Data</h3>
          <ul>
            <li>Messages sent through our in-platform messaging system</li>
            <li>Support requests and email correspondence</li>
            <li>Feedback, reviews, and ratings submitted</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>2.6 Cookies & Tracking Technologies</h3>
          <p>We use cookies, local storage, and similar technologies. Please refer to our <a href="/cookies" style={{ color: 'var(--accent-teal)' }}>Cookie Policy</a> for full details.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li><strong>Account Management:</strong> Creating, authenticating, and maintaining user accounts</li>
            <li><strong>Service Delivery:</strong> Matching travelers with guides, processing bookings, enabling live video sessions, and delivering virtual tour content</li>
            <li><strong>Payments:</strong> Processing payments, issuing guide payouts, managing refunds and disputes</li>
            <li><strong>Communication:</strong> Sending booking confirmations, service updates, security alerts, and (with your consent) promotional communications</li>
            <li><strong>Safety & Security:</strong> Detecting and preventing fraud, abuse, policy violations, and unauthorized access</li>
            <li><strong>Platform Improvement:</strong> Analyzing usage patterns to improve features, fix bugs, and develop new services</li>
            <li><strong>Legal Compliance:</strong> Meeting our obligations under applicable laws and responding to lawful legal requests</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We do not sell your personal information. We share data only in the following limited circumstances:</p>
          <ul>
            <li><strong>Between Users:</strong> Guide profiles (name, location, specialties, rating, bio) are publicly visible to travelers. Traveler names are shared with guides during confirmed bookings.</li>
            <li><strong>Payment Processors:</strong> We share transaction data with Razorpay to process payments. Their use of this data is governed by their own privacy policy.</li>
            <li><strong>Infrastructure Providers:</strong> We use cloud hosting and infrastructure providers (such as Render and Vercel) to operate our services. These providers access data only as necessary to provide hosting services.</li>
            <li><strong>Legal Obligations:</strong> We may disclose information if required by law, court order, or lawful government request, or to protect the rights, property, or safety of ZilliGo, our users, or the public.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of that transaction. We will notify users if this occurs.</li>
          </ul>

          <h2>5. Data Storage & Security</h2>
          <p>We implement industry-standard technical and organizational measures to protect your personal information including:</p>
          <ul>
            <li>Encryption of data in transit using TLS/HTTPS</li>
            <li>Bcrypt hashing for all stored passwords</li>
            <li>JWT-based authentication with token expiry</li>
            <li>Database access controls and environment-based secret management</li>
            <li>Regular security reviews of our codebase and infrastructure</li>
          </ul>
          <p>However, no method of transmission or storage is 100% secure. We encourage users to use strong passwords and report any suspicious activity immediately.</p>

          <h2>6. Data Retention</h2>
          <p>We retain personal information for as long as necessary to provide our Services and comply with legal obligations:</p>
          <ul>
            <li><strong>Active Accounts:</strong> Data is retained for the duration of your account</li>
            <li><strong>Deleted Accounts:</strong> Most personal data is deleted within 30 days of account deletion. Some data (such as transaction records) may be retained for up to 7 years for tax and legal compliance purposes</li>
            <li><strong>Support Communications:</strong> Retained for up to 2 years</li>
            <li><strong>Usage Logs:</strong> Retained for up to 12 months for security analysis</li>
          </ul>

          <h2>7. Your Rights</h2>
          <p>Depending on your country of residence, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
            <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
            <li><strong>Right to Portability:</strong> Request your data in a structured, machine-readable format</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to Restrict:</strong> Request restriction of processing in certain circumstances</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a>. We will respond within 30 days. We may request identity verification before fulfilling your request.</p>

          <h2>8. Cookies</h2>
          <p>We use essential cookies to maintain your login session and remember your preferences. Analytics cookies are used to understand how users interact with the Platform. You may manage cookie preferences through your browser settings. See our full <a href="/cookies" style={{ color: 'var(--accent-teal)' }}>Cookie Policy</a>.</p>

          <h2>9. Children's Privacy</h2>
          <p>ZilliGo is not intended for children under the age of 13 (or 16 in the European Union). We do not knowingly collect personal information from children. If we discover that we have collected data from a child under the applicable age without parental consent, we will delete that information promptly. If you believe a child has provided us with their information, please contact us at <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a>.</p>

          <h2>10. International Users</h2>
          <p>ZilliGo operates globally. If you are located outside the country where our servers are hosted, your information may be transferred to and processed in other countries. We take steps to ensure appropriate safeguards are in place for international transfers of personal data, in compliance with applicable laws including GDPR.</p>

          <h2>11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we make significant changes, we will notify you via email or a prominent notice on our Platform. The "Last Updated" date at the top of this policy reflects the most recent revision. Your continued use of ZilliGo after changes are posted constitutes your acceptance of the updated policy.</p>

          <h2>12. Contact Us</h2>
          <p>For privacy-related questions, data requests, or to report a privacy concern, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a></li>
            <li><strong>General Support:</strong> <a href="mailto:support@zilligo.com" style={{ color: 'var(--accent-teal)' }}>support@zilligo.com</a></li>
            <li><strong>Response Time:</strong> We aim to respond to all privacy requests within 30 days</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
