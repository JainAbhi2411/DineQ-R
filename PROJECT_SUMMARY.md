# DineQR - Smart Restaurant Menu System

## Overview
DineQR is a comprehensive digital menu management platform that connects restaurant owners and customers through an innovative QR code-based ordering system. The application eliminates traditional paper menus and streamlines the dining experience with real-time order management and secure payment processing.

## Key Features

### For Restaurant Owners
- **Restaurant Profile Management**: Create and manage restaurant profiles with complete business information
- **Digital Menu Management**: Add, edit, and organize menu items with images, descriptions, and prices
- **Category Organization**: Organize menu items into categories (appetizers, main courses, desserts, beverages)
- **QR Code Generation**: Generate unique QR codes for each table in the restaurant
- **Real-time Order Management**: Receive and manage customer orders instantly
- **Order Status Tracking**: Update order status (pending, preparing, served, completed)
- **Dashboard Analytics**: View order statistics and restaurant performance

### For Customers
- **QR Code Scanning**: Scan table QR codes to access restaurant menus
- **Menu Browsing**: View beautifully presented menus with food images and descriptions
- **Order Placement**: Select items, customize orders, and place orders directly
- **Secure Payments**: Complete payments through Stripe integration
- **Order Tracking**: Track order status in real-time
- **Order History**: View past orders and receipts

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **shadcn/ui** for beautiful, accessible UI components
- **React Router** for seamless navigation

### Backend & Database
- **Supabase** for backend services
  - PostgreSQL database for data storage
  - Row Level Security (RLS) for data protection
  - Real-time subscriptions for live updates
  - Storage for food images
  - Edge Functions for serverless logic

### Payment Processing
- **Stripe** for secure payment processing
- Stripe Checkout for hosted payment pages
- Payment verification through Edge Functions

## Database Schema

### Core Tables
1. **profiles** - User profiles with role-based access (owner/customer)
2. **restaurants** - Restaurant information and business details
3. **menu_categories** - Menu organization categories
4. **menu_items** - Food items with images, prices, and availability
5. **tables** - Restaurant tables with unique QR codes
6. **orders** - Customer orders with payment information
7. **order_items** - Individual items within orders

## Security Features
- **Authentication**: Username/password authentication via Supabase Auth
- **Role-Based Access Control**: Separate permissions for owners and customers
- **Row Level Security**: Database-level security policies
- **Secure Payment Processing**: PCI-compliant Stripe integration
- **Protected Routes**: Client-side route protection

## Design System
- **Primary Color**: Warm Orange (#FF6B35) - representing food and hospitality
- **Background**: Clean White (#FFFFFF)
- **Text**: Dark Gray (#2C3E50)
- **Layout**: Card-based grid layout with rounded corners (8px radius)
- **Typography**: Modern sans-serif with clear hierarchy
- **Icons**: Lucide React icons for consistent visual language

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Stripe account for payment processing

### Environment Setup
The application requires the following environment variables (already configured):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_APP_ID` - Application identifier

### Stripe Configuration
**IMPORTANT**: To enable payment processing, you need to configure your Stripe secret key:

1. Get your Stripe Secret Key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add it to your Supabase project secrets using the Supabase dashboard or CLI
3. The secret name should be: `STRIPE_SECRET_KEY`

Without this configuration, payment processing will not work.

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Run linting
pnpm run lint
```

## User Flows

### Restaurant Owner Flow
1. Register as a restaurant owner
2. Create restaurant profile with business details
3. Add menu categories and items with images
4. Generate QR codes for tables
5. Print and display QR codes on tables
6. Receive orders in real-time
7. Update order status as food is prepared and served
8. View order history and analytics

### Customer Flow
1. Register as a customer
2. Scan QR code on restaurant table
3. Browse the digital menu
4. Add items to cart with optional notes
5. Place order and proceed to payment
6. Complete payment via Stripe
7. Track order status
8. View order history

## API Integration

### Supabase Edge Functions
- **create_stripe_checkout**: Creates Stripe checkout sessions for orders
- **verify_stripe_payment**: Verifies payment completion and updates order status

### Database API
All database operations are encapsulated in `/src/db/api.ts`:
- `profileApi` - User profile management
- `restaurantApi` - Restaurant CRUD operations
- `menuCategoryApi` - Category management
- `menuItemApi` - Menu item management
- `tableApi` - Table and QR code management
- `orderApi` - Order management and tracking
- `imageApi` - Image upload and management

## Image Upload
- Food images are stored in Supabase Storage
- Maximum file size: 1MB
- Supported formats: JPEG, PNG, WEBP, GIF, AVIF
- Automatic compression for files exceeding size limit
- Public read access for all images
- Upload restricted to restaurant owners

## Future Enhancements
The current implementation provides core functionality. Additional features that can be added:
- Advanced menu management (bulk operations, import/export)
- Table reservation system
- Customer reviews and ratings
- Restaurant search and discovery
- Push notifications for order updates
- Analytics dashboard with charts
- Multi-language support
- Loyalty programs
- Special offers and promotions

## Project Structure
```
src/
├── components/
│   ├── common/          # Shared components (Header, ProtectedRoute)
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts (AuthContext)
├── db/                  # Database configuration and API
│   ├── supabase.ts      # Supabase client
│   └── api.ts           # Database API functions
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   ├── owner/           # Restaurant owner pages
│   ├── customer/        # Customer pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── PaymentSuccess.tsx
├── types/               # TypeScript type definitions
├── App.tsx              # Main app component
├── routes.tsx           # Route configuration
└── main.tsx             # Application entry point

supabase/
├── functions/           # Edge Functions
│   ├── create_stripe_checkout/
│   └── verify_stripe_payment/
└── migrations/          # Database migrations
```

## Notes
- Email verification is disabled for simplified username/password authentication
- Usernames can only contain letters, numbers, and underscores
- First registered user is automatically assigned customer role
- Restaurant owners can manage multiple restaurants
- Orders are linked to specific tables for tracking
- Payment processing requires Stripe configuration

## Support
For issues or questions, please refer to the documentation or contact support.
