import express from 'express';
import { msUserController } from '../controllers/MsUserController.js';
const router = express.Router();

router.post('/post-authenticated', msUserController.postAuthenticated);
router.put('/put-update-user-data', msUserController.putUpdateUserData);
router.put('/put-change-password', msUserController.putChangePassword);

export default router;