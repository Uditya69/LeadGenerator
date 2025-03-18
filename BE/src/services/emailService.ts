import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const templates = {
  'follow-up': {
    subject: 'Thank you for your inquiry',
    html: (variables: Record<string, string>) => `
      <h2>Thank you for your inquiry, ${variables.name}!</h2>
      <p>We have received your project details and will get back to you shortly.</p>
      <p>Best regards,<br>Your Team</p>
    `,
  },
  'welcome': {
    subject: 'Welcome to our platform',
    html: (variables: Record<string, string>) => `
      <h2>Welcome ${variables.name}!</h2>
      <p>Thank you for joining our platform. We're excited to have you on board.</p>
      <p>Best regards,<br>Your Team</p>
    `,
  },
};

export async function sendEmail(
  to: string,
  templateId: string,
  variables: Record<string, string> = {}
) {
  try {
    const template = templates[templateId as keyof typeof templates];
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: template.subject,
      html: template.html(variables),
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 