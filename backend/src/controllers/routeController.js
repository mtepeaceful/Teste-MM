import { getRouteBetweenDestinations, getRouteSummary } from '../services/destinationService.js'

function getStatusCode(error, fallbackCode) {
  return error.statusCode || fallbackCode
}

export async function routeSummaryHandler(req, res) {
  try {
    const summary = await getRouteSummary()
    res.json(summary)
  } catch (error) {
    res.status(getStatusCode(error, 500)).json({ message: error.message || 'Nao foi possivel calcular o resumo da rota.' })
  }
}

export async function routeLegHandler(req, res) {
  try {
    const leg = await getRouteBetweenDestinations(req.query.from, req.query.to)
    res.json(leg)
  } catch (error) {
    res.status(getStatusCode(error, 500)).json({ message: error.message || 'Nao foi possivel calcular a rota.' })
  }
}
