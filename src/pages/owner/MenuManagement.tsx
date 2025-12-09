import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { restaurantApi, menuCategoryApi, menuItemApi } from '@/db/api';
import { Restaurant, MenuCategory, MenuItem } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import { Plus, Edit, Trash2, ArrowLeft, Save, Star, Clock, Flame, Eye, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedMenuItemForm from '@/components/owner/EnhancedMenuItemForm';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { cn } from '@/lib/utils';

export default function MenuManagement() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency, formatDateTime, formatDate } = useFormatters();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuPreviewOpen, setMenuPreviewOpen] = useState(false);

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const loadData = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      const [restaurantData, categoriesData, itemsData] = await Promise.all([
        restaurantApi.getRestaurantById(restaurantId),
        menuCategoryApi.getCategoriesByRestaurant(restaurantId),
        menuItemApi.getItemsByRestaurant(restaurantId),
      ]);
      
      setRestaurant(restaurantData);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      if (editingCategory) {
        await menuCategoryApi.updateCategory(editingCategory.id, categoryForm);
        toast({ title: 'Success', description: 'Category updated successfully' });
      } else {
        await menuCategoryApi.createCategory({
          ...categoryForm,
          restaurant_id: restaurantId,
          image_url: null,
          is_active: true,
        });
        toast({ title: 'Success', description: 'Category created successfully' });
      }
      setCategoryDialogOpen(false);
      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await menuCategoryApi.deleteCategory(id);
      toast({ title: 'Success', description: 'Category deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await menuItemApi.deleteItem(id);
      toast({ title: 'Success', description: 'Menu item deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete menu item',
        variant: 'destructive',
      });
    }
  };

  const openEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
    });
    setCategoryDialogOpen(true);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemDialogOpen(true);
  };

  const getFoodTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'veg': return '🥗';
      case 'non_veg': return '🍖';
      case 'vegan': return '🌱';
      case 'egg': return '🥚';
      default: return '🍽️';
    }
  };

  const getSpiceLevelDisplay = (spiceLevel: string | null) => {
    if (!spiceLevel || spiceLevel === 'none') return null;
    const levels = {
      mild: '🌶️',
      medium: '🌶️🌶️',
      hot: '🌶️🌶️🌶️',
      extra_hot: '🌶️🌶️🌶️🌶️',
    };
    return levels[spiceLevel as keyof typeof levels] || null;
  };

  if (loading) {
    return (
      <OwnerLayout title="Menu Management">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title={`${restaurant?.name} - Menu Management`}>
      <div className="max-w-7xl mx-auto px-3 xl:px-4 sm:px-6 lg:px-8 py-4 xl:py-8">
        <div className="mb-4 xl:mb-8">
          <p className="text-muted-foreground text-sm xl:text-base">Manage your menu categories and items</p>
        </div>

        <Tabs defaultValue="items" className="space-y-4 xl:space-y-6">
          <TabsList className="w-full xl:w-auto">
            <TabsTrigger value="items" className="flex-1 xl:flex-none">Menu Items</TabsTrigger>
            <TabsTrigger value="categories" className="flex-1 xl:flex-none">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 xl:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg xl:text-2xl font-semibold">Categories</h2>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', description: '' }); }}
                    size="sm"
                    className="h-8 xl:h-10"
                  >
                    <Plus className="w-3.5 h-3.5 xl:w-4 xl:h-4 xl:mr-2" />
                    <span className="hidden xl:inline">Add Category</span>
                    <span className="xl:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    <DialogDescription>
                      Create categories to organize your menu items
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cat-name">Category Name *</Label>
                      <Input
                        id="cat-name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        placeholder="e.g., Appetizers, Main Course"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cat-desc">Description</Label>
                      <Textarea
                        id="cat-desc"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        placeholder="Optional description"
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      {editingCategory ? 'Update' : 'Create'} Category
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {categories.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">No categories yet</p>
                  <Button onClick={() => setCategoryDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Category
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 xl:gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="p-4 xl:p-6">
                      <CardTitle className="text-base xl:text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-xs xl:text-sm">{category.description || 'No description'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2 p-4 xl:p-6">
                      <Button variant="outline" size="sm" onClick={() => openEditCategory(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="items" className="space-y-4 xl:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg xl:text-2xl font-semibold">Menu Items</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setMenuPreviewOpen(true)}
                  size="sm"
                  className="h-8 xl:h-10"
                >
                  <Eye className="w-3.5 h-3.5 xl:w-4 xl:h-4 xl:mr-2" />
                  <span className="hidden xl:inline">View Menu</span>
                </Button>
                <Button 
                  disabled={categories.length === 0}
                  onClick={() => {
                    setEditingItem(null);
                    setItemDialogOpen(true);
                  }}
                  size="sm"
                  className="h-8 xl:h-10"
                >
                  <Plus className="w-3.5 h-3.5 xl:w-4 xl:h-4 xl:mr-2" />
                  <span className="hidden xl:inline">Add Menu Item</span>
                  <span className="xl:hidden">Add</span>
                </Button>
              </div>
            </div>

            <EnhancedMenuItemForm
              open={itemDialogOpen}
              onOpenChange={(open) => {
                setItemDialogOpen(open);
                if (!open) {
                  setEditingItem(null);
                }
              }}
              restaurantId={restaurantId!}
              categories={categories}
              editingItem={editingItem}
              onSuccess={loadData}
            />

            {categories.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">Create categories first to add menu items</p>
                  <Button onClick={() => setCategoryDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </CardContent>
              </Card>
            ) : menuItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">No menu items yet</p>
                  <Button onClick={() => setItemDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Item
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => {
                  const categoryItems = menuItems.filter((item) => item.category_id === category.id);
                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category.id}>
                      <h3 className="text-lg xl:text-xl font-semibold mb-3 xl:mb-4">{category.name}</h3>
                      <div className="grid grid-cols-1 gap-3 xl:gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                        {categoryItems.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            {item.image_url && (
                              <div className="h-32 xl:h-48 overflow-hidden relative">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                {item.is_bestseller && (
                                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                                    <Star className="w-3 h-3 fill-current" />
                                    Bestseller
                                  </div>
                                )}
                              </div>
                            )}
                            <CardHeader className="p-3 xl:p-6">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-start gap-2 flex-1">
                                  <span className="text-base xl:text-lg">{getFoodTypeIcon(item.item_type)}</span>
                                  <CardTitle className="text-base xl:text-lg">{item.name}</CardTitle>
                                </div>
                                <span className="text-base xl:text-lg font-bold text-primary whitespace-nowrap">
                                  ${formatCurrency(item.price)}
                                </span>
                              </div>
                              
                              {item.description && (
                                <CardDescription className="line-clamp-2 text-xs xl:text-sm">
                                  {item.description}
                                </CardDescription>
                              )}

                              <div className="flex flex-wrap gap-1.5 xl:gap-2 mt-2">
                                {item.preparation_time && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {item.preparation_time} min
                                  </Badge>
                                )}
                                {getSpiceLevelDisplay(item.spice_level) && (
                                  <Badge variant="secondary" className="text-xs">
                                    {getSpiceLevelDisplay(item.spice_level)}
                                  </Badge>
                                )}
                                {item.calories && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Flame className="w-3 h-3 mr-1" />
                                    {item.calories} cal
                                  </Badge>
                                )}
                                {item.variants && item.variants.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.variants.length} sizes
                                  </Badge>
                                )}
                              </div>

                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {item.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardHeader>
                            <CardContent className="flex gap-2 p-3 xl:p-6">
                              <Button variant="outline" size="sm" onClick={() => openEditItem(item)} className="h-8 xl:h-9">
                                <Edit className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)} className="h-8 xl:h-9">
                                <Trash2 className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-destructive" />
                              </Button>
                              <div className="ml-auto flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 xl:py-1 rounded-full ${item.is_available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                                  {item.is_available ? 'Available' : 'Unavailable'}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Menu Preview Sheet */}
        <Sheet open={menuPreviewOpen} onOpenChange={setMenuPreviewOpen}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl">Menu Preview</SheetTitle>
              <SheetDescription>
                This is how customers will see your menu
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Restaurant Info */}
              {restaurant && (
                <div className="pb-4 border-b">
                  <h3 className="text-xl font-bold">{restaurant.name}</h3>
                  {restaurant.location && (
                    <p className="text-sm text-muted-foreground mt-1">{restaurant.location}</p>
                  )}
                </div>
              )}

              {/* Menu Categories with Items */}
              {categories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No menu items to display</p>
                  <p className="text-sm mt-2">Add categories and items to see them here</p>
                </div>
              ) : (
                <Accordion type="multiple" defaultValue={categories.map(c => c.id)} className="space-y-4">
                  {categories.map((category) => {
                    const categoryItems = menuItems.filter((item) => item.category_id === category.id && item.is_available);
                    if (categoryItems.length === 0) return null;

                    return (
                      <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="text-left">
                              <h3 className="text-lg font-semibold">{category.name}</h3>
                              {category.description && (
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                              )}
                            </div>
                            <Badge variant="secondary">{categoryItems.length} items</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            {categoryItems.map((item) => (
                              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                {/* Item Type Icon */}
                                <div className="flex-shrink-0 mt-1">
                                  <div className={cn(
                                    "w-5 h-5 rounded-sm flex items-center justify-center border-2",
                                    item.is_vegetarian 
                                      ? "border-green-600" 
                                      : item.is_vegan 
                                      ? "border-green-700" 
                                      : "border-red-600"
                                  )}>
                                    <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      item.is_vegetarian 
                                        ? "bg-green-600" 
                                        : item.is_vegan 
                                        ? "bg-green-700" 
                                        : "bg-red-600"
                                    )} />
                                  </div>
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">{item.name}</h4>
                                        {item.is_bestseller && (
                                          <Badge variant="default" className="text-xs">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            Bestseller
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      {item.description && (
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                          {item.description}
                                        </p>
                                      )}

                                      {/* Item Metadata */}
                                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                        {item.preparation_time && (
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {item.preparation_time} min
                                          </span>
                                        )}
                                        {item.calories && (
                                          <span className="flex items-center gap-1">
                                            <Flame className="w-3 h-3" />
                                            {item.calories} cal
                                          </span>
                                        )}
                                        {item.rating && item.rating > 0 && (
                                          <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                                            {item.rating.toFixed(1)}
                                          </span>
                                        )}
                                        {getSpiceLevelDisplay(item.spice_level) && (
                                          <span>{getSpiceLevelDisplay(item.spice_level)}</span>
                                        )}
                                      </div>

                                      {/* Dietary Badges */}
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {item.is_vegan && (
                                          <Badge variant="outline" className="text-xs">
                                            🌱 Vegan
                                          </Badge>
                                        )}
                                        {item.is_gluten_free && (
                                          <Badge variant="outline" className="text-xs">
                                            Gluten-Free
                                          </Badge>
                                        )}
                                      </div>
                                    </div>

                                    {/* Item Image (if available) */}
                                    {item.image_url && (
                                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                                        <img 
                                          src={item.image_url} 
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Price */}
                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-primary">
                                      {formatCurrency(item.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </OwnerLayout>
  );
}
