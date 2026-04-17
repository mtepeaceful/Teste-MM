const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

function normalizeQuery(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildQueryVariants(rawDestination) {
  const normalized = normalizeQuery(rawDestination);
  const variants = new Set([normalized]);

  if (normalized.includes(':')) {
    const afterColon = normalizeQuery(normalized.split(':').slice(1).join(':'));
    if (afterColon) {
      variants.add(afterColon);
    }
  }

  const dashParts = normalized
    .split(/\s+-\s+/)
    .map((part) => normalizeQuery(part))
    .filter(Boolean);

  if (dashParts.length >= 2) {
    variants.add(dashParts.slice(1).join(', '));
  }

  if (dashParts.length >= 3) {
    variants.add(dashParts.slice(-3).join(', '));
  }

  if (dashParts.length >= 2) {
    variants.add(`${dashParts[dashParts.length - 2]}, ${dashParts[dashParts.length - 1]}, Brasil`);
  }

  const neighborhoodCityUfMatch = normalized.match(
    /([^,]+),\s*([^,]+)\s*-\s*([A-Za-z]{2})$/
  );
  if (neighborhoodCityUfMatch) {
    const neighborhood = normalizeQuery(neighborhoodCityUfMatch[1]);
    const city = normalizeQuery(neighborhoodCityUfMatch[2]);
    const state = neighborhoodCityUfMatch[3].toUpperCase();

    variants.add(`${city}, ${state}, Brasil`);
    variants.add(`${neighborhood}, ${city}, ${state}, Brasil`);
  }

  const cityUfAfterEmMatch = normalized.match(/\bem\s+(.+?)\s+([A-Za-z]{2})(?:\s*-|$)/i);
  if (cityUfAfterEmMatch) {
    const city = normalizeQuery(cityUfAfterEmMatch[1]);
    const state = cityUfAfterEmMatch[2].toUpperCase();
    variants.add(`${city}, ${state}, Brasil`);
  }

  const cityUfTailMatch = normalized.match(/([A-Za-zÀ-ÿ\s]+)\s*-\s*([A-Za-z]{2})$/);
  if (cityUfTailMatch) {
    const city = normalizeQuery(cityUfTailMatch[1]);
    const state = cityUfTailMatch[2].toUpperCase();
    variants.add(`${city}, ${state}, Brasil`);
  }

  return [...variants];
}

async function searchNominatim(query) {
  const url =
    `${NOMINATIM_URL}?format=jsonv2&addressdetails=1&limit=5&q=` +
    encodeURIComponent(query);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'travel-route-planner/1.0 (educational demo)',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao consultar geocodificacao');
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  return results[0];
}

export async function geocodeDestination(destination) {
  const variants = buildQueryVariants(destination);
  console.log(`[GEOCODE] pesquisando por "${variants[0]}"`);

  let match = null;

  for (const query of variants) {
    console.log(`[GEOCODE] tentativa: "${query}"`);
    match = await searchNominatim(query);

    if (match) {
      break;
    }
  }

  if (!match) {
    throw new Error(`Destino nao encontrado: ${destination}`);
  }

  console.log(`[GEOCODE] encontrado(a) "${variants[0]}" -> ${match.display_name}`);
  return {
    label: match.display_name,
    latitude: Number(match.lat),
    longitude: Number(match.lon),
  };
}
