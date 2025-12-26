/**
 * Database Seeding Script
 * Seeds the database with real product data
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  // Electronics - Smartphones
  {
    name: "Samsung Galaxy S23 Ultra",
    description: "Experience the pinnacle of mobile technology with the Samsung Galaxy S23 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED display, powerful Snapdragon 8 Gen 2 processor, and revolutionary 200MP camera system.",
    price: 159999,
    originalPrice: 179999,
    category: "Electronics",
    subCategory: "Smartphones",
    image: "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    brand: "Samsung",
    seller: "TechMandu",
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "6.8\" Dynamic AMOLED 2X Display",
      "200MP Main Camera with Nightography",
      "Snapdragon 8 Gen 2 Processor",
      "5000mAh Battery with Fast Charging",
      "S Pen Included",
      "IP68 Water & Dust Resistance"
    ],
    specifications: {
      "Display": "6.8\" QHD+ Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 2",
      "RAM": "12GB",
      "Storage": "256GB",
      "Camera": "200MP + 12MP + 10MP + 10MP",
      "Battery": "5000mAh",
      "OS": "Android 13"
    },
    tags: ["trending", "premium"],
    status: "active"
  },
  {
    name: "Apple iPhone 15 Pro Max",
    description: "The most advanced iPhone ever. Featuring titanium design, A17 Pro chip, and revolutionary camera system.",
    price: 189999,
    originalPrice: 209999,
    category: "Electronics",
    subCategory: "Smartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    brand: "Apple",
    seller: "Apple Store Nepal",
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "6.7\" Super Retina XDR Display",
      "A17 Pro Chip",
      "48MP Main Camera",
      "Titanium Design",
      "USB-C Port",
      "Action Button"
    ],
    tags: ["premium", "bestseller"],
    status: "active"
  },
  // Electronics - Laptops
  {
    name: "Apple MacBook Air M2",
    description: "Supercharged by the next-generation M2 chip, the redesigned MacBook Air combines incredible performance and up to 18 hours of battery life.",
    price: 189999,
    originalPrice: 209999,
    category: "Electronics",
    subCategory: "Laptops",
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    brand: "Apple",
    seller: "Apple Store Nepal",
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "Apple M2 Chip with 8-Core CPU",
      "13.6\" Liquid Retina Display",
      "8GB Unified Memory",
      "256GB SSD Storage",
      "1080p FaceTime HD Camera",
      "Up to 18 Hours Battery Life"
    ],
    tags: ["premium", "bestseller"],
    status: "active"
  },
  // Electronics - Audio
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation with exceptional sound quality. The WH-1000XM5 headphones rewrite the rules for distraction-free listening.",
    price: 45999,
    originalPrice: 52999,
    category: "Electronics",
    subCategory: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    brand: "Sony",
    seller: "AudioHub Nepal",
    inStock: true,
    stockCount: 25,
    rating: 4.7,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "Industry Leading Noise Cancellation",
      "30 Hour Battery Life",
      "Multipoint Connection",
      "Speak-to-Chat Technology",
      "Premium Comfort",
      "LDAC & Hi-Res Audio"
    ],
    tags: ["trending"],
    status: "active"
  },
  // Fashion - Traditional
  {
    name: "Traditional Nepali Dhaka Topi",
    description: "Authentic handmade Dhaka Topi from Palpa district. Perfect for cultural occasions and festivals. Each piece is uniquely crafted by local artisans.",
    price: 599,
    originalPrice: 899,
    category: "Fashion",
    subCategory: "Traditional Wear",
    image: "https://images.unsplash.com/photo-1761124739764-2d1e81adf672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    seller: "Nepal Handicrafts",
    brand: "Palpa Dhaka",
    inStock: true,
    stockCount: 50,
    rating: 4.6,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "100% Handwoven Dhaka Fabric",
      "Traditional Palpa Design",
      "Adjustable Fit",
      "Lightweight & Comfortable",
      "Supports Local Artisans",
      "Perfect for Cultural Events"
    ],
    tags: ["traditional", "handmade", "cultural"],
    status: "active"
  },
  {
    name: "Pashmina Shawl - Pure Cashmere",
    description: "Luxurious pure Pashmina shawl from the Himalayan region. Incredibly soft, warm, and elegant. Perfect gift for loved ones.",
    price: 8999,
    originalPrice: 12999,
    category: "Fashion",
    subCategory: "Accessories",
    image: "https://images.unsplash.com/photo-1761124739764-2d1e81adf672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    seller: "Himalayan Pashmina House",
    brand: "Nepal Pashmina",
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "100% Pure Cashmere Pashmina",
      "Handwoven by Master Weavers",
      "Ultra Soft & Lightweight",
      "Natural Fiber",
      "Multiple Color Options",
      "Comes with Authenticity Certificate"
    ],
    tags: ["luxury", "handmade", "premium"],
    status: "active"
  },
  // Fashion - Footwear
  {
    name: "Nike Air Max 270 Sneakers",
    description: "Nike's biggest Air Max cushioning creates a soft, comfortable stride. The sleek, running-inspired design pairs with any outfit.",
    price: 14999,
    originalPrice: 17999,
    category: "Fashion",
    subCategory: "Footwear",
    image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    brand: "Nike",
    seller: "SportsGear Nepal",
    inStock: true,
    stockCount: 40,
    rating: 4.7,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "Max Air Cushioning",
      "Breathable Mesh Upper",
      "Foam Midsole",
      "Rubber Outsole",
      "Available in Multiple Sizes",
      "Genuine Nike Product"
    ],
    tags: ["bestseller", "sports"],
    status: "active"
  },
  // Home & Kitchen
  {
    name: "Philips Air Fryer HD9252/90",
    description: "Fry, bake, grill, roast, and even reheat with the Philips Air Fryer. Enjoy delicious food with up to 90% less fat using Rapid Air technology.",
    price: 18999,
    originalPrice: 22999,
    category: "Home & Living",
    subCategory: "Kitchen Appliances",
    image: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    brand: "Philips",
    seller: "HomeAppliances Nepal",
    inStock: true,
    stockCount: 20,
    rating: 4.6,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "4.1L Capacity",
      "Rapid Air Technology",
      "Digital Display",
      "7 Pre-set Menus",
      "Dishwasher Safe Parts",
      "1 Year Warranty"
    ],
    tags: ["trending", "kitchen"],
    status: "active"
  },
  {
    name: "Brass Singing Bowl Set",
    description: "Authentic Himalayan singing bowl handcrafted in Nepal. Perfect for meditation, yoga, sound healing, and mindfulness practices.",
    price: 2499,
    originalPrice: 3499,
    category: "Home & Living",
    subCategory: "Decor",
    image: "https://images.unsplash.com/photo-1580467469359-91a73a6e92ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    seller: "Himalayan Crafts",
    brand: "Traditional Nepal",
    inStock: true,
    stockCount: 35,
    rating: 4.9,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "Hand Hammered Brass",
      "Traditional Craftsmanship",
      "Includes Wooden Striker",
      "Cushion Included",
      "Rich, Deep Tones",
      "Perfect for Meditation"
    ],
    tags: ["handmade", "spiritual", "traditional"],
    status: "active"
  },
  // Sports & Fitness
  {
    name: "Yoga Mat - Premium Anti-Slip",
    description: "High-quality yoga mat with superior grip and cushioning. Perfect for yoga, pilates, and all floor exercises.",
    price: 1999,
    originalPrice: 2999,
    category: "Sports & Fitness",
    subCategory: "Yoga & Fitness",
    image: "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    brand: "YogaPro",
    seller: "FitLife Nepal",
    inStock: true,
    stockCount: 60,
    rating: 4.5,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "6mm Thickness",
      "Non-Slip Surface",
      "Eco-Friendly Material",
      "Easy to Clean",
      "Includes Carrying Strap",
      "Moisture Resistant"
    ],
    tags: ["fitness", "yoga"],
    status: "active"
  },
  // Books
  {
    name: "Nepal Travel Guide 2025",
    description: "Comprehensive travel guide to Nepal covering all major destinations, trekking routes, cultural sites, and practical travel tips.",
    price: 1499,
    originalPrice: 1999,
    category: "Books",
    subCategory: "Travel",
    image: "https://images.unsplash.com/photo-1747210044397-9f2d19ccf096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    seller: "Himalayan Books",
    brand: "Lonely Planet Nepal",
    inStock: true,
    stockCount: 45,
    rating: 4.7,
    reviews: 0,
    verifiedReviews: 0,
    features: [
      "Updated 2025 Edition",
      "Detailed Maps Included",
      "Trekking Route Information",
      "Cultural Insights",
      "Budget Travel Tips",
      "300+ Pages"
    ],
    tags: ["books", "travel"],
    status: "active"
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/buysewa');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Display summary
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Products by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedProducts();


