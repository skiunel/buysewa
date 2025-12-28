# BUYSEWA Blockchain Payment & SDC Integration Setup

## Overview

This document covers the complete blockchain payment integration, including SDC (Secure Digital Code) generation, verification, and smart contract deployment.

## Architecture

```

         BUYSEWA Blockchain Payment System               

                                                         
  Frontend (React)                                       
   Wallet Connection (MetaMask, etc.)                
   SDC Display & QR Code                             
   Review Submission                                 
                     ↓                                   
  Backend API (Express.js)                             
   SDC Generation (/api/blockchain/generate-sdc)    
   SDC Verification (/api/blockchain/verify-sdc)    
   Blockchain Registration (/api/blockchain/register-sdc)
   Review Submission (/api/blockchain/submit-review) 
                     ↓                                   
  Smart Contract (Solidity - ReviewAuth)               
   registerSDC()                                     
   verifySDC()                                       
   submitReview()                                    
   Query Functions                                   
                     ↓                                   
  Blockchain Network (Polygon/Ethereum)                
   Immutable Record Storage                          
                                                         

```

## Components

### 1. SDC Service (`utils/sdcService.js`)

Handles local SDC code generation and verification:

```javascript
const SDCService = require('./utils/sdcService');

// Generate SDC for order
const sdc = await SDCService.generateSDCForOrder(
  orderId,
  productId,
  userId
);
// Returns: {code, hash, orderId, productId, userId, generatedAt}

// Validate format
const isValid = SDCService.validateSDCFormat(sdcCode);

// Verify code against hash
const matches = await SDCService.verifySDCCode(sdcCode, hashedCode);
```

**SDC Format**: `BUYSEWA-XXXXXXXX-XXXXXXXX` (e.g., `BUYSEWA-A1B2C3D4-E5F6G7H8`)

### 2. Blockchain Service (`utils/blockchainService.js`)

Handles blockchain interactions:

```javascript
const BlockchainPaymentService = require('./utils/blockchainService');

const blockchainService = new BlockchainPaymentService();
await blockchainService.initialize();

// Generate SDC (local)
const sdc = blockchainService.generateSDC();
// Returns: {code, hash, timestamp}

// Register on blockchain
const result = await blockchainService.registerSDCOnBlockchain(
  sdcCode,
  userAddress,
  productId,
  orderId
);

// Verify on blockchain
const verification = await blockchainService.verifySDCOnBlockchain(sdcCode);

// Submit review
const reviewTx = await blockchainService.submitReviewOnBlockchain(
  sdcCode,
  productId,
  ipfsHash,
  rating
);
```

### 3. Blockchain Routes (`routes/blockchainPaymentRoutes.js`)

API endpoints for blockchain operations:

```javascript
// Generate SDC
POST /api/blockchain/generate-sdc
{
  "orderId": "123",
  "productId": "456",
  "userId": "789"
}

// Register SDC on blockchain
POST /api/blockchain/register-sdc
{
  "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8",
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE4",
  "productId": "456",
  "orderId": "123"
}

// Verify SDC
POST /api/blockchain/verify-sdc
{
  "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8"
}

// Submit review
POST /api/blockchain/submit-review
{
  "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8",
  "productId": "456",
  "ipfsHash": "QmXxxx...",
  "rating": 5
}

// Get network info
GET /api/blockchain/network-info

// Batch generate SDCs
POST /api/blockchain/batch-generate-sdc
{
  "count": 10
}
```

## Smart Contract (Solidity)

### Contract Address
Set in `.env`:
```env
REVIEW_AUTH_CONTRACT_ADDRESS=0x...
```

### Main Functions

```solidity
// Register SDC on blockchain
function registerSDC(
  bytes32 hashedSDC,
  address userAddress,
  uint256 productId,
  uint256 orderId
) external onlyOwner

// Verify SDC validity
function verifySDC(bytes32 hashedSDC)
  external view returns (bool isValid, bool isUsed, uint256 productId, address userAddress)

// Submit review using valid SDC
function submitReview(
  bytes32 hashedSDC,
  uint256 productId,
  string memory ipfsHash,
  uint256 rating
) external

// Get reviews for product
function getProductReviewIds(uint256 productId)
  external view returns (uint256[] memory reviewIds)

// Get review by ID
function getReview(uint256 reviewId)
  external view returns (Review memory review)
```

## Setup Instructions

### 1. Configure Environment Variables

Update `.env` file:

```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=http://localhost:8545
# Or for Polygon testnet:
# BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com

BLOCKCHAIN_NETWORK=hardhat
# Options: hardhat, polygon-mumbai, polygon-mainnet, ethereum

BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
# Generate from Hardhat account or wallet

REVIEW_AUTH_CONTRACT_ADDRESS=0x...
# Will be set after deployment
```

### 2. Deploy Smart Contract

```bash
cd scripts
node deployBlockchainContract.js
```

This will:
- Connect to configured blockchain network
- Deploy ReviewAuth contract
- Output deployment address
- Create initialization transaction

### 3. Initialize Blockchain Service

```bash
cd review-backend
npm start
```

The blockchain service initializes automatically:
- Connects to RPC provider
- Loads smart contract ABI
- Verifies contract functionality

## Flow: Order to Review

### Step 1: Create Order
```
Order Created → Payment Processed → Order Status: "confirmed"
```

### Step 2: Generate SDC
```javascript
POST /api/blockchain/generate-sdc
{
  "orderId": "ORD-123",
  "productId": "PROD-456",
  "userId": "USER-789"
}

Response:
{
  "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8",
  "sdcHash": "0x1234...",
  "generatedAt": "2025-12-26T..."
}
```

