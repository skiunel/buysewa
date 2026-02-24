import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import Delivery from '../../models/Delivery.js';
import Review from '../../models/Review.js';

// Helper: get date range
const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

// Sales over time (last N days grouped by day)
const SalesOverTime = async (req, res, next) => {
  const { days = 30, storeId } = req.query;
  const { role, store } = req.payload;
  const { start } = getDateRange(parseInt(days));

  const filter = { createdAt: { $gte: start } };
  if (role === 'admin' && store) filter.store = store;
  if (storeId && role === 'superadmin') filter.store = storeId;

  try {
    const orders = await Order.find(filter).populate('items');
    const byDay = {};

    orders.forEach((order) => {
      const day = order.createdAt.toISOString().split('T')[0];
      if (!byDay[day]) byDay[day] = { date: day, orders: 0, revenue: 0 };
      byDay[day].orders += 1;
      const total = order.items.reduce((sum, p) => sum + (p?.price || 0), 0);
      byDay[day].revenue += order.totalAmount || total;
    });

    // Fill missing days with zeros
    const result = [];
    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push(byDay[key] || { date: key, orders: 0, revenue: 0 });
    }

    res.json(result);
  } catch (e) {
    next(e);
  }
};

// Revenue by category
const RevenueByCategory = async (req, res, next) => {
  const { storeId } = req.query;
  const { role, store } = req.payload;

  const filter = {};
  if (role === 'admin' && store) filter.store = store;
  if (storeId && role === 'superadmin') filter.store = storeId;

  try {
    const orders = await Order.find(filter).populate({
      path: 'items',
      select: 'category price title',
    });

    const byCategory = {};
    orders.forEach((order) => {
      order.items.forEach((product) => {
        if (!product) return;
        const cat = product.category || 'Uncategorized';
        if (!byCategory[cat]) byCategory[cat] = { category: cat, revenue: 0, count: 0 };
        byCategory[cat].revenue += product.price || 0;
        byCategory[cat].count += 1;
      });
    });

    res.json(Object.values(byCategory).sort((a, b) => b.revenue - a.revenue));
  } catch (e) {
    next(e);
  }
};

// Order status breakdown
const OrderStatusBreakdown = async (req, res, next) => {
  const { storeId } = req.query;
  const { role, store } = req.payload;

  const filter = {};
  if (role === 'admin' && store) filter.store = store;
  if (storeId && role === 'superadmin') filter.store = storeId;

  try {
    const orders = await Order.find(filter);
    const deliveries = await Delivery.find({});

    const deliveredIds = new Set(
      deliveries.filter((d) => d.delivery_status === 'Delivered').map((d) => d.order?.toString())
    );

    let delivered = 0, pending = 0, processing = 0;
    orders.forEach((o) => {
      if (deliveredIds.has(o._id.toString())) delivered++;
      else pending++;
    });

    res.json([
      { name: 'Delivered', value: delivered, color: '#48BB78' },
      { name: 'Pending', value: pending, color: '#ECC94B' },
      { name: 'Processing', value: processing, color: '#4299E1' },
    ]);
  } catch (e) {
    next(e);
  }
};

// Top selling products
const TopProducts = async (req, res, next) => {
  const { limit = 10, storeId } = req.query;
  const { role, store } = req.payload;

  const filter = {};
  if (role === 'admin' && store) filter.store = store;
  if (storeId && role === 'superadmin') filter.store = storeId;

  try {
    const orders = await Order.find(filter).populate('items', 'title price category');
    const productCount = {};
    const productRevenue = {};
    const productInfo = {};

    orders.forEach((order) => {
      order.items.forEach((product) => {
        if (!product) return;
        const id = product._id.toString();
        productCount[id] = (productCount[id] || 0) + 1;
        productRevenue[id] = (productRevenue[id] || 0) + (product.price || 0);
        productInfo[id] = { title: product.title, category: product.category, price: product.price };
      });
    });

    const result = Object.entries(productCount)
      .map(([id, count]) => ({
        id,
        title: productInfo[id]?.title || 'Unknown',
        category: productInfo[id]?.category || '',
        price: productInfo[id]?.price || 0,
        sales: count,
        revenue: productRevenue[id] || 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, parseInt(limit));

    res.json(result);
  } catch (e) {
    next(e);
  }
};

// Overall stats summary
const Summary = async (req, res, next) => {
  const { storeId } = req.query;
  const { role, store } = req.payload;

  const orderFilter = {};
  const productFilter = {};
  if (role === 'admin' && store) {
    orderFilter.store = store;
    productFilter.store = store;
  }
  if (storeId && role === 'superadmin') {
    orderFilter.store = storeId;
    productFilter.store = storeId;
  }

  try {
    const [totalOrders, totalProducts, totalUsers, orders, reviews] = await Promise.all([
      Order.countDocuments(orderFilter),
      Product.countDocuments(productFilter),
      User.countDocuments({ role: 'user' }),
      Order.find(orderFilter).populate('items', 'price'),
      Review.countDocuments(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((s, p) => s + (p?.price || 0), 0);
      return sum + (order.totalAmount || orderTotal);
    }, 0);

    const { start: monthStart } = getDateRange(30);
    const monthlyOrders = await Order.find({ ...orderFilter, createdAt: { $gte: monthStart } }).populate('items', 'price');
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((s, p) => s + (p?.price || 0), 0);
      return sum + (order.totalAmount || orderTotal);
    }, 0);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      monthlyOrders: monthlyOrders.length,
      totalReviews: reviews,
    });
  } catch (e) {
    next(e);
  }
};

export default { SalesOverTime, RevenueByCategory, OrderStatusBreakdown, TopProducts, Summary };
