# Test Scripts
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024

---

## Overview

This document provides automated test scripts for the BUYSEWA platform. Scripts are written in JavaScript using Jest for unit/integration tests and Playwright for E2E tests.

---

## Unit Test Scripts

### Authentication Tests

```javascript
// tests/unit/auth.test.js
const { authAPI } = require('../../src/services/api');

describe('Authentication API', () => {
  test('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
      role: 'buyer'
    };

    const response = await authAPI.register(userData);

    expect(response.success).toBe(true);
    expect(response.token).toBeDefined();
    expect(response.user.email).toBe(userData.email);
  });

  test('should fail registration with duplicate email', async () => {
    const userData = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'test1234',
      role: 'buyer'
    };

    await expect(authAPI.register(userData)).rejects.toThrow();
  });

  test('should login with valid credentials', async () => {
    const response = await authAPI.login('test@example.com', 'test1234');

    expect(response.success).toBe(true);
    expect(response.token).toBeDefined();
  });

  test('should fail login with invalid credentials', async () => {
    await expect(
      authAPI.login('test@example.com', 'wrongpassword')
    ).rejects.toThrow();
  });
});
```

---

### Product API Tests

```javascript
// tests/unit/products.test.js
const { productAPI } = require('../../src/services/api');

describe('Product API', () => {
  test('should fetch all products', async () => {
    const response = await productAPI.getAll();

    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('should filter products by category', async () => {
    const response = await productAPI.getAll({ category: 'Electronics' });

    expect(response.success).toBe(true);
    response.data.forEach(product => {
      expect(product.category).toBe('Electronics');
    });
  });

  test('should search products by name', async () => {
    const response = await productAPI.getAll({ search: 'Samsung' });

    expect(response.success).toBe(true);
    response.data.forEach(product => {
      expect(product.name.toLowerCase()).toContain('samsung');
    });
  });

  test('should get product by ID', async () => {
    const productId = '507f1f77bcf86cd799439011';
    const response = await productAPI.getById(productId);

    expect(response.success).toBe(true);
    expect(response.data._id).toBe(productId);
  });
});
```

---

## Integration Test Scripts

### Order Creation Flow

```javascript
// tests/integration/orders.test.js
const request = require('supertest');
const app = require('../../review-backend/server');

describe('Order Creation Flow', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test1234'
      });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user._id;
  });

  test('should create order successfully', async () => {
    const orderData = {
      items: [
        {
          productId: '507f1f77bcf86cd799439012',
          quantity: 2
        }
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9876543210',
        address: '123 Main St',
        city: 'Kathmandu',
        postalCode: '44600',
        country: 'Nepal'
      },
      paymentMethod: 'esewa'
    };

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orderData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.orderNumber).toMatch(/^BUYSEWA-\d{4}-\d{6}$/);
    expect(response.body.data.status).toBe('processing');
  });

  test('should fail order creation with empty cart', async () => {
    const orderData = {
      items: [],
      shippingAddress: { /* ... */ },
      paymentMethod: 'esewa'
    };

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orderData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
```

---

### SDC Generation and Verification

