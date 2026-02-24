/**
 * Seed script - creates admin users, sample stores, products and orders.
 * Run with: node --experimental-vm-modules server/scripts/seed.js
 * Or via package.json script: npm run seed (from /server directory)
 */
import '../clients/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import Order from '../models/Order.js';

// Superadmin
const superAdminData = {
  email: 'superadmin@buysewa.app',
  password: 'Admin@1234',
  role: 'superadmin',
  name: 'Super Admin',
};

// Store-specific admins
const storeAdmins = [
  { email: 'admin@electronics.buysewa.app', password: 'Admin@1234', role: 'admin', name: 'Electronics Admin' },
  { email: 'admin@fashion.buysewa.app', password: 'Admin@1234', role: 'admin', name: 'Fashion Admin' },
  { email: 'admin@grocery.buysewa.app', password: 'Admin@1234', role: 'admin', name: 'Grocery Admin' },
];

// Legacy admin for compatibility
const legacyAdmin = {
  email: 'admin@buysewa.app',
  password: 'Admin@1234',
  role: 'admin',
  name: 'Store Admin',
};

// Store definitions
const storeDefinitions = [
  {
    name: 'BuySewa Electronics',
    domain: 'electronics',
    description: 'Top-quality electronics, gadgets and accessories',
    theme: { primaryColor: '#3182CE', secondaryColor: '#805AD5' },
    adminEmail: 'admin@electronics.buysewa.app',
  },
  {
    name: 'BuySewa Fashion',
    domain: 'fashion',
    description: 'Trendy clothing, shoes and accessories',
    theme: { primaryColor: '#D53F8C', secondaryColor: '#ED8936' },
    adminEmail: 'admin@fashion.buysewa.app',
  },
  {
    name: 'BuySewa Grocery',
    domain: 'grocery',
    description: 'Fresh groceries and daily essentials delivered fast',
    theme: { primaryColor: '#38A169', secondaryColor: '#48BB78' },
    adminEmail: 'admin@grocery.buysewa.app',
  },
];

