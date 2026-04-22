<div align="center">
  <img src="public/assets/banner.png" alt="Follicia Banner" width="100%" />
</div>

# Follicia | Full-Stack AI E-Commerce

A specialized D2C platform integrating biological metadata for personalized hair care and AI-powered administrative intelligence.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)](https://neon.tech/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=for-the-badge&logo=razorpay&logoColor=3395FF)](https://razorpay.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Recharts](https://img.shields.io/badge/Recharts-FF6B6B?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![Lucide React](https://img.shields.io/badge/Lucide%20React-F56565?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?style=for-the-badge&logo=radixui&logoColor=white)](https://www.radix-ui.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

## Core Features

### Storefront & Personalization

**Diagnostic Engine**
- Multi-step "Hair DNA" quiz capturing porosity, scalp condition, and texture metadata
- Raw answers stored as JSON in `QuizResult` model
- AI generates clinical summaries and numerical health metrics (porosity score, scalp health)
- Results stored in `User` model for downstream matching

**Bio-Matching Logic**
- Server-side filtering maps user profiles to product formulations
- Products contain array fields (`hairType[]`, `porosity[]`, `scalpCondition[]`)
- Recommendation engine uses `aiMatchTag` and `targetTags[]` for semantic matching
- Intersects user attributes with product capabilities

**Dynamic Catalog**
- Full product listing with category filtering and real-time stock indicators
- `inventoryCount` and `lowStockThreshold` trigger visual alerts
- Product events (`VIEW`, `CART`, `PURCHASE`, `CANCEL`) logged for analytics
- Time-series data stored in `ProductEvent` table

**Responsive UI**
- Mobile-first design with Tailwind CSS 4 and glassmorphism aesthetics
- Framer Motion for page transitions and micro-interactions
- Next.js 14 App Router with server/client component separation

---

### AI Feedback Intelligence

**NLP Pipeline**
- Gemini 2.5 Flash integration for unstructured feedback processing
- Raw comments sent with structured prompts for categorization and analysis
- Automated extraction of business insights from customer text

**Automated Categorization**
- AI maps comments to business sectors: `PAYMENT`, `PRODUCT`, `WEBSITE`, `DELIVERY`
- `Feedback` model stores `rawComment` + AI fields (`aiCategory`, `sentiment`, `urgencyScore`)
- Structured data enables operational analytics

**Sentiment & Urgency**
- Sentiment tags: `POSITIVE`, `NEUTRAL`, `NEGATIVE`
- Urgency Score (1-10) prioritizes critical failures
- High-urgency feedback (≥8) flagged for immediate review

**Admin Summary**
- AI-generated single-sentence executive summaries (`aiSummary`)
- Reduces administrative review time
- Enables rapid triage in admin dashboard

---

### ERP & Administrative Dashboard

**Operational KPI Tracking**
- Real-time metrics: total revenue, active orders, customer growth
- Admin stats API aggregates data using Prisma (`_sum`, `_count`)
- Data sourced from `Order`, `User`, and `Product` tables

**Data Visualization**
- Interactive Recharts for category distribution (Pie Charts) and sentiment trends
- Time-series feedback volume by category and sentiment
- Configurable date ranges for analytics

**Inventory Control (SCM)**
- Centralized product management with low-stock alerts
- Dashboard displays products where `inventoryCount ≤ lowStockThreshold`
- Bulk update operations for batch stock modifications

**Customer CRM Intelligence**
- User segmentation by biological attributes and purchase history
- Filters: `hairType`, `porosity`, `scalpCondition`, `plan` tier
- Gift loyalty points or coupons to specific customer segments

---

### Checkout & Security

**Payment Gateway**
- Razorpay integration for INR transactions with webhook confirmation
- Flow: Create order → Capture payment client-side → Verify signature server-side
- HMAC-SHA256 validation in `/api/razorpay/verify`

**Atomic Transactions**
- Stock decrement only on successful payment verification
- Order creation + inventory updates wrapped in Prisma transactions
- Prevents race conditions and overselling

**Authentication**
- Firebase Auth with Google OAuth
- Server-side session validation via Firebase ID tokens
- `firebaseUid` links Firebase accounts to Prisma `User` records

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Framer Motion, Tailwind CSS 4 |
| **Backend** | Node.js Server Actions, Prisma ORM 7.4.2 |
| **Database** | PostgreSQL (Neon), Firebase Auth |
| **AI & APIs** | Google Gemini 2.5 Flash, Razorpay Payment Gateway |
| **State Management** | Zustand, React Hook Form |
| **UI Components** | Radix UI, Lucide Icons, Recharts |
| **Deployment** | Vercel (Edge Runtime) |

---

## Database Schema Overview

| Table | Description |
|-------|-------------|
| `users` | Auth mapping, hair profile (hairType, porosity, scalpCondition), AI metrics, membership tier, loyalty points |
| `products` | Catalog with bio-matching arrays, AI tags, ingredients, inventory tracking, interaction counters |
| `product_events` | Time-series log for VIEW, CART, PURCHASE, CANCEL analytics |
| `orders` | Order lifecycle (PENDING → DELIVERED), Razorpay tracking, shipping, coupons, invoices |
| `order_items` | Line items with product-order links, quantity, price snapshots |
| `cart_items` | Persistent cart for authenticated users |
| `quiz_results` | Raw quiz JSON, AI diagnostics, hair goals, analysis status |
| `feedback` | Raw comments + AI metadata (category, sentiment, urgency, summary, status) |
| `loyalty_transactions` | Point movement audit log (EARNED/REDEEMED) |
| `reward_coupons` | Redeemable coupons with point costs and discounts |
| `user_coupons` | User-coupon redemption tracking |

---

## Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database (Neon recommended)
- Firebase project with Auth enabled
- Razorpay account (test/live keys)
- Google AI Studio API key (Gemini)

### Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'

# Firebase (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=app_id

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=secret_xxxxx

# Gemini AI
GEMINI_API_KEY=your_gemini_key

# Admin Auth
ADMIN_ID=admin@follicia.com
ADMIN_PASSWORD=secure_password
ADMIN_JWT_SECRET=random_32_char_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation Steps

```bash
# Clone repository
git clone https://github.com/atharvasp333/follicia
cd follicia

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (products, coupons)
npm run seed
npm run seed:coupons

# Initialize loyalty points system
npm run init:loyalty

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Key API Endpoints

### Public APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products/recommendations` | AI-matched product suggestions based on user hair profile |
| `POST` | `/api/cart` | Add/update cart items (authenticated users only) |
| `POST` | `/api/orders` | Create new order with shipping details |
| `POST` | `/api/razorpay/order` | Generate Razorpay order ID for payment |
| `POST` | `/api/razorpay/verify` | Verify payment signature (HMAC-SHA256) |
| `POST` | `/api/ai/diagnose` | Process quiz results with Gemini AI analysis |
| `POST` | `/api/feedback` | Submit customer feedback with AI categorization |
| `GET` | `/api/dashboard/orders` | Fetch user's order history |
| `POST` | `/api/user/redeem-points` | Redeem loyalty points for coupons |

### Admin APIs (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin JWT authentication |
| `GET` | `/api/admin/stats` | Dashboard KPIs (revenue, orders, users) |
| `GET` | `/api/admin/analytics` | Product performance metrics with event data |
| `GET` | `/api/admin/customers` | CRM user segmentation by hair profile |
| `GET` | `/api/admin/crm-intelligence` | AI feedback analytics aggregation |
| `POST` | `/api/admin/crm/gift-coupon` | Award coupons to specific users |
| `POST` | `/api/admin/inventory/bulk-update` | Batch stock level updates |
| `PATCH` | `/api/admin/orders/[id]` | Update order status (SHIPPED, DELIVERED) |
| `PUT` | `/api/admin/products/[id]` | Update product details and inventory |

---

## AI Integration Details

### Quiz Analysis (Gemini 2.5 Flash)

| Output Field | Type | Description |
|--------------|------|-------------|
| `porosityScore` | Integer (1-100) | AI-calculated porosity metric based on quiz responses |
| `scalpHealth` | Integer (1-100) | AI-calculated scalp health assessment |
| `primaryConcern` | String | Main hair concern identified (e.g., "Frizz Control", "Hair Loss") |
| `hairAnalysis` | String | Clinical summary of hair condition |
| `targetTags` | String[] | Recommended product tags for matching algorithm |

The `/api/ai/diagnose` endpoint sends structured quiz responses to Gemini with a prompt requesting these fields. Response is parsed and stored in the `User` model for downstream recommendation logic.

### Feedback Processing (Gemini 2.5 Flash)

| Output Field | Type | Description |
|--------------|------|-------------|
| `aiCategory` | Enum | Business sector classification (PAYMENT/PRODUCT/WEBSITE/DELIVERY) |
| `sentiment` | Enum | Sentiment analysis (POSITIVE/NEUTRAL/NEGATIVE) |
| `urgencyScore` | Integer (1-10) | Priority score for admin triage (10 = critical) |
| `aiSummary` | String | Single-sentence executive summary |

The `/api/feedback` endpoint processes raw customer comments through Gemini to extract these fields. This structured data powers the admin CRM Intelligence dashboard for operational insights.

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Environment Variables
Ensure all `.env` variables are configured in Vercel project settings. Database connection pooling is handled automatically by Neon's serverless driver.

### Build Configuration
The `package.json` includes a `postinstall` script that runs `prisma generate` automatically during deployment.

---

## Folder Structure

```
follicia/
├── app/                                    # Next.js 14 App Router
│   ├── page.tsx                            # Landing page
│   ├── layout.tsx                          # Root layout with providers
│   ├── globals.css                         # Tailwind CSS + custom styles
│   ├── favicon.ico                         # Site favicon
│   ├── robots.ts                           # SEO robots configuration
│   ├── sitemap.ts                          # Dynamic sitemap generation
│   │
│   ├── shop/                               # Product catalog
│   │   ├── page.tsx                        # Product listing (server component)
│   │   ├── ShopClient.tsx                  # Client-side filtering/sorting
│   │   └── [id]/                           # Dynamic product detail routes
│   │       ├── page.tsx                    # Product detail page
│   │       └── ProductDetailClient.tsx     # Add-to-cart interactions
│   │
│   ├── quiz/                               # Hair DNA diagnostic flow
│   │   ├── layout.tsx                      # Quiz-specific layout
│   │   ├── page.tsx                        # Multi-step quiz form
│   │   └── results/
│   │       └── page.tsx                    # AI-generated results display
│   │
│   ├── cart/                               # Shopping cart
│   │   ├── layout.tsx                      # Cart layout
│   │   └── page.tsx                        # Cart items + checkout CTA
│   │
│   ├── checkout/                           # Payment flow
│   │   └── page.tsx                        # Razorpay integration + order creation
│   │
│   ├── dashboard/                          # User portal (auth-protected)
│   │   ├── layout.tsx                      # Dashboard sidebar navigation
│   │   ├── page.tsx                        # Overview + quick stats
│   │   ├── orders/
│   │   │   └── page.tsx                    # Order history with status tracking
│   │   ├── dna/
│   │   │   └── page.tsx                    # Hair profile visualization
│   │   ├── results/
│   │   │   └── page.tsx                    # Quiz results archive
│   │   ├── rewards/
│   │   │   └── page.tsx                    # Loyalty points + coupon redemption
│   │   ├── membership/
│   │   │   └── page.tsx                    # Plan upgrade interface
│   │   ├── feedback/
│   │   │   └── page.tsx                    # Submit product feedback
│   │   └── settings/
│   │       └── page.tsx                    # Profile settings
│   │
│   ├── admin/                              # ERP dashboard (admin-only)
│   │   ├── layout.tsx                      # Admin sidebar + auth guard
│   │   ├── page.tsx                        # Admin home with KPI cards
│   │   ├── auth/
│   │   │   └── page.tsx                    # Admin login form
│   │   ├── analytics/
│   │   │   └── page.tsx                    # Product performance metrics
│   │   ├── revenue/
│   │   │   └── page.tsx                    # Revenue charts (Recharts)
│   │   ├── orders/
│   │   │   ├── page.tsx                    # Order management table
│   │   │   └── [id]/
│   │   │       └── page.tsx                # Order detail + status updates
│   │   ├── products/
│   │   │   ├── page.tsx                    # Product CRUD table
│   │   │   ├── add/
│   │   │   │   └── page.tsx                # Add new product form
│   │   │   └── new/
│   │   │       └── page.tsx                # Alternative product creation
│   │   ├── inventory/
│   │   │   └── page.tsx                    # Stock management + bulk updates
│   │   ├── customers/
│   │   │   └── page.tsx                    # CRM user segmentation
│   │   ├── crm-intelligence/
│   │   │   └── page.tsx                    # AI feedback analytics dashboard
│   │   ├── feedback/
│   │   │   └── page.tsx                    # Feedback review interface
│   │   └── marketing/
│   │       └── page.tsx                    # Campaign management
│   │
│   └── api/                                # API routes (Next.js Route Handlers)
│       ├── health/
│       │   └── route.ts                    # Health check endpoint
│       ├── seed/
│       │   └── route.ts                    # Database seeding trigger
│       │
│       ├── products/
│       │   └── recommendations/
│       │       └── route.ts                # AI-matched product suggestions
│       │
│       ├── cart/
│       │   ├── route.ts                    # Cart CRUD operations
│       │   ├── sync/
│       │   │   └── route.ts                # Sync cart with database
│       │   └── validate/
│       │       └── route.ts                # Stock availability check
│       │
│       ├── orders/
│       │   └── route.ts                    # Order creation + retrieval
│       │
│       ├── razorpay/
│       │   ├── order/
│       │   │   └── route.ts                # Create Razorpay order
│       │   ├── verify/
│       │   │   └── route.ts                # Verify payment signature
│       │   └── invoice/
│       │       └── route.ts                # Generate invoice PDF
│       │
│       ├── ai/
│       │   └── diagnose/
│       │       └── route.ts                # Gemini quiz analysis
│       │
│       ├── feedback/
│       │   ├── route.ts                    # Submit + AI processing
│       │   └── [id]/
│       │       └── route.ts                # Update feedback status
│       │
│       ├── user/
│       │   ├── hair-profile/
│       │   │   └── route.ts                # Update user hair data
│       │   ├── my-coupons/
│       │   │   └── route.ts                # Fetch user's redeemed coupons
│       │   ├── redeem-points/
│       │   │   └── route.ts                # Redeem loyalty points
│       │   └── update-plan/
│       │       └── route.ts                # Upgrade membership tier
│       │
│       ├── dashboard/
│       │   ├── orders/
│       │   │   └── route.ts                # User's order history
│       │   └── user/
│       │       └── route.ts                # User profile data
│       │
│       ├── stats/
│       │   └── track/
│       │       └── route.ts                # Product event tracking
│       │
│       ├── auth/
│       │   └── sync-user/
│       │       └── route.ts                # Firebase user sync
│       │
│       └── admin/                          # Protected admin APIs
│           ├── login/
│           │   └── route.ts                # Admin JWT authentication
│           ├── logout/
│           │   └── route.ts                # Admin session termination
│           ├── stats/
│           │   └── route.ts                # Dashboard KPIs
│           ├── analytics/
│           │   └── route.ts                # Product analytics data
│           ├── customers/
│           │   └── route.ts                # CRM customer list
│           ├── crm-intelligence/
│           │   └── route.ts                # AI feedback aggregation
│           ├── orders/
│           │   ├── route.ts                # Admin order management
│           │   └── [id]/
│           │       └── route.ts            # Update order status
│           ├── products/
│           │   ├── route.ts                # Product CRUD
│           │   └── [id]/
│           │       └── route.ts            # Update/delete product
│           ├── inventory/
│           │   ├── bulk-update/
│           │   │   └── route.ts            # Batch stock updates
│           │   └── reset/
│           │       └── route.ts            # Reset inventory to defaults
│           └── crm/
│               └── gift-coupon/
│                   └── route.ts            # Award coupons to users
│
├── components/                             # Reusable UI components
│   ├── ui/                                 # Base UI primitives (Radix UI wrappers)
│   ├── layout/                             # Layout components (Header, Footer)
│   ├── product/                            # Product cards, filters
│   ├── cart/                               # Cart item components
│   └── admin/                              # Admin-specific components
│
├── lib/                                    # Utility functions & configurations
│   ├── prisma.ts                           # Prisma client singleton
│   ├── firebase.ts                         # Firebase initialization
│   ├── razorpay.ts                         # Razorpay SDK setup
│   ├── gemini.ts                           # Gemini AI client
│   ├── auth.ts                             # Authentication helpers
│   └── utils.ts                            # General utilities
│
├── prisma/                                 # Database layer
│   ├── schema.prisma                       # Database schema definition
│   ├── migrations/                         # SQL migration history
│   ├── seed.ts                             # Product seeding script
│   ├── seed-reward-coupons.ts              # Coupon seeding script
│   └── init-loyalty-points.ts              # Loyalty system initialization
│
├── scripts/                                # Maintenance scripts
│   ├── backup-products.ts                  # Export product data
│   ├── restore-products.ts                 # Import product data
│   └── normalize-prices.ts                 # Price formatting utility
│
├── public/                                 # Static assets
│   ├── banner.png                          # README banner image
│   ├── logo.svg                            # Brand logo
│   └── products/                           # Product images
│
├── backups/                                # Data backups (gitignored)
│
├── .env                                    # Environment variables (gitignored)
├── .env.example                            # Environment template
├── .gitignore                              # Git ignore rules
├── next.config.js                          # Next.js configuration
├── tailwind.config.ts                      # Tailwind CSS configuration
├── tsconfig.json                           # TypeScript configuration
├── package.json                            # Dependencies & scripts
└── README.md                               # Project documentation
```

---

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Production build with Prisma client generation |
| `npm run start` | Start production server |
| `npm run seed` | Seed products database with initial catalog |
| `npm run seed:coupons` | Seed reward coupons for loyalty program |

---

## Contributing

We welcome contributions to Follicia! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'feat: add your feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Follow the existing code style and conventions
- Backend logic should remain in dedicated service/utility functions — API route handlers should only handle HTTP concerns (request validation, response formatting)
- Frontend state mutations should go through Zustand stores or React Hook Form, not local component state
- Use TypeScript strict mode — avoid `any` types
- Write descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Ensure all Prisma schema changes include migrations
- Test payment flows in Razorpay test mode before submitting

---

## License

This project is private and proprietary.
