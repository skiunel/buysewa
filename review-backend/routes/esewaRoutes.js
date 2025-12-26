/**
 * eSewa Payment Routes
 * Handles eSewa payment integration with HMAC signature verification
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { createEsewaSignature, verifyEsewaSignature } = require('../utils/signature');

// eSewa Configuration
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_ENVIRONMENT = process.env.ESEWA_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'

// eSewa URLs
const ESEWA_URLS = {
  sandbox: {
    form: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    verify: 'https://uat.esewa.com.np/api/epay/transaction/status'
  },
  production: {
    form: 'https://epay.esewa.com.np/api/epay/main/v2/form',
    verify: 'https://esewa.com.np/api/epay/transaction/status'
  }
};

/**
 * Generate eSewa payment form data
 * Returns form parameters with signature for frontend to submit
 */
router.post('/initiate', async (req, res) => {
  try {
    const { amount, orderId, productName, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and orderId are required'
      });
    }

    // Generate transaction UUID
    const transaction_uuid = `BUYSEWA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate tax (10% of amount)
    const tax_amount = Math.floor(amount * 0.1);
    const total_amount = amount + tax_amount;

    // Create signature
    const signature = createEsewaSignature({
      amount,
      tax_amount,
      transaction_uuid,
      product_code: ESEWA_PRODUCT_CODE
    });

    // Base URL for callbacks
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Payment form data
    const paymentData = {
      transaction_uuid,
      amount: amount.toString(),
      tax_amount: tax_amount.toString(),
      total_amount: total_amount.toString(),
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${baseUrl}/api/esewa/verify`,
      failure_url: `${baseUrl}/api/esewa/failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature
    };

    res.json({
      success: true,
      message: 'eSewa payment form data generated',
      data: {
        formUrl: ESEWA_URLS[ESEWA_ENVIRONMENT].form,
        formData: paymentData,
        orderId,
        transaction_uuid
      }
    });
  } catch (error) {
    console.error('eSewa initiate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate eSewa payment',
      error: error.message
    });
  }
});

/**
 * eSewa Payment Verification (Success Callback)
 * eSewa redirects here with base64 encoded data parameter
 */
router.get('/verify', (req, res) => {
  try {
    const token = req.query.data;
    
    if (!token) {
      return res.status(400).send(`
        <html>
          <head><title>Payment Verification</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #e74c3c;">❌ Payment Verification Failed</h1>
            <p>Missing payment data. Please contact support.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #3498db;">Return to Home</a>
          </body>
        </html>
      `);
    }

    // Decode base64 token
    const decodedData = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(decodedData);

    // Verify signature
    const isValid = verifyEsewaSignature(data);

    if (isValid) {
      // Payment verified successfully
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const orderId = data.transaction_uuid || '';
      
      // Redirect to frontend success page
      return res.redirect(`${frontendUrl}/payment/success?orderId=${orderId}&refId=${data.transaction_uuid}&status=${data.status}`);
    } else {
      // Invalid signature
      return res.status(403).send(`
        <html>
          <head><title>Payment Verification</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1 style="color: #e74c3c;">❌ Invalid Payment Signature</h1>
            <p>Payment verification failed due to invalid signature.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #3498db;">Return to Home</a>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('eSewa verify error:', error);
    return res.status(500).send(`
      <html>
        <head><title>Payment Verification</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1 style="color: #e74c3c;">❌ Payment Verification Error</h1>
          <p>An error occurred during payment verification: ${error.message}</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #3498db;">Return to Home</a>
        </body>
      </html>
    `);
  }
});

/**
 * eSewa Payment Failure Callback
 */
router.get('/failure', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const orderId = req.query.orderId || '';
  
  return res.redirect(`${frontendUrl}/payment/failure?orderId=${orderId}`);
});

/**
 * Check payment status (optional server-side status check)
 */
router.get('/status', async (req, res) => {
  try {
    const { transaction_uuid, total_amount } = req.query;

    if (!transaction_uuid || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'transaction_uuid and total_amount are required'
      });
    }

    // In production, make API call to eSewa
    // For now, return success
    res.json({
      success: true,
      data: {
        transaction_uuid,
        status: 'COMPLETE',
        total_amount
      }
    });
  } catch (error) {
    console.error('eSewa status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message
    });
  }
});

/**
 * Debug endpoint - Test if routes are working
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'eSewa routes are working!',
    timestamp: new Date().toISOString(),
    environment: ESEWA_ENVIRONMENT,
    formUrl: ESEWA_URLS[ESEWA_ENVIRONMENT].form
  });
});

module.exports = router;

