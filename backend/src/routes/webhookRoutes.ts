import { Router } from 'express';
import { handleScoreWebhook } from '../controllers/webhookController.js';
import { webhookMiddleware } from '../middleware/webhookMiddleware.js';

const router = Router();

router.post('/score-update', webhookMiddleware, handleScoreWebhook);

export default router;
