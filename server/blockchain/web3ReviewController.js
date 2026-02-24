import Boom from 'boom';
import web3Review from './web3Review.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const submitWeb3Review = async (req, res, next) => {
  try {
    const { user_id } = req.payload;
    const { product_id, rating, comment } = req.body;

    if (!req.web3Verified) {
      return next(Boom.unauthorized('You are not authorized to submit a Web3 review'));
    }

    if (!rating) return next(Boom.badRequest('Rating is required'));
    if (!comment) return next(Boom.badRequest('Review content is required'));

    const reviewData = {
      user_id: user_id.toString(),
      product_id,
      rating: Number(rating),
      comment,
      created_at: new Date().toISOString(),
    };

    // Add to blockchain (IPFS + Ethereum)
    const { tx, ipfsHash } = await web3Review.addReview(
      user_id.toString(),
      product_id,
      reviewData
    );

    // Save to MongoDB as well
    const review = new Review({
      user: user_id,
      product: product_id,
      rating: Number(rating),
      comment,
      blockchain_stored: true,
      ipfs_hash: ipfsHash,
      transaction_hash: tx.transactionHash,
    });
    await review.save();

    // Update product rating
    const reviews = await Review.find({ product: product_id, hidden: false });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(product_id, {
      overall_rating: Math.round(avgRating * 10) / 10,
      review_count: reviews.length,
    });

    res.json({
      success: true,
      message: 'Review submitted successfully to blockchain',
      data: {
        transaction_hash: tx.transactionHash,
        ipfs_hash: ipfsHash,
        block_number: tx.blockNumber,
        blockchain_stored: true,
      },
    });
  } catch (error) {
    console.error('Error submitting Web3 review:', error);
    return next(Boom.badImplementation(error.message || 'Failed to submit review to blockchain'));
  }
};

export const getWeb3Reviews = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const reviews = await web3Review.fetchReviews(product_id);
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching Web3 reviews:', error);
    return next(Boom.badImplementation('Failed to fetch reviews from blockchain'));
  }
};

export default { submitWeb3Review, getWeb3Reviews };