Customer receives SDC code (via email, SMS, or order page)

### Step 3: Register SDC on Blockchain
```javascript
POST /api/blockchain/register-sdc
{
  "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8",
  "userAddress": "0x742d35...",
  "productId": "456",
  "orderId": "123"
}

Response:
{
  "transactionHash": "0xabcd...",
  "blockNumber": 12345,
  "status": "confirmed"
}
```

SDC is now immutably recorded on blockchain

### Step 4: Customer Reviews Product
```javascript
POST /api/blockchain/submit-review
{
  "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8",
  "productId": "456",
  "ipfsHash": "QmXxxx...",
  "rating": 5
}

Response:
{
  "transactionHash": "0xefgh...",
  "blockNumber": 12346,
  "status": "confirmed"
}
```

Review is permanently stored on blockchain with SDC verification

## SDC Code Features

### Format
- **Pattern**: `BUYSEWA-XXXXXXXX-XXXXXXXX`
- **Length**: 24 characters (excluding hyphens)
- **Character Set**: Uppercase A-F and 0-9
- **Example**: `BUYSEWA-A1B2C3D4-E5F6G7H8`

### Properties
- **Unique**: Each order gets unique SDC
- **Hashable**: Encrypted using bcryptjs for database storage
- **Blockchain**: Registered on smart contract
- **One-time**: Can only be used once per review

### Delivery Methods
1. **Email**: Sent after payment confirmation
2. **SMS**: Sent to customer phone number
3. **Order Page**: Displayed in customer order details
4. **QR Code**: Scannable code for mobile

## Security Measures

### SDC Security
```
1. Generation: Cryptographically random 32-byte values
2. Hashing: bcryptjs with 10 salt rounds
3. Storage: Hashed in database, never stored as plaintext
4. Transmission: HTTPS/TLS encrypted
5. Blockchain: Immutable once registered
```

### Smart Contract Security
```
1. Owner-only functions: Only backend can register SDC
2. User verification: SDC must belong to user
3. One-time use: SDC marked as used after first review
4. Format validation: Input validation in contract
5. Rating validation: Rating must be 1-5
```

### Database Security
```
1. SDC codes never stored in plaintext
2. Hashes indexed for quick verification
3. Used status prevents duplicate reviews
4. Blockchain tx hash for audit trail
5. Timestamps for tracking
```

## Testing

### Test SDC Generation
```bash
curl -X POST http://localhost:5000/api/blockchain/generate-sdc \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST-001",
    "productId": "PROD-001",
    "userId": "USER-001"
  }'
```

### Test SDC Validation
```bash
curl -X POST http://localhost:5000/api/blockchain/validate-sdc-format \
  -H "Content-Type: application/json" \
  -d '{
    "sdcCode": "BUYSEWA-A1B2C3D4-E5F6G7H8"
  }'
```

### Test Blockchain Connection
```bash
curl http://localhost:5000/api/blockchain/network-info
```

## Troubleshooting

### Issue: "Smart Contract not initialized"
**Cause**: Contract address not configured or deployment failed
**Solution**:
1. Deploy contract: `node scripts/deployBlockchainContract.js`
2. Update `.env` with contract address
3. Restart backend

### Issue: "Invalid RPC URL"
**Cause**: Wrong blockchain RPC endpoint
**Solution**:
1. Check BLOCKCHAIN_RPC_URL in .env
2. Verify network accessibility
3. Use public RPCs:
   - Polygon Mumbai: `https://rpc-mumbai.maticvigil.com`
   - Ethereum Mainnet: `https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY`
   - Hardhat local: `http://localhost:8545`

### Issue: "Transaction failed: insufficient balance"
**Cause**: Deployer wallet has no balance for gas
**Solution**:
1. Get testnet tokens from faucet
2. Send tokens to deployer address
3. Retry deployment

### Issue: "SDC code format invalid"
**Cause**: Code doesn't match BUYSEWA-XXXXXXXX-XXXXXXXX
**Solution**:
1. Use `SDCService.generateSDCCode()` for generation
2. Validate format before submission
3. Check for manual entry errors

## Production Deployment

### Network Selection
```env
# Development (Local Hardhat)
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_NETWORK=hardhat

# Staging (Polygon Mumbai Testnet)
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
BLOCKCHAIN_NETWORK=polygon-mumbai

# Production (Polygon Mainnet)
BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
BLOCKCHAIN_NETWORK=polygon-mainnet
```

### Private Key Management
- Use environment variables or secrets manager
- Never commit private keys to repository
- Rotate keys regularly
- Use dedicated deployment accounts
- Consider multi-sig wallets for production

### Gas Optimization
- Batch SDC registrations to reduce gas costs
- Use polygon for lower fees (~$0.001 per transaction)
- Monitor gas prices and adjust strategy

## Monitoring & Analytics

### Key Metrics
- Total SDCs generated
- SDCs registered on blockchain
- Reviews submitted
- Transaction costs (in gas/USD)
- Blockchain confirmations

### Events to Monitor
- `SDCRegistered`: When SDC registered on contract
- `ReviewSubmitted`: When review submitted
- Transaction failures or reverts

## References

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Polygon Documentation](https://polygon.technology/)
- [Smart Contract Security Best Practices](https://docs.soliditylang.org/en/latest/security-considerations.html)

---

**Last Updated**: December 26, 2025
**Status**: Ready for Deployment
