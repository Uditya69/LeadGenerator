import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const templates = {
  contact_form: (variables: Record<string, string>) => ({
    subject: `New Contact Form Submission from ${variables.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${variables.name}</p>
      <p><strong>Email:</strong> ${variables.email}</p>
      <p><strong>Subject:</strong> ${variables.subject || 'No subject provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${variables.message}</p>
    `,
  }),
};

export const sendEmail = async (
  to: string,
  templateId: string,
  variables: Record<string, string>
) => {
  try {
    const template = templates[templateId as keyof typeof templates];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const { subject, html } = template(variables);

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 