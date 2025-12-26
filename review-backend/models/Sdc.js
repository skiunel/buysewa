/**
 * SDC (Secure Digital Code) Model
 * Stores SDC codes generated after successful orders
 */

const mongoose = require('mongoose');

const sdcSchema = new mongoose.Schema({
  sdcCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  hashedSDC: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  isRegisteredOnBlockchain: {
    type: Boolean,
    default: false
  },
  blockchainTxHash: {
    type: String
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  usedAt: {
    type: Date
  }
});

// Index for faster queries
sdcSchema.index({ userId: 1, productId: 1 });
sdcSchema.index({ sdcCode: 1 });

module.exports = mongoose.model('SDC', sdcSchema);


