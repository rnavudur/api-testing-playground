# Overview

This is a full-stack API testing and development tool built with React and Express. It provides a Postman-like interface for making HTTP requests, viewing responses, and managing request history. The application features a modern UI built with shadcn/ui components and supports real-time API testing with request/response logging.

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
- **In-Memory Storage**: Current implementation uses JavaScript Map for storing API request history
- **Database Ready**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema Design**: Structured tables for API requests including headers, query params, body, and response data

## API Design Patterns
- **Proxy Pattern**: `/api/proxy` endpoint handles external API requests to bypass CORS
- **Request Logging**: Automatic capture and storage of all API interactions
- **Response Formatting**: Consistent response structure with metadata (status, timing, headers)

## External Dependencies
- **Neon Database**: PostgreSQL serverless database (configured but not actively used)
- **Radix UI**: Headless UI components for accessibility and consistency
- **TanStack Query**: Server state management and request caching
- **Axios**: HTTP client for making external API requests
- **Wouter**: Lightweight routing library
- **Tailwind CSS**: Utility-first CSS framework
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support