const express = require("express");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const { rbac } = require("../middleware/rbac");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const filter = { status: "active" };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "rating") sortObj = { averageRating: -1 };

    const products = await Product.find(filter)
      .populate("seller", "name")
      .sort(sortObj);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products (Seller / Admin)
router.post("/", protect, rbac("seller", "admin"), async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || price == null || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: image || null,
      seller: req.user.userId,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/products/:id (Seller owner / Admin)
router.put("/:id", protect, rbac("seller", "admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Sellers can only edit their own products
    if (
      req.user.role === "seller" &&
      product.seller.toString() !== req.user.userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this product" });
    }

    const { name, description, price, category, image, status } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price != null) product.price = price;
    if (category) product.category = category;
    if (image !== undefined) product.image = image;
    if (status && req.user.role === "admin") product.status = status;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/products/:id (Admin only)
router.delete("/:id", protect, rbac("admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
