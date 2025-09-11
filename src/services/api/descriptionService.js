const descriptionService = {
  generateDescription: async (title) => {
    try {
      const response = await fetch('https://test-api.apper.io/fn/e01222b0eeea446eaa55f8a83ae145b4/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate description');
      }

      if (!data.success) {
        throw new Error(data.error || 'Description generation failed');
      }

      return data.description;
    } catch (error) {
      console.error('Description generation error:', error);
      throw error;
    }
  }
};

export default descriptionService;