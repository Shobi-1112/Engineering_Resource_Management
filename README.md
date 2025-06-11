# Engineering Resource Management System

A web application for managing engineering resources, projects, and assignments, with role-based access for managers and engineers.

## Features

- **Authentication**: Secure login and registration for managers and engineers.
- **Role Management**: Assign users as managers or engineers.
- **Engineer Management**: Add, view, and manage engineers.
- **Project Management**: Create, assign, and track projects.
- **Assignment System**: Assign engineers to projects and track their capacity.
- **Dashboard**: Overview of resources, assignments, and project status.
- **Analytics**: Search and filter engineers/projects, view capacity and workload.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Shobi-1112/Engineering_Resource_Management.git
cd Engineering_Resource_Management
```

### 2. Install dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `server` directory:

```
MONGODB_URI=mongodb://localhost:27017/engineering_resource_management
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 4. Seed the database (optional, for sample data)

```bash
cd ../server
npm run seed
```

### 5. Start the applications

#### Server

```bash
npm run dev
```

#### Client

```bash
cd ../client
npm run dev
```

The client will run on [http://localhost:5173](http://localhost:5173) and the server on [http://localhost:5001](http://localhost:5001).

## Sample Accounts

**Manager**
- Email: manager1@example.com
- Password: manager123

**Engineer**
- Email: engineer1@example.com
- Password: engineer123

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login

### Projects
- `GET /api/projects` — List all projects
- `POST /api/projects` — Create a new project (Manager only)
- `GET /api/projects/:id` — Get project details

### Assignments
- `GET /api/assignments` — List all assignments
- `POST /api/assignments` — Assign engineer to project (Manager only)
- `GET /api/assignments/engineer/:engineerId/capacity` — Get engineer's capacity

## Folder Structure

```
Engineering_Resource_Management/
  client/   # React frontend
  server/   # Express backend
```

## Development Notes

- Use the provided sample accounts to log in as a manager or engineer.
- Managers can create projects and assign engineers.
- Engineers can view their assignments and workload.
- The system prevents over-assigning engineers beyond their capacity.

## License

This project is for educational/demo purposes.
