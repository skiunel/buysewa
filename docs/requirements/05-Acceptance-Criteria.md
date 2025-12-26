# Acceptance Criteria
## BUYSEWA E-commerce Platform

**Version:** 1.0  
**Date:** 2024

---

## Feature: User Registration

### AC-REG-001: Email Validation
**Given** a user is on the registration page  
**When** they enter an invalid email format  
**Then** an error message "Please provide a valid email" is displayed  
**And** the form cannot be submitted

### AC-REG-002: Password Length
**Given** a user is on the registration page  
**When** they enter a password with less than 4 characters  
**Then** an error message "Password must be at least 4 characters" is displayed  
**And** the form cannot be submitted

### AC-REG-003: Duplicate Email
**Given** a user is on the registration page  
**When** they enter an email that already exists  
**Then** an error message "Email already registered" is displayed  
**And** the form cannot be submitted

### AC-REG-004: Successful Registration
**Given** a user enters valid registration data  
**When** they submit the form  
**Then** a user account is created  
**And** a JWT token is generated  
**And** the token is stored in localStorage  
**And** the user is redirected to the homepage

---

## Feature: User Login

### AC-LOGIN-001: Invalid Credentials
**Given** a user is on the login page  
**When** they enter incorrect email or password  
**Then** an error message "Invalid email or password" is displayed  
**And** the user remains on the login page

### AC-LOGIN-002: Successful Login
**Given** a user enters valid credentials  
**When** they submit the login form  
**Then** a JWT token is generated  
**And** the token is stored in localStorage  
**And** the user is redirected to their dashboard (buyer/seller/admin)

### AC-LOGIN-003: Session Persistence
**Given** a user is logged in  
**When** they refresh the page  
**Then** they remain logged in  
**And** their session persists

---

## Feature: Product Browsing

### AC-BROWSE-001: Display Products
**Given** a user is on the product listing page  
**When** the page loads  
**Then** products are displayed in a grid/list view  
**And** each product shows image, name, price, and rating

### AC-BROWSE-002: Category Filter
**Given** a user is on the product listing page  
**When** they select a category filter  
**Then** only products from that category are displayed  
**And** the product count updates

### AC-BROWSE-003: Search Functionality
**Given** a user is on the product listing page  
**When** they enter a search query  
**Then** products matching the query are displayed  
**And** if no results, "No products found" message is shown

### AC-BROWSE-004: Price Range Filter
**Given** a user is on the product listing page  
**When** they set a price range  
**Then** only products within that range are displayed

---

## Feature: Shopping Cart

### AC-CART-001: Add to Cart
**Given** a user is viewing a product  
**When** they click "Add to Cart"  
**Then** the product is added to the cart  
**And** the cart count badge updates  
**And** a success message is displayed

### AC-CART-002: Cart Persistence
**Given** a user has items in their cart  
**When** they refresh the page  
**Then** the cart items remain  
**And** quantities are preserved

### AC-CART-003: Update Quantity
**Given** a user is viewing their cart  
**When** they change the quantity of an item  
**Then** the subtotal updates  
**And** the total updates

### AC-CART-004: Remove Item
**Given** a user is viewing their cart  
**When** they click "Remove" on an item  
**Then** the item is removed from the cart  
**And** the cart count updates

---

## Feature: Checkout

### AC-CHECKOUT-001: Empty Cart Validation
**Given** a user has an empty cart  
**When** they try to checkout  
**Then** an error message "Cart is empty" is displayed  
**And** they are redirected to the cart page

### AC-CHECKOUT-002: Shipping Address Validation
**Given** a user is on the checkout page  
**When** they submit without required address fields  
**Then** validation errors are displayed  
**And** the form cannot be submitted

### AC-CHECKOUT-003: Order Creation
**Given** a user completes checkout with valid data  
**When** they submit the checkout form  
**Then** an order is created in the database  
**And** a unique order number is generated  
**And** the user is redirected to payment

---

## Feature: eSewa Payment

### AC-PAY-001: Payment Form Generation
**Given** an order is created  
**When** the user selects eSewa payment  
**Then** a payment form is generated with HMAC signature  
**And** the form includes order details

### AC-PAY-002: Payment Redirect
**Given** a payment form is generated  
**When** the form is submitted  
**Then** the user is redirected to eSewa payment page

### AC-PAY-003: Payment Success
**Given** a user completes payment on eSewa  
**When** eSewa redirects back with success response  
**Then** the payment signature is verified  
**And** the order payment status is updated to "completed"  
**And** the user sees a success page

### AC-PAY-004: Payment Failure
**Given** a payment fails on eSewa  
**When** eSewa redirects back with failure response  
**Then** the order payment status is updated to "failed"  
**And** the user sees a failure page  
**And** they can retry payment

---

## Feature: SDC Generation

### AC-SDC-001: SDC Generation Trigger
**Given** an order exists  
**When** the order status is changed to "delivered"  
**Then** SDC codes are generated for each product in the order

### AC-SDC-002: SDC Uniqueness
**Given** SDC codes are generated  
**When** codes are created  
**Then** each SDC code is unique  
**And** codes are hashed with SHA-256

### AC-SDC-003: Blockchain Registration
**Given** SDC codes are generated  
**When** codes are registered  
**Then** SDC hashes are registered on blockchain  
**And** blockchain transaction hash is stored  
**And** SDC status is marked as "registered"

### AC-SDC-004: SDC Display
**Given** SDC codes are generated  
**When** a buyer views their order  
**Then** SDC codes are displayed in the buyer dashboard  
**And** codes are associated with specific products

