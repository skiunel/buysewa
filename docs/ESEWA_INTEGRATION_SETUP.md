# eSewa Integration - Complete Setup & Testing Guide

## System Overview

Your BUYSEWA e-commerce platform now includes a **complete eSewa payment integration** that allows users to:
- Purchase products directly from product pages
- Pay via eSewa without adding items to cart
- Receive secure payment verification via HMAC signatures
- Get automatic redirects to success/failure pages

## Installation & Setup

### Prerequisites

```bash
Node.js >= 14.0.0
npm >= 6.0.0
Git
```

### Step 1: Clone Repository

```bash
git clone https://github.com/skiunel/buysewa.git
cd buysewa
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd review-backend
npm install
cd ..
```

### Step 3: Configure Environment Variables

**Backend Configuration** (`review-backend/.env`):

```bash
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/buysewa
DB_NAME=buysewa

# eSewa Configuration
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_ENVIRONMENT=sandbox

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Frontend Configuration** (`vite.config.ts`):

Environment is auto-detected from Vite. To override:

```bash
# Create .env file in root
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173
```

### Step 4: Verify Installation

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Test backend connectivity
curl http://localhost:5000/api/esewa/test

# Expected response:
# {
#   "success": true,
#   "message": "eSewa routes are working!",
#   "environment": "sandbox"
# }
```

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd review-backend
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
eSewa routes initialized
```

### Terminal 2: Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
VITE v4.x.x
Local: http://localhost:5173/
```

### Terminal 3 (Optional): Run Tests

```bash
npm test
```

## Complete Payment Flow Test

### Test Case 1: Successful Payment

**Steps:**

1. **Open Application**
   ```
   Browser: http://localhost:5173
   ```

2. **Navigate to Product**
   ```
   - Click on any product
   - Scroll to see "Buy Now with eSewa" button (green button)
   ```

3. **Open Payment Dialog**
   ```
   - Click "Buy Now with eSewa"
   - Dialog appears with order summary
   - See: Price, Tax (10%), Delivery Charge, Total
   ```

4. **Fill Shipping Information**
   ```
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 9800000000
   - Address: Thamel, Kathmandu
   - City: Kathmandu
   ```

5. **Submit Payment Form**
   ```
   - Click "Pay NPR [AMOUNT]" button
   - Button shows loading spinner
   - Dialog closes automatically
   ```

6. **Check Backend Logs**
   ```
   - Look for: "eSewa payment form data generated"
   - Verify transaction_uuid logged
   - Check signature was created
   ```

7. **Complete eSewa Payment**
   ```
   - eSewa login page appears
   - Username: 9806800001
   - Password: Nepal@123
   - MPIN: 1122
   - Token: 123456
   - Click Authorize/Confirm
   ```

8. **Verify Success Page**
   ```
   - Redirected to /payment/success
   - Shows: Order Number, Transaction ID
   - Green checkmark icon
   - Buttons: "View My Orders", "Continue Shopping"
   ```

9. **Check Payment Verification**
   ```
   - Backend logs show: "Payment verified successfully"
   - Order status updated to PAID
   - Transaction data stored
   ```

### Test Case 2: Form Validation

**Invalid Email Test:**
1. Open Quick Buy dialog
2. Enter invalid email: "notanemail"
3. Click "Pay Now"
4. See error: "Please enter a valid email address"
5. Dialog stays open
6. Fix email and retry

**Invalid Phone Test:**
1. Open Quick Buy dialog
2. Enter phone with letters: "abc123def"
3. Click "Pay Now"
4. See error: "Please enter a valid 10-digit phone number"
5. Enter valid phone and retry

**Missing Fields Test:**
1. Open Quick Buy dialog
2. Leave first name empty
3. Click "Pay Now"
4. See error: "Please fill in all required fields"
5. Fill all fields and retry

### Test Case 3: Payment Failure

**Steps:**

1. Open Quick Buy dialog
2. Fill form with valid data
3. Click "Pay Now"
4. On eSewa page, click "Cancel" or "Decline"
5. Redirected to /payment/failure
6. Shows error icon and message
7. Can click "Try Again" to retry

### Test Case 4: Network Error

**Steps:**

1. Stop backend server
2. Open Quick Buy dialog
3. Fill form and click "Pay Now"
4. See error: "Failed to initiate payment"
5. Check browser console for error details
6. Start backend and retry

## Monitoring & Debugging

### Browser Developer Tools

**Network Tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Fill and submit Quick Buy form
4. Look for POST to `/api/esewa/initiate`
5. Check request body:
   ```json
   {
     "amount": 5000,
     "orderId": "QUICK-BUY-1-1704...",
     "productName": "Product Name",
     "customerName": "John Doe",
     "customerEmail": "john@example.com",
     "customerPhone": "9800000000"
   }
   ```
6. Check response:
   ```json
   {
     "success": true,
     "data": {
       "formUrl": "https://rc-epay.esewa.com.np/...",
       "formData": { ... }
     }
   }
   ```

**Console Tab:**
1. Any errors logged
2. Payment initiation messages
3. Form submission logs
4. Signature generation status

### Backend Logs

**Start backend with debug mode:**
```bash
DEBUG=buysewa:* npm start
```

**Look for these log messages:**
```
INFO: POST /api/esewa/initiate - Payment initiation received
DEBUG: Transaction UUID: BUYSEWA-1704...
DEBUG: Tax amount calculated: 500
DEBUG: Signature generated: base64...
DEBUG: Payment form data sent to frontend

INFO: GET /api/esewa/verify - Payment verification started
DEBUG: Base64 data decoded
DEBUG: Signature verified successfully
INFO: Order status updated to PAID
```

