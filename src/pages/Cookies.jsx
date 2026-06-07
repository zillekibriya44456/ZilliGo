import './CompanyPages.css';

export default function CookiePolicy() {
  return (
    <div className="company-page page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>🍪 Legal</div>
          <h1>Cookie Policy</h1>
          <p>Last Updated: June 7, 2026</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>This policy explains how ZilliGo uses cookies and similar tracking technologies, and how you can control them.</p>
        </div>

        <div className="company-section legal-text">

          <h2>1. What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device (computer, tablet, or smartphone) by websites you visit. They are widely used to make websites work more efficiently, remember your preferences, and provide reporting information.</p>
          <p>Cookies may be "session cookies" (deleted when you close your browser) or "persistent cookies" (remain on your device until they expire or you delete them). We use both types.</p>
          <p>Similar technologies include local storage, session storage, and pixel tags, which serve comparable purposes.</p>

          <h2>2. How ZilliGo Uses Cookies</h2>
          <p>ZilliGo uses cookies to:</p>
          <ul>
            <li>Keep you securely logged in to your account</li>
            <li>Remember your language and currency preferences</li>
            <li>Maintain your session state across pages</li>
            <li>Analyze how the Platform is used so we can improve it</li>
            <li>Detect and prevent fraudulent activity and unauthorized access</li>
            <li>Support live tour session continuity</li>
          </ul>

          <h2>3. Types of Cookies We Use</h2>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>3.1 Essential Cookies (Required)</h3>
          <p>These cookies are necessary for the Platform to function. Without them, core features like logging in and booking tours would not work. They cannot be disabled.</p>
          <ul>
            <li><strong>auth_token:</strong> Stores your authentication token to keep you logged in</li>
            <li><strong>session_id:</strong> Identifies your current session for security purposes</li>
            <li><strong>csrf_token:</strong> Protects against cross-site request forgery attacks</li>
            <li><strong>booking_state:</strong> Preserves your booking progress across pages</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>3.2 Preference Cookies (Functional)</h3>
          <p>These cookies remember your settings and preferences to enhance your experience.</p>
          <ul>
            <li><strong>user_language:</strong> Remembers your selected language preference</li>
            <li><strong>user_currency:</strong> Remembers your selected currency</li>
            <li><strong>tour_view_mode:</strong> Remembers whether you prefer grid or list view</li>
            <li><strong>theme_preference:</strong> Stores your display theme preference</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>3.3 Analytics Cookies (Performance)</h3>
          <p>These cookies help us understand how visitors interact with the Platform. The data collected is aggregated and anonymous — it does not identify you personally.</p>
          <ul>
            <li>Pages visited and navigation patterns</li>
            <li>Time spent on different sections of the Platform</li>
            <li>Search terms used to find tours</li>
            <li>Features that are used most frequently</li>
            <li>Error rates and performance metrics</li>
          </ul>
          <p>You can opt out of analytics cookies without affecting core Platform functionality.</p>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>3.4 Security Cookies</h3>
          <p>Used to detect and prevent fraud, verify your identity in certain actions, and protect your account from unauthorized access attempts.</p>

          <h2>4. Third-Party Cookies</h2>
          <p>Some cookies are placed by trusted third-party services that help us operate the Platform:</p>
          <ul>
            <li><strong>Razorpay:</strong> Payment processing uses cookies to maintain a secure checkout session</li>
            <li><strong>Google OAuth:</strong> If you sign in with Google, Google may set cookies related to the authentication process</li>
          </ul>
          <p>These third-party services have their own privacy and cookie policies. We recommend reviewing them if you have concerns about their data practices.</p>
          <p><strong>ZilliGo does not use advertising or marketing tracking cookies and does not sell data to advertising networks.</strong></p>

          <h2>5. Managing Your Cookie Preferences</h2>
          <p>You have several options to manage cookies:</p>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>5.1 Browser Settings</h3>
          <p>Most browsers allow you to view, delete, and block cookies through their settings menu. Here are links to cookie management instructions for popular browsers:</p>
          <ul>
            <li>Google Chrome: Settings → Privacy and Security → Cookies</li>
            <li>Mozilla Firefox: Options → Privacy & Security → Cookies</li>
            <li>Safari: Preferences → Privacy → Manage Website Data</li>
            <li>Microsoft Edge: Settings → Privacy, Search, and Services → Cookies</li>
          </ul>
          <p><strong>Note:</strong> Blocking essential cookies will prevent you from logging in and using core ZilliGo features.</p>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>5.2 Cookie Settings on ZilliGo</h3>
          <p>Where applicable, we provide cookie preference controls within your account settings. Non-essential analytics cookies can be disabled without affecting your ability to use the Platform.</p>

          <h2>6. Cookie Lifespan</h2>
          <ul>
            <li><strong>Session cookies:</strong> Expire when you close your browser</li>
            <li><strong>Authentication cookies:</strong> Persist for up to 30 days (or until logout)</li>
            <li><strong>Preference cookies:</strong> Persist for up to 1 year</li>
            <li><strong>Analytics cookies:</strong> Typically 6-12 months</li>
          </ul>

          <h2>7. Updates to This Policy</h2>
          <p>We may update this Cookie Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Continued use of ZilliGo after changes are posted constitutes your acceptance of the updated policy.</p>

          <h2>8. Contact</h2>
          <p>If you have questions about our use of cookies, contact us at:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@zilligo.com" style={{ color: 'var(--accent-teal)' }}>privacy@zilligo.com</a></li>
          </ul>
        </div>

      </div>
    </div>
  );
}
