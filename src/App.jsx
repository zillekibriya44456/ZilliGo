import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import TourDetail from './pages/TourDetail';
import LiveRoom from './pages/LiveRoom';
import GuideDirectory from './pages/GuideDirectory';
import GuideProfile from './pages/GuideProfile';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import GuideDashboard from './pages/GuideDashboard';
import AdminPanel from './pages/AdminPanel';
import BecomeGuide from './pages/BecomeGuide';
import Leaderboard from './pages/Leaderboard';
import SupportWidget from './components/SupportWidget';
import TripPlanner from './pages/TripPlanner';
import Messages from './pages/Messages';
import Marketplace from './pages/Marketplace';
import OAuthCallback from './pages/OAuthCallback';
import CultureOlympics from './pages/CultureOlympics';
import DigitalPassport from './pages/DigitalPassport';
import FriendDiscovery from './pages/FriendDiscovery';
import GlobalMap from './pages/GlobalMap';
import ExchangeRooms from './pages/ExchangeRooms';

// Company Pages
import About from './pages/About';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Blog from './pages/Blog';
import Sustainability from './pages/Sustainability';
import HelpCenter from './pages/HelpCenter';
import Safety from './pages/Safety';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Legal & Trust Pages
import Cookies from './pages/Cookies';
import CommunityGuidelines from './pages/CommunityGuidelines';
import DMCA from './pages/DMCA';
import Disclaimer from './pages/Disclaimer';
import TrustSafety from './pages/TrustSafety';
import Accessibility from './pages/Accessibility';
import AccountDeletion from './pages/AccountDeletion';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <SupportWidget />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/live/:id" element={<LiveRoom />} />
          <Route path="/guides" element={<GuideDirectory />} />
          <Route path="/guide/:id" element={<GuideProfile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guide-dashboard" element={<GuideDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/become-guide" element={<BecomeGuide />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/planner" element={<TripPlanner />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/shop" element={<Marketplace />} />
          <Route path="/olympics" element={<CultureOlympics />} />
          <Route path="/passport" element={<DigitalPassport />} />
          <Route path="/friends" element={<FriendDiscovery />} />
          <Route path="/map" element={<GlobalMap />} />
          <Route path="/exchange" element={<ExchangeRooms />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Company Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Legal & Trust Routes */}
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/trust-safety" element={<TrustSafety />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/account-deletion" element={<AccountDeletion />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
