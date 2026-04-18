import { Router } from 'express';
import { generateContent } from '../services/aiService.js';

export const aiRouter = Router();

/**
 * POST /api/ai/generate
 * Generate AI-powered content suggestions using the Growcial Intelligence Engine
 */
aiRouter.post('/generate', async (req, res) => {
  try {
    const { type, niche, location, language, additionalContext, userId } = req.body;

    if (!niche) {
      return res.status(400).json({ error: 'Niche is required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Content type is required' });
    }

    // TODO: Fetch feedback history from Firestore for this user
    // This enables the self-learning loop
    const feedbackHistory = [];

    const results = await generateContent(
      type,
      niche,
      location,
      language,
      additionalContext,
      feedbackHistory
    );

    res.json({
      success: true,
      type,
      niche,
      results,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      error: 'AI generation failed',
      message: error.message,
    });
  }
});
