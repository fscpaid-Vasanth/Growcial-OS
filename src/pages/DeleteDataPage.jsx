import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LegalPage.css';

const DeleteDataPage = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="g-bg"></div>
      
      <div className="legal-page__container">
        <div className="legal-page__card">
          <header className="legal-page__header">
            <h1 className="legal-page__title">Data <span className="g-gradient">Deletion</span></h1>
            <div className="login__logo-wrapper" style={{ transform: 'scale(0.8)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.85 8.65L22 9.27L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.27L9.15 8.65L12 2Z" fill="url(#logo-grad-delete)" />
                <defs>
                  <linearGradient id="logo-grad-delete" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </header>

          <div className="legal-page__body">
            <h2>Data Deletion Instructions</h2>
            <p>
              At Growcial OS, we value your privacy and provide you with full control over your data. 
              If you wish to delete your account and all associated data, please follow the steps below:
            </p>

            <h2>1. Automatic Deletion</h2>
            <p>
              You can initiate data deletion directly from your account settings if you are logged in. 
              Go to <strong>Settings &gt; Account &gt; Delete Data</strong>. This will permanently remove:
            </p>
            <ul>
              <li>Your user profile and authentication record.</li>
              <li>All connected social media tokens and cached metrics.</li>
              <li>All AI-generated content and history.</li>
            </ul>

            <h2>2. Meta (Facebook/Instagram) Data Deletion</h2>
            <p>
              If you have connected your Meta account (Facebook or Instagram) and wish to remove our 
              access and delete the data retrieved from their APIs, you can do so through your 
              Facebook settings:
            </p>
            <ul>
              <li>Go to your Facebook Profile's <strong>Settings & Privacy &gt; Settings</strong>.</li>
              <li>Look for <strong>Apps and Websites</strong> and you will see all of the apps and websites you linked to your Facebook account.</li>
              <li>Search and Click <strong>Growcial OS</strong> in the search bar.</li>
              <li>Scroll and click <strong>Remove</strong>.</li>
            </ul>

            <h2>3. Manual Request</h2>
            <p>
              Alternatively, you can request data deletion by contacting our support team. 
              Please send an email to <strong>support@growcialos.com</strong> with the subject 
              "Data Deletion Request". 
            </p>
            <p>
              Include your registered email address in the body of the message. We will process 
              your request within 48-72 hours and provide a confirmation once all data has 
              been purged from our systems.
            </p>

            <h2>4. What Data is Retained?</h2>
            <p>
              Once a deletion request is completed, no personal data is retained unless required by 
              law (e.g., for financial/transaction records if you had a paid subscription).
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

export default DeleteDataPage;
