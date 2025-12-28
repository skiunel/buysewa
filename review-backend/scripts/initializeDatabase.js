const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`\n MongoDB Connected: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}\n`);
    
    console.log(' Starting database initialization...\n');

    // Clear existing data
    console.log('  Clearing existing collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log(' Collections cleared\n');

    // Seed test users
    console.log(' Seeding users...');
    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@buysewa.com',
        password: await bcryptjs.hash('Admin@123', 10),
        role: 'admin',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE4',
        phoneNumber: '+977-1-1234567'
      },
      {
        name: 'Seller One',
        email: 'seller1@buysewa.com',
        password: await bcryptjs.hash('Seller@123', 10),
        role: 'seller',
        walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        phoneNumber: '+977-9841234567'
      },
      {
        name: 'Buyer One',
        email: 'buyer1@buysewa.com',
        password: await bcryptjs.hash('Buyer@123', 10),
        role: 'buyer',
        walletAddress: '0x1234567890123456789012345678901234567890',
        phoneNumber: '+977-9811111111'
      },
      {
        name: 'Buyer Two',
        email: 'buyer2@buysewa.com',
        password: await bcryptjs.hash('Buyer@123', 10),
        role: 'buyer',
        walletAddress: '0x2234567890123456789012345678901234567891',
        phoneNumber: '+977-9822222222'
      }
    ];

    const users = await User.insertMany(usersData);
    console.log(` Created ${users.length} users\n`);

    // Seed products
    console.log(' Seeding products...');
    const productsData = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 4999,
        category: 'Electronics',
        image: 'https://via.placeholder.com/300?text=Headphones',
        seller: users[1].email,
        inStock: true,
        stockCount: 50,
        rating: 4.5,
        reviews: 15
      },
      {
        name: 'USB-C Cable',
        description: 'Durable USB-C charging cable, 2 meters long',
        price: 599,
        category: 'Accessories',
        image: 'https://via.placeholder.com/300?text=USB-Cable',
        seller: users[1].email,
        inStock: true,
        stockCount: 100,
        rating: 4.2,
        reviews: 8
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        price: 2499,
        category: 'Office',
        image: 'https://via.placeholder.com/300?text=Laptop-Stand',
        seller: users[1].email,
        inStock: true,
        stockCount: 30,
        rating: 4.7,
        reviews: 20
      },
      {
        name: 'Phone Case',
        description: 'Protective phone case with shock absorption',
        price: 799,
        category: 'Accessories',
        image: 'https://via.placeholder.com/300?text=Phone-Case',
        seller: users[1].email,
        inStock: true,
        stockCount: 150,
        rating: 4.3,
        reviews: 25
      },
      {
        name: 'Screen Protector',
        description: 'Tempered glass screen protector with easy installation',
        price: 399,
        category: 'Accessories',
        image: 'https://via.placeholder.com/300?text=Screen-Protector',
        seller: users[1].email,
        inStock: true,
        stockCount: 200,
        rating: 4.4,
        reviews: 30
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(` Created ${products.length} products\n`);

    console.log('');
    console.log(' DATABASE INITIALIZATION COMPLETE!\n');
    console.log(' Summary:');
    console.log(`   • Users: ${users.length}`);
    console.log(`   • Products: ${products.length}`);
    console.log('\n Test Credentials:');
    console.log('   Admin:  admin@buysewa.com / Admin@123');
    console.log('   Seller: seller1@buysewa.com / Seller@123');
    console.log('   Buyer:  buyer1@buysewa.com / Buyer@123');
    console.log('   Buyer2: buyer2@buysewa.com / Buyer@123');
    console.log('\n Database Connection:');
    console.log(`   MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error(' Database Initialization Error:');
    console.error(error.message);
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n    Please ensure MONGODB_URI is set in .env file');
    }
    process.exit(1);
  }
};

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
