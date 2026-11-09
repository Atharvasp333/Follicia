# Graph Report - Follicia  (2026-11-09)

## Corpus Check
- 153 files · ~98,793 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 692 nodes · 1289 edges · 51 communities (35 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.83)
- Token cost: 1,250 input · 850 output

## Community Hubs (Navigation)
- Shopping Cart & Checkout UI
- Prisma ORM & Neon Database
- App Layout & Global Typography
- Revenue & Financial Metrics Dashboard
- Admin Orders & CRM Route Handlers
- Project Build & Dev Dependencies
- Admin Analytics & Feedback Views
- Product Creation & Bio-Matching Form
- Product Imagery & Brand Media Assets
- Interactive Quiz Modal & Buttons
- Shadcn UI Component Config
- Inventory Bulk Updates & Stats API
- Admin Auth & JWT Session Handlers
- TypeScript Compiler Options
- CRM Intelligence & Churn Analysis
- Core Production Dependencies
- Inventory Management & Settings Pages
- Navigation & Modal Authentication
- User Dashboard Navigation & Rewards
- Admin Dashboard Shell & Sidebar
- NPM Package Run Scripts
- Admin Product Management & Auth
- Framer Motion Animation Utilities
- CRM Intelligence Types & Analytics
- Shared Domain Data Models
- Gemini AI Feedback Processing
- Admin Order Inspection & Modals
- Membership Tiers & Pricing Plans
- Hair DNA Diagnostic Quiz Wizard
- Order Detail Inspection View
- New Product Editor Form Sections
- Diagnostic History & Results View
- ESLint Linting Configuration
- Customer Segmentation & Tiering
- Gemini AI Diagnostic Routing
- Loyalty Points Redemption API
- Zustand Inventory State Store
- Database Seeding & Catalog Data
- Product Analytics Routing
- Customer Segmentation Route Handler
- Product Event Telemetry API
- PostCSS Style Pipeline
- Secure Payment & Loyalty Systems
- Pull Request Guidelines
- Firebase Auth Integration

