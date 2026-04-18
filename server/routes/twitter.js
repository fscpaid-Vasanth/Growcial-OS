import { Router } from 'express';
import { getUserProfile, getTweets, publishTweet, transformToTWPost } from '../services/twService.js';

export const twitterRouter = Router();

/**
 * POST /api/twitter/sync
 * Sync Twitter profile data and tweets
 */
twitterRouter.post('/sync', async (req, res) => {
  try {
    const { accessToken, userId } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Twitter access token is required' });
    }

    // Fetch profile
    const profile = await getUserProfile(accessToken);

    // Fetch tweets
    const tweets = await getTweets(accessToken, 10);

    // Transform to internal format
    const posts = tweets.map(t => transformToTWPost(t, userId));

    res.json({
      success: true,
      profile: {
        username: profile.username,
        name: profile.name,
        followers: profile.followers_count,
        tweetCount: profile.tweet_count,
        verified: profile.verified,
        avatar: profile.profile_image_url
      },
      posts,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Twitter sync error:', error);
    res.status(500).json({
      error: 'Twitter sync failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/twitter/publish
 * Publish content to X (Tweet)
 */
twitterRouter.post('/publish', async (req, res) => {
  try {
    const { accessToken, userId, caption } = req.body;

    if (!accessToken || !caption) {
      return res.status(400).json({ error: 'AccessToken and Caption (Tweet text) are required' });
    }

    const result = await publishTweet(accessToken, caption);

    res.json({
      success: true,
      tweetId: result.id,
      publishedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Twitter publish error:', error);
    res.status(500).json({
      success: false,
      error: 'Twitter publishing failed',
      message: error.message
    });
  }
});
