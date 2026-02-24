import express from 'express';
import Order from '../controllers/order/index.js';
import grantAccess from '../middlewares/grantAccess.js';

const router = express.Router();

router.post('/', Order.Create);
router.get('/', Order.List);
router.get('/my-orders', Order.GetMyOrders);
router.delete('/:order_id', grantAccess('delete', 'order'), Order.Delete);

export default router;
