import { createHttpError } from '../utils/httpError.js';

export function requireCityBody(req, res, next) {
  const city = req.body?.city;
  if (typeof city !== 'string' || !city.trim()) {
    next(createHttpError('Informe o nome do destino.', 400));
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
