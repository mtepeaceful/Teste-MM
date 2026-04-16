const routeCache = new Map()

export function clearRouteCache() {
  routeCache.clear()
  console.log('[ROUTE] cache cleared')
}

export async function getRouteLeg(origin, destination) {
  const cacheKey = `${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}`
  if (routeCache.has(cacheKey)) {
    console.log('[ROUTE] cache hit', cacheKey)
    return routeCache.get(cacheKey)
  }

  console.log('[ROUTE] cache miss', cacheKey)

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=false&steps=false`
  )

  if (!response.ok) {
    throw new Error('Falha ao consultar rota')
  }

  const payload = await response.json()
  if (!payload.routes || payload.routes.length === 0) {
    throw new Error('Nao foi possivel calcular a rota entre os destinos')
  }

  const [route] = payload.routes
  const result = {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    durationMin: Number((route.duration / 60).toFixed(0))
  }

  routeCache.set(cacheKey, result)
  console.log('[ROUTE] calculated', cacheKey, result)
  return result
}
