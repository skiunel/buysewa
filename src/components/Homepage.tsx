import { useState, useEffect } from "react";
import { Shield, Star, ShoppingBag, Zap, Users, Award, TrendingUp, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { productAPI } from "../services/api";

interface HomepageProps {
  onNavigate: (page: string, productId?: number | string, category?: string) => void;
  user?: {
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    name: string;
  } | null;
}

// Categories will be fetched from backend
const defaultCategories = [
  { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1679896949191-dc62950076ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", count: 0 },
  { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1761124739764-2d1e81adf672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", count: 0 },
  { name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1580467469359-91a73a6e92ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", count: 0 },
  { name: "Sports & Fitness", slug: "sports-fitness", image: "https://images.unsplash.com/photo-1710814824560-943273e8577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", count: 0 },
  { name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1747210044397-9f2d19ccf096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", count: 0 }
];

const formatPrice = (price: number) => {
  return `NPR ${price.toLocaleString()}`;
};

const calculateDiscount = (price: number, originalPrice?: number) => {
  if (!originalPrice) return null;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `${discount}% OFF`;
};

export function Homepage({ onNavigate, user }: HomepageProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        if (response.success) {
          setProducts(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.tags?.includes('bestseller') || p.tags?.includes('premium')).slice(0, 6);
  const trendingProducts = products.filter(p => p.tags?.includes('trending')).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#003366] to-[#004080] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-6 w-6 text-[#00CC99]" />
                <span className="text-[#00CC99] font-medium">Shop with Trust – Blockchain Verified Reviews</span>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                {user ? (
                  user.role === 'seller' ? (
                    <>
                      Grow Your Business with
                      <span className="text-[#00CC99]"> Trusted Reviews</span>
                    </>
                  ) : user.role === 'admin' ? (
                    <>
                      Welcome,
                      <span className="text-[#00CC99]"> Admin</span> {user.name.split(' ')[0]}!
                    </>
                  ) : (
                    <>
                      Welcome back,
                      <span className="text-[#00CC99]"> {user.name.split(' ')[0]}</span>!
                    </>
                  )
                ) : (
                  <>
                    Nepal's Most Trusted
                    <span className="text-[#00CC99]"> E-Commerce</span> Platform
                  </>
                )}
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                {user?.role === 'seller' 
                  ? "Manage your products, track sales, and build customer trust with blockchain-verified reviews."
                  : user?.role === 'admin' 
                  ? "Monitor platform activity, manage users, and oversee blockchain verification system integrity."
                  : "Experience secure shopping with blockchain-verified reviews. No fake reviews, no compromises – just authentic customer experiences."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user?.role === 'seller' ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-[#FF6600] hover:bg-[#e55a00] text-white"
                      onClick={() => onNavigate("dashboard")}
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Seller Dashboard
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-[#003366]"
                    >
                      Add Products
                    </Button>
                  </>
                ) : user?.role === 'admin' ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-[#FF6600] hover:bg-[#e55a00] text-white"
                      onClick={() => onNavigate("dashboard")}
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      Admin Dashboard
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-[#003366]"
                    >
                      System Overview
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-[#FF6600] hover:bg-[#e55a00] text-white"
                      onClick={() => onNavigate("products")}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {user ? 'Continue Shopping' : 'Start Shopping'}
                    </Button>
                    {!user && (
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-[#003366]"
                        onClick={() => onNavigate("login")}
                      >
                        Join BUYSEWA
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1687962690367-f16b158ecc7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlY29tbWVyY2UlMjBzaG9wcGluZyUyMHRlY2hub2xvZ3klMjBibG9ja2NoYWlufGVufDF8fHx8MTc1ODE5MTk1MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern E-commerce Technology"
                className="rounded-lg shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#00CC99] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Blockchain Verified Reviews</h3>
              <p className="text-gray-600">Every review is cryptographically verified by actual buyers with delivery codes</p>
            </div>
            <div className="text-center">
              <div className="bg-[#FF6600] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast & Secure Delivery</h3>
              <p className="text-gray-600">Quick delivery across Nepal with secure payment and tracking</p>
            </div>
            <div className="text-center">
              <div className="bg-[#003366] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">100% authentic products with money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => onNavigate("products", undefined, category.name)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-200">{category.count} products</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button 
              variant="outline" 
              onClick={() => onNavigate("products")}
              className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
            >
              View All Products
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product._id || product.id} className="group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.originalPrice && (
                    <Badge className="absolute top-4 left-4 bg-[#FF6600] text-white">
                      {calculateDiscount(product.price, product.originalPrice)}
                    </Badge>
                  )}
                  {product.tags?.includes('bestseller') && (
                    <Badge className="absolute top-4 right-4 bg-[#003366] text-white">
                      Bestseller
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2 group-hover:text-[#003366] line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-bold text-[#003366]">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-[#00CC99]" />
                      <span className="text-sm text-[#00CC99] font-medium">
                        {product.verifiedReviews} Verified
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#003366] hover:bg-[#002244] text-white"
                      onClick={() => onNavigate("product", product._id || product.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-[#FF6600]" />
                <h2 className="text-3xl font-bold">Trending Now</h2>
              </div>
              <Button 
                variant="outline" 
                onClick={() => onNavigate("products")}
                className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white"
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <Card 
                  key={product._id || product.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => onNavigate("product", product._id || product.id)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-[#FF6600] text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 text-sm group-hover:text-[#003366]">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#003366]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#003366] to-[#004080] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Nepal's first e-commerce platform with blockchain-verified reviews, ensuring authenticity and trust in every transaction.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="h-10 w-10 text-[#00CC99] mx-auto mb-3" />
              <div className="text-3xl font-bold mb-2 text-[#00CC99]">50K+</div>
              <p className="text-gray-200">Happy Customers</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Package className="h-10 w-10 text-[#00CC99] mx-auto mb-3" />
              <div className="text-3xl font-bold mb-2 text-[#00CC99]">{products.length}+</div>
              <p className="text-gray-200">Products Available</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="h-10 w-10 text-[#00CC99] mx-auto mb-3" />
              <div className="text-3xl font-bold mb-2 text-[#00CC99]">100%</div>
              <p className="text-gray-200">Blockchain Verified</p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Award className="h-10 w-10 text-[#00CC99] mx-auto mb-3" />
              <div className="text-3xl font-bold mb-2 text-[#00CC99]">24/7</div>
              <p className="text-gray-200">Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}