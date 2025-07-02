let tmdbCache = {};

export default async function handler(req, res) {
    const { query } = req.query;
    const apiKey = process.env.TMDB_API_KEY;

    if (!query) {
        return res.status(400).json({ error: 'Missing query' });
    }

    const cacheKey = query.toLowerCase().trim();
    if (tmdbCache[cacheKey]) {
        return res.status(200).json({ cover: tmdbCache[cacheKey] });
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        const first = data.results?.[0];
        const posterPath = first?.poster_path;
        const fullUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

        tmdbCache[cacheKey] = fullUrl;
        return res.status(200).json({ cover: fullUrl });
    } catch (err) {
        console.error('TMDB error:', err);
        res.status(500).json({ error: 'Failed to fetch TMDB poster' });
    }
}
