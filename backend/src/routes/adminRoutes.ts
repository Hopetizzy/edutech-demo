import { Router } from 'express';
import { queueWeeklyEmails } from '../services/queueService.js';

const router = Router();

router.post('/trigger-emails', async (req, res) => {
    try {
        await queueWeeklyEmails();
        res.status(200).json({ message: 'Email jobs queued successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to queue emails' });
    }
});

export default router;
