const express = require("express");
const {
  getReviewFromChain,
  isSDCCommittedOnChain,
  isSDCUsedOnChain,
  getBlockchainStats,
} = require("../services/blockchainService");

const router = express.Router();

// GET /api/blockchain/review/:sdcHash
router.get("/review/:sdcHash", async (req, res) => {
  try {
    const { sdcHash } = req.params;
    const review = await getReviewFromChain(sdcHash);

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found on blockchain" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/blockchain/sdc/:sdcHash/status
router.get("/sdc/:sdcHash/status", async (req, res) => {
  try {
    const { sdcHash } = req.params;
    const [committed, used] = await Promise.all([
      isSDCCommittedOnChain(sdcHash),
      isSDCUsedOnChain(sdcHash),
    ]);

    res.json({ sdcHash, committed, used });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/blockchain/stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await getBlockchainStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
