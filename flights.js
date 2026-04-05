// api/flights.js
// Vercel serverless function — proxies SerpApi requests to avoid CORS issues.
// Deployed automatically by Vercel when you push to GitHub.

export default async function handler(req, res) {
  // Allow requests from your GitHub Pages site and localhost for testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SERPAPI_KEY = process.env.SERPAPI_KEY;
  if (!SERPAPI_KEY) {
    return res.status(500).json({ error: 'SERPAPI_KEY not configured on server.' });
  }

  // Forward all query params from the frontend, but inject the real API key
  const params = new URLSearchParams(req.query);
  params.set('api_key', SERPAPI_KEY);

  try {
    const url = `https://serpapi.com/search?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
