import { requestJson } from './http'

export function fetchDestinations() {
  return requestJson('/api/destinations')
}

export function fetchRouteSummary() {
  return requestJson('/api/route/summary')
}

export function createDestination(payload) {
  return requestJson('/api/destinations', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateDestination(id, payload) {
  return requestJson(`/api/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteDestination(id) {
  return requestJson(`/api/destinations/${id}`, { method: 'DELETE' })
}

export function reorderDestinations(ids) {
  return requestJson('/api/destinations/reorder', {
    method: 'PUT',
    body: JSON.stringify({ ids })
  })
}

export function fetchRouteLeg(from, to) {
  return requestJson(`/api/route/leg?from=${from}&to=${to}`)
}
