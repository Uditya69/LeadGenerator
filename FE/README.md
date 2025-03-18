
# GeniusDev - Lead Generation System

A fully AI-driven lead generation and management system for a software development agency built with React.js, Vite, and Tailwind CSS.

## Features

### Frontend - User Portal
- Project-Based Dynamic Lead Forms
- AI-Powered Lead Validation
- Automated Email Responses & Follow-ups
- Dark/Light Mode Support
- File Uploads (for documents, wireframes, etc.)
- API Integration for Backend

### Frontend - Admin Panel
- Standalone Admin Dashboard with Authentication
- View & Manage Leads (Change Status, AI Score, etc.)
- Trigger Email Follow-ups
- Dark/Light Mode Support

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure environment variables
3. Install dependencies with `npm install`
4. Start the development server with `npm run dev`

## Environment Variables

The application uses environment variables for configuration. Copy the `.env.example` file to `.env` and modify as needed:

```
# API Configuration
VITE_API_BASE_URL=/api  # Change to your real API URL in production

# Development Settings
VITE_DEBUG=false  # Set to true for additional debug logging

# Authentication Configuration
VITE_AUTH_STORAGE_KEY=adminToken  # Storage key for auth token
```

## API Integration

This application is designed to work with a backend API that provides the following endpoints:

- `POST /api/leads/create` - Submit new lead with form data
- `POST /api/validate-lead` - AI-based lead validation
- `POST /api/send-email` - Trigger email responses
- `POST /api/auth/login` - User/Admin login
- `GET /api/leads` - Fetch all leads (Admin Only)
- `GET /api/leads/:id` - Fetch a single lead (Admin Only)
- `PATCH /api/leads/:id/status` - Update lead status (Admin Only)

For development purposes, the application uses mock API responses.

## Authentication

The admin panel is protected with authentication. Use the following demo credentials:

- Email: admin@example.com
- Password: admin123

## Technology Stack

- Framework: React.js (Vite)
- Styling: Tailwind CSS (Dark/Light Mode)
- State Management: React Query
- Form Handling: React Hook Form + Zod Validation
- UI Components: Shadcn UI
