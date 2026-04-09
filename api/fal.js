/* eslint-env node */
export default async function handler(req, res) {
  // Extract path from req.url: e.g. /api/fal/fal-ai/any-llm -> fal-ai/any-llm
  // In Vercel, req.url may include query parameters, so parse it.
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const match = parsedUrl.pathname.match(/^\/api\/fal\/(.+)$/);
  const targetPath = match ? match[1] : '';
  const targetUrl = `https://queue.fal.run/${targetPath}${parsedUrl.search}`;
  
  // Use VITE_FAL_API_KEY from environment variables (you configure this in Vercel)
  const apiKey = process.env.VITE_FAL_API_KEY || process.env.FAL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API Key in environment variables" });
  }

  const fetchOptions = {
    method: req.method,
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': req.headers['content-type'] || 'application/json',
    }
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    
    // Attempt to parse JSON; fallback to text if unable
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(response.status).send(text);
    }
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Vercel Proxy Error:", error);
    return res.status(500).json({ error: 'Proxy implementation error', details: error.message });
  }
}
