import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { aiRouter } from './routes/ai.js';
import { instagramRouter } from './routes/instagram.js';
import { telegramRouter } from './routes/telegram.js';
import { youtubeRouter } from './routes/youtube.js';
import { twitterRouter } from './routes/twitter.js';
import { facebookRouter } from './routes/facebook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('<h1>🚀 Growcial OS API is Running</h1><p>Visit <a href="/api/health">/api/health</a> for status.</p>');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Growcial OS API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/ai', aiRouter);
app.use('/api/instagram', instagramRouter);
app.use('/api/telegram', telegramRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/twitter', twitterRouter);
app.use('/api/facebook', facebookRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Growcial OS API running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
