# CRM/AI Lead Generation System - Backend

This is the backend service for the CRM/AI Lead Generation System. It provides APIs for lead management, file uploads, and AI-powered lead analysis using Google's Gemini API.

## Features

- User authentication and authorization
- Lead management (CRUD operations)
- File upload and management
- AI-powered lead analysis
- Admin dashboard APIs
- Secure file handling

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (Neon)
- Google Gemini API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/crm_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="24h"
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   NODE_ENV="development"
   UPLOAD_DIR="uploads"
   MAX_FILE_SIZE=5242880
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new admin user

### Leads
- `POST /api/leads` - Create new lead
- `GET /api/leads` - Get all leads (admin only)
- `GET /api/leads/:id` - Get lead by ID (admin only)
- `PATCH /api/leads/:id/status` - Update lead status (admin only)
- `DELETE /api/leads/:id` - Delete lead (admin only)

### Files
- `POST /api/files/:leadId` - Upload file for a lead (admin only)
- `DELETE /api/files/:id` - Delete file (admin only)
- `GET /api/files/lead/:leadId` - Get all files for a lead (admin only)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Security

- JWT-based authentication
- Role-based access control
- File upload validation
- Secure file storage
- Input validation and sanitization

## Error Handling

The API uses a consistent error response format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 