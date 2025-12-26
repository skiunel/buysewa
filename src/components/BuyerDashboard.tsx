import { Package, Star, Clock, CheckCircle, Truck, Heart, RotateCcw, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { useState, useEffect } from "react";
import { orderAPI, reviewAPI } from "../services/api";

interface BuyerDashboardProps {
  onNavigate: (page: string) => void;
}

// Orders will be fetched from backend

const wishlistItems = [
  {
    id: 1,
    name: "Gaming Mechanical Keyboard",
    price: 8999,
    originalPrice: 12999,
    image: "https://images.unsplash.com/photo-1548877395-599a9eb55747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzbWFydHBob25lfGVufDF8fHx8MTc1Nzg0NjM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    discount: "31% off",
    inStock: true
  },
  {
    id: 2,
    name: "Professional Camera Lens",
    price: 45999,
    originalPrice: 55999,
    image: "https://images.unsplash.com/photo-1548877395-599a9eb55747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBzbWFydHBob25lfGVufDF8fHx8MTc1Nzg0NjM3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    discount: "18% off",
    inStock: false
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-[#00CC99] text-white";
    case "shipped":
      return "bg-blue-500 text-white";
    case "processing":
      return "bg-[#FF6600] text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "processing":
      return <Clock className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

export function BuyerDashboard({ onNavigate }: BuyerDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    reviewsGiven: 0,
    wishlistItems: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // Fetch orders
        const ordersResponse = await orderAPI.getUserOrders(userId);
        if (ordersResponse.success) {
          setOrders(ordersResponse.data || []);
          setStats(prev => ({
            ...prev,
            totalOrders: ordersResponse.data?.length || 0,
            totalSpent: ordersResponse.data?.reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0
          }));
        }

        // Fetch reviews
        const reviewsResponse = await reviewAPI.getUserReviews(userId);
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data || []);
          setStats(prev => ({
            ...prev,
            reviewsGiven: reviewsResponse.data?.length || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your orders, wishlist, and account settings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Total orders placed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NPR {stats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime spending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reviewsGiven}</div>
              <p className="text-xs text-muted-foreground">
                All verified reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
              <Heart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Saved for later
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-6">
              {orders.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet. Start shopping!</p>
                  <Button className="mt-4" onClick={() => onNavigate("home")}>
                    Browse Products
                  </Button>
                </Card>
              ) : (
                orders.map((order) => (
                <Card key={order._id || order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber || order.id}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Ordered on {new Date(order.createdAt || order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4">
                          <ImageWithFallback
                            src={item.image || item.productId?.image}
                            alt={item.name || item.productId?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name || item.productId?.name}</h3>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} • NPR {item.price?.toLocaleString()}
                            </p>
                          </div>
                          {order.status === "delivered" && order.sdcCodes?.some((sdc: any) => sdc.productId?.toString() === (item.productId?._id || item.productId)?.toString() && !sdc.isUsed) && (
                            <Button
                              onClick={() => onNavigate("review")}
                              size="sm"
                              className="bg-[#00CC99] hover:bg-[#00b88a] text-white"
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-4">
                          <Button variant="outline" size="sm">
                            <Package className="h-4 w-4 mr-1" />
                            Track Order
                          </Button>
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Return
                            </Button>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">Total: NPR {order.total?.toLocaleString()}</p>
                          {order.sdcCodes && order.sdcCodes.length > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              {order.sdcCodes.map((sdc: any, idx: number) => (
                                <p key={idx}>SDC: {sdc.sdcCode}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )))}
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group">
                  <div className="relative">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-[#FF6600] text-white">
                      {item.discount}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{item.name}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-bold text-[#003366]">NPR {item.price.toLocaleString()}</span>
                      <span className="text-gray-500 line-through text-sm">NPR {item.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white"
                        disabled={!item.inStock}
                        onClick={() => onNavigate("product")}
                      >
                        {item.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Remove from Wishlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Reviews</CardTitle>
                <p className="text-sm text-gray-600">
                  All your reviews are blockchain verified and help other customers make informed decisions.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No reviews yet. Submit your first review!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id || review.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <ImageWithFallback
                            src={review.productId?.image || "https://via.placeholder.com/48"}
                            alt={review.productId?.name || "Product"}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{review.productId?.name || "Product"}</h3>
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
                            <p className="text-sm text-gray-600">
                              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                          </div>
                        </div>
                        <Badge className={review.verified ? "bg-[#00CC99] text-white" : "bg-gray-400"}>
                          {review.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1">Rajesh Kumar</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1">rajesh.kumar@email.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1">+977-98XXXXXXXX</p>
                  </div>
                  <Button variant="outline">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Address Book</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Home Address</span>
                      <Badge variant="outline">Default</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Kathmandu-15, Baneshwor<br />
                      Kathmandu, Nepal<br />
                      44600
                    </p>
                  </div>
                  <Button variant="outline">Add New Address</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}