# API Testing Playground

A comprehensive React-based API testing playground designed to simplify and enhance API interaction for developers. Built with modern web technologies to streamline API development workflows and provide powerful testing capabilities.

![API Testing Playground](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express-4-green)

## ✨ Features

### Core Functionality
- **Instant API Testing** - Test any public API without writing code
- **Smart Request Builder** - Visual interface for headers, query params, and body
- **Real-time Response Viewer** - Syntax-highlighted JSON with proper formatting
- **Request History** - Automatic tracking and storage of all API interactions
- **Authentication System** - Secure signup/login with PostgreSQL backend

### AI-Powered Features
- **API Suggestions** - Pre-configured popular APIs with one-click setup
- **Request Templates** - Configurable templates with variable substitution
- **Live Analysis** - Real-time performance metrics and security scoring
- **Response Comparison** - Diff tool to compare responses between API calls

### Modern UI/UX
- **Purple/Blue Gradient Design** - Beautiful modern interface with animations
- **Responsive Layout** - Works perfectly on desktop and mobile
- **Glassmorphism Effects** - Backdrop blur and floating elements
- **Dark/Light Theme Support** - Seamless theme switching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/api-testing-playground.git
cd api-testing-playground
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/api_playground
SESSION_SECRET=your-secret-key-here
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5000`

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for styling with custom animations

### Backend (Express.js)
- **Express.js** RESTful API server
- **CORS Proxy** for external API requests
- **PostgreSQL** with Drizzle ORM
- **bcryptjs** for password encryption
- **Session-based authentication**

### Database Schema
```sql
-- Users table
users (id, email, username, firstName, lastName, profileImageUrl, createdAt, updatedAt)

-- API Requests history
api_requests (id, userId, method, url, headers, body, response, status, responseTime, createdAt)

-- Sessions table (for authentication)
sessions (sid, sess, expire)
```

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Route components
│   │   └── App.tsx         # Main app component
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   ├── auth.ts             # Authentication logic
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
└── package.json
```

## 🎯 Usage Examples

### Testing a REST API
1. Enter API URL: `https://jsonplaceholder.typicode.com/posts/1`
2. Select HTTP method (GET, POST, PUT, DELETE, PATCH)
3. Add headers if needed (Authorization, Content-Type, etc.)
4. Add query parameters
5. Add request body (for POST/PUT requests)
6. Click "Send Request"
7. View formatted JSON response

### Popular APIs to Try
- **JSONPlaceholder**: `https://jsonplaceholder.typicode.com/posts/1`
- **GitHub API**: `https://api.github.com/users/octocat`
- **REST Countries**: `https://restcountries.com/v3.1/name/usa`
- **HTTPBin**: `https://httpbin.org/get`

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push database schema changes
npm run db:studio    # Open database studio
```

### Adding New Features
1. **Frontend**: Add components in `client/src/components/`
2. **Backend**: Add routes in `server/routes.ts`
3. **Database**: Update schema in `shared/schema.ts`
4. **Types**: Export types from `shared/schema.ts`

## 🔒 Security Features

- **Password Encryption** - bcryptjs hashing
- **Session Management** - Secure HTTP-only cookies
- **CORS Protection** - Configurable CORS policies
- **SQL Injection Prevention** - Drizzle ORM with prepared statements
- **Input Validation** - Zod schema validation

## 🚢 Deployment

### Manual Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`
4. Configure reverse proxy (nginx/Apache)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Built with ❤️ by [Rishitha Navuduru](https://github.com/rishitha-navuduru)
- Powered by React, Express.js, and PostgreSQL
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)

**⭐ If you find this project helpful, please give it a star on GitHub!**
