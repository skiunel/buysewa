# Database Schema
## BUYSEWA E-commerce Platform

**Version:** 1.0  
**Date:** 2024

---

## Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     User     │         │   Product   │         │    Order     │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ _id (PK)     │         │ _id (PK)     │         │ _id (PK)     │
│ name         │         │ name         │         │ orderNumber  │
│ email (UNIQUE)│         │ description  │         │ userId (FK)  │
│ password     │         │ price        │         │ items[]      │
│ role         │         │ category     │         │ subtotal     │
│ walletAddress│         │ images[]     │         │ total        │
│ createdAt    │         │ stockCount   │         │ status       │
│ updatedAt    │         │ seller (FK)  │         │ paymentStatus│
└──────────────┘         │ status       │         │ sdcCodes[]   │
      │                  │ createdAt    │         │ createdAt    │
      │                  │ updatedAt    │         │ updatedAt    │
      │                  └──────────────┘         └──────────────┘
      │                         │                         │
      │                         │                         │
      │                         │                         │
      │                  ┌──────────────┐                │
      │                  │    Review    │                │
      │                  ├──────────────┤                │
      │                  │ _id (PK)     │                │
      │                  │ productId(FK)│                │
      │                  │ userId (FK)  │                │
      │                  │ sdcId (FK)  │                │
      │                  │ rating       │                │
      │                  │ comment      │                │
      │                  │ ipfsHash     │                │
      │                  │ blockchainTx │                │
      │                  │ verified     │                │
      │                  │ createdAt    │                │
      │                  └──────────────┘                │
      │                         │                         │
      │                         │                         │
      │                  ┌──────────────┐                │
      │                  │     SDC      │                │
      │                  ├──────────────┤                │
      │                  │ _id (PK)     │                │
      │                  │ sdcCode(UNIQ)│                │
      │                  │ hashedSDC    │                │
      │                  │ userId (FK)  │                │
      │                  │ orderId (FK) │                │
      │                  │ productId(FK)│                │
      │                  │ isUsed       │                │
      │                  │ blockchainTx │                │
      │                  │ registeredAt │                │
      │                  └──────────────┘                │
      │                                                  │
      └──────────────────────────────────────────────────┘
```

---

## User Collection

**Collection Name:** `users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Unique user identifier |
| `name` | String | Required, Trimmed | User's full name |
| `email` | String | Required, Unique, Lowercase, Trimmed | User's email address |
| `password` | String | Required, MinLength: 4, Hashed | User's password (bcrypt) |
| `role` | String | Enum: ['buyer', 'seller', 'admin'], Default: 'buyer' | User role |
| `walletAddress` | String | Optional | Ethereum wallet address |
| `loginAttempts` | Number | Default: 0 | Failed login attempts |
| `lockUntil` | Date | Optional | Account lock expiration |
| `resetPasswordToken` | String | Optional | Password reset token |
| `resetPasswordExpires` | Date | Optional | Token expiration |
| `lastLogin` | Date | Optional | Last login timestamp |
| `createdAt` | Date | Default: Date.now | Account creation date |
| `updatedAt` | Date | Default: Date.now | Last update timestamp |

**Indexes:**
- `email` (Unique)
- `role`
- `walletAddress` (Sparse)

**Relationships:**
- One-to-Many: Orders
- One-to-Many: Reviews
- One-to-Many: SDCs

---

## Product Collection

**Collection Name:** `products`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Unique product identifier |
| `name` | String | Required, Trimmed | Product name |
| `description` | String | Required | Product description |
| `price` | Number | Required, Min: 0 | Product price (NPR) |
| `originalPrice` | Number | Optional, Min: 0 | Original price (for discounts) |
| `category` | String | Required | Product category |
| `subCategory` | String | Optional | Product subcategory |
| `images` | Array[String] | Optional | Product image URLs |
| `image` | String | Required | Main product image URL |
| `brand` | String | Optional | Product brand |
| `seller` | String | Required | Seller user ID |
| `inStock` | Boolean | Default: true | Stock availability |
| `stockCount` | Number | Default: 0 | Available stock quantity |
| `rating` | Number | Default: 0, Min: 0, Max: 5 | Average rating |
| `reviews` | Number | Default: 0 | Total review count |
| `verifiedReviews` | Number | Default: 0 | Verified review count |
| `features` | Array[String] | Optional | Product features |
| `specifications` | Map[String] | Optional | Product specifications |
| `tags` | Array[String] | Optional | Product tags |
| `status` | String | Enum: ['active', 'inactive', 'pending'], Default: 'pending' | Product status |
| `createdAt` | Date | Default: Date.now | Product creation date |
| `updatedAt` | Date | Default: Date.now | Last update timestamp |

