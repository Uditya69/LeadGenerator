# Lead Generator

A full-stack application for generating and managing leads with AI-powered analysis and insights.

## Overview

Lead Generator is a modern web application that helps businesses capture, analyze, and manage leads through an intelligent form system. The application features:

- Multi-step lead capture form
- AI-powered lead analysis and scoring
- Admin dashboard for lead management
- Email integration for lead follow-up
- PDF export functionality
- Modern, responsive UI with dark mode support

## System Architecture

### Frontend (FE)
- Built with React + TypeScript
- Uses Vite as the build tool
- Implements a modern component-based architecture
- Features a responsive design with mobile support
- Uses Tailwind CSS for styling
- Implements shadcn/ui components for consistent UI

### Backend (BE)
- Node.js with Express
- TypeScript for type safety
- Prisma as the ORM
- PostgreSQL database
- OpenAI integration for AI analysis
- Email service integration

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- OpenAI API key
- SMTP server credentials (for email functionality)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd BE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/leadgenerator"
   JWT_SECRET="your-secret-key"
   OPENAI_API_KEY="your-openai-api-key"
   SMTP_HOST="your-smtp-host"
   SMTP_PORT=587
   SMTP_USER="your-smtp-user"
   SMTP_PASS="your-smtp-password"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL="http://localhost:3000"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

#### POST /auth/login
- Login endpoint for admin access
- Body: `{ email: string, password: string }`
- Returns: JWT token

### Leads

#### POST /leads
- Create a new lead
- Body: Lead form data
- Returns: Created lead object

#### GET /leads
- Get all leads (admin only)
- Query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search term
  - `status`: Filter by status
- Returns: Paginated leads with total count

#### GET /leads/:id
- Get lead details by ID (admin only)
- Returns: Lead object with AI insights

#### PUT /leads/:id
- Update lead status (admin only)
- Body: `{ status: string }`
- Returns: Updated lead object

#### DELETE /leads/:id
- Delete a lead (admin only)
- Returns: Success message

### Email

#### POST /email/send
- Send email using template
- Body: `{ to: string, templateId: string, variables: object }`
- Returns: Success message

#### POST /email/send-custom/:leadId
- Send custom email to lead (admin only)
- Body: `{ subject: string, content: string }`
- Returns: Success message

## Project Structure

```
├── BE/                 # Backend directory
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   ├── models/    # Database models
│   │   └── middleware/# Custom middleware
│   └── prisma/        # Database schema
│
└── FE/                 # Frontend directory
    ├── src/
    │   ├── components/# React components
    │   ├── pages/     # Page components
    │   ├── lib/       # Utilities and types
    │   └── hooks/     # Custom hooks
    └── public/        # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 