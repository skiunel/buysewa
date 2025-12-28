# Test Plan
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024
**Test Manager:** TBD
**Test Environment:** Development/Staging

---

## 1. Introduction

### 1.1 Purpose
This test plan outlines the testing strategy for the BUYSEWA E-commerce Platform, ensuring all features work correctly, securely, and meet the specified requirements.

### 1.2 Scope
Testing covers:
- User authentication and authorization
- Product management
- Shopping cart and checkout
- Payment integration (eSewa)
- Order management
- Blockchain review system
- Admin and seller dashboards
- API endpoints
- Frontend components
- Database operations

### 1.3 Test Objectives
- Verify all functional requirements are met
- Ensure system security and data integrity
- Validate user experience and usability
- Confirm blockchain integration works correctly
- Test payment gateway integration
- Validate error handling and edge cases

---

## 2. Test Strategy

### 2.1 Testing Levels

#### Unit Testing
- **Scope:** Individual functions, components, and modules
- **Tools:** Jest, React Testing Library
- **Coverage Target:** 70%+

#### Integration Testing
- **Scope:** API endpoints, database operations, blockchain interactions
- **Tools:** Jest, Supertest
- **Coverage Target:** 80%+

#### System Testing
- **Scope:** End-to-end user flows
- **Tools:** Playwright, Cypress
- **Coverage Target:** 100% of critical paths

#### User Acceptance Testing (UAT)
- **Scope:** Real user scenarios
- **Participants:** End users, stakeholders
- **Duration:** 1 week

### 2.2 Testing Types

#### Functional Testing
- User registration and login
- Product browsing and search
- Shopping cart operations
- Checkout process
- Payment processing
- Order management
- Review submission
- Admin/Seller operations

#### Non-Functional Testing
- **Performance:** Load testing, response times
- **Security:** Authentication, authorization, data encryption
- **Usability:** UI/UX testing, accessibility
- **Compatibility:** Browser testing, mobile responsiveness
- **Reliability:** Error handling, recovery

---

## 3. Test Environment

### 3.1 Hardware Requirements
- Development Server: 4GB RAM, 2 CPU cores
- Database Server: MongoDB 6+
- Blockchain Node: Hardhat local network

### 3.2 Software Requirements
- Node.js 18+
- MongoDB 6+
- Hardhat 2.x
- Modern browsers (Chrome, Firefox, Safari, Edge)

### 3.3 Test Data
- Test users (buyer, seller, admin)
- Test products (various categories)
- Test orders
- Test SDC codes
- Test reviews

---

## 4. Test Cases

### 4.1 Authentication Test Cases

#### TC-AUTH-001: User Registration - Valid Data
**Priority:** High
**Preconditions:** User is not logged in
**Steps:**
1. Navigate to registration page
2. Enter valid name, email, password (4+ chars), role
3. Click "Create Account"

**Expected Result:** Account created, JWT token received, redirected to homepage

---

#### TC-AUTH-002: User Registration - Invalid Email
**Priority:** High
**Preconditions:** User is not logged in
**Steps:**
1. Navigate to registration page
2. Enter invalid email format (e.g., "invalid-email")
3. Click "Create Account"

**Expected Result:** Error message displayed, account not created

---

#### TC-AUTH-003: User Registration - Duplicate Email
**Priority:** High
**Preconditions:** User with email "test@example.com" exists
**Steps:**
1. Navigate to registration page
2. Enter email "test@example.com"
3. Fill other required fields
4. Click "Create Account"

**Expected Result:** Error message "Email already registered" displayed

---

#### TC-AUTH-004: User Login - Valid Credentials
**Priority:** High
**Preconditions:** User account exists
**Steps:**
1. Navigate to login page
2. Enter valid email and password
3. Click "Login"

**Expected Result:** JWT token received, redirected to dashboard

---

#### TC-AUTH-005: User Login - Invalid Credentials
**Priority:** High
**Preconditions:** User account exists
**Steps:**
1. Navigate to login page
2. Enter invalid email or password
3. Click "Login"

**Expected Result:** Error message "Invalid email or password" displayed

---

### 4.2 Product Management Test Cases

#### TC-PROD-001: Browse Products
**Priority:** High
**Preconditions:** Products exist in database
**Steps:**
1. Navigate to product listing page
2. View products

