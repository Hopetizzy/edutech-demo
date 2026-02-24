import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const webhookMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-wp-signature'] as string;
    const secret = process.env.WEBHOOK_SECRET;

    if (!signature || !secret) {
        return res.status(401).json({ error: 'Missing signature or secret' });
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(JSON.stringify(req.body)).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    next();
};
