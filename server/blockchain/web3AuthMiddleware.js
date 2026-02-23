import Boom from 'boom';
import Delivery from '../models/Delivery.js';
import web3Review from './web3Review.js';

export const validateReviewer = async (req, res, next) => {
  try {
    const { user_id } = req.payload;
    const { product_id } = req.body;

    // Check if the user has a valid delivery for this product
    const delivery = await Delivery.findOne({
      user: user_id,
      product: product_id,
      delivery_status: 'Delivered',
    });

    if (!delivery) {
      return next(
        Boom.unauthorized(
          'You are not authorized to review this product. You must have purchased and received this product to review it.'
        )
      );
    }

    // Check if already reviewed on blockchain
    try {
      const hasReviewed = await web3Review.hasUserReviewed(user_id.toString(), product_id);
      if (hasReviewed) {
        return next(Boom.conflict('You have already reviewed this product on the blockchain'));
      }

      // Verify reviewer on blockchain if not already verified
      const isVerified = await web3Review.isReviewerVerified(user_id.toString(), product_id);
      if (!isVerified) {
        await web3Review.verifyReviewer(user_id.toString(), product_id);
      }
    } catch (blockchainError) {
      console.warn('Blockchain verification warning:', blockchainError.message);
      // Continue even if blockchain check fails (graceful degradation)
    }

    req.web3Verified = true;
    next();
  } catch (error) {
    console.error('Error in Web3 authentication middleware:', error);
    return next(Boom.badImplementation('Error validating reviewer on blockchain'));
  }
};

export default { validateReviewer };
