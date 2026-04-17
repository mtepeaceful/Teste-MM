const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(
  /\/$/,
  ''
);

function resolveUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function requestJson(path, options) {
  const response = await fetch(resolveUrl(path), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const hasBody = response.status !== 204;
  const payload = hasBody ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Erro ao processar a requisicao.');
  }

  return payload;
}
