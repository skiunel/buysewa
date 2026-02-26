const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReviewSystem", function () {
  let reviewSystem;
  let owner;
  let addr1;
  let addr2;

  // Helper to create a deterministic SDC hash
  function sdcHash(sdcString) {
    return ethers.keccak256(ethers.toUtf8Bytes(sdcString));
  }

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const ReviewSystem = await ethers.getContractFactory("ReviewSystem");
    reviewSystem = await ReviewSystem.deploy();
    await reviewSystem.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the deployer as the owner", async function () {
      expect(await reviewSystem.owner()).to.equal(owner.address);
    });

    it("should initialize counters to zero", async function () {
      expect(await reviewSystem.totalSDCsCommitted()).to.equal(0);
      expect(await reviewSystem.totalReviewsSubmitted()).to.equal(0);
    });
  });

  describe("commitSDC", function () {
    it("should commit an SDC hash successfully", async function () {
      const hash = sdcHash("SDC-ORDER-001");
      await expect(reviewSystem.commitSDC(hash))
        .to.emit(reviewSystem, "SDCCommitted")
        .withArgs(hash);

      expect(await reviewSystem.isSDCCommitted(hash)).to.be.true;
      expect(await reviewSystem.totalSDCsCommitted()).to.equal(1);
    });

    it("should reject zero hash", async function () {
      await expect(
        reviewSystem.commitSDC(ethers.ZeroHash)
      ).to.be.revertedWith("SDC hash cannot be zero");
    });

    it("should reject duplicate SDC commit", async function () {
      const hash = sdcHash("SDC-ORDER-002");
      await reviewSystem.commitSDC(hash);
      await expect(reviewSystem.commitSDC(hash)).to.be.revertedWith(
        "SDC already committed"
      );
    });

    it("should reject non-owner from committing SDC", async function () {
      const hash = sdcHash("SDC-ORDER-003");
      await expect(
        reviewSystem.connect(addr1).commitSDC(hash)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("should commit multiple unique SDCs", async function () {
      const hash1 = sdcHash("SDC-ORDER-A");
      const hash2 = sdcHash("SDC-ORDER-B");
      const hash3 = sdcHash("SDC-ORDER-C");

      await reviewSystem.commitSDC(hash1);
      await reviewSystem.commitSDC(hash2);
      await reviewSystem.commitSDC(hash3);

      expect(await reviewSystem.totalSDCsCommitted()).to.equal(3);
      expect(await reviewSystem.isSDCCommitted(hash1)).to.be.true;
      expect(await reviewSystem.isSDCCommitted(hash2)).to.be.true;
      expect(await reviewSystem.isSDCCommitted(hash3)).to.be.true;
    });
  });

  describe("submitReview", function () {
    const testSDC = "SDC-REVIEW-001";
    const testIPFS = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
    let testHash;

    beforeEach(async function () {
      testHash = sdcHash(testSDC);
      await reviewSystem.commitSDC(testHash);
    });

    it("should submit a review successfully", async function () {
      await expect(reviewSystem.submitReview(testHash, testIPFS))
        .to.emit(reviewSystem, "ReviewSubmitted")
        .withArgs(testHash, testIPFS);

      expect(await reviewSystem.isSDCUsed(testHash)).to.be.true;
      expect(await reviewSystem.totalReviewsSubmitted()).to.equal(1);
    });

    it("should store correct review data", async function () {
      await reviewSystem.submitReview(testHash, testIPFS);
      const ipfs = await reviewSystem.getReview(testHash);
      expect(ipfs).to.equal(testIPFS);
    });

    it("should store full review details", async function () {
      await reviewSystem.submitReview(testHash, testIPFS);
      const [ipfsHash, submitter, timestamp] =
        await reviewSystem.getReviewDetails(testHash);

      expect(ipfsHash).to.equal(testIPFS);
      expect(submitter).to.equal(owner.address);
      expect(timestamp).to.be.gt(0);
    });

    it("should reject review for uncommitted SDC", async function () {
      const unknownHash = sdcHash("SDC-UNKNOWN");
      await expect(
        reviewSystem.submitReview(unknownHash, testIPFS)
      ).to.be.revertedWith("SDC not found on blockchain");
    });

    it("should reject double review with same SDC", async function () {
      await reviewSystem.submitReview(testHash, testIPFS);
      await expect(
        reviewSystem.submitReview(testHash, "QmDifferentHash")
      ).to.be.revertedWith("SDC already used for a review");
    });

    it("should reject review with empty IPFS hash", async function () {
      await expect(
        reviewSystem.submitReview(testHash, "")
      ).to.be.revertedWith("IPFS hash cannot be empty");
    });

    it("should reject review with zero SDC hash", async function () {
      await expect(
        reviewSystem.submitReview(ethers.ZeroHash, testIPFS)
      ).to.be.revertedWith("SDC hash cannot be zero");
    });

    it("should reject non-owner from submitting review", async function () {
      await expect(
        reviewSystem.connect(addr1).submitReview(testHash, testIPFS)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("getReview", function () {
    it("should return IPFS hash for submitted review", async function () {
      const hash = sdcHash("SDC-GET-001");
      const ipfs = "QmTestCID12345";
      await reviewSystem.commitSDC(hash);
      await reviewSystem.submitReview(hash, ipfs);

      expect(await reviewSystem.getReview(hash)).to.equal(ipfs);
    });

    it("should revert for non-existent review", async function () {
      const hash = sdcHash("SDC-NONEXIST");
      await expect(reviewSystem.getReview(hash)).to.be.revertedWith(
        "No review found for this SDC"
      );
    });
  });

  describe("getReviewDetails", function () {
    it("should revert for non-existent review", async function () {
      const hash = sdcHash("SDC-DETAILS-NONE");
      await expect(reviewSystem.getReviewDetails(hash)).to.be.revertedWith(
        "No review found for this SDC"
      );
    });
  });

  describe("isSDCCommitted / isSDCUsed", function () {
    it("should return false for uncommitted SDC", async function () {
      const hash = sdcHash("SDC-NEVER-COMMITTED");
      expect(await reviewSystem.isSDCCommitted(hash)).to.be.false;
    });

    it("should return false for unused SDC", async function () {
      const hash = sdcHash("SDC-NOT-USED");
      await reviewSystem.commitSDC(hash);
      expect(await reviewSystem.isSDCUsed(hash)).to.be.false;
    });
  });

  describe("transferOwnership", function () {
    it("should transfer ownership", async function () {
      await expect(reviewSystem.transferOwnership(addr1.address))
        .to.emit(reviewSystem, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);

      expect(await reviewSystem.owner()).to.equal(addr1.address);
    });

    it("should reject zero address", async function () {
      await expect(
        reviewSystem.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("New owner cannot be zero address");
    });

    it("should reject non-owner from transferring", async function () {
      await expect(
        reviewSystem.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("should allow new owner to perform actions after transfer", async function () {
      await reviewSystem.transferOwnership(addr1.address);
      const hash = sdcHash("SDC-NEW-OWNER");
      await expect(reviewSystem.connect(addr1).commitSDC(hash))
        .to.emit(reviewSystem, "SDCCommitted")
        .withArgs(hash);
    });
  });

  describe("Full buyer journey integration", function () {
    it("should complete: commit SDC -> submit review -> retrieve review", async function () {
      const sdc = "SDC-FULL-JOURNEY-001";
      const hash = sdcHash(sdc);
      const ipfsCID = "QmFullJourneyTestCID123456789abcdef";

      // Step 1: Commit SDC at order time
      await reviewSystem.commitSDC(hash);
      expect(await reviewSystem.isSDCCommitted(hash)).to.be.true;
      expect(await reviewSystem.isSDCUsed(hash)).to.be.false;

      // Step 2: Submit review with SDC
      await reviewSystem.submitReview(hash, ipfsCID);
      expect(await reviewSystem.isSDCUsed(hash)).to.be.true;

      // Step 3: Retrieve review
      const storedCID = await reviewSystem.getReview(hash);
      expect(storedCID).to.equal(ipfsCID);

      // Step 4: Verify double-use prevention
      await expect(
        reviewSystem.submitReview(hash, "QmAnotherAttempt")
      ).to.be.revertedWith("SDC already used for a review");

      // Step 5: Verify stats
      expect(await reviewSystem.totalSDCsCommitted()).to.equal(1);
      expect(await reviewSystem.totalReviewsSubmitted()).to.equal(1);
    });

    it("should handle multiple independent orders and reviews", async function () {
      const orders = [
        {
          sdc: "SDC-MULTI-001",
          ipfs: "QmReview1CID",
        },
        {
          sdc: "SDC-MULTI-002",
          ipfs: "QmReview2CID",
        },
        {
          sdc: "SDC-MULTI-003",
          ipfs: "QmReview3CID",
        },
      ];

      // Commit all SDCs
      for (const order of orders) {
        await reviewSystem.commitSDC(sdcHash(order.sdc));
      }
      expect(await reviewSystem.totalSDCsCommitted()).to.equal(3);

      // Submit reviews for first two
      await reviewSystem.submitReview(sdcHash(orders[0].sdc), orders[0].ipfs);
      await reviewSystem.submitReview(sdcHash(orders[1].sdc), orders[1].ipfs);
      expect(await reviewSystem.totalReviewsSubmitted()).to.equal(2);

      // Third SDC committed but not used
      expect(await reviewSystem.isSDCUsed(sdcHash(orders[2].sdc))).to.be.false;

      // Verify reviews
      expect(await reviewSystem.getReview(sdcHash(orders[0].sdc))).to.equal(
        orders[0].ipfs
      );
      expect(await reviewSystem.getReview(sdcHash(orders[1].sdc))).to.equal(
        orders[1].ipfs
      );
    });
  });
});
