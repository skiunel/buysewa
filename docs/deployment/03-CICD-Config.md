# CI/CD Pipeline Configuration
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024

---

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline configuration for the BUYSEWA platform using GitHub Actions.

---

## GitHub Actions Workflow

### Frontend CI/CD Pipeline

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'src/**'
      - 'package.json'
      - 'vite.config.ts'
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist

      - name: Deploy to production server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          source: "dist/*"
          target: "/var/www/buysewa-platform/dist"

      - name: Restart Nginx
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: sudo systemctl reload nginx
```

---

### Backend CI/CD Pipeline

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'review-backend/**'
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: review-backend/package-lock.json

      - name: Install dependencies
        working-directory: ./review-backend
        run: npm ci

      - name: Run linter
        working-directory: ./review-backend
        run: npm run lint

      - name: Run unit tests
        working-directory: ./review-backend
        run: npm run test:unit
        env:
          MONGODB_URI: mongodb://localhost:27017/buysewa_test

      - name: Run integration tests
        working-directory: ./review-backend
        run: npm run test:integration
        env:
          MONGODB_URI: mongodb://localhost:27017/buysewa_test
          JWT_SECRET: test_secret

      - name: Generate coverage report
        working-directory: ./review-backend
        run: npm run test:coverage

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: review-backend/package-lock.json

      - name: Install dependencies
        working-directory: ./review-backend
        run: npm ci --production

      - name: Create deployment package
        run: |
          cd review-backend
          tar -czf ../backend-deploy.tar.gz .

      - name: Deploy to production server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          source: "backend-deploy.tar.gz"
          target: "/tmp/"

      - name: Extract and restart application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /var/www/buysewa-platform/review-backend
            tar -xzf /tmp/backend-deploy.tar.gz
            pm2 restart buysewa-backend
            pm2 save
```

---

### Blockchain Deployment Pipeline

```yaml
# .github/workflows/blockchain.yml
name: Blockchain Deployment

on:
  push:
    branches: [ main ]
    paths:
      - 'contracts/**'
      - 'scripts/deploy.js'
  workflow_dispatch:
    inputs:
      network:
        description: 'Network to deploy to'
        required: true
        default: 'mainnet'
        type: choice
        options:
          - mainnet
          - testnet
          - localhost

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Compile contracts
        run: npx hardhat compile

      - name: Run tests
        run: npx hardhat test

      - name: Deploy to network
        run: npx hardhat run scripts/deploy.js --network ${{ github.event.inputs.network || 'mainnet' }}
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          INFURA_API_KEY: ${{ secrets.INFURA_API_KEY }}

      - name: Verify contract
        run: npx hardhat verify --network ${{ github.event.inputs.network || 'mainnet' }} ${{ env.CONTRACT_ADDRESS }}
        continue-on-error: true
```

---

## Docker Configuration

### Frontend Dockerfile

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
# Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

COPY review-backend/package*.json ./
RUN npm ci --production

COPY review-backend/ .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/buysewa
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

volumes:
  mongo-data:
```

---

## Environment Variables

### GitHub Secrets

Required secrets for CI/CD:

```
# Production Server
PROD_HOST=your-server-ip
PROD_USER=deploy
PROD_SSH_KEY=your-ssh-private-key

# Application
JWT_SECRET=your-jwt-secret
MONGODB_URI=mongodb-connection-string

# Blockchain
PRIVATE_KEY=your-private-key
INFURA_API_KEY=your-infura-key
CONTRACT_ADDRESS=deployed-contract-address

# Frontend
VITE_API_URL=https://api.yourdomain.com

# eSewa
ESEWA_MERCHANT_ID=your-merchant-id
ESEWA_SECRET_KEY=your-secret-key
```

---

## Deployment Strategy

### Staging Environment

1. **Automatic Deployment:**
   - Push to `develop` branch triggers staging deployment
   - Runs all tests before deployment
   - Deploys to staging server

2. **Manual Approval:**
   - Staging deployment requires manual approval
   - QA testing on staging environment
   - Approval triggers production deployment

### Production Environment

1. **Deployment Process:**
   - Merge to `main` branch triggers production deployment
   - All tests must pass
   - Build artifacts created
   - Deployed to production server
   - Health checks performed
   - Rollback available if health checks fail

2. **Rollback Procedure:**
   - Automatic rollback on health check failure
   - Manual rollback via GitHub Actions
   - Previous version maintained for quick rollback

---

## Monitoring and Alerts

### Health Checks

```yaml
# .github/workflows/health-check.yml
name: Health Check

on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Check API health
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://api.yourdomain.com/api/health)
          if [ $response -ne 200 ]; then
            echo "Health check failed: $response"
            exit 1
          fi

      - name: Check frontend
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com)
          if [ $response -ne 200 ]; then
            echo "Frontend check failed: $response"
            exit 1
          fi

      - name: Send alert on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Health check failed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Best Practices

1. **Branch Protection:**
   - Require pull request reviews
   - Require status checks to pass
   - Require up-to-date branches

2. **Testing:**
   - Run tests on every push
   - Require tests to pass before merge
   - Maintain test coverage > 70%

3. **Security:**
   - Never commit secrets
   - Use GitHub Secrets for sensitive data
   - Regular dependency updates
   - Security scanning enabled

4. **Documentation:**
   - Update documentation with code changes
   - Maintain changelog
   - Document deployment procedures

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial CI/CD Configuration

