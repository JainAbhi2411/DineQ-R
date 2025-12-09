import { useState, useEffect } from 'react';
import { MenuItem, MenuCategory } from '@/types/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { menuItemApi, imageApi } from '@/db/api';
import { Upload, X, Leaf, Flame, Wheat } from 'lucide-react';

interface AdvancedMenuItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  categories: MenuCategory[];
  editingItem: MenuItem | null;
  onSuccess: () => void;
}

export default function AdvancedMenuItemForm({
  open,
  onOpenChange,
  restaurantId,
  categories,
  editingItem,
  onSuccess,
}: AdvancedMenuItemFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    ingredients: '',
    allergens: '',
    preparation_time: '15',
    calories: '',
    spice_level: 'none' as 'none' | 'mild' | 'medium' | 'hot' | 'extra_hot',
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_available: true,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || '',
        category_id: editingItem.category_id || '',
        price: editingItem.price.toString(),
        ingredients: editingItem.ingredients || '',
        allergens: editingItem.allergens || '',
        preparation_time: editingItem.preparation_time.toString(),
        calories: editingItem.calories?.toString() || '',
        spice_level: editingItem.spice_level || 'none',
        is_vegetarian: editingItem.is_vegetarian,
        is_vegan: editingItem.is_vegan,
        is_gluten_free: editingItem.is_gluten_free,
        is_available: editingItem.is_available,
      });
      setImagePreview(editingItem.image_url || '');
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
      ingredients: '',
      allergens: '',
      preparation_time: '15',
      calories: '',
      spice_level: 'none',
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      is_available: true,
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 1MB',
          variant: 'destructive',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingItem?.image_url || null;

      if (imageFile) {
        const imagePath = `${restaurantId}/${Date.now()}-${imageFile.name}`;
        imageUrl = await imageApi.uploadImage(imageFile, imagePath);
      }

      const itemData = {
        restaurant_id: restaurantId,
        name: formData.name,
        description: formData.description || null,
        category_id: formData.category_id || null,
        price: parseFloat(formData.price),
        image_url: imageUrl,
        ingredients: formData.ingredients || null,
        allergens: formData.allergens || null,
        preparation_time: parseInt(formData.preparation_time) || 15,
        calories: formData.calories ? parseInt(formData.calories) : null,
        spice_level: formData.spice_level || null,
        is_vegetarian: formData.is_vegetarian,
        is_vegan: formData.is_vegan,
        is_gluten_free: formData.is_gluten_free,
        is_available: formData.is_available,
        item_type: (formData.is_vegan ? 'vegan' : formData.is_vegetarian ? 'veg' : 'non_veg') as 'veg' | 'non_veg' | 'vegan' | 'egg',
        variants: null,
        rating: 0,
        is_bestseller: false,
        tags: null,
        has_portions: false,
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
            Fill in the details below to {editingItem ? 'update' : 'create'} a menu item
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="dietary">Dietary</TabsTrigger>
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
                  placeholder="Describe your dish..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
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
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Item Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </div>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Max size: 1MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available for Order</Label>
                <Switch
                  id="available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="e.g., Tomatoes, Mozzarella, Basil, Olive Oil"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergens">Allergens</Label>
                <Input
                  id="allergens"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  placeholder="e.g., Dairy, Gluten, Nuts"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prep-time">Preparation Time (min)</Label>
                  <Input
                    id="prep-time"
                    type="number"
                    min="1"
                    value={formData.preparation_time}
                    onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spice">Spice Level</Label>
                <Select value={formData.spice_level} onValueChange={(value: any) => setFormData({ ...formData, spice_level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="mild">Mild 🌶️</SelectItem>
                    <SelectItem value="medium">Medium 🌶️🌶️</SelectItem>
                    <SelectItem value="hot">Hot 🌶️🌶️🌶️</SelectItem>
                    <SelectItem value="extra_hot">Extra Hot 🌶️🌶️🌶️🌶️</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="dietary" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <div>
                      <Label htmlFor="vegetarian" className="cursor-pointer">Vegetarian</Label>
                      <p className="text-xs text-muted-foreground">No meat or fish</p>
                    </div>
                  </div>
                  <Switch
                    id="vegetarian"
                    checked={formData.is_vegetarian}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_vegetarian: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-green-700" />
                    <div>
                      <Label htmlFor="vegan" className="cursor-pointer">Vegan</Label>
                      <p className="text-xs text-muted-foreground">No animal products</p>
                    </div>
                  </div>
                  <Switch
                    id="vegan"
                    checked={formData.is_vegan}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_vegan: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wheat className="w-5 h-5 text-amber-600" />
                    <div>
                      <Label htmlFor="gluten-free" className="cursor-pointer">Gluten Free</Label>
                      <p className="text-xs text-muted-foreground">No wheat, barley, or rye</p>
                    </div>
                  </div>
                  <Switch
                    id="gluten-free"
                    checked={formData.is_gluten_free}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_gluten_free: checked })}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Dietary Tags Preview</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.is_vegetarian && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Vegetarian
                    </Badge>
                  )}
                  {formData.is_vegan && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Vegan
                    </Badge>
                  )}
                  {formData.is_gluten_free && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      <Wheat className="w-3 h-3 mr-1" />
                      Gluten Free
                    </Badge>
                  )}
                  {formData.spice_level !== 'none' && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      <Flame className="w-3 h-3 mr-1" />
                      {formData.spice_level}
                    </Badge>
                  )}
                  {(!formData.is_vegetarian && !formData.is_vegan && !formData.is_gluten_free && formData.spice_level === 'none') && (
                    <span className="text-sm text-muted-foreground">No dietary tags selected</span>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
