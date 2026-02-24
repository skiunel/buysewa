import Boom from 'boom';
import crypto from 'crypto';
import Delivery from '../../models/Delivery.js';
import Order from '../../models/Order.js';
import User from '../../models/User.js';

const generateSDC = () => {
  return 'SDC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

const MarkAsDelivered = async (req, res, next) => {
  const { order_id } = req.params;
  try {
    const existingDeliveries = await Delivery.find({
      order: order_id,
      delivery_status: 'Delivered',
    });

    if (existingDeliveries.length > 0) {
      return res.status(400).json({
        message: 'This order has already been marked as delivered',
        deliveries: existingDeliveries,
      });
    }

    const order = await Order.findById(order_id).populate('user').populate('items');
    if (!order) return next(Boom.notFound('Order not found'));

    const user = await User.findById(order.user);
    if (!user) return next(Boom.notFound('User not found'));

    const deliveryPromises = order.items.map(async (productId) => {
      const existing = await Delivery.findOne({ order: order._id, product: productId });

      if (existing) {
        existing.delivery_status = 'Delivered';
        if (!existing.standard_delivery_code) {
          existing.standard_delivery_code = generateSDC();
        }
        return await existing.save();
      } else {
        const delivery_id = 'DEL-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const sdc = generateSDC();
        const delivery = new Delivery({
          user: order.user._id || order.user,
          email: user.email,
          product: productId,
          order: order._id,
          delivery_id,
          standard_delivery_code: sdc,
          delivery_status: 'Delivered',
        });
        return await delivery.save();
      }
    });

    const deliveries = await Promise.all(deliveryPromises);
    res.json({
      message: 'Order marked as delivered and SDC generated successfully',
      deliveries,
    });
  } catch (error) {
    next(error);
  }
};

const VerifySDC = async (req, res, next) => {
  const { user_id } = req.payload;
  const { product_id, sdc } = req.body;
  try {
    const delivery = await Delivery.findOne({
      user: user_id,
      product: product_id,
      standard_delivery_code: sdc,
      delivery_status: 'Delivered',
    });

    if (!delivery) {
      return next(Boom.unauthorized('You are not authorized to review this product. Invalid SDC.'));
    }

    req.sdcVerified = true;
    next();
  } catch (error) {
    next(error);
  }
};

const GetUserDeliveries = async (req, res, next) => {
  const { user_id } = req.payload;
  try {
    const deliveries = await Delivery.find({ user: user_id })
      .populate('product')
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    next(error);
  }
};

export default { MarkAsDelivered, VerifySDC, GetUserDeliveries };