## God Nodes (most connected - your core abstractions)
1. `next` - 69 edges
2. `react` - 49 edges
3. `lucide-react` - 45 edges
4. `prisma` - 38 edges
5. `framer-motion` - 36 edges
6. `useAuthModal()` - 33 edges
7. `useCart()` - 21 edges
8. `Navbar()` - 18 edges
9. `compilerOptions` - 16 edges
10. `axios` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Coily Asset` --references--> `Hair DNA Diagnostic Engine`  [INFERRED]
  public/quiz/coily.png → README.md
- `Curly Asset` --references--> `Hair DNA Diagnostic Engine`  [INFERRED]
  public/quiz/curly.png → README.md
- `Porosity High Asset` --references--> `Hair DNA Diagnostic Engine`  [INFERRED]
  public/quiz/porosity_high.png → README.md
- `Porosity Low Asset` --references--> `Hair DNA Diagnostic Engine`  [INFERRED]
  public/quiz/porosity_low.png → README.md
- `Straight Asset` --references--> `Hair DNA Diagnostic Engine`  [INFERRED]
  public/quiz/straight.png → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Follicia Core D2C AI Architecture** — readme_hair_dna_quiz, readme_bio_matching_engine, readme_ai_feedback_intelligence, readme_erp_admin_dashboard [EXTRACTED 0.95]

## Communities (51 total, 16 thin omitted)

### Community 0 - "Shopping Cart & Checkout UI"
Cohesion: 0.05
Nodes (67): CartItemRow(), CartPage(), E, B, CheckoutFormData, CheckoutPage(), E, OrderSummary() (+59 more)

### Community 1 - "Prisma ORM & Neon Database"
Cohesion: 0.07
Nodes (28): @prisma/adapter-neon@^7.5.0, @prisma/client@^7.4.2, dotenv@^17.3.1, adapter, prisma, adapter, feedbackTemplates, generateAISummary() (+20 more)

### Community 2 - "App Layout & Global Typography"
Cohesion: 0.08
Nodes (30): inter, metadata, montserrat, playfair, RootLayout(), ComparisonChart(), comparisonData, E (+22 more)

### Community 3 - "Revenue & Financial Metrics Dashboard"
Cohesion: 0.08
Nodes (25): B, calculateMetrics(), COST_BREAKDOWN, CostCard(), fixedCosts, INFLUENCER_CODES, isAffiliateOrder(), Metrics (+17 more)

### Community 5 - "Project Build & Dev Dependencies"
Cohesion: 0.11
Nodes (26): devDependencies, babel-plugin-react-compiler@1.0.0, prisma@^7.4.2, shadcn@^3.8.5, tailwindcss@^4, @tailwindcss/postcss@^4, tsx@^4.21.0, tw-animate-css@^1.4.0 (+18 more)

### Community 6 - "Admin Analytics & Feedback Views"
Cohesion: 0.08
Nodes (19): AnalyticsData, B, AdminFeedbackPage(), B, Feedback, FeedbackCard(), StatCard(), B (+11 more)

### Community 7 - "Product Creation & Bio-Matching Form"
Cohesion: 0.09
Nodes (21): B, HAIR_TYPES, POROSITY_LEVELS, ProductFormData, SCALP_CONDITIONS, AnimatedBar(), BENCHMARKS, HAIR_TYPE_INFO (+13 more)

### Community 8 - "Product Imagery & Brand Media Assets"
Cohesion: 0.08
Nodes (26): Antioxidant Defence Oil Asset, Awakening Wash Asset, Biotin Growth Complex Asset, Clarifying Scalp Scrub Asset, Hydrating Enzyme Mask Asset, Moisture Lock Conditioner Asset, Protein Repair Bond Serum Asset, Scalp Serum Concentrate Asset (+18 more)

### Community 9 - "Interactive Quiz Modal & Buttons"
Cohesion: 0.21
Nodes (16): QuizPopup(), QuizPopupProps, Button(), buttonVariants, Dialog(), DialogContent(), DialogDescription(), DialogFooter() (+8 more)

### Community 10 - "Shadcn UI Component Config"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 11 - "Inventory Bulk Updates & Stats API"
Cohesion: 0.11
Nodes (4): metadata, metadata, nextConfig, next

### Community 12 - "Admin Auth & JWT Session Handlers"
Cohesion: 0.18
Nodes (15): POST(), POST(), clearAdminCookie(), createAdminToken(), getAdminSession(), getJwtSecret(), isAdminAuthenticated(), setAdminCookie() (+7 more)

### Community 13 - "TypeScript Compiler Options"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 14 - "CRM Intelligence & Churn Analysis"
Cohesion: 0.19
Nodes (17): ActionsLog(), ActiveFilter, B, CampaignModal(), ChurnRetentionChart(), CLVPanel(), CRMData, CRMIntelligencePage() (+9 more)

### Community 15 - "Core Production Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, class-variance-authority@^0.7.1, @clerk/nextjs@^6.39.0, clsx@^2.1.1, firebase@^12.10.0, framer-motion@^12.34.5, lucide-react@^0.576.0, next@16.1.6 (+10 more)

### Community 16 - "Inventory Management & Settings Pages"
Cohesion: 0.14
Nodes (9): InventoryManagementPage(), B, FeedbackPage(), B, Feedback, Props, SpinnerProps, framer-motion (+1 more)

### Community 17 - "Navigation & Modal Authentication"
Cohesion: 0.22
Nodes (12): AuthModal(), E, NavbarProps, SIDEBAR_LINKS, AuthModalContext, AuthModalContextType, AuthModalProvider(), DbUser (+4 more)

### Community 18 - "User Dashboard Navigation & Rewards"
Cohesion: 0.23
Nodes (10): DashboardLayout(), DashboardSidebar(), DashboardTopBar(), NAV_ITEMS, RewardCoupon, RewardsData, RewardsPage(), Transaction (+2 more)

### Community 19 - "Admin Dashboard Shell & Sidebar"
Cohesion: 0.29
Nodes (9): AdminLayout(), GrainTexture(), AdminProfileCard(), AdminSidebar(), B, BreathingLogo(), MagneticIcon(), navGroups (+1 more)

### Community 20 - "NPM Package Run Scripts"
Cohesion: 0.17
Nodes (12): scripts, backup:prices, build, dev, init:loyalty, lint, normalize:prices, postinstall (+4 more)

### Community 21 - "Admin Product Management & Auth"
Cohesion: 0.18
Nodes (3): B, Product, react

### Community 22 - "Framer Motion Animation Utilities"
Cohesion: 0.20
Nodes (8): fadeInLeft, fadeInRight, fadeInUp, hapticTap, magneticHover, pulseAnimation, scaleIn, staggerContainer

### Community 23 - "CRM Intelligence Types & Analytics"
Cohesion: 0.20
Nodes (9): ChurnStats, ChurnStatus, CRMIntelligenceData, HairDNASegmentation, RecommendedAction, SegmentCategory, SegmentData, StatusConfig (+1 more)

### Community 24 - "Shared Domain Data Models"
Cohesion: 0.20
Nodes (9): ApiResponse, CartItem, HairAnalysisInput, HairAnalysisResult, Order, OrderItem, OrderStatus, Product (+1 more)

### Community 25 - "Gemini AI Feedback Processing"
Cohesion: 0.33
Nodes (5): POST(), submitFeedback(), analyzeFeedback(), FeedbackAnalysis, genAI

### Community 26 - "Admin Order Inspection & Modals"
Cohesion: 0.38
Nodes (6): B, Order, OrderDetailsModal(), OrdersPage(), ProfileRow(), statusColors

### Community 27 - "Membership Tiers & Pricing Plans"
Cohesion: 0.29
Nodes (6): B, E, fadeUp, MembershipPage(), PricingTier, tiers

### Community 28 - "Hair DNA Diagnostic Quiz Wizard"
Cohesion: 0.29
Nodes (6): CHEMICAL_OPTIONS, POROSITY_OPTIONS, QuizData, QuizPage(), STEPS, TEXTURE_OPTIONS

### Community 29 - "Order Detail Inspection View"
Cohesion: 0.40
Nodes (5): B, InfoRow(), OrderDetails, OrderDetailsPage(), statusColors

### Community 30 - "New Product Editor Form Sections"
Cohesion: 0.53
Nodes (5): B, FormField(), FormTextArea(), NewProductPage(), ProductFormSection()

### Community 31 - "Diagnostic History & Results View"
Cohesion: 0.47
Nodes (5): DiagEntry, DiagnosticHistoryPage(), GridPaperCard(), SAMPLE_ENTRIES, SkeletonCard()

### Community 32 - "ESLint Linting Configuration"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.1.6, eslint, eslint-config-next

### Community 33 - "Customer Segmentation & Tiering"
Cohesion: 0.40
Nodes (3): B, Tier, User

### Community 34 - "Gemini AI Diagnostic Routing"
Cohesion: 0.40
Nodes (3): genAI, @google/generative-ai@^0.24.1, @google/generative-ai

### Community 36 - "Zustand Inventory State Store"
Cohesion: 0.40
Nodes (4): zustand@^5.0.12, zustand, InventoryStore, Product

## Knowledge Gaps
- **26 isolated node(s):** `AI Feedback Intelligence`, `Razorpay Atomic Checkout & Security`, `Firebase Auth & User Synchronization`, `Loyalty Points & Rewards System`, `Pull Request Review Template` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 335 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Inventory Bulk Updates & Stats API` to `Shopping Cart & Checkout UI`, `App Layout & Global Typography`, `Revenue & Financial Metrics Dashboard`, `Admin Orders & CRM Route Handlers`, `Project Build & Dev Dependencies`, `Admin Analytics & Feedback Views`, `Product Creation & Bio-Matching Form`, `Interactive Quiz Modal & Buttons`, `Admin Auth & JWT Session Handlers`, `Core Production Dependencies`, `Navigation & Modal Authentication`, `User Dashboard Navigation & Rewards`, `Admin Dashboard Shell & Sidebar`, `Admin Product Management & Auth`, `Gemini AI Feedback Processing`, `Hair DNA Diagnostic Quiz Wizard`, `Order Detail Inspection View`, `New Product Editor Form Sections`, `Gemini AI Diagnostic Routing`, `Loyalty Points Redemption API`, `Database Seeding & Catalog Data`, `Product Analytics Routing`, `CRM Coupon Gifting API`, `Customer Segmentation Route Handler`, `Product Modification & Deletion API`, `Product Catalog Query Route`, `Persistent Cart CRUD API`, `Razorpay Signature Verification`, `Product Event Telemetry API`, `Customer Order Submission API`?**
  _High betweenness centrality (0.262) - this node is a cross-community bridge._
