import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import MutualLeaderBoard from './pages/MutualLeaderBoard';
import DailyRoast from './pages/DailyRoast';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import EditProfile from './pages/EditProfile';
import Insights from './pages/Insights';
import Social from './pages/Social';
import Login from './pages/Login';
import ChatBox from './pages/ChatBox';
import UserProfile from './pages/UserProfile';
import TopListeners from './pages/TopListeners';
import Onboarding from './pages/Onboarding';
import TasteDNA from './pages/TasteDNA';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { FeedbackProvider } from './components/FeedbackContext';
import { ThemeProvider } from './components/ThemeContext';
import { UserProvider } from './components/UserContext';
import { DataCacheProvider } from './components/DataCacheContext';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes - No Bottom Nav */}
        <Route path="/login" element={<Layout showNav={false}><Login /></Layout>} />

        {/* Protected Routes - Standard Layout */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Layout><Activity /></Layout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Layout><MutualLeaderBoard /></Layout></ProtectedRoute>} />
        <Route path="/roast" element={<ProtectedRoute><Layout showNav={false}><DailyRoast /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout showNav={false}><Settings /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout showNav={false}><Notifications /></Layout></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><Layout showNav={false}><EditProfile /></Layout></ProtectedRoute>} />
        <Route path="/social" element={<ProtectedRoute><Layout><Social /></Layout></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Layout><Insights /></Layout></ProtectedRoute>} />
        <Route path="/chat/:userId" element={<ProtectedRoute><Layout showNav={false}><ChatBox /></Layout></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
        <Route path="/top-listeners/:itemType/:itemId" element={<ProtectedRoute><Layout showNav={false}><TopListeners /></Layout></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Layout showNav={false}><Onboarding /></Layout></ProtectedRoute>} />
        <Route path="/taste-dna/:userId" element={<ProtectedRoute><Layout showNav={false}><TasteDNA /></Layout></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
      <UserProvider>
        <DataCacheProvider>
          <ThemeProvider>
            <FeedbackProvider>
              <AnimatedRoutes />
            </FeedbackProvider>
          </ThemeProvider>
        </DataCacheProvider>
      </UserProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