### Database Inspection

**MongoDB Compass:**
1. Connect to MongoDB
2. Database: buysewa
3. Collections:
   - orders
   - payments
   - transactions
4. Find recent payment:
   ```javascript
   db.orders.findOne({ 
     paymentMethod: "esewa",
     createdAt: { $gte: new Date(Date.now() - 3600000) }
   })
   ```

## API Testing with cURL

### Test Payment Initiation

```bash
curl -X POST http://localhost:5000/api/esewa/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "orderId": "TEST-ORDER-001",
    "productName": "Test Product",
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "9800000000"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "formUrl": "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    "formData": { ... },
    "transaction_uuid": "BUYSEWA-..."
  }
}
```

### Test eSewa Health Check

```bash
curl http://localhost:5000/api/esewa/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "eSewa routes are working!",
  "environment": "sandbox",
  "formUrl": "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
}
```

## Production Deployment Checklist

### Before Going Live

- [ ] Obtain production eSewa merchant credentials
- [ ] Update ESEWA_SECRET_KEY in environment
- [ ] Update ESEWA_PRODUCT_CODE to production value
- [ ] Set ESEWA_ENVIRONMENT=production
- [ ] Update BACKEND_URL to production domain
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable HTTPS for all URLs
- [ ] Set NODE_ENV=production
- [ ] Test full payment flow on production
- [ ] Set up monitoring and alerting
- [ ] Create database backups
- [ ] Document rollback procedures

### Production Environment Variables

```bash
# Production eSewa
ESEWA_SECRET_KEY=your_production_secret_key
ESEWA_PRODUCT_CODE=your_merchant_code
ESEWA_ENVIRONMENT=production

# Production URLs (HTTPS)
BACKEND_URL=https://api.buysewa.com.np
FRONTEND_URL=https://buysewa.com.np

# Database
MONGODB_URI=mongodb+srv://prod_user:prod_password@prod_cluster.mongodb.net/buysewa_prod

# Security
NODE_ENV=production
SESSION_SECRET=very_long_random_secret_key_here
CORS_ORIGIN=https://buysewa.com.np
```

## Troubleshooting Guide

### Issue: "Cannot GET /api/esewa/test"

**Solution:**
1. Verify backend is running: `netstat -tlnp | grep 5000`
2. Check logs for startup errors
3. Verify routes are registered
4. Restart backend: `npm start`

### Issue: "CORS error: Access denied"

**Solution:**
1. Check BACKEND_URL matches actual server URL
2. Add CORS headers to backend
3. Verify frontend VITE_API_BASE_URL is correct
4. Check browser console for origin mismatch

### Issue: "Invalid Signature"

**Solution:**
1. Verify ESEWA_SECRET_KEY matches eSewa account
2. Check signature generation code
3. Review backend logs for message construction
4. Test with curl to isolate issue

### Issue: "Payment form won't submit"

**Solution:**
1. Check browser console for JavaScript errors
2. Verify form data is complete
3. Check that eSewa servers are reachable
4. Test form submission manually with curl

### Issue: "Redirects to failure page instead of success"

**Solution:**
1. Check backend logs for signature verification failure
2. Verify BACKEND_URL is reachable from eSewa servers
3. Confirm success_url is correct
4. Check that callback data is being parsed correctly

## Performance Optimization

### Caching Strategies

```javascript
// Cache form configuration
const cacheKey = `esewa_config_${productId}`;
localStorage.setItem(cacheKey, JSON.stringify(formData));

// Reuse on rapid purchases
const cached = localStorage.getItem(cacheKey);
```

### Request Optimization

```typescript
// Debounce form submission
const debouncedSubmit = debounce(handleQuickBuy, 300);

// Prevent multiple submissions
const [isSubmitting, setIsSubmitting] = useState(false);
if (isSubmitting) return;
```

### Network Optimization

```typescript
// Preload eSewa form URL
<link rel="preconnect" href="https://rc-epay.esewa.com.np" />

// Optimize image loading
<img src={product.image} loading="lazy" />
```

## Monitoring & Analytics

### Track Payment Metrics

```javascript
// Log payment events
analytics.track('payment_initiated', {
  productId: product.id,
  amount: total,
  timestamp: new Date()
});

// Log payment completion
analytics.track('payment_completed', {
  transactionId: transaction_uuid,
  orderId: orderId,
  status: 'success'
});
```

### Monitor Payment Failures

```javascript
// Log failures for debugging
logger.error('Payment failed', {
  orderId: orderId,
  reason: error.message,
  timestamp: new Date()
});
```

## Support Resources

### Documentation Files

1. **ESEWA_QUICK_START.md** - Quick implementation guide
2. **ESEWA_QUICK_PAY_GUIDE.md** - Complete API reference
3. **ESEWA_IMPLEMENTATION_DETAILS.md** - Technical deep dive
4. **ESEWA_INTEGRATION_SETUP.md** - This file

### External Resources

- eSewa Documentation: https://esewa.com.np/
- HMAC-SHA256 Reference: https://tools.ietf.org/html/rfc4868
- Payment Security: https://owasp.org/www-community/attacks/csrf
- Node.js Crypto: https://nodejs.org/api/crypto.html

### Getting Help

1. **Check Logs** - Review backend and frontend logs
2. **Network Tab** - Check API requests and responses
3. **Database** - Verify order and payment records
4. **Contact eSewa** - For merchant account issues

## Summary

Your eSewa payment integration is now complete and ready to use:

- Users can purchase directly from product pages
- Payments are verified securely with HMAC signatures
- Orders are created automatically
- Success/failure pages handle all outcomes
- Comprehensive documentation guides deployment

**Test thoroughly before going to production!**
