const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { rbac } = require("../middleware/rbac");

const router = express.Router();

// GET /api/users/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/me
router.put("/me", protect, async (req, res) => {
  try {
    const { name, walletAddress } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (walletAddress) updates.walletAddress = walletAddress;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users (Admin only)
router.get("/", protect, rbac("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/:id/role (Admin only)
router.put("/:id/role", protect, rbac("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["buyer", "seller", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/:id/suspend (Admin only)
router.put("/:id/suspend", protect, rbac("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "suspended" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User suspended", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/users/:id (Admin only)
router.delete("/:id", protect, rbac("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
