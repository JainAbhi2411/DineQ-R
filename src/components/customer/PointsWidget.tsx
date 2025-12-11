import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Trophy, TrendingUp, Gift, Target } from 'lucide-react';
import { pointsApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerPoints } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';

const tierConfig = {
  bronze: {
    color: 'from-amber-700 to-amber-900',
    icon: '🥉',
    next: 'silver',
    nextPoints: 2000,
  },
  silver: {
    color: 'from-gray-400 to-gray-600',
    icon: '🥈',
    next: 'gold',
    nextPoints: 5000,
  },
  gold: {
    color: 'from-yellow-400 to-yellow-600',
    icon: '🥇',
    next: 'platinum',
    nextPoints: 10000,
  },
  platinum: {
    color: 'from-purple-400 to-purple-600',
    icon: '💎',
    next: null,
    nextPoints: null,
  },
};

export default function PointsWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [points, setPoints] = useState<CustomerPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPoints();

      // Set up real-time subscription for points updates
      const channel = supabase
        .channel('customer_points_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'customer_points',
            filter: `customer_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('[PointsWidget] Real-time update:', payload);
            // Reload points when they change
            loadPoints();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id]);

  const loadPoints = async () => {
    try {
      setLoading(true);
      const data = await pointsApi.getCustomerPoints(user!.id);
      setPoints(data);
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const tierInfo = tierConfig[points?.tier_level || 'bronze'];
  const progressToNext = tierInfo.nextPoints
    ? ((points?.lifetime_points || 0) / tierInfo.nextPoints) * 100
    : 100;

  return (
    <Card className={`bg-gradient-to-br ${tierInfo.color} text-white border-0 shadow-lg`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">
              {points?.tier_level?.toUpperCase() || 'BRONZE'} TIER
            </span>
            <span className="text-xl">{tierInfo.icon}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/customer/rewards')}
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Gift className="w-4 h-4 mr-1" />
            Rewards
          </Button>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <Coins className="w-6 h-6" />
            <span className="text-4xl font-bold">{points?.total_points || 0}</span>
            <span className="text-sm opacity-90">points</span>
          </div>
          <p className="text-xs opacity-75 mt-1">
            Lifetime: {points?.lifetime_points || 0} points earned
          </p>
        </div>

        {tierInfo.next && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-90">Progress to {tierInfo.next}</span>
              <span className="font-medium">
                {points?.lifetime_points || 0} / {tierInfo.nextPoints}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/customer/weekly-tasks')}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Target className="w-4 h-4 mr-1" />
            Tasks
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/customer/points-history')}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            History
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/customer/rewards')}
            className="flex-1 bg-white text-primary hover:bg-white/90"
          >
            Redeem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
