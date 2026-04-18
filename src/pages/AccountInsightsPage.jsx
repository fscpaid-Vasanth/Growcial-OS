import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Search, Zap, Play, Users, Plus, Sparkles, TrendingUp, ArrowUp, Loader2, AlertCircle, BadgeCheck
} from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants/platformConfig';
import { platformService } from '../services/platformService';
import './AccountInsightsPage.css';

// ── Components ──

const TypingText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}<span className="aip__cursor">|</span></span>;
};

const FanJourney = ({ funnel }) => {
  return (
    <div className="aip__flow-box">
       <div className="aip__flow-labels">
          <div className="aip__flow-node">Views</div>
          <div className="aip__flow-line">
             <div className="aip__flow-particle"></div>
          </div>
          <div className="aip__flow-node">Fans</div>
       </div>
       <p className="aip__flow-summary">From <strong>{funnel.views}</strong> views, you gained <strong>{funnel.follows}</strong> followers</p>
    </div>
  );
};

// ── Data ──

const ACCOUNTS_DATA = {
  instagram: {
    name: 'Instagram',
    username: '@creator.studio',
    gradient: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
    followers: 12456,
    growthLabel: "+64 fans today",
    summaryText: "12.4% this mo. 🔥",
    viralPosts: [
      { id: 1, title: 'This reel got 1.2M views', thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=50&h=50&fit=crop' },
      { id: 2, title: 'This post got 85K likes', thumb: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=50&h=50&fit=crop' },
    ],
    activeTime: "Most of your followers are active at 7–9 PM",
    postingGap: {
      text: "You post at 11 AM, but your audience is active at 7 PM",
      userTime: 11,
      audienceTime: 19
    },
    bestTime: [
      { type: 'Reels', time: '7:30 PM', icon: Play },
      { type: 'Posts', time: '8:45 PM', icon: Search },
      { type: 'Stories', time: '10:00 AM', icon: Zap },
    ],
    viralDNA: "Short reels + Tamil + strong starting line works best",
    funnel: { views: '1.2M', follows: '2400' },
    aiStory: "Your reels are performing well. People are watching longer and sharing more.",
    competitors: [
      { name: 'Rival A', freq: '5x/week' },
      { name: 'Rival B', freq: '7x/week' },
      { name: 'YOU', freq: '3x/week' },
    ],
    improvements: [
      "Post more consistently",
      "Improve first 3 seconds",
      "Use better hashtags"
    ],
    contentSplit: "Reels give you most reach (70%)",
    workedFailed: {
      worked: ["Short videos", "Tamil content"],
      failed: ["Long videos", "Low posting"]
    },
    loyalFollowers: [
      { img: 'https://i.pravatar.cc/150?u=1' },
      { img: 'https://i.pravatar.cc/150?u=2' },
      { img: 'https://i.pravatar.cc/150?u=3' },
    ],
    aiCommand: "Use niche hashtags to get 20% more reach"
  },
  youtube: {
    name: 'YouTube',
    username: '@creator.labs',
    gradient: 'linear-gradient(135deg, #FF0000, #CC0000)',
    followers: 8240,
    growthLabel: "+12 fans today",
    summaryText: "8.1% grew mo. 🚀",
    viralPosts: [
      { id: 1, title: 'This video got 210K views', thumb: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=50&h=50&fit=crop' },
      { id: 2, title: 'Tutorial went viral: 45K views', thumb: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=50&h=50&fit=crop' },
    ],
    activeTime: "Your community is active between 6–10 PM",
    postingGap: {
      text: "You post at 9 AM, but they watch at 8 PM",
      userTime: 9,
      audienceTime: 20
    },
    bestTime: [
      { type: 'Videos', time: '8:00 PM', icon: Play },
      { type: 'Shorts', time: '11:30 AM', icon: Zap },
      { type: 'Live', time: '7:00 PM', icon: Users },
    ],
    viralDNA: "Tutorials + Problem-solving + 4K quality works best",
    funnel: { views: '850K', follows: '1100' },
    aiStory: "Technical content is in high demand. Your detailed breakdowns are being saved and re-watched.",
    competitors: [
      { name: 'Dev Guru', freq: 'Weekly' },
      { name: 'Code Pro', freq: 'Daily' },
      { name: 'YOU', freq: 'Weekly' },
    ],
    improvements: [
      "Use custom thumbnails",
      "Add timestamps",
      "Upload more Shorts"
    ],
    contentSplit: "Core videos drive 75% of your fans",
    workedFailed: {
      worked: ["Detailed tutorials", "4K resolution"],
      failed: ["Vlogs", "Blurry audio"]
    },
    loyalFollowers: [
      { img: 'https://i.pravatar.cc/150?u=a' },
      { img: 'https://i.pravatar.cc/150?u=b' },
      { img: 'https://i.pravatar.cc/150?u=c' },
    ],
    aiCommand: "Ask a question in first 30s to double your comments"
  },
  twitter: {
    name: 'Twitter',
    username: '@creator.x',
    gradient: 'linear-gradient(135deg, #1DA1F2, #0C85D0)',
    followers: 4520,
    growthLabel: "+28 fans today",
    summaryText: "Viral threads! 🧵",
    viralPosts: [
      { id: 1, title: 'Why I left my 9-5...', thumb: 'https://images.unsplash.com/photo-1611605698335-8b1569810447?w=50&h=50&fit=crop' },
      { id: 2, title: '10 tools to master AI', thumb: 'https://images.unsplash.com/photo-1614850523296-e8452bde0c97?w=50&h=50&fit=crop' },
    ],
    activeTime: "Twitter peaks for you at 10 AM and 10 PM",
    postingGap: {
      text: "You tweet randomly, try 10:00 AM daily",
      userTime: 14,
      audienceTime: 10
    },
    bestTime: [
      { type: 'Tweets', time: '10:00 AM', icon: Sparkles },
      { type: 'Threads', time: '8:30 PM', icon: Search },
      { type: 'Spaces', time: '9:00 PM', icon: Users },
    ],
    viralDNA: "Building in Public + Storytelling + Thread format",
    funnel: { views: '120K', follows: '450' },
    aiStory: "Threads are your superpower. Short, punchy sentences are getting bookmarked by tech leaders.",
    competitors: [
      { name: 'X Master', freq: '10x/day' },
      { name: 'Thread God', freq: '2x/week' },
      { name: 'YOU', freq: '5x/week' },
    ],
    improvements: [
      "Post 1 Thread per week",
      "Reply to 10 creators daily",
      "Use better hook images"
    ],
    contentSplit: "Threads drive 90% of your growth",
    workedFailed: {
      worked: ["AI Threads", "SaaS updates"],
      failed: ["Generic quotes", "No images"]
    },
    loyalFollowers: [
      { img: 'https://i.pravatar.cc/150?u=x' },
      { img: 'https://i.pravatar.cc/150?u=y' },
      { img: 'https://i.pravatar.cc/150?u=z' },
    ],
    aiCommand: "DM 3 people who liked your thread to build network"
  },
  facebook: {
    name: 'Facebook',
    username: '@growcial.page',
    gradient: 'linear-gradient(135deg, #1877F2, #0C5DC7)',
    followers: 8540,
    growthLabel: "+15 likes today",
    summaryText: "6.2% engagement rate 💙",
    viralPosts: [
      { id: 1, title: 'Our mission to 10k creators', thumb: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=50&h=50&fit=crop' },
      { id: 2, title: 'The power of community', thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=50&h=50&fit=crop' },
    ],
    activeTime: "Facebook activity is high on weekends 11AM–2PM",
    postingGap: {
      text: "You post at 6 PM, but audience is morning heavy",
      userTime: 18,
      audienceTime: 11
    },
    bestTime: [
      { type: 'Posts', time: '11:00 AM', icon: Search },
      { type: 'Videos', time: '2:30 PM', icon: Play },
      { type: 'Live', time: '8:00 PM', icon: Users },
    ],
    viralDNA: "Community questions + Long-form value + Video hooks",
    funnel: { views: '450K', follows: '620' },
    aiStory: "Community questions are getting 3x more comments. Your 'Help me decide' post was shared 45 times.",
    competitors: [
      { name: 'SaaS Page A', freq: 'Daily' },
      { name: 'Creator Hub', freq: '3x/week' },
      { name: 'YOU', freq: '2x/week' },
    ],
    improvements: [
      "Ask 1 question daily",
      "Upload vertical videos",
      "Reply in the first hour"
    ],
    contentSplit: "Groups drive 65% of your traffic",
    workedFailed: {
      worked: ["Interactive polls", "Success stories"],
      failed: ["Direct sales", "Low quality images"]
    },
    loyalFollowers: [
      { img: 'https://i.pravatar.cc/150?u=fb1' },
      { img: 'https://i.pravatar.cc/150?u=fb2' },
      { img: 'https://i.pravatar.cc/150?u=fb3' },
    ],
    aiCommand: "Post a group poll to boost your algorithm score by 2x"
  },
  telegram: {
    name: 'Telegram',
    username: '@growcial_channel',
    gradient: 'linear-gradient(135deg, #0088cc, #006699)',
    followers: 24500,
    growthLabel: "+102 readers today",
    summaryText: "High retention! 📡",
    viralPosts: [
      { id: 1, title: 'AI Mastery Course Launch', thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=50&h=50&fit=crop' },
      { id: 2, title: 'Secret prompt for midjourney', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=50&h=50&fit=crop' },
    ],
    activeTime: "Peak reading time is 4 PM and 9 PM",
    postingGap: {
      text: "You post at midnight, but they read in the afternoon",
      userTime: 0,
      audienceTime: 16
    },
    bestTime: [
      { type: 'Posts', time: '4:00 PM', icon: Search },
      { type: 'Alerts', time: '10:00 AM', icon: Zap },
    ],
    viralDNA: "Exclusive value + Direct links + No fluff",
    funnel: { views: '1.5M', follows: '2400' },
    aiStory: "Telegram users love the 'direct vault' feel. Your technical document shares are up by 45%.",
    competitors: [
      { name: 'Alpha Channel', freq: 'Daily' },
      { name: 'Beta News', freq: '3x/day' },
      { name: 'YOU', freq: 'Daily' },
    ],
    improvements: [
      "Use polls for engagement",
      "Attach files to posts",
      "Format with bold/italic"
    ],
    contentSplit: "Technical posts drive 80% of joins",
    workedFailed: {
      worked: ["PDF guides", "Voice notes"],
      failed: ["Pure advertising", "Large images"]
    },
    loyalFollowers: [
      { img: 'https://i.pravatar.cc/150?u=tg1' },
      { img: 'https://i.pravatar.cc/150?u=tg2' },
    ],
    aiCommand: "Send a voice note to your channel to humanize the brand"
  },
  whatsapp: {
    name: 'WhatsApp',
    username: 'Growcial Broadcast',
    gradient: 'linear-gradient(135deg, #25D366, #128C7E)',
    followers: 1200,
    growthLabel: "+5 joined today",
    summaryText: "100% Open Rate 📲",
    viralPosts: [
      { id: 1, title: 'Flash sale announcement', thumb: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=50&h=50&fit=crop' },
      { id: 2, title: 'New Tutorial: Build in 5m', thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=50&h=50&fit=crop' },
    ],
    activeTime: "Users check statuses most at 8 AM and 1 PM",
    postingGap: {
      text: "You post at 10 PM when people are sleeping",
      userTime: 22,
      audienceTime: 8
    },
    bestTime: [
      { type: 'Status', time: '8:00 AM', icon: Zap },
      { type: 'Broadcast', time: '1:00 PM', icon: Search },
    ],
    viralDNA: "Urgent updates + Personal touch + Mobile-first",
    funnel: { views: '12K', follows: '120' },
    aiStory: "Broadcasts have zero friction. Your 'early bird' alerts are converting at 22%.",
    competitors: [
      { name: 'Channel X', freq: 'Daily' },
      { name: 'Group Y', freq: 'Active' },
      { name: 'YOU', freq: '2x/week' },
    ],
    improvements: [
      "Keep messages under 100 words",
      "Add Clear CTA buttons",
      "Post 1 status daily"
    ],
    contentSplit: "Status updates drive 90% engagement",
    workedFailed: {
      worked: ["Exclusive codes", "Behind scenes"],
      failed: ["Long threads", "Link dumping"]
    },
    loyalFollowers: [
      { img: 'https://i.pravatar.cc/150?u=wa1' },
      { img: 'https://i.pravatar.cc/150?u=wa2' },
    ],
    aiCommand: "Update your status with a 'link in bio' to drive external traffic"
  }
};

export default function AccountInsightsPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveData, setLiveData] = useState(null);

  const config = useMemo(() => PLATFORM_CONFIG[accountId] || PLATFORM_CONFIG.instagram, [accountId]);
  
  // Base data (Fallback)
  const baseAcc = useMemo(() => ACCOUNTS_DATA[accountId] || ACCOUNTS_DATA.instagram, [accountId]);

  // Merge Live Data into UI structure
  const acc = useMemo(() => {
    if (!liveData) return baseAcc;
    
    return {
      ...baseAcc,
      name: liveData.profile.username || baseAcc.name,
      followers: liveData.profile.followers || baseAcc.followers,
      viralPosts: liveData.posts?.length > 0 
        ? liveData.posts.slice(0, 2).map(p => ({
            id: p.post_id,
            title: p.caption.slice(0, 30) + '...',
            thumb: p.permalink
          }))
        : baseAcc.viralPosts,
      // We can augment more fields as we add more API features
    };
  }, [baseAcc, liveData]);

  const [selectedType, setSelectedType] = useState(config.types[0].id);

  const fetchAccountData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, token comes from AuthContext
      const token = localStorage.getItem(`${accountId}_token`) || 'DEMO_TOKEN';
      const data = await platformService.syncAccountData(accountId, token, 'user_123');
      setLiveData(data);
    } catch (err) {
      console.error("Sync Error:", err);
      // For demo purposes, we don't block the UI on error, just keep base data
      // but we could set an error state if needed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [accountId]);

  // Sync selectedType if platform changes
  useEffect(() => {
    setSelectedType(config.types[0].id);
  }, [config]);

  if (isLoading && !liveData) {
    return (
      <div className="aip__loading">
        <Loader2 className="aip--spin" size={48} />
        <p>Syncing with your {accountId} profile...</p>
      </div>
    );
  }

  return (
    <div className="aip" style={{ '--p-accent': config.accent, '--p-gradient': config.gradient }}>
      <div className="aip__particles"></div>
      
      <nav className="aip__nav">
        <button className="aip__back-btn" onClick={() => navigate('/scan')}>
          <ArrowLeft size={16} /> Diagnostic Station
        </button>
      </nav>

      <div className="aip__bento">
        
        {/* 1. Account Summary (FIXED OVERFLOW) */}
        <div className="aip__c aip__c--summary g-card animate-slide-up">
           <div className="aip__c-label">{accountId === 'youtube' ? 'Channel Pulse' : 'Overview'}</div>
           <div className="aip__header">
              <div className="aip__avatar" style={{ background: acc.gradient }}>{acc.name[0]}</div>
              <div className="aip__header-meta">
                 <h3 style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                   {acc.name} 
                   {accountId === 'twitter' && <BadgeCheck size={14} fill="#1DA1F2" color="#fff" />}
                 </h3>
                 <p>{acc.username}</p>
              </div>
           </div>
           
           <div className="aip__ov-main">
              <div className="aip__ov-count">
                 {acc.followers.toLocaleString()}
                 <span className="aip__ov-growth-arrow"><ArrowUp size={14} /></span>
              </div>
              <div className="aip__ov-label">{(accountId === 'youtube' || accountId === 'telegram' || accountId === 'whatsapp') ? 'Subscribers' : accountId === 'facebook' ? 'Page Likes' : 'Current Fans'}</div>
           </div>

           <div className="aip__ov-tags">
              <div className="aip__ov-tag">
                 <Sparkles size={10} />
                 <span>{acc.growthLabel} · {acc.summaryText}</span>
              </div>
           </div>
        </div>

        {/* 2. Top Content */}
        <div className="aip__c aip__c--viral g-card animate-slide-up" style={{ animationDelay: '0.05s' }}>
           <div className="aip__c-label">Top Content</div>
           <div className="aip__v-list">
              {acc.viralPosts.map(p => (
                <div key={p.id} className="aip__v-item">
                   <img src={p.thumb} alt="" />
                   <div className="aip__v-data">{p.title}</div>
                </div>
              ))}
           </div>
        </div>

        {/* 3. Active Time */}
        <div className="aip__c aip__c--active g-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
           <div className="aip__c-label">When to post</div>
           <div className="aip__active-time">
              <Clock size={36} className="aip__glow-icon" />
              <p>{acc.activeTime}</p>
           </div>
        </div>

        {/* 4. Time Mismatch */}
        <div className="aip__c aip__c--gap g-card animate-slide-up" style={{ animationDelay: '0.15s' }}>
           <div className="aip__c-label">Time Mismatch</div>
           <div className="aip__gap-viz">
              <div className="aip__gap-bar">
                 <div className="aip__gap-marker aip__gap-marker--user" style={{ left: `${(acc.postingGap.userTime/24)*100}%` }}>You</div>
                 <div className="aip__gap-marker aip__gap-marker--aud" style={{ left: `${(acc.postingGap.audienceTime/24)*100}%` }}>Fans</div>
              </div>
           </div>
           <p className="aip__gap-txt">{acc.postingGap.text}</p>
        </div>

        {/* 5. Golden Slots */}
        <div className="aip__c aip__c--best g-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
           <div className="aip__c-label">Golden Slots</div>
           <div className="aip__best-list">
              {acc.bestTime.map((t, i) => (
                <div key={i} className="aip__best-item">
                   <t.icon size={12} /> <span>{t.type}: <strong>{t.time}</strong></span>
                </div>
              ))}
           </div>
        </div>

        {/* 6. What Works */}
        <div className="aip__c aip__c--dna g-card animate-slide-up" style={{ animationDelay: '0.25s' }}>
           <div className="aip__c-label">What works</div>
           <p className="aip__dna-txt">{acc.viralDNA}</p>
        </div>

        {/* 7. Fan Journey */}
        <div className="aip__c aip__c--flow g-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
           <div className="aip__c-label">Fan Journey</div>
           <FanJourney funnel={acc.funnel} />
        </div>

        {/* 8. AI Story */}
        <div className="aip__c aip__c--story g-card animate-slide-up" style={{ animationDelay: '0.35s' }}>
           <div className="aip__c-label">AI Story</div>
           <div className="aip__story-content">
              <TypingText text={acc.aiStory} />
           </div>
        </div>

        {/* 9. Competitor Section */}
        <div className="aip__c aip__c--comp g-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
           <div className="aip__c-label">Others in your niche</div>
           <div className="aip__comp-list">
              {acc.competitors.map((c, i) => (
                <div key={i} className={`aip__comp-item ${c.name === 'YOU' ? 'aip--highlight' : ''}`}>
                   <span>{c.name}</span> <span>{c.freq}</span>
                </div>
              ))}
           </div>
        </div>

        {/* 10. Action Items */}
        <div className="aip__c aip__c--imp g-card animate-slide-up" style={{ animationDelay: '0.45s' }}>
           <div className="aip__c-label">Action Items</div>
           <ul className="aip__imp-list">
              {acc.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
           </ul>
        </div>

        {/* 11. Best Reach */}
        <div className="aip__c aip__c--split g-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
           <div className="aip__c-label">Best Reach</div>
           <p className="aip__split-txt">{acc.contentSplit}</p>
        </div>

        {/* 12. Audit (Worked vs Didn't) */}
        <div className="aip__c aip__c--wf g-card animate-slide-up" style={{ animationDelay: '0.55s' }}>
           <div className="aip__c-label"><Users size={12} /> {accountId === 'youtube' ? 'Subscribers' : 'Followers'}</div>
           <div className="aip__wf-box">
              <div className="aip__wf-col">
                 <div className="aip__wf-head">Worked ✅</div>
                 {acc.workedFailed.worked.map((w, i) => <p key={i}>{w}</p>)}
              </div>
              <div className="aip__wf-col">
                 <div className="aip__wf-head">Didn't ❌</div>
                 {acc.workedFailed.failed.map((f, i) => <p key={i}>{f}</p>)}
              </div>
           </div>
        </div>

        {/* 13. Loyal Followers */}
        <div className="aip__c aip__c--loyal g-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
           <div className="aip__c-label">Loyal Fans</div>
           <div className="aip__loyal-list">
              {acc.loyalFollowers.map((l, i) => <img key={i} src={l.img} alt="" />)}
           </div>
        </div>

        {/* 14. AI Command Bar */}
        <div className="aip__c aip__c--command g-card animate-slide-up" style={{ animationDelay: '0.65s' }}>
           <div className="aip__command-content">
              <Sparkles size={16} className="aip--pulse" />
              <span>{acc.aiCommand}</span>
           </div>
        </div>

      </div>

      {/* Floating Create Section */}
      <div className="aip__create-fab">
        <div className="aip__toggle-group">
          {config.types.map(opt => (
            <button 
              key={opt.id} 
              className={`aip__toggle-btn ${selectedType === opt.id ? 'aip__toggle-btn--active' : ''}`}
              onClick={() => setSelectedType(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button 
          className="aip__create-btn"
          onClick={() => navigate(`/create/${selectedType}?accountId=${accountId}`)}
        >
          <Plus size={20} />
          <span>Create</span>
        </button>
      </div>
    </div>
  );
}
