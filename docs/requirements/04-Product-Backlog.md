# Product Backlog
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024
**Sprint:** Current

---

## Backlog Items

###  Critical Priority (Must Have)

#### PBI-001: User Authentication System
- **Description:** Complete user registration and login functionality
- **Acceptance Criteria:**
  - Users can register with email, password (min 4 chars), name, role
  - Users can login and receive JWT token
  - Session persists across page refreshes
  - Protected routes require authentication
- **Story Points:** 5
- **Status:**  Done

#### PBI-002: Product Catalog and Browsing
- **Description:** Display products with filtering and search
- **Acceptance Criteria:**
  - Products displayed in grid/list view
  - Filter by category, price range
  - Search by product name
  - Product detail pages with images and specifications
- **Story Points:** 8
- **Status:**  Done

#### PBI-003: Shopping Cart Functionality
- **Description:** Add, update, and remove items from cart
- **Acceptance Criteria:**
  - Add products to cart
  - View cart with quantities and totals
  - Update quantities
  - Remove items
  - Cart persists in localStorage
- **Story Points:** 5
- **Status:**  Done

#### PBI-004: Checkout and Order Creation
- **Description:** Complete checkout process with order creation
- **Acceptance Criteria:**
  - Multi-step checkout form
  - Shipping address validation
  - Order creation with unique order number
  - Order stored in database
- **Story Points:** 8
- **Status:**  Done

#### PBI-005: eSewa Payment Integration
- **Description:** Integrate eSewa payment gateway
- **Acceptance Criteria:**
  - Payment form generation with HMAC signature
  - Redirect to eSewa payment page
  - Payment callback handling
  - Payment verification
  - Order status update after payment
- **Story Points:** 13
- **Status:**  Done

#### PBI-006: SDC Generation System
- **Description:** Generate Secure Digital Codes after order delivery
- **Acceptance Criteria:**
  - SDC generated when order status changes to "delivered"
  - SDC hashed and stored in database
  - SDC registered on blockchain
  - SDC displayed in buyer dashboard
- **Story Points:** 8
- **Status:**  Done

#### PBI-007: Blockchain Review Submission
- **Description:** Submit verified reviews using SDC codes
- **Acceptance Criteria:**
  - SDC verification on blockchain
  - Review submission to smart contract
  - IPFS storage for review content
  - Blockchain transaction hash stored
  - Review displayed with "Verified" badge
- **Story Points:** 13
- **Status:**  Done

#### PBI-008: Admin Dashboard
- **Description:** Admin interface for platform management
- **Acceptance Criteria:**
  - User management
  - Product approval/rejection
  - Order management
  - Payment verification
  - Analytics dashboard
- **Story Points:** 13
- **Status:**  Done

#### PBI-009: Seller Dashboard
- **Description:** Seller interface for product and order management
- **Acceptance Criteria:**
  - Product CRUD operations
  - Order management
  - Sales analytics
  - Product status tracking
- **Story Points:** 10
- **Status:**  Done

#### PBI-010: Buyer Dashboard
- **Description:** Buyer interface for orders and reviews
- **Acceptance Criteria:**
  - Order history with SDC codes
  - Review submission interface
  - Wishlist management
  - Profile settings
- **Story Points:** 8
- **Status:**  Done

---

###  High Priority (Should Have)

#### PBI-011: Product Review Display
- **Description:** Display verified reviews on product pages
- **Acceptance Criteria:**
  - Reviews fetched from database
  - Verified reviews show blockchain badge
  - Reviews sorted by date
  - Rating, comment, images displayed
- **Story Points:** 5
- **Status:**  Done

#### PBI-012: Order Status Tracking
- **Description:** Real-time order status updates
- **Acceptance Criteria:**
  - Order status displayed (processing, shipped, delivered)
  - Status update notifications
  - Order tracking timeline
- **Story Points:** 5
- **Status:**  Done

#### PBI-013: Payment Failure Handling
- **Description:** Handle failed payments gracefully
- **Acceptance Criteria:**
  - Payment failure page
  - Order status updated
  - User can retry payment
  - Error messages displayed
- **Story Points:** 3
- **Status:**  Done

#### PBI-014: Responsive Design
- **Description:** Mobile-friendly interface
- **Acceptance Criteria:**
  - Responsive layout for mobile, tablet, desktop
  - Touch-friendly buttons
  - Mobile navigation menu
- **Story Points:** 8
- **Status:**  Done

#### PBI-015: Input Validation
- **Description:** Client and server-side validation
- **Acceptance Criteria:**
  - Form validation on frontend
  - API validation on backend
  - Clear error messages
  - Validation for all user inputs
