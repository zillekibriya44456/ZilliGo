import './CompanyPages.css';
import { Shield, Target, Eye, Globe, Compass, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="company-page page-wrapper">
      <div className="container">
        
        {/* Hero */}
        <div className="company-hero">
          <h1>About ZilliGo</h1>
          <p>
            Bridging cultures and communities through immersive, real-time virtual tourism. Explore the globe with local guides from the comfort of home.
          </p>
        </div>

        {/* Company Introduction */}
        <div className="company-section company-grid-2">
          <div className="text-content">
            <h2>Our Story</h2>
            <p>
              ZilliGo was founded with a singular, powerful premise: that travel is not just about visiting new places, but about connecting deeply with the people who call them home. 
            </p>
            <p>
              In a world where physical barriers, financial constraints, and environmental footprints often limit our capacity to explore, ZilliGo offers a revolutionary digital path. By leveraging modern real-time streaming technology, high-speed networks, and real-time translation tools, we make it possible for anyone, anywhere, to explore the world alongside verified local guides.
            </p>
          </div>
          <div className="company-card">
            <h3>Why ZilliGo Exists</h3>
            <p style={{ marginBottom: '1rem' }}>
              Traditional travel is a luxury that remains out of reach for many due to geographical, financial, or physical constraints. Additionally, mass physical tourism places immense pressure on local infrastructures and environments.
            </p>
            <p>
              ZilliGo exists to democratize travel, making the richness of cultural discovery accessible to all while building a low-impact, sustainable digital economy that financially empowers local residents around the world.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="company-section company-grid-3">
          <div className="company-card">
            <Target size={28} className="text-teal" style={{ marginBottom: '1rem' }} />
            <h3>Our Mission</h3>
            <p>
              To democratize global travel, foster deep cross-cultural empathy, and build sustainable economic opportunities for local guides, hosts, and creators worldwide.
            </p>
          </div>
          <div className="company-card">
            <Eye size={28} className="text-teal" style={{ marginBottom: '1rem' }} />
            <h3>Our Vision</h3>
            <p>
              A borderless world where anyone can step into a different culture instantly, creating mutual understanding and global connection through human-led virtual exploration.
            </p>
          </div>
          <div className="company-card">
            <Globe size={28} className="text-teal" style={{ marginBottom: '1rem' }} />
            <h3>Global Impact</h3>
            <p>
              Reducing the carbon footprint of international exploration while injecting tourism revenue directly into local economies and supporting historical preservation.
            </p>
          </div>
        </div>

        {/* What ZilliGo Does & How It Works */}
        <div className="company-section">
          <h2>How Virtual Tourism Works</h2>
          <div className="company-grid-3" style={{ marginTop: '2rem' }}>
            <div className="company-card">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-teal)' }}>01</span>
              <h4 style={{ color: 'var(--text-primary)', margin: '10px 0' }}>Discover & Book</h4>
              <p>Explore virtual tours by category, location, language, or rating, and reserve a spot for a live interactive broadcast.</p>
            </div>
            <div className="company-card">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-teal)' }}>02</span>
              <h4 style={{ color: 'var(--text-primary)', margin: '10px 0' }}>Connect Live</h4>
              <p>Join the live, high-definition broadcast feed. Interact directly with your guide, ask questions, and guide their footsteps.</p>
            </div>
            <div className="company-card">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-teal)' }}>03</span>
              <h4 style={{ color: 'var(--text-primary)', margin: '10px 0' }}>Real-time Chat</h4>
              <p>Communicate seamlessly. Our integrated real-time translation translates questions and speech so you can converse naturally.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="company-section">
          <h2>Creating Value Across the Ecosystem</h2>
          <div className="company-grid-3" style={{ marginTop: '2rem' }}>
            <div className="company-card">
              <h3>For Travelers</h3>
              <ul className="company-list">
                <li>Explore anywhere instantly without expensive flights.</li>
                <li>Fully accessible for people with mobility challenges.</li>
                <li>Ask questions and guide the journey in real-time.</li>
              </ul>
            </div>
            <div className="company-card">
              <h3>For Local Guides</h3>
              <ul className="company-list">
                <li>Monetize local expertise without complex setups.</li>
                <li>Set flexible, self-managed schedules and pricing.</li>
                <li>Receive 85% of bookings revenue directly.</li>
              </ul>
            </div>
            <div className="company-card">
              <h3>For Creators</h3>
              <ul className="company-list">
                <li>Co-host virtual events with local experts.</li>
                <li>Engage global audiences with unique interactive content.</li>
                <li>Build an international footprint and fan base.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Founder Story Section */}
        <div className="company-section company-grid-2">
          <div className="company-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Compass size={40} className="text-teal" style={{ marginBottom: '1.5rem' }} />
            <h3>Founder's Perspective</h3>
            <p style={{ fontStyle: 'italic', lineHeight: 1.8 }}>
              "Travel changed my life, but I realized that the magic of travel lies in the people we meet. ZilliGo was built to capture that human connection and make it accessible to everyone, regardless of physical or financial barriers. By bridging the digital divide, we enable local guides to earn a sustainable living while sharing the pride of their heritage with a global audience."
            </p>
            <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              — ZilliGo Founding Team
            </p>
          </div>
          <div className="text-content">
            <h2>Core Values</h2>
            <ul className="company-list">
              <li><strong>Radical Inclusion:</strong> Believing travel and cultural discovery should be a fundamental human opportunity.</li>
              <li><strong>Local Empowerment:</strong> Keeping resources and capital in the local communities where our guides reside.</li>
              <li><strong>Mutual Respect:</strong> Fostering exchanges that are culturally respectful and protect local traditions.</li>
              <li><strong>Technological Innovation:</strong> Continually refining video and audio transmission to keep virtual visits beautiful and reliable.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
