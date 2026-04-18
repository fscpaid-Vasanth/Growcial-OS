const API_URL = 'http://localhost:3001/api';

export const aiService = {
  generateStudioContent: async (params) => {
    try {
      const response = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: params.type || 'post',
          niche: params.niche || 'Digital Creator',
          platform: params.platform || 'instagram',
          language: 'English',
          additionalContext: params.context || ''
        }),
      });

      if (!response.ok) {
        throw new Error('AI Engine failed to respond');
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
};
