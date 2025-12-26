# BUYSEWA Backend API

Express.js backend server for the BUYSEWA E-commerce Platform with blockchain-based review system.

## Features

- User authentication (JWT)
- Product management
- Order processing
- SDC (Secure Digital Code) generation and verification
- Blockchain-integrated review system
- MongoDB database

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# See SETUP_GUIDE.md for details

# Start server
npm start

# Or for development with auto-reload
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
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

## Environment Variables

See `.env.example` for all required environment variables.

## Database Models

- **User** - User accounts
- **Product** - Product catalog
- **Order** - Customer orders
- **SDC** - Secure Digital Codes for review verification
- **Review** - Product reviews (blockchain verified)

## Blockchain Integration

The backend integrates with the ReviewAuth smart contract deployed on Hardhat local node. SDC codes are registered on-chain when orders are delivered, and reviews are submitted to the blockchain for verification.

## Development

```bash
# Install nodemon for auto-reload
npm install -g nodemon

# Run in development mode
npm run dev
```

## Production

```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Start server
npm start
```


