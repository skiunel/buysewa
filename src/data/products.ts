export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subCategory?: string;
  rating: number;
  reviews: number;
  verifiedReviews: number;
  description: string;
  features: string[];
  specifications?: Record<string, string>;
  inStock: boolean;
  stockCount?: number;
  seller: string;
  brand?: string;
  tags?: string[];
}

export const products: Product[] = [
  // Electronics
  {
    id: 1,
    name: "Samsung Galaxy S23 Ultra",
    price: 159999,
    originalPrice: 179999,
    image: "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    category: "Electronics",
    subCategory: "Smartphones",
    rating: 4.8,
    reviews: 1234,
    verifiedReviews: 987,
    description: "Experience the pinnacle of mobile technology with the Samsung Galaxy S23 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED display, powerful Snapdragon 8 Gen 2 processor, and revolutionary 200MP camera system.",
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
    inStock: true,
    stockCount: 15,
    seller: "TechMandu",
    brand: "Samsung",
    tags: ["trending", "premium"]
  },
  {
    id: 2,
    name: "Apple MacBook Air M2",
    price: 189999,
    originalPrice: 209999,
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjIzNjQ3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Electronics",
    subCategory: "Laptops",
    rating: 4.9,
    reviews: 856,
    verifiedReviews: 734,
    description: "Supercharged by the next-generation M2 chip, the redesigned MacBook Air combines incredible performance and up to 18 hours of battery life into its strikingly thin aluminum enclosure.",
    features: [
      "Apple M2 Chip with 8-Core CPU",
      "13.6\" Liquid Retina Display",
      "8GB Unified Memory",
      "256GB SSD Storage",
      "1080p FaceTime HD Camera",
      "Up to 18 Hours Battery Life"
    ],
    inStock: true,
    stockCount: 8,
    seller: "Apple Store Nepal",
    brand: "Apple",
    tags: ["premium", "bestseller"]
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    price: 45999,
    originalPrice: 52999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU3ODk2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Electronics",
    subCategory: "Audio",
    rating: 4.7,
    reviews: 2341,
    verifiedReviews: 1876,
    description: "Industry-leading noise cancellation with exceptional sound quality. The WH-1000XM5 headphones rewrite the rules for distraction-free listening.",
    features: [
      "Industry Leading Noise Cancellation",
      "30 Hour Battery Life",
      "Multipoint Connection",
      "Speak-to-Chat Technology",
      "Premium Comfort",
      "LDAC & Hi-Res Audio"
    ],
    inStock: true,
    stockCount: 25,
    seller: "AudioHub Nepal",
    brand: "Sony",
    tags: ["trending"]
  },

  // Fashion & Clothing
  {
    id: 4,
    name: "Traditional Nepali Dhaka Topi",
    price: 599,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1761124739764-2d1e81adf672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG5lcGFsaSUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MjQyNjYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    subCategory: "Traditional Wear",
    rating: 4.6,
    reviews: 345,
    verifiedReviews: 289,
    description: "Authentic handmade Dhaka Topi from Palpa district. Perfect for cultural occasions and festivals. Each piece is uniquely crafted by local artisans.",
    features: [
      "100% Handwoven Dhaka Fabric",
      "Traditional Palpa Design",
      "Adjustable Fit",
      "Lightweight & Comfortable",
      "Supports Local Artisans",
      "Perfect for Cultural Events"
    ],
    inStock: true,
    stockCount: 50,
    seller: "Nepal Handicrafts",
    brand: "Palpa Dhaka",
    tags: ["traditional", "handmade", "cultural"]
  },
  {
    id: 5,
    name: "Pashmina Shawl - Pure Cashmere",
    price: 8999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1761124739764-2d1e81adf672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG5lcGFsaSUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MjQyNjYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    subCategory: "Accessories",
    rating: 4.8,
    reviews: 567,
    verifiedReviews: 478,
    description: "Luxurious pure Pashmina shawl from the Himalayan region. Incredibly soft, warm, and elegant. Perfect gift for loved ones or a treat for yourself.",
    features: [
      "100% Pure Cashmere Pashmina",
      "Handwoven by Master Weavers",
      "Ultra Soft & Lightweight",
      "Natural Fiber",
      "Multiple Color Options",
      "Comes with Authenticity Certificate"
    ],
    inStock: true,
    stockCount: 30,
    seller: "Himalayan Pashmina House",
    brand: "Nepal Pashmina",
    tags: ["luxury", "handmade", "premium"]
  },
  {
    id: 6,
    name: "Nike Air Max 270 Sneakers",
    price: 14999,
    originalPrice: 17999,
    image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjBzaG9lc3xlbnwxfHx8fDE3NjI0MjY2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    subCategory: "Footwear",
    rating: 4.7,
    reviews: 892,
    verifiedReviews: 743,
    description: "Nike's biggest Air Max cushioning creates a soft, comfortable stride. The sleek, running-inspired design pairs with any outfit.",
    features: [
      "Max Air Cushioning",
      "Breathable Mesh Upper",
      "Foam Midsole",
      "Rubber Outsole",
      "Available in Multiple Sizes",
      "Genuine Nike Product"
    ],
    inStock: true,
    stockCount: 40,
    seller: "SportsGear Nepal",
    brand: "Nike",
    tags: ["bestseller", "sports"]
  },

  // Home & Kitchen
  {
    id: 7,
    name: "Philips Air Fryer HD9252/90",
    price: 18999,
    originalPrice: 22999,
    image: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwYXBwbGlhbmNlc3xlbnwxfHx8fDE3NjIzNTMxMDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Home & Living",
    subCategory: "Kitchen Appliances",
    rating: 4.6,
    reviews: 1456,
    verifiedReviews: 1234,
    description: "Fry, bake, grill, roast, and even reheat with the Philips Air Fryer. Enjoy delicious food with up to 90% less fat using Rapid Air technology.",
    features: [
      "4.1L Capacity",
      "Rapid Air Technology",
      "Digital Display",
      "7 Pre-set Menus",
      "Dishwasher Safe Parts",
      "1 Year Warranty"
    ],
    inStock: true,
    stockCount: 20,
    seller: "HomeAppliances Nepal",
    brand: "Philips",
    tags: ["trending", "kitchen"]
  },
  {
    id: 8,
    name: "Brass Singing Bowl Set",
    price: 2499,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1580467469359-91a73a6e92ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXBhbGklMjBoYW5kaWNyYWZ0c3xlbnwxfHx8fDE3NjI0MjY2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Home & Living",
    subCategory: "Decor",
    rating: 4.9,
    reviews: 678,
    verifiedReviews: 589,
    description: "Authentic Himalayan singing bowl handcrafted in Nepal. Perfect for meditation, yoga, sound healing, and mindfulness practices.",
    features: [
      "Hand Hammered Brass",
      "Traditional Craftsmanship",
      "Includes Wooden Striker",
      "Cushion Included",
      "Rich, Deep Tones",
      "Perfect for Meditation"
    ],
    inStock: true,
    stockCount: 35,
    seller: "Himalayan Crafts",
    brand: "Traditional Nepal",
    tags: ["handmade", "spiritual", "traditional"]
  },

  // Sports & Fitness
  {
    id: 9,
    name: "Yoga Mat - Premium Anti-Slip",
    price: 1999,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc2MjQyMDY3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Sports & Fitness",
    subCategory: "Yoga & Fitness",
    rating: 4.5,
    reviews: 423,
    verifiedReviews: 356,
    description: "High-quality yoga mat with superior grip and cushioning. Perfect for yoga, pilates, and all floor exercises.",
    features: [
      "6mm Thickness",
      "Non-Slip Surface",
      "Eco-Friendly Material",
      "Easy to Clean",
      "Includes Carrying Strap",
      "Moisture Resistant"
    ],
    inStock: true,
    stockCount: 60,
    seller: "FitLife Nepal",
    brand: "YogaPro",
    tags: ["fitness", "yoga"]
  },

  // Books & Education
  {
    id: 10,
    name: "Nepal Travel Guide 2025",
    price: 1499,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1747210044397-9f2d19ccf096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIzMjU1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Books",
    subCategory: "Travel",
    rating: 4.7,
    reviews: 234,
    verifiedReviews: 198,
    description: "Comprehensive travel guide to Nepal covering all major destinations, trekking routes, cultural sites, and practical travel tips.",
    features: [
      "Updated 2025 Edition",
      "Detailed Maps Included",
      "Trekking Route Information",
      "Cultural Insights",
      "Budget Travel Tips",
      "300+ Pages"
    ],
    inStock: true,
    stockCount: 45,
    seller: "Himalayan Books",
    brand: "Lonely Planet Nepal",
    tags: ["books", "travel"]
  },

  // More Electronics
  {
    id: 11,
    name: "Samsung 55\" 4K Smart TV",
    price: 89999,
    originalPrice: 109999,
    image: "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Electronics",
    subCategory: "TV & Audio",
    rating: 4.8,
    reviews: 567,
    verifiedReviews: 489,
    description: "Crystal clear 4K resolution with HDR support. Built-in streaming apps and voice control for the ultimate entertainment experience.",
    features: [
      "55\" 4K UHD Display",
      "HDR10+ Support",
      "Smart TV with Tizen OS",
      "Built-in Netflix, YouTube",
      "Voice Control",
      "3 HDMI Ports"
    ],
    inStock: true,
    stockCount: 12,
    seller: "TechMandu",
    brand: "Samsung",
    tags: ["premium", "entertainment"]
  },
  {
    id: 12,
    name: "Canon EOS M50 Mark II",
    price: 92999,
    originalPrice: 105999,
    image: "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Electronics",
    subCategory: "Cameras",
    rating: 4.7,
    reviews: 345,
    verifiedReviews: 289,
    description: "Perfect for content creators and photography enthusiasts. Compact mirrorless camera with 4K video and excellent autofocus.",
    features: [
      "24.1MP APS-C Sensor",
      "4K Video Recording",
      "Dual Pixel Autofocus",
      "Vari-Angle Touchscreen",
      "Built-in WiFi & Bluetooth",
      "Eye Detection AF"
    ],
    inStock: true,
    stockCount: 8,
    seller: "Camera House Nepal",
    brand: "Canon",
    tags: ["photography", "premium"]
  },

  // More Fashion
  {
    id: 13,
    name: "Kurta Suruwal Set - Men's",
    price: 3999,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1761124739764-2d1e81adf672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG5lcGFsaSUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MjQyNjYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    subCategory: "Traditional Wear",
    rating: 4.6,
    reviews: 456,
    verifiedReviews: 389,
    description: "Traditional Nepali men's attire perfect for weddings, festivals, and cultural events. Made with premium cotton fabric.",
    features: [
      "Premium Cotton Fabric",
      "Traditional Design",
      "Comfortable Fit",
      "Available in Multiple Sizes",
      "Easy to Maintain",
      "Perfect for Festivals"
    ],
    inStock: true,
    stockCount: 25,
    seller: "Traditional Attire Nepal",
    brand: "Nepali Fashion",
    tags: ["traditional", "formal"]
  },
  {
    id: 14,
    name: "Adidas Running Shoes",
    price: 8999,
    originalPrice: 11999,
    image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjBzaG9lc3xlbnwxfHx8fDE3NjI0MjY2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    subCategory: "Footwear",
    rating: 4.7,
    reviews: 678,
    verifiedReviews: 567,
    description: "Lightweight running shoes with Boost technology for maximum energy return and comfort during your runs.",
    features: [
      "Boost Midsole Technology",
      "Breathable Mesh Upper",
      "Continental Rubber Outsole",
      "Flexible Fit",
      "Lightweight Design",
      "Multiple Color Options"
    ],
    inStock: true,
    stockCount: 35,
    seller: "SportsGear Nepal",
    brand: "Adidas",
    tags: ["sports", "running"]
  },
  {
    id: 15,
    name: "Designer Leather Wallet",
    price: 2499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc25lYWtlcnMlMjBzaG9lc3xlbnwxfHx8fDE3NjI0MjY2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fashion",
    subCategory: "Accessories",
    rating: 4.5,
    reviews: 234,
    verifiedReviews: 198,
    description: "Genuine leather wallet with multiple card slots and coin pocket. Slim design that fits comfortably in your pocket.",
    features: [
      "100% Genuine Leather",
      "RFID Protection",
      "Multiple Card Slots",
      "Coin Pocket",
      "Slim Design",
      "Gift Box Included"
    ],
    inStock: true,
    stockCount: 50,
    seller: "Leather Craft Nepal",
    brand: "LeatherLux",
    tags: ["accessories", "gift"]
  },

  // Home & Kitchen
  {
    id: 16,
    name: "Wooden Carved Photo Frame",
    price: 899,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1580467469359-91a73a6e92ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXBhbGklMjBoYW5kaWNyYWZ0c3xlbnwxfHx8fDE3NjI0MjY2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Home & Living",
    subCategory: "Decor",
    rating: 4.8,
    reviews: 123,
    verifiedReviews: 101,
    description: "Beautifully hand-carved wooden photo frame featuring traditional Nepali motifs. Perfect for displaying cherished memories.",
    features: [
      "Hand Carved Design",
      "Premium Wood",
      "Traditional Motifs",
      "Multiple Sizes Available",
      "Wall Mountable",
      "Artisan Crafted"
    ],
    inStock: true,
    stockCount: 40,
    seller: "Wood Art Nepal",
    brand: "Himalayan Woodcraft",
    tags: ["handmade", "decor", "gift"]
  },
  {
    id: 17,
    name: "Stainless Steel Pressure Cooker",
    price: 4999,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwYXBwbGlhbmNlc3xlbnwxfHx8fDE3NjIzNTMxMDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Home & Living",
    subCategory: "Kitchen Appliances",
    rating: 4.6,
    reviews: 890,
    verifiedReviews: 756,
    description: "High-quality stainless steel pressure cooker with multiple safety features. Cook delicious meals faster and save energy.",
    features: [
      "5L Capacity",
      "Food Grade Stainless Steel",
      "Multiple Safety Features",
      "Induction Compatible",
      "Easy to Clean",
      "5 Year Warranty"
    ],
    inStock: true,
    stockCount: 30,
    seller: "HomeAppliances Nepal",
    brand: "Prestige",
    tags: ["kitchen", "cooking"]
  },

  // Sports & Fitness
  {
    id: 18,
    name: "Adjustable Dumbbell Set",
    price: 9999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc2MjQyMDY3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Sports & Fitness",
    subCategory: "Gym Equipment",
    rating: 4.7,
    reviews: 567,
    verifiedReviews: 478,
    description: "Space-saving adjustable dumbbell set perfect for home workouts. Adjust weight from 2.5kg to 25kg with quick-change mechanism.",
    features: [
      "Adjustable 2.5kg - 25kg",
      "Quick-Change System",
      "Space Saving Design",
      "Durable Construction",
      "Non-Slip Grip",
      "Compact Storage"
    ],
    inStock: true,
    stockCount: 18,
    seller: "FitLife Nepal",
    brand: "PowerMax",
    tags: ["fitness", "home-gym"]
  },
  {
    id: 19,
    name: "Badminton Racket Set",
    price: 2999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc2MjQyMDY3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Sports & Fitness",
    subCategory: "Sports Equipment",
    rating: 4.5,
    reviews: 345,
    verifiedReviews: 289,
    description: "Professional badminton racket set including 2 rackets, shuttlecocks, and carrying case. Perfect for recreational and competitive play.",
    features: [
      "2 Premium Rackets",
      "Lightweight Carbon Frame",
      "10 Shuttlecocks Included",
      "Carrying Case",
      "Pre-strung & Ready to Play",
      "Beginner to Intermediate Level"
    ],
    inStock: true,
    stockCount: 42,
    seller: "SportsGear Nepal",
    brand: "Yonex",
    tags: ["sports", "outdoor"]
  },

  // Books
  {
    id: 20,
    name: "Learn Nepali Language Book",
    price: 799,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1747210044397-9f2d19ccf096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIzMjU1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Books",
    subCategory: "Education",
    rating: 4.6,
    reviews: 178,
    verifiedReviews: 145,
    description: "Comprehensive guide to learning Nepali language with easy-to-follow lessons, pronunciation guide, and cultural insights.",
    features: [
      "Beginner to Advanced",
      "Audio Guide Included",
      "Cultural Context",
      "Practice Exercises",
      "200+ Pages",
      "Updated Edition"
    ],
    inStock: true,
    stockCount: 60,
    seller: "Himalayan Books",
    brand: "Language Learning Nepal",
    tags: ["education", "language"]
  }
];