**Indexes:**
- `category`
- `seller`
- `status`
- `name` (Text search)
- `price`

**Relationships:**
- Many-to-One: Seller (User)
- One-to-Many: Reviews
- One-to-Many: Order Items

---

## Order Collection

**Collection Name:** `orders`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Unique order identifier |
| `orderNumber` | String | Required, Unique | Human-readable order number (BUYSEWA-YYYY-XXXXXX) |
| `userId` | ObjectId | Required, Ref: 'User' | Buyer user ID |
| `items` | Array[OrderItem] | Required | Order items array |
| `subtotal` | Number | Required | Subtotal before delivery |
| `delivery` | Number | Default: 0 | Delivery charges |
| `total` | Number | Required | Total amount |
| `status` | String | Enum: ['processing', 'shipped', 'delivered', 'cancelled'], Default: 'processing' | Order status |
| `paymentMethod` | String | Required | Payment method (eSewa, COD, etc.) |
| `paymentStatus` | String | Enum: ['pending', 'completed', 'failed', 'refunded'], Default: 'pending' | Payment status |
| `shippingAddress` | ShippingAddress | Required | Delivery address |
| `sdcCodes` | Array[SDCCode] | Optional | Generated SDC codes |
| `deliveredAt` | Date | Optional | Delivery timestamp |
| `createdAt` | Date | Default: Date.now | Order creation date |
| `updatedAt` | Date | Default: Date.now | Last update timestamp |

**OrderItem Schema:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `productId` | ObjectId | Required, Ref: 'Product' | Product ID |
| `name` | String | Required | Product name (snapshot) |
| `price` | Number | Required | Price at time of order |
| `quantity` | Number | Required, Min: 1 | Quantity ordered |
| `image` | String | Optional | Product image URL |

**ShippingAddress Schema:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `firstName` | String | Required | First name |
| `lastName` | String | Required | Last name |
| `email` | String | Required | Contact email |
| `phone` | String | Required | Contact phone |
| `address` | String | Required | Street address |
| `city` | String | Required | City |
| `postalCode` | String | Required | Postal code |
| `country` | String | Default: 'Nepal' | Country |

**SDCCode Schema (in Order):**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `productId` | ObjectId | Required, Ref: 'Product' | Product ID |
| `sdcCode` | String | Required, Unique | SDC code |
| `generatedAt` | Date | Required | Generation timestamp |
| `isUsed` | Boolean | Default: false | Usage status |

**Indexes:**
- `orderNumber` (Unique)
- `userId`
- `status`
- `paymentStatus`
- `createdAt`

**Relationships:**
- Many-to-One: User (Buyer)
- One-to-Many: SDCs

---

## Review Collection

**Collection Name:** `reviews`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Unique review identifier |
| `productId` | ObjectId | Required, Ref: 'Product' | Product being reviewed |
| `userId` | ObjectId | Required, Ref: 'User' | Reviewer user ID |
| `sdcId` | ObjectId | Required, Ref: 'SDC' | SDC used for verification |
| `sdcCode` | String | Required | SDC code (for reference) |
| `rating` | Number | Required, Min: 1, Max: 5 | Rating (1-5 stars) |
| `comment` | String | Required, MaxLength: 500 | Review comment |
| `images` | Array[String] | Optional | Review image URLs |
| `ipfsHash` | String | Optional | IPFS hash of review content |
| `blockchainTxHash` | String | Optional, Unique, Sparse | Blockchain transaction hash |
| `blockchainReviewId` | Number | Optional | Review ID on blockchain |
| `verified` | Boolean | Default: false | Verification status |
| `helpful` | Number | Default: 0 | Helpful votes count |
| `createdAt` | Date | Default: Date.now | Review creation date |
| `updatedAt` | Date | Default: Date.now | Last update timestamp |

