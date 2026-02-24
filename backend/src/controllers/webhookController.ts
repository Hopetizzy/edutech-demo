import type { Request, Response } from 'express';
import prisma from '../services/prisma.js';

export const handleScoreWebhook = async (req: Request, res: Response) => {
    const { student_id, student_name, parent_email, subject, score, description, date } = req.body;

    try {
        // Upsert student
        const student = await prisma.student.upsert({
            where: { wordpressId: student_id },
            update: {
                name: student_name,
                parentEmail: parent_email,
            },
            create: {
                wordpressId: student_id,
                name: student_name,
                parentEmail: parent_email,
            },
        });

        // Create score
        const newScore = await prisma.score.create({
            data: {
                studentId: student.id,
                subject,
                score: parseFloat(score),
                description,
                date: date ? new Date(date) : new Date(),
            },
        });

        res.status(201).json({ message: 'Score ingested successfully', scoreId: newScore.id });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Failed to ingest score' });
    }
};
