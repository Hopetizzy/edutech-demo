import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

export const emailQueue = new Queue('email-queue', { connection });

export const queueWeeklyEmails = async () => {
    // This logic could be triggered by a CRON job or a specific endpoint
    // Fetch all students who have scores
    const prisma = (await import('../services/prisma.js')).default;
    const students = await prisma.student.findMany();

    for (const student of students) {
        await emailQueue.add(
            'weekly-parent-email',
            {
                studentId: student.id,
                studentName: student.name,
                parentEmail: student.parentEmail,
            },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            }
        );
    }
};
