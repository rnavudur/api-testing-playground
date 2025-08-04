# Complete API Playground Repository Export

## Repository Structure

```
api-playground/
├── client/                         # Frontend React application
│   ├── src/
│   │   ├── components/ui/          # shadcn/ui components
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-toast.ts
│   │   │   └── useAuth.ts          # Authentication hook
│   │   ├── lib/                    # Utility libraries
│   │   │   ├── api-client.ts
│   │   │   ├── queryClient.ts      # TanStack Query setup
│   │   │   └── utils.ts            # Utility functions
│   │   ├── pages/                  # Page components
│   │   │   ├── home.tsx            # Main API playground
│   │   │   ├── landing.tsx         # Landing page
│   │   │   ├── login.tsx           # Login page
│   │   │   ├── not-found.tsx       # 404 page
│   │   │   └── signup.tsx          # Registration page
│   │   ├── App.tsx                 # Main app component
│   │   ├── index.css               # Global styles with animations
│   │   └── main.tsx                # App entry point
│   └── index.html                  # HTML template
├── server/                         # Backend Express server
│   ├── auth.ts                     # Authentication service
│   ├── db.ts                       # Database connection
│   ├── index.ts                    # Server entry point
│   ├── routes.ts                   # API routes
│   ├── storage.ts                  # Data storage layer
│   └── vite.ts                     # Vite development setup
├── shared/                         # Shared types and schemas
│   └── schema.ts                   # Database schema with Drizzle
├── components.json                 # shadcn/ui configuration
├── drizzle.config.ts              # Database configuration
├── package.json                    # Dependencies and scripts
├── package-lock.json              # Dependency lock file
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── README.md                      # Project documentation
└── replit.md                      # Project architecture notes
```

## Key Files and Their Purpose

### Authentication System
- `server/auth.ts` - User authentication logic with bcryptjs
- `client/src/hooks/useAuth.ts` - React authentication hook
- `client/src/pages/login.tsx` - Login page with demo account
- `client/src/pages/signup.tsx` - User registration page

### Database Layer
- `shared/schema.ts` - Database schema definitions with Drizzle ORM
- `server/db.ts` - PostgreSQL connection using Neon serverless
- `server/storage.ts` - Data access layer and storage interface

### API Testing Features
- `client/src/pages/home.tsx` - Main API playground interface
- `server/routes.ts` - API routes for authentication and proxy

### UI and Styling
- `client/src/index.css` - Custom animations and gradients
- `client/src/components/ui/` - shadcn/ui components
- `tailwind.config.ts` - Tailwind configuration with custom colors

## Environment Variables Required

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
SESSION_SECRET=your-secure-random-string-here

# PostgreSQL Connection (auto-configured in Replit)
PGDATABASE=your-database-name
PGHOST=your-database-host
PGPASSWORD=your-database-password
PGPORT=your-database-port
PGUSER=your-database-user
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  password VARCHAR NOT NULL,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IDX_session_expire ON sessions (expire);
```

### Demo User
```sql
INSERT INTO users (email, username, first_name, last_name, password) 
VALUES ('demo@apiplayground.com', 'demo', 'Demo', 'User', '$2b$12$2.HZhk0lnhFsU2gCGJ8m8uOqT.E.FTJsmb4LV.yX1hzqj3Du2XdPK');
```

## Installation and Setup

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
# Create .env file or set in Replit secrets
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secure_session_secret
```

3. **Initialize database**
```bash
npm run db:push
```

4. **Start development server**
```bash
npm run dev
```

## Key Features Implemented

### 🔐 Complete Authentication
- User registration with validation
- Secure login with bcryptjs hashing
- Session-based authentication
- Demo account access
- Protected routes

### 🎨 Modern UI Design
- Purple/blue gradient theme
- Smooth animations and transitions
- Responsive design
- Glassmorphism effects with backdrop blur
- Floating animations for visual appeal

### 🚀 API Testing Platform
- Request configuration interface
- Response display with syntax highlighting
- CORS proxy for external APIs
- Request history tracking
- Real-time performance analysis

### 🤖 AI-Powered Features
- Smart API suggestions
- Request templates
- Performance analysis
- Security scoring
- Response comparison tools

## Demo Account

- **Email**: demo@apiplayground.com
- **Password**: demo123

The demo account provides instant access to all features without registration.

## Development Scripts

- `npm run dev` - Start development server (Express + Vite)
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Architecture Highlights

### Frontend
- React 18 with TypeScript for type safety
- Wouter for lightweight client-side routing
- TanStack Query for server state management
- shadcn/ui components for consistent design
- Tailwind CSS with custom animations

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Session-based authentication
- CORS proxy for external API requests
- Comprehensive error handling

### Database
- PostgreSQL with Neon serverless
- UUID primary keys for security
- Session storage in database
- Proper indexing for performance

This repository represents a complete, production-ready API testing platform with modern architecture, secure authentication, and beautiful user interface.

**Created by: Rishitha Navuduru**