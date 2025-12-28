# Software Requirements Specification (SRS)
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024
**Status:** Approved

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for the BUYSEWA E-commerce Platform, a blockchain-based e-commerce solution that ensures verified product reviews through Secure Digital Codes (SDC).

### 1.2 Scope
The BUYSEWA platform provides:
- Complete e-commerce functionality (product catalog, shopping cart, checkout)
- User authentication and role-based access control
- Payment gateway integration (eSewa)
- Blockchain-based review verification system
- Admin, Seller, and Buyer dashboards

### 1.3 Definitions and Acronyms
- **SDC**: Secure Digital Code - Unique code generated after order delivery
- **JWT**: JSON Web Token - Authentication mechanism
- **IPFS**: InterPlanetary File System - Decentralized storage for reviews
- **SRS**: Software Requirements Specification

---

## 2. Overall Description

### 2.1 Product Perspective
BUYSEWA is a standalone web application built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + MongoDB
- **Blockchain**: Hardhat + Solidity + Ethers.js

### 2.2 Product Functions
1. User Management (Registration, Login, Profile)
2. Product Management (CRUD operations)
3. Shopping Cart and Checkout
4. Payment Processing (eSewa integration)
5. Order Management
6. Blockchain Review System
7. Admin Dashboard
8. Seller Dashboard
9. Buyer Dashboard

### 2.3 User Classes
- **Buyer**: Browse products, purchase, submit reviews
- **Seller**: Manage products, view orders, track sales
- **Admin**: Manage users, products, orders, verify payments

---

## 3. Functional Requirements

### 3.1 User Authentication (FR-001)

#### FR-001.1 User Registration
- **Priority**: High
- **Description**: Users can create accounts with email, password, name, and role
- **Inputs**: name, email, password (min 4 characters), role
- **Outputs**: User account created, JWT token returned
- **Validation**: Email format, password length (4+), unique email

#### FR-001.2 User Login
- **Priority**: High
- **Description**: Users authenticate with email and password
- **Inputs**: email, password
- **Outputs**: JWT token, user profile
- **Validation**: Valid credentials, account not locked

#### FR-001.3 Session Management
- **Priority**: Medium
- **Description**: JWT tokens stored in localStorage, auto-logout on expiry
- **Inputs**: JWT token
- **Outputs**: Authenticated session or redirect to login

### 3.2 Product Management (FR-002)

#### FR-002.1 Browse Products
- **Priority**: High
- **Description**: Users can view product catalog with filters
- **Inputs**: category, search query, price range
- **Outputs**: Filtered product list
- **Filters**: Category, search, price range, stock status

#### FR-002.2 Product Details
- **Priority**: High
- **Description**: View detailed product information
- **Inputs**: productId
- **Outputs**: Product details, images, specifications, reviews

#### FR-002.3 Create Product (Seller)
- **Priority**: High
- **Description**: Sellers can add new products
- **Inputs**: name, description, price, category, images, stock
- **Outputs**: Product created (pending admin approval)
- **Validation**: Required fields, valid price, images

#### FR-002.4 Update Product (Seller)
- **Priority**: Medium
- **Description**: Sellers can update their products
- **Inputs**: productId, updated fields
- **Outputs**: Product updated

### 3.3 Shopping Cart (FR-003)

#### FR-003.1 Add to Cart
- **Priority**: High
- **Description**: Add products to shopping cart
- **Inputs**: productId, quantity
- **Outputs**: Cart updated, persisted in localStorage

#### FR-003.2 View Cart
- **Priority**: High
- **Description**: Display cart items with quantities and totals
- **Inputs**: None
- **Outputs**: Cart items, subtotal, total

#### FR-003.3 Update Cart
- **Priority**: Medium
- **Description**: Modify quantities or remove items
- **Inputs**: productId, newQuantity
- **Outputs**: Cart updated

### 3.4 Checkout and Orders (FR-004)

#### FR-004.1 Checkout Process
- **Priority**: High
- **Description**: Multi-step checkout with shipping address
- **Inputs**: Shipping address, payment method
- **Outputs**: Order created, order number generated

#### FR-004.2 Order Creation
- **Priority**: High
- **Description**: Create order from cart items
- **Inputs**: Cart items, shipping address, payment method
- **Outputs**: Order object with unique order number

#### FR-004.3 Order Tracking
- **Priority**: Medium
- **Description**: Users can view order status
- **Inputs**: orderId
- **Outputs**: Order status (processing, shipped, delivered, cancelled)

### 3.5 Payment Integration (FR-005)

#### FR-005.1 eSewa Payment
- **Priority**: High
- **Description**: Integrate with eSewa payment gateway
- **Inputs**: Order details, amount
- **Outputs**: Payment form, redirect to eSewa

#### FR-005.2 Payment Verification
- **Priority**: High
- **Description**: Verify payment after eSewa callback
- **Inputs**: Payment response, HMAC signature
- **Outputs**: Payment status updated, order confirmed

#### FR-005.3 Payment Failure Handling
- **Priority**: Medium
- **Description**: Handle failed payments gracefully
- **Inputs**: Failure response
- **Outputs**: Order status updated, user notified

### 3.6 Blockchain Review System (FR-006)

#### FR-006.1 SDC Generation
- **Priority**: High
- **Description**: Generate unique SDC after order delivery
- **Inputs**: orderId, productId, userId
- **Outputs**: Unique SDC code, hashed and stored

#### FR-006.2 SDC Registration
- **Priority**: High
- **Description**: Register SDC hash on blockchain
- **Inputs**: SDC hash, user address, productId, orderId
- **Outputs**: Blockchain transaction hash

