
import { 
  Lead, 
  LeadDetails, 
  User, 
  ProjectType,
  ServiceItem,
  TestimonialItem,
  TeamMember,
  ContactInfo,
  FAQItem
} from './types';

// Project Types
export const projectTypes: ProjectType[] = [
  {
    id: 'e-commerce',
    name: 'E-Commerce',
    description: 'Online stores with secure checkout and inventory management',
    icon: '🛒',
  },
  {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Subscription-based software solutions for businesses',
    icon: '⚙️',
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Native or cross-platform mobile applications',
    icon: '📱',
  },
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Interactive web-based software solutions',
    icon: '💻',
  },
  {
    id: 'portfolio',
    name: 'Portfolio / Business Site',
    description: 'Showcase your business, work or personal brand',
    icon: '🌟',
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    description: 'Add artificial intelligence to existing products',
    icon: '🤖',
  },
];

// Services Data
export const services: ServiceItem[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Modern, responsive websites and web applications built with the latest technologies.',
    icon: '💻',
    features: [
      'Responsive design for all devices',
      'Performance optimization',
      'SEO best practices',
      'Accessibility compliance',
      'Custom CMS integration'
    ]
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    icon: '📱',
    features: [
      'Native iOS and Android development',
      'Cross-platform with React Native',
      'Progressive Web Apps (PWAs)',
      'App Store optimization',
      'Push notifications'
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    description: 'Full-featured online stores with secure payment processing and inventory management.',
    icon: '🛒',
    features: [
      'Custom storefront design',
      'Secure payment processing',
      'Inventory management',
      'Order fulfillment integration',
      'Customer account management'
    ]
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    description: 'Enhance your products with artificial intelligence and machine learning capabilities.',
    icon: '🤖',
    features: [
      'Natural language processing',
      'Computer vision integration',
      'Predictive analytics',
      'Recommendation engines',
      'Chatbots and virtual assistants'
    ]
  },
  {
    id: 'cloud-services',
    title: 'Cloud Services',
    description: 'Scalable cloud infrastructure and serverless application development.',
    icon: '☁️',
    features: [
      'AWS, Azure, and Google Cloud',
      'Serverless architecture',
      'Microservices implementation',
      'Database optimization',
      'DevOps automation'
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive user interfaces and experiences that delight users.',
    icon: '🎨',
    features: [
      'User research and testing',
      'Wireframing and prototyping',
      'Visual design and branding',
      'Interaction design',
      'Usability testing'
    ]
  }
];

// Testimonials
export const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO at TechStart',
    content: 'GeniusDev transformed our business with their e-commerce solution. Sales increased by 45% in the first quarter after launch.',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CTO at InnovateCorp',
    content: 'Their team delivered our SaaS platform ahead of schedule and under budget. The quality of their code is exceptional.',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Marketing Director at GrowthLabs',
    content: 'The mobile app they built for us has a 4.8-star rating on both app stores. User feedback has been overwhelmingly positive.',
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Founder of WilsonRetail',
    content: 'GeniusDev integrated AI into our existing platform seamlessly. Our customer service efficiency improved by 60%.',
    image: '/placeholder.svg'
  }
];

// Team Members
export const team: TeamMember[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Founder & CEO',
    bio: 'With over 15 years in software development, Alex founded GeniusDev to build technology that makes a difference.',
    image: '/placeholder.svg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    }
  },
  {
    id: 2,
    name: 'Jason Lee',
    role: 'CTO',
    bio: 'Former Google engineer with expertise in scalable systems and AI integration.',
    image: '/placeholder.svg',
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    }
  },
  {
    id: 3,
    name: 'Sophia Chen',
    role: 'Lead Designer',
    bio: 'Award-winning designer with a passion for creating intuitive and beautiful user experiences.',
    image: '/placeholder.svg',
    social: {
      linkedin: 'https://linkedin.com',
      dribbble: 'https://dribbble.com'
    }
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    role: 'Lead Developer',
    bio: 'Full-stack developer specializing in React and Node.js with 8 years of experience building complex web applications.',
    image: '/placeholder.svg',
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  }
];

// Contact Information
export const contactInfo: ContactInfo = {
  email: 'uditya04@gmail.com',
  phone: '+1 (555) 123-4567',
  address: '123 Tech Lane, San Francisco, CA 94107',
  socialMedia: {
    twitter: 'https://twitter.com/geniusdev',
    linkedin: 'https://linkedin.com/company/geniusdev',
    github: 'https://github.com/geniusdev',
    instagram: 'https://instagram.com/geniusdev'
  },
  mapLocation: {
    lat: 37.7749,
    lng: -122.4194,
    zoom: 13
  }
};

// FAQ Items
export const faqs: FAQItem[] = [
  {
    question: 'What is your development process like?',
    answer: 'We follow an agile methodology with two-week sprints. Our process includes discovery, planning, design, development, testing, and deployment phases with regular client check-ins.'
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on complexity. A simple website might take 4-6 weeks, while a complex application could take 3-6 months. We provide detailed timelines during the proposal phase.'
  },
  {
    question: 'Do you provide support after launch?',
    answer: 'Yes, we offer various maintenance and support packages to keep your application running smoothly after launch. These include bug fixes, security updates, and performance monitoring.'
  },
  {
    question: 'What technologies do you specialize in?',
    answer: 'Our team specializes in modern JavaScript frameworks (React, Vue, Node.js), native mobile development (Swift, Kotlin), and cloud services (AWS, Azure, GCP). We select the best technology stack for your specific needs.'
  },
  {
    question: 'How do you handle project changes or additions?',
    answer: 'We understand that requirements can evolve. We have a structured change request process that evaluates the impact on timeline, scope, and budget before implementation.'
  },
  {
    question: 'Do you offer fixed-price contracts or hourly billing?',
    answer: "We offer both fixed-price contracts for well-defined projects and time-and-materials billing for projects with evolving requirements. We'll recommend the best approach based on your needs."
  }
];

// Use mockData from mockData.ts as fallback for API
import { mockLeads, mockLeadDetails } from './mockData';
export { mockLeads, mockLeadDetails };

// Export a function that can be used to get data with fallback
export const getDataWithFallback = <T>(apiData: T | null, fallbackData: T): T => {
  return apiData !== null ? apiData : fallbackData;
};
