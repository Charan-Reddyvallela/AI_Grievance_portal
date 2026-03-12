import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Material Dashboard imports
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { MaterialUIControllerProvider, useMaterialUIController, setLayout } from "context";
import theme from "assets/theme";

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintTracking from './pages/ComplaintTracking';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Logout from './pages/Logout';

// Components
import LoadingSpinner from './components/LoadingSpinner';
import ChatbotWidget from './components/ChatbotWidget';
import Sidenav from 'examples/Sidenav';
import { getSidenavRoutes } from './config/sidenavRoutes';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Sets layout to "dashboard" on protected routes so Sidenav shows
function LayoutController() {
  const { pathname } = useLocation();
  const [, dispatch] = useMaterialUIController();
  useEffect(() => {
    const isDashboard = /^\/(dashboard|admin|profile|track)(\/|$)/.test(pathname);
    setLayout(dispatch, isDashboard ? 'dashboard' : 'page');
  }, [pathname, dispatch]);
  return null;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [controller] = useMaterialUIController();
  const { layout } = controller;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f2f5',
          color: '#495057',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: 16, fontSize: 16 }}>Loading AI Grievance Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LayoutController />
      {layout === 'dashboard' && (
        <Sidenav
          brandName="AI Grievance Portal"
          brand=""
          routes={getSidenavRoutes(user?.role === 'admin')}
        />
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><CitizenDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/track" element={<ComplaintTracking />} />
        <Route path="/track/:complaintId" element={<ComplaintTracking />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ChatbotWidget />
    </>
  );
}

function App() {
  return (
    <MaterialUIControllerProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </MaterialUIControllerProvider>
  );
}

export default App;
