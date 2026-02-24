import express from 'express';
import Product from '../controllers/product/index.js';
import grantAccess from '../middlewares/grantAccess.js';
import { verifyAccessToken } from '../helpers/jwt.js';

const router = express.Router();

router.post('/', verifyAccessToken, grantAccess('createAny', 'product'), Product.Create);
router.get('/', Product.GetList);
router.get('/:product_id/rating', Product.GetRating);
router.get('/:product_id', Product.Get);
router.put('/:product_id', verifyAccessToken, grantAccess('createAny', 'product'), Product.Update);
router.delete('/:product_id', verifyAccessToken, grantAccess('createAny', 'product'), Product.Delete);

export default router;