**Expected Result:** Products displayed with images, names, prices

---

#### TC-PROD-002: Filter Products by Category
**Priority:** Medium
**Preconditions:** Products in multiple categories exist
**Steps:**
1. Navigate to product listing page
2. Select a category filter
3. View filtered results

**Expected Result:** Only products from selected category displayed

---

#### TC-PROD-003: Search Products
**Priority:** Medium
**Preconditions:** Products exist
**Steps:**
1. Navigate to product listing page
2. Enter search query
3. View results

**Expected Result:** Products matching search query displayed

---

#### TC-PROD-004: View Product Details
**Priority:** High
**Preconditions:** Product exists
**Steps:**
1. Navigate to product listing
2. Click on a product
3. View product details page

**Expected Result:** Product details, images, specifications, reviews displayed

---

#### TC-PROD-005: Create Product (Seller)
**Priority:** High
**Preconditions:** Seller is logged in
**Steps:**
1. Navigate to seller dashboard
2. Click "Add Product"
3. Fill product details
4. Submit form

**Expected Result:** Product created with "pending" status

---

### 4.3 Shopping Cart Test Cases

#### TC-CART-001: Add Product to Cart
**Priority:** High
**Preconditions:** User is logged in, product exists
**Steps:**
1. View a product
2. Click "Add to Cart"
3. View cart

**Expected Result:** Product added to cart, cart count updated

---

#### TC-CART-002: Update Cart Quantity
**Priority:** Medium
**Preconditions:** Product in cart
**Steps:**
1. View cart
2. Change quantity
3. View updated total

**Expected Result:** Quantity updated, total recalculated

---

#### TC-CART-003: Remove Item from Cart
**Priority:** Medium
**Preconditions:** Multiple items in cart
**Steps:**
1. View cart
2. Click "Remove" on an item
3. View cart

**Expected Result:** Item removed, cart updated

---

### 4.4 Checkout Test Cases

#### TC-CHECKOUT-001: Checkout with Valid Address
**Priority:** High
**Preconditions:** Items in cart, user logged in
**Steps:**
1. Click "Checkout"
2. Enter shipping address
3. Select payment method
4. Submit checkout

**Expected Result:** Order created, redirected to payment

---

#### TC-CHECKOUT-002: Checkout with Empty Cart
**Priority:** High
**Preconditions:** Cart is empty
**Steps:**
1. Navigate to checkout page

**Expected Result:** Error message displayed, redirected to cart

---

#### TC-CHECKOUT-003: Checkout Address Validation
**Priority:** High
**Preconditions:** Items in cart
**Steps:**
1. Click "Checkout"
2. Leave required fields empty
3. Submit form

**Expected Result:** Validation errors displayed

---

### 4.5 Payment Test Cases

#### TC-PAY-001: eSewa Payment Initiation
**Priority:** High
**Preconditions:** Order created
**Steps:**
1. Complete checkout
2. Select eSewa payment
3. View payment form

**Expected Result:** Payment form generated with HMAC signature

---

#### TC-PAY-002: Payment Success Flow
**Priority:** High
**Preconditions:** Order created, payment initiated
**Steps:**
1. Complete payment on eSewa
2. Receive callback
3. Verify signature
4. Update order status

**Expected Result:** Payment verified, order status updated to "processing"

---

#### TC-PAY-003: Payment Failure Flow
**Priority:** High
**Preconditions:** Order created, payment initiated
**Steps:**
1. Payment fails on eSewa
2. Receive failure callback
3. Update order status

**Expected Result:** Payment status updated to "failed", user notified

---

### 4.6 Order Management Test Cases

#### TC-ORDER-001: View Order History
**Priority:** Medium
**Preconditions:** User has orders
**Steps:**
1. Navigate to buyer dashboard
2. Click "My Orders"
3. View orders

**Expected Result:** Orders displayed with status, dates, totals

---

#### TC-ORDER-002: Update Order Status (Admin)
**Priority:** High
**Preconditions:** Order exists, admin logged in
**Steps:**
1. Navigate to admin dashboard
2. View orders
3. Update order status to "delivered"

**Expected Result:** Status updated, SDC codes generated

