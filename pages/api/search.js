// pages/api/search.js

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  const apiKey = process.env.WATCHMODE_API_KEY;

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Watchmode' });
    }

    const data = await response.json();

    return res.status(200).json({ results: data.title_results });
  } catch (err) {
    console.error('Search API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
