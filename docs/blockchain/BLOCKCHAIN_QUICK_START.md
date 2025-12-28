# Blockchain Payment System - Quick Start

##  30-Minute Setup

### 1. Update `.env` Configuration

```env
# Backend .env (review-backend/.env)

# Blockchain Settings
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_NETWORK=hardhat
BLOCKCHAIN_PRIVATE_KEY=0x...  # Your Hardhat account private key

# Contract (leave empty initially, fill after deployment)
REVIEW_AUTH_CONTRACT_ADDRESS=0x...
```

### 2. Deploy Smart Contract (5 minutes)

```bash
# Terminal 1: Start local blockchain (Hardhat)
cd /path/to/project
npx hardhat node
# Keeps running - leave this terminal open

# Terminal 2: Deploy contract
node scripts/deployBlockchainContract.js

# Copy the contract address from output
# Update REVIEW_AUTH_CONTRACT_ADDRESS in .env
```

### 3. Start Backend (2 minutes)

```bash
cd review-backend
npm start
# Backend runs on http://localhost:5000
```

### 4. Test Blockchain Integration (5 minutes)

```bash
# Test 1: Network info
curl http://localhost:5000/api/blockchain/network-info

# Test 2: Generate SDC
curl -X POST http://localhost:5000/api/blockchain/generate-sdc \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-001",
    "productId": "PROD-001",
    "userId": "USER-001"
  }'

# Test 3: Validate SDC format
curl -X POST http://localhost:5000/api/blockchain/validate-sdc-format \
  -H "Content-Type: application/json" \
  -d '{
    "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8"
  }'
```

##  Complete Flow

### 1. Order Placed
```
Customer → Place Order → Payment Processed → Order Confirmed
```

### 2. SDC Generated
```javascript
POST /api/blockchain/generate-sdc
Body: { orderId, productId, userId }
Response: { sdcCode, sdcHash }
```

### 3. SDC Registered on Blockchain
```javascript
POST /api/blockchain/register-sdc
Body: { sdcCode, userAddress, productId, orderId }
Response: { transactionHash, blockNumber }
```

### 4. Customer Reviews
```javascript
POST /api/blockchain/submit-review
Body: { sdcCode, productId, ipfsHash, rating }
Response: { transactionHash, blockNumber }
```

##  API Endpoints

### Generate SDC
```bash
POST /api/blockchain/generate-sdc
```

### Register on Blockchain
```bash
POST /api/blockchain/register-sdc
```

### Verify SDC
```bash
POST /api/blockchain/verify-sdc
```

### Submit Review
```bash
POST /api/blockchain/submit-review
```

### Get Network Info
```bash
GET /api/blockchain/network-info
```

### Validate Format
```bash
POST /api/blockchain/validate-sdc-format
```

### Batch Generate
```bash
POST /api/blockchain/batch-generate-sdc
```

##  SDC Code Format

**Format**: `BUYSEWA-XXXXXXXX-XXXXXXXX`

**Examples**:
- `BUYSEWA-A1B2C3D4-E5F6G7H8`
- `BUYSEWA-12345678-ABCDEFGH`
- `BUYSEWA-00000001-FFFFFFFF`

**Generation**:
```javascript
const SDCService = require('./utils/sdcService');
const sdcCode = SDCService.generateSDCCode();
```

##  Security Features

 Cryptographically secure random generation
 Bcryptjs hashing (10 salt rounds)
 One-time use verification
 Blockchain immutability
 User ownership verification
 Input validation & sanitization

##  What Gets Stored

### Database (MongoDB)
```javascript
{
  sdcCode: "BUYSEWA-...",
  hashedSDC: "$2b$10$...",    // Bcrypt hash
  orderId: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  isUsed: false,
  blockchainTxHash: "0x...",
  createdAt: Date,
  updatedAt: Date
}
```

### Blockchain (Smart Contract)
```solidity
struct SDC {
  bytes32 hashedCode;      // Keccak256 hash
  address userAddress;      // User wallet
  uint256 productId;        // Product ID
  uint256 orderId;          // Order ID
  bool isUsed;              // Used for review?
  uint256 registeredAt;    // Timestamp
}
```

##  Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check dependencies
npm list ethers mongoose

# Reinstall if needed
npm install
```

### Blockchain not connecting
```bash
# Verify RPC is running
curl http://localhost:8545

# Check .env configuration
cat review-backend/.env | grep BLOCKCHAIN

# Restart both services
```

### SDC generation failing
```bash
# Test SDC service directly
cd review-backend
node -e "
const SDC = require('./utils/sdcService');
console.log(SDC.generateSDCCode());
"
```

### Contract address error
```bash
# Redeploy contract
node scripts/deployBlockchainContract.js

# Update .env with new address
REVIEW_AUTH_CONTRACT_ADDRESS=0x...

# Restart backend
npm start
```

##  Next Steps

1.  Deploy blockchain contract
2.  Configure environment variables
3.  Test SDC generation
4.  Test blockchain registration
5.  Integrate with payment routes
6.  Connect to frontend
7.  Test end-to-end flow
8.  Production deployment

##  Tips

- Use local Hardhat for development (no gas costs)
- Switch to Mumbai testnet for staging (free testnet tokens)
- Use Polygon mainnet for production (low fees)
- Monitor gas prices: [GasTracker](https://www.gasnow.org/)
- Keep private keys secure and rotate regularly

##  Support

If issues arise:
1. Check `.env` configuration
2. Verify blockchain RPC connectivity
3. Check contract deployment status
4. Review error logs in console
5. Test individual endpoints with curl

---

**Setup Time**: ~30 minutes
**Status**: Ready to deploy
**Last Updated**: December 26, 2025
