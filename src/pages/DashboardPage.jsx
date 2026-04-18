import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Sparkles,
  ArrowUpRight,
  Target,
  Activity,
  PenTool,
  Send,
  Search,
} from 'lucide-react';
import './DashboardPage.css';

const DEMO_STATS = [
  { id: 'followers', label: 'Followers', value: '—', icon: Target, color: 'purple' },
  { id: 'engagement', label: 'Engagement', value: '—', icon: Activity, color: 'cyan' },
  { id: 'views', label: 'Views', value: '—', icon: Eye, color: 'orange' },
  { id: 'ideas', label: 'AI Ideas', value: '0', icon: Sparkles, color: 'green' },
];

const QUICK_ACTIONS = [
  { id: 1, label: 'Analyze', icon: Search, color: 'purple', path: '/analyze' },
  { id: 2, label: 'Suggest', icon: Sparkles, color: 'cyan', path: '/suggest' },
  { id: 3, label: 'Create', icon: PenTool, color: 'green', path: '/create' },
  { id: 4, label: 'Post', icon: Send, color: 'pink', path: '/post' },
  { id: 5, label: 'Learn', icon: Target, color: 'yellow', path: '/learn' },
  { id: 6, label: 'Improve', icon: TrendingUp, color: 'orange', path: '/improve' },
];

const LOOP_STEPS = [
  { label: 'Analyze', icon: Activity },
  { label: 'Suggest', icon: Sparkles },
  { label: 'Create', icon: PenTool },
  { label: 'Post', icon: Send },
  { label: 'Learn', icon: Target },
  { label: 'Improve', icon: TrendingUp },
];

/* Social media platform SVG icons */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M23.5 6.5a3 3 0 00-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 00.5 6.5 31 31 0 000 12a31 31 0 00.5 5.5 3 3 0 002.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.5zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V8.97a6.34 6.34 0 00-.79-.05A6.34 6.34 0 003.15 15.27a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.59a8.24 8.24 0 004.76 1.5V7.64a4.85 4.85 0 01-1-.95z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z"/>
  </svg>
);
const XTwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SOCIAL_PLATFORMS = [
  { name: 'Instagram', icon: InstagramIcon, color: '#E1306C' },
  { name: 'YouTube', icon: YouTubeIcon, color: '#FF0000' },
  { name: 'TikTok', icon: TikTokIcon, color: '#00f2ea' },
  { name: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
  { name: 'X', icon: XTwitterIcon, color: '#ffffff' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(DEMO_STATS);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null); // track which platform is connecting

  useEffect(() => {
    async function fetchData() {
      if (!user?.uid) return;
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('user_id', '==', user.uid), orderBy('date', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (posts.length > 0) {
          const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
          const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);
          const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
          const avgEng = totalViews > 0 ? (((totalLikes + totalComments) / totalViews) * 100).toFixed(1) : '0';
          setStats([
            { ...DEMO_STATS[0], value: user.followerCount?.toLocaleString() || '—' },
            { ...DEMO_STATS[1], value: `${avgEng}%` },
            { ...DEMO_STATS[2], value: totalViews.toLocaleString() },
            { ...DEMO_STATS[3], value: '0' },
          ]);
        }
      } catch (err) { console.error('Dashboard fetch error:', err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [user]);

  const handleConnect = (platformName) => {
    setConnecting(platformName);
    // Simulate AI connection process
    setTimeout(() => {
      setConnecting(null);
      alert(`${platformName} connection flow coming soon!`);
    }, 2500);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard">
      <div className="social-bg-pattern"></div>

      {/* Row 1: Greeting + Stats */}
      <div className="dash-row-1">
        <div className="dash-greeting">
          <h1>{getGreeting()}, <span className="text-gradient-warm">{user?.displayName?.split(' ')[0] || 'Creator'}</span> 🚀</h1>
          <p>Your AI growth engine is ready. Let's go viral.</p>
        </div>
        <div className="dash-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className={`stat-card stat-card--${stat.color}`}>
                <div className={`stat-card__icon stat-card__icon--${stat.color}`}><Icon size={14} /></div>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Actions + Loop + Connect */}
      <div className="dash-row-2">
        {/* Quick Actions */}
        <div className="dash-section dash-section--bordered">
          <h3 className="dash-section__title">⚡ High Velocity Actions</h3>
          <div className="dash-actions">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <a key={a.id} href={a.path} className={`dash-action dash-action--${a.color}`}>
                  <div className={`dash-action__icon dash-action__icon--${a.color}`}><Icon size={15} /></div>
                  <span>{a.label}</span>
                  <ArrowUpRight size={12} className="dash-action__arrow" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Growcial Loop */}
        <div className="dash-section dash-section--bordered">
          <h3 className="dash-section__title">🔄 The Growcial Loop</h3>
          <div className="dash-loop">
            {LOOP_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="dash-loop__step">
                  <div className={`dash-loop__icon dash-loop__icon--${i}`}>
                    <StepIcon size={15} />
                    <span className="dash-loop__num">{i + 1}</span>
                  </div>
                  <span className="dash-loop__label">{step.label}</span>
                </div>
              );
            })}
          </div>
          <p className="dash-loop__tagline"><Sparkles size={11} /> The more you use it, the smarter it gets</p>
        </div>

        {/* Connect Social Accounts */}
        <div className="dash-section dash-section--bordered">
          <h3 className="dash-section__title">🔗 Connect Accounts</h3>
          <div className="dash-socials">
            {SOCIAL_PLATFORMS.map((p) => {
              const PlatformIcon = p.icon;
              const isConnecting = connecting === p.name;
              return (
                <button
                  key={p.name}
                  className={`dash-social ${isConnecting ? 'dash-social--connecting' : ''}`}
                  style={{ '--platform-color': p.color }}
                  onClick={() => handleConnect(p.name)}
                  disabled={isConnecting}
                >
                  <div className="dash-social__icon"><PlatformIcon /></div>
                  <span className="dash-social__name">{p.name}</span>
                  {isConnecting ? (
                    <span className="dash-social__ai-loader">
                      <span className="ai-pulse-dot"></span>
                      <span className="ai-pulse-dot"></span>
                      <span className="ai-pulse-dot"></span>
                    </span>
                  ) : (
                    <span className="dash-social__status">Connect</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
