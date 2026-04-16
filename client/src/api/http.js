export async function requestJson(url, options) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  })

  const hasBody = response.status !== 204
  const payload = hasBody ? await response.json().catch(() => null) : null

  if (!response.ok) {
    throw new Error(payload?.message || 'Erro ao processar a requisicao.')
  }

  return payload
}
