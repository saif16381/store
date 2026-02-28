# Pakstore - Multi-Vendor E-commerce Marketplace

Pakstore is a serverless-first, multi-vendor e-commerce platform built with a thick-client SPA architecture. Independent creators can easily set up their own stores, manage product listings, and sell unique handcrafted products to a global audience.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Zustand (UI State), TanStack Query v5 (Server State), wouter (Routing).
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Session-based with bcrypt password hashing.
- **Media**: Cloudinary for image uploads and delivery optimization.

## Key Features

- **Multi-Vendor Architecture**: Users can register, become sellers, and manage their own storefronts.
- **Seller Dashboard**: Comprehensive tools for product CRUD, order management, and store settings.
- **Product Catalog**: Advanced search with category filtering, real-time stock updates, and responsive image galleries.
- **Cart & Checkout**: Persistent local cart with multi-vendor checkout support (Cash on Delivery MVP).
- **Reviews System**: Authenticated buyers can leave ratings and comments on purchased products.
- **Responsive & Animated**: Fully mobile-first design with smooth Framer Motion transitions and dark mode support.

## Project Structure

- `client/`: React frontend source code.
- `server/`: Express backend, API routes, and database storage logic.
- `shared/`: Shared Zod schemas and TypeScript type definitions.
- `attached_assets/`: Project requirement documentation.

## Setup & Configuration

1. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_secure_session_secret
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset (e.g., pakstore_uploads)
   ```

2. **Cloudinary Configuration**:
   - Create an unsigned upload preset named `pakstore_uploads`.
   - Set allowed formats: `jpg, png, webp, gif`.
   - Max file size: `5MB`.
   - Enable auto-format and auto-quality.

3. **Database Initialization**:
   ```bash
   npm run db:push
   ```

4. **Running Locally**:
   ```bash
   npm run dev
   ```

## API Security & Rules

- **Authentication**: All sensitive routes are protected by session-based middleware.
- **Ownership**: Sellers can only modify products and stores they own.
- **Data Integrity**: Zod schemas validate all incoming data on both client and server.
- **Optimized Queries**: Database indexes are configured for high-performance searching and filtering.

---
*Note: This project was migrated from a serverless-first design to a Node.js/Express environment while maintaining the thick-client SPA principles.*
