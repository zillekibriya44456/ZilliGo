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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guide-dashboard" element={<GuideDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/become-guide" element={<BecomeGuide />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/planner" element={<TripPlanner />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/shop" element={<Marketplace />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
