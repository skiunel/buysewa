# 🔗 Blockchain Integration Setup Guide

This guide will help you set up the complete blockchain integration for BUYSEWA's review verification system.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)

## 🎯 Overview

The blockchain integration enables:
- **SDC (Secure Digital Code) Registration**: Register delivery codes on blockchain
- **Review Verification**: Only verified purchasers can submit reviews
- **Immutable Records**: All reviews stored on blockchain with IPFS
- **MetaMask Integration**: Users connect wallets to submit reviews

## 📦 Prerequisites

### Required Software

1. **Node.js** (v18+)
2. **MetaMask Browser Extension** (for users)
3. **Hardhat** (for contract deployment)
4. **MongoDB** (for database)

### Required Accounts (for production)

- **Polygon/Mumbai Testnet** RPC endpoint
- **IPFS Service** (Pinata, Infura, or self-hosted)
- **Block Explorer API** (optional, for transaction verification)

## 🚀 Smart Contract Deployment

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Hardhat

The contract is already configured in `hardhat.config.js`. For local development:

```bash
# Start local Hardhat node
npx hardhat node
```

### Step 3: Deploy Contract

#### Local Network (Hardhat)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### Polygon Mumbai Testnet

1. Create `.env` file:
```env
PRIVATE_KEY=your_private_key_here
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

2. Update `hardhat.config.js` to include Mumbai network

3. Deploy:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

#### Mainnet (Production)

⚠️ **Only deploy to mainnet after thorough testing!**

```bash
npx hardhat run scripts/deploy.js --network polygon
```

### Step 4: Save Contract Address

After deployment, save the contract address:

```env
REVIEW_AUTH_CONTRACT_ADDRESS=0x...
```

## ⚙️ Backend Configuration

### Step 1: Install Dependencies

```bash
cd review-backend
npm install ethers
```

### Step 2: Configure Environment Variables

Create `review-backend/.env`:

```env
# Blockchain Configuration
REVIEW_AUTH_CONTRACT_ADDRESS=0x... # From deployment
BLOCKCHAIN_RPC_URL=http://localhost:8545 # Or Polygon RPC
BLOCKCHAIN_PRIVATE_KEY=your_private_key # For contract owner operations
DEFAULT_USER_ADDRESS=0x... # Default address for SDC registration

# Database
MONGODB_URI=mongodb://localhost:27017/buysewa

# Server
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

### Step 3: Update Contract ABI

The contract ABI is already configured in `review-backend/routes/sdcRoutes.js`. If you modify the contract, update the ABI array.

### Step 4: Test Backend Connection

```bash
cd review-backend
node server.js
```

You should see:
```
✅ Blockchain connection initialized
```

## 🎨 Frontend Configuration

### Step 1: Install Ethers.js

```bash
npm install ethers
```

### Step 2: Configure Environment Variables

Create `.env` file in root:

```env
VITE_CONTRACT_ADDRESS=0x... # Same as backend
VITE_BLOCKCHAIN_RPC_URL=http://localhost:8545 # Or Polygon RPC
```

### Step 3: Use Real Blockchain Service

Update components to use `blockchainReal.ts` instead of `blockchain.ts`:

```typescript
// Replace
import { smartContract } from '../services/blockchain';

// With
import { walletService, blockchainService } from '../services/blockchainReal';
```

### Step 4: Add Wallet Connect Component

Add the `WalletConnect` component to your pages:

```tsx
import { WalletConnect } from './components/WalletConnect';

// In your component
<WalletConnect 
  onConnect={(address) => console.log('Connected:', address)}
  onDisconnect={() => console.log('Disconnected')}
/>
```

## 🧪 Testing

### Test 1: Local Blockchain

1. Start Hardhat node:
```bash
npx hardhat node
```

2. Deploy contract to local network

3. Update `.env` files with local contract address

4. Start backend and frontend

5. Connect MetaMask to `http://localhost:8545` (Chain ID: 31337)

6. Test SDC registration and review submission

### Test 2: Polygon Mumbai Testnet

1. Get test MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

2. Configure MetaMask for Mumbai:
   - Network Name: Mumbai Testnet
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer: https://mumbai.polygonscan.com

3. Deploy contract to Mumbai

4. Update environment variables

5. Test with real testnet

## 📱 User Flow

### For Buyers:

1. **Purchase Product** → Order placed
2. **Receive Delivery** → SDC code generated
3. **SDC Registered** → Automatically registered on blockchain
4. **Connect Wallet** → User connects MetaMask
5. **Submit Review** → Review submitted to blockchain with IPFS hash
6. **Verification** → Review verified on blockchain

### For Admins:

1. **View Transactions** → See all blockchain transactions
2. **Verify SDCs** → Check SDC registration status
3. **Monitor Reviews** → View blockchain-verified reviews

## 🔒 Security Considerations

1. **Private Keys**: Never commit private keys to git
2. **Contract Owner**: Use a secure wallet for contract owner
3. **Gas Limits**: Set appropriate gas limits
4. **Access Control**: Contract owner functions are protected
5. **Input Validation**: All inputs validated before blockchain calls

## 🐛 Troubleshooting

### MetaMask Not Connecting

- Ensure MetaMask is installed and unlocked
- Check if correct network is selected
- Clear browser cache and reload

### Transaction Failing

- Check if wallet has enough MATIC/ETH for gas
- Verify contract address is correct
- Check RPC endpoint is accessible

### Contract Not Found

- Verify contract address in `.env` files
- Ensure contract is deployed to correct network
- Check ABI matches contract interface

### Backend Connection Issues

- Verify RPC URL is correct
- Check private key format (no 0x prefix)
- Ensure contract address matches deployment

## 📊 Monitoring

### View Transactions

- **Local**: Check Hardhat node console
- **Mumbai**: https://mumbai.polygonscan.com
- **Polygon**: https://polygonscan.com

### Contract Events

Monitor these events:
- `SDCRegistered`: When SDC is registered
- `ReviewSubmitted`: When review is submitted
- `SDCVerified`: When SDC is verified

## 🚀 Production Deployment

### Checklist

- [ ] Contract deployed to Polygon mainnet
- [ ] Contract address saved securely
- [ ] Private keys stored in secure vault (not in code)
- [ ] RPC endpoints configured for production
- [ ] IPFS service configured (Pinata/Infura)
- [ ] Environment variables set in production
- [ ] MetaMask network configured for users
- [ ] Gas prices optimized
- [ ] Monitoring and alerts set up

### Recommended Services

- **RPC**: Alchemy, Infura, or QuickNode
- **IPFS**: Pinata or Infura IPFS
- **Monitoring**: Tenderly or OpenZeppelin Defender
- **Explorer**: Polygonscan API

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review contract logs
3. Check backend logs
4. Verify environment variables
5. Test with local Hardhat node first

---

**Note**: Always test thoroughly on testnet before deploying to mainnet!



