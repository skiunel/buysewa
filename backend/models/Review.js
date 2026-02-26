const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: [true, "Review content is required"],
      maxlength: 2000,
    },
    sdcHash: {
      type: String,
      required: true,
    },
    ipfsHash: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    walletAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
