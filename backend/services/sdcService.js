const { v4: uuidv4 } = require("uuid");
const { ethers } = require("ethers");

/**
 * Generate a unique Standard Delivery Code (SDC).
 * Format: SDC-<UUID segment>-<timestamp hex>
 */
const generateSDC = () => {
  const uuid = uuidv4().replace(/-/g, "").substring(0, 12).toUpperCase();
  const timestamp = Date.now().toString(16).toUpperCase();
  return `SDC-${uuid}-${timestamp}`;
};

/**
 * Hash an SDC string to bytes32 for blockchain storage.
 */
const hashSDC = (sdc) => {
  return ethers.keccak256(ethers.toUtf8Bytes(sdc));
};

/**
 * Validate SDC format.
 */
const validateSDCFormat = (sdc) => {
  return typeof sdc === "string" && sdc.startsWith("SDC-") && sdc.length >= 16;
};

module.exports = {
  generateSDC,
  hashSDC,
  validateSDCFormat,
};
