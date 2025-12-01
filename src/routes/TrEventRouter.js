import express from 'express';
import { trEventController } from '../controllers/TrEventController.js';
const router = express.Router();

router.get('/', trEventController.getEvents);

export default router;