import { createHttpError } from '../utils/httpError.js';

function getDestinationInput(body) {
  return body?.destination ?? body?.address ?? body?.city;
}

export function requireDestinationBody(req, res, next) {
  const destinationInput = getDestinationInput(req.body);
  if (typeof destinationInput !== 'string' || !destinationInput.trim()) {
    next(createHttpError('Informe um destino ou endereco valido.', 400));
    return;
  }

  next();
}

export function requireIdsArrayBody(req, res, next) {
  const ids = req.body?.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    next(createHttpError('Informe a nova ordem dos destinos.', 400));
    return;
  }

  next();
}

export function requireDestinationIdParam(req, res, next) {
  if (!req.params?.id) {
    next(createHttpError('Informe o id do destino.', 400));
    return;
  }

  next();
}

export function requireRouteQuery(req, res, next) {
  const { from, to } = req.query || {};

  if (
    typeof from !== 'string' ||
    !from.trim() ||
    typeof to !== 'string' ||
    !to.trim()
  ) {
    next(createHttpError('Informe os destinos de origem e destino.', 400));
    return;
  }

  next();
}
