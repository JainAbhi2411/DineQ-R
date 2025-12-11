import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingBag, 
  Users, 
  Star, 
  Clock,
  AlertCircle,
  Lightbulb,
  Target,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  TrendingUpIcon
} from 'lucide-react';
import { analyticsApi } from '@/db/api';
import type { AnalyticsData } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Chart colors
const COLORS = ['#FF6B35', '#F7931E', '#FDC830', '#37B7C3', '#088395'];

// Helper function to generate AI recommendations
const generateRecommendations = (analytics: AnalyticsData) => {
  const recommendations = [];
  
  // Revenue analysis
  const avgOrderValue = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;
  if (avgOrderValue < 15) {
    recommendations.push({
      type: 'revenue',
      priority: 'high',
      title: 'Increase Average Order Value',
      description: `Your average order value is ₹${Math.round(avgOrderValue)}. Consider adding combo meals or suggesting add-ons to increase this metric.`,
      action: 'Create bundle offers',
      icon: Target,
    });
  }
  
  // Popular items analysis
  if (analytics.popularItems.length > 0) {
    const topItem = analytics.popularItems[0];
    recommendations.push({
      type: 'menu',
      priority: 'medium',
      title: 'Promote Best Sellers',
      description: `"${topItem.menu_item_name}" is your top seller with ${topItem.order_count} orders. Feature it prominently in your menu.`,
      action: 'Add to featured section',
      icon: Star,
    });
  }
  
  // Customer retention
  const avgOrdersPerCustomer = analytics.uniqueCustomers > 0 ? analytics.totalOrders / analytics.uniqueCustomers : 0;
  if (avgOrdersPerCustomer < 2) {
    recommendations.push({
      type: 'customer',
      priority: 'high',
      title: 'Improve Customer Retention',
      description: `Customers average ${avgOrdersPerCustomer.toFixed(1)} orders. Implement a loyalty program to encourage repeat visits.`,
      action: 'Launch loyalty program',
      icon: Users,
    });
  }
  
  // Rating analysis
  if (analytics.averageRating < 4.0) {
    recommendations.push({
      type: 'quality',
      priority: 'critical',
      title: 'Improve Service Quality',
      description: `Your rating is ${analytics.averageRating.toFixed(1)}/5. Focus on food quality and service to improve customer satisfaction.`,
      action: 'Review feedback',
      icon: AlertCircle,
    });
  }
  
  // Peak hours analysis
  if (analytics.revenueByDate.length > 0) {
    const recentDays = analytics.revenueByDate.slice(-7);
    const avgDailyOrders = recentDays.reduce((sum, day) => sum + day.order_count, 0) / recentDays.length;
    if (avgDailyOrders < 10) {
      recommendations.push({
        type: 'marketing',
        priority: 'medium',
        title: 'Boost Daily Orders',
        description: `You're averaging ${avgDailyOrders.toFixed(0)} orders per day. Run promotions during off-peak hours to increase volume.`,
        action: 'Create time-based offers',
        icon: Clock,
      });
    }
  }
  
  return recommendations;
};

// Helper function to calculate trends
const calculateTrend = (data: { date: string; revenue: number; order_count: number }[]) => {
  if (data.length < 2) return { revenue: 0, orders: 0 };
  
  const recent = data.slice(-3);
  const previous = data.slice(-6, -3);
  
  if (previous.length === 0) return { revenue: 0, orders: 0 };
  
  const recentRevenue = recent.reduce((sum, d) => sum + d.revenue, 0) / recent.length;
  const previousRevenue = previous.reduce((sum, d) => sum + d.revenue, 0) / previous.length;
  const revenueTrend = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  
  const recentOrders = recent.reduce((sum, d) => sum + d.order_count, 0) / recent.length;
  const previousOrders = previous.reduce((sum, d) => sum + d.order_count, 0) / previous.length;
  const ordersTrend = previousOrders > 0 ? ((recentOrders - previousOrders) / previousOrders) * 100 : 0;
  
  return { revenue: revenueTrend, orders: ordersTrend };
};

