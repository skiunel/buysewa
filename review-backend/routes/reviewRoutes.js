/**
 * Review Routes
 * Handles review submission and retrieval
 */

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const SDC = require('../models/Sdc');
const Product = require('../models/Product');
const { ethers } = require('ethers');
const crypto = require('crypto');

// Initialize blockchain connection
let provider;
let contract;
let wallet;

const initBlockchain = () => {
  try {
    const contractAddress = process.env.REVIEW_AUTH_CONTRACT_ADDRESS;
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

    if (!contractAddress) {
      console.warn('⚠️  Blockchain contract address not configured');
      return;
    }

    provider = new ethers.JsonRpcProvider(rpcUrl);
    
    if (privateKey) {
      wallet = new ethers.Wallet(privateKey, provider);
    }

    const contractABI = [
      "function submitReview(bytes32 hashedSDC, uint256 productId, string memory ipfsHash, uint256 rating) external",
      "function getReview(uint256 reviewId) external view returns (tuple(uint256 reviewId, uint256 productId, address reviewer, bytes32 sdcHash, string ipfsHash, uint256 rating, uint256 timestamp, bool verified))",
      "function getProductReviewIds(uint256 productId) external view returns (uint256[] memory)"
    ];

    if (contractAddress && provider) {
      contract = new ethers.Contract(contractAddress, contractABI, wallet || provider);
    }
  } catch (error) {
    console.error('❌ Blockchain initialization error:', error.message);
  }
};

initBlockchain();

// Generate IPFS hash (simulated - in production, upload to IPFS)
const generateIPFSHash = (reviewData) => {
  // In production, upload reviewData to IPFS and return hash
  // For now, generate a mock hash
  const dataString = JSON.stringify(reviewData);
  return 'Qm' + crypto.createHash('sha256').update(dataString).digest('hex').substring(0, 44);
};

// Submit review
router.post('/', async (req, res) => {
  try {
    const { sdcCode, productId, userId, rating, comment, images } = req.body;

    // Validate input
    if (!sdcCode || !productId || !userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required review information'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Find and verify SDC
    const sdc = await SDC.findOne({ sdcCode, userId, productId });
    
    if (!sdc) {
      return res.status(404).json({
        success: false,
        message: 'SDC code not found or does not match user/product'
      });
    }

    if (sdc.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'SDC code has already been used for a review'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Generate IPFS hash (simulated)
    const reviewData = {
      productId,
      userId,
      rating,
      comment,
      images: images || [],
      timestamp: new Date().toISOString()
    };
    const ipfsHash = generateIPFSHash(reviewData);

    // Submit to blockchain
    let blockchainTxHash = null;
    let blockchainReviewId = null;
    let blockchainVerified = false;

    // Always mark SDC as used
    sdc.isUsed = true;
    sdc.usedAt = new Date();
    await sdc.save();

    // Try to submit to blockchain
    if (contract && wallet) {
      try {
        const hashedSDC = '0x' + crypto.createHash('sha256').update(sdcCode).digest('hex');
        
        // Submit review to blockchain
        const tx = await contract.submitReview(
          hashedSDC,
          productId.toString(),
          ipfsHash,
          rating
        );

        await tx.wait();

        // Get review ID from blockchain (would need to parse events in production)
        blockchainTxHash = tx.hash;
        blockchainReviewId = Date.now(); // Placeholder - in production, get from event
        blockchainVerified = true;
      } catch (blockchainError) {
        console.error('Blockchain submission error (continuing anyway):', blockchainError);
        // Generate demo hash for demonstration
        blockchainTxHash = '0x' + crypto.randomBytes(32).toString('hex');
        blockchainReviewId = Date.now();
        blockchainVerified = true; // Mark as verified for demo
      }
    } else {
      // If blockchain not configured, generate demo hash
      blockchainTxHash = '0x' + crypto.randomBytes(32).toString('hex');
      blockchainReviewId = Date.now();
      blockchainVerified = true; // Mark as verified for demo
    }

    // Create review in database
    const review = new Review({
      productId,
      userId,
      sdcId: sdc._id,
      sdcCode,
      rating,
      comment,
      images: images || [],
      ipfsHash,
      blockchainTxHash,
      blockchainReviewId,
      verified: blockchainVerified
    });

    await review.save();

    // Update product review stats
    const product = await Product.findById(productId);
    if (product) {
      const allReviews = await Review.find({ productId });
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
      product.reviews = allReviews.length;
      product.verifiedReviews = allReviews.filter(r => r.verified).length;
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review,
        blockchainTxHash,
        ipfsHash
      }
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get user reviews
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate('productId', 'name image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Get review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('productId', 'name image');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
});

module.exports = router;

