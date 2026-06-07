import './CompanyPages.css';

export default function Disclaimer() {
  return (
    <div className="company-page page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>

        <div className="company-hero">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>📄 Legal</div>
          <h1>Disclaimer</h1>
          <p>Last Updated: June 7, 2026</p>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>Please read this disclaimer carefully before using ZilliGo. It explains the limitations of our services and user responsibilities.</p>
        </div>

        <div className="company-section legal-text">

          <h2>1. General Information Disclaimer</h2>
          <p>The information provided on ZilliGo — including tour descriptions, destination guides, cultural content, and guide profiles — is provided for general informational and entertainment purposes only. While we strive to ensure accuracy and quality, ZilliGo makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of any information on the Platform.</p>
          <p>ZilliGo is a marketplace platform that facilitates connections between travelers and independent local guides. We are not a travel agency, tour operator, or licensed travel service provider.</p>

          <h2>2. Travel Information Disclaimer</h2>
          <p>Virtual tours on ZilliGo are cultural and entertainment experiences. They are not a substitute for professional travel advice, safety briefings, or destination-specific guidance from qualified authorities.</p>
          <ul>
            <li>ZilliGo does not guarantee the safety conditions of any destination showcased on the Platform</li>
            <li>Travel safety, visa requirements, health advisories, and entry requirements change frequently. Always consult official government travel advisories before planning real-world travel</li>
            <li>Information shared by guides during virtual tours reflects their personal knowledge and perspective and may not represent official or definitive facts</li>
            <li>ZilliGo is not responsible for decisions you make based on content or recommendations received through the Platform</li>
          </ul>

          <h2>3. Content Accuracy Disclaimer</h2>
          <p>ZilliGo hosts content created by independent guides and creators. We do not verify every factual claim made in tour descriptions, guide biographies, or creator content. While we have Community Guidelines and a reporting system to address inaccurate content, we cannot guarantee that all information is current, correct, or complete.</p>
          <p>Users should exercise independent judgment when making decisions based on information encountered on ZilliGo.</p>

          <h2>4. Guide Independence Disclaimer</h2>
          <p>Guides and creators on ZilliGo are independent individuals, not ZilliGo employees, contractors, or agents. ZilliGo does not control the content of live sessions, the statements made by guides, or the quality of individual experiences. We provide tools and a marketplace; the experience itself is delivered by independent guides.</p>
          <p>Ratings and reviews reflect the personal opinions of verified travelers and are not endorsed by ZilliGo.</p>

          <h2>5. Third-Party Content Disclaimer</h2>
          <p>ZilliGo may link to or reference third-party websites, services, tools, or applications. We have no control over the content, privacy practices, or availability of third-party resources. Links do not constitute endorsement by ZilliGo. We are not responsible for any content, products, or services offered by third parties.</p>

          <h2>6. Platform Availability Disclaimer</h2>
          <p>ZilliGo makes reasonable efforts to maintain Platform availability and performance, but we do not guarantee uninterrupted access. The Platform may be temporarily unavailable due to maintenance, technical issues, third-party service disruptions, or events beyond our control. We are not liable for any loss resulting from Platform downtime or unavailability.</p>
          <p>Live tour sessions depend on the internet connections of both the traveler and the guide. ZilliGo is not responsible for session interruptions caused by network conditions.</p>

          <h2>7. User Responsibility</h2>
          <p>Users are solely responsible for:</p>
          <ul>
            <li>The decisions they make based on information encountered on ZilliGo</li>
            <li>Their own health, safety, and wellbeing while using the Platform</li>
            <li>Verifying the accuracy of information before acting on it</li>
            <li>Complying with local laws and regulations in their jurisdiction</li>
            <li>The content they upload, share, or communicate through the Platform</li>
          </ul>

          <h2>8. Earnings Disclaimer</h2>
          <p>Any earnings figures mentioned on ZilliGo (such as average guide income) are illustrative estimates based on available data. Individual earnings vary significantly based on tour pricing, availability, location, demand, quality, and effort. ZilliGo does not guarantee any specific income level to any guide or creator.</p>

          <h2>9. Changes to This Disclaimer</h2>
          <p>We reserve the right to modify this Disclaimer at any time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of ZilliGo constitutes acceptance of the current Disclaimer.</p>

          <h2>10. Contact</h2>
          <p>For questions about this Disclaimer, contact us at <a href="mailto:legal@zilligo.com" style={{ color: 'var(--accent-teal)' }}>legal@zilligo.com</a>.</p>
        </div>

      </div>
    </div>
  );
}
