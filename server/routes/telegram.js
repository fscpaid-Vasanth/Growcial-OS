import { Router } from 'express';
import { sendMessage, sendAIReport, sendDailySummary } from '../services/telegramService.js';

export const telegramRouter = Router();

/**
 * POST /api/telegram/sync
 * Mock sync for Telegram Channel/Bot
 */
telegramRouter.post('/sync', async (req, res) => {
  try {
    const { accessToken, userId } = req.body;

    // Fetch mock profile info
    res.json({
      success: true,
      profile: {
        username: "growcial_channel",
        name: "Growcial OS Official",
        followers: 24500,
        syncedAt: new Date().toISOString()
      },
      posts: [
        { post_id: 'tg1', caption: 'AI Mastery Course Launch', date: new Date().toISOString() }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Telegram sync failed' });
  }
});

/**
 * POST /api/telegram/publish
 * Send a message/update to Telegram
 */
telegramRouter.post('/publish', async (req, res) => {
  try {
    const { chatId, caption } = req.body;
    const result = await sendMessage(chatId || process.env.TELEGRAM_CHAT_ID, caption);
    res.json({ success: true, messageId: result.result.message_id });
  } catch (error) {
    res.status(500).json({ error: 'Telegram publish failed', message: error.message });
  }
});