- **Story Points:** 5
- **Status:**  Done

---

###  Medium Priority (Nice to Have)

#### PBI-016: Customer Support Chatbot
- **Description:** AI-powered customer support
- **Acceptance Criteria:**
  - Chat widget on pages
  - Automated responses
  - Chat history
  - Common questions answered
- **Story Points:** 5
- **Status:**  Done

#### PBI-017: Wishlist Functionality
- **Description:** Save favorite products
- **Acceptance Criteria:**
  - Add/remove from wishlist
  - Wishlist page
  - Wishlist persists
- **Story Points:** 3
- **Status:**  Done

#### PBI-018: Product Search Enhancement
- **Description:** Advanced search with filters
- **Acceptance Criteria:**
  - Search by brand, category
  - Price range filter
  - Sort by price, rating, date
  - Search suggestions
- **Story Points:** 5
- **Status:**  In Progress

#### PBI-019: Email Notifications
- **Description:** Send email notifications for orders
- **Acceptance Criteria:**
  - Order confirmation emails
  - Order status update emails
  - Payment confirmation emails
- **Story Points:** 8
- **Status:**  Pending

#### PBI-020: Product Recommendations
- **Description:** Show recommended products
- **Acceptance Criteria:**
  - Based on browsing history
  - Based on purchase history
  - "You may also like" section
- **Story Points:** 8
- **Status:**  Pending

---

###  Low Priority (Future)

#### PBI-021: Social Media Integration
- **Description:** Share products on social media
- **Acceptance Criteria:**
  - Share buttons on product pages
  - Social login (Google, Facebook)
- **Story Points:** 5
- **Status:**  Future

#### PBI-022: Multi-language Support
- **Description:** Support multiple languages
- **Acceptance Criteria:**
  - English and Nepali support
  - Language switcher
  - Translated content
- **Story Points:** 13
- **Status:**  Future

#### PBI-023: Advanced Analytics
- **Description:** Enhanced analytics dashboard
- **Acceptance Criteria:**
  - Sales forecasting
  - Customer behavior analysis
  - Product performance metrics
- **Story Points:** 13
- **Status:**  Future

#### PBI-024: Inventory Management
- **Description:** Advanced inventory tracking
- **Acceptance Criteria:**
  - Low stock alerts
  - Automatic reordering
  - Inventory reports
- **Story Points:** 8
- **Status:**  Future

#### PBI-025: Review Moderation
- **Description:** Admin review moderation tools
- **Acceptance Criteria:**
  - Flag inappropriate reviews
  - Review approval workflow
  - Review deletion
- **Story Points:** 5
- **Status:**  Future

---

## Sprint Planning

### Sprint 1 (Completed)
-  PBI-001: User Authentication System
-  PBI-002: Product Catalog and Browsing
-  PBI-003: Shopping Cart Functionality
-  PBI-004: Checkout and Order Creation

**Total Points:** 26

### Sprint 2 (Completed)
-  PBI-005: eSewa Payment Integration
-  PBI-006: SDC Generation System
-  PBI-007: Blockchain Review Submission
-  PBI-011: Product Review Display

**Total Points:** 39

### Sprint 3 (Completed)
-  PBI-008: Admin Dashboard
-  PBI-009: Seller Dashboard
-  PBI-010: Buyer Dashboard
-  PBI-012: Order Status Tracking

**Total Points:** 36

### Sprint 4 (Current)
-  PBI-013: Payment Failure Handling
-  PBI-014: Responsive Design
-  PBI-015: Input Validation
-  PBI-016: Customer Support Chatbot
-  PBI-017: Wishlist Functionality

**Total Points:** 24

### Sprint 5 (Planned)
-  PBI-018: Product Search Enhancement
-  PBI-019: Email Notifications
-  PBI-020: Product Recommendations

**Total Points:** 21

---

## Backlog Statistics

| Priority | Count | Points | Status |
|----------|-------|--------|--------|
| Critical | 10 | 81 |  Done |
| High | 5 | 24 |  Done |
| Medium | 5 | 29 |  Partial |
| Low | 5 | 44 |  Future |
| **Total** | **25** | **178** | |

**Completed:** 15 items (105 points)
**In Progress:** 1 item (5 points)
**Pending:** 9 items (68 points)

---

## Definition of Done

A backlog item is considered "Done" when:
-  Code is written and reviewed
-  Unit tests pass
-  Integration tests pass
-  Documentation updated
-  Deployed to staging environment
-  Acceptance criteria met
-  No critical bugs

---

**Document Status:** Active
**Last Updated:** 2024
**Version History:**
- v1.0 (2024) - Initial Product Backlog

