# Test Cases
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024

---

## Test Case Template

Each test case includes:
- **Test Case ID:** Unique identifier
- **Test Case Name:** Descriptive name
- **Priority:** High/Medium/Low
- **Preconditions:** Required state before test
- **Test Steps:** Step-by-step instructions
- **Expected Result:** Expected outcome
- **Actual Result:** (To be filled during execution)
- **Status:** Pass/Fail/Blocked

---

## Authentication Test Cases

### TC-AUTH-001: Successful User Registration
**Priority:** High
**Module:** Authentication
**Preconditions:** User is not logged in, email not registered

**Test Steps:**
1. Navigate to http://localhost:5173
2. Click "Sign Up" tab
3. Enter name: "Test User"
4. Enter email: "testuser@example.com"
5. Enter password: "test1234"
6. Enter confirm password: "test1234"
7. Select role: "buyer"
8. Click "Create Account"

**Expected Result:**
- Account created successfully
- JWT token received and stored
- User redirected to homepage
- Success message displayed

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-AUTH-002: Registration with Invalid Email Format
**Priority:** High
**Module:** Authentication
**Preconditions:** User is not logged in

**Test Steps:**
1. Navigate to registration page
2. Enter name: "Test User"
3. Enter email: "invalid-email"
4. Enter password: "test1234"
5. Click "Create Account"

**Expected Result:**
- Error message: "Please provide a valid email"
- Account not created
- User remains on registration page

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-AUTH-003: Registration with Short Password
**Priority:** High
**Module:** Authentication
**Preconditions:** User is not logged in

**Test Steps:**
1. Navigate to registration page
2. Enter name: "Test User"
3. Enter email: "test@example.com"
4. Enter password: "123"
5. Click "Create Account"

**Expected Result:**
- Error message: "Password must be at least 4 characters"
- Account not created

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-AUTH-004: Registration with Duplicate Email
**Priority:** High
**Module:** Authentication
**Preconditions:** User with email "existing@example.com" exists

**Test Steps:**
1. Navigate to registration page
2. Enter name: "New User"
3. Enter email: "existing@example.com"
4. Enter password: "test1234"
5. Click "Create Account"

**Expected Result:**
- Error message: "Email already registered"
- Account not created

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-AUTH-005: Successful User Login
**Priority:** High
**Module:** Authentication
**Preconditions:** User account exists

**Test Steps:**
1. Navigate to login page
2. Enter email: "testuser@example.com"
3. Enter password: "test1234"
4. Click "Login"

**Expected Result:**
- Login successful
- JWT token received and stored
- User redirected to dashboard (based on role)
- Session persists on page refresh

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-AUTH-006: Login with Invalid Credentials
**Priority:** High
**Module:** Authentication
**Preconditions:** User account exists

**Test Steps:**
1. Navigate to login page
2. Enter email: "testuser@example.com"
3. Enter password: "wrongpassword"
4. Click "Login"

**Expected Result:**
- Error message: "Invalid email or password"
- User remains on login page
- No token stored

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-AUTH-007: User Logout
**Priority:** Medium
**Module:** Authentication
**Preconditions:** User is logged in

**Test Steps:**
1. User is logged in
2. Click "Logout" button
3. Verify session cleared

**Expected Result:**
- JWT token removed from localStorage
- User redirected to homepage
- Protected routes inaccessible

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Product Management Test Cases

### TC-PROD-001: Browse All Products
**Priority:** High
**Module:** Product Management
**Preconditions:** Products exist in database

**Test Steps:**
1. Navigate to product listing page
2. View products displayed

**Expected Result:**
- Products displayed in grid/list view
- Each product shows: image, name, price, rating
- Products are paginated (if many)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PROD-002: Filter Products by Category
**Priority:** Medium
**Module:** Product Management
**Preconditions:** Products in multiple categories exist

**Test Steps:**
1. Navigate to product listing page
2. Select category filter: "Electronics"
3. View filtered results

**Expected Result:**
- Only products from "Electronics" category displayed
- Product count updates
- Other categories hidden

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PROD-003: Search Products by Name
**Priority:** Medium
**Module:** Product Management
**Preconditions:** Products exist

