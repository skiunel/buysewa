/**
 * Payment Routes
 * Handles payment processing including eSewa integration
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const https = require('https');

// eSewa Configuration
const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'YOUR_MERCHANT_ID';
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || 'YOUR_SECRET_KEY';
const ESEWA_ENVIRONMENT = process.env.ESEWA_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'

// eSewa URLs
const ESEWA_URLS = {
  sandbox: {
    initiate: 'https://uat.esewa.com.np/epay/main',
    verify: 'https://uat.esewa.com.np/epay/transrec'
  },
  production: {
    initiate: 'https://esewa.com.np/epay/main',
    verify: 'https://esewa.com.np/epay/transrec'
  }
};

/**
 * Generate eSewa payment URL
 */
router.post('/esewa/initiate', async (req, res) => {
  try {
    const { amount, orderId, productName, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and orderId are required'
      });
    }

    // eSewa payment parameters
    const paymentParams = {
      amt: amount.toString(),
      psc: '0', // Product/service charge
      pdc: '0', // Product delivery charge
      txAmt: amount.toString(), // Total amount
      tAmt: amount.toString(), // Total amount
      pid: orderId, // Product ID (using order ID)
      scd: ESEWA_MERCHANT_ID, // Merchant code
      su: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?orderId=${orderId}`, // Success URL
      fu: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure?orderId=${orderId}` // Failure URL
    };

    // Generate hash for security
    const message = `total_amount=${paymentParams.tAmt},transaction_uuid=${paymentParams.pid},product_code=${paymentParams.scd}`;
    const hash = crypto.createHash('sha256').update(message).digest('base64');

    // Build payment URL
    const baseUrl = ESEWA_URLS[ESEWA_ENVIRONMENT].initiate;
    const params = new URLSearchParams(paymentParams);
    const paymentUrl = `${baseUrl}?${params.toString()}`;

    res.json({
      success: true,
      message: 'Payment URL generated successfully',
      data: {
        paymentUrl,
        orderId,
        amount,
        hash
      }
    });
  } catch (error) {
    console.error('eSewa initiate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
});

/**
 * Verify eSewa payment
 */
router.post('/esewa/verify', async (req, res) => {
  try {
    const { orderId, refId, amount } = req.body;

    if (!orderId || !refId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'orderId, refId, and amount are required'
      });
    }

    // Verify payment with eSewa
    const verifyParams = {
      amt: amount.toString(),
      rid: refId, // Reference ID from eSewa
      pid: orderId,
      scd: ESEWA_MERCHANT_ID
    };

    // Generate hash for verification
    const message = `total_amount=${verifyParams.amt},transaction_uuid=${verifyParams.pid},product_code=${verifyParams.scd}`;
    const hash = crypto.createHash('sha256').update(message).digest('base64');

    // In production, make actual API call to eSewa
    // For now, we'll simulate verification
    const verificationUrl = ESEWA_URLS[ESEWA_ENVIRONMENT].verify;
    const params = new URLSearchParams({
      ...verifyParams,
      hash
    });

    // Make verification request to eSewa
    // Note: In production, use proper HTTP client
    const verifyResponse = await new Promise((resolve, reject) => {
      const url = `${verificationUrl}?${params.toString()}`;
      
      https.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          // Parse eSewa response
          // eSewa returns XML, parse it
          if (data.includes('Success')) {
            resolve({ success: true, verified: true });
          } else {
            resolve({ success: false, verified: false });
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });

    if (verifyResponse.verified) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId,
          refId,
          amount,
          verified: true,
          transactionId: refId
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: {
          verified: false
        }
      });
    }
  } catch (error) {
    console.error('eSewa verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

/**
 * Khalti payment initiation (placeholder)
 */
router.post('/khalti/initiate', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Khalti integration would go here
    // For now, return success
    res.json({
      success: true,
      message: 'Khalti payment initiated',
      data: {
        paymentUrl: `https://khalti.com/payment/verify/?pidx=KHALTI_${orderId}`,
        orderId,
        amount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Khalti payment',
      error: error.message
    });
  }
});

module.exports = router;