export const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzYyNDE3NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    count: products.filter(p => p.category === "Electronics").length,
    subCategories: ["Smartphones", "Laptops", "Audio", "TV & Audio", "Cameras"]
  },
  {
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1761124739764-2d1e81adf672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG5lcGFsaSUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MjQyNjYxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    count: products.filter(p => p.category === "Fashion").length,
    subCategories: ["Traditional Wear", "Footwear", "Accessories"]
  },
  {
    name: "Home & Living",
    slug: "home-living",
    image: "https://images.unsplash.com/photo-1580467469359-91a73a6e92ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXBhbGklMjBoYW5kaWNyYWZ0c3xlbnwxfHx8fDE3NjI0MjY2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    count: products.filter(p => p.category === "Home & Living").length,
    subCategories: ["Kitchen Appliances", "Decor", "Furniture"]
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    image: "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc2MjQyMDY3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    count: products.filter(p => p.category === "Sports & Fitness").length,
    subCategories: ["Yoga & Fitness", "Gym Equipment", "Sports Equipment"]
  },
  {
    name: "Books",
    slug: "books",
    image: "https://images.unsplash.com/photo-1747210044397-9f2d19ccf096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjIzMjU1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    count: products.filter(p => p.category === "Books").length,
    subCategories: ["Travel", "Education", "Fiction"]
  }
];
