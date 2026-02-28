# Pakstore - Multi-Vendor E-commerce Marketplace

Pakstore is a high-performance, multi-vendor e-commerce platform where independent creators can set up their own stores and sell unique handcrafted products.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Zustand, TanStack Query v5, wouter.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Session-based with Passport.js and bcrypt.
- **Storage**: Cloudinary for images.

## Setup Instructions

1. **Environment Variables**:
   Create a `.env` file with the following:
   ```env
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_secret_string
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   ```bash
   npm run db:push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Key Features

- **Multi-Vendor System**: Users can switch between buyer and seller roles.
- **Store Management**: Sellers can create and customize their storefronts.
- **Product CRUD**: Full product management with multi-image support.
- **Cart & Checkout**: Persistent cart and streamlined order placement.
- **Order Tracking**: Buyers can view history; sellers can manage status.
- **Responsive Design**: Optimized for all devices with dark mode support.
- **Smooth Animations**: Powered by Framer Motion for a premium feel.

## Project Structure

- `client/`: React frontend.
- `server/`: Express backend and database storage.
- `shared/`: Shared schemas and types.
- `attached_assets/`: Project requirement documents.
