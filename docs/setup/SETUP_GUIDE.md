# BUYSEWA E-commerce Platform - Complete Setup Guide

This guide will help you set up the complete full-stack blockchain-based e-commerce platform locally on your machine.

##  Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) OR use MongoDB Atlas (cloud)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

##  Project Structure

```
BUYSEWA E-commerce Platform Design/
 contracts/              # Solidity smart contracts
    ReviewAuth.sol
 scripts/                # Hardhat deployment scripts
    deploy.js
 review-backend/         # Express.js backend
    models/            # MongoDB models
    routes/            # API routes
    server.js
 src/                   # React frontend (already exists)
 hardhat.config.js     # Hardhat configuration
```

##  Step-by-Step Setup

### Step 1: Install Frontend Dependencies

```bash
# Navigate to project root
cd "BUYSEWA E-commerce Platform Design"

# Install frontend dependencies
npm install
```

### Step 2: Install Hardhat Dependencies

```bash
# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv

# Or use the package.json.hardhat file:
# Copy package.json.hardhat to package.json temporarily, then:
# npm install
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory
cd review-backend

# Install backend dependencies
npm install
```

### Step 4: Set Up MongoDB

#### Option A: Local MongoDB

1. **Install MongoDB** (if not already installed)
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   # OR
   mongod
   ```

3. **Verify MongoDB is running**
   ```bash
   mongosh
   # Should connect successfully
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Use it in the `.env` file (see Step 6)

### Step 5: Set Up Hardhat and Deploy Smart Contract

```bash
# Navigate back to project root
cd ..

# Start a local Hardhat node (in a separate terminal)
npx hardhat node

# This will start a local Ethereum node on http://localhost:8545
# Keep this terminal running!
```

**In a new terminal:**

```bash
# Deploy the smart contract
npx hardhat run scripts/deploy.js --network localhost

# Copy the contract address from the output
# Example: REVIEW_AUTH_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 6: Configure Environment Variables

#### Backend Configuration

```bash
# Navigate to backend directory
cd review-backend

# Copy the example .env file
cp .env.example .env

# Edit .env file with your values:
```

**Edit `review-backend/.env`:**

```env
PORT=5000
NODE_ENV=development

# MongoDB (choose one)
MONGODB_URI=mongodb://localhost:27017/buysewa
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buysewa

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Blockchain Configuration
REVIEW_AUTH_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
BLOCKCHAIN_RPC_URL=http://localhost:8545

