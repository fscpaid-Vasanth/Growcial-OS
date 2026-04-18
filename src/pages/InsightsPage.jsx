import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import {
  BarChart3,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from 'lucide-react';
import './InsightsPage.css';

const DEMO_CHART_DATA = [
  { day: 'Mon', engagement: 4.2, views: 1200 },
  { day: 'Tue', engagement: 5.1, views: 1800 },
  { day: 'Wed', engagement: 3.8, views: 950 },
  { day: 'Thu', engagement: 6.3, views: 2400 },
  { day: 'Fri', engagement: 5.5, views: 2100 },
  { day: 'Sat', engagement: 7.2, views: 3200 },
  { day: 'Sun', engagement: 6.8, views: 2800 },
];

const DEMO_TOP_POSTS = [
  { id: 1, caption: '5 AI tools you need in 2026 🤖', likes: 1243, comments: 89, views: 12400, engagement: 10.7, platform: 'instagram' },
  { id: 2, caption: 'POV: Your first coding project works 💻', likes: 987, comments: 156, views: 9800, engagement: 11.6, platform: 'instagram' },
  { id: 3, caption: 'How I grew to 10K in 30 days 📈', likes: 2100, comments: 234, views: 18500, engagement: 12.6, platform: 'instagram' },
  { id: 4, caption: 'Stop making these mistakes ❌', likes: 654, comments: 43, views: 5600, engagement: 12.4, platform: 'instagram' },
];

export default function InsightsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      if (!user?.uid) return;
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('user_id', '==', user.uid), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      } catch (err) {
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [user]);

  const displayPosts = posts.length > 0 ? posts : DEMO_TOP_POSTS;
  const isDemo = posts.length === 0;

  // Calculate average stats
  const avgEngagement = displayPosts.length > 0
    ? (displayPosts.reduce((sum, p) => sum + (p.engagement || 0), 0) / displayPosts.length).toFixed(1)
    : '0';

  const totalViews = displayPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = displayPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

  const maxViews = Math.max(...DEMO_CHART_DATA.map(d => d.views));

  return (
    <div className="insights">
      <div className="page-header">
        <div className="insights__header-row">
          <div>
            <h1>
              <span className="text-gradient">Insights</span>{' '}
              <BarChart3 size={24} className="insights__header-icon" />
            </h1>
            <p>Analyze your content performance and growth trends</p>
          </div>
          <div className="insights__time-selector">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                className={`insights__time-btn ${timeRange === range ? 'insights__time-btn--active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="insights__demo-banner glass-card">
          <Zap size={18} />
          <span>Showing demo data. Connect your Instagram to see real insights!</span>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid-stats stagger-children">
        <div className="stat-card glass-card stat-card--cyan">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--cyan"><Target size={20} /></div>
            <div className="stat-card__change stat-card__change--up">
              <ArrowUpRight size={14} />
              <span>+{avgEngagement}%</span>
            </div>
          </div>
          <div className="stat-card__value">{avgEngagement}%</div>
          <div className="stat-card__label">Avg Engagement Rate</div>
        </div>

        <div className="stat-card glass-card stat-card--orange">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--orange"><Eye size={20} /></div>
          </div>
          <div className="stat-card__value">{totalViews.toLocaleString()}</div>
          <div className="stat-card__label">Total Views</div>
        </div>

        <div className="stat-card glass-card stat-card--purple">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--purple"><Heart size={20} /></div>
          </div>
          <div className="stat-card__value">{totalLikes.toLocaleString()}</div>
          <div className="stat-card__label">Total Likes</div>
        </div>

        <div className="stat-card glass-card stat-card--green">
          <div className="stat-card__header">
            <div className="stat-card__icon stat-card__icon--green"><TrendingUp size={20} /></div>
            <div className="stat-card__change stat-card__change--up">
              <ArrowUpRight size={14} />
              <span>+2.3%</span>
            </div>
          </div>
          <div className="stat-card__value">{displayPosts.length}</div>
          <div className="stat-card__label">Posts Tracked</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="insights__chart-section">
        <div className="insights__chart glass-card">
          <h3 className="insights__chart-title">Engagement Trend</h3>
          <div className="insights__bar-chart">
            {DEMO_CHART_DATA.map((d, i) => (
              <div key={i} className="insights__bar-col">
                <div
                  className="insights__bar"
                  style={{ height: `${(d.views / maxViews) * 100}%` }}
                >
                  <div className="insights__bar-tooltip">{d.views.toLocaleString()} views</div>
                </div>
                <span className="insights__bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="insights__engagement-breakdown glass-card">
          <h3 className="insights__chart-title">Engagement Breakdown</h3>
          <div className="insights__breakdown-items">
            <div className="insights__breakdown-item">
              <div className="insights__breakdown-bar">
                <div className="insights__breakdown-fill insights__breakdown-fill--likes" style={{ width: '72%' }}></div>
              </div>
              <div className="insights__breakdown-label">
                <Heart size={14} /> Likes
                <span>72%</span>
              </div>
            </div>
            <div className="insights__breakdown-item">
              <div className="insights__breakdown-bar">
                <div className="insights__breakdown-fill insights__breakdown-fill--comments" style={{ width: '18%' }}></div>
              </div>
              <div className="insights__breakdown-label">
                <MessageCircle size={14} /> Comments
                <span>18%</span>
              </div>
            </div>
            <div className="insights__breakdown-item">
              <div className="insights__breakdown-bar">
                <div className="insights__breakdown-fill insights__breakdown-fill--saves" style={{ width: '10%' }}></div>
              </div>
              <div className="insights__breakdown-label">
                <BarChart3 size={14} /> Saves
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="insights__top-posts">
        <h3 className="dashboard__section-title">
          <Zap size={16} /> Top Performing Posts
        </h3>
        <div className="insights__posts-table glass-card">
          <div className="insights__table-header">
            <span>Post</span>
            <span>Likes</span>
            <span>Comments</span>
            <span>Views</span>
            <span>Engagement</span>
          </div>
          {displayPosts.map((post, i) => (
            <div key={post.id} className="insights__table-row">
              <span className="insights__post-caption">
                <span className="insights__post-rank">#{i + 1}</span>
                {post.caption}
              </span>
              <span>{post.likes?.toLocaleString()}</span>
              <span>{post.comments?.toLocaleString()}</span>
              <span>{post.views?.toLocaleString()}</span>
              <span className="badge badge-success">{post.engagement || '—'}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
