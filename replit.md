# E-commerce Product Page Application

## Overview

This is a modern full-stack e-commerce application featuring a pixel-perfect clone of a product page, built with React, TypeScript, Express.js, and PostgreSQL. The application uses a monorepo structure with shared types and schemas, implementing modern UI patterns with shadcn/ui components and Tailwind CSS styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with React plugin and runtime error overlay

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with JSON responses

### Database Schema
- **Products**: Comprehensive product information including pricing, inventory, images, and metadata
- **Cart Items**: Session-based shopping cart with product references and quantities
- **Users**: Basic user authentication structure (prepared for future use)

## Key Components

### Frontend Components
- **ProductPage**: Main product display with image gallery, product info, and details
- **ProductImageGallery**: Interactive image viewer with thumbnail navigation
- **ProductInfo**: Product details, size selection, and add-to-cart functionality
- **ProductDetails**: Expandable sections for fabric details and care instructions
- **Header**: Navigation with search, wishlist, and cart icons
- **Footer**: Brand information and social links
- **RelatedProducts**: Product recommendation carousel

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Product API**: CRUD operations for product management
- **Cart API**: Session-based cart operations (add, update, remove items)
- **Route Registration**: Centralized API endpoint management

### Shared Resources
- **Schema Definitions**: Drizzle ORM schemas with Zod validation
- **Type Safety**: End-to-end TypeScript types shared between client and server
- **Database Migrations**: Managed through Drizzle Kit

## Data Flow

1. **Product Loading**: Client fetches product data via React Query from Express API
2. **Cart Management**: Session-based cart operations with optimistic updates
3. **Image Display**: Progressive image loading with thumbnail navigation
4. **Size Selection**: Real-time inventory checking and size availability
5. **Add to Cart**: Validated cart operations with toast notifications

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing

### UI and Styling
- **@radix-ui/***: Accessible UI primitives (30+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Build Process**: Separate client (Vite) and server (esbuild) builds
- **Type Checking**: TypeScript compilation with strict mode enabled

### Production Build
- **Client Build**: Vite production build to `dist/public`
- **Server Build**: esbuild bundle to `dist/index.js`
- **Static Assets**: Served through Express static middleware
- **Database Migrations**: Drizzle Kit push for schema updates

### Environment Configuration
- **Database Connection**: Environment variable-based configuration
- **Session Management**: PostgreSQL-backed sessions for scalability
- **Error Handling**: Centralized error middleware with structured responses
- **Logging**: Request/response logging for API endpoints

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation between frontend and backend concerns. The shared schema approach ensures consistency across the full stack, while the component-based UI architecture allows for easy maintenance and extension.