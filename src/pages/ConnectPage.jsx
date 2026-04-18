import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ConnectPage.css';

/* Platform SVGs */
const IG = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>;
const FB = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>;
const YT = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M23.5 6.5a3 3 0 00-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 00.5 6.5 31 31 0 000 12a31 31 0 00.5 5.5 3 3 0 002.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.5zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>;
const XT = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const TG = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224l-1.79 8.438c-.135.587-.487.731-.988.455l-2.73-2.013-1.317 1.269c-.146.146-.268.268-.549.268l.196-2.779 5.067-4.575c.22-.196-.048-.305-.342-.109l-6.264 3.945-2.699-.843c-.586-.183-.598-.586.122-.868l10.55-4.066c.488-.176.915.12.744.878z"/></svg>;
const WA = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.15-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: IG, color: '#E1306C', gradient: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' },
  { id: 'facebook', name: 'Facebook', icon: FB, color: '#1877F2', gradient: 'linear-gradient(135deg, #1877F2, #0C5DC7)' },
  { id: 'youtube', name: 'YouTube', icon: YT, color: '#FF0000', gradient: 'linear-gradient(135deg, #FF0000, #CC0000)' },
  { id: 'twitter', name: 'X (Twitter)', icon: XT, color: '#fff', gradient: 'linear-gradient(135deg, #1DA1F2, #0C85D0)' },
  { id: 'telegram', name: 'Telegram', icon: TG, color: '#0088cc', gradient: 'linear-gradient(135deg, #0088cc, #006699)' },
  { id: 'whatsapp', name: 'WhatsApp', icon: WA, color: '#25D366', gradient: 'linear-gradient(135deg, #25D366, #128C7E)' },
];


export default function ConnectPage() {
  const { user, connectedPlatforms, setConnectedPlatforms, logout } = useAuth();
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(null);
  const [showAiAnimation, setShowAiAnimation] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleConnect = (id) => {
    setConnecting(id);
    setShowAiAnimation(true);
    
    // Auto hide animation after 2.5s
    setTimeout(() => {
      setConnectedPlatforms((prev) => [...new Set([...prev, id])]);
      setConnecting(null);
      setShowAiAnimation(false);
    }, 2500);
  };

  const handleDisconnect = (id) => {
    setConnectedPlatforms((prev) => prev.filter(pid => pid !== id));
  };

  const connectedList = PLATFORMS.filter(p => connectedPlatforms.includes(p.id));
  const canProceed = connectedList.length >= 1;

  const displayName = user?.displayName || 'Creator';
  const username = displayName.toLowerCase().replace(/\s/g, '');

  return (
    <div className="cp">
      <div className="g-bg"></div>
      
      {/* AI Tech Animation Overlay */}
      {showAiAnimation && (
        <div className="cp__ai-overlay">
          <div className="cp__ai-hud">
            <div className="cp__hud-ring cp__hud-ring--1"></div>
            <div className="cp__hud-ring cp__hud-ring--2"></div>
            <div className="cp__hud-ring cp__hud-ring--3"></div>
            <div className="cp__hud-scan"></div>
            <div className="cp__hud-text">INITIALIZING AI PROTOCOL...</div>
          </div>
        </div>
      )}

      <div className="cp__inner">
        {/* Top Left — Profile */}
        <div className="cp__profile g-card">
          <div className="cp__avatar">
            {user?.photoURL ? <img src={user.photoURL} alt="" /> : <span>{displayName[0]}</span>}
          </div>
          <div className="cp__profile-info">
            <div className="cp__name">{displayName}</div>
            <div className="cp__badge"><span className="cp__badge-dot"></span> Growth Score: 0</div>
          </div>
        </div>

        {/* Top Center — Title */}
        <div className="cp__header">
          <h1 className="cp__title">Connect Your <span className="g-gradient">Social Accounts</span></h1>
          <p className="cp__subtitle">Link your platforms to unlock AI-powered growth insights</p>
        </div>

        {/* Center — Platform LIST View */}
        <div className="cp__list-container">
          <div className="cp__list">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const isConnected = connectedPlatforms.includes(p.id);
              const isConnecting = connecting === p.id;
              return (
                <div key={p.id} className={`cp__list-item g-card ${isConnected ? 'cp__list-item--connected' : ''} ${isConnecting ? 'cp__list-item--connecting' : ''}`} style={{ '--p-color': p.color }}>
                  <div className="cp__list-icon" style={{ background: isConnected ? p.gradient : undefined }}>
                    <Icon />
                  </div>
                  <div className="cp__list-info">
                    <div className="cp__list-name">{p.name}</div>
                    <div className="cp__list-status">
                      {isConnected ? '✓ Linked' : isConnecting ? 'AI Syncing...' : 'Disconnected'}
                    </div>
                  </div>
                  {isConnected ? (
                    <button 
                      className="cp__list-btn cp__list-btn--disconnect" 
                      onClick={() => handleDisconnect(p.id)}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className={`cp__list-btn ${isConnecting ? 'cp__list-btn--connecting' : ''}`}
                      onClick={() => !isConnecting && handleConnect(p.id)}
                      disabled={isConnecting}
                    >
                      {isConnecting ? 'Linking' : 'Connect'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel — Horizontal Profile Details */}
        <div className="cp__details-panel g-card">
          <div className="cp__details-header">CONNECTED ACCOUNTS</div>
          <div className="cp__details-list">
            {connectedList.length > 0 ? (
              connectedList.map((p) => (
                <div key={p.id} className="cp__detail-row animate-fade-in" style={{ '--p-color': p.color }}>
                   <div className="cp__detail-platform">
                     <p.icon />
                   </div>
                   <div className="cp__detail-content">
                     <div className="cp__detail-user">@{username} <span className="cp__detail-tag">{p.name}</span></div>
                     <div className="cp__detail-stats">Followers: — • Engagement: — • Posts: —</div>
                   </div>
                </div>
              ))
            ) : (
              <div className="cp__details-empty">
                <div className="cp__details-empty-icon">📂</div>
                <p>Connect accounts to see live details</p>
              </div>
            )}
          </div>
          <div className="cp__details-footer">
            {connectedList.length}/6 connected
          </div>
        </div>

        {/* Bottom — Next Button */}
        <div className="cp__footer">
          <button className="g-btn g-btn--primary cp__next-btn" disabled={!canProceed} onClick={() => navigate('/scan')}>
            Next — Scan Accounts
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* Global Utility Actions */}
      <button className="cp__logout-fixed g-btn" onClick={handleLogout} title="Sign Out">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  );
}