**Test Steps:**
1. Navigate to product listing page
2. Enter search query: "Samsung"
3. View results

**Expected Result:**
- Products with "Samsung" in name displayed
- Search is case-insensitive
- If no results, "No products found" message shown

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PROD-004: Filter Products by Price Range
**Priority:** Medium
**Module:** Product Management
**Preconditions:** Products with various prices exist

**Test Steps:**
1. Navigate to product listing page
2. Set min price: 1000
3. Set max price: 5000
4. View filtered results

**Expected Result:**
- Only products within price range displayed
- Price filter works correctly

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PROD-005: View Product Details
**Priority:** High
**Module:** Product Management
**Preconditions:** Product exists

**Test Steps:**
1. Navigate to product listing
2. Click on a product
3. View product details page

**Expected Result:**
- Product details displayed: name, description, price, images
- Specifications shown
- Reviews displayed (if any)
- "Add to Cart" button visible

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PROD-006: Create Product (Seller)
**Priority:** High
**Module:** Product Management
**Preconditions:** Seller is logged in

**Test Steps:**
1. Navigate to seller dashboard
2. Click "Add Product"
3. Enter product details:
   - Name: "New Product"
   - Description: "Product description"
   - Price: 9999
   - Category: "Electronics"
   - Images: Upload images
   - Stock: 50
4. Click "Submit"

**Expected Result:**
- Product created successfully
- Product status: "pending"
- Product appears in seller's product list
- Admin notified (if notification system exists)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PROD-007: Update Product (Seller)
**Priority:** Medium
**Module:** Product Management
**Preconditions:** Seller has created a product

**Test Steps:**
1. Navigate to seller dashboard
2. View products list
3. Click "Edit" on a product
4. Update price: 8999
5. Update stock: 40
6. Click "Save"

**Expected Result:**
- Product updated successfully
- Changes reflected immediately
- Updated timestamp changed

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Shopping Cart Test Cases

### TC-CART-001: Add Product to Cart
**Priority:** High
**Module:** Shopping Cart
**Preconditions:** User is logged in, product exists and in stock

**Test Steps:**
1. View a product page
2. Click "Add to Cart" button
3. View cart icon (badge should update)
4. Navigate to cart page

**Expected Result:**
- Product added to cart
- Cart count badge shows "1"
- Product visible in cart with correct quantity
- Success message displayed (optional)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-CART-002: Add Multiple Products to Cart
**Priority:** High
**Module:** Shopping Cart
**Preconditions:** User is logged in, multiple products exist

**Test Steps:**
1. Add Product A to cart
2. Add Product B to cart
3. Add Product C to cart
4. View cart

**Expected Result:**
- All three products in cart
- Cart count badge shows "3"
- Each product shows correct quantity (1)
- Subtotal calculated correctly

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-CART-003: Update Cart Quantity
**Priority:** Medium
**Module:** Shopping Cart
**Preconditions:** Product in cart

**Test Steps:**
1. Navigate to cart page
2. Find a product
3. Change quantity from 1 to 3
4. View updated total

**Expected Result:**
- Quantity updated to 3
- Subtotal recalculated (price × 3)
- Total updated
- Cart persists on page refresh

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-CART-004: Remove Item from Cart
**Priority:** Medium
**Module:** Shopping Cart
**Preconditions:** Multiple items in cart

**Test Steps:**
1. Navigate to cart page
2. Click "Remove" on an item
3. Confirm removal (if confirmation dialog)
4. View updated cart

**Expected Result:**
- Item removed from cart
- Cart count badge updated
- Subtotal and total recalculated
- Cart persists on page refresh

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-CART-005: Cart Persistence
**Priority:** Medium
**Module:** Shopping Cart
**Preconditions:** Items in cart

**Test Steps:**
1. Add items to cart
2. Refresh the page
3. Navigate to cart page

**Expected Result:**
- Cart items persist after refresh
- Quantities preserved
- Totals correct

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Checkout Test Cases

### TC-CHECKOUT-001: Checkout with Valid Address
**Priority:** High
**Module:** Checkout
**Preconditions:** Items in cart, user logged in

