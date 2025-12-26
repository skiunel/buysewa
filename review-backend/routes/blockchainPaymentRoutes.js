/**
 * Blockchain Payment Routes
 * Handles blockchain-based payment processing and SDC code generation
 */

const express = require('express');
const router = express.Router();
const BlockchainPaymentService = require('../utils/blockchainService');
const SDCService = require('../utils/sdcService');

// Initialize blockchain service
const blockchainService = new BlockchainPaymentService();

// Initialize blockchain on first request
let blockchainInitialized = false;

// Middleware to ensure blockchain is initialized
router.use(async (req, res, next) => {
  if (!blockchainInitialized) {
    await blockchainService.initialize();
    blockchainInitialized = true;
  }
  next();
});

/**
 * POST /api/blockchain/network-info
 * Get blockchain network information
 */
router.get('/network-info', async (req, res) => {
  try {
    const networkInfo = await blockchainService.getNetworkInfo();
    
    res.json({
      success: true,
      data: networkInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching network info',
      error: error.message
    });
  }
});

/**
 * POST /api/blockchain/generate-sdc
 * Generate a new SDC code for an order
 */
router.post('/generate-sdc', async (req, res) => {
  try {
    const { orderId, productId, userId } = req.body;

    // Validate request
    if (!orderId || !productId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'orderId, productId, and userId are required'
      });
    }

    // Generate SDC code
    const sdc = await SDCService.generateSDCForOrder(orderId, productId, userId);

    res.json({
      success: true,
      message: 'SDC code generated successfully',
      data: {
        sdcCode: sdc.code,
        sdcHash: sdc.hash,
        orderId: sdc.orderId,
        productId: sdc.productId,
        generatedAt: sdc.generatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating SDC code',
      error: error.message
    });
  }
});

/**
 * POST /api/blockchain/register-sdc
 * Register SDC code on blockchain
 */
router.post('/register-sdc', async (req, res) => {
  try {
    const { sdcCode, userAddress, productId, orderId } = req.body;

    // Validate request
    if (!sdcCode || !userAddress || !productId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'sdcCode, userAddress, productId, and orderId are required'
      });
    }

    // Validate SDC format
    if (!SDCService.validateSDCFormat(sdcCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid SDC code format'
      });
    }

    // Register on blockchain
    const result = await blockchainService.registerSDCOnBlockchain(
      sdcCode,
      userAddress,
      productId,
      orderId
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'SDC code registered on blockchain',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to register SDC on blockchain',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering SDC on blockchain',
      error: error.message
    });
  }
});

/**
 * POST /api/blockchain/verify-sdc
 * Verify SDC code on blockchain
 */
router.post('/verify-sdc', async (req, res) => {
  try {
    const { sdcCode } = req.body;

    // Validate request
    if (!sdcCode) {
      return res.status(400).json({
        success: false,
        message: 'sdcCode is required'
      });
    }

    // Verify on blockchain
    const result = await blockchainService.verifySDCOnBlockchain(sdcCode);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying SDC',
      error: error.message
    });
  }
});

/**
 * POST /api/blockchain/submit-review
 * Submit a review on blockchain
 */
router.post('/submit-review', async (req, res) => {
  try {
    const { sdcCode, productId, ipfsHash, rating } = req.body;

    // Validate request
    if (!sdcCode || !productId || !ipfsHash || !rating) {
      return res.status(400).json({
        success: false,
        message: 'sdcCode, productId, ipfsHash, and rating are required'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Submit review on blockchain
    const result = await blockchainService.submitReviewOnBlockchain(
      sdcCode,
      productId,
      ipfsHash,
      rating
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Review submitted on blockchain',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to submit review on blockchain',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
});

/**
 * POST /api/blockchain/validate-sdc-format
 * Validate SDC code format
 */
router.post('/validate-sdc-format', (req, res) => {
  try {
    const { sdcCode } = req.body;

    if (!sdcCode) {
      return res.status(400).json({
        success: false,
        message: 'sdcCode is required'
      });
    }

    const isValid = SDCService.validateSDCFormat(sdcCode);

    res.json({
      success: true,
      data: {
        sdcCode: sdcCode,
        isValid: isValid,
        format: 'BUYSEWA-XXXXXXXX-XXXXXXXX'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating SDC format',
      error: error.message
    });
  }
});

/**
 * GET /api/blockchain/sdc-metadata/:sdcCode
 * Get SDC code metadata
 */
router.get('/sdc-metadata/:sdcCode', (req, res) => {
  try {
    const { sdcCode } = req.params;

    const metadata = SDCService.getSDCMetadata(sdcCode);

    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting SDC metadata',
      error: error.message
    });
  }
});

/**
 * POST /api/blockchain/batch-generate-sdc
 * Generate multiple SDC codes
 */
router.post('/batch-generate-sdc', async (req, res) => {
  try {
    const { count } = req.body;

    if (!count || count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        message: 'count must be between 1 and 100'
      });
    }

    // Generate multiple SDC codes
    const sdcCodes = SDCService.generateMultipleSDCCodes(count);

    res.json({
      success: true,
      message: `Generated ${count} SDC codes`,
      data: {
        count: sdcCodes.length,
        codes: sdcCodes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating SDC codes',
      error: error.message
    });
  }
});

module.exports = router;
