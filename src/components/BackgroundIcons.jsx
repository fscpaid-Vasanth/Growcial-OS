import { 
  InstagramIcon, 
  YoutubeIcon, 
  FaceBookIcon, 
  XTwitterIcon, 
  TikTokIcon, 
  TelegramIcon, 
  WhatsAppIcon,
  RocketIcon 
} from './SocialIcons';
import './BackgroundIcons.css';

const ICONS = [
  InstagramIcon, YoutubeIcon, FaceBookIcon, XTwitterIcon, 
  TikTokIcon, TelegramIcon, WhatsAppIcon, RocketIcon
];

export default function BackgroundIcons() {
  // Create 30 random social objects
  const seeds = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    Icon: ICONS[i % ICONS.length],
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    p1: i % 2 === 0 ? 'float-v' : 'float-h',
    p2: `${Math.random() * 20 + 20}s`,
    p3: `-${Math.random() * 40}s`,
    size: Math.random() * 40 + 40, // Large: 40px to 80px
    opacity: 0.45 // High visibility as requested
  }));

  return (
    <div className="bg-icons">
      {seeds.map((s) => (
        <div 
          key={s.id} 
          className={`bg-icon animate-${s.p1}`}
          style={{
            top: s.top,
            left: s.left,
            animationDuration: s.p2,
            animationDelay: s.p3,
            opacity: s.opacity
          }}
        >
          <s.Icon width={s.size} height={s.size} />
        </div>
      ))}
    </div>
  );
}
