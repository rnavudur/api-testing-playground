# Overview

This is a full-stack AI-powered API testing playground built with React and Express. Unlike basic tools like Postman, it includes intelligent features like API suggestions, request templates, live performance analysis, and response comparison. The application provides a comprehensive testing environment with syntax-highlighted responses, security scoring, and smart recommendations.

## Authentication System Added (January 2025)
- **Complete User Authentication**: Signup, login, and logout functionality with PostgreSQL database storage
- **Beautiful Landing Page**: Professional design showcasing app features and capabilities
- **Session Management**: Secure session-based authentication with express-session and PostgreSQL store
- **User Dashboard**: Authenticated users access the full API playground with personalized experience
- **Protected Routes**: All API testing features require authentication to ensure user data privacy

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React Single Page Application**: Uses React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for request logging
- **Proxy Architecture**: Acts as a CORS proxy for making external API requests
- **Request Storage**: In-memory storage system using Map data structures for request history
- **Schema Validation**: Drizzle-zod for request/response validation
- **Development Integration**: Vite middleware integration for seamless full-stack development

## Data Storage Solutions
- **PostgreSQL Database**: Full database implementation with Neon serverless PostgreSQL
- **User Management**: Complete user authentication with encrypted passwords using bcryptjs
- **Session Storage**: PostgreSQL-backed session storage for secure authentication state
- **API Request History**: All API requests stored in database with user association
- **Schema Design**: Structured tables for users, sessions, and API requests with proper relations

## API Design Patterns
- **Proxy Pattern**: `/api/proxy` endpoint handles external API requests to bypass CORS
- **Request Logging**: Automatic capture and storage of all API interactions
- **Response Formatting**: Consistent response structure with metadata (status, timing, headers)

## Unique Features Added (January 2025)
- **AI-Powered Sidebar**: Four intelligent tabs (API Suggestions, Templates, Analysis, History)
- **Smart API Suggestions**: Pre-configured popular APIs (OpenWeather, SpaceX, GitHub, etc.) with one-click setup
- **Request Templates**: Configurable templates with variable substitution for common API patterns
- **Live Request Analysis**: Real-time performance metrics, security scoring, and optimization suggestions
- **Response Comparison**: Diff tool to compare responses between different API calls
- **Enhanced JSON Viewer**: Custom syntax highlighting with proper formatting
- **Complete Authentication System**: Secure signup/login with beautiful UI and database storage
- **Professional Landing Page**: Showcases features with modern design and clear value proposition
- **User Profile Management**: Avatar display, dropdown menu with user info and logout functionality

## External Dependencies
- **Neon Database**: PostgreSQL serverless database (configured but not actively used)
- **Radix UI**: Headless UI components for accessibility and consistency
- **TanStack Query**: Server state management and request caching
- **Axios**: HTTP client for making external API requests
- **Wouter**: Lightweight routing library
- **Tailwind CSS**: Utility-first CSS framework
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support