import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { auth, adminAuth } from '../middleware/auth';
import { analyzeLead } from '../services/aiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Lead validation
const leadValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('company').notEmpty().withMessage('Company is required'),
  body('projectType').notEmpty().withMessage('Project type is required'),
  body('projectTitle').notEmpty().withMessage('Project title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('timeline').notEmpty().withMessage('Timeline is required'),
  body('budget').notEmpty().withMessage('Budget is required'),
  body('goals').notEmpty().withMessage('Goals are required')
];

// Create lead (public endpoint)
router.post('/', leadValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        ...req.body,
        status: 'NEW' // Set initial status
      }
    });

    // Try to analyze lead with AI, but don't fail if it doesn't work
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Analyze this lead and provide a score between 0-100 based on the following criteria:
      1. Project completeness (20 points)
      2. Budget clarity (20 points)
      3. Timeline feasibility (20 points)
      4. Project scope (20 points)
      5. Business potential (20 points)

      Lead details:
      Name: ${lead.name}
      Company: ${lead.company}
      Project Type: ${lead.projectType}
      Project Title: ${lead.projectTitle}
      Description: ${lead.description}
      Timeline: ${lead.timeline}
      Budget: ${lead.budget}
      Goals: ${lead.goals}
      Target Audience: ${lead.targetAudience || 'Not specified'}
      Special Requirements: ${lead.specialRequirements || 'None'}

      Please provide a single number between 0-100 as the score.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract score from AI response
      const scoreMatch = text.match(/\b\d{1,3}\b/);
      const aiScore = scoreMatch ? parseInt(scoreMatch[0]) : 0;

      // Update lead with AI score and analysis
      await prisma.lead.update({
        where: { id: lead.id },
        data: { 
          aiScore,
          aiAnalysis: text // Store the full AI analysis
        }
      });

      // Update the lead object to include the AI analysis
      lead.aiScore = aiScore;
      lead.aiAnalysis = text;
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Continue without AI score
    }

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Lead created successfully'
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create lead'
    });
  }
});

// Get all leads (admin only)
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;
    const search = req.query.search as string;

    // Build the where clause
    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { projectTitle: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const total = await prisma.lead.count({ where });

    // Get paginated leads
    const leads = await prisma.lead.findMany({
      where,
      include: {
        files: true,
        aiInsights: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leads'
    });
  }
});

// Get lead by ID (admin only)
router.get('/:id', auth, adminAuth, async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        files: true,
        aiInsights: true
      }
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update lead status (admin only)
router.patch('/:id/status', auth, adminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!['NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete lead (admin only)
router.delete('/:id', auth, adminAuth, async (req: Request, res: Response) => {
  try {
    await prisma.lead.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 