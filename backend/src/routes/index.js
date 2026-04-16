import { Router } from 'express'
import {
  createDestinationHandler,
  deleteDestinationHandler,
  editDestinationHandler,
  getDestinationByIdHandler,
  listDestinationsHandler,
  reorderDestinationsHandler
} from '../controllers/destinationController.js'
import { routeLegHandler, routeSummaryHandler } from '../controllers/routeController.js'

const router = Router()
router.get('/destinations/:id', getDestinationByIdHandler)
router.get('/destinations', listDestinationsHandler)


router.post('/destinations', createDestinationHandler)
router.put('/destinations/reorder', reorderDestinationsHandler)
router.put('/destinations/:id', editDestinationHandler)
router.delete('/destinations/:id', deleteDestinationHandler)


router.get('/route/summary', routeSummaryHandler)
router.get('/route/leg', routeLegHandler)

export default router
