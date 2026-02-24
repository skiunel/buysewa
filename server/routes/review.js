import express from 'express';
import Review from '../controllers/review/index.js';
import grantAccess from '../middlewares/grantAccess.js';
import { verifyAccessToken } from '../helpers/jwt.js';

const router = express.Router();

router.post('/', verifyAccessToken, grantAccess('create', 'review'), Review.Create);
router.put('/:reviewId', verifyAccessToken, grantAccess('update', 'review'), Review.Update);
router.delete('/:reviewId', verifyAccessToken, grantAccess('delete', 'review'), Review.Delete);
router.get('/product/:product_id', Review.GetReviewsByProduct);
router.get('/all', verifyAccessToken, grantAccess('readAny', 'review'), Review.ListAllReviews);
router.get('/admin/all', verifyAccessToken, grantAccess('readAny', 'review'), Review.GetAllReviewsAdmin);

export default router;
