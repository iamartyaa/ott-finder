'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [platforms, setPlatforms] = useState({});
  const [loadingPlatforms, setLoadingPlatforms] = useState({});



  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data.results);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async (id) => {
    if (platforms[id]) return;

    setLoadingPlatforms((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/title-sources?titleId=${id}`);
      const data = await res.json();

      if (res.ok) {
        setPlatforms((prev) => ({ ...prev, [id]: data.sources }));
      } else {
        console.error('Error fetching sources:', data.error);
      }
    } catch (err) {
      console.error('Failed to fetch OTT sources:', err);
    } finally {
      setLoadingPlatforms((prev) => ({ ...prev, [id]: false }));
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">OTT Search 🎬</h1>

      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 mb-8"
      >

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or show..."
          className="flex-1 p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}



      {!loading && results.length === 0 && query.trim() !== '' && (
        <p className="text-center text-gray-500 mt-6">No results found for “{query}”</p>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item) => (
          
            <div key={item.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-gray-100 transition hover:shadow-lg">

            <h2 className="text-xl font-semibold">{item.name}</h2>

            <p className="text-gray-600">{item.year} • {item.type}</p>
            <button
              className={`className="mt-4 bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded hover:bg-blue-600" ${loadingPlatforms[item.id]
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
                }`}
              disabled={loadingPlatforms[item.id]}
              onClick={() => fetchSources(item.id)}
            >
              {loadingPlatforms[item.id] ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'View Platforms'
              )}
            </button>


            {platforms[item.id]?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3 items-center">
                {platforms[item.id].map((src) => (
                  <a
                    key={src.source_id}
                    href={src.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded shadow hover:bg-gray-50 transition"
                  >
                    {src.logo && (
                      <img
                        src={src.logo}
                        alt={src.displayName}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <div className="flex flex-col text-sm text-left">
                      <span>{src.displayName}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded mt-1 w-fit ${src.accessType === 'sub'
                          ? 'bg-green-100 text-green-700'
                          : src.accessType === 'rent'
                            ? 'bg-yellow-100 text-yellow-700'
                            : src.accessType === 'buy'
                              ? 'bg-purple-100 text-purple-700'
                              : src.accessType === 'free'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {src.accessType.toUpperCase()}
                      </span>
                    </div>

                  </a>
                ))}
              </div>
            )}
            {platforms[item.id] && platforms[item.id].length === 0 && (
              <p className="text-sm text-gray-500 mt-2">Not available on OTT platforms in India.</p>
            )}


          </div>
        ))}
      </div>
    </div>
  );
}
