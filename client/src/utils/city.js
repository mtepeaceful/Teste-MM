import { BR_STATE_TO_UF } from '../constants/places';

export function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function extractCityUfFromText(value) {
  if (!value) {
    return { city: '', uf: '' };
  }

  const parts = value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const city = parts[0] || '';
  let uf = '';

  for (const part of parts.slice(1)) {
    const upper = part.toUpperCase();
    if (/^[A-Z]{2}$/.test(upper)) {
      uf = upper;
      break;
    }

    const mapped = BR_STATE_TO_UF[normalizeText(part)];
    if (mapped) {
      uf = mapped;
      break;
    }
  }

  return { city, uf };
}

export function formatCityUf(label, fallbackCity) {
  const preferred = extractCityUfFromText(fallbackCity);
  if (preferred.city && preferred.uf) {
    return `${preferred.city}, ${preferred.uf}`;
  }

  const fromLabel = extractCityUfFromText(label);
  if (fromLabel.city && fromLabel.uf) {
    return `${fromLabel.city}, ${fromLabel.uf}`;
  }

  if (preferred.city) {
    return preferred.city;
  }

  if (fromLabel.city) {
    return fromLabel.city;
  }

  return fallbackCity || label || '';
}
