// lib/providerCache.js

let providerMap = null;

export async function getProviders(apiKey) {
  if (providerMap) return providerMap;

  const res = await fetch(`https://api.watchmode.com/v1/sources/?apiKey=${apiKey}`);
  const data = await res.json();

  providerMap = {};
  for (const provider of data) {
    providerMap[provider.id] = {
      name: provider.name,
      logo: provider.logo_100px || null,
    };
  }

  return providerMap;
}
