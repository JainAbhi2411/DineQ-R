import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, Calendar, Percent, TrendingUp, Edit, Trash2, Power, PowerOff, Copy, Users, DollarSign } from 'lucide-react';
import { promotionApi } from '@/db/api';
import type { Promotion, DiscountType, CreatePromotionInput, UpdatePromotionInput } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Promotions() {
  const { restaurantId } = useParams();
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<{
    code: string;
    title: string;
    description: string;
    discount_type: DiscountType;
    discount_value: string;
    min_order_amount: string;
    max_discount: string;
    start_date: string;
    end_date: string;
    usage_limit_per_customer: string;
    total_usage_limit: string;
    terms: string;
  }>({
    code: '',
    title: '',
    description: '',
    discount_type: 'PERCENTAGE',
    discount_value: '',
    min_order_amount: '0',
    max_discount: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usage_limit_per_customer: '',
    total_usage_limit: '',
    terms: '',
  });

  useEffect(() => {
    if (restaurantId) {
      loadPromotions();
    }
  }, [restaurantId]);

  const loadPromotions = async () => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const data = await promotionApi.getPromotionsByRestaurant(restaurantId);
      setPromotions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load promotions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = async () => {
    if (!restaurantId) return;
    try {
      const promotionData: CreatePromotionInput = {
        restaurant_id: restaurantId,
        code: formData.code.toUpperCase(),
        title: formData.title,
        description: formData.description || undefined,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: parseFloat(formData.min_order_amount) || 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : undefined,
        start_date: new Date(formData.start_date + 'T00:00:00').toISOString(),
        end_date: new Date(formData.end_date + 'T23:59:59').toISOString(),
        usage_limit_per_customer: formData.usage_limit_per_customer ? parseInt(formData.usage_limit_per_customer) : undefined,
        total_usage_limit: formData.total_usage_limit ? parseInt(formData.total_usage_limit) : undefined,
        terms: formData.terms || undefined,
      };

      await promotionApi.createPromotion(promotionData);
      toast({
        title: 'Success',
        description: 'Promotion created successfully',
      });
      setShowAddDialog(false);
      resetForm();
      loadPromotions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create promotion',
        variant: 'destructive',
      });
    }
  };

  const handleEditPromotion = async () => {
    if (!editingPromotion) return;
    try {
      const updates: UpdatePromotionInput = {
        code: formData.code.toUpperCase(),
        title: formData.title,
        description: formData.description || undefined,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: parseFloat(formData.min_order_amount) || 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : undefined,
        start_date: new Date(formData.start_date + 'T00:00:00').toISOString(),
        end_date: new Date(formData.end_date + 'T23:59:59').toISOString(),
        usage_limit_per_customer: formData.usage_limit_per_customer ? parseInt(formData.usage_limit_per_customer) : undefined,
        total_usage_limit: formData.total_usage_limit ? parseInt(formData.total_usage_limit) : undefined,
        terms: formData.terms || undefined,
      };

      await promotionApi.updatePromotion(editingPromotion.id, updates);
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });
      setShowEditDialog(false);
      setEditingPromotion(null);
      resetForm();
      loadPromotions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update promotion',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePromotion = async () => {
    if (!deletingPromotion) return;
    try {
      await promotionApi.deletePromotion(deletingPromotion.id);
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });
      setShowDeleteDialog(false);
      setDeletingPromotion(null);
      loadPromotions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete promotion',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      await promotionApi.updatePromotion(promotion.id, {
        is_active: !promotion.is_active,
      });
      toast({
        title: 'Success',
        description: `Promotion ${!promotion.is_active ? 'activated' : 'deactivated'} successfully`,
      });
      loadPromotions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update promotion status',
        variant: 'destructive',
      });
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: 'Promo code copied to clipboard',
    });
  };

  const openEditDialog = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      title: promotion.title,
      description: promotion.description || '',
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value.toString(),
      min_order_amount: promotion.min_order_amount.toString(),
      max_discount: promotion.max_discount?.toString() || '',
      start_date: new Date(promotion.start_date).toISOString().split('T')[0],
      end_date: new Date(promotion.end_date).toISOString().split('T')[0],
      usage_limit_per_customer: promotion.usage_limit_per_customer?.toString() || '',
      total_usage_limit: promotion.total_usage_limit?.toString() || '',
      terms: promotion.terms || '',
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (promotion: Promotion) => {
    setDeletingPromotion(promotion);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      discount_type: 'PERCENTAGE',
      discount_value: '',
      min_order_amount: '0',
      max_discount: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usage_limit_per_customer: '',
      total_usage_limit: '',
      terms: '',
    });
  };

  const getDiscountDisplay = (promotion: Promotion) => {
    if (promotion.discount_type === 'PERCENTAGE') {
      return `${promotion.discount_value}% OFF`;
    }
    return `$${promotion.discount_value} OFF`;
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    if (!promotion.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (now < startDate) {
      return <Badge variant="outline">Scheduled</Badge>;
    }
    if (now > endDate) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (promotion.total_usage_limit && promotion.used_count >= promotion.total_usage_limit) {
      return <Badge variant="destructive">Limit Reached</Badge>;
    }
    return <Badge className="bg-green-500">Active</Badge>;
  };

  return (
    <OwnerLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions & Offers</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage promotional offers for your restaurant
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading promotions...</div>
        ) : promotions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No promotions yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first promotion to attract more customers
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{promotion.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {promotion.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(promotion)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      <span className="font-mono font-bold text-lg">{promotion.code}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPromoCode(promotion.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Discount</span>
                      <span className="font-semibold text-primary">
                        {getDiscountDisplay(promotion)}
                      </span>
                    </div>

                    {promotion.min_order_amount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Min. Order</span>
                        <span className="font-medium">${promotion.min_order_amount}</span>
                      </div>
                    )}

                    {promotion.max_discount && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Max. Discount</span>
                        <span className="font-medium">${promotion.max_discount}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Valid Period</span>
                      <span className="text-sm">
                        {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Used
                      </span>
                      <span className="font-medium">
                        {promotion.used_count}
                        {promotion.total_usage_limit && ` / ${promotion.total_usage_limit}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(promotion)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(promotion)}
                    >
                      {promotion.is_active ? (
                        <PowerOff className="w-4 h-4" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(promotion)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
              <DialogDescription>
                Set up a new promotional offer for your customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Promo Code *</Label>
                  <Input
                    id="code"
                    placeholder="SAVE20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: DiscountType) => setFormData({ ...formData, discount_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="20% Off on Orders Above $30"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Get 20% discount on all orders above $30"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    Discount Value * {formData.discount_type === 'PERCENTAGE' ? '(%)' : '($)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    placeholder={formData.discount_type === 'PERCENTAGE' ? '20' : '5'}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_order_amount">Min. Order Amount ($)</Label>
                  <Input
                    id="min_order_amount"
                    type="number"
                    placeholder="0"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  />
                </div>
              </div>

              {formData.discount_type === 'PERCENTAGE' && (
                <div className="space-y-2">
                  <Label htmlFor="max_discount">Max. Discount Cap ($)</Label>
                  <Input
                    id="max_discount"
                    type="number"
                    placeholder="Optional"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usage_limit_per_customer">Usage Limit Per Customer</Label>
                  <Input
                    id="usage_limit_per_customer"
                    type="number"
                    placeholder="Unlimited"
                    value={formData.usage_limit_per_customer}
                    onChange={(e) => setFormData({ ...formData, usage_limit_per_customer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_usage_limit">Total Usage Limit</Label>
                  <Input
                    id="total_usage_limit"
                    type="number"
                    placeholder="Unlimited"
                    value={formData.total_usage_limit}
                    onChange={(e) => setFormData({ ...formData, total_usage_limit: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Enter terms and conditions..."
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleAddPromotion}>Create Promotion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Promotion</DialogTitle>
              <DialogDescription>
                Update promotion details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Promo Code *</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-discount_type">Discount Type *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: DiscountType) => setFormData({ ...formData, discount_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-discount_value">
                    Discount Value * {formData.discount_type === 'PERCENTAGE' ? '(%)' : '($)'}
                  </Label>
                  <Input
                    id="edit-discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-min_order_amount">Min. Order Amount ($)</Label>
                  <Input
                    id="edit-min_order_amount"
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  />
                </div>
              </div>

              {formData.discount_type === 'PERCENTAGE' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-max_discount">Max. Discount Cap ($)</Label>
                  <Input
                    id="edit-max_discount"
                    type="number"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_date">Start Date *</Label>
                  <Input
                    id="edit-start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end_date">End Date *</Label>
                  <Input
                    id="edit-end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-usage_limit_per_customer">Usage Limit Per Customer</Label>
                  <Input
                    id="edit-usage_limit_per_customer"
                    type="number"
                    value={formData.usage_limit_per_customer}
                    onChange={(e) => setFormData({ ...formData, usage_limit_per_customer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-total_usage_limit">Total Usage Limit</Label>
                  <Input
                    id="edit-total_usage_limit"
                    type="number"
                    value={formData.total_usage_limit}
                    onChange={(e) => setFormData({ ...formData, total_usage_limit: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-terms">Terms & Conditions</Label>
                <Textarea
                  id="edit-terms"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowEditDialog(false); setEditingPromotion(null); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleEditPromotion}>Update Promotion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingPromotion?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingPromotion(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePromotion}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </OwnerLayout>
  );
}
