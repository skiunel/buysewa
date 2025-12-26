import { useState, useEffect } from "react";
import { Shield, Users, Package, Star, Activity, AlertTriangle, CheckCircle, TrendingUp, UserCheck, DollarSign, ShoppingBag, Eye, Ban, FileCheck, Database, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const recentActivity = [
  {
    id: 1,
    type: "review_verification",
    description: "Review verified for Wireless Headphones",
    user: "buyer@example.com",
    timestamp: "2 hours ago",
    status: "verified"
  },
  {
    id: 2,
    type: "seller_registration",
    description: "New seller registered: TechStore Nepal",
    user: "techstore@example.com",
    timestamp: "4 hours ago",
    status: "pending"
  },
  {
    id: 3,
    type: "fake_review_detected",
    description: "Potential fake review detected and blocked",
    user: "suspicious@example.com",
    timestamp: "6 hours ago",
    status: "blocked"
  },
  {
    id: 4,
    type: "payment_verification",
    description: "Payment verified for Order #12345",
    user: "customer@example.com",
    timestamp: "8 hours ago",
    status: "verified"
  }
];

const userManagement = [
  {
    id: 1,
    email: "buyer@demo.com",
    name: "Rajesh Kumar",
    role: "buyer",
    status: "active",
    joinDate: "2024-01-15",
    orders: 12,
    reviews: 8
  },
  {
    id: 2,
    email: "seller@demo.com",
    name: "Himalayan Crafts Store",
    role: "seller",
    status: "active",
    joinDate: "2024-01-10",
    products: 25,
    sales: 156
  },
  {
    id: 3,
    email: "newstore@example.com",
    name: "Nepal Handloom",
    role: "seller",
    status: "pending",
    joinDate: "2024-01-20",
    products: 0,
    sales: 0
  }
];

const pendingProducts = [
  {
    id: 1,
    name: "Handcrafted Thanka Painting",
    seller: "Himalayan Crafts Store",
    category: "Handicrafts",
    price: 15999,
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kaWNyYWZ0c3xlbnwxfHx8fDE3NjI0MTgzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    submittedDate: "Jan 20, 2024",
    status: "pending_review"
  },
  {
    id: 2,
    name: "Traditional Newari Jewelry Set",
    seller: "Nepal Handloom",
    category: "Fashion",
    price: 8999,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjI0MTg1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    submittedDate: "Jan 19, 2024",
    status: "pending_review"
  }
];

const platformRevenueData = [
  { month: "Jul", revenue: 234500, commission: 23450 },
  { month: "Aug", revenue: 289700, commission: 28970 },
  { month: "Sep", revenue: 345600, commission: 34560 },
  { month: "Oct", revenue: 412300, commission: 41230 },
  { month: "Nov", revenue: 478900, commission: 47890 },
  { month: "Dec", revenue: 556700, commission: 55670 }
];

const categoryDistribution = [
  { name: "Traditional Clothing", value: 1234, color: "#003366" },
  { name: "Handicrafts", value: 987, color: "#00CC99" },
  { name: "Electronics", value: 856, color: "#FF6600" },
  { name: "Fashion", value: 745, color: "#8B5CF6" },
  { name: "Others", value: 1412, color: "#10B981" }
];

const flaggedReviews = [
  {
    id: 1,
    product: "Samsung Galaxy S23 Ultra",
    reviewer: "suspicious.user@example.com",
    rating: 5,
    comment: "Best product ever! Amazing! Buy now!",
    reason: "Suspicious pattern detected",
    flaggedDate: "2 hours ago",
    status: "flagged"
  },
  {
    id: 2,
    product: "Traditional Dhaka Topi",
    reviewer: "another.user@example.com",
    rating: 1,
    comment: "Terrible! Worst purchase!",
    reason: "No SDC code verification",
    flaggedDate: "5 hours ago",
    status: "blocked"
  }
];

// Payment Verification Component
function PaymentVerificationSection() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { orderAPI } = await import('../services/api');
      const response = await orderAPI.getAll();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: string, status: 'completed' | 'failed') => {
    try {
      setVerifying(true);
      const { orderAPI } = await import('../services/api');
      const response = await orderAPI.verifyPayment(orderId, status, transactionId || undefined, notes || undefined);
      if (response.success) {
        await fetchOrders();
        setSelectedOrder(null);
        setTransactionId('');
        setNotes('');
        alert('Payment verified successfully!');
      } else {
        alert('Failed to verify payment');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'refunded': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const pendingOrders = orders.filter(o => o.paymentStatus === 'pending');
  const allOrders = orders;

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
            <p className="text-sm text-gray-600">Pending Verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.paymentStatus === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Verified Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {orders.filter(o => o.paymentStatus === 'failed').length}
            </div>
            <p className="text-sm text-gray-600">Failed Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#003366]">
              NPR {orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Verified</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="all">All Orders ({allOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending payments to verify</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrders.map((order) => (
                  <TableRow key={order._id || order.id}>
                    <TableCell className="font-medium">{order.orderNumber || order.id}</TableCell>
                    <TableCell>
                      {order.userId?.name || order.userId?.email || 'N/A'}
                    </TableCell>
                    <TableCell>NPR {order.total?.toLocaleString() || '0'}</TableCell>
                    <TableCell>{order.paymentMethod || 'N/A'}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#00CC99] hover:bg-[#00b88a]"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allOrders.map((order) => (
                <TableRow key={order._id || order.id}>
                  <TableCell className="font-medium">{order.orderNumber || order.id}</TableCell>
                  <TableCell>
                    {order.userId?.name || order.userId?.email || 'N/A'}
                  </TableCell>
                  <TableCell>NPR {order.total?.toLocaleString() || '0'}</TableCell>
                  <TableCell>{order.paymentMethod || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Verification Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Verify Payment - {selectedOrder.orderNumber || selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Verify payment status for this order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Order Amount</Label>
                <p className="text-lg font-bold">NPR {selectedOrder.total?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <Label>Payment Method</Label>
                <p>{selectedOrder.paymentMethod || 'N/A'}</p>
              </div>
              <div>
                <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add verification notes"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleVerifyPayment(selectedOrder._id || selectedOrder.id, 'completed')}
                  disabled={verifying}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verify as Completed
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleVerifyPayment(selectedOrder._id || selectedOrder.id, 'failed')}
                  disabled={verifying}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Mark as Failed
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const totalRevenue = platformRevenueData[platformRevenueData.length - 1].revenue;
  const totalCommission = platformRevenueData[platformRevenueData.length - 1].commission;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-8 w-8 text-[#003366]" />
                <h1 className="text-3xl font-bold text-[#003366]">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600">Monitor and manage the BUYSEWA platform</p>
            </div>
            <div className="flex items-center space-x-2 bg-[#00CC99] bg-opacity-10 px-4 py-3 rounded-lg border border-[#00CC99]">
              <Shield className="h-5 w-5 text-[#00CC99]" />
              <div>
                <p className="text-sm font-medium text-[#00CC99]">Platform Health</p>
                <p className="text-xs text-gray-600">All Systems Operational</p>
              </div>
            </div>
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
                <span className="text-green-600">+14.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00CC99]">NPR {totalCommission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                10% commission rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#003366]">847</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#00CC99]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00CC99]">12,456</div>
              <p className="text-xs text-muted-foreground">
                98.7% verification rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-[#00CC99]" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Blockchain Verification</span>
                        <span className="text-sm text-green-600">99.9%</span>
                      </div>
                      <Progress value={99.9} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Platform Uptime</span>
                        <span className="text-sm text-green-600">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Review Processing</span>
                        <span className="text-sm text-green-600">98.7%</span>
                      </div>
                      <Progress value={98.7} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">SDC Verification Rate</span>
                        <span className="text-sm text-green-600">97.5%</span>
                      </div>
                      <Progress value={97.5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#FF6600]" />
                    Today's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="text-sm font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Registrations</span>
                      <span className="text-sm font-medium">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Reviews Submitted</span>
                      <span className="text-sm font-medium">78</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Orders Completed</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SDC Codes Generated</span>
                      <span className="text-sm font-medium">142</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Flagged Reviews</span>
                      <span className="text-sm font-medium text-red-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-[#003366]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'verified' ? 'bg-green-500' :
                          activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-600">{activity.user} • {activity.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant={
                        activity.status === 'verified' ? 'default' :
                        activity.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-[#003366]" />
                    User Management
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    Export Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userManagement.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.role === 'seller' ? 'border-[#FF6600] text-[#FF6600]' : 'border-[#003366] text-[#003366]'
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          {user.role === 'buyer' ? `${user.orders} orders, ${user.reviews} reviews` : 
                           `${user.products} products, ${user.sales} sales`}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.status === 'pending' && (
                              <Button size="sm" className="bg-[#00CC99] hover:bg-[#00aa88] text-white">
                                Approve
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Ban className="h-4 w-4" />
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

          <TabsContent value="sellers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">847</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12</span> new this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  <FileCheck className="h-4 w-4 text-[#FF6600]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#FF6600]">5</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting verification
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Seller Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.7</div>
                  <p className="text-xs text-muted-foreground">
                    Based on customer reviews
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Seller Applications</CardTitle>
                <p className="text-sm text-gray-600">Review and approve new seller registrations</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userManagement
                    .filter(user => user.role === 'seller' && user.status === 'pending')
                    .map((seller) => (
                      <div key={seller.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{seller.name}</h3>
                          <p className="text-sm text-gray-600">{seller.email}</p>
                          <p className="text-xs text-gray-500">Applied on {seller.joinDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" className="bg-[#00CC99] hover:bg-[#00b88a] text-white">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Ban className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,234</div>
                  <p className="text-xs text-muted-foreground">
                    Active listings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <FileCheck className="h-4 w-4 text-[#FF6600]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#FF6600]">12</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reported Products</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">8</div>
                  <p className="text-xs text-muted-foreground">
                    Require attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    Active categories
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pending Product Approvals</CardTitle>
                <p className="text-sm text-gray-600">Review new product submissions from sellers</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">by {product.seller}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{product.category}</Badge>
                            <span className="text-sm font-medium">NPR {product.price.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Submitted {product.submittedDate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" className="bg-[#00CC99] hover:bg-[#00b88a] text-white">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Ban className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,633</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified Reviews</CardTitle>
                  <CheckCircle className="h-4 w-4 text-[#00CC99]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#00CC99]">12,456</div>
                  <p className="text-xs text-muted-foreground">
                    98.7% verification rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[#FF6600]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#FF6600]">154</div>
                  <p className="text-xs text-muted-foreground">
                    Under investigation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blocked Reviews</CardTitle>
                  <Ban className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">23</div>
                  <p className="text-xs text-muted-foreground">
                    Fake reviews prevented
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Flagged Reviews</CardTitle>
                <p className="text-sm text-gray-600">Reviews flagged by the blockchain verification system</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedReviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{review.product}</h3>
                          <p className="text-sm text-gray-600">Reviewer: {review.reviewer}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <Badge className={review.status === 'flagged' ? 'bg-[#FF6600] text-white' : 'bg-red-600 text-white'}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {review.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">"{review.comment}"</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            {review.reason}
                          </Badge>
                          <span className="text-xs text-gray-500">{review.flaggedDate}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Investigate
                          </Button>
                          <Button size="sm" className="bg-[#00CC99] hover:bg-[#00b88a] text-white">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Ban className="h-4 w-4 mr-1" />
                            Block
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-[#003366]" />
                  Payment Verification
                </CardTitle>
                <p className="text-sm text-gray-600">Verify and manage payment status for all orders</p>
              </CardHeader>
              <CardContent>
                <PaymentVerificationSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Revenue (6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={platformRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#003366" 
                        strokeWidth={2}
                        name="Total Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="commission" 
                        stroke="#00CC99" 
                        strokeWidth={2}
                        name="Commission (10%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryDistribution
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 3)
                      .map((cat, index) => (
                        <div key={cat.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-300" : "bg-orange-400"
                            }`}>
                              <span className="font-bold text-white">{index + 1}</span>
                            </div>
                            <span className="text-sm font-medium">{cat.name}</span>
                          </div>
                          <span className="font-bold">{cat.value}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Transactions</span>
                      <span className="font-bold">12,456</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SDC Codes Generated</span>
                      <span className="font-bold">11,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verification Success Rate</span>
                      <Badge className="bg-[#00CC99] text-white">98.7%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network Status</span>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="text-5xl font-bold text-[#00CC99]">97.8%</div>
                      <p className="text-sm text-gray-600 mt-2">Overall Health Score</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>User Satisfaction</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Seller Performance</span>
                        <span className="font-medium">98%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Review Quality</span>
                        <span className="font-medium">99%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
