import { randomUUID } from 'node:crypto'
import {
  findDestinationByQuery,
  findAllDestinations,
  insertDestination,
  removeDestinationByQuery,
  updateDestinationByQuery
} from '../repositories/destinationRepository.js'
import { geocodeQuery } from './geocodingService.js'
import { clearRouteCache, getRouteLeg } from './routingService.js'

function normalizeCity(city) {
  if (!city || !city.trim()) {
    throw new Error('Informe o nome do destino.')
  }

  return city.trim()
}

export async function listDestinations() {
  return findAllDestinations()
}

export async function getDestinationById(id) {
  if (!id) {
    const error = new Error('Informe o id do destino.')
    error.statusCode = 400
    throw error
  }

  const destination = await findDestinationByQuery({ id })
  if (!destination) {
    const error = new Error('Destino nao encontrado.')
    error.statusCode = 404
    throw error
  }

  return destination
}

export async function createDestination(city) {
  const normalizedCity = normalizeCity(city)
  const destinations = await findAllDestinations()
  const geo = await geocodeQuery(normalizedCity)

  const destination = await insertDestination({
    id: randomUUID(),
    city: normalizedCity,
    label: geo.label,
    latitude: geo.latitude,
    longitude: geo.longitude,
    order: destinations.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  clearRouteCache()
  return destination
}

export async function editDestination(id, city) {
  const normalizedCity = normalizeCity(city)
  const destinations = await findAllDestinations()
  const current = destinations.find((item) => item.id === id)

  if (!current) {
    const error = new Error('Destino nao encontrado.')
    error.statusCode = 404
    throw error
  }

  const geo = await geocodeQuery(normalizedCity)
  const updatedDestination = {
    ...current,
    city: normalizedCity,
    label: geo.label,
    latitude: geo.latitude,
    longitude: geo.longitude,
    updatedAt: new Date().toISOString()
  }

  await updateDestinationByQuery({ id }, updatedDestination)
  clearRouteCache()
  return updatedDestination
}

export async function deleteDestination(id) {
  const count = await removeDestinationByQuery({ id })
  if (!count) {
    const error = new Error('Destino nao encontrado.')
    error.statusCode = 404
    throw error
  }

  const destinations = await findAllDestinations()
  await Promise.all(
    destinations.map((destination, index) =>
      updateDestinationByQuery(
        { id: destination.id },
        { ...destination, order: index + 1, updatedAt: new Date().toISOString() }
      )
    )
  )

  clearRouteCache()
}

export async function reorderDestinations(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    const error = new Error('Informe a nova ordem dos destinos.')
    error.statusCode = 400
    throw error
  }

  const destinations = await findAllDestinations()
  const destinationMap = new Map(destinations.map((destination) => [destination.id, destination]))
  const uniqueIds = new Set(ids)

  if (ids.length !== destinations.length || uniqueIds.size !== ids.length) {
    const error = new Error('A lista de destinos deve conter todos os itens, sem repeticao.')
    error.statusCode = 400
    throw error
  }

  if (ids.some((id) => !destinationMap.has(id))) {
    const error = new Error('A lista de destinos contem itens invalidos.')
    error.statusCode = 400
    throw error
  }

  await Promise.all(
    ids.map((id, index) =>
      updateDestinationByQuery(
        { id },
        { ...destinationMap.get(id), order: index + 1, updatedAt: new Date().toISOString() }
      )
    )
  )

  clearRouteCache()
  return findAllDestinations()
}

export async function getRouteSummary() {
  const destinations = await findAllDestinations()
  if (destinations.length < 2) {
    return { legs: [], totalDistanceKm: 0, totalDurationMin: 0 }
  }

  const legs = []
  let totalDistanceKm = 0
  let totalDurationMin = 0

  for (let index = 0; index < destinations.length - 1; index += 1) {
    const origin = destinations[index]
    const destination = destinations[index + 1]
    const route = await getRouteLeg(origin, destination)

    legs.push({
      fromId: origin.id,
      toId: destination.id,
      fromLabel: origin.label,
      toLabel: destination.label,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin
    })
    totalDistanceKm += route.distanceKm
    totalDurationMin += route.durationMin
  }

  return {
    legs,
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    totalDurationMin: Math.round(totalDurationMin)
  }
}

export async function getRouteBetweenDestinations(from, to) {
  if (!from || !to) {
    const error = new Error('Informe os destinos de origem e destino.')
    error.statusCode = 400
    throw error
  }

  const destinations = await findAllDestinations()
  const origin = destinations.find((destination) => destination.id === from)
  const destination = destinations.find((item) => item.id === to)

  if (!origin || !destination) {
    const error = new Error('Destino nao encontrado.')
    error.statusCode = 404
    throw error
  }

  const route = await getRouteLeg(origin, destination)
  return {
    fromId: origin.id,
    toId: destination.id,
    fromLabel: origin.label,
    toLabel: destination.label,
    ...route
  }
}
