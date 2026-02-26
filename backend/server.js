const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
// Fallback to .env.example for defaults
if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.join(__dirname, ".env.example") });
}

const connectDB = require("./config/db");
const { initBlockchain } = require("./config/blockchain");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const blockchainRoutes = require("./routes/blockchain");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/blockchain", blockchainRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "BlockReview API is running" });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize blockchain connection
    initBlockchain();

    app.listen(PORT, () => {
      console.log(`BlockReview server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    // Start without DB for development
    app.listen(PORT, () => {
      console.log(
        `BlockReview server running on port ${PORT} (without MongoDB)`
      );
    });
  }
};

// Export for testing
module.exports = app;

// Start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  startServer();
}
