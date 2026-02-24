import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  photos: [String],
  inStock: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    default: '',
  },
  overall_rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  review_count: {
    type: Number,
    default: 0,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('product', ProductSchema);
export default Product;
