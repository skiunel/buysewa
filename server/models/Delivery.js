import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'order',
    required: true,
  },
  delivery_id: {
    type: String,
    required: true,
    unique: true,
  },
  standard_delivery_code: {
    type: String,
    unique: true,
    sparse: true,
  },
  delivery_status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Delivered'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

DeliverySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Delivery = mongoose.model('delivery', DeliverySchema);
export default Delivery;
