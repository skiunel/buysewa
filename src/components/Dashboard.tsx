import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Star, Users, ShoppingBag, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

// This is now the Seller Dashboard

const reviewTrendData = [
  { month: "Jul", verified: 145, flagged: 8, total: 153 },
  { month: "Aug", verified: 168, flagged: 12, total: 180 },
  { month: "Sep", verified: 192, flagged: 6, total: 198 },
  { month: "Oct", verified: 234, flagged: 15, total: 249 },
  { month: "Nov", verified: 287, flagged: 9, total: 296 },
  { month: "Dec", verified: 312, flagged: 4, total: 316 }
];

const productPerformanceData = [
  { product: "Wireless Headphones", verified: 189, flagged: 3, rating: 4.8 },
  { product: "Smart Phone Pro", verified: 445, flagged: 12, rating: 4.9 },
  { product: "Winter Jacket", verified: 98, flagged: 2, rating: 4.6 },
  { product: "Gaming Laptop", verified: 234, flagged: 8, rating: 4.7 },
  { product: "Running Shoes", verified: 156, flagged: 1, rating: 4.9 }
];

const verificationStatusData = [
  { name: "Verified Reviews", value: 1523, color: "#00CC99" },
  { name: "Flagged Reviews", value: 45, color: "#FF6600" },
  { name: "Pending Verification", value: 23, color: "#003366" }
];

const recentActivity = [
  {
    id: 1,
    type: "review",
    user: "Rajesh K.",
    product: "Wireless Headphones",
    action: "Submitted verified review",
    time: "2 hours ago",
    status: "verified"
  },
  {
    id: 2,
    type: "flag",
    user: "System",
    product: "Gaming Mouse",
    action: "Flagged suspicious review pattern",
    time: "4 hours ago",
    status: "flagged"
  },
  {
    id: 3,
    type: "review",
    user: "Priya S.",
    product: "Smart Phone Pro",
    action: "Submitted verified review",
    time: "6 hours ago",
    status: "verified"
  },
  {
    id: 4,
    type: "verification",
    user: "System",
    product: "Winter Jacket",
    action: "Blockchain verification completed",
    time: "1 day ago",
    status: "completed"
  }
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor your products and review analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#00CC99]" />
            <span className="text-[#00CC99] font-medium">Blockchain Analytics</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,591</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Reviews</CardTitle>
              <Shield className="h-4 w-4 text-[#00CC99]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00CC99]">1,523</div>
              <p className="text-xs text-muted-foreground">
                95.7% verification rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#FF6600]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FF6600]">45</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">-8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.78</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.12</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Review Analytics</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
            <TabsTrigger value="verification">Verification Status</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Review Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Trends (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reviewTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="verified" 
                        stroke="#00CC99" 
                        strokeWidth={2}
                        name="Verified Reviews"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="flagged" 
                        stroke="#FF6600" 
                        strokeWidth={2}
                        name="Flagged Reviews"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Verification Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Verification Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={verificationStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {verificationStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformanceData.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{product.product}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                          <Badge className="bg-[#00CC99] text-white">
                            {product.verified} Verified
                          </Badge>
                          {product.flagged > 0 && (
                            <Badge variant="destructive">
                              {product.flagged} Flagged
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onNavigate("product")}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-[#00CC99]" />
                        <span>Verified Reviews</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">1,523</div>
                        <div className="text-sm text-gray-600">95.7%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-[#FF6600]" />
                        <span>Flagged Reviews</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">45</div>
                        <div className="text-sm text-gray-600">2.8%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-[#003366]" />
                        <span>Pending Verification</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">23</div>
                        <div className="text-sm text-gray-600">1.4%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Network Status</span>
                      <Badge className="bg-[#00CC99] text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Last Block</span>
                      <span className="text-sm font-mono">2 mins ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Gas Price</span>
                      <span className="text-sm">12 gwei</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Smart Contract</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === "verified" ? "bg-[#00CC99]" :
                        activity.status === "flagged" ? "bg-[#FF6600]" :
                        activity.status === "completed" ? "bg-[#003366]" : "bg-gray-200"
                      }`}>
                        {activity.type === "review" && <Star className="h-5 w-5 text-white" />}
                        {activity.type === "flag" && <AlertTriangle className="h-5 w-5 text-white" />}
                        {activity.type === "verification" && <Shield className="h-5 w-5 text-white" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{activity.user}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-sm text-gray-600">{activity.product}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{activity.time}</p>
                        <Badge 
                          className={
                            activity.status === "verified" ? "bg-[#00CC99] text-white" :
                            activity.status === "flagged" ? "bg-[#FF6600] text-white" :
                            activity.status === "completed" ? "bg-[#003366] text-white" : ""
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
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