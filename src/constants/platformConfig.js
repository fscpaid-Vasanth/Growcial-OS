export const PLATFORM_CONFIG = {
  instagram: {
    accent: '#ec4899',
    gradient: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
    types: [
      { id: 'post', label: 'Post', format: '1:1' },
      { id: 'story', label: 'Story', format: '9:16' },
      { id: 'reel', label: 'Reel', format: '9:16' }
    ],
    ai: {
      hooks: ["Stop scrolling if you want to...", "The secret to 10k followers is...", "3 AI tools you've never heard of"],
      hashtags: ["#AIRevolution", "#CreativeTech", "#MarketingTips", "#ViralReels"],
      tagline: "The Future of Content Creation is here 🚀"
    }
  },
  youtube: {
    accent: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000, #CC0000)',
    types: [
      { id: 'video', label: 'Video', format: '16:9' },
      { id: 'short', label: 'Short', format: '9:16' },
      { id: 'community', label: 'Community', format: '1:1' }
    ],
    ai: {
      titles: ["How to scale your channel fast", "The honest truth about YouTube", "3 Secrets of top creators"],
      thumbnails: ["High contrast image with neon text", "Close-up of emotion + value prop", "Split screen comparison shot"],
      description: "In this session, we dive deep into the world of smart content creation..."
    }
  },
  facebook: {
    accent: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2, #0C5DC7)',
    types: [
      { id: 'post', label: 'Post', format: '1:1' },
      { id: 'story', label: 'Story', format: '9:16' },
      { id: 'reel', label: 'Reel', format: '9:16' }
    ],
    ai: {
      hooks: ["Is your business ready for 2024?", "Why community is your secret weapon", "The 5-step growth framework"],
      hashtags: ["#SmallBizTips", "#FacebookGrowth", "#MarketingMindset"],
      tagline: "Connect with your audience where they live 💙"
    }
  },
  twitter: {
    accent: '#1DA1F2',
    gradient: 'linear-gradient(135deg, #1DA1F2, #0C85D0)',
    types: [
      { id: 'tweet', label: 'Tweet', format: 'Auto' },
      { id: 'thread', label: 'Thread', format: 'Auto' },
      { id: 'media', label: 'Media Post', format: '16:9' }
    ],
    ai: {
      captions: ["Modern problems require modern solutions.", "One thread = Infinite reach. 🧵", "Why I'm betting big on AI."],
      threads: ["Start with: 'I studied 100 top creators...'", "Use a numbered list for the 5 key points", "End with a CTA: 'Follow for more insights'"],
      hashtags: ["#BuildInPublic", "#SaaS", "#Creators"]
    }
  },
  telegram: {
    accent: '#0088cc',
    gradient: 'linear-gradient(135deg, #0088cc, #006699)',
    types: [
      { id: 'post', label: 'Channel Post', format: 'Auto' },
      { id: 'story', label: 'Story', format: '9:16' }
    ],
    ai: {
      hooks: ["Direct from the vault...", "Wait until the end for the link", "Daily AI insight for you"],
      tagline: "Join the conversation in our secure channel 🛰️"
    }
  },
  whatsapp: {
    accent: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366, #128C7E)',
    types: [
      { id: 'status', label: 'Status', format: '9:16' },
      { id: 'broadcast', label: 'Broadcast', format: 'Auto' }
    ],
    ai: {
      hooks: ["Exclusive update for my community", "Click below to join the private group", "New content drop! Check the bio"],
      tagline: "Direct growth, one message at a time 📲"
    }
  }
};
