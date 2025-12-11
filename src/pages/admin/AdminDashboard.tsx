import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  Users, 
  TrendingUp, 
  Gift, 
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';
import { weeklyTasksApi, rewardsApi, pointsApi } from '@/db/api';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalRewards: 0,
    activeRewards: 0,
    ownerRewards: 0,
    customerRewards: 0,
    totalTasks: 0,
    activeTasks: 0,
    ownerTasks: 0,
    customerTasks: 0,
    totalCustomers: 0,
    totalOwners: 0,
    totalPointsAwarded: 0,
    totalRedemptions: 0,
    pendingRedemptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load rewards stats
      const rewards = await rewardsApi.getAll();
      const activeRewards = rewards.filter(r => r.is_active);
      const ownerRewards = rewards.filter(r => r.target_role === 'owner');
      const customerRewards = rewards.filter(r => r.target_role === 'customer');
      
      // Load tasks stats
      const tasks = await weeklyTasksApi.getAll();
      const activeTasks = tasks.filter(t => t.is_active);
      const ownerTasks = tasks.filter(t => t.target_role === 'owner');
      const customerTasks = tasks.filter(t => t.target_role === 'customer');
      
      // Load customer points stats
      const allPoints = await pointsApi.getAllCustomerPoints();
      const totalPointsAwarded = allPoints.reduce((sum, p) => sum + (p.lifetime_points || 0), 0);
      
      // Count users by role
      const totalCustomers = allPoints.filter(p => p.profile?.role === 'customer').length;
      const totalOwners = allPoints.filter(p => p.profile?.role === 'owner').length;
      
      // Load redemptions stats
      const redemptions = await rewardsApi.getAllRedemptions();
      const pendingRedemptions = redemptions.filter(r => r.status === 'pending');

      setStats({
        totalRewards: rewards.length,
        activeRewards: activeRewards.length,
        ownerRewards: ownerRewards.length,
        customerRewards: customerRewards.length,
        totalTasks: tasks.length,
        activeTasks: activeTasks.length,
        ownerTasks: ownerTasks.length,
        customerTasks: customerTasks.length,
        totalCustomers,
        totalOwners,
        totalPointsAwarded,
        totalRedemptions: redemptions.length,
        pendingRedemptions: pendingRedemptions.length,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Rewards',
      value: stats.totalRewards,
      subtitle: `${stats.ownerRewards} owner, ${stats.customerRewards} customer`,
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/rewards',
    },
    {
      title: 'Weekly Tasks',
      value: stats.totalTasks,
      subtitle: `${stats.ownerTasks} owner, ${stats.customerTasks} customer`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/tasks',
    },
    {
      title: 'Total Users',
      value: stats.totalCustomers + stats.totalOwners,
      subtitle: `${stats.totalOwners} owners, ${stats.totalCustomers} customers`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/customers',
    },
    {
      title: 'Points Awarded',
      value: stats.totalPointsAwarded.toLocaleString(),
      subtitle: 'Lifetime total',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/customers',
    },
    {
      title: 'Total Redemptions',
      value: stats.totalRedemptions,
      subtitle: `${stats.pendingRedemptions} pending`,
      icon: CheckCircle2,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      link: '/admin/redemptions',
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DineQR Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage rewards, tasks, and monitor system performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/rewards">
              <Gift className="mr-2 h-4 w-4" />
              Manage Rewards
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/tasks">
              <Target className="mr-2 h-4 w-4" />
              Manage Tasks
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-600" />
              Rewards Management
            </CardTitle>
            <CardDescription>
              Create and manage customer rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/rewards">
                View All Rewards
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/admin/rewards/new">
                <Gift className="mr-2 h-4 w-4" />
                Create New Reward
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Weekly Tasks Management
            </CardTitle>
            <CardDescription>
              Create and manage weekly challenges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="outline">
              <Link to="/admin/tasks">
                View All Tasks
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/admin/tasks/new">
                <Target className="mr-2 h-4 w-4" />
                Create New Task
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            Monitor customer engagement and system health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Rewards</p>
                <p className="text-2xl font-bold">{stats.activeRewards}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold">{stats.activeTasks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="p-2 bg-purple-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Points/User</p>
                <p className="text-2xl font-bold">
                  {stats.totalCustomers > 0 
                    ? Math.round(stats.totalPointsAwarded / stats.totalCustomers)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
