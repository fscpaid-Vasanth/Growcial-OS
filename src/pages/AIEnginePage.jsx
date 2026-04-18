import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Brain,
  Sparkles,
  Lightbulb,
  FileText,
  Hash,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Send,
  Loader2,
  Globe,
  Languages,
  Wand2,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import './AIEnginePage.css';

const CONTENT_TYPES = [
  { id: 'ideas', label: 'Content Ideas', icon: Lightbulb, desc: 'Fresh viral-worthy ideas' },
  { id: 'hooks', label: 'Hooks & Openers', icon: Wand2, desc: 'Attention-grabbing first lines' },
  { id: 'scripts', label: 'Full Scripts', icon: FileText, desc: 'Complete reel/post scripts' },
  { id: 'hashtags', label: 'Hashtag Sets', icon: Hash, desc: 'Optimized hashtag combos' },
  { id: 'timing', label: 'Best Timing', icon: Clock, desc: 'When to post for max reach' },
];

const NICHES = [
  'Tech', 'Finance', 'Fitness', 'Food', 'Travel', 'Education', 'Fashion',
  'Gaming', 'Motivation', 'Comedy', 'Business', 'Lifestyle', 'Health', 'Art',
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'Tamil' },
  { code: 'hi', label: 'Hindi' },
  { code: 'te', label: 'Telugu' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'kn', label: 'Kannada' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
];

