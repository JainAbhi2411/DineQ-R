import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { menuItemApi } from '@/db/api';
import { MenuItem, MenuCategory, ItemType, SpiceLevel, MenuItemVariant } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import { Plus, X, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from '@/components/ui/ImageUpload';

interface EnhancedMenuItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  categories: MenuCategory[];
  editingItem: MenuItem | null;
  onSuccess: () => void;
}

export default function EnhancedMenuItemForm({
  open,
  onOpenChange,
  restaurantId,
  categories,
  editingItem,
  onSuccess,
}: EnhancedMenuItemFormProps) {
  const { toast } = useToast();
  const { formatCurrency, formatDateTime, formatDate } = useFormatters();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    image_url: '',
    item_type: 'veg' as ItemType,
    spice_level: 'none' as SpiceLevel,
    preparation_time: '15',
    calories: '',
    ingredients: '',
    allergens: '',
    is_available: true,
    is_bestseller: false,
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    has_portions: false,
  });
  const [variants, setVariants] = useState<MenuItemVariant[]>([]);
  const [variantForm, setVariantForm] = useState({ name: '', price: '', description: '' });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || '',
        category_id: editingItem.category_id || '',
        price: editingItem.price.toString(),
        image_url: editingItem.image_url || '',
        item_type: editingItem.item_type,
        spice_level: editingItem.spice_level || 'none',
        preparation_time: editingItem.preparation_time?.toString() || '15',
        calories: editingItem.calories?.toString() || '',
        ingredients: editingItem.ingredients || '',
        allergens: editingItem.allergens || '',
        is_available: editingItem.is_available,
        is_bestseller: editingItem.is_bestseller,
        is_vegetarian: editingItem.is_vegetarian,
        is_vegan: editingItem.is_vegan,
        is_gluten_free: editingItem.is_gluten_free,
        has_portions: editingItem.has_portions || false,
      });
      setVariants(editingItem.variants || []);
      setTags(editingItem.tags || []);
    } else {
      resetForm();
    }
  }, [editingItem, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: '',
      price: '',
      image_url: '',
      item_type: 'veg',
      spice_level: 'none',
      preparation_time: '15',
      calories: '',
      ingredients: '',
      allergens: '',
      is_available: true,
      is_bestseller: false,
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: false,
      has_portions: false,
    });
    setVariants([]);
    setTags([]);
    setVariantForm({ name: '', price: '', description: '' });
    setTagInput('');
  };

  const addVariant = () => {
    if (variantForm.name && variantForm.price) {
      setVariants([...variants, {
        name: variantForm.name,
        price: parseFloat(variantForm.price),
        description: variantForm.description || undefined,
      }]);
      setVariantForm({ name: '', price: '', description: '' });
    }
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category_id) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time) || 15,
        calories: formData.calories ? parseInt(formData.calories) : null,
        restaurant_id: restaurantId,
        variants: variants.length > 0 ? variants : null,
        tags: tags.length > 0 ? tags : null,
        rating: 0,
      };

      if (editingItem) {
        await menuItemApi.updateItem(editingItem.id, itemData);
        toast({ title: 'Success', description: 'Menu item updated successfully' });
      } else {
        await menuItemApi.createItem(itemData);
        toast({ title: 'Success', description: 'Menu item created successfully' });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save menu item',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          <DialogDescription>
            {editingItem ? 'Update menu item details' : 'Add a new item to your menu'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Tags</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the dish..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Base Price * ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <ImageUpload
                restaurantId={restaurantId}
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_type">Food Type *</Label>
                  <Select
                    value={formData.item_type}
                    onValueChange={(value: ItemType) => setFormData({ ...formData, item_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">🥗 Vegetarian</SelectItem>
                      <SelectItem value="non_veg">🍖 Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">🌱 Vegan</SelectItem>
                      <SelectItem value="egg">🥚 Contains Egg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spice_level">Spice Level</Label>
                  <Select
                    value={formData.spice_level}
                    onValueChange={(value: SpiceLevel) => setFormData({ ...formData, spice_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Spice</SelectItem>
                      <SelectItem value="mild">🌶️ Mild</SelectItem>
                      <SelectItem value="medium">🌶️🌶️ Medium</SelectItem>
                      <SelectItem value="hot">🌶️🌶️🌶️ Hot</SelectItem>
                      <SelectItem value="extra_hot">🌶️🌶️🌶️🌶️ Extra Hot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prep_time">Preparation Time (min)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    value={formData.preparation_time}
                    onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="List main ingredients..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergens">Allergens</Label>
                <Input
                  id="allergens"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="e.g., Nuts, Dairy, Gluten"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="available">Available</Label>
                  <Switch
                    id="available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <Label htmlFor="bestseller">Mark as Bestseller</Label>
                  </div>
                  <Switch
                    id="bestseller"
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="gluten_free">Gluten Free</Label>
                  <Switch
                    id="gluten_free"
                    checked={formData.is_gluten_free}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_gluten_free: checked })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-accent/50">
                  <div className="space-y-1">
                    <Label htmlFor="has_portions" className="font-semibold">Enable Half/Full Portions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to choose between half and full portions
                    </p>
                  </div>
                  <Switch
                    id="has_portions"
                    checked={formData.has_portions}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_portions: checked })}
                  />
                </div>

                {formData.has_portions && (
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <p className="text-sm text-muted-foreground mb-3">
                      💡 Add "Half" and "Full" variants below with their respective prices
                    </p>
                  </div>
                )}

                <h4 className="font-semibold">Price Variants (Optional)</h4>
                <p className="text-sm text-muted-foreground">
                  {formData.has_portions 
                    ? 'Add Half and Full portion prices, or other size options' 
                    : 'Add different sizes or portions'}
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Name (e.g., Small)"
                    value={variantForm.name}
                    onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                  />
                  <Button type="button" onClick={addVariant}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {variants.length > 0 && (
                  <div className="space-y-2">
                    {variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{variant.name}</span>
                          <span className="text-muted-foreground ml-2">${formatCurrency(variant.price)}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Tags</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags (e.g., Spicy, Popular)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
