// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReviewSystem
 * @notice Decentralized review system that prevents fake reviews using SDC verification.
 * @dev SDC hashes are committed at purchase time. Buyers must provide valid SDC to submit reviews.
 *      Reviews are stored on IPFS; only the content hash (CID) is stored on-chain.
 */
contract ReviewSystem {
    address public owner;

    struct Review {
        string ipfsHash;
        address submitter;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from SDC hash to whether it has been committed
    mapping(bytes32 => bool) public sdcCommitted;

    // Mapping from SDC hash to whether a review has been submitted for it
    mapping(bytes32 => bool) public sdcUsed;

    // Mapping from SDC hash to Review data
    mapping(bytes32 => Review) public reviews;

    // Total counts for stats
    uint256 public totalSDCsCommitted;
    uint256 public totalReviewsSubmitted;

    // Events
    event SDCCommitted(bytes32 indexed sdcHash);
    event ReviewSubmitted(bytes32 indexed sdcHash, string ipfsHash);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Commit an SDC hash to the blockchain at order creation time.
     * @param sdcHash The keccak256 hash of the Standard Delivery Code.
     */
    function commitSDC(bytes32 sdcHash) external onlyOwner {
        require(sdcHash != bytes32(0), "SDC hash cannot be zero");
        require(!sdcCommitted[sdcHash], "SDC already committed");

        sdcCommitted[sdcHash] = true;
        totalSDCsCommitted++;

        emit SDCCommitted(sdcHash);
    }

    /**
     * @notice Submit a review for a verified purchase.
     * @param sdcHash The keccak256 hash of the Standard Delivery Code.
     * @param ipfsHash The IPFS CID where the review content is stored.
     */
    function submitReview(bytes32 sdcHash, string memory ipfsHash) external onlyOwner {
        require(sdcHash != bytes32(0), "SDC hash cannot be zero");
        require(sdcCommitted[sdcHash], "SDC not found on blockchain");
        require(!sdcUsed[sdcHash], "SDC already used for a review");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        sdcUsed[sdcHash] = true;
        reviews[sdcHash] = Review({
            ipfsHash: ipfsHash,
            submitter: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        totalReviewsSubmitted++;

        emit ReviewSubmitted(sdcHash, ipfsHash);
    }

    /**
     * @notice Get the review IPFS CID for a given SDC hash.
     * @param sdcHash The keccak256 hash of the Standard Delivery Code.
     * @return The IPFS CID string of the review.
     */
    function getReview(bytes32 sdcHash) external view returns (string memory) {
        require(reviews[sdcHash].exists, "No review found for this SDC");
        return reviews[sdcHash].ipfsHash;
    }

    /**
     * @notice Get full review details for a given SDC hash.
     * @param sdcHash The keccak256 hash of the Standard Delivery Code.
     * @return ipfsHash The IPFS CID.
     * @return submitter The address that submitted the review.
     * @return timestamp The block timestamp of submission.
     */
    function getReviewDetails(bytes32 sdcHash)
        external
        view
        returns (
            string memory ipfsHash,
            address submitter,
            uint256 timestamp
        )
    {
        require(reviews[sdcHash].exists, "No review found for this SDC");
        Review memory r = reviews[sdcHash];
        return (r.ipfsHash, r.submitter, r.timestamp);
    }

    /**
     * @notice Check if an SDC hash has been committed.
     * @param sdcHash The keccak256 hash of the Standard Delivery Code.
     * @return True if the SDC has been committed.
     */
    function isSDCCommitted(bytes32 sdcHash) external view returns (bool) {
        return sdcCommitted[sdcHash];
    }

    /**
     * @notice Check if an SDC hash has been used for a review.
     * @param sdcHash The keccak256 hash of the Standard Delivery Code.
     * @return True if the SDC has been used.
     */
    function isSDCUsed(bytes32 sdcHash) external view returns (bool) {
        return sdcUsed[sdcHash];
    }

    /**
     * @notice Transfer ownership of the contract.
     * @param newOwner The address of the new owner.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
