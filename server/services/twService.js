import dotenv from 'dotenv';
dotenv.config();

/**
 * Twitter (X) API Service
 * Handles fetching user profile, tweets, and publishing
 */

const TW_API_BASE = 'https://api.twitter.com/2';

/**
 * Fetch Twitter User Profile
 */
export async function getUserProfile(accessToken) {
  // Mocking the behavior for development
  // In production: GET https://api.twitter.com/2/users/me?user.fields=public_metrics,verified
  return {
    id: "tw_user_123",
    username: "XCreator_AI",
    name: "X Growth Master",
    followers_count: 54321,
    tweet_count: 1205,
    verified: true,
    profile_image_url: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
  };
}

/**
 * Fetch Recent Tweets
 */
export async function getTweets(accessToken, maxResults = 10) {
  // In production: GET https://api.twitter.com/2/users/:id/tweets
  return [
    {
      id: "t1",
      text: "The future of AI is agentic. 🧵 Here is why...",
      public_metrics: { retweet_count: 45, reply_count: 12, like_count: 156, quote_count: 3 },
      created_at: new Date().toISOString()
    },
    {
      id: "t2",
      text: "Stop building features. Start building solutions.",
      public_metrics: { retweet_count: 89, reply_count: 5, like_count: 312, quote_count: 8 },
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];
}

/**
 * Publish Tweet
 */
export async function publishTweet(accessToken, text) {
  console.log("Publishing to X:", text);
  // POST https://api.twitter.com/2/tweets
  return {
    success: true,
    id: "tw_mock_" + Date.now(),
  };
}

/**
 * Transform Twitter data to internal post format
 */
export function transformToTWPost(tweet, userId) {
  return {
    user_id: userId,
    platform: 'twitter',
    post_id: tweet.id,
    date: new Date(tweet.created_at),
    caption: tweet.text,
    likes: tweet.public_metrics.like_count,
    comments: tweet.public_metrics.reply_count,
    views: tweet.public_metrics.retweet_count * 10, // Mocked visibility
    media_type: 'TEXT',
    permalink: `https://twitter.com/user/status/${tweet.id}`
  };
}
