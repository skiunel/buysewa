import express from 'express';
import Analytics from '../controllers/analytics/index.js';

const router = express.Router();

router.get('/summary', Analytics.Summary);
router.get('/sales-over-time', Analytics.SalesOverTime);
router.get('/revenue-by-category', Analytics.RevenueByCategory);
router.get('/order-status', Analytics.OrderStatusBreakdown);
router.get('/top-products', Analytics.TopProducts);

export default router;
