const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const { rbac } = require("../middleware/rbac");
const { generateSDC, hashSDC } = require("../services/sdcService");
const { commitSDCToChain } = require("../services/blockchainService");

const router = express.Router();

// POST /api/orders (Buyer — creates order, generates SDC, commits to chain)
router.post("/", protect, rbac("buyer"), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    const qty = quantity || 1;
    const totalPrice = product.price * qty;

    // Generate unique SDC
    const sdc = generateSDC();
    const sdcHashValue = hashSDC(sdc);

    // Commit SDC to blockchain
    const { txHash, blockNumber } = await commitSDCToChain(sdcHashValue);

    const order = await Order.create({
      buyer: req.user.userId,
      product: product._id,
      seller: product.seller,
      quantity: qty,
      totalPrice,
      sdc,
      sdcHash: sdcHashValue,
      sdcTxHash: txHash,
      sdcBlockNumber: blockNumber,
    });

    res.status(201).json({
      message: "Order placed successfully. SDC committed to blockchain.",
      order: {
        id: order._id,
        product: product.name,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        sdcTxHash: txHash,
        sdcBlockNumber: blockNumber,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/my (Buyer — own orders)
router.get("/my", protect, rbac("buyer"), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.userId })
      .populate("product", "name price image")
      .sort({ createdAt: -1 });

    const ordersWithSDC = orders.map((order) => ({
      id: order._id,
      product: order.product,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      status: order.status,
      sdc: order.status === "delivered" && order.sdcRevealed ? order.sdc : null,
      sdcHash: order.sdcHash,
      sdcTxHash: order.sdcTxHash,
      sdcBlockNumber: order.sdcBlockNumber,
      createdAt: order.createdAt,
    }));

    res.json(ordersWithSDC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders (Admin — all orders)
router.get("/", protect, rbac("admin"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("product", "name price")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/seller (Seller — orders for their products)
router.get("/seller", protect, rbac("seller"), async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.userId })
      .populate("buyer", "name email")
      .populate("product", "name price image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/ship (Seller — mark shipped)
router.put("/:id/ship", protect, rbac("seller"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.seller.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized for this order" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order can only be shipped from pending status" });
    }

    order.status = "shipped";
    await order.save();

    res.json({ message: "Order marked as shipped", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/deliver (Seller — mark delivered, reveal SDC)
router.put("/:id/deliver", protect, rbac("seller"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.seller.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized for this order" });
    }

    if (order.status !== "shipped") {
      return res
        .status(400)
        .json({ message: "Order must be shipped before delivery" });
    }

    order.status = "delivered";
    order.sdcRevealed = true;
    await order.save();

    res.json({
      message: "Order delivered. SDC revealed to buyer.",
      order: {
        id: order._id,
        status: order.status,
        sdc: order.sdc,
        sdcHash: order.sdcHash,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
