import { Worker, type Job } from 'bullmq';
import IORedis from 'ioredis';
import { sendParentEmail } from '../services/emailService.js';
import prisma from '../services/prisma.js';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

const worker = new Worker(
    'email-queue',
    async (job: Job) => {
        const { studentId, studentName, parentEmail } = job.data;

        // Fetch latest scores for the student (e.g., from the last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const scores = await prisma.score.findMany({
            where: {
                studentId,
                date: {
                    gte: sevenDaysAgo,
                },
            },
        });

        if (scores.length > 0) {
            await sendParentEmail(studentName, parentEmail, scores);
        }
    },
    { connection }
);

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with ${err.message}`);
});

export default worker;
