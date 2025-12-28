# Technical Documentation
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Key Components](#key-components)
5. [Data Flow](#data-flow)
6. [Security Implementation](#security-implementation)
7. [Blockchain Integration](#blockchain-integration)
8. [API Integration](#api-integration)
9. [Database Design](#database-design)
10. [Development Guidelines](#development-guidelines)

---

## System Architecture

### Overview

BUYSEWA is a full-stack e-commerce platform with blockchain-based review verification. The system consists of:

- **Frontend:** React-based SPA (Single Page Application)
- **Backend:** Node.js/Express REST API
- **Database:** MongoDB (NoSQL)
- **Blockchain:** Ethereum-based smart contracts
- **Payment:** eSewa gateway integration

### Architecture Layers

```

   Presentation Layer (React)        

   Application Layer (Express API)    

   Data Layer (MongoDB)              

   Blockchain Layer (Ethereum/IPFS)  

```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.0.0 | Type safety |
| Vite | 5.0.0 | Build tool |
| Tailwind CSS | 3.3.0 | Styling |
| React Router | 6.0.0 | Routing |
| Axios | 1.6.0 | HTTP client |
| Ethers.js | 6.9.0 | Blockchain interaction |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.18.0 | Web framework |
| MongoDB | 6.0+ | Database |
| Mongoose | 8.0.0 | ODM |
| JWT | 9.0.0 | Authentication |
| bcrypt | 5.1.0 | Password hashing |
| crypto | Built-in | HMAC signatures |

### Blockchain

| Technology | Version | Purpose |
|------------|---------|---------|
| Hardhat | 2.19.0 | Development framework |
| Solidity | 0.8.19 | Smart contract language |
| Ethers.js | 6.9.0 | Blockchain interaction |
| IPFS | - | Decentralized storage |

---

## Project Structure

```
buysewa-platform/
 src/                          # Frontend source
    components/               # React components
       ui/                  # UI components
       Homepage.tsx
       ProductListing.tsx
       CheckoutPage.tsx
       ...
    contexts/                # React contexts
       AuthContext.tsx
       CartContext.tsx
       OrderContext.tsx
    services/                # API services
       api.ts
       blockchain.ts
    utils/                   # Utilities
    main.tsx                 # Entry point
 review-backend/              # Backend source
    models/                  # MongoDB models
    routes/                  # API routes
    middleware/              # Express middleware
    utils/                   # Backend utilities
    server.js               # Server entry
 contracts/                   # Smart contracts
    ReviewAuth.sol
 scripts/                     # Deployment scripts
    deploy.js
 docs/                        # Documentation
```

---

## Key Components

### Frontend Components

#### AuthContext
Manages user authentication state and provides authentication methods.

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### CartContext
Manages shopping cart state and operations.

```typescript
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
```

#### ProductListing
Displays products with filtering and search capabilities.

**Features:**
- Category filtering
- Search functionality
- Price range filtering
- Pagination
- Product cards with images

#### CheckoutPage
Handles the checkout process.

**Steps:**
1. Cart review
2. Shipping address input
3. Payment method selection
4. Order creation
5. Payment redirection

### Backend Components

#### Authentication Middleware
Validates JWT tokens for protected routes.

```javascript
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

#### Order Routes
Handles order creation and management.

**Endpoints:**
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

#### SDC Routes
Manages Secure Digital Codes.

**Endpoints:**
- `POST /api/sdc/register` - Register SDC on blockchain
- `GET /api/sdc/verify/:code` - Verify SDC code
- `GET /api/sdc/user/:userId` - Get user's SDC codes

---

## Data Flow

### User Registration Flow

```
User Input → Frontend Validation → API Call → Backend Validation
→ Password Hashing → Database Save → JWT Generation → Response
→ Token Storage → Redirect
```

### Order Creation Flow

```
Cart Items → Checkout Form → Address Validation → Order Creation
→ Order Number Generation → Database Save → Payment Initiation
→ Payment Gateway → Callback → Payment Verification → Order Update
```

### Review Submission Flow

```
SDC Code Input → SDC Verification → Blockchain Check → Review Form
→ IPFS Storage → Blockchain Submission → Transaction Hash → Database Save
→ Review Display
```

---

## Security Implementation

### Password Security

- **Hashing:** bcrypt with salt rounds: 10
- **Minimum Length:** 4 characters (simplified for demo)
- **Storage:** Hashed passwords only, never plain text

### Authentication Security

- **JWT Tokens:** Signed with secret key
- **Expiration:** 24 hours
- **Storage:** localStorage (consider httpOnly cookies for production)
- **Token Validation:** Middleware checks on every protected route

### API Security

- **CORS:** Configured for frontend domain only
- **Input Validation:** All inputs validated and sanitized
- **Rate Limiting:** Implemented on authentication endpoints
- **HMAC Signatures:** Payment callbacks verified

### Data Security

- **SDC Hashing:** SHA-256 before blockchain registration
- **Database:** MongoDB with authentication
- **Environment Variables:** Sensitive data in .env files

---

## Blockchain Integration

### Smart Contract: ReviewAuth

**Functions:**
- `registerSDC()` - Register SDC hash on blockchain
- `verifySDC()` - Verify SDC validity
- `submitReview()` - Submit verified review
- `getReview()` - Retrieve review data

### IPFS Integration

Review content (rating, comment, images) stored on IPFS:
- Content hash generated
- Hash stored on blockchain
- Content retrievable via hash

### Wallet Integration

- MetaMask wallet connection
- Transaction signing
- Gas fee handling

---

## API Integration

### eSewa Payment Gateway

**Flow:**
1. Order created
2. Payment form generated with HMAC signature
3. User redirected to eSewa
4. Payment processed
5. Callback received with signature
6. Signature verified
7. Order status updated

**HMAC Signature:**
```javascript
const message = `total_amount=${amount},transaction_uuid=${orderId},product_code=${productCode}`;
const signature = crypto.createHmac('sha256', secretKey).update(message).digest('base64');
```

---

## Database Design

### Collections

1. **users** - User accounts
2. **products** - Product catalog
3. **orders** - Customer orders
4. **reviews** - Product reviews
5. **sdcs** - Secure Digital Codes

### Indexes

- `users.email` (Unique)
- `products.category`
- `orders.userId`
- `reviews.productId`
- `sdcs.sdcCode` (Unique)

### Relationships

- User → Orders (One-to-Many)
- User → Reviews (One-to-Many)
- Product → Reviews (One-to-Many)
- Order → SDCs (One-to-Many)
- SDC → Review (One-to-One)

---

## Development Guidelines

### Code Style

- **Frontend:** ESLint + Prettier
- **Backend:** ESLint with Node.js rules
- **TypeScript:** Strict mode enabled

### Git Workflow

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote
4. Create pull request
5. Code review
6. Merge to `develop`
7. Deploy to staging
8. Merge to `main` for production

### Testing

- **Unit Tests:** Jest
- **Integration Tests:** Supertest
- **E2E Tests:** Playwright
- **Coverage Target:** 70%+

### Documentation

- Code comments for complex logic
- JSDoc for functions
- README files for each module
- API documentation updated with changes

---

## Performance Optimization

### Frontend

- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

### Backend

- Database indexing
- Query optimization
- Caching (Redis - future)
- Connection pooling

### Database

- Indexes on frequently queried fields
- Aggregation pipelines for complex queries
- Connection pooling

---

## Monitoring and Logging

### Logging

- **Backend:** Winston or console.log
- **Frontend:** Console (production: remove)
- **Log Levels:** Error, Warn, Info, Debug

### Monitoring

- **Health Checks:** `/api/health` endpoint
- **Error Tracking:** Sentry (future)
- **Performance:** APM tools (future)

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB service status
   - Verify connection string
   - Check firewall rules

2. **JWT Token Invalid**
   - Check token expiration
   - Verify JWT_SECRET matches
   - Check token format

3. **Blockchain Transaction Failed**
   - Check network connection
   - Verify gas fees
   - Check contract address

4. **Payment Callback Not Received**
   - Verify callback URL
   - Check eSewa configuration
   - Verify HMAC signature

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial Technical Documentation

