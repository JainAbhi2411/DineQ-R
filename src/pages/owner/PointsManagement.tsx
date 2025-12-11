import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Coins, Gift, Users, TrendingUp, Plus, Edit, Trash2, DollarSign, Percent } from 'lucide-react';
import { pointsApi } from '@/db/api';
import { RewardsCatalog } from '@/types/types';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface RewardFormData {
  name: string;
  description: string;
  points_required: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount?: number;
  min_order_value: number;
  valid_days: number;
  is_active: boolean;
  usage_limit?: number;
  display_order: number;
}

export default function PointsManagement() {
  const [rewards, setRewards] = useState<RewardsCatalog[]>([]);
  const [customerPoints, setCustomerPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardsCatalog | null>(null);

  const form = useForm<RewardFormData>({
    defaultValues: {
      name: '',
      description: '',
      points_required: 100,
      discount_type: 'percentage',
      discount_value: 5,
      max_discount: undefined,
      min_order_value: 0,
      valid_days: 30,
      is_active: true,
      usage_limit: undefined,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rewardsData, pointsData] = await Promise.all([
        pointsApi.getAllRewards(),
        pointsApi.getAllCustomerPoints(),
      ]);
      setRewards(rewardsData);
      setCustomerPoints(pointsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReward = () => {
    setEditingReward(null);
    form.reset({
      name: '',
      description: '',
      points_required: 100,
      discount_type: 'percentage',
      discount_value: 5,
      max_discount: undefined,
      min_order_value: 0,
      valid_days: 30,
      is_active: true,
      usage_limit: undefined,
      display_order: rewards.length,
    });
    setDialogOpen(true);
  };

  const handleEditReward = (reward: RewardsCatalog) => {
    setEditingReward(reward);
    form.reset({
      name: reward.name,
      description: reward.description,
      points_required: reward.points_required,
      discount_type: reward.discount_type,
      discount_value: Number(reward.discount_value),
      max_discount: reward.max_discount ? Number(reward.max_discount) : undefined,
      min_order_value: Number(reward.min_order_value),
      valid_days: reward.valid_days,
      is_active: reward.is_active,
      usage_limit: reward.usage_limit || undefined,
      display_order: reward.display_order,
    });
    setDialogOpen(true);
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;

    try {
      await pointsApi.deleteReward(id);
      toast.success('Reward deleted successfully');
      await loadData();
    } catch (error: any) {
      console.error('Error deleting reward:', error);
      toast.error(error.message || 'Failed to delete reward');
    }
  };

  const onSubmit = async (data: RewardFormData) => {
    try {
      if (editingReward) {
        await pointsApi.updateReward(editingReward.id, data);
        toast.success('Reward updated successfully');
      } else {
        await pointsApi.createReward(data);
        toast.success('Reward created successfully');
      }
      setDialogOpen(false);
      await loadData();
    } catch (error: any) {
      console.error('Error saving reward:', error);
      toast.error(error.message || 'Failed to save reward');
    }
  };

  const totalPoints = customerPoints.reduce((sum, cp) => sum + cp.total_points, 0);
  const totalLifetimePoints = customerPoints.reduce((sum, cp) => sum + cp.lifetime_points, 0);
  const totalRedeemed = customerPoints.reduce((sum, cp) => sum + cp.points_redeemed, 0);

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
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Coins className="w-8 h-8 text-primary" />
            Points & Rewards Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage customer loyalty program</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-primary" />
              <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <p className="text-2xl font-bold">{totalLifetimePoints.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Redeemed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-orange-500" />
              <p className="text-2xl font-bold">{totalRedeemed.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <p className="text-2xl font-bold">{customerPoints.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rewards">Rewards Catalog</TabsTrigger>
          <TabsTrigger value="customers">Customer Points</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Rewards Catalog</h2>
            <Button onClick={handleCreateReward}>
              <Plus className="w-4 h-4 mr-2" />
              Create Reward
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className={!reward.is_active ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription className="mt-1">{reward.description}</CardDescription>
                    </div>
                    <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                      {reward.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Points Required:</span>
                    <span className="font-bold">{reward.points_required}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Discount:</span>
                    <span className="font-bold">
                      {reward.discount_type === 'percentage'
                        ? `${reward.discount_value}%`
                        : `$${reward.discount_value}`}
                    </span>
                  </div>
                  {reward.min_order_value > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Min. Order:</span>
                      <span className="font-medium">${reward.min_order_value}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valid Days:</span>
                    <span className="font-medium">{reward.valid_days}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditReward(reward)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDeleteReward(reward.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {rewards.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No rewards created yet</p>
                <Button className="mt-4" onClick={handleCreateReward}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Reward
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Points Overview</CardTitle>
              <CardDescription>View all customer points balances and tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Available Points</TableHead>
                    <TableHead className="text-right">Lifetime Points</TableHead>
                    <TableHead className="text-right">Redeemed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerPoints.map((cp: any) => (
                    <TableRow key={cp.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cp.profile?.full_name || cp.profile?.username || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{cp.profile?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {cp.tier_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{cp.total_points.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{cp.lifetime_points.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{cp.points_redeemed.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {customerPoints.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No customers with points yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReward ? 'Edit Reward' : 'Create New Reward'}</DialogTitle>
            <DialogDescription>
              {editingReward ? 'Update reward details' : 'Add a new reward to the catalog'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10% Off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the reward..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="points_required"
                  rules={{ required: 'Points required', min: { value: 1, message: 'Must be at least 1' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Required</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discount_value"
                  rules={{ required: 'Discount value required', min: { value: 0.01, message: 'Must be greater than 0' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        {form.watch('discount_type') === 'percentage' ? 'Percentage (e.g., 10 for 10%)' : 'Dollar amount'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>For percentage discounts</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_order_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valid_days"
                  rules={{ required: 'Valid days required', min: { value: 1, message: 'Must be at least 1' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Days</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormDescription>Days until expiration</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="usage_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>Max times per customer</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Make this reward available to customers</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingReward ? 'Update Reward' : 'Create Reward'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
