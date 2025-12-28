# eSewa Integration Fix Guide

## Issues Fixed

1. **Form Submission Logic** - Fixed form creation and submission in PaymentGateway.tsx
2. **Form Data Structure** - Fixed how formData and formUrl are handled
3. **Error Handling** - Added better error logging

## Testing Steps

1. **Start Backend Server:**
```bash
cd review-backend
node server.js
```

2. **Test eSewa Endpoint:**
```bash
curl -X POST http://localhost:5000/api/esewa/initiate \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"orderId":"TEST-123"}'
```

3. **Expected Response:**
```json
{
  "success": true,
  "message": "eSewa payment form data generated",
  "data": {
    "formUrl": "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    "formData": {
      "transaction_uuid": "...",
      "amount": "1000",
      "tax_amount": "100",
      "total_amount": "1100",
      "product_code": "EPAYTEST",
      "signature": "...",
      ...
    }
  }
}
```

## How It Works

1. User clicks "Pay with eSewa" in PaymentGateway
2. Frontend calls `/api/esewa/initiate` with amount and orderId
3. Backend generates:
   - Transaction UUID
   - Tax amount (10% of total)
   - HMAC SHA256 signature
   - Form data with all required fields
4. Frontend creates a hidden form and submits to eSewa
5. User completes payment on eSewa's page
6. eSewa redirects to `/api/esewa/verify` with payment data
7. Backend verifies signature and redirects to success page

## Troubleshooting

### Issue: "Route not found"
- **Solution:** Restart the backend server to load new routes

### Issue: Form not submitting
- **Check:** Browser console for JavaScript errors
- **Check:** Network tab to see if `/api/esewa/initiate` is called
- **Check:** Response structure matches expected format

### Issue: Signature verification fails
- **Check:** Secret key matches in both backend and eSewa account
- **Check:** Signed field names match exactly
- **Check:** Amount calculation (amount + tax_amount)

## Test Credentials

- **eSewa ID:** 9806800001/2/3/4/5
- **Password:** Nepal@123
- **MPIN:** 1122
- **Token:** 123456
- **Secret Key:** 8gBm/:&EnhH.1/q

## Environment Variables

Add to `review-backend/.env`:
```
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_ENVIRONMENT=sandbox
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```




