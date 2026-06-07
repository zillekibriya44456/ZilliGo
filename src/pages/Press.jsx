import './CompanyPages.css';
import { Download, Mail, Calendar, Tag, FileText } from 'lucide-react';

export default function Press() {
  return (
    <div className="company-page page-wrapper">
      <div className="container">
        
        {/* Hero */}
        <div className="company-hero">
          <h1>Press Center</h1>
          <p>
            The latest news, media assets, and key stories about ZilliGo's virtual tourism revolution.
          </p>
        </div>

        {/* Company Overview */}
        <div className="company-section company-grid-2">
          <div className="text-content">
            <h2>About ZilliGo</h2>
            <p>
              ZilliGo is a premier global virtual tourism and live cultural exploration platform connecting travelers with verified local guides. Through high-definition interactive live broadcasts and integrated translation, users experience localized history, culinary tours, city walks, and shopping directly from their browser.
            </p>
            <p>
              Founded in 2026, ZilliGo aims to address structural limitations of traditional physical tourism—accessibility, financial cost, and carbon emissions—while creating a scalable digital income for guides and local hosts worldwide.
            </p>
          </div>
          <div className="company-card">
            <h3>Media Contacts</h3>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              For press inquiries, interview requests with our founding team, or media assets, please contact:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 600 }}>
              <Mail size={16} className="text-teal" /> press@zilligo.com
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Note: This address is strictly for journalists. For support issues, please contact the Support Center.
            </p>
          </div>
        </div>

        {/* Press Kit */}
        <div className="company-section">
          <h2>Brand Assets & Press Kit</h2>
          <div className="company-grid-3" style={{ marginTop: '2rem' }}>
            <div className="company-card">
              <FileText className="text-teal" size={24} style={{ marginBottom: '1rem' }} />
              <h3>ZilliGo Fact Sheet</h3>
              <p>Key information, database structure, guide compensation statistics, and executive profiles in one document.</p>
              <a href="#" className="press-download-btn" onClick={(e) => { e.preventDefault(); alert('Fact sheet download initialized'); }}>
                <Download size={14} /> Download PDF
              </a>
            </div>
            <div className="company-card">
              <Download className="text-teal" size={24} style={{ marginBottom: '1rem' }} />
              <h3>Logo & Brand Pack</h3>
              <p>SVG and PNG versions of the ZilliGo brandmark, color palettes, and typography guidelines.</p>
              <a href="#" className="press-download-btn" onClick={(e) => { e.preventDefault(); alert('Brand pack download initialized'); }}>
                <Download size={14} /> Download ZIP
              </a>
            </div>
            <div className="company-card">
              <Download className="text-teal" size={24} style={{ marginBottom: '1rem' }} />
              <h3>Media Assets</h3>
              <p>Curated photography and screenshots showing our live virtual tour interface and traveler dashboards.</p>
              <a href="#" className="press-download-btn" onClick={(e) => { e.preventDefault(); alert('Media assets download initialized'); }}>
                <Download size={14} /> Download ZIP
              </a>
            </div>
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="company-section">
          <h2>Latest Press Releases</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            
            <div className="company-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> June 5, 2026</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={12} /> Product Update</span>
              </div>
              <h3 style={{ margin: 0 }}>ZilliGo Launches Real-Time Translation for Global Tours</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                ZilliGo today announced the rollout of its real-time audio and text translation system, enabling guides to speak in their native languages while travelers receive real-time, low-latency translated overlays.
              </p>
            </div>

            <div className="company-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> May 20, 2026</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={12} /> Partnership News</span>
              </div>
              <h3 style={{ margin: 0 }}>ZilliGo Partners with Local Heritage Guilds in Italy and Japan</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                ZilliGo has formed strategic agreements with local guide guilds in Kyoto, Tokyo, Florence, and Rome, onboarding 200+ certified historical guides to launch immersive regional culture tours.
              </p>
            </div>

            <div className="company-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--accent-teal)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> May 10, 2026</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={12} /> Corporate</span>
              </div>
              <h3 style={{ margin: 0 }}>ZilliGo officially emerges from stealth to redefine digital tourism</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                ZilliGo announced its official public launch, revealing a web platform that enables global travelers to explore world cities in real-time alongside local guides while promoting zero-emission tourism.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
