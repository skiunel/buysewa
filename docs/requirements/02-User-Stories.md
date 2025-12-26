# User Stories
## BUYSEWA E-commerce Platform

**Version:** 1.0  
**Date:** 2024

---

## Epic 1: User Authentication

### US-001: User Registration
**As a** new user  
**I want to** create an account with my email and password  
**So that** I can access the platform and make purchases

**Acceptance Criteria:**
- User can enter name, email, password (min 4 chars), and role
- System validates email format and password length
- System checks for duplicate emails
- User receives confirmation and JWT token
- User is redirected to homepage after registration

**Priority:** High  
**Story Points:** 3

---

### US-002: User Login
**As a** registered user  
**I want to** log in with my email and password  
**So that** I can access my account and dashboard

**Acceptance Criteria:**
- User can enter email and password
- System validates credentials
- User receives JWT token
- Session persists across page refreshes
- User is redirected to appropriate dashboard based on role

**Priority:** High  
**Story Points:** 2

---

### US-003: User Logout
**As a** logged-in user  
**I want to** log out  
**So that** I can secure my account

**Acceptance Criteria:**
- User can click logout button
- JWT token is removed from localStorage
- User is redirected to homepage
- User cannot access protected routes after logout

**Priority:** Medium  
**Story Points:** 1

---

## Epic 2: Product Browsing

### US-004: Browse Products
**As a** buyer  
**I want to** browse products by category  
**So that** I can find items I'm interested in

**Acceptance Criteria:**
- Products are displayed in a grid/list view
- Products show image, name, price, rating
- User can filter by category
- User can search by product name
- User can filter by price range
- Products are paginated (if many)

**Priority:** High  
**Story Points:** 5

---

### US-005: View Product Details
**As a** buyer  
**I want to** view detailed product information  
**So that** I can make an informed purchase decision

**Acceptance Criteria:**
- Product page shows all details (description, specs, images)
- Product shows verified reviews
- User can see stock availability
- User can add product to cart
- User can see seller information

**Priority:** High  
**Story Points:** 3

---

## Epic 3: Shopping Cart

### US-006: Add to Cart
**As a** buyer  
**I want to** add products to my shopping cart  
**So that** I can purchase multiple items together

**Acceptance Criteria:**
- User can add product to cart from product page
- Cart shows product count badge
- Cart persists in localStorage
- User can see cart items and quantities
- User can update quantities in cart

**Priority:** High  
**Story Points:** 3

---

### US-007: View Shopping Cart
**As a** buyer  
**I want to** view my shopping cart  
**So that** I can review items before checkout

**Acceptance Criteria:**
- Cart shows all added items
- Cart shows quantities and prices
- Cart calculates subtotal and total
- User can remove items
- User can update quantities
- User can proceed to checkout

**Priority:** High  
**Story Points:** 2

---

## Epic 4: Checkout and Orders

### US-008: Checkout Process
**As a** buyer  
**I want to** complete checkout with shipping address  
**So that** I can place an order

**Acceptance Criteria:**
- User enters shipping address (required fields)
- User selects payment method
- System validates shipping address
- System creates order with unique order number
- User is redirected to payment gateway

**Priority:** High  
**Story Points:** 5

---

### US-009: View Order History
**As a** buyer  
**I want to** view my order history  
**So that** I can track my purchases

**Acceptance Criteria:**
- User can see all past orders
- Orders show status (processing, shipped, delivered)
- Orders show SDC codes (if delivered)
- User can view order details
- User can track order status

**Priority:** Medium  
**Story Points:** 3

---

## Epic 5: Payment Integration

### US-010: eSewa Payment
**As a** buyer  
**I want to** pay using eSewa  
**So that** I can complete my purchase

**Acceptance Criteria:**
- User selects eSewa payment method
- System generates payment form with HMAC signature
- User is redirected to eSewa payment page
- After payment, user is redirected back
- Payment status is updated in order

**Priority:** High  
**Story Points:** 8

---

### US-011: Payment Verification
**As an** admin  
**I want to** verify payments  
**So that** I can confirm orders are paid

**Acceptance Criteria:**
- Admin can see pending payments
- Admin can verify payment status
- System verifies HMAC signature
- Order status updates after verification
- User receives confirmation

**Priority:** High  
**Story Points:** 5

---

## Epic 6: Blockchain Review System

