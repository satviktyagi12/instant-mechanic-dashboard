Instant Mechanic — Live Operations Dashboard

A full-stack Live Vehicle Service Operations Dashboard built for an operations team to monitor bookings, mechanics, customers, services, revenue, and operational analytics.

Project Overview

The dashboard provides a centralized interface for managing day-to-day vehicle service operations.

Features
Dashboard overview with key operational metrics
Bookings over time analytics
Revenue over time analytics
Booking status analytics
Service/category breakdown
Booking search
Booking status filtering
Booking pagination
Booking detail page
Booking status updates
Mechanics monitoring
Customer management
Real database-driven data
Seeded sample data
Responsive UI
Loading and error states
Live data refresh
Tech Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Recharts
shadcn/ui
Backend
Node.js
Express
TypeScript
Prisma
Zod
Database
PostgreSQL
Deployment
Vercel — Frontend
AWS EC2 — Backend
GitHub — Source Code
Architecture
Frontend (Next.js)
        ↓
REST API
        ↓
Backend (Node.js + Express)
        ↓
Prisma ORM
        ↓
PostgreSQL

The frontend communicates with the backend through REST APIs. The backend handles API requests, validation, business logic, and database access through Prisma.

Dashboard

The overview dashboard includes:

Total bookings
Today's bookings
Completed bookings
Pending bookings
Cancelled bookings
Total revenue
Active mechanics
New customers
Analytics

The dashboard provides visual analytics for:

Bookings over time
Revenue over time
Booking status
Service/category breakdown
Bookings

The bookings section includes:

Booking ID
Customer
Vehicle
Service
Mechanic
Status
Amount
Date/time
Search
Status filtering
Pagination
Booking details
Booking status updates

Supported booking statuses:

PENDING
ASSIGNED
MECHANIC_ON_THE_WAY
IN_PROGRESS
COMPLETED
CANCELLED
Mechanics

The mechanics section displays:

Mechanic name
Current status
Jobs completed
Current/last booking

Supported mechanic statuses:

AVAILABLE
BUSY
OFFLINE
ON_BREAK
Database

The application uses PostgreSQL with Prisma ORM.

Main entities:

Customer
Mechanic
Service
Booking

Bookings are relationally connected to customers, mechanics, and services.

The project includes realistic seeded sample data with:

500+ bookings
50+ customers
20+ mechanics
Multiple service categories
Multiple booking statuses
Different booking dates
Different booking amounts
API Documentation
Health Check
GET /api/health
Dashboard
GET /api/dashboard

Returns dashboard overview statistics and analytics.

Bookings
GET /api/bookings

Supports pagination, search, and status filtering.

Example:

GET /api/bookings?page=1&limit=10

Search:

GET /api/bookings?page=1&limit=10&search=ABC

Filter:

GET /api/bookings?page=1&limit=10&status=PENDING
Booking Details
GET /api/bookings/:id
Update Booking Status
PATCH /api/bookings/:id/status

Example request:

{
  "status": "IN_PROGRESS"
}
Mechanics
GET /api/mechanics
Customers
GET /api/customers
Services
GET /api/services
Live Dashboard

The dashboard uses API refresh/polling to keep operational data up to date.

Booking status changes can be reflected without requiring a complete browser page reload.

Example workflow:

PENDING
   ↓
ASSIGNED
   ↓
MECHANIC_ON_THE_WAY
   ↓
IN_PROGRESS
   ↓
COMPLETED
Local Setup
Clone the repository
git clone https://github.com/satviktyagi12/instant-mechanic-dashboard.git
cd instant-mechanic-dashboard
Backend
cd backend
npm install

Create a .env file:

DATABASE_URL="your-postgresql-connection-string"
PORT=5000
NODE_ENV=development

Generate Prisma Client:

npm run prisma:generate

Run migrations:

npm run prisma:migrate

Seed the database:

npm run seed

Build:

npm run build

Start:

npm start

The backend runs on:

http://localhost:5000
Frontend

Open another terminal:

cd frontend
npm install

Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:5000

Start the frontend:

npm run dev

The frontend runs on:

http://localhost:3000
Environment Variables
Backend
DATABASE_URL="your-postgresql-connection-string"
PORT=5000
NODE_ENV=development
Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000

For production, set NEXT_PUBLIC_API_URL to the deployed backend URL.

Never commit .env or .env.local files containing credentials.

Deployment
Frontend

The Next.js frontend is deployed using Vercel.

Production environment variable:

NEXT_PUBLIC_API_URL
Backend

The Node.js and Express backend is deployed on AWS EC2.

The backend uses PostgreSQL through Prisma and requires the DATABASE_URL environment variable.

AI Usage

AI tools were used as development assistants throughout the project.

AI was used for:

Architecture discussions
Database design
API design
Frontend development
Debugging
TypeScript and Prisma troubleshooting
Deployment troubleshooting
Documentation
Sample data generation
UX improvements

All generated code was reviewed, tested, debugged, and modified during implementation.

What I Am Most Proud Of

I am most proud of building the project as a complete full-stack application rather than a static dashboard.

The frontend communicates with a real backend API and PostgreSQL database, while the dashboard provides operational analytics, booking management, mechanic monitoring, search, filtering, pagination, and booking status updates.

The project demonstrates the complete development workflow from database design and API development to frontend integration and deployment.

Project Structure
instant-mechanic-dashboard/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
Links
GitHub

https://github.com/satviktyagi12/instant-mechanic-dashboard

Frontend

https://instant-mechanic-dashboard-rosy.vercel.app

Backend

AWS EC2 deployment.

API Documentation

API endpoints are documented above.

Built as a Full Stack Developer Internship assignment for Instant Mechanic.