import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendParentEmail = async (studentName: string, parentEmail: string, scores: any[]) => {
    const msg = {
        to: parentEmail,
        from: process.env.FROM_EMAIL || 'noreply@edutech.demo',
        subject: `Weekly Performance Update: ${studentName}`,
        html: `
      <h1>Weekly Performance Update</h1>
      <p>Hello, here is the performance summary for <strong>${studentName}</strong> for this week:</p>
      <ul>
        ${scores.map(s => `<li>${s.subject}: ${s.score} (${s.description || 'No description'})</li>`).join('')}
      </ul>
      <p>Best regards,<br/>EduTech Team</p>
    `,
    };

    try {
        await sgMail.send(msg);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
};
