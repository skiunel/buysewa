# BUYSEWA Full-Stack Blockchain E-commerce Platform

Complete full-stack blockchain-based e-commerce platform with blockchain-verified review system.

##  Project Overview

This is a complete Final Year Project (FYP) implementation featuring:

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + MongoDB
- **Blockchain**: Hardhat (local Ethereum) + Solidity Smart Contracts
- **Review System**: Blockchain-verified reviews using SDC (Secure Digital Code)

##  Project Structure

```
BUYSEWA E-commerce Platform Design/
 contracts/              # Solidity smart contracts
    ReviewAuth.sol      # Main review verification contract
 scripts/                # Hardhat deployment scripts
    deploy.js          # Contract deployment script
 review-backend/         # Express.js backend
    models/            # MongoDB models (User, Product, Order, SDC, Review)
    routes/            # API routes (auth, products, orders, sdc, reviews)
    server.js          # Main server file
    package.json       # Backend dependencies
 src/                   # React frontend
    components/        # React components
    contexts/          # React contexts (Cart, Auth, Order)
    services/          # API services
    ...
 hardhat.config.js      # Hardhat configuration
 SETUP_GUIDE.md         # Complete setup instructions
```

##  Quick Start

See **SETUP_GUIDE.md** for detailed step-by-step instructions.

### Quick Commands

```bash
# 1. Install dependencies
npm install
cd review-backend && npm install && cd ..

# 2. Start Hardhat node (Terminal 1)
npx hardhat node

# 3. Deploy contract (Terminal 2)
npx hardhat run scripts/deploy.js --network localhost

# 4. Configure .env files (see SETUP_GUIDE.md)

# 5. Start backend (Terminal 3)
cd review-backend && npm start

# 6. Start frontend (Terminal 4)
npm run dev
```

##  Key Features

### 1. Normal E-commerce Features
-  Product listing and details
-  Shopping cart
-  Checkout and order creation
-  Order history
-  User accounts (login/register)

### 2. Blockchain Review System (ReviewAuth)
-  SDC (Secure Digital Code) generation after order delivery
-  SDC stored in MongoDB and registered on blockchain
-  Only verified buyers can submit reviews
-  Reviews stored on blockchain with IPFS hash
-  Review verification against blockchain

### 3. Smart Contract Features
-  Register SDC codes on-chain
-  Verify SDC codes
-  Submit reviews with SDC verification
-  Prevent duplicate reviews
-  Query reviews by product/user

##  Documentation

- **SETUP_GUIDE.md** - Complete setup instructions
- **review-backend/README.md** - Backend API documentation
- Code comments throughout the codebase

##  Technology Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Radix UI components

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT authentication
- Ethers.js (blockchain integration)

### Blockchain
- Hardhat (development environment)
- Solidity 0.8.19
- Ethers.js v6

##  Security Features

- Password hashing (bcrypt)
- JWT token authentication
- SDC code hashing (SHA-256)
- Blockchain verification
- Input validation

##  API Documentation

All API endpoints are documented in `review-backend/README.md`.

Base URL: `http://localhost:5000/api`

##  Testing Flow

1. Register a user account
2. Browse products
3. Add to cart and checkout
4. Create order
5. Update order status to "delivered" (generates SDC)
6. Verify SDC code
7. Submit review with SDC
8. View review on product page

##  Dependencies

### Frontend
See `package.json` in project root.

### Backend
See `review-backend/package.json`.

### Blockchain
- Hardhat
- @nomicfoundation/hardhat-toolbox
- ethers

##  Troubleshooting

Common issues and solutions are documented in **SETUP_GUIDE.md**.

##  License

This project is for educational purposes (Final Year Project).

##  Development

For development:
- Backend: `cd review-backend && npm run dev` (uses nodemon)
- Frontend: `npm run dev` (Vite hot reload)
- Hardhat: Keep `npx hardhat node` running

##  FYP Presentation Tips

1. Demonstrate the complete flow: registration → order → SDC → review
2. Show blockchain transaction hashes
3. Explain SDC verification process
4. Show how reviews are stored on-chain
5. Demonstrate review verification

##  Support

For issues or questions:
1. Check SETUP_GUIDE.md troubleshooting section
2. Review code comments
3. Check console logs for errors

---

**Good luck with your Final Year Project! **


