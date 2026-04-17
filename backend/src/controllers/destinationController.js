import {
  createDestination,
  deleteDestination,
  editDestination,
  getDestinationById,
  listDestinations,
  reorderDestinations,
} from '../services/destinationService.js';

function getDestinationInput(body) {
  return body?.destination ?? body?.address ?? body?.city;
}

export async function listDestinationsHandler(req, res) {
  const destinations = await listDestinations();
  res.json(destinations);
}

export async function getDestinationByIdHandler(req, res) {
  const destination = await getDestinationById(req.params.id);
  res.json(destination);
}

export async function createDestinationHandler(req, res) {
  const destination = await createDestination(
    getDestinationInput(req.body),
    req.body.placeId
  );
  res.status(201).json(destination);
}

export async function editDestinationHandler(req, res) {
  const updatedDestination = await editDestination(
    req.params.id,
    getDestinationInput(req.body),
    req.body.placeId
  );
  res.json(updatedDestination);
}

export async function deleteDestinationHandler(req, res) {
  await deleteDestination(req.params.id);
  res.status(204).end();
}

export async function reorderDestinationsHandler(req, res) {
  const reordered = await reorderDestinations(req.body.ids);
  res.json(reordered);
}
