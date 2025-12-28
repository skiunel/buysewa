# eSewa Quick Pay - Visual Architecture Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BUYSEWA PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BROWSER                          SERVER                        EXTERNAL    │
│  ┌─────────────────────┐      ┌─────────────────┐         ┌──────────────┐│
│  │                     │      │                 │         │  eSewa       ││
│  │  React App          │      │  Node.js API    │         │  Payment     ││
│  │  ┌───────────────┐  │      │  ┌──────────────┐│         │  Gateway     ││
│  │  │ Product Page  │  │      │  │ eSewa Routes ││         │              ││
│  │  │ + Quick Buy   │  │      │  │              ││         │ • Form API   ││
│  │  │ Component     │  │      │  │ • initiate   ││         │ • Status API ││
│  │  └───────┬───────┘  │      │  │ • verify     ││         │ • Webhook    ││
│  │          │          │      │  │ • failure    ││         │              ││
│  │          │ Dialog   │      │  └──────────────┘│         └──────────────┘│
│  │  ┌───────▼───────┐  │      │  ┌──────────────┐│              ▲  ▼        │
│  │  │ Shipping Form │  │      │  │ Signature    ││              │  │        │
│  │  │ + Summary     │  │      │  │ Util         ││              │  │        │
│  │  │ + Calculate   │  │      │  │              ││              │  │        │
│  │  │ • Tax         │  │      │  │ • Create     ││         Auto-submit      │
│  │  │ • Delivery    │  │      │  │ • Verify     ││         & Redirect       │
│  │  │ • Total       │  │      │  │ (HMAC-SHA256)││              │  │        │
│  │  └───────┬───────┘  │      │  └──────────────┘│              │  │        │
│  │          │          │      │                 │         ▼  ▲        │
│  │          │ Submit   │      │  ┌──────────────┐│              │  │        │
│  │  ┌───────▼───────┐  │      │  │ Database     ││              │  │        │
│  │  │ Utilities     │  │      │  │              ││         Payment Data     │
│  │  │               │  │      │  │ • Orders     ││         (Base64)         │
│  │  │ • Calculate   │  │ ────→│  │ • Payments   ││◄─────────────┤  │        │
│  │  │   amounts     │  │ ←────│  │ • Statuses   ││         Redirect         │
│  │  │ • Generate    │  │      │  │              ││              │  │        │
│  │  │   UUID        │  │      │  └──────────────┘│              │  │        │
│  │  │ • Format data │  │      │                 │              ▼  ▲        │
│  │  └───────────────┘  │      │                 │         Payment        │
│  │          │          │      │                 │         Page Display      │
│  │  ┌───────▼───────┐  │      │                 │                          │
│  │  │ Hidden Form   │  │      │                 │              Success     │
│  │  │ Auto-Submit   │──┼─────►│ /api/esewa/     │              Page        │
│  │  │ to eSewa      │  │      │ initiate        │              ◄───────    │
│  │  │               │  │      │ (POST)          │              │           │
│  │  └───────────────┘  │      │                 │              │           │
│  │                     │      │                 │              │           │
│  └─────────────────────┘      │                 │              │           │
│                               │ /api/esewa/     │              │           │
│          Redirect ◄───────────│ verify          │              │           │
│          to Success           │ (GET callback)  │              │           │
│                               │                 │              │           │
│  ┌─────────────────────┐      │                 │              │           │
│  │ Success/Failure     │      │                 │              │           │
│  │ Page                │      │                 │              │           │
│  │ • Order #           │      │                 │              │           │
│  │ • Transaction ID    │      │                 │              │           │
│  │ • Status            │      │                 │              │           │
│  │ • Buttons           │      │                 │              │           │
│  └─────────────────────┘      │                 │              │           │
│                               └─────────────────┘              │           │
│                                                           └──────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCT PAGE                             │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │         Product Details & Reviews                  │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │  "Add to Cart" Button                        │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │  "Buy Now with eSewa" Button (NEW!)         │ │   │
│  │  │  ▼ Click triggers QuickBuyEsewa component ◄─┼─┼────┐
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │         eSewa Payment Dialog (QuickBuyEsewa)       │   │
│  │         ▲ Click "Buy Now with eSewa"              │   │
│  │         │                                         │   │
│  │         ▼                                         │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │ Order Summary Section                      │   │   │
│  │  │ • Product Price: NPR 5,000                 │   │   │
│  │  │ • Tax (10%): NPR 500                       │   │   │
│  │  │ • Delivery: NPR 199 (or FREE)              │   │   │
│  │  │ • TOTAL: NPR 5,699  (green highlight)     │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │ Shipping Information Form                  │   │   │
│  │  │ ┌──────────────────────────────────────┐   │   │   │
│  │  │ │ First Name: [________________]       │   │   │   │
│  │  │ │ Last Name: [_________________]       │   │   │   │
│  │  │ │ Email: [________________________]     │   │   │   │
│  │  │ │ Phone: [________________________]     │   │   │   │
│  │  │ │ Address: [_____________________]     │   │   │   │
│  │  │ │ City: [Kathmandu ▼_____________]     │   │   │   │
│  │  │ └──────────────────────────────────────┘   │   │   │
│  │  │                                            │   │   │
│  │  │  ┌──────────────┐ ┌──────────────────┐    │   │   │
│  │  │  │   CANCEL     │ │ PAY NPR 5,699    │    │   │   │
│  │  │  └──────────────┘ └──────────────────┘    │   │   │
│  │  │                        ▼ Click            │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                           │                       │   │
│  │                           ▼                       │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │ Calls esewaPayment.ts utilities:           │   │   │
│  │  │ • Validate inputs (email, phone)           │   │   │
│  │  │ • Calculate amounts (already done)         │   │   │
│  │  │ • Generate transaction UUID                │   │   │
│  │  │ • Call /api/esewa/initiate                 │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                           │                       │   │
│  │                           ▼                       │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │ Backend Response with:                     │   │   │
│  │  │ • eSewa form URL                           │   │   │
│  │  │ • Form data (signature included)           │   │   │
│  │  │ • Transaction UUID                         │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                           │                       │   │
│  │                           ▼                       │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │ Creates Hidden Form:                       │   │   │
│  │  │ • Method: POST                             │   │   │
│  │  │ • Action: eSewa form URL                   │   │   │
│  │  │ • Fields: payment data + signature         │   │   │
│  │  │ • Auto-submits to eSewa                    │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                           │                       │   │
│  └───────────────────────────┼───────────────────────┘   │
│                              │                           │
└──────────────────────────────┼───────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  eSewa Payment Page  │
                    │                      │
                    │  Login with:         │
                    │  • ID: 9806800001    │
                    │  • Password          │
                    │  • MPIN: 1122        │
                    │                      │
                    │  Complete Payment    │
                    │         │            │
                    │         ▼            │
                    │  eSewa Redirects to: │
                    │  /api/esewa/verify   │
                    │  (with data param)   │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Backend Verify     │
                    │                      │
                    │ • Decode base64      │
                    │ • Verify signature   │
                    │ • Update order       │
                    │ • Redirect to        │
                    │   /payment/success   │
                    └──────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Success Page         │
                    │                      │
                    │ Order #: 12345       │
                    │ Trans ID: UUID...    │
                    │                      │
                    │ [View Orders]        │
                    │ [Continue Shopping]  │
                    └──────────────────────┘
