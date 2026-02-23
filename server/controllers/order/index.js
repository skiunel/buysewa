import Boom from 'boom';
import Order from '../../models/Order.js';
import Delivery from '../../models/Delivery.js';
import OrderSchema from './validations.js';

const Create = async (req, res, next) => {
  const input = req.body;
  if (typeof input.items === 'string') {
    try { input.items = JSON.parse(input.items); } catch (e) { /* ignore */ }
  }

  const { error } = OrderSchema.validate(input);
  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  const { user_id } = req.payload;
  try {
    const order = new Order({
      user: user_id,
      adress: input.address,
      items: input.items,
    });
    const savedData = await order.save();
    res.json(savedData);
  } catch (e) {
    next(e);
  }
};

const List = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', '-password -__v')
      .populate('items');

    const ordersWithDeliveryStatus = await Promise.all(
      orders.map(async (order) => {
        const deliveries = await Delivery.find({ order: order._id, delivery_status: 'Delivered' });
        const orderObj = order.toObject();
        orderObj.deliveryStatus = deliveries.length > 0 ? 'Delivered' : 'Pending';
        return orderObj;
      })
    );

    res.json(ordersWithDeliveryStatus);
  } catch (e) {
    next(e);
  }
};

const GetMyOrders = async (req, res, next) => {
  const { user_id } = req.payload;
  try {
    const orders = await Order.find({ user: user_id }).populate('items');

    const ordersWithDeliveryStatus = await Promise.all(
      orders.map(async (order) => {
        const deliveries = await Delivery.find({
          order: order._id,
          user: user_id,
          delivery_status: 'Delivered',
        });
        const orderObj = order.toObject();
        orderObj.deliveryStatus = deliveries.length > 0 ? 'Delivered' : 'Pending';
        orderObj.deliveries = deliveries;
        return orderObj;
      })
    );

    res.json(ordersWithDeliveryStatus);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { order_id } = req.params;
  try {
    const order = await Order.findById(order_id);
    if (!order) {
      return next(Boom.notFound('Order not found'));
    }
    await Delivery.deleteMany({ order: order_id });
    await Order.findByIdAndDelete(order_id);
    res.json({ message: 'Order deleted successfully' });
  } catch (e) {
    next(e);
  }
};

export default { Create, List, GetMyOrders, Delete };
