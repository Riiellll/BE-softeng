import express from 'express';
import { trNotificationController } from '../controllers/TrNotificationController.js';
const router = express.Router();

router.get('/get-notification', trNotificationController.getNotifications);
router.get('/get-notification-detail/:id', trNotificationController.getNotificationDetail);
router.post('/post-notification', trNotificationController.postNotification.bind(trNotificationController));

export default router;