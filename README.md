# API Playground

A modern, AI-powered API testing platform built with React and Express. Test any public API without coding, featuring intelligent suggestions, request templates, live performance analysis, and beautiful UI with smooth animations.

![API Playground Screenshot](https://via.placeholder.com/800x400/6366f1/ffffff?text=API+Playground)

## 🚀 Features

### 🔐 Authentication System
- **Secure User Registration & Login** - Complete authentication with PostgreSQL and bcryptjs
- **Demo Account Access** - Try instantly with `demo@apiplayground.com / demo123`
- **Session Management** - Secure session-based authentication

### 🎨 Modern UI/UX
- **Purple/Blue Gradient Theme** - Beautiful color scheme with modern design
- **Smooth Animations** - Floating icons, gradient movement, hover effects
- **Glassmorphism Effects** - Backdrop blur and modern visual effects
- **Responsive Design** - Works perfectly on all devices

### 🤖 AI-Powered Features
- **Smart API Suggestions** - Pre-configured popular APIs (OpenWeather, GitHub, REST Countries)
- **Request Templates** - Ready-to-use templates for common API patterns
- **Live Performance Analysis** - Real-time metrics and security scoring
- **Response Comparison** - Diff tool to compare API responses

### 🛠️ API Testing Platform
- **Multiple HTTP Methods** - GET, POST, PUT, DELETE, PATCH support
- **Headers & Query Parameters** - Full control with enable/disable toggles
- **Request Body Editor** - JSON, form data, and raw text support
- **Syntax-Highlighted Responses** - Beautiful JSON viewer with copy functionality
- **Request History** - Track and revisit all your API calls
- **CORS Proxy** - Test any public API without CORS issues

## 🖥️ Screenshots

### Landing Page
Beautiful landing page with feature highlights and easy access to demo account.

### Main Playground
Comprehensive API testing interface with intelligent sidebar and response viewer.

### Authentication
Secure login and registration with modern form design.

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **shadcn/ui** components built on Radix UI
- **Tailwind CSS** with custom animations
- **Vite** for fast development and builds

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Neon serverless
- **Drizzle ORM** for type-safe database operations
- **bcryptjs** for password encryption
- **Express Sessions** for authentication state

### Database
- **PostgreSQL** with UUID primary keys
- **Session storage** in database for scalability
- **User management** with encrypted passwords
- **Request history** tracking per user

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/api-playground.git
cd api-playground
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-random-string-here
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5000`

## 🗄️ Database Setup

The application uses PostgreSQL with the following main tables:

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

### Sessions Table (for authentication)
```sql
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
```

### Demo User Account
The application includes a pre-configured demo account:
- **Email**: `demo@apiplayground.com`
- **Password**: `demo123`

## 📁 Project Structure

```
api-playground/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   └── ...
├── server/                 # Backend Express server
│   ├── auth.ts             # Authentication logic
│   ├── db.ts               # Database connection
│   ├── routes.ts           # API routes
│   └── ...
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema
└── ...
```

## 🔧 Development Scripts

- `npm run dev` - Start development server (Express + Vite)
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio for database management

## 🌟 Key Features Explained

### Smart API Suggestions
Pre-configured popular APIs including:
- **OpenWeatherMap** - Weather data
- **JSONPlaceholder** - Testing and prototyping
- **REST Countries** - Country information
- **GitHub API** - Repository and user data
- **CoinGecko** - Cryptocurrency prices

### Request Templates
Ready-to-use templates for:
- REST API GET/POST/DELETE requests
- GraphQL queries with variables
- Form data uploads
- Authenticated requests

### Performance Analysis
Real-time analysis including:
- **Security Score** - HTTPS usage, authentication headers
- **Performance Metrics** - Response time analysis
- **Recommendations** - Best practices and optimizations

### Response Comparison
Advanced diff tool to compare:
- Multiple API responses
- Different request configurations
- Historical data changes

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple/Blue gradients (`#6366f1`, `#8b5cf6`, `#3b82f6`)
- **Backgrounds**: Gradient animations and glassmorphism effects
- **Text**: Semantic slate colors for readability

### Animations
- **Floating Icons** - Subtle animation on key elements
- **Gradient Movement** - Dynamic background gradients
- **Hover Effects** - Smooth scale and glow transitions
- **Loading States** - Elegant loading indicators

## 🔒 Security Features

- **Password Encryption** - bcryptjs with salt rounds
- **Session Security** - HTTP-only cookies with secure flags
- **CORS Protection** - Configured CORS policies
- **Input Validation** - Comprehensive request validation
- **SQL Injection Protection** - Parameterized queries via Drizzle ORM

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_production_session_secret
```

### Recommended Platforms
- **Vercel** - For frontend and serverless functions
- **Railway** - For full-stack deployment
- **Neon** - For PostgreSQL database hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **Radix UI** - For accessible UI primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Drizzle ORM** - For type-safe database operations
- **TanStack Query** - For excellent server state management

## 👨‍💻 Author

**Rishitha Navuduru**

- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn URL]
- GitHub: [Your GitHub URL]

---

⭐ **Star this repository if you find it helpful!**

Built with ❤️ using React, TypeScript, and modern web technologies.