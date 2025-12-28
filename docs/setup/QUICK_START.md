# Quick Start Guide

##  Fast Setup (5 Minutes)

### Prerequisites Check
```bash
node --version    # Should be v18+
mongod --version  # MongoDB should be installed
```

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd review-backend
npm install
cd ..
```

### 2. Start Services

**Terminal 1 - Hardhat Node:**
```bash
npx hardhat node
# Keep running! Copy the contract address after deployment
```

**Terminal 2 - Deploy Contract:**
```bash
npx hardhat run scripts/deploy.js --network localhost
# Copy the contract address (e.g., 0x5FbDB2315678afecb367f032d93F642f64180aa3)
```

**Terminal 3 - Backend:**
```bash
cd review-backend
cp .env.example .env
# Edit .env and add:
# - REVIEW_AUTH_CONTRACT_ADDRESS (from step 2)
# - BLOCKCHAIN_PRIVATE_KEY (from Terminal 1, Account #0)
# - MONGODB_URI (mongodb://localhost:27017/buysewa)
npm start
```

**Terminal 4 - Frontend:**
```bash
npm run dev
# Open http://localhost:5173
```

### 3. Test Flow

1. **Register**: http://localhost:5173 → Login → Register
2. **Browse**: View products
3. **Order**: Add to cart → Checkout → Place order
4. **SDC**: Update order status to "delivered" (via API or MongoDB)
5. **Review**: Use SDC code to submit review
6. **Verify**: Check review on product page

##  Environment Variables

### Backend (.env in review-backend/)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buysewa
JWT_SECRET=your-secret-key
REVIEW_AUTH_CONTRACT_ADDRESS=0x... (from deployment)
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=0x... (from Hardhat node)
```

### Frontend (.env in project root/)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

##  Common Commands

```bash
# Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Compile contract
npx hardhat compile

# Start Hardhat node
npx hardhat node

# Backend dev mode
cd review-backend && npm run dev

# Frontend dev mode
npm run dev
```

##  Verification Checklist

- [ ] Hardhat node running (port 8545)
- [ ] Contract deployed
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] MongoDB running
- [ ] .env files configured

##  Quick Fixes

**MongoDB not running:**
```bash
# Start MongoDB
mongod
# OR
sudo systemctl start mongod
```

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill
# OR change PORT in .env
```

**Contract not found:**
- Check REVIEW_AUTH_CONTRACT_ADDRESS in .env
- Redeploy contract and update .env

##  Full Documentation

See **SETUP_GUIDE.md** for detailed instructions.


