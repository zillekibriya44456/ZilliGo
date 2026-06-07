import './CompanyPages.css';
import { Leaf, Users, Shield, BookOpen, Compass, Award } from 'lucide-react';

export default function Sustainability() {
  return (
    <div className="company-page page-wrapper">
      <div className="container">
        
        {/* Hero */}
        <div className="company-hero">
          <h1>Sustainability & Digital Responsibility</h1>
          <p>
            Redefining travel to support local economies and preserve our planet through carbon-neutral cultural connection.
          </p>
        </div>

        {/* Commitment Statement */}
        <div className="company-section company-grid-2">
          <div className="text-content">
            <h2>Our Commitment</h2>
            <p>
              Traditional tourism is a powerful force for cultural exchange, but it places a significant environmental toll on our planet. Aviation account for roughly 2.5% of global carbon emissions, and overtourism frequently exhausts natural resources and displaces residents in historical locations.
            </p>
            <p>
              ZilliGo was built as a solution. By offering virtual exploration, we seek to complement physical travel with zero-emission alternatives. Our goal is to make global connection accessible while protecting the local ecosystems, monuments, and communities that inspire us.
            </p>
          </div>
          <div className="company-card">
            <h3>Digital Travel Footprint</h3>
            <p style={{ marginBottom: '1rem' }}>
              Unlike physical flights and cruises, a virtual tour utilizes existing home connections and minimal digital infrastructure, producing negligible carbon emissions.
            </p>
            <ul className="company-list">
              <li><strong>Zero Aviation Emissions:</strong> Zero fuel burn per tourist.</li>
              <li><strong>Zero Physical Waste:</strong> No trash or environmental load on natural reserves.</li>
              <li><strong>Direct Financial Support:</strong> Capital flows directly to the guide without corporate middlemen.</li>
            </ul>
          </div>
        </div>

        {/* Four Pillars */}
        <div className="company-section">
          <h2>Our Core Pillars of Sustainability</h2>
          <div className="company-grid-3" style={{ marginTop: '2rem' }}>
            <div className="company-card">
              <Leaf className="text-teal" size={28} style={{ marginBottom: '1rem' }} />
              <h3>Environmental Care</h3>
              <p>Promoting lower carbon footprints. Our digital platform produces less than 1% of the carbon footprint associated with physical trips.</p>
            </div>
            <div className="company-card">
              <Users className="text-teal" size={28} style={{ marginBottom: '1rem' }} />
              <h3>Economic Equity</h3>
              <p>Ensuring tourism revenue reaches local hands. ZilliGo ensures that 85% of booking fees go directly to regional guides and local artisans.</p>
            </div>
            <div className="company-card">
              <Shield className="text-teal" size={28} style={{ marginBottom: '1rem' }} />
              <h3>Cultural Preservation</h3>
              <p>Partnering with guides to document and preserve regional stories, heritage dialects, and landmarks digitally for posterity.</p>
            </div>
          </div>
        </div>

        {/* Supporting Local Communities & Accessibility */}
        <div className="company-section company-grid-2">
          <div className="company-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Award className="text-teal" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3>Accessible Travel for All</h3>
            <p style={{ lineHeight: 1.8 }}>
              "Sustainability also means social inclusion. ZilliGo enables older individuals, people with physical disabilities, and those with limited financial means to explore the world's wonders—from the Louvre in Paris to the streets of Kyoto—without facing barriers."
            </p>
          </div>
          <div className="text-content">
            <h2>Our Future Goals</h2>
            <p>
              As a young global platform, we are committed to laying down foundations that ensure long-term, ethical impact:
            </p>
            <ul className="company-list">
              <li><strong>100% Carbon-Neutral Hosting:</strong> Offsetting all digital servers and routing nodes by late 2026.</li>
              <li><strong>Guide Scholarship Fund:</strong> Funding guides in developing regions with mobile phones, stabilizers, and data connectivity.</li>
              <li><strong>Preservation Grants:</strong> Partnering with local cultural NGOs to donate 1% of booking fees directly to heritage restoration.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
