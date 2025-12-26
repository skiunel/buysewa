import { useState } from "react";
import { Package, TrendingUp, ShoppingCart, Star, Plus, Edit, Trash2, Eye, DollarSign, Users, AlertCircle, CheckCircle, Shield, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SellerDashboardProps {
  onNavigate: (page: string) => void;
}

const myProducts = [
  {
    id: 1,
    name: "Traditional Dhaka Topi",
    category: "Traditional Clothing",
    price: 899,
    stock: 45,
    sold: 234,
    revenue: 210366,
    rating: 4.8,
    reviews: 67,
    verifiedReviews: 64,
    status: "active",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MjQxODMxOXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "Handwoven Pashmina Shawl",
    category: "Traditional Clothing",
    price: 4999,
    stock: 12,
    sold: 89,
    revenue: 444911,
    rating: 4.9,
    reviews: 34,
    verifiedReviews: 33,
    status: "active",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MjQxODMxOXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "Copper Water Bottle",
    category: "Home & Kitchen",
    price: 1299,
    stock: 0,
    sold: 156,
    revenue: 202644,
    rating: 4.7,
    reviews: 45,
    verifiedReviews: 44,
    status: "out_of_stock",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwa2l0Y2hlbnxlbnwxfHx8fDE3NjI0MTgzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "Nepali Khukuri Knife (Decorative)",
    category: "Handicrafts",
    price: 2499,
    stock: 8,
    sold: 67,
    revenue: 167433,
    rating: 4.6,
    reviews: 23,
    verifiedReviews: 23,
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0c3xlbnwxfHx8fDE3NjI0MTgzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    name: "Singing Bowl Set",
    category: "Handicrafts",
    price: 3499,
    stock: 23,
    sold: 112,
    revenue: 391888,
    rating: 4.9,
    reviews: 56,
    verifiedReviews: 55,
    status: "active",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0c3xlbnwxfHx8fDE3NjI0MTgzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const recentOrders = [
  {
    id: "#ORD-2024-5678",
    customer: "Sita Sharma",
    product: "Handwoven Pashmina Shawl",
    amount: 4999,
    status: "processing",
    date: "2 hours ago",
    sdcGenerated: false
  },
  {
    id: "#ORD-2024-5677",
    customer: "Ram Thapa",
    product: "Traditional Dhaka Topi",
    amount: 899,
    status: "shipped",
    date: "5 hours ago",
    sdcGenerated: true,
    sdcCode: "SDC-SELL-2024-123456"
  },
  {
    id: "#ORD-2024-5676",
    customer: "Maya Gurung",
    product: "Singing Bowl Set",
    amount: 3499,
    status: "delivered",
    date: "1 day ago",
    sdcGenerated: true,
    sdcCode: "SDC-SELL-2024-123455"
  }
];

const salesData = [
  { month: "Jul", sales: 45200, orders: 34 },
  { month: "Aug", sales: 56800, orders: 42 },
  { month: "Sep", sales: 67300, orders: 51 },
  { month: "Oct", sales: 78900, orders: 58 },
  { month: "Nov", sales: 89400, orders: 67 },
  { month: "Dec", sales: 102300, orders: 76 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-[#00CC99] text-white";
    case "out_of_stock":
      return "bg-red-500 text-white";
    case "low_stock":
      return "bg-[#FF6600] text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getOrderStatusColor = (status: string) => {
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

export function SellerDashboard({ onNavigate }: SellerDashboardProps) {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const totalRevenue = myProducts.reduce((sum, product) => sum + product.revenue, 0);
  const totalProducts = myProducts.length;
  const totalSold = myProducts.reduce((sum, product) => sum + product.sold, 0);
  const averageRating = (myProducts.reduce((sum, product) => sum + product.rating, 0) / myProducts.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your products, orders, and sales analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
              <Shield className="h-5 w-5 text-[#00CC99]" />
              <span className="text-[#00CC99] font-medium">Verified Seller</span>
            </div>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF6600] hover:bg-[#e55a00] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to your store
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name *</Label>
                      <Input id="product-name" placeholder="Enter product name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traditional">Traditional Clothing</SelectItem>
                          <SelectItem value="handicrafts">Handicrafts</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="home">Home & Kitchen</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="health">Health & Beauty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (NPR) *</Label>
                      <Input id="price" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your product..." 
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">Features (one per line)</Label>
                    <Textarea 
                      id="features" 
                      placeholder="100% authentic&#10;Handmade in Nepal&#10;Premium quality"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Product Images</Label>
                    <Input id="images" type="file" multiple accept="image/*" />
                    <p className="text-xs text-gray-500">Upload up to 5 images (JPG, PNG, max 5MB each)</p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-[#00CC99] hover:bg-[#00b88a] text-white">
                      Add Product
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#003366]">NPR {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#003366]">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active listings on BUYSEWA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#003366]">{totalSold}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#003366]">{averageRating}</div>
              <p className="text-xs text-muted-foreground">
                Based on verified reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Inventory</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search products..." className="w-64" />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>NPR {product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={product.stock === 0 ? "text-red-600 font-medium" : product.stock < 15 ? "text-orange-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell>NPR {product.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                            <span className="text-gray-500 text-sm">({product.reviews})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <p className="text-sm text-gray-600">Manage your customer orders, verify payments, and generate SDC codes</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{order.id}</h3>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          {order.paymentStatus && (
                            <Badge className={
                              order.paymentStatus === 'completed' ? 'bg-green-500' :
                              order.paymentStatus === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }>
                              Payment: {order.paymentStatus}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: {order.customer} • Product: {order.product}
                        </p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                        {order.sdcGenerated && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Shield className="h-4 w-4 text-[#00CC99]" />
                            <span className="text-xs text-[#00CC99] font-mono">{order.sdcCode}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="font-bold text-[#003366]">NPR {order.amount.toLocaleString()}</span>
                        {order.status === "processing" && (
                          <Button size="sm" className="bg-[#FF6600] hover:bg-[#e55a00] text-white">
                            Mark as Shipped
                          </Button>
                        )}
                        {order.status === "shipped" && !order.sdcGenerated && (
                          <Button size="sm" className="bg-[#00CC99] hover:bg-[#00b88a] text-white">
                            <Shield className="h-4 w-4 mr-1" />
                            Generate SDC
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Badge className="bg-[#00CC99] text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#00CC99" 
                        strokeWidth={2}
                        name="Sales (NPR)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#FF6600" name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProducts
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 3)
                      .map((product, index) => (
                        <div key={product.id} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-300" : "bg-orange-400"
                          }`}>
                            <span className="font-bold text-white">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-600">NPR {product.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Customers</span>
                      <span className="font-bold">342</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repeat Customers</span>
                      <span className="font-bold">128</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Satisfaction</span>
                      <Badge className="bg-[#00CC99] text-white">97%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Order Value</span>
                      <span className="font-bold">NPR 2,847</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Low Stock Alert</p>
                        <p className="text-xs text-gray-600">2 products need restocking</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">All Reviews Verified</p>
                        <p className="text-xs text-gray-600">100% blockchain verified</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Sales Improving</p>
                        <p className="text-xs text-gray-600">+18% this month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customer Reviews</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      All reviews are blockchain-verified and authentic
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-[#00CC99] bg-opacity-10 px-4 py-2 rounded-lg">
                    <Shield className="h-5 w-5 text-[#00CC99]" />
                    <div>
                      <p className="text-sm font-medium text-[#00CC99]">100% Verified</p>
                      <p className="text-xs text-gray-600">225 total reviews</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myProducts.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{product.rating}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{product.reviews} reviews</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-[#00CC99] text-white">
                          <Shield className="h-3 w-3 mr-1" />
                          {product.verifiedReviews} Verified
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View All Reviews
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
