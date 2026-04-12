# 🌿 Follicia - AI-Powered Hair Care E-Commerce Platform

> A next-generation hair care platform combining personalized AI diagnostics, intelligent product recommendations, and comprehensive business intelligence tools.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4.2-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Customer Features](#-customer-features)
- [Admin Features](#-admin-features)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Scripts](#-scripts)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

Follicia is a full-stack e-commerce platform designed specifically for the hair care industry. It leverages Google's Gemini AI to provide personalized hair diagnostics, intelligent product recommendations, and automated customer feedback analysis. The platform features a comprehensive admin dashboard with CRM, inventory management, analytics, and AI-powered business intelligence.

### Live Demo
- **Customer Portal**: [https://follicia.vercel.app](https://follicia.vercel.app)
- **Admin Dashboard**: [https://follicia.vercel.app/admin](https://follicia.vercel.app/admin)

---

## ✨ Key Features

### 🛍️ Customer Experience
- **AI Hair Diagnostics Quiz** - Personalized hair analysis using Gemini AI
- **Smart Product Recommendations** - AI-matched products based on hair profile
- **Membership Tiers** - Bronze, Silver, Gold plans with exclusive benefits
- **Loyalty Rewards System** - Earn and redeem points for discounts
- **Secure Payments** - Razorpay integration with invoice generation
- **User Dashboard** - Order tracking, hair DNA results, rewards management
- **Persistent Cart** - Synced across devices for authenticated users

### 📊 Admin & Business Intelligence
- **Comprehensive CRM** - Customer segmentation, lifetime value analysis
- **Inventory Management** - Real-time stock tracking, low-stock alerts
- **Order Management** - Full order lifecycle with status updates
- **Product Analytics** - Conversion funnels, view-to-purchase metrics
- **AI Feedback Intelligence** - Automated sentiment analysis and categorization
- **Marketing Campaigns** - Targeted customer outreach tools
- **Revenue Analytics** - Sales trends, revenue forecasting with Recharts

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router, React Server Components)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion 12.34.5
- **Charts**: Recharts 3.8.0
- **Icons**: Lucide React
- **State Management**: Zustand 5.0.12
- **Forms**: React Hook Form 7.71.2

### Backend
- **Runtime**: Node.js with TypeScript 5
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma 7.4.2
- **Authentication**: Clerk + Firebase Auth
- **AI/ML**: Google Generative AI (Gemini)
- **Payment Gateway**: Razorpay 2.9.6
- **API**: Next.js API Routes (REST)

### DevOps & Tools
- **Deployment**: Vercel
- **Database Hosting**: Neon (Serverless Postgres)
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript strict mode

---

## 🏗️ Architecture

```
follicia/
├── app/                          # Next.js App Router
│   ├── (customer)/              # Customer-facing routes
│   │   ├── page.tsx            # Homepage with hero carousel
│   │   ├── shop/               # Product catalog & details
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── quiz/               # AI hair diagnostics
│   │   └── dashboard/          # User dashboard
│   │       ├── page.tsx        # Dashboard overview
│   │       ├── orders/         # Order history
│   │       ├── dna/            # Hair DNA results
│   │       ├── rewards/        # Loyalty points
│   │       ├── membership/     # Plan management
│   │       └── settings/       # Profile settings
│   ├── admin/                   # Admin dashboard
│   │   ├── page.tsx            # Admin overview
│   │   ├── products/           # Product management
│   │   ├── orders/             # Order management
│   │   ├── customers/          # Customer CRM
│   │   ├── inventory/          # Stock management
│   │   ├── analytics/          # Business analytics
│   │   ├── crm-intelligence/   # CRM insights
│   │   ├── feedback/           # AI feedback analysis
│   │   └── auth/               # Admin authentication
│   └── api/                     # API routes
│       ├── products/           # Product APIs
│       ├── orders/             # Order APIs
│       ├── cart/               # Cart APIs
│       ├── user/               # User profile APIs
│       ├── ai/                 # AI diagnostic APIs
│       ├── razorpay/           # Payment APIs
│       ├── admin/              # Admin APIs
│       └── feedback/           # Feedback APIs
├── components/                  # Reusable React components
│   ├── admin/                  # Admin-specific components
│   ├── Navbar.tsx              # Main navigation
│   ├── Footer.tsx              # Site footer
│   ├── ProductGrid.tsx         # Product display grid
│   ├── AuthModal.tsx           # Authentication modal
│   └── ...
├── lib/                         # Utility libraries
│   ├── prisma.ts               # Prisma client singleton
│   ├── gemini.ts               # Gemini AI integration
│   ├── razorpay.ts             # Razorpay utilities
│   └── firebase.ts             # Firebase config
├── prisma/                      # Database schema & migrations
│   ├── schema.prisma           # Data models
│   ├── seed.ts                 # Database seeding
│   └── migrations/             # Migration history
├── scripts/                     # Utility scripts
│   ├── seed-loyalty-points.ts  # Loyalty system setup
│   ├── test-feedback-samples.ts # Feedback test data
│   └── ...
└── public/                      # Static assets

```

---

## 🛍️ Customer Features

### 1. AI Hair Diagnostics Quiz

**Location**: `/quiz`

The quiz uses Gemini AI to analyze user responses and provide personalized hair care recommendations.

**Features**:
- Multi-step questionnaire covering hair type, porosity, scalp condition
- AI-powered analysis generating:
  - Porosity Score (1-100)
  - Scalp Health Score (1-100)
  - Primary Concern identification
  - Clinical hair analysis summary
  - Recommended product tags
- Results stored in user profile for future recommendations

**API Endpoint**: `POST /api/ai/diagnose`

```typescript
// Request
{
  "answers": {
    "hairType": "curly",
    "scalpCondition": "dry",
    "concerns": ["frizz", "breakage"]
  }
}

// Response
{
  "porosityScore": 75,
  "scalpHealth": 60,
  "primaryConcern": "High Porosity Repair",
  "hairAnalysis": "Your hair shows signs of high porosity...",
  "targetTags": ["moisture", "protein", "anti-frizz"]
}
```

### 2. Smart Product Recommendations

**Location**: `/shop`, `/api/products/recommendations`

Products are intelligently matched to user profiles using AI-generated tags.

**Matching Algorithm**:
1. User's `targetTags` from quiz results
2. Product's `aiMatchTag` field
3. Hair type, porosity, and scalp condition filters
4. Collaborative filtering based on purchase history

### 3. Membership System

**Tiers**:
- **Bronze** (Free): Basic access, standard shipping
- **Silver** (₹499/month): 10% discount, priority support
- **Gold** (₹999/month): 20% discount, free shipping, exclusive products

**API**: `POST /api/user/update-plan`

### 4. Loyalty Rewards

**Earning Points**:
- Account creation: 100 points
- Quiz completion: 50 points
- Product purchase: 10 points per ₹100 spent
- Product review: 25 points

**Redeeming Points**:
- 500 points = ₹50 coupon
- 1000 points = ₹100 coupon
- 2000 points = ₹250 coupon

**API**: 
- `GET /api/user/my-coupons` - View available coupons
- `POST /api/user/redeem-points` - Redeem points for coupons

### 5. Shopping Cart & Checkout

**Features**:
- Persistent cart synced across devices
- Real-time stock validation
- Coupon code application
- Multiple shipping options (Standard/Express)
- Razorpay payment integration
- Automatic invoice generation

**APIs**:
- `GET /api/cart` - Fetch cart items
- `POST /api/cart` - Add/update cart items
- `POST /api/cart/sync` - Sync guest cart to user account
- `POST /api/cart/validate` - Validate stock before checkout
- `POST /api/razorpay/order` - Create Razorpay order
- `POST /api/razorpay/verify` - Verify payment
- `POST /api/razorpay/invoice` - Generate invoice

### 6. User Dashboard

**Location**: `/dashboard`

**Sections**:
- **Overview**: Order summary, loyalty points, membership status
- **Orders** (`/dashboard/orders`): Order history with tracking
- **Hair DNA** (`/dashboard/dna`): Quiz results and AI analysis
- **Rewards** (`/dashboard/rewards`): Points balance, redemption history
- **Membership** (`/dashboard/membership`): Plan details, upgrade options
- **Settings** (`/dashboard/settings`): Profile management

---

## 👨‍💼 Admin Features

### 1. Dashboard Overview

**Location**: `/admin`

**Metrics**:
- Total revenue (current month)
- Active orders count
- Total customers
- Low stock alerts
- Recent orders list
- Top-selling products

**API**: `GET /api/admin/stats`

### 2. Product Management

**Location**: `/admin/products`

**Features**:
- Add/Edit/Delete products
- Bulk inventory updates
- Product performance analytics
- AI tag management
- Image upload
- Stock level monitoring

**APIs**:
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

**Product Analytics**:
- Views count
- Add-to-cart rate
- Purchase conversion rate
- Cancellation rate
- Revenue contribution

### 3. Order Management

**Location**: `/admin/orders`

**Features**:
- Order list with filters (status, date range)
- Order details view (`/admin/orders/[id]`)
- Status updates (Pending → Processing → Paid → Shipped → Delivered)
- Customer information
- Payment tracking
- Invoice access

**APIs**:
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/[id]` - Order details
- `PATCH /api/admin/orders/[id]` - Update order status

### 4. Customer CRM

**Location**: `/admin/customers`

**Features**:
- Customer list with search/filter
- Customer segmentation:
  - High-value customers (>₹10,000 lifetime value)
  - Active members (orders in last 30 days)
  - At-risk customers (no orders in 90 days)
- Customer lifetime value (CLV) calculation
- Order history per customer
- Hair profile insights
- Loyalty points tracking

**API**: `GET /api/admin/customers`

**Customer Metrics**:
```typescript
{
  totalCustomers: number,
  newThisMonth: number,
  activeMembers: number,
  averageOrderValue: number,
  topCustomers: Array<{
    name: string,
    email: string,
    totalSpent: number,
    orderCount: number,
    lastOrderDate: string
  }>
}
```

### 5. Inventory Management

**Location**: `/admin/inventory`

**Features**:
- Real-time stock levels
- Low stock alerts (threshold: 5 units)
- Bulk stock updates
- Stock history tracking
- Reorder recommendations
- Product availability toggle

**APIs**:
- `POST /api/admin/inventory/bulk-update` - Update multiple products
- `POST /api/admin/inventory/reset` - Reset stock levels

### 6. Analytics Dashboard

**Location**: `/admin/analytics`

**Visualizations** (using Recharts):
- Revenue trends (line chart)
- Sales by category (pie chart)
- Conversion funnel (bar chart)
- Customer acquisition (area chart)
- Product performance (scatter plot)

**Metrics**:
- Total revenue
- Average order value
- Conversion rate
- Customer retention rate
- Cart abandonment rate

**API**: `GET /api/admin/analytics`

**Response Structure**:
```typescript
{
  revenue: {
    total: number,
    trend: Array<{ date: string, amount: number }>,
    growth: number // percentage
  },
  orders: {
    total: number,
    pending: number,
    completed: number,
    cancelled: number
  },
  products: {
    totalViews: number,
    totalAddToCarts: number,
    totalPurchases: number,
    conversionRate: number
  },
  customers: {
    total: number,
    new: number,
    returning: number,
    retentionRate: number
  }
}
```

### 7. CRM Intelligence

**Location**: `/admin/crm-intelligence`

**Features**:
- Customer segmentation analysis
- Lifetime value distribution
- Churn prediction
- Campaign targeting recommendations
- RFM (Recency, Frequency, Monetary) analysis
- Customer cohort analysis

**Segments**:
- **Champions**: High value, frequent buyers
- **Loyal Customers**: Regular purchasers
- **Potential Loyalists**: Recent customers with potential
- **At Risk**: Previously active, now inactive
- **Lost**: No activity in 6+ months

**API**: `GET /api/admin/crm-intelligence`

### 8. AI Feedback Intelligence

**Location**: `/admin/feedback`

**Features**:
- Automated feedback categorization using Gemini AI
- Sentiment analysis (Positive/Neutral/Negative)
- Urgency scoring (1-10 scale)
- AI-generated summaries
- Status workflow (New → Reviewed → Resolved)
- Interactive analytics dashboard

**Categories**:
- PAYMENT - Payment issues, refunds, billing
- PRODUCT - Product quality, effectiveness, packaging
- WEBSITE - UX issues, bugs, navigation problems
- DELIVERY - Shipping delays, damaged packages

**Analytics**:
- Category distribution (pie chart)
- Average urgency by category (bar chart)
- Sentiment trends over time
- Response time metrics

**APIs**:
- `GET /api/feedback` - List all feedback
- `POST /api/feedback` - Submit new feedback
- `PATCH /api/feedback/[id]` - Update feedback status

**AI Analysis Flow**:
```typescript
// 1. User submits feedback
POST /api/feedback
{
  rawComment: "Payment failed three times! Very frustrating.",
  rating: 1
}

// 2. Gemini AI analyzes
{
  aiCategory: "PAYMENT",
  sentiment: "NEGATIVE",
  aiSummary: "Customer experiencing repeated payment failures",
  urgencyScore: 9
}

// 3. Admin reviews and resolves
PATCH /api/feedback/[id]
{
  status: "RESOLVED"
}
```

### 9. Admin Authentication

**Location**: `/admin/auth`

**Security**:
- Separate admin authentication system
- JWT-based session management
- Role-based access control
- Secure password hashing

**API**: `POST /api/admin/login`

---

## 🚀 Installation

### Prerequisites
- Node.js 20+ 
- PostgreSQL database (or Neon account)
- npm or yarn
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/Atharvasp333/Follicia.git
cd Follicia
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### Step 4: Configure Environment Variables

See [Environment Variables](#-environment-variables) section below.

### Step 5: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npm run seed
```

### Step 6: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/follicia"
DIRECT_URL="postgresql://user:password@host:5432/follicia"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Firebase (Alternative Auth)
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="follicia.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="follicia"

# Google Gemini AI
GEMINI_API_KEY="AIza..."

# Razorpay Payment Gateway
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."

# Admin Authentication
ADMIN_JWT_SECRET="your-secure-random-string"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Getting API Keys

1. **Neon Database**: [https://neon.tech](https://neon.tech)
2. **Clerk Auth**: [https://clerk.com](https://clerk.com)
3. **Firebase**: [https://console.firebase.google.com](https://console.firebase.google.com)
4. **Gemini AI**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
5. **Razorpay**: [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

---

## 🗄️ Database Setup

### Prisma Schema

The database uses PostgreSQL with the following main models:

- **User** - Customer profiles with hair diagnostics
- **Product** - Hair care products with AI matching
- **Order** - Purchase orders with payment tracking
- **OrderItem** - Individual items in orders
- **CartItem** - Persistent shopping cart
- **QuizResult** - AI hair diagnostic results
- **LoyaltyTransaction** - Points earning/redemption history
- **RewardCoupon** - Redeemable discount coupons
- **UserCoupon** - User-coupon redemption tracking
- **Feedback** - Customer feedback with AI analysis
- **ProductEvent** - Product interaction tracking

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Prisma Studio

View and edit database records:

```bash
npx prisma studio
```

Access at `http://localhost:5555`

---

## 📜 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run seed             # Seed products and initial data
npm run migrate:stats    # Migrate product statistics

# Loyalty System
npm run init:loyalty     # Initialize loyalty points system
npm run seed:coupons     # Seed reward coupons
npm run seed:loyalty-points  # Add sample loyalty transactions
npm run check:points     # Check user points balance

# Feedback System
npm run setup:feedback   # Setup feedback tables
npm run seed:feedback    # Create sample feedback with AI analysis
npm run verify:feedback  # Verify feedback code integrity

# Analytics
npm run boost:data       # Boost conversion data for testing
```

---

## 📡 API Documentation

### Customer APIs

#### Products
```
GET    /api/products/recommendations  # Get AI-matched products
```

#### Cart
```
GET    /api/cart                      # Get user cart
POST   /api/cart                      # Add/update cart item
DELETE /api/cart                      # Remove cart item
POST   /api/cart/sync                 # Sync guest cart to user
POST   /api/cart/validate             # Validate stock availability
```

#### Orders
```
GET    /api/orders                    # Get user orders
POST   /api/orders                    # Create new order
```

#### User Profile
```
GET    /api/user/hair-profile         # Get hair diagnostic results
POST   /api/user/hair-profile         # Update hair profile
GET    /api/user/my-coupons           # Get available coupons
POST   /api/user/redeem-points        # Redeem loyalty points
POST   /api/user/update-plan          # Update membership plan
```

#### AI Diagnostics
```
POST   /api/ai/diagnose               # Analyze quiz responses
```

#### Payments
```
POST   /api/razorpay/order            # Create Razorpay order
POST   /api/razorpay/verify           # Verify payment signature
POST   /api/razorpay/invoice          # Generate invoice
```

#### Feedback
```
POST   /api/feedback                  # Submit feedback
```

### Admin APIs

#### Authentication
```
POST   /api/admin/login               # Admin login
POST   /api/admin/logout              # Admin logout
```

#### Products
```
GET    /api/admin/products            # List all products
POST   /api/admin/products            # Create product
PUT    /api/admin/products/[id]       # Update product
DELETE /api/admin/products/[id]       # Delete product
```

#### Orders
```
GET    /api/admin/orders              # List all orders
GET    /api/admin/orders/[id]         # Get order details
PATCH  /api/admin/orders/[id]         # Update order status
```

#### Customers
```
GET    /api/admin/customers           # List customers with metrics
```

#### Inventory
```
POST   /api/admin/inventory/bulk-update  # Bulk stock update
POST   /api/admin/inventory/reset        # Reset stock levels
```

#### Analytics
```
GET    /api/admin/analytics           # Get analytics data
GET    /api/admin/stats               # Get dashboard stats
GET    /api/admin/crm-intelligence    # Get CRM insights
```

#### Feedback
```
GET    /api/feedback                  # List all feedback (admin)
PATCH  /api/feedback/[id]             # Update feedback status
```

---

## 🎨 UI Components

### Customer Components
- `Navbar` - Main navigation with cart badge
- `Footer` - Site footer with links
- `HeroCarousel` - Homepage hero section
- `ProductGrid` - Product listing grid
- `ProductImage` - Optimized product images
- `AuthModal` - Authentication modal
- `QuizPopup` - Quiz promotion popup
- `PricingSection` - Membership plans
- `PointsBalance` - Loyalty points display
- `CouponSelector` - Coupon selection UI

### Admin Components
- `Sidebar` - Admin navigation sidebar
- `GrainTexture` - Aesthetic background texture
- Charts (Recharts):
  - `LineChart` - Revenue trends
  - `BarChart` - Category performance
  - `PieChart` - Distribution analysis
  - `AreaChart` - Customer growth

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "feat: initial deployment"
git push origin main
```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables**
   - Add all variables from `.env` to Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

4. **Database**
   - Ensure Neon database is accessible
   - Run migrations: `npx prisma migrate deploy`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## 🧪 Testing

### Test Accounts

**Customer**:
- Email: `test@follicia.com`
- Password: `Test123!`

**Admin**:
- Email: `admin@follicia.com`
- Password: `Admin123!`

### Test Payment

Use Razorpay test cards:
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Team

- **Developer**: Atharva Pingale
- **GitHub**: [@Atharvasp333](https://github.com/Atharvasp333)

---

## 📞 Support

For support, email support@follicia.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Google Gemini](https://ai.google.dev/) - AI/ML capabilities
- [Razorpay](https://razorpay.com/) - Payment processing
- [Clerk](https://clerk.com/) - Authentication
- [Vercel](https://vercel.com/) - Hosting platform
- [Recharts](https://recharts.org/) - Data visualization

---

**Built with ❤️ for the hair care industry**
