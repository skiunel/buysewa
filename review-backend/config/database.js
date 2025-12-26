const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
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

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n   📝 Please ensure:');
      console.error('   1. Your .env file exists in review-backend/');
      console.error('   2. MONGODB_URI is set with correct credentials:');
      console.error('   MONGODB_URI=mongodb+srv://samirg9860_db_user:uy29dgECpCQMDwT1@buysewa.mongodb.net/buysewa?retryWrites=true&w=majority');
    }
    
    // Don't exit on connection error - allow retry
    setTimeout(() => {
      console.log('🔄 Retrying connection in 5 seconds...');
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;