```javascript
// tests/integration/sdc.test.js
const request = require('supertest');
const app = require('../../review-backend/server');

describe('SDC Generation and Verification', () => {
  let authToken;
  let orderId;

  beforeAll(async () => {
    // Setup: Create order and mark as delivered
    // ... (order creation code)
  });

  test('should generate SDC codes when order is delivered', async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'delivered' })
      .expect(200);

    expect(response.body.data.sdcCodes).toBeDefined();
    expect(response.body.data.sdcCodes.length).toBeGreaterThan(0);
  });

  test('should verify SDC code', async () => {
    const sdcCode = 'SDC-ABC123XYZ';

    const response = await request(app)
      .get(`/api/sdc/verify/${sdcCode}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.isValid).toBe(true);
    expect(response.body.data.isUsed).toBe(false);
  });

  test('should fail verification for invalid SDC', async () => {
    const invalidSDC = 'INVALID-SDC';

    const response = await request(app)
      .get(`/api/sdc/verify/${invalidSDC}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
```

---

## End-to-End Test Scripts (Playwright)

### Complete Purchase Flow

```javascript
// tests/e2e/purchase-flow.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Complete Purchase Flow', () => {
  test('should complete purchase from product to payment', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:5173');
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/.*homepage/);

    // 2. Browse and add to cart
    await page.click('text=Products');
    await page.click('.product-card:first-child');
    await page.click('button:has-text("Add to Cart")');

    // 3. Go to cart and checkout
    await page.click('a[href*="cart"]');
    await expect(page.locator('.cart-item')).toBeVisible();
    await page.click('button:has-text("Checkout")');

    // 4. Fill shipping address
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'Kathmandu');
    await page.fill('input[name="postalCode"]', '44600');

    // 5. Select payment and place order
    await page.click('input[value="esewa"]');
    await page.click('button:has-text("Place Order")');

    // 6. Verify order created
    await expect(page).toHaveURL(/.*payment/);
    await expect(page.locator('text=Order Created')).toBeVisible();
  });
});
```

---

### Review Submission Flow

```javascript
// tests/e2e/review-submission.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Review Submission Flow', () => {
  test('should submit verified review using SDC', async ({ page, context }) => {
    // Setup: Login as buyer with delivered order
    await page.goto('http://localhost:5173');
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'buyer@example.com');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button:has-text("Login")');

    // Navigate to buyer dashboard
    await page.click('text=Dashboard');
    await page.click('text=My Orders');

    // Find delivered order and get SDC code
    const sdcCode = await page.textContent('.sdc-code:first-child');

    // Navigate to review submission
    await page.click('button:has-text("Submit Review")');

    // Enter SDC code
    await page.fill('input[name="sdcCode"]', sdcCode);
    await page.click('button:has-text("Verify SDC")');
    await expect(page.locator('text=SDC Verified')).toBeVisible();

    // Enter review details
    await page.click('input[value="5"]'); // 5-star rating
    await page.fill('textarea[name="comment"]', 'Great product! Highly recommended.');

    // Connect MetaMask wallet (mock)
    await page.click('button:has-text("Connect Wallet")');
    // ... MetaMask connection flow

    // Submit review
    await page.click('button:has-text("Submit Review")');
    await expect(page.locator('text=Review Submitted')).toBeVisible();
    await expect(page.locator('text=Verified Purchase')).toBeVisible();
  });
});
```

---

## API Test Scripts (Postman Collection)

### Postman Collection JSON

```json
{
  "info": {
    "name": "BUYSEWA API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"test1234\",\n  \"role\": \"buyer\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"test1234\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:5000/api/products",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "products"]
            }
          }
        },
        {
          "name": "Get Product by ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:5000/api/products/:id",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "products", ":id"],
              "variable": [{"key": "id", "value": "507f1f77bcf86cd799439011"}]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Performance Test Scripts

### Load Testing (Artillery)

```yaml
# tests/performance/load-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"
  processor: "./processor.js"

scenarios:
  - name: "Browse Products"
    flow:
      - get:
          url: "/api/products"
      - get:
          url: "/api/products/{{ $randomString() }}"

  - name: "User Registration"
    flow:
      - post:
          url: "/api/auth/register"
          json:
            name: "Load Test User {{ $randomString() }}"
            email: "loadtest{{ $randomString() }}@example.com"
            password: "test1234"
            role: "buyer"
```

---

## Security Test Scripts

### SQL Injection Test

```javascript
// tests/security/injection.test.js
describe('Security Tests', () => {
  test('should prevent SQL injection in search', async () => {
    const maliciousInput = "'; DROP TABLE users; --";

    const response = await request(app)
      .get(`/api/products?search=${encodeURIComponent(maliciousInput)}`)
      .expect(200);

    // Should not crash or expose data
    expect(response.body.success).toBe(true);
  });

  test('should prevent XSS in product description', async () => {
    const xssPayload = '<script>alert("XSS")</script>';

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Product',
        description: xssPayload,
        price: 9999,
        category: 'Test'
      });

    // Should sanitize input
    expect(response.body.data.description).not.toContain('<script>');
  });
});
```

---

## Running Tests

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### All Tests
```bash
npm test
```

### Coverage Report
```bash
npm run test:coverage
```

---

## Test Data Setup

```javascript
// tests/setup/test-data.js
const mongoose = require('mongoose');
const User = require('../../review-backend/models/User');
const Product = require('../../review-backend/models/Product');

async function setupTestData() {
  // Create test users
  const buyer = await User.create({
    name: 'Test Buyer',
    email: 'buyer@test.com',
    password: 'test1234',
    role: 'buyer'
  });

  const seller = await User.create({
    name: 'Test Seller',
    email: 'seller@test.com',
    password: 'test1234',
    role: 'seller'
  });

  // Create test products
  await Product.create({
    name: 'Test Product',
    description: 'Test description',
    price: 9999,
    category: 'Electronics',
    seller: seller._id,
    status: 'active'
  });
}

module.exports = { setupTestData };
```

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial Test Scripts