- **What connects `AI Feedback Intelligence`, `Razorpay Atomic Checkout & Security`, `Firebase Auth & User Synchronization` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Shopping Cart & Checkout UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05209274314965372 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Admin Product Management & Auth` to `Shopping Cart & Checkout UI`, `App Layout & Global Typography`, `Revenue & Financial Metrics Dashboard`, `Project Build & Dev Dependencies`, `Admin Analytics & Feedback Views`, `Product Creation & Bio-Matching Form`, `Interactive Quiz Modal & Buttons`, `CRM Intelligence & Churn Analysis`, `Core Production Dependencies`, `Inventory Management & Settings Pages`, `Navigation & Modal Authentication`, `User Dashboard Navigation & Rewards`, `Admin Dashboard Shell & Sidebar`, `Admin Order Inspection & Modals`, `Membership Tiers & Pricing Plans`, `Hair DNA Diagnostic Quiz Wizard`, `Order Detail Inspection View`, `New Product Editor Form Sections`, `Diagnostic History & Results View`, `Customer Segmentation & Tiering`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Should `Prisma ORM & Neon Database` be split into smaller, more focused modules?**
  _Cohesion score 0.07084785133565621 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Inventory Management & Settings Pages` to `Shopping Cart & Checkout UI`, `App Layout & Global Typography`, `Revenue & Financial Metrics Dashboard`, `Project Build & Dev Dependencies`, `Admin Analytics & Feedback Views`, `Product Creation & Bio-Matching Form`, `Interactive Quiz Modal & Buttons`, `CRM Intelligence & Churn Analysis`, `Core Production Dependencies`, `Navigation & Modal Authentication`, `User Dashboard Navigation & Rewards`, `Admin Dashboard Shell & Sidebar`, `Admin Product Management & Auth`, `Admin Order Inspection & Modals`, `Membership Tiers & Pricing Plans`, `Hair DNA Diagnostic Quiz Wizard`, `Order Detail Inspection View`, `New Product Editor Form Sections`, `Diagnostic History & Results View`, `Customer Segmentation & Tiering`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Should `App Layout & Global Typography` be split into smaller, more focused modules?**
  _Cohesion score 0.07681365576102418 - nodes in this community are weakly interconnected._