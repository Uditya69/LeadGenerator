
import { Lead, LeadDetails } from './types';

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    company: "TechCorp",
    phone: "+1 (555) 123-4567",
    projectType: "e-commerce",
    projectTitle: "Online Store Redesign",
    description: "We need to redesign our online store to improve user experience and increase conversion rates.",
    timeline: "1-2 months",
    budget: "$10,000 - $25,000",
    aiScore: 85,
    status: "qualified",
    createdAt: "2023-05-15T09:30:00Z"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@innovatech.co",
    company: "InnovaTech",
    projectType: "web-app",
    projectTitle: "Customer Portal Development",
    description: "Building a customer portal that allows our clients to access their account information and support tickets.",
    timeline: "3-6 months",
    budget: "$25,000 - $50,000",
    aiScore: 78,
    status: "contacted",
    createdAt: "2023-05-10T14:22:00Z"
  },
  {
    id: "3",
    name: "Michael Chang",
    email: "michael@startupinc.io",
    company: "Startup Inc",
    phone: "+1 (555) 987-6543",
    projectType: "mobile-app",
    projectTitle: "Fitness Tracking App",
    description: "A mobile app that helps users track their fitness activities and nutrition.",
    timeline: "3-6 months",
    budget: "$25,000 - $50,000",
    aiScore: 62,
    status: "new",
    createdAt: "2023-05-18T11:15:00Z"
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@designstudio.com",
    company: "Design Studio",
    projectType: "portfolio",
    projectTitle: "Portfolio Website Redesign",
    description: "Redesigning our company portfolio website to showcase our recent work.",
    timeline: "1-2 months",
    budget: "$5,000 - $10,000",
    aiScore: 45,
    status: "new",
    createdAt: "2023-05-20T16:40:00Z"
  },
  {
    id: "5",
    name: "David Wilson",
    email: "d.wilson@enterprise.org",
    company: "Enterprise Solutions",
    phone: "+1 (555) 333-7777",
    projectType: "saas",
    projectTitle: "HR Management Platform",
    description: "Building a comprehensive HR management platform for internal use.",
    timeline: "6+ months",
    budget: "$50,000+",
    aiScore: 91,
    status: "qualified",
    createdAt: "2023-05-05T08:20:00Z"
  },
  {
    id: "6",
    name: "Linda Martinez",
    email: "l.martinez@retailgroup.com",
    company: "Retail Group",
    projectType: "e-commerce",
    projectTitle: "Mobile Shopping App",
    description: "Creating a native mobile shopping app for our retail brand.",
    timeline: "3-6 months",
    budget: "$25,000 - $50,000",
    aiScore: 72,
    status: "contacted",
    createdAt: "2023-05-12T10:10:00Z"
  },
  {
    id: "7",
    name: "Robert Kim",
    email: "robert.kim@techinnovators.com",
    company: "Tech Innovators",
    phone: "+1 (555) 123-9876",
    projectType: "ai-integration",
    projectTitle: "AI Customer Service Bot",
    description: "Implementing an AI chatbot to handle customer service inquiries on our website.",
    timeline: "1-2 months",
    budget: "$10,000 - $25,000",
    aiScore: 88,
    status: "new",
    createdAt: "2023-05-21T09:15:00Z"
  },
  {
    id: "8",
    name: "Jennifer Lee",
    email: "jlee@healthtech.org",
    company: "HealthTech",
    projectType: "web-app",
    projectTitle: "Patient Management System",
    description: "A web-based patient management system for healthcare providers.",
    timeline: "6+ months",
    budget: "$50,000+",
    aiScore: 95,
    status: "qualified",
    createdAt: "2023-05-02T11:30:00Z"
  },
  {
    id: "9",
    name: "Thomas Brown",
    email: "thomas@smallbusiness.net",
    company: "Small Business LLC",
    phone: "+1 (555) 444-5555",
    projectType: "portfolio",
    projectTitle: "Small Business Website",
    description: "Creating a simple website for our small business.",
    timeline: "ASAP",
    budget: "$5,000 - $10,000",
    aiScore: 35,
    status: "disqualified",
    createdAt: "2023-05-16T14:50:00Z"
  },
  {
    id: "10",
    name: "Amanda Clark",
    email: "amanda.c@edutech.edu",
    company: "EduTech",
    projectType: "saas",
    projectTitle: "Online Learning Platform",
    description: "Building an online learning platform for K-12 students.",
    timeline: "3-6 months",
    budget: "$25,000 - $50,000",
    aiScore: 82,
    status: "contacted",
    createdAt: "2023-05-08T13:20:00Z"
  }
];