---

### 4.7 Blockchain Review Test Cases

#### TC-REVIEW-001: SDC Generation
**Priority:** High
**Preconditions:** Order status changed to "delivered"
**Steps:**
1. Admin updates order status
2. System generates SDC codes
3. Verify SDC codes created

**Expected Result:** SDC codes generated, hashed, registered on blockchain

---

#### TC-REVIEW-002: SDC Verification
**Priority:** High
**Preconditions:** SDC code exists
**Steps:**
1. Enter SDC code in review form
2. System verifies SDC
3. View verification result

**Expected Result:** SDC verified, product information displayed

---

#### TC-REVIEW-003: Submit Verified Review
**Priority:** High
**Preconditions:** Valid SDC code, wallet connected
**Steps:**
1. Enter SDC code
2. Enter rating and comment
3. Connect MetaMask wallet
4. Submit review

**Expected Result:** Review submitted to blockchain, IPFS hash stored, transaction hash saved

---

#### TC-REVIEW-004: Duplicate SDC Usage
**Priority:** High
**Preconditions:** SDC code already used
**Steps:**
1. Enter used SDC code
2. Attempt to submit review

**Expected Result:** Error message "SDC already used" displayed

---

### 4.8 Admin Dashboard Test Cases

#### TC-ADMIN-001: Approve Product
**Priority:** High
**Preconditions:** Pending product exists, admin logged in
**Steps:**
1. Navigate to admin dashboard
2. View pending products
3. Click "Approve"

**Expected Result:** Product status updated to "active"

---

#### TC-ADMIN-002: View Analytics
**Priority:** Medium
**Preconditions:** Admin logged in, data exists
**Steps:**
1. Navigate to admin dashboard
2. View analytics tab
3. View charts and statistics

**Expected Result:** Analytics displayed correctly

---

### 4.9 Security Test Cases

#### TC-SEC-001: Unauthorized Access
**Priority:** High
**Preconditions:** User not logged in
**Steps:**
1. Attempt to access protected route
2. View response

**Expected Result:** Redirected to login page

---

#### TC-SEC-002: JWT Token Expiry
**Priority:** Medium
**Preconditions:** User logged in, token expired
**Steps:**
1. Wait for token expiry
2. Attempt API call
3. View response

**Expected Result:** 401 Unauthorized, redirected to login

---

#### TC-SEC-003: Password Hashing
**Priority:** High
**Preconditions:** User registered
**Steps:**
1. Check database
2. View password field

**Expected Result:** Password is hashed (bcrypt), not plain text

---

## 5. Test Execution Schedule

| Phase | Duration | Test Cases | Status |
|-------|----------|------------|--------|
| Unit Testing | Week 1 | TC-UNIT-001 to TC-UNIT-050 |  Pending |
| Integration Testing | Week 2 | TC-INT-001 to TC-INT-030 |  Pending |
| System Testing | Week 3 | TC-SYS-001 to TC-SYS-040 |  Pending |
| UAT | Week 4 | TC-UAT-001 to TC-UAT-020 |  Pending |
| Regression Testing | Week 5 | All critical test cases |  Pending |

---

## 6. Defect Management

### 6.1 Defect Severity Levels
- **Critical:** System crash, data loss, security breach
- **High:** Major feature broken, cannot proceed
- **Medium:** Feature partially broken, workaround available
- **Low:** Minor issue, cosmetic problem

### 6.2 Defect Lifecycle
1. **New:** Defect reported
2. **Assigned:** Assigned to developer
3. **In Progress:** Developer working on fix
4. **Fixed:** Fix implemented
5. **Verified:** Tester verified fix
6. **Closed:** Defect resolved

---

## 7. Test Deliverables

- Test Plan (this document)
- Test Cases (detailed test cases)
- Test Scripts (automated test scripts)
- Test Results Report
- Defect Report
- Test Summary Report

---

## 8. Risk and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Blockchain network unavailable | High | Low | Use local Hardhat node, mock blockchain calls |
| Payment gateway downtime | High | Medium | Implement retry mechanism, fallback payment |
| Database connection failure | High | Low | Connection pooling, retry logic |
| Performance issues under load | Medium | Medium | Load testing, optimization |

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial Test Plan

