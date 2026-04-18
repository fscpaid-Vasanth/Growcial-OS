import { Router } from 'express';
import { getProfile, getMedia, getMediaInsights, transformToPost, publishToInstagram } from '../services/igService.js';

export const instagramRouter = Router();

// ... existing sync/profile routes ...

/**
 * POST /api/instagram/publish
 * Publish content to Instagram
 */
instagramRouter.post('/publish', async (req, res) => {
  try {
    const { accessToken, userId, mediaUrl, caption } = req.body;

    if (!accessToken || !mediaUrl) {
      return res.status(400).json({ error: 'AccessToken and MediaUrl are required' });
    }

    const result = await publishToInstagram(userId, accessToken, mediaUrl, caption);

    res.json({
      success: true,
      mediaId: result.id,
      publishedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Instagram publish error:', error);
    res.status(500).json({
      success: false,
      error: 'Publishing failed',
      message: error.message
    });
  }
});

/**
 * POST /api/instagram/sync
 * Sync Instagram data to Smart Database
 */
instagramRouter.post('/sync', async (req, res) => {
  try {
    const { accessToken, userId } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Instagram access token is required' });
    }

    // Fetch profile
    const profile = await getProfile(accessToken);

    // Fetch media
    const mediaResponse = await getMedia(accessToken, 25);
    const mediaItems = mediaResponse.data || [];

    // Transform to internal format
    const posts = await Promise.all(
      mediaItems.map(async (item) => {
        let insights = null;
        try {
          insights = await getMediaInsights(item.id, accessToken);
        } catch (e) {
          // Some media types don't support insights
        }
        return transformToPost(item, userId, insights);
      })
    );

    res.json({
      success: true,
      profile: {
        username: profile.username,
        followers: profile.followers_count,
        mediaCount: profile.media_count,
      },
      posts,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Instagram sync error:', error);
    res.status(500).json({
      error: 'Instagram sync failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/instagram/profile
 * Fetch Instagram profile data
 */
instagramRouter.get('/profile', async (req, res) => {
  try {
    const { accessToken } = req.query;
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }
    const profile = await getProfile(accessToken);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
