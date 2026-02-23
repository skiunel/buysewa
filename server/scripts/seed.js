/**
 * Seed script - creates an admin user and sample products.
 * Run with: node --experimental-vm-modules server/scripts/seed.js
 * Or via package.json script: npm run seed (from /server directory)
 */
import '../clients/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const adminData = {
  email: 'admin@buysewa.app',
  password: 'Admin@1234',
  role: 'admin',
};

const sampleProducts = [
  {
    title: 'Wireless Bluetooth Headphones',
    description:
      'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 2999,
    photos: ['https://via.placeholder.com/400x300?text=Headphones'],
    inStock: true,
    quantity: 50,
    category: 'Electronics',
  },
  {
    title: 'Premium Cotton T-Shirt',
    description: 'Soft, breathable 100% cotton t-shirt available in multiple colours.',
    price: 499,
    photos: ['https://via.placeholder.com/400x300?text=T-Shirt'],
    inStock: true,
    quantity: 200,
    category: 'Clothing',
  },
  {
    title: 'Stainless Steel Water Bottle',
    description: 'Insulated 750ml stainless steel bottle that keeps drinks cold for 24 hours.',
    price: 799,
    photos: ['https://via.placeholder.com/400x300?text=Bottle'],
    inStock: true,
    quantity: 100,
    category: 'Kitchen',
  },
  {
    title: 'JavaScript: The Good Parts',
    description:
      'Bestselling programming book covering the most reliable features of JavaScript.',
    price: 649,
    photos: ['https://via.placeholder.com/400x300?text=Book'],
    inStock: true,
    quantity: 30,
    category: 'Books',
  },
  {
    title: 'Running Shoes (Men)',
    description: 'Lightweight, cushioned running shoes suitable for road and trail running.',
    price: 3499,
    photos: ['https://via.placeholder.com/400x300?text=Shoes'],
    inStock: false,
    quantity: 0,
    category: 'Sports',
  },
];

async function seed() {
  try {
    // Wait for DB connection
    await new Promise((r) => setTimeout(r, 1500));

    // Admin user
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log('Admin user already exists:', adminData.email);
    } else {
      const admin = new User(adminData);
      await admin.save();
      console.log('Admin user created:', adminData.email);
    }

    // Sample products
    for (const p of sampleProducts) {
      const exists = await Product.findOne({ title: p.title });
      if (!exists) {
        await Product.create(p);
        console.log('Product created:', p.title);
      } else {
        console.log('Product already exists:', p.title);
      }
    }

    console.log('\nSeed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