```

## Data Flow Sequence Diagram

```
User              Frontend           Backend            eSewa
│                    │                 │                 │
├─ Click Button ────►│                 │                 │
│                    │ Open Dialog      │                 │
│                    │ Show Form        │                 │
│                    │                 │                 │
├─ Fill Form ───────►│                 │                 │
│                    │ Validate Email  │                 │
│                    │ Validate Phone  │                 │
│                    │                 │                 │
├─ Click Pay ───────►│                 │                 │
│                    │ POST /initiate ─┼────────────────►│
│                    │                 │ Parse request   │
│                    │                 │ Generate UUID   │
│                    │                 │ Calculate Tax   │
│                    │                 │ Create Sig      │
│                    │◄─ Return ────────│                 │
│                    │ formUrl + data   │                 │
│                    │                 │                 │
│                    │ Create Form     │                 │
│                    │ Auto-Submit ────┼────────────────►│
│                    │                 │                 │
│                    │                 │                 │ Show Login
│ Complete Payment  │                 │                 │ Page
├────────────────────────────────────────────────────────►
│                    │                 │ User Authorizes │
│                    │                 │                 │
│                    │                 │ Redirect back ◄─┤
│                    │                 │ GET /verify      │
│                    │                 │ with data param  │
│                    │                 │                 │
│                    │                 │ Decode Data     │
│                    │                 │ Verify Signature│
│                    │                 │ Update Order    │
│                    │                 │                 │
│                    │◄─────────────────│ Redirect to     │
│                    │ Success Page URL  │ /payment/      │
│                    │                   │ success         │
│                    │                 │                 │
│◄──────────────────│ Redirect                           │
│ See Success Page  │ /payment/success                   │
│                    │ Show Details                       │
│                    │                 │                 │
│─ Continue ────────►│                 │                 │
│ or Retry           │                 │                 │
│                    │                 │                 │
```

## Amount Calculation Flow

```
                    PRODUCT PRICE
                         │
                         │ (e.g., 5000)
                         ▼
                    ┌─────────────┐
                    │ User selects│
                    │ "Buy Now"   │
                    └──────┬──────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ calculateTaxAmount│
                  │ (price × 0.1)    │
                  │ = 500            │
                  └──────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      ┌─────────┐  ┌──────────┐  ┌────────────┐
      │ TAX     │  │ Calculate│  │ Show Dialog│
      │ 500     │  │ Delivery │  │ with Total │
      │         │  │          │  │            │
      └────┬────┘  └─────┬────┘  │ 5000       │
           │             │       │ + 500      │
           │             ▼       │ + 199      │
           │        IS PRICE     │ ────────── │
           │        >= 10000?    │ = 5699     │
           │        │         │  └──────┬─────┘
           │        YES       NO         │
           │        │         │         │
           │        ▼         ▼         │
           │      DELIVERY  DELIVERY    │
           │        = 0      = 199      │
           │        │         │         │
           └────────┼────┬────┘         │
                    │    │             │
                    │    └─────┬───────┘
                    │          │
                    ▼          ▼
              ┌────────────────────┐
              │ TOTAL AMOUNT       │
              │ Price + Tax +      │
              │ Delivery           │
              │                    │
              │ 5000 + 500 + 199   │
              │ = 5699 NPR         │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Display in Dialog   │
              │ "Pay NPR 5,699"    │
              │                    │
              │ [PAY NOW BUTTON]    │
              └────────────────────┘
