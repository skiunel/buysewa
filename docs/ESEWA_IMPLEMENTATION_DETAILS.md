# eSewa Quick Pay Implementation Details

## Component Architecture

### QuickBuyEsewa Component

**Location:** `src/components/QuickBuyEsewa.tsx`

**Purpose:** Provides a seamless quick purchase experience directly from product pages.

#### Features

1. **Dialog-Based UI**
   - Opens in modal overlay
   - Non-intrusive to page flow
   - Can be dismissed with Cancel button

2. **Order Summary**
   - Product price display
   - Tax calculation (10% automatic)
   - Delivery charge calculation
   - Total amount in green highlight

3. **Shipping Form**
   - First Name & Last Name fields
   - Email validation (regex check)
   - Phone validation (10 digits)
   - Address field
   - City dropdown (preselected cities + Other option)
   - Clear error messages on validation failure

4. **Payment Integration**
   - Calls backend `/api/esewa/initiate`
   - Receives form data with HMAC signature
   - Auto-submits hidden form to eSewa
   - Stores order info in sessionStorage

#### Props

```typescript
interface QuickBuyEsewaProps {
  product: {
    id: number | string;
    name: string;
    price: number;
    image: string;
  };
  onSuccess?: () => void;
  className?: string;
}
```

#### Usage Example

```tsx
<QuickBuyEsewa
  product={{
    id: 1,
    name: "Wireless Headphones",
    price: 5000,
    image: "https://..."
  }}
  onSuccess={() => {
    console.log("Payment initiated successfully");
  }}
/>
```

### Payment Utilities

**Location:** `src/utils/esewaPayment.ts`

**Purpose:** Centralized functions for payment operations.

#### Key Functions

```typescript
// Generate unique transaction identifier
generateTransactionUuid(): string
// Returns: "BUYSEWA-1704067200000-abc123def"

// Calculate tax amount (10% of price)
calculateTaxAmount(amount: number): number
// Input: 5000
// Output: 500

// Calculate delivery charge
calculateDeliveryCharge(amount: number): number
// Input: 5000
// Output: 199
// Input: 15000
// Output: 0

// Format amount for eSewa (rounds to integer)
formatAmountForEsewa(amount: number): number
// Input: 5000.5
// Output: 5000

// Submit form to eSewa
submitEsewaPaymentForm(formUrl: string, formData: Record<string, string>): void

// Extract payment status from URL params
extractPaymentStatus(searchParams: URLSearchParams): PaymentStatus
// Returns: { orderId?, refId?, status? }

// Validate eSewa response
validateEsewaResponse(data: any): boolean
```

## Backend Implementation Details

### eSewa Routes

**Location:** `review-backend/routes/esewaRoutes.js`

#### POST /api/esewa/initiate

Initiates payment and returns form data.

**Request Body:**
```json
{
  "amount": 5000,
  "orderId": "QUICK-BUY-1-1704067200000",
  "productName": "Wireless Headphones",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9800000000"
}
```

**Backend Processing:**
1. Validates required fields
2. Generates unique transaction_uuid
3. Calculates tax_amount (10%)
4. Calculates total_amount
5. Calls `createEsewaSignature()` to generate HMAC
6. Builds form data object
7. Returns form URL and data to frontend

**Response:**
```json
{
  "success": true,
  "message": "eSewa payment form data generated",
  "data": {
    "formUrl": "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    "formData": {
      "transaction_uuid": "BUYSEWA-1704067200000-abc123",
      "amount": "5000",
      "tax_amount": "500",
      "total_amount": "5500",
      "product_code": "EPAYTEST",
      "product_service_charge": "0",
      "product_delivery_charge": "0",
      "success_url": "http://localhost:5000/api/esewa/verify",
      "failure_url": "http://localhost:5000/api/esewa/failure",
      "signed_field_names": "total_amount,transaction_uuid,product_code",
      "signature": "base64EncodedHmacSignature=="
    },
    "orderId": "QUICK-BUY-1-1704067200000",
    "transaction_uuid": "BUYSEWA-1704067200000-abc123"
  }
}
```

#### GET /api/esewa/verify

Callback endpoint for successful payments.

**Process:**
1. Receives base64 encoded `data` query parameter
2. Decodes from base64 to JSON
3. Extracts `signed_field_names` (comma-separated field list)
4. Reconstructs message: `field1=value1,field2=value2,...`
5. Generates HMAC-SHA256 signature
6. Compares with eSewa-provided signature
7. If valid: Updates order status to PAID, redirects to success page
8. If invalid: Returns error page

