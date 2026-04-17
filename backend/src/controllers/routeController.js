import {
  getRouteBetweenDestinations,
  getRouteSummary,
} from '../services/destinationService.js';

export async function routeSummaryHandler(req, res) {
  const summary = await getRouteSummary();
  res.json(summary);
}

export async function routeLegHandler(req, res) {
  const leg = await getRouteBetweenDestinations(req.query.from, req.query.to);
  res.json(leg);
}