**Test Steps:**
1. Navigate to cart
2. Click "Checkout" button
3. Enter shipping address:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john@example.com"
   - Phone: "9876543210"
   - Address: "123 Main St"
   - City: "Kathmandu"
   - Postal Code: "44600"
4. Select payment method: "eSewa"
5. Click "Place Order"

**Expected Result:**
- Order created successfully
- Unique order number generated
- Order stored in database
- Redirected to payment gateway

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-CHECKOUT-002: Checkout with Empty Cart
**Priority:** High
**Module:** Checkout
**Preconditions:** Cart is empty, user logged in

**Test Steps:**
1. Ensure cart is empty
2. Navigate to checkout page (or click checkout)

**Expected Result:**
- Error message: "Cart is empty"
- Redirected to cart page or product listing
- Cannot proceed to checkout

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-CHECKOUT-003: Checkout Address Validation
**Priority:** High
**Module:** Checkout
**Preconditions:** Items in cart

**Test Steps:**
1. Navigate to checkout
2. Leave required fields empty (e.g., First Name)
3. Click "Place Order"

**Expected Result:**
- Validation errors displayed
- Form cannot be submitted
- Required fields highlighted

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Payment Test Cases

### TC-PAY-001: eSewa Payment Initiation
**Priority:** High
**Module:** Payment
**Preconditions:** Order created

**Test Steps:**
1. Complete checkout
2. Select eSewa payment method
3. Click "Place Order"
4. View payment form/redirect

**Expected Result:**
- Payment form generated with order details
- HMAC signature included
- Redirected to eSewa payment page (or form submitted)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PAY-002: Payment Success Flow
**Priority:** High
**Module:** Payment
**Preconditions:** Order created, payment initiated

**Test Steps:**
1. Complete payment on eSewa (test mode)
2. Receive success callback
3. System verifies HMAC signature
4. View order status

**Expected Result:**
- Payment signature verified
- Order payment status: "completed"
- Order status: "processing"
- User sees success page
- Order visible in dashboard

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-PAY-003: Payment Failure Flow
**Priority:** High
**Module:** Payment
**Preconditions:** Order created, payment initiated

**Test Steps:**
1. Payment fails on eSewa (or simulate failure)
2. Receive failure callback
3. View order status

**Expected Result:**
- Payment status: "failed"
- User sees failure page
- Order remains in database
- User can retry payment

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Order Management Test Cases

### TC-ORDER-001: View Order History
**Priority:** Medium
**Module:** Order Management
**Preconditions:** User has placed orders

**Test Steps:**
1. Navigate to buyer dashboard
2. Click "My Orders" tab
3. View orders list

**Expected Result:**
- All user orders displayed
- Orders show: order number, date, status, total
- Orders sorted by date (newest first)
- Can click to view order details

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-ORDER-002: View Order Details
**Priority:** Medium
**Module:** Order Management
**Preconditions:** Order exists

**Test Steps:**
1. Navigate to order history
2. Click on an order
3. View order details

**Expected Result:**
- Order details displayed: items, quantities, prices
- Shipping address shown
- Payment status shown
- Order status shown
- SDC codes shown (if delivered)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-ORDER-003: Update Order Status (Admin)
**Priority:** High
**Module:** Order Management
**Preconditions:** Order exists, admin logged in

**Test Steps:**
1. Navigate to admin dashboard
2. View orders list
3. Select an order
4. Update status: "processing" → "shipped" → "delivered"
5. Verify SDC codes generated

**Expected Result:**
- Order status updated
- If status is "delivered", SDC codes generated
- SDC codes displayed in order details
- Buyer notified (if notification system exists)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Blockchain Review Test Cases

### TC-REVIEW-001: SDC Generation
**Priority:** High
**Module:** Blockchain Review
**Preconditions:** Order status changed to "delivered"

**Test Steps:**
1. Admin updates order status to "delivered"
2. System generates SDC codes
3. Verify SDC codes in database
4. Verify SDC codes registered on blockchain

