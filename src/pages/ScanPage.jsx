import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  BarChart3, 
  Zap, 
  TrendingUp, 
  Globe, 
  Monitor,
  Layout,
  Star
} from 'lucide-react';
import './ScanPage.css';

const ACCOUNTS = [
  { id: 'instagram', name: 'Instagram', user: '@creator', color: '#E1306C', gradient: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)', followers: '12.4K', joined: 'Mar 2022' },
  { id: 'youtube', name: 'YouTube', user: '@creator', color: '#FF0000', gradient: 'linear-gradient(135deg, #FF0000, #CC0000)', followers: '8.2K', joined: 'Jan 2021' },
  { id: 'twitter', name: 'X (Twitter)', user: '@creator', color: '#1DA1F2', gradient: 'linear-gradient(135deg, #1DA1F2, #0C85D0)', followers: '3.1K', joined: 'Jun 2023' },
  { id: 'facebook', name: 'Facebook', user: '@creator', color: '#1877F2', gradient: 'linear-gradient(135deg, #1877F2, #0C5DC7)', followers: '5.6K', joined: 'Aug 2020' },
  { id: 'telegram', name: 'Telegram', user: '@creator', color: '#0088cc', gradient: 'linear-gradient(135deg, #0088cc, #006699)', followers: '24.5K', joined: 'Sep 2022' },
  { id: 'whatsapp', name: 'WhatsApp', user: '@creator', color: '#25D366', gradient: 'linear-gradient(135deg, #25D366, #128C7E)', followers: '1.2K', joined: 'Oct 2023' },
];

export default function ScanPage() {
  const { user, connectedPlatforms } = useAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState({});
  const [progress, setProgress] = useState({});
  const [completed, setCompleted] = useState({});

  const handleScan = (id) => {
    if (scanning[id] || completed[id]) return;
    setScanning((s) => ({ ...s, [id]: true }));
    setProgress((p) => ({ ...p, [id]: 0 }));

    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => {
          setScanning((s) => ({ ...s, [id]: false }));
          setCompleted((c) => ({ ...c, [id]: true }));
        }, 500);
      }
      setProgress((p) => ({ ...p, [id]: Math.min(100, Math.round(prog)) }));
    }, 250);
  };

  const handleExplore = (acc) => {
    navigate(`/insights/${acc.id}`);
  };

  const displayName = user?.displayName || 'Creator';
  const username = displayName.toLowerCase().replace(/\s/g, '');

  return (
    <div className="sp">
      <div className="g-bg"></div>
      <div className="sp__inner">

        {/* Left Panel — User Info + Back Nav */}
        <aside className="sp__sidebar g-card">
          <button className="sp__back-btn" onClick={() => navigate('/')}>
             <ArrowLeft size={16} /> Back to Connection
          </button>
          
          <div className="sp__sidebar-divider"></div>

          <div className="sp__user-avatar">
            {user?.photoURL ? <img src={user.photoURL} alt="" /> : <span>{displayName[0]}</span>}
          </div>
          <div className="sp__user-name">{displayName}</div>
          
          <div className="sp__user-items">
            <div className="sp__user-item">
              <span className="sp__user-label"><Monitor size={12} /> Niche</span>
              <span className="sp__user-value">Tech & AI</span>
            </div>
            <div className="sp__user-item">
              <span className="sp__user-label"><Globe size={12} /> Location</span>
              <span className="sp__user-value">India</span>
            </div>
            <div className="sp__user-item">
              <span className="sp__user-label"><Layout size={12} /> Language</span>
              <span className="sp__user-value">English</span>
            </div>
          </div>
          
          <div className="sp__sidebar-footer">
             <div className="sp__status-badge">
                <span className="sp__status-dot"></span>
                AI Core Active
             </div>
          </div>
        </aside>

        {/* Main — Scan Cards */}
        <main className="sp__main">
          <div className="sp__header-text">
             <h2>AI Diagnostic <span className="g-gradient">Station</span></h2>
             <p>Scanning accounts for growth patterns and opportunities</p>
          </div>

          <div className="sp__cards">
            {ACCOUNTS.filter(acc => connectedPlatforms.includes(acc.id)).map((acc) => {
              const isScanning = scanning[acc.id];
              const isDone = completed[acc.id];
              const prog = progress[acc.id] || 0;
              return (
                <div key={acc.id} className={`sp__card ${isDone ? 'sp__card--done' : ''} ${isScanning ? 'sp__card--scanning' : ''}`} style={{ '--a-color': acc.color, '--a-gradient': acc.gradient }}>

                  <div className="sp__card-inner g-card">
                    {/* Glow ring when scanning */}
                    {isScanning && <div className="sp__glow-ring"></div>}

                    <div className="sp__card-avatar">
                        {user?.photoURL ? <img src={user.photoURL} alt="" /> : <span>{displayName[0]}</span>}
                        <div className="sp__card-platform-badge" style={{ background: acc.gradient }}>
                           <Star size={10} fill="white" stroke="none" />
                        </div>
                    </div>

                    <div className="sp__card-platform-label" style={{ color: acc.color }}>{acc.name}</div>
                    <div className="sp__card-username">@{username}</div>

                    <div className="sp__card-meta">
                      <div className="sp__card-meta-item">
                         <span className="sp__meta-val">{acc.followers}</span>
                         <span className="sp__meta-lbl">Followers</span>
                      </div>
                      <div className="sp__card-meta-item">
                         <span className="sp__meta-val">{acc.joined}</span>
                         <span className="sp__meta-lbl">Joined</span>
                      </div>
                    </div>

                    {/* Progress Area */}
                    {(isScanning || isDone) && (
                      <div className="sp__progress-area">
                        <div className="sp__progress-track">
                          <div className="sp__progress-fill" style={{ width: `${prog}%`, background: acc.gradient }}></div>
                        </div>
                        <div className="sp__progress-info">
                           <span className="sp__progress-pct">{prog}%</span>
                           <span className="sp__progress-status">{isDone ? 'Diagnostic Complete' : 'AI Scanning...'}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Interface */}
                    <div className="sp__card-actions">
                      {!isScanning && !isDone && (
                        <button className="sp__action-btn sp__action-btn--scan" onClick={() => handleScan(acc.id)}>
                          <Search size={14} /> Scan Account
                        </button>
                      )}

                      {isScanning && (
                        <div className="sp__scanning-indicator">
                           <div className="sp__ai-pulse"></div>
                           <span>Analyzing Data</span>
                        </div>
                      )}

                      {isDone && (
                        <button className="sp__action-btn sp__action-btn--explore animate-glow-pulse" onClick={() => handleExplore(acc)}>
                           <Zap size={14} fill="currentColor" /> Explore Insights
                        </button>
                      )}
                    </div>

                    {isDone && (
                      <div className="sp__mini-insights animate-fade-in">
                        <div className="sp__insight-pill"><BarChart3 size={10} /> 94% Eng.</div>
                        <div className="sp__insight-pill"><TrendingUp size={10} /> +12% Growth</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
