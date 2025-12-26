/**
 * Review Model
 * Stores review information (also stored on blockchain)
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sdcId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SDC',
    required: true
  },
  sdcCode: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  images: [{
    type: String
  }],
  // Blockchain data
  ipfsHash: {
    type: String
  },
  blockchainTxHash: {
    type: String,
    unique: true,
    sparse: true
  },
  blockchainReviewId: {
    type: Number
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);


