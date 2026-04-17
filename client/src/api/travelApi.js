import { requestJson } from './http';

export function fetchDestinations() {
  return requestJson('/destinations');
}

export function fetchRouteSummary() {
  return requestJson('/route/summary');
}

export function createDestination(payload) {
  return requestJson('/destinations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateDestination(id, payload) {
  return requestJson(`/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteDestination(id) {
  return requestJson(`/destinations/${id}`, { method: 'DELETE' });
}

export function reorderDestinations(ids) {
  return requestJson('/destinations/reorder', {
    method: 'PUT',
    body: JSON.stringify({ ids }),
  });
}
