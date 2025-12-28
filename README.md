# BUYSEWA E-Commerce Platform

A complete e-commerce platform with blockchain-based secure digital codes (SDC), smart contracts for review authentication, and secure payment processing.

## Quick Navigation

### Getting Started
- **[Quick Start Guide](docs/setup/QUICK_START.md)** - Get up and running in 30 minutes
- **[Setup Instructions](docs/setup/SETUP_GUIDE.md)** - Detailed installation and configuration
- **[Service Startup](docs/setup/START_SERVICES.sh)** - Script to launch all services

### Core Documentation
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Overview of the entire system
- **[Complete System Guide](docs/COMPLETE_SYSTEM.md)** - Comprehensive system documentation
- **[Production Readiness](docs/PRODUCTION_READY.md)** - Checklist and requirements for production

### Payment Gateway Integration
- **[eSewa Quick Start](docs/ESEWA_QUICK_START.md)** - Quick overview and setup guide
- **[eSewa Quick Pay Guide](docs/ESEWA_QUICK_PAY_GUIDE.md)** - Complete API reference and integration
- **[eSewa Implementation Details](docs/ESEWA_IMPLEMENTATION_DETAILS.md)** - Technical architecture and flow
- **[eSewa Setup Guide](docs/ESEWA_INTEGRATION_SETUP.md)** - Production deployment instructions
- **[eSewa Summary](docs/ESEWA_SUMMARY.md)** - Implementation summary and quick reference

### Blockchain Integration
- **[Blockchain Payment Setup](docs/blockchain/BLOCKCHAIN_PAYMENT_SETUP.md)** - Complete integration guide
- **[Blockchain Quick Start](docs/blockchain/BLOCKCHAIN_QUICK_START.md)** - Quick reference for blockchain features
- **[Implementation Summary](docs/blockchain/BLOCKCHAIN_IMPLEMENTATION_SUMMARY.md)** - Technical overview
- **[Blockchain Setup](docs/blockchain/BLOCKCHAIN_SETUP.md)** - Detailed blockchain configuration
- **[Complete Guide](docs/blockchain/BLOCKCHAIN_COMPLETE_GUIDE.md)** - Full blockchain reference

### Database & Backend
- **[Database Setup](docs/database/DATABASE_SETUP.md)** - MongoDB configuration and initialization
- **[Backend Documentation](docs/README_BACKEND.md)** - Express.js API documentation
- **[eSewa Integration (Legacy)](docs/ESEWA_INTEGRATION_FIX.md)** - Legacy payment gateway setup

### Deployment
- **[Deployment Guide](docs/deployment/01-Deployment-Guide.md)** - Production deployment instructions
- **[Release Notes](docs/deployment/02-Release-Notes.md)** - Version information and changes
- **[CI/CD Configuration](docs/deployment/03-CICD-Config.md)** - Automated deployment setup
- **[GitHub Setup](docs/deployment/GITHUB_SETUP.md)** - Repository configuration
- **[Deployment Status](docs/deployment/DEPLOYMENT_STATUS.md)** - Current deployment status
- **[GitHub Deployment](docs/deployment/GITHUB_DEPLOYMENT_COMPLETE.md)** - GitHub-specific deployment

### System Design
- **[Architecture](docs/design/01-Architecture-Diagram.md)** - System architecture overview
- **[Database Schema](docs/design/02-Database-Schema.md)** - Database structure
- **[API Design](docs/design/03-API-Design.md)** - RESTful API specifications

### Documentation
- **[Technical Documentation](docs/documentation/01-Technical-Documentation.md)** - In-depth technical details
- **[API Documentation](docs/documentation/02-API-Documentation.md)** - API endpoint reference
- **[User Manual](docs/documentation/03-User-Manual.md)** - End-user guide

### Requirements & Testing
- **[Software Requirements](docs/requirements/01-SRS.md)** - Software requirements specification
- **[User Stories](docs/requirements/02-User-Stories.md)** - Feature descriptions
- **[Use Cases](docs/requirements/03-Use-Cases.md)** - System interactions
- **[Product Backlog](docs/requirements/04-Product-Backlog.md)** - Feature list and priorities
- **[Acceptance Criteria](docs/requirements/05-Acceptance-Criteria.md)** - Definition of done
- **[Test Plan](docs/testing/01-Test-Plan.md)** - Testing strategy
- **[Test Cases](docs/testing/02-Test-Cases.md)** - Detailed test scenarios
- **[Test Scripts](docs/testing/03-Test-Scripts.md)** - Automated test execution

