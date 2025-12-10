import express from 'express';
import { trEventController } from '../controllers/TrEventController.js';
const router = express.Router();

router.get('/get-all', trEventController.getEvents);
router.get('/admin-table-pending', trEventController.getAdminTablePending)
router.get('/admin-table-reviewed', trEventController.getAdminTableReviewed)
router.get('/admin-table-past-events', trEventController.getAdminTablePastEvents)
router.get('/get-event-detail/:id', trEventController.getEventDetail)
router.put('/put-update-approval/:id/:approvalStatus', trEventController.putUpdateApproval)


export default router;