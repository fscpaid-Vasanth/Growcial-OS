import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  Settings as SettingsIcon,
  Camera,
  Send,
  Globe,
  Languages,
  Save,
  Check,
  Link2,
  AlertCircle,
  Crown,
  Zap,
  Shield,
} from 'lucide-react';
import './SettingsPage.css';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    color: 'green',
    features: ['2 ideas/day', 'Basic insights', 'Telegram share'],
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '₹499',
    period: '/month',
    color: 'yellow',
    features: ['10 ideas/day', 'Script + hooks', 'Basic analytics', 'Telegram auto-post'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹999',
    period: '/month',
    color: 'purple',
    recommended: true,
    features: ['Unlimited ideas', 'Advanced insights', 'Location + Language AI', 'Multi-platform', 'Priority AI'],
  },
  {
    id: 'business',
    name: 'Business',
    price: '₹1,999',
    period: '/month',
    color: 'pink',
    features: ['Multiple accounts', 'Team usage', 'Advanced analytics', 'Full automation'],
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [location, setLocation] = useState(user?.location || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [telegramChatId, setTelegramChatId] = useState(user?.telegramChatId || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [igStatus, setIgStatus] = useState(user?.instagramConnected ? 'connected' : 'disconnected');

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        location,
        language,
        telegramChatId,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleConnectInstagram = () => {
    // In production, this would redirect to Facebook OAuth
    alert('Instagram connection will redirect to Facebook OAuth.\nPlease configure your Facebook App credentials in the .env file.');
  };

  return (
    <div className="settings">
      <div className="page-header">
        <h1>
          <span className="text-gradient">Settings</span>{' '}
          <SettingsIcon size={24} className="settings__header-icon" />
        </h1>
        <p>Configure your integrations, profile, and preferences</p>
      </div>

      <div className="settings__grid">
        {/* Profile Section */}
        <div className="settings__section glass-card">
          <h3 className="settings__section-title">
            <Globe size={18} />
            Profile & Preferences
          </h3>

          <div className="settings__form">
            <div className="settings__field">
              <label>
                <Globe size={14} /> Location
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Chennai, Mumbai, Delhi..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <span className="settings__field-hint">Used for localized trends and regional content</span>
            </div>

            <div className="settings__field">
              <label>
                <Languages size={14} /> Preferred Language
              </label>
              <select
                className="input-field"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="hi">Hindi</option>
                <option value="te">Telugu</option>
                <option value="ml">Malayalam</option>
                <option value="kn">Kannada</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
              <span className="settings__field-hint">AI will generate content in this language</span>
            </div>
          </div>
        </div>

        {/* Instagram Integration */}
        <div className="settings__section glass-card">
          <h3 className="settings__section-title">
            <Camera size={18} />
            Instagram Integration
          </h3>

          <div className="settings__integration">
            <div className={`settings__status settings__status--${igStatus}`}>
              {igStatus === 'connected' ? (
                <>
                  <Check size={16} />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Not Connected</span>
                </>
              )}
            </div>
            <p className="settings__integration-desc">
              Connect your Instagram Business/Creator account to fetch post data,
              engagement metrics, and enable auto-posting.
            </p>
            <button
              className={`btn ${igStatus === 'connected' ? 'btn-ghost' : 'btn-primary'}`}
              onClick={handleConnectInstagram}
              id="connect-instagram-btn"
            >
              <Link2 size={16} />
              <span>{igStatus === 'connected' ? 'Reconnect' : 'Connect Instagram'}</span>
            </button>
          </div>
        </div>

        {/* Telegram Integration */}
        <div className="settings__section glass-card">
          <h3 className="settings__section-title">
            <Send size={18} />
            Telegram Integration
          </h3>

          <div className="settings__form">
            <div className="settings__field">
              <label>Telegram Chat ID</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., 123456789"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
              />
              <span className="settings__field-hint">
                Start our bot <strong>@GrowcialOSBot</strong> on Telegram, then paste your Chat ID here
              </span>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="settings__section glass-card">
          <h3 className="settings__section-title">
            <Shield size={18} />
            Account
          </h3>
          <div className="settings__account">
            <div className="settings__account-row">
              <span className="settings__account-label">Email</span>
              <span className="settings__account-value">{user?.email || '—'}</span>
            </div>
            <div className="settings__account-row">
              <span className="settings__account-label">Name</span>
              <span className="settings__account-value">{user?.displayName || '—'}</span>
            </div>
            <div className="settings__account-row">
              <span className="settings__account-label">Current Plan</span>
              <span className="badge badge-primary">{user?.plan || 'Free'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings__save-bar">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSave}
          disabled={saving}
          id="save-settings-btn"
        >
          {saved ? (
            <><Check size={18} /> Saved!</>
          ) : saving ? (
            <><span className="spin"><Save size={18} /></span> Saving...</>
          ) : (
            <><Save size={18} /> Save Settings</>
          )}
        </button>
      </div>

      {/* Pricing */}
      <div className="settings__pricing">
        <h3 className="settings__pricing-title">
          <Crown size={20} />
          Upgrade Your Plan
        </h3>
        <p className="settings__pricing-desc">Unlock more AI power and features</p>

        <div className="settings__plans stagger-children">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card glass-card plan-card--${plan.color} ${plan.recommended ? 'plan-card--recommended' : ''} ${user?.plan === plan.id ? 'plan-card--current' : ''}`}
            >
              {plan.recommended && (
                <div className="plan-card__badge">
                  <Zap size={12} /> Recommended
                </div>
              )}
              <div className="plan-card__name">{plan.name}</div>
              <div className="plan-card__price">
                {plan.price}
                {plan.period && <span>{plan.period}</span>}
              </div>
              <ul className="plan-card__features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <Check size={14} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`btn ${user?.plan === plan.id ? 'btn-ghost' : 'btn-primary'} plan-card__btn`}
                disabled={user?.plan === plan.id}
              >
                {user?.plan === plan.id ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
