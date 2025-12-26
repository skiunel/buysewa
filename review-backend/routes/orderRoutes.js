/**
 * Order Routes
 * Handles order creation and management
 */

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const SDC = require('../models/Sdc');
const crypto = require('crypto');

// Create new order
router.post('/', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, subtotal, delivery, total } = req.body;

    // Validate input
    if (!userId || !items || !items.length || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required order information'
      });
    }

    // Create order
    const order = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      delivery,
      total,
      paymentStatus: 'completed' // In production, verify payment first
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    
    // Generate SDC codes when order is delivered
    if (status === 'delivered' && order.sdcCodes.length === 0) {
      for (const item of order.items) {
        // Generate unique SDC code
        const sdcCode = `SDC-BUY-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        
        // Hash the SDC code (using keccak256 equivalent)
        const hashedSDC = crypto.createHash('sha256').update(sdcCode).digest('hex');
        
        // Create SDC record
        const sdc = new SDC({
          sdcCode,
          hashedSDC: '0x' + hashedSDC,
          userId: order.userId,
          orderId: order._id,
          productId: item.productId
        });
        
        await sdc.save();
        
        // Add to order
        order.sdcCodes.push({
          productId: item.productId,
          sdcCode,
          generatedAt: new Date(),
          isUsed: false
        });
      }
      
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Verify payment for an order (Admin/Seller only)
router.patch('/:id/payment/verify', async (req, res) => {
  try {
    const { paymentStatus, transactionId, notes } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide paymentStatus'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment status
    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.transactionId = transactionId;
    }
    if (notes) {
      order.paymentNotes = notes;
    }
    order.paymentVerifiedAt = new Date();
    order.paymentVerifiedBy = req.user?.id || 'admin'; // In production, get from auth middleware

    await order.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
});

// Get orders by payment status (for admin/seller)
router.get('/payment/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.find({ paymentStatus: status })
      .populate('userId', 'name email')
      .populate('items.productId', 'name image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders by payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

module.exports = router;


