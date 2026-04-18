import { Router } from 'express';
import { getPageProfile, getPageFeed, publishToPage, transformToFBPost } from '../services/fbService.js';

export const facebookRouter = Router();

/**
 * POST /api/facebook/sync
 * Sync Facebook Page data and feed
 */
facebookRouter.post('/sync', async (req, res) => {
  try {
    const { accessToken, userId } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Facebook access token is required' });
    }

    // Fetch profile
    const profile = await getPageProfile(accessToken);

    // Fetch feed
    const feed = await getPageFeed(accessToken, 10);

    // Transform to internal format
    const posts = feed.map(f => transformToFBPost(f, userId));

    res.json({
      success: true,
      profile: {
        username: profile.name,
        name: profile.name,
        followers: profile.followers_count,
        likes: profile.fan_count,
        avatar: profile.picture.data.url
      },
      posts,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Facebook sync error:', error);
    res.status(500).json({
      error: 'Facebook sync failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/facebook/publish
 * Publish content to Facebook Page
 */
facebookRouter.post('/publish', async (req, res) => {
  try {
    const { accessToken, userId, caption, mediaUrl } = req.body;

    if (!accessToken || !caption) {
      return res.status(400).json({ error: 'AccessToken and Caption (Message) are required' });
    }

    const result = await publishToPage(accessToken, { message: caption, link: mediaUrl });

    res.json({
      success: true,
      postId: result.id,
      publishedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Facebook publish error:', error);
    res.status(500).json({
      success: false,
      error: 'Facebook publishing failed',
      message: error.message
    });
  }
});