---

## Feature: Review Submission

### AC-REVIEW-001: SDC Verification
**Given** a buyer wants to submit a review  
**When** they enter an SDC code  
**Then** the system verifies the SDC on blockchain  
**And** if invalid, an error message is displayed

### AC-REVIEW-002: SDC Usage Check
**Given** a buyer enters a valid SDC code  
**When** the SDC is already used  
**Then** an error message "SDC already used" is displayed  
**And** the review cannot be submitted

### AC-REVIEW-003: Review Content Validation
**Given** a buyer is submitting a review  
**When** they enter rating and comment  
**Then** rating must be between 1-5  
**And** comment must not exceed 500 characters

### AC-REVIEW-004: Blockchain Submission
**Given** a buyer submits a valid review  
**When** they connect their wallet and submit  
**Then** review content is stored on IPFS  
**And** review is submitted to blockchain smart contract  
**And** blockchain transaction hash is stored  
**And** SDC is marked as "used"

### AC-REVIEW-005: Verified Badge
**Given** a review is submitted to blockchain  
**When** the review is displayed  
**Then** it shows a "Verified Purchase" badge  
**And** it shows the blockchain transaction hash

---

## Feature: Product Management (Seller)

### AC-PROD-001: Create Product
**Given** a seller is logged in  
**When** they create a new product  
**Then** product is created with "pending" status  
**And** product requires admin approval

### AC-PROD-002: Product Validation
**Given** a seller is creating a product  
**When** required fields are missing  
**Then** validation errors are displayed  
**And** the product cannot be created

### AC-PROD-003: Update Product
**Given** a seller has created a product  
**When** they update product details  
**Then** changes are saved  
**And** if status is "active", changes require admin re-approval

---

## Feature: Product Approval (Admin)

### AC-APPROVE-001: View Pending Products
**Given** an admin is logged in  
**When** they navigate to admin dashboard  
**Then** pending products are displayed  
**And** product details are visible

### AC-APPROVE-002: Approve Product
**Given** an admin views a pending product  
**When** they click "Approve"  
**Then** product status changes to "active"  
**And** product becomes visible to buyers  
**And** seller is notified

### AC-APPROVE-003: Reject Product
**Given** an admin views a pending product  
**When** they click "Reject"  
**Then** product status changes to "inactive"  
**And** product is not visible to buyers  
**And** seller is notified

---

## Feature: Order Management

### AC-ORDER-001: View Orders
**Given** a user is logged in  
**When** they navigate to their dashboard  
**Then** their orders are displayed  
**And** orders show status, date, total

### AC-ORDER-002: Update Order Status
**Given** an admin/seller views an order  
**When** they update the order status  
**Then** status is updated in database  
**And** if status is "delivered", SDC codes are generated  
**And** buyer is notified

### AC-ORDER-003: Order Details
**Given** a user views an order  
**When** they click on order details  
**Then** full order information is displayed  
**And** items, shipping address, payment status are shown

---

## Feature: Admin Dashboard

### AC-ADMIN-001: User Management
**Given** an admin is logged in  
**When** they navigate to user management  
**Then** all users are displayed  
**And** admin can view user details

### AC-ADMIN-002: Payment Verification
**Given** an admin views pending payments  
**When** they verify a payment  
**Then** payment status is updated  
**And** order status is updated accordingly

### AC-ADMIN-003: Analytics Display
**Given** an admin is on the dashboard  
**When** they view analytics  
**Then** revenue charts are displayed  
**And** sales statistics are shown  
**And** category distribution is visible

---

## Feature: Responsive Design

### AC-RESP-001: Mobile View
**Given** a user accesses the site on mobile  
**When** they browse the site  
**Then** layout adapts to mobile screen  
**And** navigation menu is accessible  
**And** buttons are touch-friendly

### AC-RESP-002: Tablet View
**Given** a user accesses the site on tablet  
**When** they browse the site  
**Then** layout adapts to tablet screen  
**And** content is properly displayed

### AC-RESP-003: Desktop View
**Given** a user accesses the site on desktop  
**When** they browse the site  
**Then** full layout is displayed  
**And** all features are accessible

---

## Testing Checklist

### Registration Flow
- [ ] Valid registration succeeds
- [ ] Invalid email shows error
- [ ] Short password shows error
- [ ] Duplicate email shows error
- [ ] Token stored after registration

### Login Flow
- [ ] Valid login succeeds
- [ ] Invalid credentials show error
- [ ] Session persists on refresh
- [ ] Redirect to correct dashboard

### Product Browsing
- [ ] Products display correctly
- [ ] Category filter works
- [ ] Search works
- [ ] Price filter works
- [ ] Product details page loads

### Shopping Cart
- [ ] Add to cart works
- [ ] Cart persists on refresh
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Totals calculate correctly

### Checkout
- [ ] Empty cart validation
- [ ] Address validation
- [ ] Order creation succeeds
- [ ] Order number generated

### Payment
- [ ] Payment form generated
- [ ] Redirect to eSewa works
- [ ] Payment success handled
- [ ] Payment failure handled
- [ ] Signature verification works

### SDC & Reviews
- [ ] SDC generated on delivery
- [ ] SDC registered on blockchain
- [ ] SDC verification works
- [ ] Review submission works
- [ ] Verified badge displays

---

**Document Status:** Approved  
**Version History:**
- v1.0 (2024) - Initial Acceptance Criteria

