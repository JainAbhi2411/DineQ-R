import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/db/api';
import { OrderWithItems } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, ShoppingBag, Star, Gift, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function Rewards() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { formatCurrency } = useFormatters();

  useEffect(() => {
    loadOrders();
  }, [profile]);

  const loadOrders = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const data = await orderApi.getOrdersByCustomer(profile.id);
      setOrders(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate rewards metrics
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const loyaltyPoints = completedOrders.length * 10;
  const nextRewardPoints = 100 - (loyaltyPoints % 100);
  const rewardProgress = (loyaltyPoints % 100);
  const rewardsEarned = Math.floor(loyaltyPoints / 100);

  // Determine tier
  const getTier = () => {
    if (loyaltyPoints >= 500) return { name: 'Platinum', icon: Crown, color: 'text-purple-500' };
    if (loyaltyPoints >= 300) return { name: 'Gold', icon: Star, color: 'text-yellow-500' };
    if (loyaltyPoints >= 100) return { name: 'Silver', icon: Award, color: 'text-gray-400' };
    return { name: 'Bronze', icon: Gift, color: 'text-orange-500' };
  };

  const tier = getTier();
  const TierIcon = tier.icon;

  if (loading) {
    return (
      <CustomerLayout title="Rewards">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent glow-purple"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-secondary opacity-20"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Rewards">
      <div className="max-w-7xl mx-auto px-3 xl:px-6 py-4 xl:py-8">
        <div className="mb-6 animate-fade-in-up">
          <p className="text-muted-foreground text-sm xl:text-base">
            Earn points with every order and unlock exclusive rewards
          </p>
        </div>

        {/* Tier Card */}
        <Card className="glass border-2 border-border mb-6 animate-fade-in-up overflow-hidden">
          <div className="scan-line" />
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 xl:w-16 xl:h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center ${tier.color}`}>
                  <TierIcon className="w-6 h-6 xl:w-8 xl:h-8" />
                </div>
                <div>
                  <CardTitle className="text-xl xl:text-2xl">{tier.name} Member</CardTitle>
                  <CardDescription className="text-sm xl:text-base">
                    {loyaltyPoints} loyalty points earned
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm xl:text-base px-3 py-1">
                {rewardsEarned} Rewards
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress to next reward</span>
                <span>{nextRewardPoints} points needed</span>
              </div>
              <Progress value={rewardProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6 mb-6">
          <Card className="glass border-2 border-border animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="p-4 xl:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 xl:w-6 xl:h-6 text-primary" />
                </div>
                <div>
                  <CardDescription className="text-xs xl:text-sm">Total Orders</CardDescription>
                  <CardTitle className="text-xl xl:text-2xl">{completedOrders.length}</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="glass border-2 border-border animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="p-4 xl:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 xl:w-6 xl:h-6 text-secondary" />
                </div>
                <div>
                  <CardDescription className="text-xs xl:text-sm">Total Spent</CardDescription>
                  <CardTitle className="text-xl xl:text-2xl">{formatCurrency(totalSpent)}</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="glass border-2 border-border animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <CardHeader className="p-4 xl:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 xl:w-6 xl:h-6 text-accent" />
                </div>
                <div>
                  <CardDescription className="text-xs xl:text-sm">Loyalty Points</CardDescription>
                  <CardTitle className="text-xl xl:text-2xl">{loyaltyPoints}</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <Card className="glass border-2 border-border animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-lg xl:text-xl">How Rewards Work</CardTitle>
            <CardDescription className="text-sm xl:text-base">
              Earn points and unlock benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm xl:text-base mb-1">Place Orders</h4>
                <p className="text-xs xl:text-sm text-muted-foreground">
                  Earn 10 points for every completed order at any restaurant
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm xl:text-base mb-1">Collect Points</h4>
                <p className="text-xs xl:text-sm text-muted-foreground">
                  Accumulate points across all your orders and track your progress
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm xl:text-base mb-1">Unlock Rewards</h4>
                <p className="text-xs xl:text-sm text-muted-foreground">
                  Redeem rewards every 100 points for discounts and special offers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm xl:text-base mb-1">Level Up</h4>
                <p className="text-xs xl:text-sm text-muted-foreground">
                  Reach higher tiers (Bronze → Silver → Gold → Platinum) for exclusive perks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
