const API_URL = 'http://localhost:3001/api';

export const platformService = {
  syncAccountData: async (platform, accessToken, userId) => {
    try {
      const response = await fetch(`${API_URL}/${platform}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          userId
        }),
      });

      if (!response.ok) {
        throw new Error(`${platform} sync failed`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Platform Service Error (${platform}):`, error);
      throw error;
    }
  },

  getProfile: async (platform, accessToken) => {
    try {
      const response = await fetch(`${API_URL}/${platform}/profile?accessToken=${accessToken}`);
      if (!response.ok) throw new Error(`${platform} profile fetch failed`);
      return await response.json();
    } catch (error) {
      console.error(`Platform Service Error (${platform} profile):`, error);
      throw error;
    }
  },

  publishContent: async (platform, data) => {
    try {
      const response = await fetch(`${API_URL}/${platform}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`${platform} publishing failed`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Platform Service Error (${platform} publish):`, error);
      throw error;
    }
  }
};
