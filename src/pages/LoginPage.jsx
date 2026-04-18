import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const { loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login">
      <div className="g-bg"></div>
      
      <div className="login__content animate-fade-in">
        <div className="login__box g-card">
          <div className="login__brand">
            <div className="login__logo-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.85 8.65L22 9.27L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.27L9.15 8.65L12 2Z" fill="url(#logo-grad)" />
                <defs>
                  <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="login__title">Growcial <span className="g-gradient">OS</span></h1>
          </div>
          
          <div className="login__header">
            <h2>Welcome to the future of growth</h2>
            <p>Your self-learning AI companion for social domination.</p>
          </div>

          <button
            className="login__google-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#fff"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#fff"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                opacity="0.8"
              />
              <path
                fill="#fff"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                opacity="0.6"
              />
              <path
                fill="#fff"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                opacity="0.9"
              />
            </svg>
            <span>{loading ? 'Initializing AI...' : 'Continue with Google'}</span>
          </button>

          <footer className="login__footer">
            <div className="login__footer-links">
              <span onClick={() => navigate('/terms')} className="login__footer-link">Terms</span>
              <span className="login__footer-divider"></span>
              <span onClick={() => navigate('/privacy')} className="login__footer-link">Privacy</span>
              <span className="login__footer-divider"></span>
              <span onClick={() => navigate('/delete-data')} className="login__footer-link">Data Deletion</span>
            </div>
            <div className="login__status">
              <span className="login__status-dot"></span>
              AI Engine: Online
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
