# API Documentation
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024
**Base URL:** `http://localhost:5000/api`
**Production URL:** `https://api.yourdomain.com/api`

---

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

---

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (string, optional): Filter by category
- `search` (string, optional): Search by name
- `minPrice` (number, optional): Minimum price
- `maxPrice` (number, optional): Maximum price
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example:**
```http
GET /api/products?category=Electronics&minPrice=1000&maxPrice=5000&page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Product Name",
      "description": "Product description",
      "price": 9999,
      "category": "Electronics",
      "images": ["url1", "url2"],
      "rating": 4.5,
      "reviews": 10,
      "inStock": true,
      "stockCount": 50
    }
  ]
}
```

---

#### Get Product by ID
```http
GET /api/products/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Product Name",
    "description": "Detailed description",
    "price": 9999,
    "category": "Electronics",
    "images": ["url1", "url2"],
    "specifications": {
      "brand": "Brand Name",
      "model": "Model Number"
    },
    "rating": 4.5,
    "reviews": 10
  }
}
```

---

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 9999,
  "category": "Electronics",
  "images": ["url1", "url2"],
  "stockCount": 50,
  "specifications": {
    "brand": "Brand Name"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "New Product",
    "status": "pending"
  }
}
```

---

### Orders

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Kathmandu",
    "postalCode": "44600",
    "country": "Nepal"
  },
  "paymentMethod": "esewa"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "BUYSEWA-2024-123456",
    "total": 19998,
    "status": "processing",
    "paymentStatus": "pending"
  }
}
```

---

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "BUYSEWA-2024-123456",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439012",
          "name": "Product Name",
          "price": 9999,
          "quantity": 2
        }
      ],
      "total": 19998,
      "status": "processing",
      "paymentStatus": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Update Order Status
```http
PATCH /api/orders/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "delivered"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "delivered",
    "sdcCodes": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "sdcCode": "SDC-ABC123XYZ",
        "isUsed": false
      }
    ]
  }
}
```

---

### Reviews

#### Get Product Reviews
```http
GET /api/reviews/product/:productId
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "name": "John Doe"
      },
      "rating": 5,
      "comment": "Great product!",
      "verified": true,
      "blockchainTxHash": "0x123...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Submit Review
```http
POST /api/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sdcCode": "SDC-ABC123XYZ",
  "productId": "507f1f77bcf86cd799439012",
  "rating": 5,
  "comment": "Great product!",
  "images": ["url1", "url2"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "verified": true,
    "blockchainTxHash": "0x123...",
    "ipfsHash": "QmXxx..."
  }
}
```

---

### SDC (Secure Digital Code)

#### Verify SDC
```http
GET /api/sdc/verify/:sdcCode
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "isUsed": false,
    "productId": "507f1f77bcf86cd799439012",
    "productName": "Product Name"
  }
}
```

---

### Payments

#### Initiate eSewa Payment
```http
POST /api/payments/esewa/initiate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 19998
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://esewa.com.np/epay/main",
    "formData": {
      "amt": "19998",
      "pid": "BUYSEWA-2024-123456",
      "scd": "EPAYTEST",
      "su": "http://localhost:5173/payment/success",
      "fu": "http://localhost:5173/payment/failure"
    },
    "signature": "hash_signature"
  }
}
```

---

#### Verify Payment
```http
POST /api/payments/esewa/verify
```

**Request Body:**
```json
{
  "oid": "BUYSEWA-2024-123456",
  "amt": "19998",
  "refId": "EPAY123456789",
  "signature": "hash_signature"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "orderId": "507f1f77bcf86cd799439011",
    "paymentStatus": "completed"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information (optional)"
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

- Authentication endpoints: 5 requests/minute/IP
- Other endpoints: 100 requests/minute/IP

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response includes:**
- `count` - Items in current page
- `page` - Current page number
- `limit` - Items per page
- `totalPages` - Total number of pages

---

## Webhooks

### Payment Callback

eSewa sends payment callbacks to:
```
POST /api/payments/esewa/verify
```

**Callback Data:**
- `oid` - Order ID
- `amt` - Amount
- `refId` - Reference ID
- `signature` - HMAC signature

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get products
const products = await api.get('/products', {
  params: { category: 'Electronics' }
});

// Create order
const order = await api.post('/orders', {
  items: [...],
  shippingAddress: {...},
  paymentMethod: 'esewa'
});
```

---

## Postman Collection

Import the Postman collection from:
```
docs/postman/BUYSEWA-API.postman_collection.json
```

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial API Documentation

