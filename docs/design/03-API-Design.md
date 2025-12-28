# API Design Documentation
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024
**Base URL:** `http://localhost:5000/api`

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

**Response (201 Created):**
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

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
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

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Product Endpoints

#### GET `/api/products`
Get all products with optional filters.

**Query Parameters:**
- `category` (string, optional): Filter by category
- `search` (string, optional): Search by product name
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter
- `status` (string, optional): Filter by status (active, pending, inactive)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
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

#### GET `/api/products/:id`
Get a single product by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Product Name",
    "description": "Product description",
    "price": 9999,
    "category": "Electronics",
    "images": ["url1", "url2"],
    "rating": 4.5,
    "reviews": 10,
    "specifications": {
      "brand": "Brand Name",
      "model": "Model Number"
    }
  }
}
```

---

#### POST `/api/products`
Create a new product (Seller only).

**Headers:**
```
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

**Response (201 Created):**
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

#### PUT `/api/products/:id`
Update a product (Seller/Owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 8999,
  "stockCount": 40
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Updated Product",
    "price": 8999
  }
}
```

---

#### DELETE `/api/products/:id`
Delete a product (Seller/Owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Order Endpoints

#### GET `/api/orders`
Get user's orders (Buyer) or all orders (Admin/Seller).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
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

#### GET `/api/orders/:id`
Get a single order by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "BUYSEWA-2024-123456",
    "items": [...],
    "total": 19998,
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

#### POST `/api/orders`
Create a new order.

**Headers:**
```
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

**Response (201 Created):**
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

#### PATCH `/api/orders/:id/status`
Update order status (Admin/Seller only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "delivered"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "delivered",
    "sdcCodes": [...]
  }
}
```

---

### Review Endpoints

#### GET `/api/reviews/product/:productId`
Get reviews for a product.

**Response (200 OK):**
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

#### POST `/api/reviews`
Submit a review (requires SDC verification).

**Headers:**
```
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

**Response (201 Created):**
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

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "SDC code is invalid or already used"
}
```

---

### SDC Endpoints

#### GET `/api/sdc/verify/:sdcCode`
Verify an SDC code.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
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

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "SDC code not found or invalid"
}
```

---

#### POST `/api/sdc/register`
Register SDC on blockchain (Admin/System only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sdcCode": "SDC-ABC123XYZ",
  "userId": "507f1f77bcf86cd799439011",
  "orderId": "507f1f77bcf86cd799439013",
  "productId": "507f1f77bcf86cd799439012"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "blockchainTxHash": "0x123...",
    "registeredAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Payment Endpoints

#### POST `/api/payments/esewa/initiate`
Initiate eSewa payment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 19998
}
```

**Response (200 OK):**
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

#### POST `/api/payments/esewa/verify`
Verify eSewa payment callback.

**Request Body:**
```json
{
  "oid": "BUYSEWA-2024-123456",
  "amt": "19998",
  "refId": "EPAY123456789",
  "signature": "hash_signature"
}
```

**Response (200 OK):**
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

### Admin Endpoints

#### GET `/api/admin/users`
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### PATCH `/api/admin/products/:id/approve`
Approve a product (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "approve"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product approved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "active"
  }
}
```

---

#### GET `/api/admin/analytics`
Get platform analytics (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 500000,
    "totalOrders": 100,
    "totalUsers": 50,
    "totalProducts": 200,
    "salesByCategory": {
      "Electronics": 200000,
      "Clothing": 150000,
      "Books": 150000
    }
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

- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

- Authentication endpoints: 5 requests per minute per IP
- Other endpoints: 100 requests per minute per IP

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

**Response:**
```json
{
  "success": true,
  "count": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "data": [...]
}
```

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial API Design