export const mockLeadDetails: Partial<LeadDetails>[] = [
  {
    id: "1",
    goals: "Increase online sales by 30% within 6 months of launch. Improve user engagement and reduce cart abandonment rate.",
    targetAudience: "Adults aged 25-45 who are tech-savvy and interested in premium tech products.",
    specialRequirements: "Must integrate with our existing inventory management system. Mobile-first design approach required.",
    referralSource: "Google",
    files: [
      {
        name: "Current_Site_Analysis.pdf",
        size: "2.4 MB",
        url: "#"
      },
      {
        name: "Design_Inspirations.zip",
        size: "5.7 MB",
        url: "#"
      }
    ],
    aiInsights: {
      budget: "good",
      budgetReason: "The budget is appropriate for the project scope and timeline.",
      timeline: "good",
      timelineReason: "The timeline is realistic for the described project.",
      scope: "good",
      scopeReason: "The project has a well-defined scope with clear objectives.",
      requirements: "good",
      requirementsReason: "Requirements are detailed and clear, including integration needs.",
      recommendation: "This is a high-quality lead with a realistic budget and timeline. Recommend prioritizing and assigning to a senior e-commerce specialist."
    }
  },
  {
    id: "2",
    goals: "Create a self-service portal to reduce support calls by 50% and improve customer satisfaction scores.",
    targetAudience: "B2B customers who need regular access to account information and support resources.",
    referralSource: "Referral",
    aiInsights: {
      budget: "good",
      budgetReason: "The budget is appropriate for a customer portal development project.",
      timeline: "concern",
      timelineReason: "The timeline may be tight for the full scope as described. Consider phased approach.",
      scope: "good",
      scopeReason: "The project scope is specific and well-defined.",
      requirements: "concern",
      requirementsReason: "More details about integration requirements would be helpful.",
      recommendation: "This is a good lead with strong potential. Suggest a discovery call to clarify timeline expectations and technical requirements."
    }
  },
  {
    id: "3",
    goals: "Launch a competitive fitness app that stands out in the market. Target 50,000 downloads in the first 3 months.",
    targetAudience: "Fitness enthusiasts aged 18-35 who track their workouts and nutrition regularly.",
    specialRequirements: "Must include social sharing features and integration with fitness wearables.",
    referralSource: "Social Media",
    files: [
      {
        name: "Competitor_Analysis.xlsx",
        size: "1.2 MB",
        url: "#"
      }
    ],
    aiInsights: {
      budget: "concern",
      budgetReason: "The budget may be too low for a full-featured fitness app with wearable integrations.",
      timeline: "concern",
      timelineReason: "The timeline might be challenging given the scope and integration requirements.",
      scope: "good",
      scopeReason: "The project has a clear vision and defined features.",
      requirements: "good",
      requirementsReason: "The requirements are specific and include important technical details.",
      recommendation: "This lead shows promise but may need budget/timeline adjustment. Recommend a discovery call to discuss expectations and potential phased approach."
    }
  },
  {
    id: "4",
    goals: "Refresh our online presence to better showcase our recent work and attract more clients.",
    targetAudience: "Potential clients looking for design services, primarily in the tech and retail sectors.",
    referralSource: "Blog",
    aiInsights: {
      budget: "good",
      budgetReason: "The budget is appropriate for a portfolio website redesign.",
      timeline: "good",
      timelineReason: "The timeline is realistic for the described scope.",
      scope: "concern",
      scopeReason: "The scope could be more detailed to ensure all needs are addressed.",
      requirements: "concern",
      requirementsReason: "More specific requirements about content needs and desired features would be helpful.",
      recommendation: "This lead might need additional qualification. Recommend a brief discovery call to better understand their specific needs before providing a proposal."
    }
  },
  {
    id: "5",
    goals: "Create a comprehensive HR system that handles employee onboarding, benefits management, performance reviews, and compliance reporting.",
    targetAudience: "Internal HR staff and employees across the organization (500+ employees).",
    specialRequirements: "Must comply with various regulatory requirements. Single sign-on integration with existing systems required.",
    referralSource: "Google",
    files: [
      {
        name: "HR_Systems_Requirements.docx",
        size: "3.1 MB",
        url: "#"
      },
      {
        name: "Current_Process_Flowcharts.pdf",
        size: "4.5 MB",
        url: "#"
      },
      {
        name: "Integration_Specifications.xlsx",
        size: "2.2 MB",
        url: "#"
      }
    ],
    aiInsights: {
      budget: "good",
      budgetReason: "The budget is appropriate for an enterprise-level HR platform.",
      timeline: "good",
      timelineReason: "The timeline is realistic for the complex requirements described.",
      scope: "good",
      scopeReason: "The project has a well-defined scope with clear modules and features.",
      requirements: "good",
      requirementsReason: "Requirements are detailed and include important technical specifications and compliance needs.",
      recommendation: "This is a high-value enterprise lead with well-defined needs and appropriate budget. Prioritize and assign to the enterprise team."
    }
  },
  {
    id: "6",
    goals: "Increase mobile conversion rates by 40% and provide a better shopping experience for our mobile users.",
    targetAudience: "Existing customers and new shoppers, primarily women aged 25-45.",
    specialRequirements: "Must integrate with our existing inventory and POS systems. Support for push notifications required.",
    referralSource: "Other",
    aiInsights: {
      budget: "good",
      budgetReason: "The budget aligns with the project requirements for a native mobile app.",
      timeline: "good",
      timelineReason: "The timeline is appropriate for mobile app development with integrations.",
      scope: "good",
      scopeReason: "The project scope is well-defined with clear business objectives.",
      requirements: "concern",
      requirementsReason: "More details about the specific POS and inventory systems would help with planning.",
      recommendation: "This is a solid lead with good potential. Schedule a technical discovery call to discuss integration details before finalizing the proposal."
    }
  },
  {
    id: "7",
    goals: "Reduce customer service costs by 30% while maintaining high satisfaction rates. Handle routine inquiries automatically.",
    targetAudience: "Our customer base, ranging from tech-savvy millennials to older adults with basic tech skills.",
    specialRequirements: "Must integrate with our existing CRM system and support handoff to human agents when needed.",
    referralSource: "Blog",
    files: [
      {
        name: "Common_Customer_Queries.csv",
        size: "1.8 MB",
        url: "#"
      }
    ],
    aiInsights: {
      budget: "concern",
      budgetReason: "The budget may be tight for a sophisticated AI chatbot with advanced features.",
      timeline: "concern",
      timelineReason: "The timeline might be optimistic for a properly trained AI system.",
      scope: "good",
      scopeReason: "The project has clear objectives and a defined purpose.",
      requirements: "good",
      requirementsReason: "Integration requirements are specified and necessary features are described.",
      recommendation: "This lead is promising but may need expectation adjustment. Recommend a discovery call to discuss AI capabilities within the budget and timeline constraints."
    }
  },
  {
    id: "8",
    goals: "Streamline patient management workflow, improve data security, and ensure HIPAA compliance.",
    targetAudience: "Healthcare providers, including doctors, nurses, and administrative staff in medical practices.",
    specialRequirements: "Must meet HIPAA compliance requirements. Needs to integrate with existing EHR systems.",
    referralSource: "Referral",
    files: [
      {
        name: "System_Requirements.pdf",
        size: "5.2 MB",
        url: "#"
      },
      {
        name: "Compliance_Checklist.docx",
        size: "2.9 MB",
        url: "#"
      }
    ],
    aiInsights: {
      budget: "good",
      budgetReason: "The budget is appropriate for a comprehensive healthcare system with compliance requirements.",
      timeline: "good",
      timelineReason: "The timeline allows adequate time for development, testing, and compliance verification.",
      scope: "good",
      scopeReason: "The project scope is well-defined and addresses key healthcare needs.",
      requirements: "good",
      requirementsReason: "Requirements are detailed with specific compliance and integration needs.",
      recommendation: "This is a high-value lead with clear requirements and appropriate resources allocated. Assign to a team with healthcare experience and compliance expertise."
    }
  },
  {
    id: "9",
    goals: "Create an online presence for our small business to attract local customers.",
    targetAudience: "Local customers in our city who are looking for our products/services.",
    referralSource: "Google",
    aiInsights: {
      budget: "concern",
      budgetReason: "The budget is on the lower end for a professional business website.",
      timeline: "concern",
      timelineReason: "The 'ASAP' timeline may indicate unrealistic expectations about the development process.",
      scope: "concern",
      scopeReason: "The project description lacks specific details about functionality and content needs.",
      requirements: "concern",
      requirementsReason: "Requirements are vague and need significant clarification.",
      recommendation: "This lead appears to have misaligned expectations about costs and timelines. Consider offering a basic template solution rather than custom development, or providing education about realistic project parameters."
    }
  },
  {
    id: "10",
    goals: "Create an engaging learning platform that improves student outcomes and provides valuable analytics to educators.",
    targetAudience: "K-12 students, teachers, and school administrators.",
    specialRequirements: "Must be accessible and COPPA compliant. Integration with common school management systems required.",
    referralSource: "Referral",
    files: [
      {
        name: "Platform_Features.docx",
        size: "3.7 MB",
        url: "#"
      }
    ],
    aiInsights: {
      budget: "good",
      budgetReason: "The budget is appropriate for an education platform of this scope.",
      timeline: "good",
      timelineReason: "The timeline allows adequate time for development and testing.",
      scope: "good",
      scopeReason: "The project has a clear focus and educational purpose.",
      requirements: "good",
      requirementsReason: "Requirements include important compliance and integration specifications.",
      recommendation: "This is a solid lead with a well-defined educational technology project. Assign to a team with edtech experience and compliance knowledge."
    }
  }
];
