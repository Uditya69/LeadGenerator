import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { sendEmail } from '../services/emailService';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for email sending
const sendEmailValidation = [
  body('to').isEmail().withMessage('Invalid email address'),
  body('templateId').notEmpty().withMessage('Template ID is required'),
  body('variables').optional().isObject().withMessage('Variables must be an object'),
];

// Send email route - removed adminAuth to allow public access
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

export default router; 