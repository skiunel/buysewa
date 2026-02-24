# CLAUDE.md - BUYSEWA E-commerce Platform

## Project Overview

BUYSEWA is a Nepali e-commerce platform built with a React/TypeScript frontend, an Express.js/MongoDB backend, and an Ethereum blockchain-based review verification system. The platform integrates eSewa (Nepal's leading digital payment service) and uses Secure Digital Codes (SDCs) to ensure only verified purchasers can submit product reviews.

---

## Repository Structure

```
buysewa/
├── src/                        # Frontend (React 18 + TypeScript + Vite)
│   ├── App.tsx                 # Root component - contains all page routing logic
│   ├── main.tsx                # Application entry point
│   ├── index.css               # Global CSS (Tailwind directives)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitive components (DO NOT edit these)
│   │   ├── common/             # Shared utility components
│   │   ├── Header.tsx          # Top navigation bar
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Homepage.tsx        # Landing page
│   │   ├── ProductListing.tsx  # Product grid/list with filters
│   │   ├── ProductPage.tsx     # Individual product detail page
│   │   ├── CheckoutPage.tsx    # Cart and checkout flow
│   │   ├── ReviewSubmission.tsx# SDC-gated review form
│   │   ├── LoginPage.tsx       # Auth (login/register)
│   │   ├── BuyerDashboard.tsx  # Orders, reviews for buyers
│   │   ├── SellerDashboard.tsx # Product management for sellers
│   │   ├── AdminDashboard.tsx  # Platform admin panel
│   │   ├── EsewaPaymentForm.tsx# eSewa payment integration UI
│   │   ├── QuickBuyEsewa.tsx   # Quick purchase from product page
│   │   ├── PaymentGateway.tsx  # Payment method selection
│   │   ├── BlockchainReview.tsx# Blockchain review verification UI
│   │   ├── WalletConnect.tsx   # Ethereum wallet connection
│   │   ├── CustomerSupport.tsx # AI chatbot widget (always visible)
│   │   ├── Dashboard.tsx       # Generic dashboard wrapper
│   │   └── NepaliPatterns.tsx  # Decorative patterns for Nepali aesthetic
│   ├── contexts/
│   │   ├── AuthContext.tsx     # JWT auth state (user, token, login/logout)
│   │   ├── CartContext.tsx     # In-memory shopping cart state
│   │   └── OrderContext.tsx    # Order state management
│   ├── pages/
│   │   ├── DemoPaymentPage.tsx # Demo payment testing page
│   │   ├── PaymentSuccess.tsx  # eSewa success callback landing page
│   │   └── PaymentFailure.tsx  # eSewa failure callback landing page
│   ├── services/
│   │   └── api.ts              # All API calls to backend (fetch-based)
│   ├── utils/
│   │   ├── esewaPayment.ts     # eSewa signature generation + form submit helpers
│   │   ├── createSignature.ts  # HMAC SHA-256 signature utility
│   │   └── passwordValidator.ts# Password strength validation
│   ├── data/
│   │   └── products.ts         # Static product seed data (used as fallback)
│   ├── services/
│   │   ├── blockchain.ts       # Frontend blockchain interaction (mock/demo)
│   │   └── blockchainReal.ts   # Frontend ethers.js real blockchain calls
│   └── styles/
│       └── globals.css         # Additional global styles
│
├── review-backend/             # Backend (Node.js + Express + MongoDB)
│   ├── server.js               # Express app entry point (port 5000)
│   ├── config/
│   │   └── database.js         # MongoDB connection config
│   ├── middleware/
│   │   ├── auth.js             # JWT authenticate + authorize middleware
│   │   └── security.js         # Rate limiting, input sanitization
│   ├── models/
│   │   ├── User.js             # User schema (buyer/seller/admin roles)
│   │   ├── Product.js          # Product schema
│   │   ├── Order.js            # Order schema with payment tracking
│   │   ├── Review.js           # Review schema with blockchain fields
│   │   └── Sdc.js              # SDC (Secure Digital Code) schema
│   ├── routes/
│   │   ├── authRoutes.js       # POST /api/auth/login, register, etc.
│   │   ├── productRoutes.js    # CRUD /api/products
│   │   ├── orderRoutes.js      # CRUD /api/orders
│   │   ├── reviewRoutes.js     # POST /api/reviews (SDC-gated)
│   │   ├── sdcRoutes.js        # POST /api/sdc/verify, GET /api/sdc/user/:id
│   │   ├── esewaRoutes.js      # eSewa payment initiation + verification callbacks
│   │   ├── paymentRoutes.js    # General payment routes
│   │   ├── demoPaymentRoutes.js# Demo/testing payment flow
│   │   └── blockchainPaymentRoutes.js # Blockchain registration/verification
│   ├── utils/
│   │   ├── blockchainService.js# ethers.js service class for smart contract calls
│   │   ├── sdcService.js       # SDC generation and management logic
│   │   ├── signature.js        # eSewa HMAC signature create/verify
│   │   └── passwordValidator.js# Password strength validation (mirrors frontend)
│   └── scripts/
│       ├── initializeDatabase.js # DB setup script
│       └── seedProducts.js     # Seed products into MongoDB
│
├── contracts/
│   └── ReviewAuth.sol          # Solidity smart contract (Solidity 0.8.19)
│
├── scripts/
│   ├── deploy.js               # Hardhat deployment script
│   └── deployBlockchainContract.js # Alternative deployment script
│
├── docs/                       # Project documentation (extensive)
├── hardhat.config.js           # Hardhat config (chainId 1337, localhost:8545)
├── vite.config.ts              # Vite config (dev port 3000, build -> ./build)
├── package.json                # Frontend dependencies
├── .env.example                # Frontend env template
└── .gitignore
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | (via Vite) | Type safety |
| Vite | 6.3.5 | Build tool (dev server on port 3000) |
| @vitejs/plugin-react-swc | 3.10.2 | Fast SWC-based React transform |
| Tailwind CSS | (via index.css) | Utility-first styling |
| Radix UI | Various | Accessible UI primitives |
| shadcn/ui | (custom setup) | Component library pattern |
| react-router-dom | 7.11.0 | Installed but NOT used for main routing |
| react-hook-form | 7.55.0 | Form state management |
| ethers | 6.16.0 | Ethereum/blockchain interaction |
| recharts | 2.15.2 | Charts/analytics in dashboards |
| lucide-react | 0.487.0 | Icon library |
| sonner | 2.0.3 | Toast notifications |
| next-themes | 0.4.6 | Theme (dark/light mode) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 4.18.2 | HTTP server framework |
| MongoDB + Mongoose | 7.5.0 | Database and ODM |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcryptjs | 2.4.3 | Password hashing |
| ethers | 6.7.1 | Blockchain interaction |
| nodemon | 3.0.1 | Dev auto-reload |

### Blockchain
| Technology | Purpose |
|---|---|
| Hardhat | Smart contract development and testing |
| Solidity 0.8.19 | Smart contract language |
| ethers.js v6 | Contract interaction |
| Local Hardhat Network | chainId 1337, 10 accounts with 10000 ETH each |

---

## Development Workflow

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (or MongoDB Atlas URI)
- (Optional) MetaMask browser extension for blockchain features

### Starting the Frontend

```bash
# From repo root
npm install
npm run dev
# Runs on http://localhost:3000
```

### Starting the Backend

```bash
cd review-backend
npm install
npm run dev
# Runs on http://localhost:5000
# Requires MongoDB running
```

### Starting the Blockchain (optional)

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node
# Provides 10 test accounts at http://127.0.0.1:8545

# Terminal 2: Deploy the smart contract
npx hardhat run scripts/deploy.js --network localhost
# Copy the deployed contract address into review-backend/.env
```

### Database Setup

```bash
cd review-backend

# Initialize database (creates indexes, collections)
npm run init:db

# Seed sample products
npm run seed
```

### Build for Production

```bash
# From repo root
npm run build
# Output goes to ./build/
```

---

## Environment Variables

### Frontend (`/.env`, copy from `.env.example`)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`/review-backend/.env`, copy from `.env.example`)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/buysewa

# CRITICAL: Change this in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Blockchain (optional - app works without these)
REVIEW_AUTH_CONTRACT_ADDRESS=   # Set after deploying smart contract
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=         # Backend wallet for contract writes

# eSewa payment
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q  # Sandbox test key (change for production)
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_ENVIRONMENT=sandbox          # 'sandbox' or 'production'

# URLs for eSewa callbacks
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

---

## Key Architecture Decisions

### Frontend Routing
The app uses **state-based routing** in `App.tsx`, not URL-based routing. Despite `react-router-dom` being installed, main page navigation is handled via `currentPage` state and a `renderPage()` switch statement. The `onNavigate(page, productId?, category?)` prop is passed down to components.

Pages: `home`, `products`, `product`, `checkout`, `review`, `dashboard`, `login`

Route protection is done inline in `renderPage()` - if a user is not logged in and tries to access a protected page, they are redirected to the login page by calling `setCurrentPage("login")`.

### User Roles
Three roles exist: `buyer`, `seller`, `admin`. The dashboard renders a different component based on `user.role`:
- `buyer` → `BuyerDashboard`
- `seller` → `SellerDashboard`
- `admin` → `AdminDashboard`

### Authentication Flow
1. `AuthContext` manages user state and JWT token
2. Token is stored in `localStorage` as both `authToken` and `token` (both keys used - prefer `token`)
3. `src/services/api.ts` reads `authToken` from localStorage and injects it as `Authorization: Bearer <token>` header
4. Backend validates JWT via `middleware/auth.js` and attaches `req.user` to the request

### API Service Layer (`src/services/api.ts`)
**Important**: This file is partially migrated. Some APIs are real (hitting the backend), others are still mock implementations using local state/localStorage:
- **Real API calls**: `authAPI`, `productAPI`, `orderAPI`, `reviewAPI`, `sdcAPI`
- **Still mocked**: `cartAPI`, `paymentAPI` (basic), `adminAPI`, `analyticsAPI`, `uploadAPI`

When implementing new features, use `apiCall()` helper which handles auth headers automatically.

### Cart State
The cart (`CartContext`) is **in-memory only** - it resets on page refresh. Cart items come from `src/data/products.ts` product type. There is no backend cart persistence currently.

### SDC (Secure Digital Code) System
This is the core review authenticity mechanism:
1. User completes a purchase → backend generates a unique 32-byte SDC
2. SDC hash is registered on the `ReviewAuth` smart contract via `blockchainService.js`
3. When submitting a review, user provides their SDC code
4. Backend verifies SDC via contract, marks it as used, then stores review in MongoDB and on blockchain

### Blockchain Integration
The `ReviewAuth.sol` contract is deployed to the local Hardhat network (chainId 1337). The backend interacts with it via `review-backend/utils/blockchainService.js` (a `BlockchainPaymentService` class). The blockchain integration is **optional** - the app degrades gracefully when not configured.

### eSewa Payment Flow
1. Frontend calls `POST /api/esewa/initiate` with amount and orderId
2. Backend generates HMAC SHA-256 signature using `ESEWA_SECRET_KEY`
3. Backend returns form data including signature
4. Frontend submits a hidden HTML form POST to eSewa's payment URL
5. eSewa redirects back to `GET /api/esewa/verify` with base64-encoded payment data
6. Backend verifies signature and redirects to frontend `/payment/success` or `/payment/failure`

**Sandbox test key**: `8gBm/:&EnhH.1/q` (hardcoded in some places, should always come from env)

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | None | Server health check |
| POST | `/api/auth/login` | None | Login, returns JWT |
| POST | `/api/auth/register` | None | Register new user |
| GET | `/api/auth/me` | Bearer | Get current user |
| GET | `/api/products` | None | List products (with filters) |
| POST | `/api/products` | Bearer (seller/admin) | Create product |
| GET | `/api/products/:id` | None | Get product by ID |
| PUT | `/api/products/:id` | Bearer | Update product |
| DELETE | `/api/products/:id` | Bearer | Delete product |
| POST | `/api/orders` | Bearer | Create order |
| GET | `/api/orders` | Bearer (admin) | List all orders |
| GET | `/api/orders/:id` | Bearer | Get order |
| GET | `/api/orders/user/:userId` | Bearer | Get user's orders |
| PATCH | `/api/orders/:id/status` | Bearer | Update order status |
| POST | `/api/reviews` | Bearer | Submit review (requires SDC) |
| GET | `/api/reviews/product/:id` | None | Get product reviews |
| POST | `/api/sdc/verify` | Bearer | Verify SDC code |
| GET | `/api/sdc/user/:userId` | Bearer | Get user's SDCs |
| POST | `/api/esewa/initiate` | None | Generate eSewa payment form data |
| GET | `/api/esewa/verify` | None | eSewa success callback |
| GET | `/api/esewa/failure` | None | eSewa failure callback |
| POST | `/api/blockchain/register-sdc` | Bearer | Register SDC on blockchain |

---

## Database Models

### User
- `name`, `email` (unique), `password` (bcrypt, select:false), `role` (buyer/seller/admin)
- `walletAddress` - Ethereum wallet for blockchain features
- Login security: `loginAttempts`, `lockUntil` (locked after 5 failed attempts, 2hr lockout)
- `resetPasswordToken`, `resetPasswordExpires` for password reset flow

### Product
- Standard e-commerce fields: name, price, category, description, images, stock, seller reference

### Order
- Links to User and Product(s), contains payment status tracking
- Payment statuses: pending, processing, completed, failed, refunded

### Review
- Links to `User`, `Product`, and `SDC` (required)
- `rating` (1-5), `comment` (max 500 chars), `images` array
- Blockchain fields: `ipfsHash`, `blockchainTxHash`, `blockchainReviewId`, `verified`

### SDC (Secure Digital Code)
- `sdcCode` (unique, the raw 64-char hex code), `hashedSDC` (keccak256 hash)
- Links to `User`, `Order`, `Product`
- `isUsed`, `isRegisteredOnBlockchain`, `blockchainTxHash`

---

## Conventions and Patterns

### TypeScript (Frontend)
- Use TypeScript for all new frontend files (`.tsx` for components, `.ts` for utilities)
- The `@` alias maps to `./src` (configured in `vite.config.ts`)
- Prefer interfaces over type aliases for object shapes
- User type definition in `App.tsx`: `{ email: string; role: 'buyer' | 'seller' | 'admin'; name: string }`

### React Components
- All components use named exports (not default)
- Components accept `onNavigate: (page: string, id?: number | string, category?: string) => void` prop for navigation
- Use `useCart()`, `useAuth()` hooks from context files
- UI primitives live in `src/components/ui/` - these are shadcn/ui components. Prefer using them over creating new primitives
- Toast notifications via `sonner`: `import { toast } from 'sonner'`

### Backend (Node.js)
- CommonJS modules (`require`/`module.exports`)
- Route files export an Express `Router`
- Standard response format: `{ success: boolean, message: string, data?: any }`
- Error handling middleware at the bottom of `server.js` catches unhandled errors
- All protected routes use `authenticate` middleware from `middleware/auth.js`
- Role-based access uses `authorize('seller', 'admin')` after `authenticate`

### Blockchain
- Solidity functions follow NatSpec documentation style (`@dev`, `@param`, `@return`)
- Hashing uses `keccak256` (Ethereum standard)
- Smart contract deployment artifacts go to `./artifacts/` (gitignored)

### Styling
- Tailwind CSS utility classes only - no separate CSS files for components
- The design has a Nepali cultural aesthetic - use warm colors, traditional patterns where appropriate
- Dark/light mode supported via `next-themes`

---

## Known Issues and Technical Debt

1. **Mixed mock/real API**: `src/services/api.ts` has `cartAPI`, `adminAPI`, `paymentAPI` still using mock localStorage storage. These reference `mockStorage` and `delay()` which are not defined in the current file - the file was partially migrated and these sections will throw runtime errors if called.

2. **Dual auth token storage**: Auth stores token as both `authToken` (used by `api.ts`) and `token` (used by `AuthContext`). Logout in `App.tsx` removes `authToken` while `AuthContext.logout()` removes `token`. Both must be removed on logout.

3. **State-based routing limitations**: The current routing approach in `App.tsx` does not support deep linking or browser back/forward navigation. URLs always stay at `/`.

4. **eSewa secret key exposure**: The eSewa test secret key `8gBm/:&EnhH.1/q` appears in `src/utils/esewaPayment.ts` (frontend). In production, signature generation must only happen server-side.

5. **No test suite**: `npm test` in the backend exits with code 1 ("no test specified"). There are no frontend tests either.

---

## Security Notes

- Never commit `.env` files (they are gitignored)
- `BLOCKCHAIN_PRIVATE_KEY` must never be a main wallet - generate a dedicated one
- `JWT_SECRET` must be changed from the default in any deployed environment
- Passwords are hashed with bcrypt (10 salt rounds)
- Account lockout triggers after 5 failed login attempts (2hr lockout)
- eSewa payment verification uses HMAC-SHA256 signature validation to prevent tampering

---

## Useful Commands

```bash
# Frontend
npm run dev          # Start dev server (port 3000)
npm run build        # Production build -> ./build/

# Backend
cd review-backend
npm run dev          # Start with nodemon (port 5000)
npm start            # Start without auto-reload
npm run init:db      # Initialize database
npm run seed         # Seed product data

# Blockchain
npx hardhat node                                              # Local blockchain node
npx hardhat run scripts/deploy.js --network localhost         # Deploy contract
npx hardhat compile                                           # Compile contracts

# Testing eSewa (after both services running)
bash test_esewa.sh
```
