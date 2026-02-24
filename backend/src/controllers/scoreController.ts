import type { Request, Response } from 'express';
import prisma from '../services/prisma.js';

export const getScores = async (req: Request, res: Response) => {
    const { student_id } = req.query;

    if (!student_id) {
        return res.status(400).json({ error: 'student_id is required' });
    }

    try {
        const scores = await prisma.score.findMany({
            where: {
                student: {
                    wordpressId: parseInt(student_id as string),
                },
            },
            include: {
                student: true,
            },
        });

        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
};