**Expected Result:**
- SDC codes generated for each product
- SDC codes unique
- SDC codes hashed (SHA-256)
- SDC codes registered on blockchain
- Blockchain transaction hash stored

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-REVIEW-002: SDC Verification
**Priority:** High
**Module:** Blockchain Review
**Preconditions:** SDC code exists and registered

**Test Steps:**
1. Navigate to review submission page
2. Enter SDC code
3. Click "Verify SDC"
4. View verification result

**Expected Result:**
- SDC verified successfully
- Product information displayed
- SDC status: "valid" and "not used"
- Can proceed to submit review

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-REVIEW-003: Submit Verified Review
**Priority:** High
**Module:** Blockchain Review
**Preconditions:** Valid SDC code, MetaMask wallet connected

**Test Steps:**
1. Enter valid SDC code
2. Verify SDC
3. Enter rating: 5
4. Enter comment: "Great product!"
5. Upload images (optional)
6. Connect MetaMask wallet
7. Click "Submit Review"

**Expected Result:**
- Review content stored on IPFS
- Review submitted to blockchain smart contract
- Blockchain transaction hash received
- Review stored in database
- SDC marked as "used"
- Review displayed on product page with "Verified" badge

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-REVIEW-004: Duplicate SDC Usage Prevention
**Priority:** High
**Module:** Blockchain Review
**Preconditions:** SDC code already used

**Test Steps:**
1. Enter SDC code that was already used
2. Attempt to submit review

**Expected Result:**
- Error message: "SDC already used"
- Cannot submit review
- SDC status: "used"

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-REVIEW-005: View Verified Reviews
**Priority:** Medium
**Module:** Blockchain Review
**Preconditions:** Verified reviews exist for a product

**Test Steps:**
1. Navigate to product page
2. Scroll to reviews section
3. View reviews

**Expected Result:**
- Verified reviews displayed
- Reviews show "Verified Purchase" badge
- Reviews show blockchain transaction hash (link)
- Reviews show rating, comment, images, date
- Reviews sorted by date (newest first)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Admin Dashboard Test Cases

### TC-ADMIN-001: Approve Product
**Priority:** High
**Module:** Admin Dashboard
**Preconditions:** Pending product exists, admin logged in

**Test Steps:**
1. Navigate to admin dashboard
2. View "Products" tab
3. View pending products
4. Click "Approve" on a product
5. Confirm approval

**Expected Result:**
- Product status updated to "active"
- Product visible to buyers
- Seller notified (if notification system exists)

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-ADMIN-002: Reject Product
**Priority:** High
**Module:** Admin Dashboard
**Preconditions:** Pending product exists, admin logged in

**Test Steps:**
1. Navigate to admin dashboard
2. View pending products
3. Click "Reject" on a product
4. Confirm rejection

**Expected Result:**
- Product status updated to "inactive"
- Product not visible to buyers
- Seller notified

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

### TC-ADMIN-003: View Platform Analytics
**Priority:** Medium
**Module:** Admin Dashboard
**Preconditions:** Admin logged in, data exists

**Test Steps:**
1. Navigate to admin dashboard
2. Click "Analytics" tab
3. View charts and statistics

**Expected Result:**
- Revenue charts displayed
- Sales statistics shown
- Category distribution visible
- User growth statistics shown

**Actual Result:** _To be filled_
**Status:** _To be filled_

---

## Test Execution Summary

| Module | Total Test Cases | Passed | Failed | Blocked | Not Executed |
|--------|------------------|--------|--------|---------|--------------|
| Authentication | 7 | _ | _ | _ | _ |
| Product Management | 7 | _ | _ | _ | _ |
| Shopping Cart | 5 | _ | _ | _ | _ |
| Checkout | 3 | _ | _ | _ | _ |
| Payment | 3 | _ | _ | _ | _ |
| Order Management | 3 | _ | _ | _ | _ |
| Blockchain Review | 5 | _ | _ | _ | _ |
| Admin Dashboard | 3 | _ | _ | _ | _ |
| **Total** | **36** | **0** | **0** | **0** | **36** |

---

**Document Status:** Draft
**Version History:**
- v1.0 (2024) - Initial Test Cases

