import './CompanyPages.css';

export default function Accessibility() {
  return (
    <div className="company-page page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>♿ Accessibility</div>
          <h1>Accessibility Statement</h1>
          <p>Last Updated: June 7, 2026</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>ZilliGo is committed to making virtual travel accessible to everyone, regardless of ability or disability.</p>
        </div>

        <div className="company-section legal-text">

          <h2>1. Our Commitment to Accessibility</h2>
          <p>ZilliGo believes that exploring the world should be accessible to everyone. We are committed to ensuring our platform is usable by as many people as possible, including those with visual, auditory, motor, or cognitive disabilities.</p>
          <p>We aim to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards across our website and applications. Accessibility is an ongoing priority for our engineering and design teams, not a one-time project.</p>

          <h2>2. Current Accessibility Features</h2>
          <p>We have implemented the following accessibility features on ZilliGo:</p>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>Visual Accessibility</h3>
          <ul>
            <li>High-contrast color design with sufficient color contrast ratios</li>
            <li>Text that can be resized up to 200% without loss of functionality</li>
            <li>Descriptive alt text on meaningful images</li>
            <li>Consistent visual hierarchy and page structure</li>
            <li>Focus indicators visible on all interactive elements</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>Navigation & Interaction</h3>
          <ul>
            <li>Full keyboard navigation support across all major platform features</li>
            <li>Logical tab order throughout pages</li>
            <li>Skip navigation links to bypass repetitive content</li>
            <li>Descriptive link text that indicates destination or purpose</li>
            <li>Consistent navigation patterns across pages</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>Content & Communication</h3>
          <ul>
            <li>Semantic HTML structure with appropriate heading hierarchy</li>
            <li>ARIA labels and landmarks where applicable</li>
            <li>Form fields with clear, descriptive labels</li>
            <li>Error messages that are descriptive and helpful</li>
            <li>Captions available for pre-recorded video content where applicable</li>
          </ul>

          <h3 style={{ color: 'var(--accent-teal)', margin: '1.25rem 0 0.5rem' }}>Language & Translation</h3>
          <ul>
            <li>AI-powered real-time translation available during live tours</li>
            <li>Multi-language support for platform navigation</li>
            <li>Plain language used in critical communications</li>
          </ul>

          <h2>3. Known Limitations</h2>
          <p>While we strive for full accessibility, some areas of our platform may not yet meet full WCAG 2.1 AA compliance. Known areas we are actively working to improve include:</p>
          <ul>
            <li>Real-time live video tour sessions — full captions during live streams are in development</li>
            <li>Some dynamic content areas may not announce state changes optimally to screen readers</li>
            <li>Interactive tour maps are currently not fully accessible to keyboard-only users</li>
            <li>Some third-party embedded content may not meet our accessibility standards</li>
          </ul>
          <p>We are actively working to resolve these limitations in upcoming platform updates.</p>

          <h2>4. Assistive Technology Compatibility</h2>
          <p>ZilliGo aims to be compatible with commonly used assistive technologies including:</p>
          <ul>
            <li>Screen readers: NVDA, JAWS, VoiceOver (macOS/iOS), TalkBack (Android)</li>
            <li>Voice control software: Dragon NaturallySpeaking</li>
            <li>Switch access devices</li>
            <li>Browser zoom and text enlargement tools</li>
          </ul>
          <p>We test our platform with a selection of these tools and browsers. If you encounter specific compatibility issues, please let us know.</p>

          <h2>5. Feedback & Contact</h2>
          <p>Accessibility feedback is extremely valuable to us. If you experience barriers while using ZilliGo, or if you have suggestions for improvement, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:accessibility@zilligo.com" style={{ color: 'var(--accent-teal)' }}>accessibility@zilligo.com</a></li>
            <li><strong>Subject Line:</strong> "Accessibility Feedback"</li>
            <li><strong>Response Time:</strong> We aim to respond to accessibility concerns within 3 business days</li>
          </ul>
          <p>When contacting us, please describe the specific accessibility barrier you encountered, the page or feature involved, and the assistive technology or browser you were using.</p>

          <h2>6. Future Improvements</h2>
          <p>Our accessibility roadmap includes:</p>
          <ul>
            <li>Live captions for all real-time virtual tour sessions</li>
            <li>Audio descriptions for recorded tour videos</li>
            <li>Improved keyboard navigation in interactive map views</li>
            <li>Full WCAG 2.1 AA audit by a certified accessibility specialist</li>
            <li>User preference controls for motion reduction and high-contrast mode</li>
            <li>Regular accessibility testing with disabled users as part of our UX research</li>
          </ul>

          <h2>7. Third-Party Content</h2>
          <p>Some content on ZilliGo is provided by third parties (guides, creators, payment processors). We encourage all partners to meet accessibility standards but cannot guarantee third-party content meets WCAG criteria. We are developing guidelines and tools to help our guide and creator community create more accessible content.</p>

        </div>

      </div>
    </div>
  );
}
