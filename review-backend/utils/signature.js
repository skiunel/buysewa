/**
 * eSewa Signature Utility
 * Creates HMAC SHA256 signatures for eSewa payment integration
 */

const crypto = require('crypto');

// eSewa Secret Key (from test credentials)
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';

/**
 * Create eSewa signature for payment initiation
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Payment amount
 * @param {number} params.tax_amount - Tax amount
 * @param {string} params.transaction_uuid - Unique transaction UUID
 * @param {string} params.product_code - Product/Merchant code
 * @returns {string} Base64 encoded HMAC signature
 */
function createEsewaSignature({ amount, tax_amount, transaction_uuid, product_code }) {
  const message = `total_amount=${amount + tax_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY).update(message).digest('base64');
  return hmac;
}

/**
 * Verify eSewa callback signature
 * @param {Object} data - Callback data from eSewa
 * @param {string} data.signature - Signature from eSewa
 * @param {string} data.signed_field_names - Comma-separated field names
 * @returns {boolean} True if signature is valid
 */
function verifyEsewaSignature(data) {
  try {
    const signedFields = data.signed_field_names.split(',');
    const message = signedFields.map(f => `${f}=${data[f]}`).join(',');
    const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY).update(message).digest('base64');
    return hmac === data.signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

module.exports = {
  createEsewaSignature,
  verifyEsewaSignature
};




