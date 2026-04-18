import dotenv from 'dotenv';
dotenv.config();

/**
 * YouTube Data API Service
 * Handles fetching channel info, videos, and metrics
 */

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch YouTube Channel Profile
 */
export async function getChannelProfile(accessToken) {
  const url = `${YT_API_BASE}/channels?part=snippet,statistics&mine=true`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  const data = await res.json();
  const channel = data.items?.[0];
  
  if (!channel) throw new Error('No YouTube channel found for this account');

  return {
    id: channel.id,
    title: channel.snippet.title,
    customUrl: channel.snippet.customUrl,
    subscribers: channel.statistics.subscriberCount,
    videoCount: channel.statistics.videoCount,
    viewCount: channel.statistics.viewCount,
    thumbnail: channel.snippet.thumbnails.default.url
  };
}

/**
 * Fetch Recent Videos
 */
export async function getVideos(accessToken, maxResults = 10) {
  const url = `${YT_API_BASE}/activities?part=snippet,contentDetails&mine=true&maxResults=${maxResults}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  const data = await res.json();
  
  return data.items
    ?.filter(item => item.snippet.type === 'upload')
    .map(item => ({
      id: item.contentDetails.upload.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url
    }));
}

/**
 * Mock Publish Logic for Development
 */
export async function publishVideo(accessToken, data) {
  console.log("Publishing to YouTube:", data);
  // Real implementation requires multi-part upload to /upload/youtube/v3/videos
  return {
    success: true,
    videoId: "yt_mock_" + Date.now(),
    url: `https://youtu.be/mock`
  };
}

/**
 * Transform YouTube data to internal post format
 */
export function transformToYTPost(video, userId) {
  return {
    user_id: userId,
    platform: 'youtube',
    post_id: video.id,
    date: new Date(video.publishedAt),
    title: video.title,
    caption: video.description,
    views: 0, // Would need video-specific stats call
    likes: 0,
    media_type: 'VIDEO',
    thumb: video.thumbnail,
    permalink: `https://youtube.com/watch?v=${video.id}`
  };
}
