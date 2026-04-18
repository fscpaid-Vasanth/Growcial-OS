import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LegalPage.css';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="g-bg"></div>
      
      <div className="legal-page__container">
        <div className="legal-page__card">
          <header className="legal-page__header">
            <h1 className="legal-page__title">Privacy <span className="g-gradient">Policy</span></h1>
            <div className="login__logo-wrapper" style={{ transform: 'scale(0.8)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.85 8.65L22 9.27L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.27L9.15 8.65L12 2Z" fill="url(#logo-grad-privacy)" />
                <defs>
                  <linearGradient id="logo-grad-privacy" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </header>

          <div className="legal-page__body">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Growcial OS. We are committed to protecting your personal information and your right to privacy. 
              If you have any questions or concerns about this privacy notice, or our practices with regards to your personal 
              information, please contact us.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on the Website, 
              express an interest in obtaining information about us or our products and Services, when you participate 
              in activities on the Website or otherwise when you contact us.
            </p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and authentication data from Google.</li>
              <li><strong>Social Media Data:</strong> If you connect your Instagram, Facebook, or other social accounts, we access public profile information and metrics to provide insights.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our AI engine and dashboard.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our Website for a variety of business purposes described below:
            </p>
            <ul>
              <li>To facilitate account creation and logon process.</li>
              <li>To enable user-to-user communications.</li>
              <li>To send administrative information to you.</li>
              <li>To protect our Services and fulfill legal requirements.</li>
              <li>To generate AI-driven insights for your social media growth.</li>
            </ul>

            <h2>4. Sharing Your Information</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect 
              your rights, or to fulfill business obligations. We use Firebase for authentication and data storage.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We use appropriate technical and organizational security measures designed to protect the security of any 
              personal information we process. However, despite our safeguards and efforts to secure your information, 
              no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>

            <h2>6. Your Privacy Rights</h2>
            <p>
              In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. 
              These may include the right (i) to request access and obtain a copy of your personal information, (ii) 
              to request rectification or erasure; (iii) to restrict the processing of your personal information; 
              and (iv) if applicable, to data portability.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              If you have questions or comments about this notice, you may email us or use the contact information 
              provided on our website.
            </p>
          </div>

          <footer className="legal-page__footer">
            <button className="legal-page__back-btn" onClick={() => navigate('/login')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Login
            </button>
            <span className="legal-page__last-updated">Last Updated: April 18, 2026</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
