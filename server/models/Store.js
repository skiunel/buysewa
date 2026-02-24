import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    unique: true,
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  theme: {
    primaryColor: { type: String, default: '#3182CE' },
    secondaryColor: { type: String, default: '#805AD5' },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Store = mongoose.model('store', StoreSchema);
export default Store;