export default function Analytics() {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const { formatCurrency } = useFormatters();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      loadAnalytics();
    }
  }, [restaurantId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getAnalytics(restaurantId!);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Analytics data has been updated',
    });
  };

  if (loading) {
    return (
      <OwnerLayout title="Analytics">
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </OwnerLayout>
    );
  }

  if (!analytics) {
    return (
      <OwnerLayout title="Analytics">
        <div className="p-8">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </OwnerLayout>
    );
  }

  const trends = calculateTrend(analytics.revenueByDate);
  const recommendations = generateRecommendations(analytics);
  const avgOrderValue = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;
  const avgOrdersPerCustomer = analytics.uniqueCustomers > 0 ? analytics.totalOrders / analytics.uniqueCustomers : 0;

  // Prepare chart data
  const chartData = analytics.revenueByDate.slice(-30).map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    orders: item.order_count,
  }));

  // Prepare pie chart data for popular items
  const pieData = analytics.popularItems.slice(0, 5).map((item, index) => ({
    name: item.menu_item_name,
    value: item.total_revenue,
    count: item.order_count,
    color: COLORS[index % COLORS.length],
  }));

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      change: trends.revenue,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      prefix: '₹'
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toString(),
      change: trends.orders,
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Unique Customers',
      value: analytics.uniqueCustomers.toString(),
      change: 0,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Average Rating',
      value: analytics.averageRating.toFixed(1),
      change: 0,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      suffix: '/5'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <OwnerLayout title="Analytics">
      <div className="p-4 xl:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl xl:text-3xl font-bold mb-2">Analytics & Insights</h1>
            <p className="text-sm text-muted-foreground">Real-time performance tracking and AI-powered recommendations</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="gap-2">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;
            const isNegative = stat.change < 0;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    {stat.change !== 0 && (
                      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : isNegative ? <ArrowDownRight className="w-4 h-4" /> : null}
                        {Math.abs(stat.change).toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl xl:text-3xl font-bold">
                    {stat.prefix}{stat.value}{stat.suffix}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>Actionable insights to grow your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <div key={index} className="p-4 rounded-lg border bg-background space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{rec.title}</h4>
                              <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Lightbulb className="w-4 h-4" />
                        {rec.action}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="items">Popular Items</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Revenue & Orders Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue & Orders Trend</CardTitle>
                  <CardDescription>Last 30 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#37B7C3" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#37B7C3" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#FF6B35" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        name="Revenue (₹)"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#37B7C3" 
                        fillOpacity={1} 
                        fill="url(#colorOrders)" 
                        name="Orders"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Metrics</CardTitle>
                  <CardDescription>Important business indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Average Order Value</span>
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">₹{Math.round(avgOrderValue)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Per order</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Orders Per Customer</span>
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{avgOrdersPerCustomer.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Average repeat rate</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}/5.0</p>
                    <p className="text-xs text-muted-foreground mt-1">Average rating</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Menu Items</span>
                      <BarChart3 className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="text-2xl font-bold">{analytics.popularItems.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Active items</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Revenue Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue distribution over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#FF6B35" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Details</CardTitle>
                  <CardDescription>Recent daily performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[350px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Orders</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">Avg</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.revenueByDate.slice(-10).reverse().map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {new Date(item.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="text-right">{item.order_count}</TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹{Math.round(item.revenue)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              ₹{Math.round(item.revenue / item.order_count)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Popular Items Tab */}
          <TabsContent value="items" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Item</CardTitle>
                  <CardDescription>Top 5 revenue contributors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => `₹${Math.round(value)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Items Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Items</CardTitle>
                  <CardDescription>Ranked by quantity sold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[350px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead className="text-right">Sold</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.popularItems.slice(0, 10).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.menu_item_name}</TableCell>
                            <TableCell className="text-right">{item.order_count}</TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹{Math.round(item.total_revenue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OwnerLayout>
  );
}
