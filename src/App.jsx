import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Triggering hot-reload after lucide-react update
import { Component } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ConnectPage from './pages/ConnectPage';
import ScanPage from './pages/ScanPage';
import AccountInsightsPage from './pages/AccountInsightsPage';
import CreateStudioPage from './pages/CreateStudioPage';
import PrivacyPage from './pages/PrivacyPage';
import DeleteDataPage from './pages/DeleteDataPage';
import TermsPage from './pages/TermsPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import Sidebar from './components/Sidebar';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#08080f', color: '#ff5555', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1>💣 Something went wrong</h1>
          <pre style={{ background: '#000', padding: '20px', borderRadius: '8px', overflow: 'auto', maxWidth: '800px', width: '100%', marginTop: '20px' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.href = '/'} style={{ padding: '12px 24px', marginTop: '24px', cursor: 'pointer', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner"></div>
        <p>Loading Growcial OS...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner"></div>
        <p>Initializing Growcial OS...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/delete-data" element={<DeleteDataPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Full-Screen App Pages (No Sidebar) */}
      <Route
        path="/connect"
        element={<ProtectedRoute><ConnectPage /></ProtectedRoute>}
      />
      <Route
        path="/scan"
        element={<ProtectedRoute><ScanPage /></ProtectedRoute>}
      />
      <Route
        path="/insights/:accountId"
        element={<ProtectedRoute><AccountInsightsPage /></ProtectedRoute>}
      />
      <Route
        path="/create/:type?"
        element={<ProtectedRoute><CreateStudioPage /></ProtectedRoute>}
      />

      {/* Main Dashboard Area — With Sidebar */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}
