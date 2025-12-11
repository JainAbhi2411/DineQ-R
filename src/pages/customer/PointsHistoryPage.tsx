import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, TrendingDown, Calendar, ShoppingBag, Star, Users, Gift, Zap } from 'lucide-react';
import { pointsApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { PointTransaction, CustomerPoints } from '@/types/types';
import { format } from 'date-fns';

const activityIcons: Record<string, any> = {
  order: ShoppingBag,
  review: Star,
  referral: Users,
  first_order: Gift,
  daily_login: Calendar,
  discount: Gift,
  bonus: Zap,
  admin_adjustment: Coins,
};

const activityColors: Record<string, string> = {
  order: 'text-blue-500',
  review: 'text-yellow-500',
  referral: 'text-purple-500',
  first_order: 'text-green-500',
  daily_login: 'text-orange-500',
  discount: 'text-pink-500',
  bonus: 'text-cyan-500',
  admin_adjustment: 'text-gray-500',
};

export default function PointsHistoryPage() {
  const { user } = useAuth();
  const [points, setPoints] = useState<CustomerPoints | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pointsData, transactionsData] = await Promise.all([
        pointsApi.getCustomerPoints(user!.id),
        pointsApi.getPointTransactions(user!.id, 100),
      ]);
      setPoints(pointsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const earnedPoints = transactions
    .filter((t) => t.transaction_type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);

  const redeemedPoints = transactions
    .filter((t) => t.transaction_type === 'redeemed')
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Coins className="w-8 h-8 text-primary" />
          Points History
        </h1>
        <p className="text-muted-foreground mt-1">Track your points earnings and redemptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Coins className="w-8 h-8 text-primary" />
              <div>
                <p className="text-3xl font-bold">{points?.total_points || 0}</p>
                <p className="text-xs text-muted-foreground">Available points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-3xl font-bold">{points?.lifetime_points || 0}</p>
                <p className="text-xs text-muted-foreground">Lifetime points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Redeemed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-3xl font-bold">{points?.points_redeemed || 0}</p>
                <p className="text-xs text-muted-foreground">Points spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const Icon = activityIcons[transaction.activity_type] || Coins;
              const iconColor = activityColors[transaction.activity_type] || 'text-gray-500';
              const isEarned = transaction.transaction_type === 'earned';

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {transaction.activity_type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        isEarned ? 'text-green-500' : 'text-orange-500'
                      }`}
                    >
                      {isEarned ? '+' : ''}
                      {transaction.points}
                    </p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              );
            })}

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <Coins className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start earning points by placing orders and engaging with the platform
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}