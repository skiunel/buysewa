import { Router } from 'express';
import { verifyAccessToken } from '../helpers/jwt.js';
import Review from '../controllers/review/index.js';
import Store from '../controllers/store/index.js';

// routes
import auth from './auth.js';
import product from './product.js';
import order from './order.js';
import review from './review.js';
import delivery from './delivery.js';
import web3Review from './web3Review.js';
import analytics from './analytics.js';
import store from './store.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'BuySewa API - Multi-Store Blockchain Review System', version: '2.0.0' });
});

// Public routes
router.get('/public/reviews/product/:product_id', Review.GetReviewsByProduct);
router.get('/public/store/:domain', Store.GetStoreByDomain);

// Auth routes
router.use('/auth', auth);

// Product routes (some public, some protected)
router.use('/product', product);

// Protected routes
router.use('/order', verifyAccessToken, order);
router.use('/review', review);
router.use('/delivery', verifyAccessToken, delivery);
router.use('/web3-review', verifyAccessToken, web3Review);
router.use('/analytics', verifyAccessToken, analytics);
router.use('/store', verifyAccessToken, store);

export default router;