#### FR-006.3 SDC Verification
- **Priority**: High
- **Description**: Verify SDC validity before review submission
- **Inputs**: SDC code
- **Outputs**: SDC validity, usage status, productId

#### FR-006.4 Review Submission
- **Priority**: High
- **Description**: Submit verified review to blockchain
- **Inputs**: SDC code, productId, rating, comment, images
- **Outputs**: Review stored on blockchain, IPFS hash, transaction hash

#### FR-006.5 Review Display
- **Priority**: High
- **Description**: Display verified reviews on product pages
- **Inputs**: productId
- **Outputs**: List of verified reviews with blockchain verification badge

### 3.7 Admin Dashboard (FR-007)

#### FR-007.1 User Management
- **Priority**: Medium
- **Description**: View and manage users
- **Inputs**: None
- **Outputs**: User list, user details

#### FR-007.2 Product Moderation
- **Priority**: High
- **Description**: Approve/reject seller products
- **Inputs**: productId, action (approve/reject)
- **Outputs**: Product status updated

#### FR-007.3 Order Management
- **Priority**: High
- **Description**: View all orders, update status
- **Inputs**: orderId, newStatus
- **Outputs**: Order status updated

#### FR-007.4 Payment Verification
- **Priority**: High
- **Description**: Verify and approve payments
- **Inputs**: orderId, payment verification
- **Outputs**: Payment status updated

#### FR-007.5 Analytics
- **Priority**: Low
- **Description**: View sales analytics, charts
- **Inputs**: Date range, filters
- **Outputs**: Revenue charts, category distribution

### 3.8 Seller Dashboard (FR-008)

#### FR-008.1 Product Management
- **Priority**: High
- **Description**: Manage seller's products
- **Inputs**: Product CRUD operations
- **Outputs**: Product list, create/update/delete

#### FR-008.2 Order Management
- **Priority**: High
- **Description**: View and manage seller's orders
- **Inputs**: orderId, status update
- **Outputs**: Order list, status updated

#### FR-008.3 Sales Analytics
- **Priority**: Medium
- **Description**: View sales statistics
- **Inputs**: Date range
- **Outputs**: Sales charts, revenue data

### 3.9 Buyer Dashboard (FR-009)

#### FR-009.1 Order History
- **Priority**: High
- **Description**: View past orders with SDC codes
- **Inputs**: userId
- **Outputs**: Order list with SDC codes

#### FR-009.2 Review Submission
- **Priority**: High
- **Description**: Submit reviews using SDC codes
- **Inputs**: SDC code, productId, rating, comment
- **Outputs**: Review submitted to blockchain

#### FR-009.3 Wishlist
- **Priority**: Low
- **Description**: Save favorite products
- **Inputs**: productId
- **Outputs**: Wishlist updated

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- **NFR-001**: Page load time < 2 seconds
- **NFR-002**: API response time < 500ms
- **NFR-003**: Support 100+ concurrent users
- **NFR-004**: Database queries optimized with indexes

### 4.2 Security Requirements
- **NFR-005**: Passwords hashed with bcrypt (salt rounds: 10)
- **NFR-006**: JWT tokens expire after 24 hours
- **NFR-007**: SDC codes hashed with SHA-256
- **NFR-008**: Payment signatures verified with HMAC
- **NFR-009**: Input validation on all user inputs
- **NFR-010**: CORS enabled for frontend domain only

### 4.3 Usability Requirements
- **NFR-011**: Responsive design (mobile, tablet, desktop)
- **NFR-012**: Intuitive navigation
- **NFR-013**: Clear error messages
- **NFR-014**: Loading indicators for async operations

### 4.4 Reliability Requirements
- **NFR-015**: System uptime > 99%
- **NFR-016**: Error handling for all API calls
- **NFR-017**: Transaction rollback on failures
- **NFR-018**: Logging for debugging and monitoring

### 4.5 Scalability Requirements
- **NFR-019**: Support horizontal scaling
- **NFR-020**: Database can handle 10,000+ products
- **NFR-021**: Support 1,000+ orders per day

### 4.6 Compatibility Requirements
- **NFR-022**: Support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-023**: Node.js version 18+
- **NFR-024**: MongoDB version 6+

---

## 5. System Constraints

### 5.1 Technical Constraints
- Must use React for frontend
- Must use Node.js/Express for backend
- Must use MongoDB for database
- Must use Hardhat for blockchain development
- Must integrate with eSewa payment gateway

### 5.2 Business Constraints
- Password requirements simplified (minimum 4 characters)
- No account locking for failed login attempts
- Admin approval required for new products

### 5.3 Regulatory Constraints
- GDPR compliance for user data
- Payment data security (PCI DSS considerations)

---

## 6. Assumptions and Dependencies

### 6.1 Assumptions
- Users have modern browsers with JavaScript enabled
- Users have MetaMask wallet for blockchain features
- MongoDB is running and accessible
- Internet connection is available
- eSewa API credentials are provided

### 6.2 Dependencies
- MongoDB database server
- Node.js runtime environment
- npm package manager
- Hardhat blockchain development environment
- eSewa payment gateway API

---

## 7. Appendices

### 7.1 Glossary
- **SDC**: Secure Digital Code - Unique verification code for reviews
- **IPFS**: InterPlanetary File System - Decentralized storage
- **JWT**: JSON Web Token - Authentication token
- **HMAC**: Hash-based Message Authentication Code

### 7.2 References
- React Documentation: https://react.dev
- Express.js Documentation: https://expressjs.com
- MongoDB Documentation: https://docs.mongodb.com
- Hardhat Documentation: https://hardhat.org
- eSewa API Documentation: https://developer.esewa.com.np

---

**Document Status:** Approved
**Next Review Date:** TBD
**Version History:**
- v1.0 (2024) - Initial SRS

