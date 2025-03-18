export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  projectType: string;
  projectTitle: string;
  description: string;
  timeline: string;
  budget: string;
  goals: string;
  targetAudience?: string;
  specialRequirements?: string;
  referralSource?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'DISQUALIFIED';
  aiScore: number;
  aiAnalysis?: string;
  aiInsights?: {
    budget: string;
    budgetReason: string;
    timeline: string;
    timelineReason: string;
    scope: string;
    scopeReason: string;
    requirements: string;
    requirementsReason: string;
    marketFit: string;
    marketFitReason: string;
    technicalFeasibility: string;
    technicalFeasibilityReason: string;
    recommendation: string;
    nextSteps: string[];
    riskFactors: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface LeadDetails extends Lead {
  files?: Array<{
    id: string;
    filename: string;
    path: string;
    createdAt: string;
  }>;
  aiInsights?: {
    budget: string;
    budgetReason: string;
    timeline: string;
    timelineReason: string;
    scope: string;
    scopeReason: string;
    requirements: string;
    requirementsReason: string;
    marketFit: string;
    marketFitReason: string;
    technicalFeasibility: string;
    technicalFeasibilityReason: string;
    recommendation: string;
    nextSteps: string[];
    riskFactors: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Project Types
export interface ProjectType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Service Item
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

// Testimonial Item
export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
}

// Team Member
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    [key: string]: string;
  };
}

// Contact Information
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    [key: string]: string;
  };
  mapLocation: {
    lat: number;
    lng: number;
    zoom: number;
  };
}

// FAQ Item
export interface FAQItem {
  question: string;
  answer: string;
}
