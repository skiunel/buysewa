/**
 * SDC (Secure Digital Code) Management Service
 * Generates, stores, and manages SDC codes for orders
 */

const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class SDCService {
  /**
   * Generate a new SDC code
   * Format: BUYSEWA-XXXXXXXX-XXXXXXXX (32 characters)
   * @returns {string} New SDC code
   */
  static generateSDCCode() {
    try {
      // Generate two 16-character random segments
      const segment1 = crypto.randomBytes(8).toString('hex').toUpperCase().slice(0, 8);
      const segment2 = crypto.randomBytes(8).toString('hex').toUpperCase().slice(0, 8);
      
      const sdcCode = `BUYSEWA-${segment1}-${segment2}`;
      
      return sdcCode;
    } catch (error) {
      console.error('Error generating SDC code:', error);
      throw error;
    }
  }

  /**
   * Generate multiple SDC codes
   * @param {number} count - Number of codes to generate
   * @returns {array} Array of SDC codes
   */
  static generateMultipleSDCCodes(count = 1) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(this.generateSDCCode());
    }
    return codes;
  }

  /**
   * Hash SDC code using bcryptjs
   * @param {string} sdcCode - The SDC code to hash
   * @returns {string} Hashed code
   */
  static async hashSDCCode(sdcCode) {
    try {
      const saltRounds = 10;
      const hashedCode = await bcryptjs.hash(sdcCode, saltRounds);
      return hashedCode;
    } catch (error) {
      console.error('Error hashing SDC code:', error);
      throw error;
    }
  }

  /**
   * Verify SDC code against hash
   * @param {string} sdcCode - The SDC code to verify
   * @param {string} hashedCode - The hashed code to compare against
   * @returns {boolean} True if code matches hash
   */
  static async verifySDCCode(sdcCode, hashedCode) {
    try {
      const isMatch = await bcryptjs.compare(sdcCode, hashedCode);
      return isMatch;
    } catch (error) {
      console.error('Error verifying SDC code:', error);
      throw error;
    }
  }

  /**
   * Generate SDC code for order
   * Creates both a code and hash for storage
   * @param {number} orderId - Order ID
   * @param {number} productId - Product ID
   * @param {string} userId - User ID
   * @returns {object} {code, hash, orderId, productId, userId, generatedAt}
   */
  static async generateSDCForOrder(orderId, productId, userId) {
    try {
      const sdcCode = this.generateSDCCode();
      const sdcHash = await this.hashSDCCode(sdcCode);

      return {
        code: sdcCode,
        hash: sdcHash,
        orderId: orderId,
        productId: productId,
        userId: userId,
        generatedAt: new Date(),
        isUsed: false,
        blockchainTxHash: null
      };
    } catch (error) {
      console.error('Error generating SDC for order:', error);
      throw error;
    }
  }

  /**
   * Generate batch SDC codes for multiple orders
   * @param {array} orders - Array of orders [{orderId, productId, userId}]
   * @returns {array} Array of SDC objects
   */
  static async generateBatchSDCCodes(orders) {
    try {
      const sdcCodes = [];
      for (const order of orders) {
        const sdc = await this.generateSDCForOrder(order.orderId, order.productId, order.userId);
        sdcCodes.push(sdc);
      }
      return sdcCodes;
    } catch (error) {
      console.error('Error generating batch SDC codes:', error);
      throw error;
    }
  }

  /**
   * Create SDC from order details
   * @param {object} order - Order object
   * @returns {object} SDC object with code and hash
   */
  static async createSDCFromOrder(order) {
    try {
      if (!order._id || !order.userId) {
        throw new Error('Order must have _id and userId');
      }

      const sdcCode = this.generateSDCCode();
      const sdcHash = await this.hashSDCCode(sdcCode);

      // Extract product ID from first item if available
      const productId = order.items && order.items.length > 0 
        ? order.items[0].productId 
        : null;

      return {
        sdcCode: sdcCode,
        hashedSDC: sdcHash,
        orderId: order._id.toString(),
        userId: order.userId.toString(),
        productId: productId ? productId.toString() : null,
        isUsed: false,
        registeredOnBlockchain: false,
        blockchainTxHash: null,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating SDC from order:', error);
      throw error;
    }
  }

  /**
   * Validate SDC format
   * @param {string} sdcCode - The SDC code to validate
   * @returns {boolean} True if format is valid
   */
  static validateSDCFormat(sdcCode) {
    // Format: BUYSEWA-XXXXXXXX-XXXXXXXX
    const sdcRegex = /^BUYSEWA-[A-F0-9]{8}-[A-F0-9]{8}$/;
    return sdcRegex.test(sdcCode);
  }

  /**
   * Format SDC code for display
   * @param {string} sdcCode - The SDC code
   * @returns {string} Formatted code
   */
  static formatSDCForDisplay(sdcCode) {
    // Add spacing: BUYSEWA-XXXX-XXXX-XXXX-XXXX
    const code = sdcCode.replace(/-/g, '');
    if (code.length === 16) {
      return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}-${code.slice(12, 16)}`;
    }
    return sdcCode;
  }

  /**
   * Generate QR code data for SDC
   * Returns data that can be used to generate QR codes
   * @param {string} sdcCode - The SDC code
   * @param {number} orderId - Order ID
   * @returns {object} QR code data
   */
  static generateQRCodeData(sdcCode, orderId) {
    return {
      data: `buysewa://sdc/${sdcCode}?order=${orderId}`,
      format: 'QR',
      size: 300,
      correction: 'H'
    };
  }

  /**
   * Get SDC metadata
   * @param {string} sdcCode - The SDC code
   * @returns {object} Metadata
   */
  static getSDCMetadata(sdcCode) {
    const isValid = this.validateSDCFormat(sdcCode);
    
    return {
      code: sdcCode,
      isValid: isValid,
      format: 'BUYSEWA-XXXXXXXX-XXXXXXXX',
      length: sdcCode.length,
      createdAt: new Date()
    };
  }
}

module.exports = SDCService;
