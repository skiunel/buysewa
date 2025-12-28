# Use Cases
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024

---

## Use Case Diagram Overview

```

   Buyer     

       
        Browse Products
        Add to Cart
        Checkout
        Pay with eSewa
        View Orders
        Submit Review (with SDC)
        View Reviews


   Seller    

       
        Create Product
        Manage Products
        View Orders
        View Sales Analytics


    Admin    

       
        Approve Products
        Manage Orders
        Verify Payments
        Manage Users
        View Analytics
```

---

## Use Case 1: User Registration

**Actor:** New User
**Preconditions:** User is not logged in
**Postconditions:** User account created, user logged in

### Main Flow:
1. User navigates to registration page
2. User enters name, email, password, and selects role
3. System validates inputs (email format, password length ≥ 4)
4. System checks if email already exists
5. System creates user account
6. System hashes password with bcrypt
7. System generates JWT token
8. System stores token in localStorage
9. User is redirected to homepage

### Alternative Flows:
- **3a.** Invalid email format → Display error message
- **3b.** Password too short → Display error message
- **4a.** Email already exists → Display error message

---

## Use Case 2: User Login

**Actor:** Registered User
**Preconditions:** User has an account
**Postconditions:** User is authenticated, session created

### Main Flow:
1. User navigates to login page
2. User enters email and password
3. System validates credentials
4. System compares password hash
5. System generates JWT token
6. System stores token in localStorage
7. User is redirected to appropriate dashboard

### Alternative Flows:
- **3a.** Invalid credentials → Display error message
- **3b.** Account locked → Display account locked message

---

## Use Case 3: Browse Products

**Actor:** Buyer
**Preconditions:** User is on homepage or product listing page
**Postconditions:** Products displayed

### Main Flow:
1. User navigates to product listing
2. System fetches products from database
3. User can filter by category
4. User can search by name
5. User can filter by price range
6. System displays filtered products
7. User clicks on a product to view details

### Alternative Flows:
- **2a.** No products found → Display "No products" message
- **4a.** Search returns no results → Display "No results" message

---

## Use Case 4: Add Product to Cart

**Actor:** Buyer
**Preconditions:** User is viewing a product, product is in stock
**Postconditions:** Product added to cart

### Main Flow:
1. User clicks "Add to Cart" button
2. System checks if product is in stock
3. System adds product to cart (localStorage)
4. System updates cart count badge
5. System shows success message
6. User can continue shopping or go to cart

### Alternative Flows:
- **2a.** Product out of stock → Display "Out of stock" message
- **2b.** Product already in cart → Update quantity

---

## Use Case 5: Checkout Process

**Actor:** Buyer
**Preconditions:** User has items in cart, user is logged in
**Postconditions:** Order created, payment initiated

### Main Flow:
1. User clicks "Checkout" button
2. System validates cart is not empty
3. User enters shipping address
4. System validates shipping address fields
5. User selects payment method (eSewa)
6. System creates order in database
7. System generates unique order number
8. System initiates payment gateway
9. User is redirected to eSewa payment page

### Alternative Flows:
- **2a.** Cart is empty → Display error, redirect to cart
- **4a.** Invalid address → Display validation errors
- **6a.** Order creation fails → Display error, retry

---

## Use Case 6: eSewa Payment

**Actor:** Buyer
**Preconditions:** Order created, user redirected to eSewa
**Postconditions:** Payment completed, order confirmed

### Main Flow:
1. User is on eSewa payment page
2. User enters eSewa credentials
3. User confirms payment
4. eSewa processes payment
5. eSewa redirects back with payment response
6. System verifies HMAC signature
7. System updates order payment status
8. System updates order status to "processing"
9. User sees payment success page

### Alternative Flows:
- **6a.** Invalid signature → Payment verification fails
- **6b.** Payment failed → User sees failure page, order status updated

---

## Use Case 7: SDC Generation

**Actor:** System (Admin updates order status)
**Preconditions:** Order status changed to "delivered"
**Postconditions:** SDC code generated and registered

### Main Flow:
1. Admin updates order status to "delivered"
2. System generates unique SDC code for each product
3. System hashes SDC code (SHA-256)
4. System stores SDC in database
5. System registers SDC hash on blockchain
6. System stores blockchain transaction hash
7. SDC code is displayed in buyer dashboard

### Alternative Flows:
- **5a.** Blockchain registration fails → Retry mechanism
- **5b.** SDC already exists → Generate new SDC

---

## Use Case 8: Submit Verified Review

**Actor:** Buyer
**Preconditions:** Buyer has received SDC code, order is delivered
**Postconditions:** Review submitted to blockchain

