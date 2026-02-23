import express from 'express';
import { submitWeb3Review, getWeb3Reviews } from '../blockchain/web3ReviewController.js';
import { validateReviewer } from '../blockchain/web3AuthMiddleware.js';

const router = express.Router();

router.post('/', validateReviewer, submitWeb3Review);
router.get('/product/:product_id', getWeb3Reviews);

export default router;
