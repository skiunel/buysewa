const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const { rbac } = require("../middleware/rbac");
const { hashSDC, validateSDCFormat } = require("../services/sdcService");
const { uploadToIPFS } = require("../services/ipfsService");
const { submitReviewToChain } = require("../services/blockchainService");

const router = express.Router();

// POST /api/reviews (Buyer — SDC required, upload to IPFS, commit to chain)
router.post("/", protect, rbac("buyer"), async (req, res) => {
  try {
    const { productId, rating, content, sdc } = req.body;

    if (!productId || !rating || !content || !sdc) {
      return res.status(400).json({
        message: "Product ID, rating, review content, and SDC are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (!validateSDCFormat(sdc)) {
      return res.status(400).json({ message: "Invalid SDC format" });
    }

    // Verify SDC matches an order belonging to this buyer
    const sdcHashValue = hashSDC(sdc);
    const order = await Order.findOne({
      sdc,
      buyer: req.user.userId,
      status: "delivered",
    });

    if (!order) {
      return res.status(400).json({
        message: "SDC not found or order not delivered",
      });
    }

    // Check product matches
    if (order.product.toString() !== productId) {
      return res.status(400).json({
        message: "SDC does not match the specified product",
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ sdcHash: sdcHashValue });
    if (existingReview) {
      return res.status(400).json({
        message: "A review has already been submitted with this SDC",
      });
    }

    // Step 1: Upload review to IPFS
    const reviewData = {
      productId,
      rating,
      content,
      reviewer: req.user.userId,
      sdcHash: sdcHashValue,
      timestamp: new Date().toISOString(),
    };

    const { ipfsHash } = await uploadToIPFS(reviewData, `review-${productId}`);

    // Step 2: Submit review hash to blockchain
    const { txHash, blockNumber } = await submitReviewToChain(
      sdcHashValue,
      ipfsHash
    );

    // Step 3: Store in MongoDB
    const review = await Review.create({
      product: productId,
      buyer: req.user.userId,
      order: order._id,
      rating,
      content,
      sdcHash: sdcHashValue,
      ipfsHash,
      txHash,
      blockNumber,
    });

    // Step 4: Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    res.status(201).json({
      message: "Review submitted and verified on blockchain",
      review: {
        id: review._id,
        rating: review.rating,
        content: review.content,
        ipfsHash: review.ipfsHash,
        txHash: review.txHash,
        blockNumber: review.blockNumber,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews/product/:productId
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    const sanitized = reviews.map((r) => ({
      id: r._id,
      rating: r.rating,
      content: r.content,
      reviewer: r.buyer ? r.buyer.name : "Anonymous",
      walletAddress: r.walletAddress,
      ipfsHash: r.ipfsHash,
      txHash: r.txHash,
      blockNumber: r.blockNumber,
      sdcHash: r.sdcHash,
      createdAt: r.createdAt,
    }));

    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews (Admin)
router.get("/", protect, rbac("admin"), async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("buyer", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
