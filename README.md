# API Playground - AI-Powered API Testing Tool

A comprehensive API testing playground built with React, Express, and PostgreSQL. Features intelligent suggestions, real-time analysis, and a beautiful modern interface.

## Features

### 🔐 Complete Authentication System
- User registration and login with bcryptjs encryption
- Session-based authentication with PostgreSQL storage
- Demo account access (demo@apiplayground.com / demo123)
- Protected routes and user profile management

### 🤖 AI-Powered Intelligence
- Smart API suggestions with 8+ pre-configured APIs
- Request templates with variable substitution
- Live performance analysis and security scoring
- Response comparison and diff tools

### 🎨 Modern UI/UX
- Beautiful purple/blue gradient design with animations
- Responsive design with Tailwind CSS and shadcn/ui
- Floating animations, hover effects, and smooth transitions
- Syntax-highlighted JSON responses

### 🚀 Advanced API Testing
- CORS proxy for external API requests
- Request history storage and management
- Comprehensive response analysis
- Real-time performance metrics

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **shadcn/ui** components with Radix UI
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend
- **Express.js** RESTful API server
- **PostgreSQL** with Neon serverless
- **Drizzle ORM** for database operations
- **bcryptjs** for password encryption
- **express-session** for authentication

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd api-playground
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Add to your environment:
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secure_session_secret
```

4. **Run database migrations**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  username VARCHAR UNIQUE,
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
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### API Testing
- `POST /api/proxy` - CORS proxy for external APIs
- `GET /api/history` - Get request history
- `POST /api/history` - Save request to history

## Demo Account

For instant testing, use the demo account:
- **Email**: demo@apiplayground.com
- **Password**: demo123

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express server
│   ├── auth.ts            # Authentication service
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
SESSION_SECRET=your-secure-random-string

# PostgreSQL (auto-configured by Replit)
PGDATABASE=your-database-name
PGHOST=your-database-host
PGPASSWORD=your-database-password
PGPORT=your-database-port
PGUSER=your-database-user
```

## Key Features Implemented

### 1. Authentication Flow
- Complete signup/login with validation
- Secure password hashing with bcryptjs
- Session management with PostgreSQL storage
- Protected route handling

### 2. API Testing Interface
- Request configuration (URL, method, headers, body)
- Response display with syntax highlighting
- Request history tracking
- CORS proxy for external APIs

### 3. AI-Powered Sidebar
- **API Suggestions**: Pre-configured popular APIs
- **Templates**: Reusable request templates
- **Analysis**: Performance metrics and security scoring
- **History**: Request history with filtering

### 4. Modern UI Design
- Purple/blue gradient theme with animations
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Professional landing page

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created by **Rishitha Navuduru** and is available for educational and development purposes.

## Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ by Rishitha Navuduru