# Get a private key from Hardhat node (first account)
# In Hardhat node terminal, you'll see accounts with private keys
BLOCKCHAIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**To get a private key from Hardhat node:**
1. When you run `npx hardhat node`, it shows 20 accounts
2. Copy the private key of the first account (Account #0)
3. Use it as `BLOCKCHAIN_PRIVATE_KEY` in `.env`

#### Frontend Configuration

```bash
# Navigate back to project root
cd ..

# Copy the example .env file
cp .env.example .env

# Edit .env file (usually no changes needed if backend runs on port 5000)
```

**Edit `.env` (in project root):**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 7: Start the Backend Server

```bash
# Navigate to backend directory
cd review-backend

# Start the server
npm start

# OR for development with auto-reload:
npm run dev
```

**Expected output:**
```
 Connected to MongoDB
 Server running on http://localhost:5000
 API Health: http://localhost:5000/api/health
 Blockchain Contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 8: Start the Frontend

**In a new terminal:**

```bash
# Navigate to project root
cd "BUYSEWA E-commerce Platform Design"

# Start the frontend development server
npm run dev
```

**Expected output:**
```
VITE v6.3.5  ready in 500 ms

  Local:   http://localhost:5173/
  Network: use --host to expose
```

### Step 9: Verify Everything is Running

You should now have **4 terminals running**:

1. **Terminal 1**: Hardhat node (`npx hardhat node`)
2. **Terminal 2**: Backend server (`cd review-backend && npm start`)
3. **Terminal 3**: Frontend server (`npm run dev`)
4. **Terminal 4**: (Optional) For running commands

**Verify each service:**

- **Frontend**: Open http://localhost:5173
- **Backend API**: Open http://localhost:5000/api/health
- **Hardhat Node**: Should show "Started HTTP and WebSocket JSON-RPC server"

##  Testing the Full Flow

### 1. Create a User Account

1. Open http://localhost:5173
2. Click "Login" or "Join BUYSEWA"
3. Register a new account:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: buyer

### 2. Browse Products

- Products are loaded from the frontend data file initially
- To add products via API, use Postman or create a script

### 3. Add to Cart and Checkout

1. Browse products
2. Add items to cart
3. Go to checkout
4. Fill in shipping information
5. Place order

### 4. Generate SDC Code

**Option A: Via Backend API (using Postman or curl):**

```bash
# Update order status to "delivered" (this generates SDC codes)
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

**Option B: Via MongoDB (for testing):**

```bash
# Connect to MongoDB
mongosh

# Use buysewa database
use buysewa

# Find an order
db.orders.findOne()

# Update order status manually (SDC will be generated automatically on next save)
# Or use the API endpoint above
```

### 5. Submit a Review

1. Go to "My Orders" in the dashboard
2. Find an order with status "delivered"
3. Copy the SDC code
4. Navigate to "Review" page
5. Enter the SDC code
6. Write and submit review
7. Review will be:
   - Verified against MongoDB
   - Submitted to blockchain
   - Stored with IPFS hash (simulated)

##  API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (seller/admin)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `PATCH /api/orders/:id/status` - Update order status

### SDC (Secure Digital Code)
- `POST /api/sdc/verify` - Verify SDC code
- `GET /api/sdc/user/:userId` - Get user's SDC codes
- `POST /api/sdc/register-blockchain` - Register SDC on blockchain

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/:id` - Get review by ID

##  Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongosh` should connect
- Check MongoDB URI in `.env` file
- For local: `mongodb://localhost:27017/buysewa`
- For Atlas: Check your connection string

### Hardhat Node Not Starting

**Error:** `Error: listen EADDRINUSE: address already in use :::8545`

**Solution:**
- Another process is using port 8545
- Find and kill it: `lsof -ti:8545 | xargs kill` (macOS/Linux)
- Or change port in `hardhat.config.js`

### Backend Can't Connect to Blockchain

**Error:** `Blockchain initialization error`

**Solution:**
- Ensure Hardhat node is running
- Check `REVIEW_AUTH_CONTRACT_ADDRESS` in `.env`
- Verify `BLOCKCHAIN_RPC_URL=http://localhost:8545`
- Check private key is correct (from Hardhat node Account #0)

### Frontend Can't Connect to Backend

**Error:** `Failed to fetch` or CORS error

**Solution:**
- Ensure backend is running on port 5000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify CORS is enabled in backend (it is by default)

### SDC Verification Fails

**Error:** `SDC code not found`

**Solution:**
- Ensure order status is "delivered" (SDC codes are generated automatically)
- Check MongoDB: `db.sdcs.find()` should show SDC records
- Verify SDC code format: `SDC-BUY-2024-XXXXXX`

##  Additional Resources

- **Hardhat Documentation**: https://hardhat.org/docs
- **Ethers.js Documentation**: https://docs.ethers.org/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express.js Documentation**: https://expressjs.com/

##  For Your FYP Presentation

### Key Features to Demonstrate:

1. **User Registration/Login** - Show authentication flow
2. **Product Browsing** - Display products from database
3. **Order Creation** - Create order, show order number
4. **SDC Generation** - Show SDC code after delivery
5. **Review Submission** - Verify SDC, submit review
6. **Blockchain Verification** - Show transaction hash
7. **Review Display** - Show verified reviews on product page

### Demo Flow:

1. Register as buyer
2. Browse products
3. Add to cart and checkout
4. Show order in "My Orders"
5. Update order status to "delivered" (generates SDC)
6. Submit review using SDC code
7. Show review on product page with blockchain hash

##  Checklist

- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Hardhat dependencies installed
- [ ] Hardhat node running
- [ ] Smart contract deployed
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Tested user registration
- [ ] Tested order creation
- [ ] Tested SDC generation
- [ ] Tested review submission

##  You're All Set!

Your full-stack blockchain-based e-commerce platform is now running locally. Good luck with your FYP!

For questions or issues, check the troubleshooting section above or review the code comments.


