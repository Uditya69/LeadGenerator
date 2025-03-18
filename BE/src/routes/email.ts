import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { sendEmail, transporter } from '../services/emailService';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for email sending
const sendEmailValidation = [
  body('to').isEmail().withMessage('Invalid email address'),
  body('templateId').notEmpty().withMessage('Template ID is required'),
  body('variables').optional().isObject().withMessage('Variables must be an object'),
];

// Send email route
router.post('/send', sendEmailValidation, async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    const { to, templateId, variables } = req.body;

    // Send email using our email service
    await sendEmail(to, templateId, variables || {});

    // Return success response
    res.json({
      success: true,
      data: { sent: true },
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
    });
  }
});

// Send custom email route
router.post('/send-custom/:leadId', auth, async (req, res) => {
  try {
    const { leadId } = req.params;
    const { subject, content } = req.body;

    // Get lead details
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    // Validate required fields
    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        error: 'Subject and content are required'
      });
    }

    // Send email using nodemailer
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: lead.email,
      subject,
      html: content
    });

    res.json({
      success: true,
      message: 'Custom email sent successfully'
    });
  } catch (error) {
    console.error('Error sending custom email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send custom email'
    });
  }
});

export default router; 