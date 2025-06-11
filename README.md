# Engineering Resource Management System (ERMS)

A full-stack application to manage engineering team assignments across projects. Track who's working on what, their capacity allocation, and when they'll be available for new projects.

## Features

- Authentication & User Roles (Manager and Engineer)
- Engineer Management (Skills, Seniority, Capacity)
- Project Management
- Assignment System
- Capacity Tracking
- Dashboard Views
- Search & Analytics

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- React Router
- React Query
- React Hook Form
- Zod for validation
- Tailwind CSS

### Backend
- Node.js + Express
- TypeScript
- MongoDB
- JWT Authentication
- Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd ERMS
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start MongoDB:
Make sure MongoDB is running on your system.

4. Start the development servers:

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Sample Accounts

### Manager Accounts
1. Sarah Johnson
   - Email: sarah@example.com
   - Password: password123

2. Michael Chen
   - Email: michael@example.com
   - Password: password123

### Engineer Accounts
1. John Smith (Senior)
   - Email: john@example.com
   - Password: password123
   - Skills: React, Node.js, TypeScript

2. Emily Davis (Mid-level)
   - Email: emily@example.com
   - Password: password123
   - Skills: Python, Django, PostgreSQL

3. Alex Wong (Junior)
   - Email: alex@example.com
   - Password: password123
   - Skills: React, TypeScript, AWS

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/profile

### Projects
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id

### Assignments
- GET /api/assignments
- POST /api/assignments
- GET /api/assignments/engineer/:engineerId
- GET /api/assignments/engineer/:engineerId/capacity
- PUT /api/assignments/:id
- DELETE /api/assignments/:id

## Development

### Database Seeding
To populate the database with sample data:
```bash
cd server
npm run seed
```

### Building for Production
```bash
# Build backend
cd server
npm run build

# Build frontend
cd ../client
npm run build
```

## License

MIT 