// Products by store domain
const productsByStore = {
  electronics: [
    { title: 'Wireless Bluetooth Headphones', description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.', price: 2999, photos: ['https://picsum.photos/seed/headphones/400/300'], inStock: true, quantity: 50, category: 'Electronics' },
    { title: 'Smart Watch Series 5', description: '1.4" AMOLED display smartwatch with heart rate monitor, GPS and 7-day battery.', price: 8999, photos: ['https://picsum.photos/seed/watch/400/300'], inStock: true, quantity: 30, category: 'Electronics' },
    { title: 'USB-C Laptop Charger 65W', description: 'Universal 65W USB-C charger compatible with all modern laptops and devices.', price: 1499, photos: ['https://picsum.photos/seed/charger/400/300'], inStock: true, quantity: 100, category: 'Electronics' },
    { title: '4K Gaming Monitor 27"', description: 'IPS panel with 144Hz refresh rate and 1ms response time. Perfect for gaming.', price: 24999, photos: ['https://picsum.photos/seed/monitor/400/300'], inStock: true, quantity: 15, category: 'Electronics' },
    { title: 'Mechanical Keyboard RGB', description: 'TKL mechanical keyboard with Cherry MX switches and per-key RGB lighting.', price: 6499, photos: ['https://picsum.photos/seed/keyboard/400/300'], inStock: true, quantity: 40, category: 'Electronics' },
  ],
  fashion: [
    { title: 'Premium Cotton T-Shirt', description: 'Soft, breathable 100% cotton t-shirt available in multiple colours.', price: 499, photos: ['https://picsum.photos/seed/tshirt/400/300'], inStock: true, quantity: 200, category: 'Clothing' },
    { title: 'Slim Fit Denim Jeans', description: 'Classic 5-pocket slim fit jeans in stretch denim for all-day comfort.', price: 1899, photos: ['https://picsum.photos/seed/jeans/400/300'], inStock: true, quantity: 80, category: 'Clothing' },
    { title: 'Running Shoes Pro', description: 'Lightweight, cushioned running shoes with responsive foam sole.', price: 3499, photos: ['https://picsum.photos/seed/shoes/400/300'], inStock: true, quantity: 60, category: 'Footwear' },
    { title: 'Leather Crossbody Bag', description: 'Genuine leather crossbody bag with multiple compartments and adjustable strap.', price: 2999, photos: ['https://picsum.photos/seed/bag/400/300'], inStock: true, quantity: 25, category: 'Accessories' },
    { title: 'Aviator Sunglasses', description: 'Classic aviator sunglasses with UV400 protection and polarized lenses.', price: 1299, photos: ['https://picsum.photos/seed/sunglasses/400/300'], inStock: false, quantity: 0, category: 'Accessories' },
  ],
  grocery: [
    { title: 'Organic Basmati Rice 5kg', description: 'Premium aged organic basmati rice, low glycaemic index, aromatic.', price: 599, photos: ['https://picsum.photos/seed/rice/400/300'], inStock: true, quantity: 500, category: 'Grains' },
    { title: 'Extra Virgin Olive Oil 1L', description: 'Cold-pressed extra virgin olive oil from Mediterranean groves.', price: 899, photos: ['https://picsum.photos/seed/oliveoil/400/300'], inStock: true, quantity: 120, category: 'Oils' },
    { title: 'Fresh Avocados (Pack of 4)', description: 'Hass variety avocados, perfectly ripe and ready to eat.', price: 299, photos: ['https://picsum.photos/seed/avocado/400/300'], inStock: true, quantity: 200, category: 'Fruits' },
    { title: 'Green Tea 100 Bags', description: 'Premium Japanese green tea with antioxidants. Individually wrapped.', price: 349, photos: ['https://picsum.photos/seed/greentea/400/300'], inStock: true, quantity: 150, category: 'Beverages' },
    { title: 'Himalayan Pink Salt 1kg', description: 'Unrefined natural Himalayan pink salt rich in minerals.', price: 199, photos: ['https://picsum.photos/seed/salt/400/300'], inStock: true, quantity: 300, category: 'Condiments' },
  ],
};

// General products (legacy/main store)
const generalProducts = [
  { title: 'Stainless Steel Water Bottle', description: 'Insulated 750ml stainless steel bottle that keeps drinks cold for 24 hours.', price: 799, photos: ['https://picsum.photos/seed/bottle/400/300'], inStock: true, quantity: 100, category: 'Kitchen' },
  { title: 'JavaScript: The Good Parts', description: 'Bestselling programming book covering the most reliable features of JavaScript.', price: 649, photos: ['https://picsum.photos/seed/jsbook/400/300'], inStock: true, quantity: 30, category: 'Books' },
];

async function seed() {
  try {
    await new Promise((r) => setTimeout(r, 1500));

    // Superadmin
    let superAdmin = await User.findOne({ email: superAdminData.email });
    if (!superAdmin) {
      superAdmin = new User(superAdminData);
      await superAdmin.save();
      console.log('Superadmin created:', superAdminData.email);
    } else {
      console.log('Superadmin already exists:', superAdminData.email);
    }

    // Legacy admin
    let legacy = await User.findOne({ email: legacyAdmin.email });
    if (!legacy) {
      legacy = new User(legacyAdmin);
      await legacy.save();
      console.log('Legacy admin created:', legacyAdmin.email);
    }

    // Store admins
    const adminUsers = {};
    for (const adminData of storeAdmins) {
      let admin = await User.findOne({ email: adminData.email });
      if (!admin) {
        admin = new User(adminData);
        await admin.save();
        console.log('Store admin created:', adminData.email);
      }
      adminUsers[adminData.email] = admin;
    }

    // Stores
    const storeMap = {};
    for (const storeDef of storeDefinitions) {
      let store = await Store.findOne({ domain: storeDef.domain });
      if (!store) {
        const adminUser = adminUsers[storeDef.adminEmail];
        store = new Store({
          name: storeDef.name,
          domain: storeDef.domain,
          description: storeDef.description,
          theme: storeDef.theme,
          owner: adminUser._id,
          isActive: true,
        });
        await store.save();
        // Link admin to store
        await User.findByIdAndUpdate(adminUser._id, { store: store._id });
        console.log(`Store created: ${storeDef.name} (${storeDef.domain})`);
      } else {
        console.log(`Store already exists: ${storeDef.domain}`);
      }
      storeMap[storeDef.domain] = store;
    }

    // Products per store
    for (const [domain, products] of Object.entries(productsByStore)) {
      const store = storeMap[domain];
      for (const p of products) {
        const exists = await Product.findOne({ title: p.title });
        if (!exists) {
          await Product.create({ ...p, store: store?._id });
          console.log(`Product created [${domain}]: ${p.title}`);
        }
      }
    }

    // General products
    for (const p of generalProducts) {
      const exists = await Product.findOne({ title: p.title });
      if (!exists) {
        await Product.create(p);
        console.log(`Product created [general]: ${p.title}`);
      }
    }

    // Sample orders with revenue data for analytics
    const allProducts = await Product.find({}).limit(10);
    const sampleUsers = await User.find({ role: 'user' }).limit(3);

    if (allProducts.length > 0) {
      const orderCount = await Order.countDocuments();
      if (orderCount === 0) {
        const sampleAddresses = [
          'Kathmandu, Nepal', 'Pokhara, Nepal', 'Lalitpur, Nepal',
          'Bhaktapur, Nepal', 'Butwal, Nepal',
        ];
        // Create 15 sample orders spread over last 30 days
        for (let i = 0; i < 15; i++) {
          const itemCount = Math.floor(Math.random() * 3) + 1;
          const items = allProducts.slice(i % allProducts.length, (i % allProducts.length) + itemCount);
          const totalAmount = items.reduce((s, p) => s + p.price, 0);
          const daysAgo = Math.floor(Math.random() * 30);
          const createdAt = new Date();
          createdAt.setDate(createdAt.getDate() - daysAgo);

          await Order.create({
            user: sampleUsers[0]?._id || superAdmin._id,
            adress: sampleAddresses[i % sampleAddresses.length],
            items: items.map((p) => p._id),
            store: items[0]?.store || null,
            totalAmount,
            createdAt,
          });
        }
        console.log('Sample orders created (15 orders)');
      } else {
        console.log('Orders already exist, skipping sample order creation');
      }
    }

    console.log('\n=== Seed complete ===');
    console.log('Credentials:');
    console.log('  Superadmin:   superadmin@buysewa.app  / Admin@1234');
    console.log('  Legacy Admin: admin@buysewa.app        / Admin@1234');
    console.log('  Electronics:  admin@electronics.buysewa.app / Admin@1234');
    console.log('  Fashion:      admin@fashion.buysewa.app     / Admin@1234');
    console.log('  Grocery:      admin@grocery.buysewa.app     / Admin@1234');
    console.log('\nStore URLs:');
    console.log('  /store/electronics  /store/fashion  /store/grocery');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seed();
