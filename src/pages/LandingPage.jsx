import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Shield, BarChart3, Users, ZapIcon } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="g-bg"></div>
      
      {/* Navigation */}
      <nav className="landing__nav animate-fade-in">
        <div className="landing__logo">
          <Sparkles className="landing__logo-icon" />
          <span>Growcial <span className="g-gradient">OS</span></span>
        </div>
        <div className="landing__nav-links">
          <button onClick={() => navigate('/login')} className="g-btn g-btn--ghost">Login</button>
          <button onClick={() => navigate('/login')} className="g-btn g-btn--primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing__hero">
        <div className="landing__hero-content animate-fade-in">
          <div className="landing__badge">
            <ZapIcon size={14} />
            <span>v2.0 — The AI Revolution is here</span>
          </div>
          <h1 className="landing__title">
            Dominate Social Media with <br />
            <span className="g-gradient">Artificial Intelligence</span>
          </h1>
          <p className="landing__subtitle">
            Growcial OS is the world’s first self-learning AI engine designed to analyze, 
            optimize, and automate your social media growth.
          </p>
          <div className="landing__ctas">
            <button onClick={() => navigate('/login')} className="g-btn g-btn--primary landing__main-cta">
              Start Free Trial
            </button>
            <button className="g-btn g-btn--ghost">Watch Demo</button>
          </div>
        </div>

        {/* Floating UI Elements / Visuals */}
        <div className="landing__hero-visual">
          <div className="landing__card-float landing__card-float--1 g-card">
            <BarChart3 className="g-gradient" />
            <div>
              <div className="landing__card-val">+124%</div>
              <div className="landing__card-lab">Engagement</div>
            </div>
          </div>
          <div className="landing__card-float landing__card-float--2 g-card">
            <Users className="g-gradient" />
            <div>
              <div className="landing__card-val">12.4k</div>
              <div className="landing__card-lab">New Followers</div>
            </div>
          </div>
          <div className="landing__hero-glow"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing__features">
        <div className="landing__section-header">
          <h2>Engineered for <span className="g-gradient">Growth</span></h2>
          <p>Everything you need to turn your social presence into an empire.</p>
        </div>

        <div className="landing__grid">
          <div className="landing__feature g-card">
            <div className="landing__feature-icon"><Zap /></div>
            <h3>AI Engine</h3>
            <p>Predictive analytics that tell you exactly what to post and when.</p>
          </div>
          <div className="landing__feature g-card">
            <div className="landing__feature-icon"><Shield /></div>
            <h3>Safe Sync</h3>
            <p>Enterprise-grade security for your social platform connections.</p>
          </div>
          <div className="landing__feature g-card">
            <div className="landing__feature-icon"><Sparkles /></div>
            <h3>Creation Studio</h3>
            <p>Generate high-converting content ideas in seconds with AI.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-content">
          <p>© 2026 Growcial OS. Built for the future of social.</p>
          <div className="landing__footer-links">
            <span onClick={() => navigate('/terms')}>Terms</span>
            <span onClick={() => navigate('/privacy')}>Privacy</span>
            <span onClick={() => navigate('/delete-data')}>Data Deletion</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
