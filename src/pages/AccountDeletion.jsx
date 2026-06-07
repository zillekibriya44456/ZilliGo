import './CompanyPages.css';

export default function AccountDeletion() {
  return (
    <div className="company-page page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>🗑️ Account</div>
          <h1>Account Deletion Policy</h1>
          <p>Last Updated: June 7, 2026</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>You have the right to delete your ZilliGo account at any time. This policy explains how the process works and what happens to your data.</p>
        </div>

        <div className="company-section legal-text">

          <h2>1. How to Delete Your Account</h2>
          <p>You can delete your ZilliGo account at any time through your account settings:</p>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 2 }}>
            <li>Log in to your ZilliGo account</li>
            <li>Go to <strong>Account Settings</strong> (profile icon → Settings)</li>
            <li>Navigate to the <strong>Privacy & Security</strong> section</li>
            <li>Click <strong>"Delete My Account"</strong></li>
            <li>Read the confirmation details carefully</li>
            <li>Confirm your identity by entering your password</li>
            <li>Click <strong>"Permanently Delete Account"</strong> to complete the process</li>
          </ol>
          <p>Alternatively, you may request account deletion by emailing <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a> from your registered email address. Include "Account Deletion Request" in the subject line. We will process your request within 7 business days.</p>

          <h2>2. Before You Delete</h2>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <strong style={{ color: '#FBBF24', display: 'block', marginBottom: '0.5rem' }}>⚠️ Please note before proceeding:</strong>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              <li>Account deletion is <strong>permanent and irreversible</strong></li>
              <li>You will lose access to all bookings, messages, and review history</li>
              <li>Any guide earnings that have not been withdrawn must be claimed before deletion</li>
              <li>Active or upcoming bookings should be cancelled or completed before requesting deletion</li>
              <li>If you are a guide, any active tour listings will be removed from the platform</li>
            </ul>
          </div>

          <h2>3. What Data Is Removed</h2>
          <p>Upon confirmed account deletion, the following data is permanently deleted from our systems within <strong>30 days</strong>:</p>
          <ul>
            <li>Your name, email address, and profile photograph</li>
            <li>Your profile biography, languages, and guide information</li>
            <li>All tour listings you created (if a guide)</li>
            <li>All messages sent and received through the platform</li>
            <li>Your search history and browsing preferences</li>
            <li>Wishlist and saved tours</li>
            <li>Your account login credentials</li>
          </ul>

          <h2>4. What Data May Be Retained</h2>
          <p>Some data may be retained after account deletion for legal, financial, or safety compliance reasons:</p>
          <ul>
            <li><strong>Transaction Records:</strong> Booking and payment records are retained for up to 7 years for tax, accounting, and legal compliance purposes</li>
            <li><strong>Reviews:</strong> Reviews you submitted or received may be retained in anonymized form (e.g., "Deleted User") to maintain the integrity of the review system</li>
            <li><strong>Safety Records:</strong> Records of safety violations, policy breaches, or bans may be retained to prevent re-registration by bad actors</li>
            <li><strong>Legal Holds:</strong> Data may be retained if we are required to do so by a court order or law enforcement request at the time of deletion</li>
            <li><strong>Support Correspondence:</strong> Communications related to disputes may be retained for up to 2 years</li>
          </ul>
          <p>Retained data is stored securely and used only for the purposes described above. It will not be used for marketing or sold to third parties.</p>

          <h2>5. Processing Time</h2>
          <ul>
            <li><strong>Request Confirmation:</strong> You will receive an email confirmation within 24 hours of submitting your deletion request</li>
            <li><strong>Account Deactivation:</strong> Your account will be immediately deactivated after confirmation (you will no longer be able to log in)</li>
            <li><strong>Data Deletion:</strong> Personal data is permanently deleted within 30 days</li>
            <li><strong>Backup Purge:</strong> Data in backup systems may persist for up to 90 days as part of our routine backup cycle</li>
          </ul>

          <h2>6. Guides: Special Considerations</h2>
          <p>If you are a guide with active bookings or pending earnings:</p>
          <ul>
            <li>You must complete or cancel all upcoming confirmed bookings before account deletion</li>
            <li>Any earned but unpaid balance must be withdrawn within 30 days of account deletion request. Unclaimed balances after this period may be forfeited</li>
            <li>Your tour listings and availability will be immediately hidden from traveler searches upon account deletion request</li>
          </ul>

          <h2>7. Changing Your Mind</h2>
          <p>If you change your mind after submitting a deletion request but before the 30-day deletion period is complete, you may cancel your request by emailing <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a> promptly. Once data has been permanently deleted, it cannot be recovered.</p>

          <h2>8. Alternatives to Deletion</h2>
          <p>If you are considering deletion due to a specific issue, there may be alternatives:</p>
          <ul>
            <li><strong>Taking a break:</strong> You can deactivate your account temporarily rather than deleting it</li>
            <li><strong>Privacy concerns:</strong> Contact <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a> to discuss data access, correction, or restriction options</li>
            <li><strong>Harassment or safety concerns:</strong> Contact <a href="mailto:safety@zilligo.com" style={{ color: 'var(--accent-teal)' }}>safety@zilligo.com</a> — our team can help resolve issues</li>
            <li><strong>Technical issues:</strong> Contact <a href="mailto:support@zilligo.com" style={{ color: 'var(--accent-teal)' }}>support@zilligo.com</a> — most technical problems can be resolved</li>
          </ul>

          <h2>9. Contact</h2>
          <p>For questions about account deletion, contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a></li>
            <li><strong>Subject:</strong> "Account Deletion Request" or "Account Deletion Question"</li>
          </ul>

        </div>

      </div>
    </div>
  );
}
