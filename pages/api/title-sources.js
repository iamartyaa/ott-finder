import { getProviders } from '../../lib/providerCache.js';

export default async function handler(req, res) {
    const { titleId } = req.query;

    if (!titleId) return res.status(400).json({ error: 'Missing titleId' });

    const apiKey = process.env.WATCHMODE_API_KEY;

    try {
        const [sourcesRes, providerMap] = await Promise.all([
            fetch(`https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${apiKey}`),
            getProviders(apiKey),
        ]);

        if (!sourcesRes.ok) {
            return res.status(sourcesRes.status).json({ error: 'Failed to fetch sources' });
        }

        const rawSources = await sourcesRes.json();
        const filtered = rawSources.filter((s) => (s.type === "sub" || s.type === "rent") && (s.region === 'IN' || (s.source_id === 372 && s.region === 'US')));

        // Add logo + friendly name
        const sources = filtered.map((s) => ({
            ...s,
            logo: providerMap[s.source_id]?.logo,
            displayName: providerMap[s.source_id]?.name || s.name,
            accessType: s.type, // add this for tag display
        }));


        res.status(200).json({ sources });
    } catch (err) {
        console.error('Sources API error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
