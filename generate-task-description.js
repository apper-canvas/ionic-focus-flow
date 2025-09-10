export default {
  async fetch(request, env, ctx) {
    // Ensure Response is available (for non-Cloudflare environments)
    const ResponseClass = globalThis.Response || Response;
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new ResponseClass(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Only accept POST requests
      if (request.method !== 'POST') {
        return new ResponseClass(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { title } = await request.json();
      
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return new ResponseClass(JSON.stringify({
          success: false,
          error: 'Task title is required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Access apper from context or environment
      const apper = ctx?.apper || env?.apper || globalThis.apper;
      if (!apper) {
        return new ResponseClass(JSON.stringify({
          success: false,
          error: 'Service configuration error'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const openaiApiKey = await apper.getSecret('OPENAI_API_KEY');
      if (!openaiApiKey) {
        return new ResponseClass(JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise, actionable task descriptions. Generate a brief 1-2 sentence description that explains what needs to be done, why it might be important, or provides helpful context. Keep descriptions practical and under 100 words.'
            },
            {
              role: 'user',
              content: `Generate a brief task description for: "${title.trim()}"`
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

if (!response.ok) {
        const errorData = await response.json();
        return new ResponseClass(JSON.stringify({
          success: false,
          error: errorData.error?.message || 'Failed to generate description'
        }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await response.json();
      const description = data.choices[0]?.message?.content?.trim();

      if (!description) {
        return new ResponseClass(JSON.stringify({
          success: false,
          error: 'No description generated'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

return new ResponseClass(JSON.stringify({
        success: true,
        description: description
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      const ResponseClass = globalThis.Response || Response;
      return new ResponseClass(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};