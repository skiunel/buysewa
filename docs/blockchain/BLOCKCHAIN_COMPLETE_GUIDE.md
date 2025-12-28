#  Blockchain Integration - Complete Guide

**BUYSEWA E-commerce Platform**
**Blockchain-Based Review Verification System**

---

##  Blockchain Files Location

### Smart Contract (Solidity)
```
contracts/
 ReviewAuth.sol          ← Main smart contract (298 lines)
```

### Deployment Scripts
```
scripts/
 deploy.js               ← Hardhat deployment script (50 lines)
```

### Hardhat Configuration
```
hardhat.config.js           ← Hardhat setup & network config
hardhat.config.cjs          ← Legacy config (CJS format)
```

### Backend Integration
```
review-backend/
 routes/
    sdcRoutes.js        ← SDC registration & verification
    reviewRoutes.js     ← Review submission with blockchain
    esewaRoutes.js      ← Payment integration
 models/
    Sdc.js              ← SDC database model
    Review.js           ← Review database model
    Order.js            ← Order model (generates SDC)
 middleware/
    security.js         ← Security middleware
 utils/
     signature.js        ← eSewa signature utility
```

### Frontend Integration
```
src/
 components/
    BlockchainReview.tsx     ← Review blockchain display
    WalletConnect.tsx        ← MetaMask wallet connection
    ReviewSubmission.tsx     ← Review form with blockchain
    EsewaPaymentForm.tsx     ← Payment form
 services/
    blockchain.ts           ← Mock blockchain service
    blockchainReal.ts       ← Real blockchain integration
    esewaService.ts         ← Payment gateway service
 contexts/
     AuthContext.tsx         ← User authentication
     CartContext.tsx         ← Cart management
```

### Documentation
```
docs/
 BLOCKCHAIN_SETUP.md      ← Setup & deployment guide
 ESEWA_INTEGRATION_FIX.md ← Payment integration docs
 PROJECT_SUMMARY.md       ← Project overview
 diagrams/
     01-user-domain-class-diagram.html    ← Shows SDC entity
     02-admin-domain-class-diagram.html   ← Shows moderation
     03-seller-domain-class-diagram.html  ← Shows sales tracking
```

---

##  Key Blockchain Components

### 1. Smart Contract (ReviewAuth.sol)

**Purpose:** Secure on-chain storage of product reviews with SDC verification

**Key Functions:**
```solidity
// Register SDC codes for purchase verification
registerSDC(hashedSDC, userAddress, productId, orderId)

// Verify SDC before allowing review
verifySDC(hashedSDC) → (isValid, isUsed, productId, userAddress)

// Submit review on blockchain
submitReview(hashedSDC, productId, ipfsHash, rating)

// Get review information
getReview(reviewId) → Review struct

// Get all reviews for a product
getProductReviewIds(productId) → uint256[] reviewIds
```

**Storage:**
- SDC Registry: Maps hashed codes to purchase info
- Review Registry: Maps review IDs to review data
- Product Reviews: Tracks all reviews per product
- User Reviews: Tracks reviews submitted by users

**Events (Logging):**
```solidity
SDCRegistered(sdcHash, user, productId, orderId, timestamp)
ReviewSubmitted(reviewId, productId, reviewer, sdcHash, ipfsHash, rating, timestamp)
SDCVerified(sdcHash, isValid, isUsed)
```

### 2. Backend Integration

**File: `review-backend/routes/sdcRoutes.js`**
```javascript
// Initialize blockchain connection
initBlockchain()  // Connects to smart contract

// Verify SDC endpoint
POST /api/sdc/verify
  → Checks SDC in database
  → Verifies on blockchain
  → Returns validity status

// Register SDC on blockchain
POST /api/sdc/register-blockchain
  → Calls contract.registerSDC()
  → Stores transaction hash
  → Updates database

// Get user SDCs
GET /api/sdc/user/:userId
  → Lists all SDCs for user
  → Shows blockchain status
```

**File: `review-backend/routes/reviewRoutes.js`**
```javascript
// Submit review endpoint
POST /api/reviews/
  → Validates SDC
  → Generates IPFS hash
  → Submits to blockchain
  → Stores review in database
  → Tracks transaction hash
```