**Indexes:**
- `productId` + `createdAt` (Compound)
- `userId`
- `sdcId`
- `blockchainTxHash` (Unique, Sparse)
- `verified`

**Relationships:**
- Many-to-One: Product
- Many-to-One: User (Reviewer)
- Many-to-One: SDC

---

## SDC Collection

**Collection Name:** `sdcs`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Unique SDC identifier |
| `sdcCode` | String | Required, Unique | Plain SDC code |
| `hashedSDC` | String | Required, Unique | SHA-256 hash of SDC |
| `userId` | ObjectId | Required, Ref: 'User' | Owner user ID |
| `orderId` | ObjectId | Required, Ref: 'Order' | Associated order ID |
| `productId` | ObjectId | Required, Ref: 'Product' | Associated product ID |
| `isUsed` | Boolean | Default: false | Usage status |
| `isRegisteredOnBlockchain` | Boolean | Default: false | Blockchain registration status |
| `blockchainTxHash` | String | Optional | Blockchain transaction hash |
| `registeredAt` | Date | Default: Date.now | Registration timestamp |
| `usedAt` | Date | Optional | Usage timestamp |

**Indexes:**
- `sdcCode` (Unique)
- `hashedSDC` (Unique)
- `userId` + `productId` (Compound)
- `orderId`
- `isUsed`
- `isRegisteredOnBlockchain`

**Relationships:**
- Many-to-One: User
- Many-to-One: Order
- Many-to-One: Product
- One-to-One: Review (via isUsed)

---

## Database Relationships Summary

### One-to-Many Relationships

1. **User → Orders**
   - One user can have many orders
   - Foreign key: `orders.userId`

2. **User → Reviews**
   - One user can submit many reviews
   - Foreign key: `reviews.userId`

3. **User → SDCs**
   - One user can have many SDCs
   - Foreign key: `sdcs.userId`

4. **Product → Reviews**
   - One product can have many reviews
   - Foreign key: `reviews.productId`

5. **Product → Order Items**
   - One product can appear in many order items
   - Embedded in `orders.items[]`

6. **Order → SDCs**
   - One order can generate many SDCs (one per product)
   - Foreign key: `sdcs.orderId`

### Many-to-One Relationships

1. **Review → SDC**
   - Many reviews can use one SDC (but SDC can only be used once)
   - Foreign key: `reviews.sdcId`
   - Constraint: `sdc.isUsed` prevents reuse

---

## Data Integrity Rules

1. **User Email Uniqueness**
   - Email must be unique across all users
   - Enforced by MongoDB unique index

2. **SDC Code Uniqueness**
   - SDC codes must be unique
   - Enforced by MongoDB unique index

3. **SDC Single Use**
   - SDC can only be used once for review
   - Enforced by `isUsed` flag check

4. **Order Number Uniqueness**
   - Order numbers must be unique
   - Format: `BUYSEWA-YYYY-XXXXXX`
   - Enforced by MongoDB unique index

5. **Product Status**
   - Products default to "pending" status
   - Only admin can change to "active"

6. **Order Status Flow**
   - Valid transitions: processing → shipped → delivered
   - Cannot go backwards

7. **Payment Status**
   - Payment status independent of order status
   - Can be: pending, completed, failed, refunded

---

## Indexes Summary

| Collection | Index | Type | Purpose |
|------------|-------|------|---------|
| users | email | Unique | Fast login lookup |
| users | role | Standard | Filter by role |
| products | category | Standard | Category filtering |
| products | seller | Standard | Seller product queries |
| products | status | Standard | Status filtering |
| products | name | Text | Search functionality |
| orders | orderNumber | Unique | Order lookup |
| orders | userId | Standard | User order history |
| orders | status | Standard | Status filtering |
| reviews | productId + createdAt | Compound | Product reviews sorted |
| reviews | userId | Standard | User reviews |
| reviews | blockchainTxHash | Unique, Sparse | Blockchain verification |
| sdcs | sdcCode | Unique | SDC lookup |
| sdcs | hashedSDC | Unique | Blockchain verification |
| sdcs | userId + productId | Compound | User product SDCs |

---

**Document Status:** Approved  
**Version History:**
- v1.0 (2024) - Initial Database Schema

