/**
 * Product Model
 * Stores product information
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String
  },
  images: [{
    type: String
  }],
  image: {
    type: String,
    required: true
  },
  brand: {
    type: String
  },
  seller: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  verifiedReviews: {
    type: Number,
    default: 0
  },
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
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
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);