**Models:**
```javascript
// Sdc.js model
{
  sdcCode: String,           // Actual code
  hashedSDC: String,         // Blockchain hash
  userId: ObjectId,          // User reference
  orderId: ObjectId,         // Order reference
  productId: ObjectId,       // Product reference
  isUsed: Boolean,           // Review submitted?
  isRegisteredOnBlockchain: Boolean,
  blockchainTxHash: String,  // Transaction hash
  registeredAt: Date
}

// Review.js model
{
  productId: ObjectId,
  userId: ObjectId,
  sdcId: ObjectId,
  sdcCode: String,
  rating: Number (1-5),
  comment: String,
  ipfsHash: String,          // IPFS storage
  blockchainTxHash: String,  // On-chain hash
  blockchainReviewId: Number,
  verified: Boolean,         // Blockchain verified
  createdAt: Date
}
```

### 3. Frontend Integration

**File: `src/components/BlockchainReview.tsx`**
```typescript
// Display blockchain-verified reviews
- Show blockchain transaction hash
- Link to blockchain explorer
- Display IPFS hash
- Verify authenticity badge
```

**File: `src/components/WalletConnect.tsx`**
```typescript
// MetaMask wallet connection
- Connect wallet button
- Display wallet address
- Handle connection errors
- Enable Web3 operations
```

**File: `src/components/ReviewSubmission.tsx`**
```typescript
// Review form with blockchain
1. User writes review
2. System generates SDC hash
3. Submits to backend API
4. Backend writes to blockchain
5. Display confirmation
6. Show blockchain hash
```

**File: `src/services/blockchainReal.ts`**
```typescript
// Real blockchain operations
export const walletService = {
  connectWallet(),      // Connect MetaMask
  disconnectWallet(),   // Clear connection
  getAddress(),         // Get user wallet
  // ...
}

export const blockchainService = {
  submitReview(),       // Submit to blockchain
  verifySDC(),          // Check SDC validity
  getTransaction(),     // Get tx details
  // ...
}
```

---

##  Deployment Flow

### Step 1: Deploy Smart Contract

```bash
# Start local blockchain (Hardhat node)
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.js --network localhost

# Output:
# ReviewAuth deployed to: 0x5FbDB2315678afccb333F8a9ced29BaC559aff81
```

### Step 2: Configure Backend

```env
# .env file in review-backend/
REVIEW_AUTH_CONTRACT_ADDRESS=0x5FbDB2315678afccb333F8a9ced29BaC559aff81
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb476c55263f29f77d5022be3d7f6
MONGODB_URI=mongodb://localhost:27017/buysewa
```

### Step 3: Start Backend Server

```bash
cd review-backend
npm install ethers      # Add blockchain library
node server.js

# Check logs:
#  Blockchain connection initialized
#  Blockchain Contract: 0x5FbDB2315678afccb333F8a9ced29BaC559aff81
```

### Step 4: Test API Endpoints

```bash
# 1. Verify SDC
curl -X POST http://localhost:5000/api/sdc/verify \
  -H "Content-Type: application/json" \
  -d '{"sdcCode": "ABC-123-DEF"}'

# 2. Register on blockchain
curl -X POST http://localhost:5000/api/sdc/register-blockchain \
  -H "Content-Type: application/json" \
  -d '{"sdcId": "507f1f77bcf86cd799439011"}'

# 3. Submit review
curl -X POST http://localhost:5000/api/reviews/ \
  -H "Content-Type: application/json" \
  -d '{
    "sdcCode": "ABC-123-DEF",
    "productId": "507f191e810c19729de860ea",
    "userId": "507f1f77bcf86cd799439011",
    "rating": 5,
    "comment": "Great product!"
  }'
```

---

##  Security Features

### 1. SDC (Secure Digital Code) Verification
- Unique code per purchase
- Hashed before blockchain storage
- Used only once for reviews
- Tied to specific order & product

### 2. Blockchain Immutability
- Reviews stored permanently on blockchain
- Cannot be edited after submission
- Transaction hash proves authenticity
- Complete audit trail

### 3. IPFS Storage
- Review content stored on IPFS
- Hash stored on blockchain
- Distributed redundancy
- Privacy & availability

### 4. MetaMask Integration
- User wallet authentication
- Gasless transactions (admin submits)
- User-controlled operations
- Web3 standard compatibility

### 5. Contract Access Control
```solidity
modifier onlyOwner() {
  require(msg.sender == owner, "Only owner can call");
  _;
}
```

---

##  Data Flow Diagram

### Purchase to Review Flow

