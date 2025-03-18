import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeLead(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Analyze this lead and provide detailed insights in JSON format with the following structure:
    {
      "budget": "good" or "needs_attention",
      "budgetReason": "Detailed explanation",
      "timeline": "good" or "needs_attention",
      "timelineReason": "Detailed explanation",
      "scope": "good" or "needs_attention",
      "scopeReason": "Detailed explanation",
      "requirements": "good" or "needs_attention",
      "requirementsReason": "Detailed explanation",
      "marketFit": "high", "medium", or "low",
      "marketFitReason": "Detailed explanation",
      "technicalFeasibility": "high", "medium", or "low",
      "technicalFeasibilityReason": "Detailed explanation",
      "recommendation": "Overall recommendation",
      "nextSteps": ["List of recommended next steps"],
      "riskFactors": ["List of potential risks"]
    }

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
    Special Requirements: ${lead.specialRequirements || 'None'}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const insights = JSON.parse(text);
    
    // Calculate overall AI score based on various factors
    const scoreFactors = {
      budget: insights.budget === 'good' ? 20 : 10,
      timeline: insights.timeline === 'good' ? 20 : 10,
      scope: insights.scope === 'good' ? 20 : 10,
      requirements: insights.requirements === 'good' ? 20 : 10,
      marketFit: insights.marketFit === 'high' ? 20 : insights.marketFit === 'medium' ? 15 : 10,
      technicalFeasibility: insights.technicalFeasibility === 'high' ? 20 : insights.technicalFeasibility === 'medium' ? 15 : 10
    };

    const aiScore = Object.values(scoreFactors).reduce((a, b) => a + b, 0);

    // Update lead with AI score and create AI insights
    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { 
          aiScore,
          aiAnalysis: text
        }
      }),
      prisma.aIInsights.upsert({
        where: { leadId },
        create: {
          leadId,
          ...insights
        },
        update: insights
      })
    ]);

    return {
      success: true,
      data: {
        aiScore,
        insights
      }
    };
  } catch (error) {
    console.error('Error analyzing lead:', error);
    throw error;
  }
} 