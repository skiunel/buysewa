const axios = require("axios");

const PINATA_BASE_URL = "https://api.pinata.cloud";

/**
 * Upload JSON data to IPFS via Pinata API.
 * @param {Object} data - The JSON data to upload.
 * @param {string} name - A name for the pinned content.
 * @returns {Object} - { ipfsHash, timestamp }
 */
const uploadToIPFS = async (data, name = "BlockReview") => {
  try {
    const apiKey = process.env.PINATA_API_KEY;
    const secretKey = process.env.PINATA_SECRET_API_KEY;

    if (!apiKey || !secretKey) {
      // Fallback: generate a mock IPFS hash for development
      console.warn("Pinata keys not configured, using mock IPFS hash");
      const mockHash =
        "Qm" +
        require("crypto").randomBytes(22).toString("hex").substring(0, 44);
      return {
        ipfsHash: mockHash,
        timestamp: new Date().toISOString(),
      };
    }

    const response = await axios.post(
      `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
      {
        pinataContent: data,
        pinataMetadata: {
          name: name,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      }
    );

    return {
      ipfsHash: response.data.IpfsHash,
      timestamp: response.data.Timestamp,
    };
  } catch (error) {
    console.error("IPFS upload error:", error.message);
    throw new Error("Failed to upload to IPFS");
  }
};

/**
 * Retrieve data from IPFS via Pinata gateway.
 * @param {string} hash - The IPFS CID.
 * @returns {Object} - The content stored at the CID.
 */
const getFromIPFS = async (hash) => {
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${hash}`
    );
    return response.data;
  } catch (error) {
    console.error("IPFS retrieval error:", error.message);
    throw new Error("Failed to retrieve from IPFS");
  }
};

module.exports = {
  uploadToIPFS,
  getFromIPFS,
};
