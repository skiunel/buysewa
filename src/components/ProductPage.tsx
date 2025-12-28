import { useState } from "react";
import { Star, Shield, ShoppingCart, Heart, Share2, Truck, RotateCcw, Award, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { QuickBuyEsewa } from "./QuickBuyEsewa";
import { products } from "../data/products";
import { useCart } from "../contexts/CartContext";

interface ProductPageProps {
  onNavigate: (page: string, productId?: number) => void;
  productId?: number | null;
}

const productImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU3ODk2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU3ODk2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU3ODk2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080"
];

const reviews = [
  {
    id: 1,
    user: "Rajesh K.",
    rating: 5,
    date: "Dec 10, 2024",
    comment: "Excellent sound quality and comfortable to wear for long hours. The noise cancellation is impressive!",
    verified: true,
    blockchainHash: "0x7f8a4b2c...",
    helpful: 23,
    images: []
  },
  {
    id: 2,
    user: "Priya S.",
    rating: 4,
    date: "Dec 8, 2024",
    comment: "Good product overall. Battery life is as advertised. Only minor issue is the touch controls are a bit sensitive.",
    verified: true,
    blockchainHash: "0x3e9d1a5f...",
    helpful: 15,
    images: []
  },
  {
    id: 3,
    user: "Amit T.",
    rating: 5,
    date: "Dec 5, 2024",
    comment: "Amazing build quality and the case is premium. Fast charging is a game changer. Highly recommend!",
    verified: true,
    blockchainHash: "0x2b7c8e4a...",
    helpful: 31,
    images: []
  }
];

export function ProductPage({ onNavigate, productId }: ProductPageProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Get the product or default to first product
  const product = products.find(p => p.id === productId) || products[0];
  
  const productImages = product.images || [product.image, product.image, product.image];

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice) return null;
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return `${discount}% OFF`;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => onNavigate("home")} className="hover:text-[#003366]">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate("products")} className="hover:text-[#003366]">{product.category}</button>
          <span>/</span>
          <span className="text-[#003366]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <ImageWithFallback
                src={productImages[selectedImage]}
                alt="Product Image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-[#003366]" : "border-gray-200"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
              )}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-lg font-medium ml-2">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
                <Badge className="bg-[#00CC99] text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  {product.verifiedReviews} Verified
                </Badge>
              </div>
            </div>

            <div className="border-t border-b py-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-[#003366]">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                    <Badge className="bg-[#FF6600] text-white">
                      {calculateDiscount(product.price, product.originalPrice)}
                    </Badge>
                  </>
                )}
              </div>
              <p className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
              </p>
              {product.stockCount && product.stockCount < 20 && (
                <p className="text-orange-600 text-sm mt-1">
                  Only {product.stockCount} left in stock - Order soon!
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Key Features:</h3>
              <ul className="space-y-2 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#00CC99] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-[#FF6600] hover:bg-[#e55a00] text-white"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="pt-4">
              <QuickBuyEsewa
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-8 w-8 text-[#003366] mx-auto mb-2" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-600">2-3 days</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 text-[#003366] mx-auto mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-600">30 days</p>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-[#003366] mx-auto mb-2" />
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-gray-600">1 year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (245)</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                  {product.seller && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600">
                        <strong>Sold by:</strong> {product.seller}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-[#00CC99]" />
                      <span className="text-[#00CC99] font-medium">Blockchain Verified Reviews</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-4xl font-bold">4.8</span>
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-5 w-5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">Based on 245 reviews</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm w-2">{rating}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: rating === 5 ? "75%" : rating === 4 ? "20%" : "5%"
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {rating === 5 ? "184" : rating === 4 ? "49" : "12"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-[#00CC99] bg-opacity-10 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Shield className="h-5 w-5 text-[#00CC99]" />
                        <span className="font-medium text-[#00CC99]">Verification Status</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Reviews:</span>
                          <span className="font-medium">245</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified Buyers:</span>
                          <span className="font-medium text-[#00CC99]">189 (77%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blockchain Verified:</span>
                          <span className="font-medium text-[#00CC99]">189 (100%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <Badge className="bg-[#00CC99] text-white text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified Buyer
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <button className="text-gray-600 hover:text-[#003366]">
                            Helpful ({review.helpful})
                          </button>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            Blockchain Hash: {review.blockchainHash}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline" className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white">
                    Load More Reviews
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Technical Specifications</h3>
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium">{key}:</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Category:</span>
                      <span>{product.category}</span>
                    </div>
                    {product.subCategory && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Sub-Category:</span>
                        <span>{product.subCategory}</span>
                      </div>
                    )}
                    {product.brand && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">Brand:</span>
                        <span>{product.brand}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Seller:</span>
                      <span>{product.seller}</span>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}