import Boom from 'boom';
import Review from '../../models/Review.js';
import Delivery from '../../models/Delivery.js';
import Product from '../../models/Product.js';

const Create = async (req, res, next) => {
  const { user_id } = req.payload;
  const { product_id, rating, comment } = req.body;

  if (!rating) return next(Boom.badRequest('Rating is required'));
  if (!comment) return next(Boom.badRequest('Review content is required'));
  if (!product_id) return next(Boom.badRequest('Product ID is required'));

  try {
    // Check if user has received this product
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

    const review = new Review({
      user: user_id,
      product: product_id,
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Update product's overall rating
    const reviews = await Review.find({ product: product_id, hidden: false });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(product_id, {
      overall_rating: Math.round(avgRating * 10) / 10,
      review_count: reviews.length,
    });

    res.json(savedReview);
  } catch (e) {
    next(e);
  }
};

const GetReviewsByProduct = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const reviews = await Review.find({ product: product_id, hidden: false })
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) {
    next(e);
  }
};

const Update = async (req, res, next) => {
  const { reviewId } = req.params;
  const { role } = req.payload;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return next(Boom.notFound('Review not found'));

    if (review.blockchain_stored) {
      // Blockchain reviews can only have visibility changed
      if (req.body.hidden !== undefined) {
        review.hidden = req.body.hidden;
        await review.save();
        return res.json({ message: 'Review visibility updated', review });
      }
      return next(Boom.forbidden('Cannot edit blockchain-stored review content'));
    }

    const updated = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return next(Boom.notFound('Review not found'));

    if (review.blockchain_stored) {
      // Cannot delete blockchain reviews - hide instead
      review.hidden = true;
      await review.save();
      return res.json({ message: 'Blockchain review hidden (cannot be deleted)' });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (e) {
    next(e);
  }
};

const ListAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'email')
      .populate('product', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) {
    next(e);
  }
};

const GetAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'email')
      .populate('product', 'title photos')
      .sort({ createdAt: -1 });

    const reviewsWithStatus = reviews.map((r) => {
      const obj = r.toObject();
      obj.status = r.hidden ? 'HIDDEN' : 'VISIBLE';
      return obj;
    });

    res.json(reviewsWithStatus);
  } catch (e) {
    next(e);
  }
};

export default { Create, GetReviewsByProduct, Update, Delete, ListAllReviews, GetAllReviewsAdmin };