```

## File Structure Overview

```
BUYSEWA/
├── src/
│   ├── components/
│   │   ├── ProductPage.tsx  ◄─ UPDATED: imports QuickBuyEsewa
│   │   ├── QuickBuyEsewa.tsx  ◄─ NEW: Payment dialog component
│   │   └── [other components]
│   │
│   ├── utils/
│   │   ├── esewaPayment.ts  ◄─ NEW: Payment utilities
│   │   └── [other utilities]
│   │
│   └── pages/
│       ├── PaymentSuccess.tsx  ◄─ Existing: success page
│       ├── PaymentFailure.tsx   ◄─ Existing: failure page
│       └── [other pages]
│
├── review-backend/
│   ├── routes/
│   │   ├── esewaRoutes.js  ◄─ EXISTING: All endpoints
│   │   └── [other routes]
│   │
│   ├── utils/
│   │   ├── signature.js  ◄─ EXISTING: HMAC verification
│   │   └── [other utils]
│   │
│   └── [other backend files]
│
├── docs/
│   ├── ESEWA_QUICK_START.md              ◄─ NEW
│   ├── ESEWA_QUICK_PAY_GUIDE.md          ◄─ NEW
│   ├── ESEWA_IMPLEMENTATION_DETAILS.md   ◄─ NEW
│   ├── ESEWA_INTEGRATION_SETUP.md        ◄─ NEW
│   ├── ESEWA_SUMMARY.md                  ◄─ NEW
│   └── [other documentation]
│
└── README.md  ◄─ UPDATED: Added Payment Gateway section
```

## Security Flow

```
┌──────────────────────────────────────────────────┐
│          PAYMENT SECURITY VERIFICATION           │
└──────────────────────────────────────────────────┘

Frontend (User enters data):
└─ Form Data ───────────────────────┐
                                    │
Backend (Server-side processing):   │
│                                   │
├─ Receive form data ◄──────────────┘
│
├─ Validate inputs
│  └─ Email format ✓
│  └─ Phone format ✓
│  └─ Address check ✓
│
├─ Generate transaction_uuid
│  └─ BUYSEWA-1704067200000-abc123
│
├─ Calculate amounts
│  └─ tax_amount = price × 0.1
│  └─ total_amount = price + tax
│
├─ Generate HMAC Signature
│  │
│  ├─ message = "total_amount=5500,transaction_uuid=BUYSEWA-...,product_code=EPAYTEST"
│  │
│  ├─ Apply HMAC-SHA256
│  │  └─ secret_key = "8gBm/:&EnhH.1/q"
│  │
│  └─ signature = base64(HMAC result)
│     └─ "base64EncodedSignatureHere=="
│
├─ Build form data
│  └─ Contains: transaction_uuid, amount, tax, signature, etc.
│
└─ Return to frontend
   │
   └─ Frontend auto-submits to eSewa
      │
      ▼
eSewa Processes Payment
│
├─ User logs in
├─ Authorizes payment
├─ Processes transaction
│
└─ Redirects back to: /api/esewa/verify?data=base64Data
   │
   ▼
Backend Verification:
│
├─ Decode base64 data
│
├─ Extract fields from response
│  └─ transaction_uuid, status, signature, signed_field_names
│
├─ Reconstruct message
│  └─ Using signed_field_names order
│
├─ Regenerate signature
│  ├─ Same secret_key: "8gBm/:&EnhH.1/q"
│  ├─ Same HMAC-SHA256 algorithm
│  └─ signature_generated = base64(HMAC)
│
├─ Compare signatures
│  │
│  ├─ IF (signature_generated === signature_from_esewa)
│  │  └─ ✓ VALID - Payment confirmed
│  │     ├─ Update order status to PAID
│  │     └─ Redirect to /payment/success
│  │
│  └─ ELSE
│     └─ ✗ INVALID - Payment rejected
│        └─ Redirect to /payment/failure
│
└─ Complete
```

This visual guide shows:
1. Complete system architecture
2. Component relationships
3. Data flow sequence
4. Amount calculation logic
5. File structure
6. Security verification process
