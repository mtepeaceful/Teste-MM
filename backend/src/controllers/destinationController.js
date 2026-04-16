import {
  createDestination,
  deleteDestination,
  editDestination,
  listDestinations,
  reorderDestinations
} from '../services/destinationService.js'

function getStatusCode(error, fallbackCode) {
  return error.statusCode || fallbackCode
}

export async function listDestinationsHandler(req, res) {
  try {
    const destinations = await listDestinations()
    res.json(destinations)
  } catch (error) {
    res.status(getStatusCode(error, 500)).json({ message: 'Nao foi possivel listar os destinos.' })
  }
}

export async function createDestinationHandler(req, res) {
  try {
    const destination = await createDestination(req.body.city)
    res.status(201).json(destination)
  } catch (error) {
    res.status(getStatusCode(error, 400)).json({ message: error.message || 'Nao foi possivel criar o destino.' })
  }
}

export async function editDestinationHandler(req, res) {
  try {
    const updatedDestination = await editDestination(req.params.id, req.body.city)
    res.json(updatedDestination)
  } catch (error) {
    res.status(getStatusCode(error, 400)).json({ message: error.message || 'Nao foi possivel atualizar o destino.' })
  }
}

export async function deleteDestinationHandler(req, res) {
  try {
    await deleteDestination(req.params.id)
    res.status(204).end()
  } catch (error) {
    res.status(getStatusCode(error, 500)).json({ message: error.message || 'Nao foi possivel remover o destino.' })
  }
}

export async function reorderDestinationsHandler(req, res) {
  try {
    const reordered = await reorderDestinations(req.body.ids)
    res.json(reordered)
  } catch (error) {
    res.status(getStatusCode(error, 500)).json({ message: error.message || 'Nao foi possivel reorganizar os destinos.' })
  }
}
