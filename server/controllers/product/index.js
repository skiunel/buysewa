import Boom from 'boom';
import Product from '../../models/Product.js';
import Review from '../../models/Review.js';

const Create = async (req, res, next) => {
  try {
    const input = req.body;
    if (!input.title) {
      return next(Boom.badRequest('Product name is required'));
    }
    const product = new Product(input);
    const savedData = await product.save();
    res.json(savedData);
  } catch (e) {
    next(e);
  }
};

const GetList = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (e) {
    next(e);
  }
};

const Get = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const product = await Product.findById(product_id);
    if (!product) {
      return next(Boom.notFound('Product not found'));
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
};

const Update = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const updated = await Product.findByIdAndUpdate(product_id, req.body, { new: true });
    if (!updated) {
      return next(Boom.notFound('Product not found'));
    }
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    await Product.findByIdAndDelete(product_id);
    res.json({ message: 'Product deleted successfully' });
  } catch (e) {
    next(e);
  }
};

const GetRating = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const product = await Product.findById(product_id).select('overall_rating review_count');
    if (!product) {
      return next(Boom.notFound('Product not found'));
    }
    res.json({ overall_rating: product.overall_rating, review_count: product.review_count });
  } catch (e) {
    next(e);
  }
};

export default { Create, GetList, Get, Update, Delete, GetRating };
