import dotenv from 'dotenv';
dotenv.config();

/**
 * Facebook Graph API Service (Pages)
 * Handles fetching page info, feed, and publishing
 */

const FB_API_BASE = 'https://graph.facebook.com/v19.0';

/**
 * Fetch Facebook Page Profile
 */
export async function getPageProfile(accessToken) {
  // In production: GET /me?fields=id,name,fan_count,followers_count,picture
  // For demo, we simulate a robust Meta Page response
  return {
    id: "fb_page_123",
    name: "Growcial OS Official",
    fan_count: 8540,
    followers_count: 12200,
    picture: {
      data: { url: "https://graph.facebook.com/v19.0/fb_page_123/picture" }
    }
  };
}

/**
 * Fetch Page Feed
 */
export async function getPageFeed(accessToken, maxResults = 10) {
  // In production: GET /{page-id}/feed?fields=id,message,created_time,full_picture,permalink_url
  return [
    {
      id: "f1",
      message: "Our new AI dashboard is live! Check it out. 🚀",
      created_time: new Date().toISOString(),
      full_picture: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
      permalink_url: "https://facebook.com/page/posts/1"
    },
    {
      id: "f2",
      message: "The community is growing fast. Thank you for the support! 💙",
      created_time: new Date(Date.now() - 172800000).toISOString(),
      full_picture: "https://images.unsplash.com/photo-1557683316-973673baf926",
      permalink_url: "https://facebook.com/page/posts/2"
    }
  ];
}

/**
 * Publish to Facebook Page
 */
export async function publishToPage(accessToken, data) {
  console.log("Publishing to Facebook Page:", data);
  // POST /{page-id}/feed?message=...&link=...
  return {
    success: true,
    id: "fb_mock_" + Date.now(),
  };
}

/**
 * Transform Facebook data to internal post format
 */
export function transformToFBPost(post, userId) {
  return {
    user_id: userId,
    platform: 'facebook',
    post_id: post.id,
    date: new Date(post.created_time),
    caption: post.message || "",
    likes: 0, 
    comments: 0,
    views: 0,
    media_type: post.full_picture ? 'IMAGE' : 'TEXT',
    thumb: post.full_picture,
    permalink: post.permalink_url
  };
}
