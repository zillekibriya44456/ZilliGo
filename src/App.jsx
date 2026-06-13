import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportWidget from './components/SupportWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load Pages
const Landing = lazy(() => import('./pages/Landing'));
const Explore = lazy(() => import('./pages/Explore'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const LiveRoom = lazy(() => import('./pages/LiveRoom'));
const GuideDirectory = lazy(() => import('./pages/GuideDirectory'));
const GuideProfile = lazy(() => import('./pages/GuideProfile'));
const Auth = lazy(() => import('./pages/Auth'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GuideDashboard = lazy(() => import('./pages/GuideDashboard'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const CreatorProfile = lazy(() => import('./pages/CreatorProfile'));
const DigitalShop = lazy(() => import('./pages/DigitalShop'));
const Academy = lazy(() => import('./pages/Academy'));
const CourseViewer = lazy(() => import('./pages/CourseViewer'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const BecomeGuide = lazy(() => import('./pages/BecomeGuide'));
const GuideDriverApp = lazy(() => import('./pages/GuideDriverApp'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const TripPlanner = lazy(() => import('./pages/TripPlanner'));
const Messages = lazy(() => import('./pages/Messages'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const CultureOlympics = lazy(() => import('./pages/CultureOlympics'));
const DigitalPassport = lazy(() => import('./pages/DigitalPassport'));
const FriendDiscovery = lazy(() => import('./pages/FriendDiscovery'));
const GlobalMap = lazy(() => import('./pages/GlobalMap'));
const ExchangeRooms = lazy(() => import('./pages/ExchangeRooms'));
const RandomChat = lazy(() => import('./pages/RandomChat'));

// Lazy load Company Pages
const About = lazy(() => import('./pages/About'));
const Careers = lazy(() => import('./pages/Careers'));
const Press = lazy(() => import('./pages/Press'));
const Blog = lazy(() => import('./pages/Blog'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Safety = lazy(() => import('./pages/Safety'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

// Lazy load Legal & Trust Pages
const Cookies = lazy(() => import('./pages/Cookies'));
const CommunityGuidelines = lazy(() => import('./pages/CommunityGuidelines'));
const DMCA = lazy(() => import('./pages/DMCA'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const TrustSafety = lazy(() => import('./pages/TrustSafety'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const AccountDeletion = lazy(() => import('./pages/AccountDeletion'));

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <SupportWidget />
        <Suspense fallback={
          <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            <Route path="/live/:id" element={<LiveRoom />} />
            <Route path="/olympics" element={<CultureOlympics />} />
            <Route path="/shop" element={<DigitalShop />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/academy/course/:id" element={<CourseViewer />} />
            <Route path="/guides" element={<GuideDirectory />} />
            <Route path="/guide/:id" element={<GuideProfile />} />
            <Route path="/creator/:id" element={<CreatorProfile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/driver" element={<ProtectedRoute allowedRoles={['guide', 'admin']}><GuideDriverApp /></ProtectedRoute>} />
            <Route path="/guide-dashboard" element={<ProtectedRoute allowedRoles={['guide', 'admin']}><GuideDashboard /></ProtectedRoute>} />
            <Route path="/creator-dashboard" element={<ProtectedRoute allowedRoles={['creator', 'admin']}><CreatorDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
            <Route path="/become-guide" element={<BecomeGuide />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/planner" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/shop" element={<Marketplace />} />
            <Route path="/olympics" element={<CultureOlympics />} />
            <Route path="/passport" element={<DigitalPassport />} />
            <Route path="/friends" element={<FriendDiscovery />} />
            <Route path="/map" element={<GlobalMap />} />
            <Route path="/exchange" element={<ExchangeRooms />} />
            <Route path="/random-chat" element={<RandomChat />} />
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
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
