# eSewa Payment Gateway Integration Guide

## Overview

This document covers the complete eSewa payment gateway integration in the BUYSEWA e-commerce platform. Users can now pay directly from product pages without needing to add items to cart first.

## Features

- **Quick Buy with eSewa**: Pay directly from product page
- **Cart Checkout with eSewa**: Add multiple items and pay via eSewa
- **HMAC Signature Verification**: Secure payment verification using SHA256
- **Automatic Order Creation**: Orders are created before payment initiation
- **Success/Failure Handling**: Proper redirect flows after payment completion

## Test Credentials

```
eSewa ID: 9806800001/2/3/4/5
Password: Nepal@123
MPIN: 1122
Token: 123456
Secret Key: 8gBm/:&EnhH.1/q
```

## Frontend Implementation

### 1. Quick Buy Component (`src/components/QuickBuyEsewa.tsx`)

The `QuickBuyEsewa` component provides a "Buy Now with eSewa" button that:
- Opens a dialog with order summary
- Collects shipping information (name, email, phone, address)
- Calculates total with tax and delivery charges
- Submits payment form to eSewa

**Usage in ProductPage:**
```tsx
<QuickBuyEsewa
  product={{
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image
  }}
/>
```

### 2. Quick Pay Flow

```
User Views Product
        ↓
Clicks "Buy Now with eSewa"
        ↓
Dialog Opens (Shipping Info)
        ↓
User Fills Information & Clicks Pay
        ↓
Frontend Calls /api/esewa/initiate
        ↓
Backend Returns Form Data + Signature
        ↓
Form Auto-Submits to eSewa
        ↓
User Completes Payment on eSewa
        ↓
eSewa Redirects to /api/esewa/verify
        ↓
Payment Verified
        ↓
Redirects to /payment/success
```

### 3. Payment Utilities (`src/utils/esewaPayment.ts`)

Helper functions for payment operations:

```typescript
// Generate unique transaction ID
generateTransactionUuid() -> string

// Calculate amounts
calculateTaxAmount(amount) -> number
calculateDeliveryCharge(amount) -> number
formatAmountForEsewa(amount) -> number

// Form submission
submitEsewaPaymentForm(formUrl, formData) -> void

// Response handling
extractPaymentStatus(searchParams) -> PaymentStatus
validateEsewaResponse(data) -> boolean
```

## Backend Implementation

### 1. eSewa Routes (`review-backend/routes/esewaRoutes.js`)

#### POST /api/esewa/initiate
Initiates eSewa payment and returns form data with signature.

**Request:**
```json
{
  "amount": 5000,
  "orderId": "ORDER-123",
  "productName": "Wireless Headphones",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9800000000"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formUrl": "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    "formData": {
      "transaction_uuid": "BUYSEWA-1234567890-abc123",
      "amount": "5000",
      "tax_amount": "500",
      "total_amount": "5500",
      "product_code": "EPAYTEST",
      "signature": "base64_signature_here",
      ...
    },
    "orderId": "ORDER-123",
    "transaction_uuid": "BUYSEWA-1234567890-abc123"
  }
}
```

#### GET /api/esewa/verify
Callback endpoint for successful payments. eSewa redirects here with payment data.

**Parameters:**
- `data` (query param): Base64 encoded JSON with payment status

**Response:** Redirects to frontend success page

#### GET /api/esewa/failure
Callback endpoint for failed payments.

**Response:** Redirects to frontend failure page

#### GET /api/esewa/status
Check payment status (optional server-side verification).

### 2. Signature Verification (`review-backend/utils/signature.js`)

```javascript
// Generate signature for payment initiation
createEsewaSignature({
  amount,
  tax_amount,
  transaction_uuid,
  product_code
}) -> string

// Verify signature from eSewa callback
verifyEsewaSignature(data) -> boolean
```

## Payment Flow Details

### Step 1: Payment Initiation
User clicks "Buy Now with eSewa" on product page:
1. Dialog opens with order summary
2. User enters shipping details
3. Frontend calls `/api/esewa/initiate`
4. Backend creates signature: `SHA256(HMAC(message, secret_key))`
5. Backend returns form data