### US-012: Receive SDC Code
**As a** buyer  
**I want to** receive SDC code after delivery  
**So that** I can submit verified reviews

**Acceptance Criteria:**
- SDC code is generated when order status changes to "delivered"
- SDC code is unique and hashed
- SDC code is registered on blockchain
- SDC code is displayed in buyer dashboard
- SDC code can only be used once

**Priority:** High  
**Story Points:** 8

---

### US-013: Submit Verified Review
**As a** buyer  
**I want to** submit a review using my SDC code  
**So that** I can share my experience with verified purchase

**Acceptance Criteria:**
- User enters SDC code
- System verifies SDC on blockchain
- User can submit rating (1-5 stars)
- User can write comment (max 500 chars)
- User can upload images
- Review is stored on blockchain with IPFS hash
- Review shows "Verified Purchase" badge

**Priority:** High  
**Story Points:** 13

---

### US-014: View Verified Reviews
**As a** buyer  
**I want to** see verified reviews on product pages  
**So that** I can trust the reviews are from real buyers

**Acceptance Criteria:**
- Reviews show "Verified Purchase" badge
- Reviews show blockchain transaction hash
- Reviews are sorted by date (newest first)
- Reviews show rating, comment, images
- Reviews show helpful count

**Priority:** High  
**Story Points:** 3

---

## Epic 7: Seller Dashboard

### US-015: Create Product
**As a** seller  
**I want to** add new products  
**So that** I can sell my items

**Acceptance Criteria:**
- Seller can enter product details (name, description, price, category)
- Seller can upload product images
- Seller can set stock quantity
- Product is created with "pending" status
- Product requires admin approval

**Priority:** High  
**Story Points:** 5

---

### US-016: Manage Products
**As a** seller  
**I want to** manage my products  
**So that** I can update inventory and details

**Acceptance Criteria:**
- Seller can view all their products
- Seller can edit product details
- Seller can update stock quantity
- Seller can deactivate products
- Seller can see product status (pending/active)

**Priority:** High  
**Story Points:** 5

---

### US-017: View Sales Analytics
**As a** seller  
**I want to** view sales statistics  
**So that** I can track my business performance

**Acceptance Criteria:**
- Seller can see total sales revenue
- Seller can see sales by product
- Seller can see order count
- Seller can filter by date range
- Charts display sales trends

**Priority:** Medium  
**Story Points:** 5

---

## Epic 8: Admin Dashboard

### US-018: Approve Products
**As an** admin  
**I want to** approve or reject seller products  
**So that** I can maintain platform quality

**Acceptance Criteria:**
- Admin can see pending products
- Admin can view product details
- Admin can approve products (status → active)
- Admin can reject products (status → inactive)
- Seller is notified of decision

**Priority:** High  
**Story Points:** 3

---

### US-019: Manage Orders
**As an** admin  
**I want to** view and manage all orders  
**So that** I can track platform operations

**Acceptance Criteria:**
- Admin can see all orders
- Admin can filter orders by status
- Admin can update order status
- Admin can view order details
- Admin can see payment status

**Priority:** High  
**Story Points:** 5

---

### US-020: View Platform Analytics
**As an** admin  
**I want to** view platform-wide analytics  
**So that** I can understand business metrics

**Acceptance Criteria:**
- Admin can see total revenue
- Admin can see sales by category
- Admin can see user growth
- Admin can see order statistics
- Charts display trends

**Priority:** Medium  
**Story Points:** 5

---

## Epic 9: Customer Support

### US-021: Chat Support
**As a** user  
**I want to** chat with customer support  
**So that** I can get help with issues

**Acceptance Criteria:**
- User can open chat widget
- User can send messages
- System responds with helpful information
- Chat history is maintained
- User can close chat

**Priority:** Low  
**Story Points:** 5

---

## Story Summary

| Epic | Stories | Total Points |
|------|---------|--------------|
| User Authentication | 3 | 6 |
| Product Browsing | 2 | 8 |
| Shopping Cart | 2 | 5 |
| Checkout and Orders | 2 | 8 |
| Payment Integration | 2 | 13 |
| Blockchain Review System | 3 | 24 |
| Seller Dashboard | 3 | 15 |
| Admin Dashboard | 3 | 13 |
| Customer Support | 1 | 5 |
| **Total** | **21** | **97** |

---

**Document Status:** Approved  
**Version History:**
- v1.0 (2024) - Initial User Stories

