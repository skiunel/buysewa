/**
 * Demo Payment Routes
 * Simulates eSewa payment for testing without real credentials
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Demo payment storage (in production, use database)
const demoPayments = new Map();

/**
 * Demo eSewa Payment Initiation
 * Simulates eSewa payment URL generation
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

    // Generate demo payment session
    const paymentSessionId = `DEMO_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const demoRefId = `ESEWA_DEMO_${Date.now()}`;

    // Store payment session
    demoPayments.set(paymentSessionId, {
      orderId,
      amount,
      customerName,
      customerEmail,
      status: 'pending',
      createdAt: new Date(),
      refId: demoRefId
    });

    // Return demo payment URL (frontend will handle the demo flow)
    res.json({
      success: true,
      message: 'Demo payment initiated successfully',
      data: {
        paymentUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/demo?sessionId=${paymentSessionId}&orderId=${orderId}&amount=${amount}`,
        sessionId: paymentSessionId,
        orderId,
        amount,
        refId: demoRefId,
        isDemo: true
      }
    });
  } catch (error) {
    console.error('Demo eSewa initiate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate demo payment',
      error: error.message
    });
  }
});

/**
 * Verify Demo Payment
 */
router.post('/esewa/verify', async (req, res) => {
  try {
    const { orderId, refId, amount, sessionId } = req.body;

    if (!orderId || !refId) {
      return res.status(400).json({
        success: false,
        message: 'orderId and refId are required'
      });
    }

    // In demo mode, always verify successfully
    // In production, this would verify with eSewa API
    const payment = demoPayments.get(sessionId);
    
    if (payment && payment.status === 'completed') {
      res.json({
        success: true,
        message: 'Demo payment verified successfully',
        data: {
          orderId,
          refId,
          amount,
          verified: true,
          transactionId: refId,
          isDemo: true
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not found or not completed',
        data: {
          verified: false
        }
      });
    }
  } catch (error) {
    console.error('Demo eSewa verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify demo payment',
      error: error.message
    });
  }
});

/**
 * Complete Demo Payment
 */
router.post('/esewa/complete', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId is required'
      });
    }

    const payment = demoPayments.get(sessionId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment session not found'
      });
    }

    // Mark payment as completed
    payment.status = 'completed';
    payment.completedAt = new Date();
    demoPayments.set(sessionId, payment);

    res.json({
      success: true,
      message: 'Demo payment completed',
      data: {
        sessionId,
        orderId: payment.orderId,
        amount: payment.amount,
        refId: payment.refId,
        transactionId: payment.refId,
        isDemo: true
      }
    });
  } catch (error) {
    console.error('Demo eSewa complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete demo payment',
      error: error.message
    });
  }
});

module.exports = router;


