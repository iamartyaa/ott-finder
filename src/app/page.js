'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [platforms, setPlatforms] = useState({});
  const [loadingPlatforms, setLoadingPlatforms] = useState({});
  const [covers, setCovers] = useState({});



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
        for (const item of data.results.slice(0, 5)) { // Limit to 5 posters to avoid burst
          const coverRes = await fetch(`/api/tmdb-cover?query=${encodeURIComponent(item.name)}`);
          const coverData = await coverRes.json();
          if (coverData.cover) {
            setCovers(prev => ({ ...prev, [item.id]: coverData.cover }));
          }
        }

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
    <div className="max-w-screen-md mx-auto">

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 tracking-tight">
          Where Can I Watch? 🔍
        </h1>
        <div className="sticky top-0 z-20 bg-white/80 px-4 py-3 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-inner ring-1 ring-gray-200 focus-within:ring-blue-400 transition"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies or shows"
              className="flex-1 bg-transparent text-base text-black focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 text-sm transition"
            >
              Search
            </button>
          </form>
        </div>

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

            <div key={item.id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
              {covers[item.id] && (
                <img
                  src={covers[item.id]}
                  alt={`${item.name} Poster`}
                  className="w-full h-64 object-cover rounded-lg mb-3"
                />
              )}

              <h2 className="text-xl font-semibold text-black">{item.name}</h2>


              <p className="text-black">{item.year} • {item.type}</p>

              <button
                className={`mt-4 px-4 py-2 text-sm sm:text-base rounded text-white transition ${loadingPlatforms[item.id]
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
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1 px-1 sm:px-0 max-w-full">

                  {platforms[item.id].map((src) => (
                    <a
                      key={`${src.source_id}-${src.format}-${src.web_url}`}
                      href={src.web_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm hover:bg-gray-50 transition whitespace-nowrap min-w-[140px]"
                    >
                      {src.logo && (
                        <img
                          src={src.logo}
                          alt={src.displayName}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <div className="flex flex-col text-sm text-left">
                        <span className="font-medium text-black">{src.displayName}</span>


                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${src.accessType === 'sub'
                            ? 'bg-green-100 text-green-700'
                            : src.accessType === 'rent'
                              ? 'bg-yellow-100 text-yellow-700'
                              : src.accessType === 'buy'
                                ? 'bg-purple-100 text-purple-700'
                                : src.accessType === 'free'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600'
                            }`}>
                            {src.accessType.toUpperCase()}
                          </span>

                          {src.format && (
                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
                              {src.format}
                            </span>
                          )}
                        </div>

                      </div>

                    </a>
                  ))}
                </div>
              )}
              {platforms[item.id] && platforms[item.id].length === 0 && (
                <p className="text-center text-black mt-6">Not available on OTT platforms in India.</p>
              )}


            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
