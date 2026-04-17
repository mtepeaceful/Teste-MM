import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createDestinationHandler,
  deleteDestinationHandler,
  editDestinationHandler,
  getDestinationByIdHandler,
  listDestinationsHandler,
  reorderDestinationsHandler,
} from '../controllers/destinationController.js';
import {
  routeLegHandler,
  routeSummaryHandler,
} from '../controllers/routeController.js';
import {
  requireCityBody,
  requireIdsArrayBody,
  requireDestinationIdParam,
  requireRouteQuery,
} from '../middleware/validation.js';

const router = Router();
router.get(
  '/destinations/:id',
  requireDestinationIdParam,
  asyncHandler(getDestinationByIdHandler)
);
router.get('/destinations', asyncHandler(listDestinationsHandler));

router.post(
  '/destinations',
  requireCityBody,
  asyncHandler(createDestinationHandler)
);
router.put(
  '/destinations/reorder',
  requireIdsArrayBody,
  asyncHandler(reorderDestinationsHandler)
);
router.put(
  '/destinations/:id',
  requireDestinationIdParam,
  requireCityBody,
  asyncHandler(editDestinationHandler)
);
router.delete(
  '/destinations/:id',
  requireDestinationIdParam,
  asyncHandler(deleteDestinationHandler)
);

router.get('/route/summary', asyncHandler(routeSummaryHandler));
router.get('/route/leg', requireRouteQuery, asyncHandler(routeLegHandler));

export default router;
