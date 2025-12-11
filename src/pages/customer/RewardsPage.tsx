import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Coins, Gift, Percent, DollarSign, Calendar, ShoppingBag, Sparkles, Copy, Check } from 'lucide-react';
import { pointsApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerPoints, RewardsCatalog, RedeemedReward } from '@/types/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function RewardsPage() {
  const { user } = useAuth();
  const [points, setPoints] = useState<CustomerPoints | null>(null);
  const [rewards, setRewards] = useState<RewardsCatalog[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<RewardsCatalog | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pointsData, rewardsData, redeemedData] = await Promise.all([
        pointsApi.getCustomerPoints(user!.id),
        pointsApi.getRewardsCatalog(),
        pointsApi.getRedeemedRewards(user!.id),
      ]);
      setPoints(pointsData);
      setRewards(rewardsData);
      setRedeemedRewards(redeemedData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (reward: RewardsCatalog) => {
    if (!points || points.total_points < reward.points_required) {
      toast.error('Insufficient points');
      return;
    }

    setSelectedReward(reward);
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      setRedeeming(true);
      const result = await pointsApi.redeemReward(user!.id, selectedReward.id);

      if (result.success) {
        setRedeemResult(result);
        toast.success('Reward redeemed successfully!');
        await loadData();
      } else {
        toast.error(result.error || 'Failed to redeem reward');
        setSelectedReward(null);
      }
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      toast.error(error.message || 'Failed to redeem reward');
      setSelectedReward(null);
    } finally {
      setRedeeming(false);
    }
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Discount code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const closeRedeemDialog = () => {
    setSelectedReward(null);
    setRedeemResult(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gift className="w-8 h-8 text-primary" />
            Rewards Catalog
          </h1>
          <p className="text-muted-foreground mt-1">
            Redeem your points for exclusive discounts
          </p>
        </div>
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-4 flex items-center gap-3">
            <Coins className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Available Points</p>
              <p className="text-2xl font-bold">{points?.total_points || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">
            <Sparkles className="w-4 h-4 mr-2" />
            Available Rewards
          </TabsTrigger>
          <TabsTrigger value="redeemed">
            <ShoppingBag className="w-4 h-4 mr-2" />
            My Rewards ({redeemedRewards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canAfford = (points?.total_points || 0) >= reward.points_required;
              const usageCount = redeemedRewards.filter(r => r.reward_id === reward.id).length;
              const reachedLimit = reward.usage_limit && usageCount >= reward.usage_limit;

              return (
                <Card
                  key={reward.id}
                  className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    !canAfford || reachedLimit ? 'opacity-60' : ''
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {reward.discount_type === 'percentage' ? (
                            <Percent className="w-5 h-5 text-primary" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-primary" />
                          )}
                          {reward.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {reward.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-primary" />
                        <span className="text-2xl font-bold">{reward.points_required}</span>
                        <span className="text-sm text-muted-foreground">points</span>
                      </div>
                      <Badge variant={canAfford ? 'default' : 'secondary'}>
                        {reward.discount_type === 'percentage'
                          ? `${reward.discount_value}% OFF`
                          : `$${reward.discount_value} OFF`}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {reward.min_order_value > 0 && (
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Min. order: ${reward.min_order_value}</span>
                        </div>
                      )}
                      {reward.max_discount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Max. discount: ${reward.max_discount}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Valid for {reward.valid_days} days</span>
                      </div>
                      {reward.usage_limit && (
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          <span>
                            Used {usageCount} / {reward.usage_limit} times
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleRedeemReward(reward)}
                      disabled={!canAfford || reachedLimit || redeeming}
                    >
                      {reachedLimit
                        ? 'Usage Limit Reached'
                        : canAfford
                          ? 'Redeem Now'
                          : `Need ${reward.points_required - (points?.total_points || 0)} more points`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {rewards.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No rewards available at the moment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="redeemed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redeemedRewards.map((redeemed: any) => {
              const isExpired = new Date(redeemed.expires_at) < new Date();
              const reward = redeemed.reward;

              return (
                <Card key={redeemed.id} className={redeemed.is_used || isExpired ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{reward?.name}</CardTitle>
                        <CardDescription>{reward?.description}</CardDescription>
                      </div>
                      <Badge variant={redeemed.is_used ? 'secondary' : isExpired ? 'destructive' : 'default'}>
                        {redeemed.is_used ? 'Used' : isExpired ? 'Expired' : 'Active'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-mono font-bold">{redeemed.discount_code}</code>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyDiscountCode(redeemed.discount_code)}
                        disabled={redeemed.is_used || isExpired}
                      >
                        {copiedCode === redeemed.discount_code ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Redeemed</p>
                        <p className="font-medium">{format(new Date(redeemed.redeemed_at), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires</p>
                        <p className="font-medium">{format(new Date(redeemed.expires_at), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>

                    {redeemed.is_used && redeemed.used_at && (
                      <div className="text-sm text-muted-foreground">
                        Used on {format(new Date(redeemed.used_at), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {redeemedRewards.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">You haven't redeemed any rewards yet</p>
                <Button className="mt-4" onClick={() => document.querySelector<HTMLButtonElement>('[value="available"]')?.click()}>
                  Browse Rewards
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedReward} onOpenChange={(open) => !open && closeRedeemDialog()}>
        <DialogContent>
          {!redeemResult ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Redemption</DialogTitle>
                <DialogDescription>
                  Are you sure you want to redeem this reward?
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{selectedReward?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedReward?.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm">Points Required:</span>
                      <span className="font-bold text-lg">{selectedReward?.points_required}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Your Balance:</span>
                      <span className="font-bold text-lg">{points?.total_points}</span>
                    </div>
                    <div className="flex items-center justify-between text-primary">
                      <span className="text-sm">After Redemption:</span>
                      <span className="font-bold text-lg">
                        {(points?.total_points || 0) - (selectedReward?.points_required || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={closeRedeemDialog}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={confirmRedeem} disabled={redeeming}>
                    {redeeming ? 'Redeeming...' : 'Confirm Redemption'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Reward Redeemed Successfully!
                </DialogTitle>
                <DialogDescription>
                  Your discount code is ready to use
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6 text-center space-y-2">
                    <p className="text-sm opacity-90">Your Discount Code</p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-2xl font-mono font-bold">{redeemResult.discount_code}</code>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyDiscountCode(redeemResult.discount_code)}
                      >
                        {copiedCode === redeemResult.discount_code ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs opacity-75">
                      Valid until {format(new Date(redeemResult.expires_at), 'MMM dd, yyyy')}
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Discount Type:</span>
                    <span className="font-medium">
                      {redeemResult.discount_type === 'percentage'
                        ? `${redeemResult.discount_value}% OFF`
                        : `$${redeemResult.discount_value} OFF`}
                    </span>
                  </div>
                  {redeemResult.min_order_value > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Minimum Order:</span>
                      <span className="font-medium">${redeemResult.min_order_value}</span>
                    </div>
                  )}
                  {redeemResult.max_discount && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Maximum Discount:</span>
                      <span className="font-medium">${redeemResult.max_discount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Remaining Points:</span>
                    <span className="font-medium">{redeemResult.remaining_points}</span>
                  </div>
                </div>

                <Button className="w-full" onClick={closeRedeemDialog}>
                  Done
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
