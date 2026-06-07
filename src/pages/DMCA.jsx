import './CompanyPages.css';

export default function DMCA() {
  return (
    <div className="company-page page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>©️ Legal</div>
          <h1>DMCA & Copyright Policy</h1>
          <p>Last Updated: June 7, 2026</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>ZilliGo respects intellectual property rights and expects all users to do the same. This policy explains how to report copyright infringement and how we respond.</p>
        </div>

        <div className="company-section legal-text">

          <h2>1. Our Commitment to Copyright</h2>
          <p>ZilliGo is committed to respecting the intellectual property rights of creators, guides, and third parties. We comply with the Digital Millennium Copyright Act (DMCA) and similar intellectual property laws applicable in other jurisdictions.</p>
          <p>We take copyright claims seriously and respond promptly to properly submitted infringement notifications. All users of ZilliGo must ensure that the content they upload, share, or use on the platform does not infringe the copyrights of others.</p>

          <h2>2. Copyright Respect for All Users</h2>
          <p>All users, guides, and creators agree that they will only upload, share, or use content on ZilliGo if they:</p>
          <ul>
            <li>Are the original creator and own the copyright</li>
            <li>Have explicit written permission from the copyright owner</li>
            <li>Are using content under a valid license (e.g., Creative Commons)</li>
            <li>Are using content that is clearly in the public domain</li>
          </ul>
          <p>Uploading copyrighted music, videos, images, text, or other material without permission is a violation of our Terms of Service and may result in content removal and account suspension.</p>

          <h2>3. How to Report Copyright Infringement</h2>
          <p>If you believe your copyrighted work has been posted on ZilliGo without your authorization, you may submit a DMCA takedown notice to our designated Copyright Agent. Your notice must be in writing and include all of the following:</p>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>Required Information for DMCA Notice</h3>
          <ul>
            <li><strong>Your Identity:</strong> Your full name, address, telephone number, and email address</li>
            <li><strong>Work Description:</strong> A description of the copyrighted work you claim has been infringed. If multiple works are covered, a representative list is acceptable</li>
            <li><strong>Infringing Content Location:</strong> The URL or specific location on ZilliGo where the infringing content appears</li>
            <li><strong>Your Ownership Statement:</strong> A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law</li>
            <li><strong>Accuracy Statement:</strong> A statement that the information in your notice is accurate, and under penalty of perjury, that you are the copyright owner or are authorized to act on their behalf</li>
            <li><strong>Physical or Electronic Signature:</strong> Your physical or digital signature</li>
          </ul>

          <p>Submit your DMCA notice to:</p>
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.25rem', margin: '1rem 0' }}>
            <strong style={{ color: 'var(--text-primary)' }}>ZilliGo Copyright Agent</strong><br />
            <a href="mailto:dmca@zilligo.com" style={{ color: 'var(--accent-teal)' }}>dmca@zilligo.com</a><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Subject line: "DMCA Takedown Notice"</span>
          </div>

          <p><strong>Warning:</strong> Filing a false DMCA notice may expose you to legal liability under the DMCA and other applicable laws. We strongly recommend consulting a legal professional if you are unsure whether content infringes your copyright.</p>

          <h2>4. How We Process Notices</h2>
          <p>Upon receiving a valid, complete DMCA notice, ZilliGo will:</p>
          <ul>
            <li>Review the notice for completeness within 2-3 business days</li>
            <li>Remove or disable access to the allegedly infringing content</li>
            <li>Notify the user who posted the content that it has been removed</li>
            <li>Provide the user with a copy of the DMCA notice (with your contact information, as required by law)</li>
            <li>Inform the user of their right to submit a counter-notification</li>
          </ul>
          <p>Incomplete notices will not be processed. We will contact you if additional information is required.</p>

          <h2>5. Counter-Notification Process</h2>
          <p>If you believe your content was removed in error — for example, you believe you had proper authorization or the notice was submitted in bad faith — you may submit a counter-notification. Your counter-notification must include:</p>
          <ul>
            <li>Your full name, address, telephone number, and email address</li>
            <li>Identification of the content that was removed and its location before removal</li>
            <li>A statement under penalty of perjury that you have a good faith belief the content was removed as a result of mistake or misidentification</li>
            <li>A statement consenting to the jurisdiction of the applicable federal court</li>
            <li>Your physical or electronic signature</li>
          </ul>
          <p>Submit counter-notifications to <a href="mailto:dmca@zilligo.com" style={{ color: 'var(--accent-teal)' }}>dmca@zilligo.com</a>. Upon receipt of a valid counter-notification, we will notify the original complainant and, if no legal action is filed within 10-14 business days, may restore the content.</p>

          <h2>6. Repeat Infringer Policy</h2>
          <p>ZilliGo maintains a strict repeat infringer policy. Users who have multiple valid copyright complaints filed against their content will have their accounts suspended or permanently terminated, at ZilliGo's discretion. We track infringement history and act accordingly to protect the rights of copyright owners and maintain platform integrity.</p>

          <h2>7. Content Licensing on ZilliGo</h2>
          <p>When guides and creators upload original content to ZilliGo (tour videos, profile images, cultural content), they retain full ownership of that content but grant ZilliGo a license to display and distribute it through the platform as described in our Terms of Service. This does not transfer copyright ownership to ZilliGo.</p>

          <h2>8. Contact</h2>
          <p>For all copyright and DMCA-related matters:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:dmca@zilligo.com" style={{ color: 'var(--accent-teal)' }}>dmca@zilligo.com</a></li>
            <li><strong>Subject Line:</strong> "DMCA Takedown Notice" or "DMCA Counter-Notice"</li>
            <li><strong>Response Time:</strong> We aim to acknowledge all notices within 2 business days</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
