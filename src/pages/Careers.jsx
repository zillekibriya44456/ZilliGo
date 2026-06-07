import './CompanyPages.css';
import { Briefcase, Heart, Globe, Lightbulb, Compass } from 'lucide-react';

export default function Careers() {
  return (
    <div className="company-page page-wrapper">
      <div className="container">
        
        {/* Hero */}
        <div className="company-hero">
          <h1>Join the ZilliGo Team</h1>
          <p>
            Help us build the future of immersive virtual exploration. Work with a global, remote-first team committed to connecting cultures.
          </p>
        </div>

        {/* Culture & Purpose */}
        <div className="company-section company-grid-2">
          <div className="text-content">
            <h2>Why Work at ZilliGo</h2>
            <p>
              At ZilliGo, we are passionate about connection, exploration, and building technology that does real good in the world. We believe that by creating virtual pathways for global tourism, we can help people understand each other better.
            </p>
            <p>
              As a remote-first company, our employees span multiple continents and cultures. We prioritize transparency, work-life balance, creative ownership, and mutual support. Here, your work will directly touch the lives of travelers and guides in over 50 countries.
            </p>
          </div>
          <div className="company-card">
            <h3>Company Culture</h3>
            <ul className="company-list">
              <li><strong>Remote-First:</strong> Work from anywhere that has a solid internet connection.</li>
              <li><strong>Flexible Hours:</strong> Manage your own schedule and find your flow.</li>
              <li><strong>Inclusive Atmosphere:</strong> Collaboration rooted in kindness and constructive feedback.</li>
              <li><strong>Growth Mindset:</strong> Weekly learning sessions and professional development budgets.</li>
            </ul>
          </div>
        </div>

        {/* Benefits & Perks */}
        <div className="company-section">
          <h2>Perks & Benefits</h2>
          <div className="company-grid-3" style={{ marginTop: '2rem' }}>
            <div className="company-card">
              <Heart className="text-teal" size={24} style={{ marginBottom: '1rem' }} />
              <h3>Health & Wellness</h3>
              <p>Comprehensive medical, dental, and mental health coverage for you and your dependents, plus monthly wellness stipends.</p>
            </div>
            <div className="company-card">
              <Globe className="text-teal" size={24} style={{ marginBottom: '1rem' }} />
              <h3>Work from Anywhere</h3>
              <p>A generous remote work setup stipend to customize your home workspace, plus co-working space subscriptions.</p>
            </div>
            <div className="company-card">
              <Lightbulb className="text-teal" size={24} style={{ marginBottom: '1rem' }} />
              <h3>Travel Stipends</h3>
              <p>Annual travel stipends to experience physical travel, alongside unlimited access to virtual experiences on ZilliGo.</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="company-section job-roles-section">
          <h2 style={{ marginBottom: '2rem' }}>Current Open Roles</h2>
          
          <div className="jobs-list">
            
            <div className="job-card">
              <div className="job-info">
                <h3>Senior Full-Stack Engineer (Node/React)</h3>
                <span>Engineering • Remote (Global) • Full-Time</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Please email your resume to careers@zilligo.com')}>Apply Now</button>
            </div>

            <div className="job-card">
              <div className="job-info">
                <h3>Senior Product Designer</h3>
                <span>Design • Remote (Europe/Americas) • Full-Time</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Please email your resume to careers@zilligo.com')}>Apply Now</button>
            </div>

            <div className="job-card">
              <div className="job-info">
                <h3>Global Community Manager</h3>
                <span>Community & Guides • Remote (Asia-Pacific) • Full-Time</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Please email your resume to careers@zilligo.com')}>Apply Now</button>
            </div>

            <div className="job-card">
              <div className="job-info">
                <h3>Marketing & Creator Partnerships Lead</h3>
                <span>Marketing • Remote (Global) • Full-Time</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Please email your resume to careers@zilligo.com')}>Apply Now</button>
            </div>

            <div className="job-card">
              <div className="job-info">
                <h3>Operations & Guide Success Coordinator</h3>
                <span>Operations • Remote (LATAM) • Full-Time</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Please email your resume to careers@zilligo.com')}>Apply Now</button>
            </div>

            <div className="job-card">
              <div className="job-info">
                <h3>Product & Engineering Intern (Summer 2026)</h3>
                <span>Engineering • Remote (Global) • Internship</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => alert('Please email your resume to careers@zilligo.com')}>Apply Now</button>
            </div>

          </div>
        </div>

        {/* How to Apply */}
        <div className="company-section company-card" style={{ textAlign: 'center', background: 'radial-gradient(circle at center, rgba(45, 212, 191, 0.05) 0%, transparent 80%)' }}>
          <h2>How to Apply</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 2rem', fontSize: '1rem' }}>
            We'd love to hear from you! To apply for any of our roles (or submit a spontaneous application), please send your CV, portfolio or GitHub link, and a brief note about why you want to build ZilliGo to our hiring team.
          </p>
          <a href="mailto:careers@zilligo.com" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
            careers@zilligo.com
          </a>
        </div>

      </div>
    </div>
  );
}
