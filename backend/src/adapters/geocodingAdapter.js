export async function geocodeDestination(city) {
  const normalized = city.trim();
  console.log(`[GEOCODE] pesquisando por "${normalized}"`);

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(normalized)}`,
    {
      headers: {
        'User-Agent': 'travel-route-planner/1.0 (educational demo)',
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Falha ao consultar geocodificacao');
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`Destino nao encontrado: ${city}`);
  }

  const [match] = results;
  console.log(
    `[GEOCODE] encontrado(a) "${normalized}" -> ${match.display_name}`
  );
  return {
    label: match.display_name,
    latitude: Number(match.lat),
    longitude: Number(match.lon),
  };
}
