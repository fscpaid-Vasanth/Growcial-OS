import dotenv from 'dotenv';

dotenv.config();

const IG_API_BASE = 'https://graph.instagram.com/v21.0';

/**
 * Instagram Graph API Service
 * Handles fetching user media, insights, and profile data
 */

/**
 * Fetch user's Instagram profile info
 */
export async function getProfile(accessToken) {
  const url = `${IG_API_BASE}/me?fields=id,username,account_type,media_count,followers_count&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch user's recent media posts with metrics
 */
export async function getMedia(accessToken, limit = 25) {
  const url = `${IG_API_BASE}/me/media?fields=id,caption,media_type,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch insights for a specific media post
 */
export async function getMediaInsights(mediaId, accessToken) {
  const url = `${IG_API_BASE}/${mediaId}/insights?metric=engagement,impressions,reach,saved&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) {
    // Some media types don't support all metrics
    console.warn(`Could not fetch insights for media ${mediaId}`);
    return null;
  }
  return res.json();
}

/**
 * Fetch account-level insights
 */
export async function getAccountInsights(userId, accessToken, period = 'day') {
  const url = `${IG_API_BASE}/${userId}/insights?metric=follower_count,impressions,reach,profile_views&period=${period}&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Instagram insights error: ${res.status}`);
  return res.json();
}

/**
 * Step 1: Create a media container (image or video)
 */
export async function createMediaContainer(userId, accessToken, mediaUrl, caption, mediaType = 'IMAGE') {
  const url = `${IG_API_BASE}/${userId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Media container creation failed: ${error.error?.message || res.status}`);
  }
  return res.json(); // returns { id: "creation_id" }
}

/**
 * Step 2: Publish the media container
 */
export async function publishMediaContainer(userId, accessToken, creationId) {
  const url = `${IG_API_BASE}/${userId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Media publication failed: ${error.error?.message || res.status}`);
  }
  return res.json(); // returns { id: "media_id" }
}

/**
 * Full Publish Cycle
 */
export async function publishToInstagram(userId, accessToken, mediaUrl, caption) {
  const container = await createMediaContainer(userId, accessToken, mediaUrl, caption);
  const result = await publishMediaContainer(userId, accessToken, container.id);
  return result;
}

/**
 * Transform Instagram media data to our internal post format
 */
export function transformToPost(mediaItem, userId, insights = null) {
  const hashtags = (mediaItem.caption || '').match(/#\w+/g) || [];

  const likes = mediaItem.like_count || 0;
  const comments = mediaItem.comments_count || 0;
  const views = insights?.data?.find(m => m.name === 'impressions')?.values?.[0]?.value || 0;

  const engagementRate = views > 0
    ? (((likes + comments) / views) * 100).toFixed(2)
    : 0;

  return {
    user_id: userId,
    platform: 'instagram',
    post_id: mediaItem.id,
    date: new Date(mediaItem.timestamp),
    caption: mediaItem.caption || '',
    hashtags,
    likes,
    comments,
    views,
    engagement_rate: parseFloat(engagementRate),
    location_tag: '', // Would need location API endpoint
    language: '', // Would need NLP detection
    media_type: mediaItem.media_type,
    permalink: mediaItem.permalink,
  };
}
