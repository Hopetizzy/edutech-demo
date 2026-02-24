import { Router } from 'express';
import { getScores } from '../controllers/scoreController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getScores);

export default router;
