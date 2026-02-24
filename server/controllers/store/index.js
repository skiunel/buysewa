import Boom from 'boom';
import Store from '../../models/Store.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

const Create = async (req, res, next) => {
  const { name, domain, description, logo, theme } = req.body;
  const { user_id, role } = req.payload;

  if (!name || !domain) {
    return next(Boom.badRequest('Name and domain are required'));
  }

  try {
    const existing = await Store.findOne({ domain: domain.toLowerCase() });
    if (existing) return next(Boom.conflict('Domain already in use'));

    const store = new Store({
      name,
      domain: domain.toLowerCase(),
      description: description || '',
      logo: logo || '',
      theme: theme || {},
      owner: user_id,
    });
    const saved = await store.save();

    // If creating admin for this store, link them
    if (role === 'superadmin') {
      const adminEmail = req.body.adminEmail;
      if (adminEmail) {
        await User.findOneAndUpdate(
          { email: adminEmail },
          { store: saved._id, role: 'admin' }
        );
      }
    } else {
      await User.findByIdAndUpdate(user_id, { store: saved._id });
    }

    res.json(saved);
  } catch (e) {
    next(e);
  }
};

const List = async (req, res, next) => {
  try {
    const stores = await Store.find({}).populate('owner', 'email name');
    res.json(stores);
  } catch (e) {
    next(e);
  }
};

const GetMyStore = async (req, res, next) => {
  const { user_id, store: storeId } = req.payload;
  try {
    if (!storeId) {
      const user = await User.findById(user_id).populate('store');
      if (!user?.store) return res.json(null);
      return res.json(user.store);
    }
    const store = await Store.findById(storeId).populate('owner', 'email name');
    res.json(store);
  } catch (e) {
    next(e);
  }
};

const Update = async (req, res, next) => {
  const { store_id } = req.params;
  const { user_id, role, store: userStore } = req.payload;

  // Only owner or superadmin can update
  if (role !== 'superadmin' && userStore?.toString() !== store_id) {
    return next(Boom.forbidden('You can only update your own store'));
  }

  try {
    const updated = await Store.findByIdAndUpdate(store_id, req.body, { new: true });
    if (!updated) return next(Boom.notFound('Store not found'));
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  const { store_id } = req.params;
  const { role } = req.payload;

  if (role !== 'superadmin') {
    return next(Boom.forbidden('Only superadmin can delete stores'));
  }

  try {
    await Store.findByIdAndDelete(store_id);
    // Unlink products and users
    await Product.updateMany({ store: store_id }, { store: null });
    await User.updateMany({ store: store_id }, { store: null, role: 'user' });
    res.json({ message: 'Store deleted' });
  } catch (e) {
    next(e);
  }
};

const GetStoreByDomain = async (req, res, next) => {
  const { domain } = req.params;
  try {
    const store = await Store.findOne({ domain: domain.toLowerCase(), isActive: true })
      .populate('owner', 'email name');
    if (!store) return next(Boom.notFound('Store not found'));
    res.json(store);
  } catch (e) {
    next(e);
  }
};

const AssignAdmin = async (req, res, next) => {
  const { store_id } = req.params;
  const { email } = req.body;
  const { role } = req.payload;

  if (role !== 'superadmin') {
    return next(Boom.forbidden('Only superadmin can assign admins'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return next(Boom.notFound('User not found'));

    const store = await Store.findById(store_id);
    if (!store) return next(Boom.notFound('Store not found'));

    await User.findByIdAndUpdate(user._id, { store: store_id, role: 'admin' });
    res.json({ message: `${email} assigned as admin for ${store.name}` });
  } catch (e) {
    next(e);
  }
};

export default { Create, List, GetMyStore, Update, Delete, GetStoreByDomain, AssignAdmin };
