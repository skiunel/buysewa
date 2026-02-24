import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buysewa_reviews';
  const isAtlas = uri.includes('mongodb+srv');

  try {
    const options = {
      serverApi: isAtlas
        ? { version: '1', strict: true, deprecationErrors: true }
        : undefined,
    };
    // Remove undefined keys
    Object.keys(options).forEach((k) => options[k] === undefined && delete options[k]);

    await mongoose.connect(uri, options);
    console.log(`MongoDB: Connected (${isAtlas ? 'Atlas' : 'Local'})`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

await connectDB();

export default mongoose;