```
1. User Places Order
   ↓
2. Order Saved to MongoDB
   → Generates SDC code
   → Hashes SDC
   ↓
3. Order Delivered
   → SDC visible to user
   ↓
4. Backend: Register SDC on Blockchain
   → Calls: contract.registerSDC()
   → Stores: transaction hash
   → Updates: isRegisteredOnBlockchain = true
   ↓
5. User Submits Review
   → Frontend receives review data
   → Backend validates SDC
   → Generates IPFS hash
   ↓
6. Backend: Submit Review to Blockchain
   → Calls: contract.submitReview()
   → Stores: blockchainTxHash
   → Updates: verified = true
   ↓
7. Review Display
   → Shows blockchain hash
   → Shows IPFS hash
   → Link to blockchain explorer
   → Shows verified badge
```

---

##  Network Configuration

### Local Development
```
Network: Hardhat (localhost:8545)
Chain ID: 31337
Speed: Instant
Cost: Free (test ETH)
Contract: Deploy locally with script
```

### Testing (Mumbai Testnet)
```
Network: Polygon Mumbai
Chain ID: 80001
RPC URL: https://rpc-mumbai.maticvigil.com
Speed: ~2-3 seconds
Cost: Minimal (test MATIC from faucet)
Testnet Faucet: https://faucet.polygon.technology/
```

### Production (Polygon Mainnet)
```
Network: Polygon
Chain ID: 137
RPC URL: https://polygon-rpc.com
Speed: ~2 seconds
Cost: Minimal gas (much cheaper than Ethereum)
Ethereum Bridge: https://bridge.polygon.technology/
```

---

##  Important Files Summary

| File | Size | Purpose |
|------|------|---------|
| ReviewAuth.sol | 298 lines | Smart contract |
| deploy.js | 50 lines | Deployment script |
| sdcRoutes.js | 250+ lines | SDC API endpoints |
| reviewRoutes.js | 280+ lines | Review API endpoints |
| Sdc.js | 50 lines | SDC data model |
| Review.js | 80 lines | Review data model |
| blockchainReal.ts | 200+ lines | Frontend service |
| WalletConnect.tsx | 150+ lines | MetaMask component |
| BlockchainReview.tsx | 200+ lines | Review display |

---

##  Verification

### Check Deployment Status

```bash
# 1. Start Hardhat node in terminal 1
npx hardhat node

# 2. Deploy contract in terminal 2
npx hardhat run scripts/deploy.js --network localhost

# 3. Check backend logs
cd review-backend && node server.js

# Expected output:
#  Connected to MongoDB
#  Blockchain connection initialized
#  Server running on http://localhost:5000
#  Blockchain Contract: 0x5FbDB2315678afccb333F8a9ced29BaC559aff81
```

### Verify on Blockchain Explorer

```
Local (Hardhat): Console output shows all transactions
Mumbai Testnet: https://mumbai.polygonscan.com
Polygon Mainnet: https://polygonscan.com

Search for:
- Contract address
- Transaction hash
- Review events
```

---

##  Key Advantages

1. **Immutability** - Reviews cannot be deleted or edited
2. **Transparency** - All reviews publicly verifiable
3. **Authenticity** - SDC ensures genuine purchases
4. **Security** - Blockchain proves legitimacy
5. **Decentralization** - No single point of failure
6. **Trust** - Users can verify reviews independently
7. **Compliance** - Complete audit trail
8. **Performance** - Polygon for speed & cost

---

##  Configuration Checklist

- [ ] Smart contract deployed
- [ ] Contract address saved in .env
- [ ] Blockchain RPC URL configured
- [ ] Private key set (for admin operations)
- [ ] MongoDB running and accessible
- [ ] Backend server started
- [ ] IPFS service available (or using mock)
- [ ] MetaMask installed in browser
- [ ] Network configured in MetaMask
- [ ] Test SDC codes created

---

##  Common Issues

### Blockchain Connection Failed
```
Error: Could not connect to blockchain
Solution:
1. Check RPC_URL is correct
2. Ensure Hardhat node is running (npx hardhat node)
3. Verify network configuration
```

### Contract Address Not Found
```
Error: Contract not found at address
Solution:
1. Deploy contract fresh: npx hardhat run scripts/deploy.js
2. Copy address from output
3. Update .env file
4. Restart backend server
```

### SDC Registration Fails
```
Error: Transaction reverted
Solution:
1. Check SDC code format
2. Verify order exists in database
3. Check account has sufficient gas
4. Ensure contract is deployed
```

---

**Last Updated:** December 26, 2025
**Status:** Production Ready
**Version:** 1.0