### Reference
- **[System Diagrams](docs/diagrams/)** - UML and architecture diagrams
- **[Next Steps](docs/NEXT_STEPS.md)** - Future enhancements
- **[Git Push Checklist](docs/deployment/GIT_PUSH_CHECKLIST.md)** - Pre-commit verification

## Key Features

### eSewa Quick Pay (NEW)
- **One-Click Product Purchase** - Buy directly from product pages without adding to cart
- **Instant Checkout** - Quick purchase dialog with automatic amount calculations
- **Secure Payments** - HMAC-SHA256 signature verification for payment authenticity
- **Smart Calculations** - Automatic 10% tax and free delivery for orders over NPR 10,000
- **Order Integration** - Orders created automatically before payment
- **Success/Failure Handling** - Proper redirect flows after payment completion

### E-Commerce Features
- Secure Digital Code (SDC) generation with blockchain verification
- Smart contract-based review authentication
- Role-based access control (Admin, Seller, Buyer)
- Multiple payment methods (eSewa Quick Pay, eSewa Cart, Blockchain, Demo)
- MongoDB database with Mongoose ORM
- JWT authentication
- Rate limiting and input validation
- Comprehensive API documentation
- Production-ready security measures

## Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- Ethers.js v6.7.1 (Blockchain)
- Bcryptjs (Password hashing)
- JWT (Authentication)

**Smart Contracts:**
- Solidity (ReviewAuth contract)
- Hardhat (Local testing)

**Frontend:**
- React with TypeScript
- Vite (Build tool)

**Networks:**
- Hardhat (Local: localhost:8545)
- Mumbai Testnet
- Polygon Mainnet
- Ethereum Network

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/skiunel/buysewa
   cd buysewa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Initialize database**
   ```bash
   cd review-backend && npm run init:db
   ```

5. **Start services**
   ```bash
   ./START_SERVICES.sh
   ```

See [Setup Guide](docs/setup/SETUP_GUIDE.md) for detailed instructions.

## API Endpoints Summary

### Blockchain Payment (7 endpoints)
- POST /api/blockchain/generate-sdc
- POST /api/blockchain/register-sdc
- POST /api/blockchain/verify-sdc
- POST /api/blockchain/submit-review
- POST /api/blockchain/validate-sdc-format
- POST /api/blockchain/batch-generate-sdc
- GET /api/blockchain/network-info

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Products & Orders
- GET /api/products
- POST /api/products (Seller only)
- POST /api/orders
- GET /api/orders

### Reviews
- GET /api/reviews/:productId
- POST /api/reviews

See [API Documentation](docs/documentation/02-API-Documentation.md) for complete details.

## Security Features

- Bcryptjs password hashing (10 rounds)
- JWT token-based authentication
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Secure blockchain integration
- One-time use SDC enforcement
- Owner-only smart contract operations

## Project Structure

```
BUYSEWA E-Commerce Platform/
 review-backend/          # Express.js backend
 contracts/               # Smart contracts
 docs/                    # Complete documentation
 src/                     # Frontend (React/TypeScript)
 scripts/                 # Deployment scripts
 hardhat.config.js        # Hardhat configuration
```

## Documentation

Complete documentation is organized in the [docs/](docs/) directory:

- **[Setup & Installation](docs/setup/)** - Getting started guide
- **[Blockchain Integration](docs/blockchain/)** - SDC and smart contracts
- **[Database](docs/database/)** - MongoDB setup and schemas
- **[Deployment](docs/deployment/)** - Production deployment
- **[System Design](docs/design/)** - Architecture and API design
- **[Requirements](docs/requirements/)** - Specifications and user stories
- **[Testing](docs/testing/)** - Test plans and cases

## Deployment

Current Status: Production Ready

For deployment instructions, see [Deployment Guide](docs/deployment/01-Deployment-Guide.md)

Repository: https://github.com/skiunel/buysewa

---

**Last Updated**: December 26, 2024