### Main Flow:
1. Buyer navigates to review submission page
2. Buyer enters SDC code
3. System verifies SDC code format
4. System hashes SDC code
5. System verifies SDC on blockchain
6. System checks if SDC is already used
7. Buyer enters rating (1-5 stars)
8. Buyer writes comment (max 500 chars)
9. Buyer optionally uploads images
10. System stores review content on IPFS
11. System receives IPFS hash
12. Buyer connects MetaMask wallet
13. System submits review to blockchain smart contract
14. System receives blockchain transaction hash
15. System stores review in database
16. Review is displayed on product page with "Verified" badge

### Alternative Flows:
- **3a.** Invalid SDC format → Display error
- **5a.** SDC not found on blockchain → Display error
- **6a.** SDC already used → Display error
- **12a.** Wallet not connected → Prompt to connect
- **13a.** Blockchain transaction fails → Display error, retry

---

## Use Case 9: Create Product (Seller)

**Actor:** Seller
**Preconditions:** Seller is logged in
**Postconditions:** Product created (pending approval)

### Main Flow:
1. Seller navigates to seller dashboard
2. Seller clicks "Add Product"
3. Seller enters product details (name, description, price, category)
4. Seller uploads product images
5. Seller sets stock quantity
6. System validates required fields
7. System creates product with "pending" status
8. Product appears in seller's product list
9. Admin is notified of new product

### Alternative Flows:
- **6a.** Missing required fields → Display validation errors
- **6b.** Invalid price → Display error
- **6c.** No images uploaded → Display warning

---

## Use Case 10: Approve Product (Admin)

**Actor:** Admin
**Preconditions:** Product is pending approval
**Postconditions:** Product status updated to "active"

### Main Flow:
1. Admin navigates to admin dashboard
2. Admin views pending products
3. Admin reviews product details
4. Admin clicks "Approve" button
5. System updates product status to "active"
6. Product is now visible to buyers
7. Seller is notified of approval

### Alternative Flows:
- **4a.** Admin clicks "Reject" → Product status set to "inactive", seller notified

---

## Use Case 11: Update Order Status

**Actor:** Admin/Seller
**Preconditions:** Order exists
**Postconditions:** Order status updated

### Main Flow:
1. Admin/Seller navigates to orders page
2. Admin/Seller selects an order
3. Admin/Seller views order details
4. Admin/Seller selects new status (processing → shipped → delivered)
5. System updates order status
6. If status is "delivered", system generates SDC codes
7. Buyer is notified of status update

### Alternative Flows:
- **6a.** SDC generation fails → Log error, retry

---

## Use Case 12: View Order History

**Actor:** Buyer
**Preconditions:** Buyer is logged in
**Postconditions:** Order history displayed

### Main Flow:
1. Buyer navigates to buyer dashboard
2. Buyer clicks "My Orders" tab
3. System fetches buyer's orders from database
4. System displays orders with status
5. Buyer can view order details
6. If order is delivered, SDC codes are displayed
7. Buyer can click "Submit Review" for delivered orders

### Alternative Flows:
- **3a.** No orders found → Display "No orders" message

---

## Use Case 13: View Verified Reviews

**Actor:** Buyer
**Preconditions:** User is viewing a product
**Postconditions:** Verified reviews displayed

### Main Flow:
1. Buyer navigates to product page
2. System fetches product reviews from database
3. System verifies reviews against blockchain
4. System displays verified reviews
5. Reviews show "Verified Purchase" badge
6. Reviews show blockchain transaction hash (link)
7. Buyer can see rating, comment, images, date

### Alternative Flows:
- **3a.** No reviews found → Display "No reviews" message

---

## Use Case 14: Payment Verification (Admin)

**Actor:** Admin
**Preconditions:** Payment callback received
**Postconditions:** Payment verified, order confirmed

### Main Flow:
1. eSewa sends payment callback to system
2. System receives payment response and HMAC signature
3. System verifies HMAC signature
4. System checks payment status
5. Admin reviews payment in admin dashboard
6. Admin clicks "Verify Payment"
7. System updates order payment status to "completed"
8. Order status updated to "processing"
9. Buyer receives confirmation

### Alternative Flows:
- **3a.** Invalid signature → Payment marked as "failed"
- **4a.** Payment status is "failed" → Order payment status updated accordingly

---

## Use Case Summary

| Use Case ID | Name | Actor | Priority |
|-------------|------|-------|----------|
| UC-001 | User Registration | New User | High |
| UC-002 | User Login | Registered User | High |
| UC-003 | Browse Products | Buyer | High |
| UC-004 | Add Product to Cart | Buyer | High |
| UC-005 | Checkout Process | Buyer | High |
| UC-006 | eSewa Payment | Buyer | High |
| UC-007 | SDC Generation | System | High |
| UC-008 | Submit Verified Review | Buyer | High |
| UC-009 | Create Product | Seller | High |
| UC-010 | Approve Product | Admin | High |
| UC-011 | Update Order Status | Admin/Seller | High |
| UC-012 | View Order History | Buyer | Medium |
| UC-013 | View Verified Reviews | Buyer | High |
| UC-014 | Payment Verification | Admin | High |

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial Use Cases

