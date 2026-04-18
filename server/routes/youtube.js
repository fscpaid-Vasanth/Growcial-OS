import { Router } from 'express';
import { getChannelProfile, getVideos, publishVideo, transformToYTPost } from '../services/ytService.js';

export const youtubeRouter = Router();

/**
 * POST /api/youtube/sync
 * Sync YouTube channel data and videos
 */
youtubeRouter.post('/sync', async (req, res) => {
  try {
    const { accessToken, userId } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'YouTube access token is required' });
    }

    // Fetch profile
    const profile = await getChannelProfile(accessToken);

    // Fetch videos
    const videos = await getVideos(accessToken, 10);

    // Transform to internal format
    const posts = videos.map(v => transformToYTPost(v, userId));

    res.json({
      success: true,
      profile: {
        username: profile.title,
        followers: profile.subscribers,
        videoCount: profile.videoCount,
        viewCount: profile.viewCount,
        avatar: profile.thumbnail
      },
      posts,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('YouTube sync error:', error);
    res.status(500).json({
      error: 'YouTube sync failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/youtube/publish
 * Publish content to YouTube (Shorts/Videos)
 */
youtubeRouter.post('/publish', async (req, res) => {
  try {
    const { accessToken, userId, mediaUrl, caption } = req.body;

    if (!accessToken || !mediaUrl) {
      return res.status(400).json({ error: 'AccessToken and MediaUrl are required' });
    }

    const result = await publishVideo(accessToken, { mediaUrl, caption });

    res.json({
      success: true,
      videoId: result.videoId,
      publishedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('YouTube publish error:', error);
    res.status(500).json({
      success: false,
      error: 'YouTube publishing failed',
      message: error.message
    });
  }
});