### Step 2: eSewa Redirect
User submits form to eSewa:
1. Hidden form with POST method
2. Fields: `transaction_uuid`, `amount`, `tax_amount`, `total_amount`, `product_code`, `signature`
3. User completes payment on eSewa

### Step 3: Payment Verification
eSewa redirects to `/api/esewa/verify`:
1. Backend receives base64 encoded data
2. Decodes and extracts fields
3. Regenerates signature using secret key
4. Compares signatures to verify authenticity
5. If valid, redirects to success page
6. If invalid, returns error

## Environment Configuration

Set these environment variables in `.env`:

```bash
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_ENVIRONMENT=sandbox  # 'sandbox' or 'production'
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Production URLs
- **Sandbox Form:** `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- **Sandbox Verify:** `https://uat.esewa.com.np/api/epay/transaction/status`
- **Production Form:** `https://epay.esewa.com.np/api/epay/main/v2/form`
- **Production Verify:** `https://esewa.com.np/api/epay/transaction/status`

## Payment Amount Calculation

```
Product Price: NPR 5000
Tax (10%): NPR 500
Delivery (if < 10000): NPR 199
Total: NPR 5699
```

## Security Considerations

1. **HMAC Verification**: All payments are verified using HMAC-SHA256
2. **Server-Side Signature**: Signatures generated server-side, not frontend
3. **Base64 Encoding**: Payment data encoded before transmission
4. **Transaction UUID**: Unique UUID prevents duplicate transactions
5. **Environment Variables**: Secret key stored in environment, not in code

## Testing the Integration

### Test Payment Flow
1. Start backend: `npm run start` (in review-backend)
2. Start frontend: `npm run dev`
3. Navigate to any product
4. Click "Buy Now with eSewa"
5. Fill shipping details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9800000000
   - Address: Test Address
6. Click "Pay Now"
7. On eSewa payment page, use test credentials:
   - ID: 9806800001
   - Password: Nepal@123
   - MPIN: 1122
8. Complete payment
9. Should redirect to success page

### Verify Payment Status
Check `/api/esewa/status` endpoint with transaction_uuid and amount.

## Troubleshooting

### "Invalid Signature" Error
- Verify secret key matches eSewa credentials
- Check that tax_amount and product_code are included
- Ensure HMAC uses SHA256 algorithm

### "Payment data missing" Error
- Check that success_url is correct
- Verify eSewa can reach backend from their servers
- Check BACKEND_URL environment variable

### Payment not redirecting to success page
- Check FRONTEND_URL environment variable
- Verify frontend route `/payment/success` exists
- Check browser console for CORS errors

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/esewa/initiate` | POST | Initiate payment |
| `/api/esewa/verify` | GET | Verify successful payment |
| `/api/esewa/failure` | GET | Handle failed payment |
| `/api/esewa/status` | GET | Check payment status |
| `/api/esewa/test` | GET | Test if routes working |

## Files Modified/Created

- ✅ `src/components/QuickBuyEsewa.tsx` - Quick buy dialog component
- ✅ `src/components/ProductPage.tsx` - Added Quick Buy button
- ✅ `src/utils/esewaPayment.ts` - Payment utilities
- ✅ `review-backend/routes/esewaRoutes.js` - Backend routes
- ✅ `review-backend/utils/signature.js` - Signature verification
- ✅ `src/pages/PaymentSuccess.tsx` - Success page
- ✅ `src/pages/PaymentFailure.tsx` - Failure page

## Next Steps

1. Test with real eSewa sandbox account
2. Implement order tracking after payment
3. Send payment confirmation emails
4. Add payment history in buyer dashboard
5. Implement refund processing
6. Switch to production credentials when live

## Support

For issues or questions:
1. Check backend logs: `review-backend/logs/`
2. Check browser console for errors
3. Verify environment variables
4. Test eSewa connectivity
5. Review payment request/response in network tab