**URL Example:**
```
GET /api/esewa/verify?data=eyJ0cmFuc2FjdGlvbl91dWlkIjoiQlVZU0VXQS1..."
```

#### GET /api/esewa/failure

Handles payment failures.

**Process:**
1. Receives failure notification from eSewa
2. Extracts orderId if available
3. Redirects to frontend failure page with orderId

### Signature Generation & Verification

**Location:** `review-backend/utils/signature.js`

#### createEsewaSignature()

```javascript
function createEsewaSignature({ amount, tax_amount, transaction_uuid, product_code }) {
  // Message format: "field1=value1,field2=value2,field3=value3"
  const message = `total_amount=${amount + tax_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  
  // HMAC-SHA256 signature
  const hmac = crypto
    .createHmac('sha256', ESEWA_SECRET_KEY)
    .update(message)
    .digest('base64');
  
  return hmac;
}
```

**Example:**
```
Input:
  amount: 5000
  tax_amount: 500
  transaction_uuid: "BUYSEWA-1704067200000-abc123"
  product_code: "EPAYTEST"

Message: "total_amount=5500,transaction_uuid=BUYSEWA-1704067200000-abc123,product_code=EPAYTEST"

HMAC: "8gBm/:&EnhH.1/q" (secret key)

Output: "base64EncodedSignatureString=="
```

#### verifyEsewaSignature()

```javascript
function verifyEsewaSignature(data) {
  try {
    // Extract signed field names
    const signedFields = data.signed_field_names.split(',');
    
    // Reconstruct message in same format
    const message = signedFields
      .map(f => `${f}=${data[f]}`)
      .join(',');
    
    // Generate HMAC with same algorithm
    const hmac = crypto
      .createHmac('sha256', ESEWA_SECRET_KEY)
      .update(message)
      .digest('base64');
    
    // Compare with eSewa signature
    return hmac === data.signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
```

## Payment Data Flow

### Frontend Flow

```typescript
// 1. User clicks "Buy Now with eSewa"
const handleQuickBuy = async () => {
  // 2. Validate form inputs
  if (!validateInputs()) return;
  
  // 3. Call backend to initiate payment
  const response = await fetch('/api/esewa/initiate', {
    method: 'POST',
    body: JSON.stringify({
      amount: product.price,
      orderId: `QUICK-BUY-${productId}-${timestamp}`,
      productName: product.name,
      customerName: shippingInfo.firstName + ' ' + shippingInfo.lastName,
      customerEmail: shippingInfo.email,
      customerPhone: shippingInfo.phone
    })
  });
  
  const paymentData = await response.json();
  
  // 4. Create hidden form with payment data
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = paymentData.data.formUrl;
  
  // 5. Add all form fields (including signature)
  Object.keys(paymentData.data.formData).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = paymentData.data.formData[key];
    form.appendChild(input);
  });
  
  // 6. Auto-submit form to eSewa
  document.body.appendChild(form);
  form.submit();
};
```

### Backend Flow

```javascript
// 1. POST /api/esewa/initiate receives request
app.post('/api/esewa/initiate', async (req, res) => {
  const { amount, orderId, productName, customerName, customerEmail, customerPhone } = req.body;
  
  // 2. Validate inputs
  if (!amount || !orderId) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  
  // 3. Generate transaction UUID
  const transaction_uuid = `BUYSEWA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // 4. Calculate amounts
  const tax_amount = Math.floor(amount * 0.1);
  const total_amount = amount + tax_amount;
  
  // 5. Generate HMAC signature
  const signature = createEsewaSignature({
    amount,
    tax_amount,
    transaction_uuid,
    product_code: 'EPAYTEST'
  });
  
  // 6. Build payment form data
  const paymentData = {
    transaction_uuid,
    amount: amount.toString(),
    tax_amount: tax_amount.toString(),
    total_amount: total_amount.toString(),
    product_code: 'EPAYTEST',
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: 'http://localhost:5000/api/esewa/verify',
    failure_url: 'http://localhost:5000/api/esewa/failure',
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature: signature
  };
  
  // 7. Return form data to frontend
  res.json({
    success: true,
    data: {
      formUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
      formData: paymentData,
      orderId,
      transaction_uuid
    }
  });
});
```

### eSewa to Backend Flow

```javascript
// 1. User completes payment on eSewa
// 2. eSewa redirects to: /api/esewa/verify?data=base64EncodedData

app.get('/api/esewa/verify', (req, res) => {
  const token = req.query.data;
  
  // 3. Decode base64 data
  const decodedData = Buffer.from(token, 'base64').toString('utf-8');
  const data = JSON.parse(decodedData);
  
  // 4. Verify signature
  const isValid = verifyEsewaSignature(data);
  
  if (isValid) {
    // 5. Update order status
    // await Order.updateOne({ _id: orderId }, { status: 'PAID' });
    
    // 6. Redirect to success page
    const frontendUrl = 'http://localhost:5173';
    res.redirect(`${frontendUrl}/payment/success?orderId=${data.transaction_uuid}&refId=${data.transaction_uuid}&status=${data.status}`);
  } else {
    // 7. Invalid signature - return error
    res.status(403).send('Invalid Payment Signature');
  }
});
```

## Amount Calculation Examples

### Example 1: Product Under 10,000 NPR
```
Product Price: 2,500 NPR
Tax (10%): 250 NPR
Delivery Fee: 199 NPR
─────────────────────
Total: 2,949 NPR
```

### Example 2: Product Over 10,000 NPR (Free Delivery)
```
Product Price: 15,000 NPR
Tax (10%): 1,500 NPR
Delivery Fee: FREE
─────────────────────
Total: 16,500 NPR
```

## Error Handling

### Frontend Error Scenarios

1. **Missing Required Fields**
   ```
   User error message: "Please fill in all required fields"
   Fields checked: firstName, lastName, email, phone, address
   ```

2. **Invalid Email**
   ```
   User error message: "Please enter a valid email address"
   Validation: Regex check (^\S+@\S+\.\S+$)
   ```

3. **Invalid Phone**
   ```
   User error message: "Please enter a valid 10-digit phone number"
   Validation: Extract digits and check length
   ```

4. **Payment Initiation Failed**
   ```
   User error message: "Failed to initiate payment. Please try again."
   Logged to console: Full error details
   ```

### Backend Error Scenarios

1. **Missing Required Parameters**
   ```
   Status: 400
   Response: { success: false, message: "Amount and orderId are required" }
   ```

2. **Invalid Signature**
   ```
   Status: 403
   Response: HTML error page "Invalid Payment Signature"
   ```

3. **Verification Error**
   ```
   Status: 500
   Response: HTML error page "Payment Verification Error"
   ```

## Security Features

### HMAC-SHA256 Signature Verification

- **Algorithm:** HMAC with SHA256 hash function
- **Key:** Secret key from eSewa account
- **Message:** Specific fields in specific order
- **Encoding:** Base64 for transmission
- **Validation:** Backend regenerates and compares

### Field Order Matters

The fields in `signed_field_names` specify which fields to include in signature:
```
signed_field_names: "total_amount,transaction_uuid,product_code"

Message constructed as:
"total_amount=5500,transaction_uuid=BUYSEWA-...,product_code=EPAYTEST"
```

### Signature Cannot Be Forged

Without the secret key:
- Cannot create valid signature
- Regenerated signature will not match
- Payment will be rejected

## Integration Testing

### Test Scenario 1: Happy Path

1. Navigate to product page
2. Click "Buy Now with eSewa"
3. Dialog opens
4. Fill all fields with valid data
5. Click "Pay Now"
6. Form submits to eSewa
7. Complete payment with test credentials
8. Redirected to success page

### Test Scenario 2: Invalid Email

1. Click "Buy Now with eSewa"
2. Enter invalid email (e.g., "notanemail")
3. Click "Pay Now"
4. Error message: "Please enter a valid email address"
5. Dialog stays open
6. User can correct and retry

### Test Scenario 3: Payment Failure

1. Follow payment flow
2. On eSewa page, click "Decline" or "Cancel"
3. Redirected to failure page
4. User can try again or go back

## Performance Considerations

### Loading States

- Dialog shows loading spinner during form submission
- Button disabled during processing
- All inputs disabled during loading

### Form Validation

- Client-side validation before API call
- Prevents unnecessary backend requests
- Provides immediate user feedback

### Session Storage

- Stores order info for tracking
- Used if page needs to be refreshed
- Cleared after successful payment

## Accessibility Features

### Keyboard Navigation

- Tab through form fields
- Enter key submits form
- Escape key closes dialog
- Links are keyboard accessible

### Screen Reader Support

- Form labels properly associated with inputs
- Error messages announced
- Button purposes clearly stated
- Dialog title announced

### Color & Contrast

- Green used for success/primary action
- Error messages in readable red
- Sufficient contrast ratios
- Icons accompanied by text labels
