# User Manual
## BUYSEWA E-commerce Platform

**Version:** 1.0  
**Date:** 2024

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Buyer Guide](#buyer-guide)
3. [Seller Guide](#seller-guide)
4. [Admin Guide](#admin-guide)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## Getting Started

### Accessing the Platform

1. Open your web browser
2. Navigate to: `http://localhost:5173` (development) or `https://yourdomain.com` (production)
3. The homepage will load with featured products

### System Requirements

- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet:** Stable internet connection
- **JavaScript:** Must be enabled
- **Wallet:** MetaMask extension (for blockchain features)

---

## Buyer Guide

### Creating an Account

1. Click **"Sign Up"** on the homepage
2. Fill in the registration form:
   - **Name:** Your full name
   - **Email:** Your email address
   - **Password:** At least 4 characters
   - **Confirm Password:** Re-enter your password
   - **Role:** Select "Buyer"
3. Click **"Create Account"**
4. You will be automatically logged in

### Logging In

1. Click **"Login"** on the homepage
2. Enter your email and password
3. Click **"Login"**
4. You will be redirected to your dashboard

### Browsing Products

1. Click **"Products"** in the navigation menu
2. Use filters to find products:
   - **Category:** Filter by product category
   - **Search:** Search by product name
   - **Price Range:** Set minimum and maximum price
3. Click on a product to view details

### Adding to Cart

1. View a product page
2. Select quantity (if applicable)
3. Click **"Add to Cart"**
4. A confirmation message will appear
5. Cart icon in header shows item count

### Viewing Cart

1. Click the **cart icon** in the header
2. Review your items:
   - Product names and prices
   - Quantities
   - Subtotal and total
3. Update quantities or remove items as needed

### Checkout Process

1. Click **"Checkout"** from the cart page
2. Enter shipping address:
   - First Name, Last Name
   - Email, Phone
   - Address, City, Postal Code
   - Country (default: Nepal)
3. Select payment method: **eSewa**
4. Review order summary
5. Click **"Place Order"**
6. You will be redirected to eSewa payment page

### Completing Payment

1. On eSewa payment page:
   - Enter your eSewa credentials
   - Confirm payment amount
   - Complete payment
2. After payment:
   - You will be redirected back
   - Order confirmation page will appear
   - Order number will be displayed

### Viewing Orders

1. Click **"Dashboard"** in the navigation
2. Click **"My Orders"** tab
3. View your order history:
   - Order numbers
   - Order dates
   - Order status (Processing, Shipped, Delivered)
   - Order totals
4. Click on an order to view details

### Submitting Reviews

**Prerequisites:**
- Order must be delivered
- You must have received SDC (Secure Digital Code)

**Steps:**
1. Go to **Dashboard** → **My Orders**
2. Find a delivered order
3. Copy the SDC code for the product
4. Navigate to the product page
5. Click **"Submit Review"**
6. Enter SDC code and click **"Verify SDC"**
7. Once verified:
   - Select rating (1-5 stars)
   - Write your comment (max 500 characters)
   - Upload images (optional)
8. Connect your MetaMask wallet
9. Click **"Submit Review"**
10. Review will be submitted to blockchain
11. You will see a "Verified Purchase" badge on your review

### Managing Wishlist

1. On any product page, click **"Add to Wishlist"**
2. View wishlist:
   - Go to **Dashboard** → **Wishlist** tab
   - See all saved products
3. Remove from wishlist:
   - Click **"Remove"** on any item

---

## Seller Guide

### Creating Seller Account

1. Register with role **"Seller"**
2. Wait for admin approval (if required)
3. Once approved, access seller dashboard

### Adding Products

1. Go to **Seller Dashboard**
2. Click **"Add Product"**
3. Fill in product details:
   - **Name:** Product name
   - **Description:** Detailed description
   - **Price:** Product price (NPR)
   - **Category:** Select category
   - **Images:** Upload product images
   - **Stock:** Available quantity
   - **Specifications:** Additional details
4. Click **"Submit"**
5. Product will be created with "Pending" status
6. Wait for admin approval

### Managing Products

1. Go to **Seller Dashboard** → **Products** tab
2. View all your products:
   - Product status (Pending, Active, Inactive)
   - Stock levels
   - Sales statistics
3. Edit product:
   - Click **"Edit"** on a product
   - Update details
   - Click **"Save"**
4. Delete product:
   - Click **"Delete"** (confirmation required)

### Managing Orders

1. Go to **Seller Dashboard** → **Orders** tab
2. View orders for your products:
   - Order numbers
   - Customer information
   - Order status
   - Payment status
3. Update order status:
   - Click on an order
   - Select new status:
     - **Processing:** Order received
     - **Shipped:** Order shipped
     - **Delivered:** Order delivered (generates SDC codes)

### Viewing Sales Analytics

1. Go to **Seller Dashboard** → **Analytics** tab
2. View statistics:
   - Total sales revenue
   - Sales by product
   - Order count
   - Sales trends (charts)
3. Filter by date range

---

## Admin Guide

### Admin Access

- Admin accounts are created manually or via database
- Admin has full platform access

### User Management

1. Go to **Admin Dashboard** → **Users** tab
2. View all users:
   - User names and emails
   - User roles
   - Registration dates
3. Manage users:
   - View user details
   - Change user roles (if needed)
   - Ban/unban users

### Product Moderation

1. Go to **Admin Dashboard** → **Products** tab
2. View pending products:
   - Product details
   - Seller information
   - Product images
3. Approve product:
   - Click **"Approve"**
   - Product status changes to "Active"
   - Product becomes visible to buyers
4. Reject product:
   - Click **"Reject"**
   - Product status changes to "Inactive"
   - Seller is notified

### Order Management

1. Go to **Admin Dashboard** → **Orders** tab
2. View all orders:
   - Order numbers
   - Customer information
   - Order status
   - Payment status
3. Update order status:
   - Click on an order
   - Select new status
   - When status is "Delivered", SDC codes are automatically generated

### Payment Verification

1. Go to **Admin Dashboard** → **Payments"** tab
2. View pending payments:
   - Order information
   - Payment details
   - Payment signatures
3. Verify payment:
   - Review payment details
   - Click **"Verify Payment"**
   - Payment status updates to "Completed"
   - Order status updates accordingly

### Platform Analytics

1. Go to **Admin Dashboard** → **Analytics"** tab
2. View platform statistics:
   - Total revenue
   - Sales by category
   - User growth
   - Order statistics
   - Product statistics
3. Charts and graphs display trends

---

## Troubleshooting

### Login Issues

**Problem:** Cannot log in  
**Solutions:**
- Check email and password are correct
- Ensure account exists
- Clear browser cache and cookies
- Try resetting password (if available)

### Payment Issues

**Problem:** Payment not processing  
**Solutions:**
- Check internet connection
- Verify eSewa account has sufficient balance
- Try again after a few minutes
- Contact support if issue persists

### Review Submission Issues

**Problem:** Cannot submit review  
**Solutions:**
- Verify SDC code is correct
- Ensure order is delivered
- Check SDC code hasn't been used
- Ensure MetaMask wallet is connected
- Verify wallet has sufficient gas fees

### Cart Issues

**Problem:** Items not adding to cart  
**Solutions:**
- Refresh the page
- Clear browser cache
- Check if product is in stock
- Try logging out and back in

### Page Loading Issues

**Problem:** Pages not loading  
**Solutions:**
- Check internet connection
- Refresh the page
- Clear browser cache
- Try a different browser
- Check if site is under maintenance

---

## FAQ

### General Questions

**Q: How do I create an account?**  
A: Click "Sign Up" on the homepage and fill in the registration form.

**Q: What is the minimum password length?**  
A: Passwords must be at least 4 characters.

**Q: Can I change my password?**  
A: Password reset functionality is planned for future releases.

**Q: How do I contact customer support?**  
A: Use the chat widget on the website or email support@buysewa.com.

### Product Questions

**Q: How do I search for products?**  
A: Use the search bar on the products page or use category filters.

**Q: Can I see product reviews before buying?**  
A: Yes, product pages display verified reviews from other buyers.

**Q: What if a product is out of stock?**  
A: Out-of-stock products will show "Out of Stock" and cannot be added to cart.

### Order Questions

**Q: How do I track my order?**  
A: Go to Dashboard → My Orders and click on your order to see status.

**Q: Can I cancel an order?**  
A: Contact support to cancel orders. Cancellation depends on order status.

**Q: What payment methods are accepted?**  
A: Currently, eSewa payment gateway is supported. More methods coming soon.

### Review Questions

**Q: What is an SDC code?**  
A: SDC (Secure Digital Code) is a unique code generated after order delivery, used to verify you purchased the product.

**Q: Why do I need to connect MetaMask?**  
A: MetaMask is required to submit reviews to the blockchain for verification.

**Q: Can I edit my review after submitting?**  
A: Reviews are stored on blockchain and cannot be edited. Contact support for assistance.

### Seller Questions

**Q: How do I become a seller?**  
A: Register with role "Seller" and wait for admin approval.

**Q: How long does product approval take?**  
A: Product approval typically takes 24-48 hours.

**Q: Can I set my own prices?**  
A: Yes, sellers set their own product prices.

### Technical Questions

**Q: Which browsers are supported?**  
A: Chrome, Firefox, Safari, and Edge (latest versions).

**Q: Do I need to install any software?**  
A: No, the platform works in your web browser. MetaMask extension is needed for blockchain features.

**Q: Is my data secure?**  
A: Yes, all data is encrypted and securely stored. Passwords are hashed and never stored in plain text.

---

## Support

For additional help:
- **Email:** support@buysewa.com
- **Chat:** Use the chat widget on the website
- **Documentation:** https://docs.buysewa.com

---

**Document Status:** Approved  
**Version History:**
- v1.0 (2024) - Initial User Manual

