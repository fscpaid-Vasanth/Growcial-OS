import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { aiService } from '../services/aiService';
import { platformService } from '../services/platformService';
import { 
  ArrowLeft, Upload, Image as ImageIcon, Film, Layers, Sparkles, Hash, 
  Send, Video as VideoIcon, Zap, Check, Plus, Clock, Youtube, Twitter, Facebook, Instagram,
  Play, MessageSquare, Info, XCircle, Loader2, RotateCcw, CheckCircle2, PartyPopper
} from 'lucide-react';
import { PLATFORM_CONFIG } from '../constants/platformConfig';
import './CreateStudioPage.css';

export default function CreateStudioPage() {
  const { connectedPlatforms, user } = useAuth();
  const { type = 'post' } = useParams();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const config = useMemo(() => PLATFORM_CONFIG[accountId] || PLATFORM_CONFIG.instagram, [accountId]);
  const typeLabel = useMemo(() => {
    const found = config.types.find(t => t.id === type);
    return found ? found.label : type;
  }, [config, type]);

  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'

  const [isGenerating, setIsGenerating] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const suggestions = useMemo(() => liveSuggestions || config.ai, [config, liveSuggestions]);

  const [platforms, setPlatforms] = useState({
    instagram: accountId === 'instagram',
    facebook: accountId === 'facebook',
    youtube: accountId === 'youtube',
    twitter: accountId === 'twitter'
  });

  const [postMode, setPostMode] = useState('now');
  const [format, setFormat] = useState(() => {
    const found = config.types.find(t => t.id === type);
    return found ? found.format : (type === 'reel' ? '9:16' : '1:1');
  });

  const handlePublish = async () => {
    if (!mediaUrl) return alert("Please upload media first");
    if (isPublishing) return;

    setIsPublishing(true);
    try {
      const token = localStorage.getItem(`${accountId}_token`) || 'DEMO_TOKEN';
      
      const payload = {
        accessToken: token,
        userId: user?.uid || 'user_demo',
        mediaUrl,
        caption
      };

      await platformService.publishContent(accountId, payload);
      
      setPublishSuccess(true);
      setTimeout(() => {
        navigate(`/insights/${accountId}`);
      }, 3500);
    } catch (err) {
      console.error("Publish Error:", err);
      alert("Publishing failed. Please check your account connection.");
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    const found = config.types.find(t => t.id === type);
    if (found) setFormat(found.format);
  }, [type, config]);

  const togglePlatform = (p) => setPlatforms(prev => ({ ...prev, [p]: !prev[p] }));

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) return alert("Unsupported file type");
    setMediaType(isImage ? 'image' : 'video');

    const localUrl = URL.createObjectURL(file);
    setMediaUrl(localUrl);
    uploadFile(file, localUrl);
  };

  const uploadFile = (file, localUrl) => {
    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `media/${user?.uid || 'guest'}_${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
        alert("Upload failed. Local preview remains but publishing might fail.");
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setMediaUrl(downloadURL);
        setIsUploading(false);
        URL.revokeObjectURL(localUrl);
      }
    );
  };

  const fetchIdeas = async () => {
    setIsGenerating(true);
    try {
      const results = await aiService.generateStudioContent({
        type: type,
        platform: accountId,
        niche: user?.niche || 'Digital Creator'
      });
      setLiveSuggestions(results);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [accountId, type]);

  const clearMedia = (e) => {
    e.stopPropagation();
    if (mediaUrl && mediaUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mediaUrl);
    }
    setMediaUrl(null);
    setMediaType(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="csp" style={{ '--p-accent': config.accent, '--p-gradient': config.gradient }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,video/*" onChange={handleFileChange} />
      <div className="g-bg"></div>
      <nav className="csp__nav">
        <button className="csp__back-btn" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to Insights</button>
        <div className="csp__title">Create Studio <Sparkles size={16} /></div>
      </nav>

      <div className="csp__grid">
        <section className="csp__panel csp__panel--left g-card">
          <div className="csp__panel-label">Media & Format</div>
          <div className="csp__type-badge">
             {type === 'reel' || type === 'short' ? <Film size={14} /> : type === 'story' ? <Layers size={14} /> : <ImageIcon size={14} />}
             <span>Create {typeLabel}</span>
          </div>
          <div className="csp__upload-area" onClick={!isUploading ? handleFileClick : undefined}>
             {!mediaUrl && isUploading && (
               <div className="csp__upload-status">
                  <div className="csp__loader-ring"><Loader2 className="csp--spin" size={32} /></div>
                  <p>Initializing... {Math.round(uploadProgress)}%</p>
               </div>
             )}
             {mediaUrl ? (
               <div className="csp__preview-box animate-scale-in">
                  <button className="csp__clear-btn" onClick={clearMedia}><XCircle size={18} /></button>
                  {mediaType === 'image' ? <img src={mediaUrl} alt="Preview" className="csp__preview-media" /> : <video src={mediaUrl} controls autoPlay muted className="csp__preview-media" />}
                  {isUploading && (
                    <div className="csp__progress-overlay">
                       <div className="csp__progress-mini-bar"><div style={{ width: `${uploadProgress}%` }}></div></div>
                       <span>{Math.round(uploadProgress)}% Uploading...</span>
                    </div>
                  )}
               </div>
             ) : !isUploading && (
               <div className="csp__upload-box">
                  <Upload size={32} />
                  <p>Drag or Upload Media</p>
                  <span>Recommended: {format === '9:16' ? '1080x1920' : format === '16:9' ? '1920x1080' : '1080x1080'}</span>
               </div>
             )}
          </div>
          <div className="csp__format-selector">
             <div className="csp__inner-label">Output Format</div>
             <div className="csp__formats">
                {['1:1', '9:16', '16:9'].map(f => (
                  <button key={f} className={`csp__format-btn ${format === f ? 'csp__format-btn--active' : ''}`} onClick={() => setFormat(f)}>{f}</button>
                ))}
             </div>
          </div>
        </section>

        <section className="csp__panel csp__panel--center g-card">
           <div className="csp__panel-label">Content Editor</div>
           <div className="csp__editor-box">
              <textarea className="csp__caption-input" placeholder="Write your caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
              {accountId === 'twitter' && (
                <div className={`csp__char-count ${caption.length > 280 ? 'csp__char-count--error' : ''}`}>
                  {caption.length}/280
                </div>
              )}
           </div>
           <div className={`csp__ai-suggestions ${isGenerating ? 'csp--generating' : ''}`}>
              <div className="csp__ai-header">
                <div className="csp__inner-label"><Sparkles size={12} /> AI Smart Ideas</div>
                <button className={`csp__refresh-btn ${isGenerating ? 'csp--generating' : ''}`} onClick={fetchIdeas} disabled={isGenerating}>
                  <RotateCcw size={14} className={isGenerating ? 'csp--spin' : ''} />
                </button>
              </div>
              {accountId === 'youtube' && (
                <>
                  <div className="csp__suggestion-group">
                     <div className="csp__suggestion-title">Viral Video Titles</div>
                     <div className="csp__suggestion-list">
                        {suggestions.titles?.map((h, i) => (
                          <button key={i} className="csp__suggestion-chip" onClick={() => setCaption(h + "\n\n" + caption)}>{h}</button>
                        ))}
                     </div>
                  </div>
                  <div className="csp__suggestion-group">
                     <div className="csp__suggestion-title">Thumbnail Strategy</div>
                     <div className="csp__thumb-ideas">
                        {suggestions.thumbnails?.map((idea, i) => (
                           <div key={i} className="csp__thumb-idea"><ImageIcon size={14} /> <span>{idea}</span></div>
                        ))}
                     </div>
                  </div>
                </>
              )}

              {accountId === 'twitter' && (
                <>
                  <div className="csp__suggestion-group">
                     <div className="csp__suggestion-title">Thread Hook Starters</div>
                     <div className="csp__suggestion-list">
                        {suggestions.captions?.map((h, i) => (
                          <button key={i} className="csp__suggestion-chip" onClick={() => setCaption(h)}>{h}</button>
                        ))}
                     </div>
                  </div>
                  <div className="csp__suggestion-group">
                     <div className="csp__suggestion-title">Thread Structure</div>
                     <div className="csp__thread-blueprint">
                        {suggestions.threads?.map((step, i) => (
                           <div key={i} className="csp__thread-step"><div className="csp__step-num">{i+1}</div><span>{step}</span></div>
                        ))}
                     </div>
                  </div>
                </>
              )}

              {(accountId === 'instagram' || accountId === 'facebook') && (
                <>
                  <div className="csp__suggestion-group">
                     <div className="csp__suggestion-title">Viral Hooks</div>
                     <div className="csp__suggestion-list">
                        {suggestions.hooks?.map((h, i) => (
                          <button key={i} className="csp__suggestion-chip" onClick={() => setCaption(h + " " + caption)}>{h}</button>
                        ))}
                     </div>
                  </div>
                  <div className="csp__suggestion-group">
                     <div className="csp__suggestion-title">Smart Tagline</div>
                     <div className="csp__tagline-box">
                        <p>{suggestions.tagline}</p>
                        <button onClick={() => setCaption(caption + "\n\n" + suggestions.tagline)}>Apply</button>
                     </div>
                  </div>
                </>
              )}
           </div>

           <div className="csp__edit-tools">
              <div className="csp__inner-label">Creative Tools</div>
              <div className="csp__tool-grid">
                 <button className="csp__tool-btn csp__tool-btn--canva">🎨 Edit in Canva</button>
                 <button className="csp__tool-btn csp__tool-btn--capcut">🎬 Edit in CapCut</button>
              </div>
           </div>

           <div className="csp__h-tags">
              <div className="csp__inner-label"><Hash size={12} /> Suggested Hashtags</div>
              <div className="csp__h-tag-list">
                 {suggestions.hashtags?.map((tag, i) => (
                   <span key={i} className="csp__h-chip">{tag} <Plus size={10} /></span>
                 ))}
              </div>
           </div>
        </section>

        <section className="csp__panel csp__panel--right g-card">
           <div className="csp__panel-label">Post Diagnostic</div>
           <div className="csp__insights-mini">
              <div className="csp__insight-item">
                 <div className="csp__insight-icon"><Clock size={14} /></div>
                 <div className="csp__insight-text"><p>Best Time: <strong>7:30 PM 🔥</strong></p><span>Audience is most active then</span></div>
              </div>
              <div className="csp__insight-item">
                 <div className="csp__insight-icon"><Zap size={14} /></div>
                 <div className="csp__insight-text"><p>Post Strength: <strong>82%</strong></p><div className="csp__score-bar"><div style={{ width: '82%' }}></div></div></div>
              </div>
           </div>

           <div className="csp__post-options">
              <div className="csp__mode-tabs">
                 <button className={`csp__mode-tab ${postMode === 'now' ? 'csp__mode-tab--active' : ''}`} onClick={() => setPostMode('now')}>Post Now</button>
                 <button className={`csp__mode-tab ${postMode === 'schedule' ? 'csp__mode-tab--active' : ''}`} onClick={() => setPostMode('schedule')}>Schedule</button>
              </div>
              {postMode === 'schedule' && (
                <div className="csp__schedule-box animate-fade-in"><input type="datetime-local" className="csp__date-picker" /></div>
              )}
           </div>

           <div className="csp__platforms">
              <div className="csp__inner-label">Publish Everywhere</div>
              <div className="csp__platform-grid">
                  {connectedPlatforms?.includes('instagram') && (
                    <button className={`csp__p-btn ${platforms.instagram ? 'csp__p-btn--active' : ''}`} onClick={() => togglePlatform('instagram')}><Instagram size={18} /></button>
                  )}
                  {connectedPlatforms?.includes('facebook') && (
                    <button className={`csp__p-btn ${platforms.facebook ? 'csp__p-btn--active' : ''}`} onClick={() => togglePlatform('facebook')}><Facebook size={18} /></button>
                  )}
                  {connectedPlatforms?.includes('youtube') && (
                    <button className={`csp__p-btn ${platforms.youtube ? 'csp__p-btn--active' : ''}`} onClick={() => togglePlatform('youtube')}><Youtube size={18} /></button>
                  )}
                  {connectedPlatforms?.includes('twitter') && (
                    <button className={`csp__p-btn ${platforms.twitter ? 'csp__p-btn--active' : ''}`} onClick={() => togglePlatform('twitter')}><Twitter size={18} /></button>
                  )}
              </div>
           </div>

           {/* ACTIONS MOVED HERE */}
           <div className="csp__actions-mini">
              <button className="csp__draft-btn">Save Draft</button>
              <button 
                className={`csp__publish-btn ${isPublishing ? 'csp--publishing' : ''}`}
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? <><Loader2 className="csp--spin" size={16} /> Pushing...</> : <><Send size={16} /> Publish Now</>}
              </button>
           </div>
        </section>
      </div>

      {/* SUCCESS OVERLAY */}
      {publishSuccess && (
        <div className="csp__success-overlay animate-fade-in">
           <div className="csp__success-card animate-scale-in">
              <div className="csp__success-icon"><PartyPopper size={48} /><CheckCircle2 size={24} className="csp__success-check" /></div>
              <h2>Target Locked & Published!</h2>
              <p>Your content is now live. We are calculating your viral trajectory...</p>
              <div className="csp__success-stats">
                 <div className="csp__success-stat"><span>Est. Reach</span><strong>12.5K</strong></div>
                 <div className="csp__success-stat"><span>Viral Chance</span><strong>92%</strong></div>
              </div>
              <div className="csp__success-loader"><div className="csp__success-loader-fill"></div></div>
           </div>
        </div>
      )}
    </div>
  );
}