export default function AIEnginePage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('ideas');
  const [niche, setNiche] = useState('');
  const [customNiche, setCustomNiche] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [additionalContext, setAdditionalContext] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleGenerate = async () => {
    const selectedNiche = niche === 'custom' ? customNiche : niche;
    if (!selectedNiche) return;

    setLoading(true);
    setResults([]);

    try {
      // Call our backend API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          niche: selectedNiche,
          location,
          language,
          additionalContext,
          userId: user?.uid,
        }),
      });

      if (!response.ok) {
        // Fallback: Generate demo results for preview
        const demoResults = generateDemoResults(selectedType, selectedNiche, language);
        setResults(demoResults);
        return;
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('AI generation error:', err);
      // Fallback demo results
      const demoResults = generateDemoResults(selectedType, selectedNiche, language);
      setResults(demoResults);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (resultId, feedback) => {
    try {
      await addDoc(collection(db, 'feedback'), {
        user_id: user?.uid,
        suggestion_id: resultId,
        type: selectedType,
        feedback, // 'good' or 'poor'
        niche: niche === 'custom' ? customNiche : niche,
        createdAt: serverTimestamp(),
      });

      setResults((prev) =>
        prev.map((r) => (r.id === resultId ? { ...r, userFeedback: feedback } : r))
      );
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="ai-engine">
      <div className="page-header">
        <h1>
          <span className="text-gradient">Growcial Intelligence Engine</span>{' '}
          <Brain className="ai-engine__brain-icon" size={28} />
        </h1>
        <p>Your self-learning AI that generates viral content strategies</p>
      </div>

      {/* Content Type Selector */}
      <div className="ai-engine__types stagger-children">
        {CONTENT_TYPES.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            className={`ai-type-card glass-card ${selectedType === id ? 'ai-type-card--active' : ''}`}
            onClick={() => setSelectedType(id)}
          >
            <Icon size={20} />
            <div className="ai-type-card__label">{label}</div>
            <div className="ai-type-card__desc">{desc}</div>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="ai-engine__input glass-card">
        <div className="ai-input__grid">
          {/* Niche */}
          <div className="ai-input__field">
            <label>Your Niche</label>
            <div className="ai-input__select-wrap">
              <select
                className="input-field"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                id="niche-select"
              >
                <option value="">Select your niche...</option>
                {NICHES.map((n) => (
                  <option key={n} value={n.toLowerCase()}>{n}</option>
                ))}
                <option value="custom">Custom...</option>
              </select>
              <ChevronDown size={16} className="ai-input__select-icon" />
            </div>
            {niche === 'custom' && (
              <input
                type="text"
                className="input-field"
                placeholder="Enter your niche..."
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                style={{ marginTop: 8 }}
              />
            )}
          </div>

          {/* Location */}
          <div className="ai-input__field">
            <label>
              <Globe size={14} /> Location
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Chennai, Mumbai, New York..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Language */}
          <div className="ai-input__field">
            <label>
              <Languages size={14} /> Language
            </label>
            <div className="ai-input__select-wrap">
              <select
                className="input-field"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                id="language-select"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="ai-input__select-icon" />
            </div>
          </div>

          {/* Context */}
          <div className="ai-input__field ai-input__field--full">
            <label>Additional Context (optional)</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Tell AI about your style, audience, goals... (e.g., 'My audience is 18-25 college students')"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg ai-engine__generate-btn"
          onClick={handleGenerate}
          disabled={loading || (!niche && !customNiche)}
          id="generate-btn"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="ai-loading">
          <div className="ai-loading__pulse"></div>
          <p>Growcial Intelligence Engine is thinking...</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="ai-results">
          <h3 className="ai-results__title">
            <Sparkles size={18} />
            Generated Results
            <span className="badge badge-success">{results.length} items</span>
          </h3>
          <div className="ai-results__list stagger-children">
            {results.map((result) => (
              <div key={result.id} className="ai-result-card glass-card">
                <div className="ai-result-card__content">
                  <h4>{result.title}</h4>
                  <p>{result.content}</p>
                  {result.hashtags && (
                    <div className="ai-result-card__tags">
                      {result.hashtags.map((tag, i) => (
                        <span key={i} className="badge badge-primary">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ai-result-card__actions">
                  <button
                    className={`ai-feedback-btn ai-feedback-btn--good ${result.userFeedback === 'good' ? 'ai-feedback-btn--selected' : ''}`}
                    onClick={() => handleFeedback(result.id, 'good')}
                    aria-label="Good suggestion"
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <button
                    className={`ai-feedback-btn ai-feedback-btn--poor ${result.userFeedback === 'poor' ? 'ai-feedback-btn--selected' : ''}`}
                    onClick={() => handleFeedback(result.id, 'poor')}
                    aria-label="Poor suggestion"
                  >
                    <ThumbsDown size={16} />
                  </button>
                  <button
                    className="ai-feedback-btn ai-feedback-btn--copy"
                    onClick={() => handleCopy(result.content, result.id)}
                    aria-label="Copy content"
                  >
                    {copiedId === result.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Demo fallback results when backend is not connected
function generateDemoResults(type, niche, language) {
  const templates = {
    ideas: [
      { title: '🔥 Trending Topic', content: `Top 5 myths about ${niche} that nobody talks about — debunk them one by one with proof.` },
      { title: '📊 Data-Driven', content: `Show "before vs after" transformation in ${niche} — use split-screen format for maximum impact.` },
      { title: '🎯 Relatable', content: `"POV: You just started your ${niche} journey" — show the struggles and wins that your audience relates to.` },
      { title: '💡 Educational', content: `3 free tools for ${niche} that most people don't know about. Save this for later!` },
      { title: '🚀 Challenge', content: `30-day ${niche} challenge — document Day 1 and ask followers to join. Build community engagement.` },
    ],
    hooks: [
      { title: '⚡ Pattern Interrupt', content: `"Stop scrolling. If you're into ${niche}, this will change everything..."` },
      { title: '🤯 Shock Value', content: `"I spent ₹50,000 on ${niche} so you don't have to. Here's what actually works..."` },
      { title: '❓ Question Hook', content: `"Why does nobody talk about this ${niche} secret? Let me show you..."` },
      { title: '📢 Bold Statement', content: `"${niche} is dead. Here's what's replacing it in 2026..."` },
      { title: '🎬 Story Hook', content: `"2 years ago I knew nothing about ${niche}. Today I... (wait for it)"` },
    ],
    scripts: [
      { title: '📱 60-Second Reel Script', content: `[HOOK]: "This ${niche} hack saved me 10 hours a week..."\n[BODY]: Step 1 — Show the problem. Step 2 — Reveal your method with screen recording. Step 3 — Show results.\n[CTA]: "Follow for more ${niche} tips. Save this reel!"` },
      { title: '🎥 Talking Head Script', content: `[INTRO]: "If you're struggling with ${niche}, watch this."\n[POINT 1]: Common mistake people make.\n[POINT 2]: What experts actually do differently.\n[POINT 3]: The one thing you should start TODAY.\n[CTA]: "Comment 'GUIDE' and I'll send you my full strategy."` },
    ],
    hashtags: [
      { title: '🏆 High-Reach Set', content: `#${niche} #${niche}tips #viral #trending #growthhacking`, hashtags: [`#${niche}`, `#${niche}tips`, '#viral', '#trending', '#growthhacking'] },
      { title: '🎯 Niche-Specific Set', content: `#${niche}community #${niche}lover #${niche}life #daily${niche}`, hashtags: [`#${niche}community`, `#${niche}lover`, `#${niche}life`, `#daily${niche}`] },
    ],
    timing: [
      { title: '☀️ Morning Sweet Spot', content: `Best posting time for ${niche}: 8:00 AM – 9:30 AM (your local timezone). Engagement peaks as people check phones during commute.` },
      { title: '🌙 Evening Peak', content: `Second best: 7:00 PM – 9:00 PM. Users are relaxing after work/school — highest save & share rates.` },
      { title: '📅 Best Days', content: `For ${niche}: Tuesday, Thursday, Saturday perform best. Avoid Monday mornings and Friday nights.` },
    ],
  };

  const items = templates[type] || templates.ideas;
  return items.map((item, i) => ({
    id: `demo-${type}-${i}`,
    ...item,
    userFeedback: null,
  }));
}
