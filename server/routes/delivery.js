import express from 'express';
import Delivery from '../controllers/delivery/index.js';
import grantAccess from '../middlewares/grantAccess.js';

const router = express.Router();

router.post('/admin/deliver/:order_id', grantAccess('update', 'order'), Delivery.MarkAsDelivered);
router.post('/verifySDC', grantAccess('create', 'review'), Delivery.VerifySDC);
router.get('/my-deliveries', grantAccess('read', 'delivery'), Delivery.GetUserDeliveries);

export default router;
