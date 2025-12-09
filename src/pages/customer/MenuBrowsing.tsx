import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { restaurantApi, menuCategoryApi, menuItemApi, tableApi, orderApi, promotionApi } from '@/db/api';
import { Restaurant, MenuCategory, MenuItem, ItemType, RestaurantType, MenuItemVariant, CartItem, OrderWithItems, PromotionValidation, Promotion } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Search, 
  MapPin, 
  Star,
  Clock,
  Leaf,
  Flame,
  X,
  ChevronRight,
  Award,
  ChefHat,
  Info,
  LayoutGrid,
  List,
  AlertCircle,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TableSelectionDialog from '@/components/customer/TableSelectionDialog';
import AddToExistingOrderDialog from '@/components/customer/AddToExistingOrderDialog';
import OffersModal from '@/components/customer/OffersModal';
import OffersBanner from '@/components/customer/OffersBanner';
import PromoCodeInput from '@/components/customer/PromoCodeInput';
import OrderChatBot from '@/components/customer/OrderChatBot';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ExtendedCartItem extends CartItem {
  id: string;
}

export default function MenuBrowsing() {
  const { restaurantId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency } = useFormatters();
  const { user } = useAuth();
  const tableId = searchParams.get('table');
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemType, setSelectedItemType] = useState<ItemType | 'all'>('all');
  const [cart, setCart] = useState<ExtendedCartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemDetailDialogOpen, setItemDetailDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | null>(null);
  const [selectedPortionSize, setSelectedPortionSize] = useState<'full' | 'half'>('full');
  const [viewMode, setViewMode] = useState<'grid' | 'menu'>('grid');
  const [tableSelectionOpen, setTableSelectionOpen] = useState(false);
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
  const [existingOrder, setExistingOrder] = useState<OrderWithItems | null>(null);
  const [addToExistingDialogOpen, setAddToExistingDialogOpen] = useState(false);
  const [offersModalOpen, setOffersModalOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromotionValidation | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  // Debug: Log promotions state changes
  useEffect(() => {
    console.log('[MenuBrowsing] Promotions state updated:', {
      count: promotions.length,
      promotions: promotions.map(p => ({
        id: p.id,
        code: p.code,
        title: p.title,
        is_active: p.is_active,
        start_date: p.start_date,
        end_date: p.end_date
      }))
    });
  }, [promotions]);

  // Real-time subscriptions for menu updates
  useEffect(() => {
    if (!restaurantId) return;

    console.log('[MenuBrowsing] Setting up real-time subscriptions for restaurant:', restaurantId);

    // Subscribe to menu items changes
    const menuItemsChannel = supabase
      .channel(`menu_items_${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('[MenuBrowsing] Menu item change detected:', {
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString()
          });
          console.log('[MenuBrowsing] Full payload:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newItem = payload.new as MenuItem;
            setMenuItems(prev => {
              console.log('[MenuBrowsing] Adding new item, current count:', prev.length);
              return [...prev, newItem];
            });
            toast({
              title: '🎉 New Item Added!',
              description: `${newItem.name} is now available`,
              duration: 3000,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedItem = payload.new as MenuItem;
            const oldItem = payload.old as MenuItem;
            
            console.log('[MenuBrowsing] Item updated:', {
              id: updatedItem.id,
              name: updatedItem.name,
              oldPreparationTime: oldItem.preparation_time,
              newPreparationTime: updatedItem.preparation_time,
              oldPrice: oldItem.price,
              newPrice: updatedItem.price,
              allChanges: payload
            });
            
            setMenuItems(prev => {
              const itemIndex = prev.findIndex(item => item.id === updatedItem.id);
              if (itemIndex === -1) {
                console.warn('[MenuBrowsing] Item not found in current list:', updatedItem.id);
                return prev;
              }
              
              const updated = prev.map(item => 
                item.id === updatedItem.id ? updatedItem : item
              );
              console.log('[MenuBrowsing] Menu items updated successfully, count:', updated.length);
              console.log('[MenuBrowsing] Updated item at index:', itemIndex);
              return updated;
            });
            
            // Show detailed notification
            const changes = [];
            if (oldItem.name !== updatedItem.name) changes.push('name');
            if (oldItem.price !== updatedItem.price) changes.push('price');
            if (oldItem.preparation_time !== updatedItem.preparation_time) changes.push('preparation time');
            if (oldItem.description !== updatedItem.description) changes.push('description');
            if (oldItem.is_available !== updatedItem.is_available) changes.push('availability');
            
            const changeText = changes.length > 0 ? ` (${changes.join(', ')})` : '';
            
            toast({
              title: '✏️ Menu Updated',
              description: `${updatedItem.name} has been updated${changeText}`,
              duration: 3000,
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedItem = payload.old as MenuItem;
            setMenuItems(prev => prev.filter(item => item.id !== deletedItem.id));
            toast({
              title: '🗑️ Item Removed',
              description: 'A menu item has been removed',
              duration: 2000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('[MenuBrowsing] Menu items subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('[MenuBrowsing] ✅ Successfully subscribed to menu items changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[MenuBrowsing] ❌ Error subscribing to menu items');
        }
      });

    // Subscribe to categories changes
    const categoriesChannel = supabase
      .channel(`categories_${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('[MenuBrowsing] Category change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newCategory = payload.new as MenuCategory;
            setCategories(prev => [...prev, newCategory]);
            toast({
              title: '📂 New Category Added!',
              description: newCategory.name,
              duration: 3000,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedCategory = payload.new as MenuCategory;
            setCategories(prev => prev.map(cat => 
              cat.id === updatedCategory.id ? updatedCategory : cat
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedCategory = payload.old as MenuCategory;
            setCategories(prev => prev.filter(cat => cat.id !== deletedCategory.id));
            // Reset selected category if it was deleted
            if (selectedCategory === deletedCategory.id) {
              setSelectedCategory('all');
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('[MenuBrowsing] Categories subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('[MenuBrowsing] ✅ Successfully subscribed to categories changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[MenuBrowsing] ❌ Error subscribing to categories');
        }
      });

    // Subscribe to promotions changes
    const promotionsChannel = supabase
      .channel(`promotions_${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promotions',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        (payload) => {
          console.log('[MenuBrowsing] Promotion change detected:', {
            eventType: payload.eventType,
            table: payload.table,
            timestamp: new Date().toISOString()
          });
          
          if (payload.eventType === 'INSERT') {
            const newPromotion = payload.new as Promotion;
            // Only add if it's active and valid
            if (newPromotion.is_active && 
                new Date(newPromotion.start_date) <= new Date() && 
                new Date(newPromotion.end_date) >= new Date()) {
              setPromotions(prev => [...prev, newPromotion]);
              toast({
                title: '🎉 New Offer Available!',
                description: `${newPromotion.title} - Use code ${newPromotion.code}`,
                duration: 5000,
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedPromotion = payload.new as Promotion;
            const isActive = updatedPromotion.is_active && 
                           new Date(updatedPromotion.start_date) <= new Date() && 
                           new Date(updatedPromotion.end_date) >= new Date();
            
            setPromotions(prev => {
              if (isActive) {
                // Update or add if now active
                const exists = prev.some(p => p.id === updatedPromotion.id);
                if (exists) {
                  return prev.map(p => p.id === updatedPromotion.id ? updatedPromotion : p);
                }
                return [...prev, updatedPromotion];
              } else {
                // Remove if no longer active
                return prev.filter(p => p.id !== updatedPromotion.id);
              }
            });
            
            if (isActive) {
              toast({
                title: '✏️ Offer Updated',
                description: `${updatedPromotion.title} has been updated`,
                duration: 3000,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedPromotion = payload.old as Promotion;
            setPromotions(prev => prev.filter(p => p.id !== deletedPromotion.id));
            toast({
              title: '🗑️ Offer Removed',
              description: 'An offer is no longer available',
              duration: 2000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('[MenuBrowsing] Promotions subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('[MenuBrowsing] ✅ Successfully subscribed to promotions changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[MenuBrowsing] ❌ Error subscribing to promotions');
        }
      });

    // Cleanup subscriptions
    return () => {
      console.log('[MenuBrowsing] Cleaning up real-time subscriptions');
      supabase.removeChannel(menuItemsChannel);
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(promotionsChannel);
    };
  }, [restaurantId, toast, selectedCategory]);

  // Load table number when tableId is present
  useEffect(() => {
    const loadTableNumber = async () => {
      if (tableId) {
        try {
          const table = await tableApi.getTableById(tableId);
          if (table) {
            setSelectedTableNumber(table.table_number);
          }
        } catch (error) {
          console.error('Failed to load table details:', error);
        }
      } else {
        setSelectedTableNumber('');
      }
    };
    
    loadTableNumber();
  }, [tableId]);

  const loadData = async () => {
    if (!restaurantId) return;

    try {
      setLoading(true);
      console.log('[MenuBrowsing] Loading data for restaurant:', restaurantId);
      
      const [restaurantData, categoriesData, itemsData, promotionsData] = await Promise.all([
        restaurantApi.getRestaurantById(restaurantId),
        menuCategoryApi.getCategoriesByRestaurant(restaurantId),
        menuItemApi.getItemsByRestaurant(restaurantId),
        promotionApi.getActivePromotionsForCustomer(restaurantId)
      ]);

      console.log('[MenuBrowsing] Loaded promotions:', promotionsData);
      
      setRestaurant(restaurantData);
      setCategories(categoriesData);
      setMenuItems(itemsData);
      setPromotions(promotionsData);
    } catch (error: any) {
      console.error('[MenuBrowsing] Error loading data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load menu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesType = selectedItemType === 'all' || item.item_type === selectedItemType;
    const isAvailable = item.is_available;

    return matchesSearch && matchesCategory && matchesType && isAvailable;
  });

  const groupedItems = categories.reduce((acc, category) => {
    const items = filteredItems.filter(item => item.category_id === category.id);
    if (items.length > 0) {
      acc[category.id] = { category, items };
    }
    return acc;
  }, {} as { [key: string]: { category: MenuCategory; items: MenuItem[] } });

  const handleAddToCart = (item: MenuItem, variant?: MenuItemVariant, portionSize?: 'full' | 'half') => {
    // Show dialog if item has variants or portions and none selected
    if ((item.variants && item.variants.length > 0 && !variant) || (item.has_portions && !portionSize)) {
      setSelectedItem(item);
      if (item.variants && item.variants.length > 0) {
        setSelectedVariant(item.variants[0]);
      }
      setSelectedPortionSize('full');
      setItemDialogOpen(true);
      return;
    }

    const finalPortionSize = portionSize || 'full';
    
    // Check if item already exists in cart (same menu item, variant, and portion size)
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.menu_item.id === item.id &&
      cartItem.selectedVariant?.name === variant?.name &&
      cartItem.portionSize === (item.has_portions ? finalPortionSize : undefined)
    );

    if (existingItemIndex !== -1) {
      // Item exists, increment quantity
      setCart(prevCart => {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + 1
        };
        return newCart;
      });
      
      toast({
        title: 'Quantity Updated',
        description: `${item.name} quantity increased to ${cart[existingItemIndex].quantity + 1}`,
      });
    } else {
      // Item doesn't exist, add new entry
      const cartItem: ExtendedCartItem = {
        id: `${item.id}-${variant?.name || 'default'}-${finalPortionSize}-${Date.now()}`,
        menu_item: item,
        quantity: 1,
        selectedVariant: variant,
        portionSize: item.has_portions ? finalPortionSize : undefined,
      };

      setCart([...cart, cartItem]);
      toast({
        title: 'Added to Cart',
        description: `${item.name} ${variant ? `(${variant.name})` : ''} ${item.has_portions ? `(${finalPortionSize === 'half' ? 'Half' : 'Full'})` : ''} added to cart`,
      });
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem) return;
    handleAddToCart(selectedItem, selectedVariant || undefined, selectedPortionSize);
    setItemDialogOpen(false);
    setSelectedItem(null);
    setSelectedVariant(null);
    setSelectedPortionSize('full');
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.id === cartItemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as ExtendedCartItem[];
      return newCart;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(cart.filter(item => item.id !== cartItemId));
  };

  const getCartItemCount = (menuItemId: string, variantName?: string) => {
    return cart
      .filter(item => item.menu_item.id === menuItemId && item.selectedVariant?.name === variantName)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getItemPrice = (item: MenuItem, variant?: MenuItemVariant, portionSize?: string) => {
    // If item has portions and a portion size is specified, find the variant price
    if (item.has_portions && portionSize && item.variants) {
      const portionVariant = item.variants.find(v => v.name.toLowerCase() === portionSize.toLowerCase());
      if (portionVariant) {
        return portionVariant.price;
      }
    }
    // Otherwise use variant price or base price
    return variant?.price || item.price;
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = getItemPrice(item.menu_item, item.selectedVariant, item.portionSize);
    return sum + (price * item.quantity);
  }, 0);

  const discountAmount = appliedPromo?.valid ? appliedPromo.discount_amount : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePromoApplied = (validation: PromotionValidation) => {
    setAppliedPromo(validation);
  };

  const handlePromoRemoved = () => {
    setAppliedPromo(null);
  };

  const handleApplyPromoFromModal = (code: string) => {
    if (!user?.id || !restaurantId) return;
    promotionApi.validatePromoCode(code, restaurantId, user.id, cartSubtotal)
      .then((validation) => {
        if (validation.valid) {
          setAppliedPromo(validation);
          toast({
            title: 'Success!',
            description: `Promo code applied! You saved $${validation.discount_amount.toFixed(2)}`,
          });
        } else {
          toast({
            title: 'Invalid Promo Code',
            description: validation.error_message || 'This promo code cannot be applied',
            variant: 'destructive',
          });
        }
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to apply promo code',
          variant: 'destructive',
        });
      });
  };

  const handleChatBotAddToCart = (itemId: string, quantity: number) => {
    const item = menuItems.find(mi => mi.id === itemId);
    if (!item) {
      console.error('Item not found:', itemId);
      return;
    }

    // Check if item already exists in cart (without variants/portions for chatbot orders)
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.menu_item.id === item.id &&
      !cartItem.selectedVariant &&
      !cartItem.portionSize
    );

    if (existingItemIndex !== -1) {
      // Item exists, increment quantity by the specified amount
      setCart(prevCart => {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
      });
      
      toast({
        title: 'Quantity Updated',
        description: `${item.name} quantity increased by ${quantity}`,
      });
    } else {
      // Item doesn't exist, add new entry with specified quantity
      const cartItem: ExtendedCartItem = {
        id: `${item.id}-chatbot-${Date.now()}`,
        menu_item: item,
        quantity: quantity,
        selectedVariant: undefined,
        portionSize: undefined,
      };

      setCart([...cart, cartItem]);
      toast({
        title: 'Added to Cart',
        description: `${quantity}x ${item.name} added to cart`,
      });
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // If no table is selected, show table selection dialog
    if (!tableId) {
      setTableSelectionOpen(true);
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to place an order',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      console.log('🔍 Checking for active order...', { userId: user.id, restaurantId });
      
      // Check for existing active order (don't filter by table - customer may have moved tables)
      const activeOrder = await orderApi.getActiveOrderForCustomer(
        user.id,
        restaurantId!
        // Note: Not passing tableId to allow finding orders from any table
      );

      console.log('📊 Active order check result:', activeOrder ? 'Found order' : 'No active order', activeOrder);

      if (activeOrder) {
        console.log('✅ Active order found! Showing dialog...', {
          orderId: activeOrder.id,
          status: activeOrder.status,
          itemCount: activeOrder.order_items?.length,
          createdAt: activeOrder.created_at
        });
        
        // Show dialog to add to existing order or create new
        setExistingOrder(activeOrder);
        setAddToExistingDialogOpen(true);
      } else {
        console.log('➡️ No active order found, proceeding to normal checkout');
        // No existing order, proceed to checkout normally
        proceedToCheckout();
      }
    } catch (error) {
      console.error('❌ Error checking for existing order:', error);
      // If error, proceed to checkout normally
      proceedToCheckout();
    }
  };

  const proceedToCheckout = () => {
    navigate(`/customer/checkout/${restaurantId}?table=${tableId}`, {
      state: {
        cart,
        restaurant,
        tableId,
        appliedPromo: appliedPromo?.valid ? appliedPromo : null,
      }
    });
  };

  const handleAddToExistingOrder = async (servingPreference?: string) => {
    if (!existingOrder || !user) return;

    try {
      // Prepare order items with serving preference in notes
      const servingNote = servingPreference === 'together' 
        ? 'Serve together with existing order'
        : servingPreference === 'asap'
        ? 'Serve as soon as ready'
        : servingPreference === 'after'
        ? 'Serve after current order'
        : null;

      const orderItems = cart.map(item => {
        const price = getItemPrice(item.menu_item, item.selectedVariant, item.portionSize);
        return {
          order_id: existingOrder.id,
          menu_item_id: item.menu_item.id,
          menu_item_name: item.menu_item.name,
          quantity: item.quantity,
          price,
          portion_size: item.portionSize?.toLowerCase() || null,
          variant_name: item.selectedVariant?.name || (item.portionSize ? item.portionSize : null),
          notes: servingNote,
        };
      });

      // Calculate new total
      const newItemsTotal = cart.reduce((sum, item) => {
        return sum + (getItemPrice(item.menu_item, item.selectedVariant, item.portionSize) * item.quantity);
      }, 0);
      const newTotal = existingOrder.total_amount + newItemsTotal;

      // Add items to existing order
      await orderApi.addItemsToExistingOrder(existingOrder.id, orderItems, newTotal);

      toast({
        title: 'Items Added Successfully',
        description: `${cart.length} item${cart.length > 1 ? 's' : ''} added to your order. ${servingNote || ''}`,
      });

      // Clear cart and close dialogs
      setCart([]);
      setAddToExistingDialogOpen(false);
      setCartOpen(false);

      // Navigate to order tracking
      navigate(`/customer/order-tracking/${existingOrder.id}`);
    } catch (error) {
      console.error('Error adding items to existing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to add items to existing order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNewOrder = () => {
    setAddToExistingDialogOpen(false);
    proceedToCheckout();
  };

  const handleTableSelected = (selectedTableId: string, tableNumber: string) => {
    // Update URL with table parameter
    setSearchParams({ table: selectedTableId });
    setSelectedTableNumber(tableNumber);
    
    toast({
      title: 'Table Selected',
      description: `You've selected Table ${tableNumber}`,
    });
    
    // If cart has items, proceed to checkout
    if (cart.length > 0) {
      navigate(`/customer/checkout/${restaurantId}?table=${selectedTableId}`, {
        state: {
          cart,
          restaurant,
          tableId: selectedTableId
        }
      });
    }
  };

  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setItemDetailDialogOpen(true);
  };

  const getItemTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'veg': return <Leaf className="w-3 h-3 xl:w-4 xl:h-4" />;
      case 'non_veg': return <Flame className="w-3 h-3 xl:w-4 xl:h-4" />;
      case 'egg': return <div className="w-3 h-3 xl:w-4 xl:h-4 rounded-full border-2 border-yellow-600" />;
      default: return null;
    }
  };

  const getItemTypeBadgeColor = (type: ItemType) => {
    switch (type) {
      case 'veg': return 'border-green-600 text-green-600';
      case 'non_veg': return 'border-red-600 text-red-600';
      case 'egg': return 'border-yellow-600 text-yellow-600';
      default: return '';
    }
  };

  const getRestaurantTypeBadge = (type: RestaurantType) => {
    switch (type) {
      case 'veg':
        return (
          <Badge variant="outline" className="border-green-600 text-green-600 text-xs xl:text-sm">
            <Leaf className="w-3 h-3 xl:w-4 xl:h-4 mr-1" /> Pure Veg
          </Badge>
        );
      case 'non_veg':
        return (
          <Badge variant="outline" className="border-red-600 text-red-600 text-xs xl:text-sm">
            <Flame className="w-3 h-3 xl:w-4 xl:h-4 mr-1" /> Non-Veg
          </Badge>
        );
      case 'both':
        return (
          <Badge variant="outline" className="border-orange-600 text-orange-600 text-xs xl:text-sm">
            <div className="flex items-center gap-1">
              <Leaf className="w-3 h-3 xl:w-4 xl:h-4" />
              <Flame className="w-3 h-3 xl:w-4 xl:h-4" />
            </div>
            <span className="ml-1">Veg & Non-Veg</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Restaurant Not Found</h2>
        <Button onClick={() => navigate('/customer/browse')}>Browse Restaurants</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b sticky top-0 z-40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-3 xl:px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl xl:text-3xl font-bold truncate">{restaurant.name}</h1>
                {restaurant.restaurant_type && getRestaurantTypeBadge(restaurant.restaurant_type)}
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {restaurant.cuisine_types?.join(', ') || 'Multi-cuisine'}
              </p>
              <div className="flex items-center gap-3 xl:gap-4 text-xs xl:text-sm flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-semibold">{restaurant.average_rating?.toFixed(1) || '4.0'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>25-30 mins</span>
                </div>
                {restaurant.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{restaurant.location}</span>
                  </div>
                )}
                {tableId && selectedTableNumber && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="w-3 h-3" />
                    Table {selectedTableNumber}
                  </Badge>
                )}
                {!tableId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTableSelectionOpen(true)}
                    className="h-6 text-xs gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    Select Table
                  </Button>
                )}
              </div>
            </div>
            {restaurant.images?.[0] && (
              <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0 border-2 border-primary/20">
                <img src={restaurant.images[0]} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-[120px] xl:top-[140px] z-30 bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-3 xl:px-6 py-3">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Offers Banner */}
          {promotions.length > 0 && restaurantId && (
            <div className="mb-3">
              <OffersBanner
                restaurantId={restaurantId}
                promotions={promotions}
                onOfferClick={handleApplyPromoFromModal}
                onViewAllClick={() => setOffersModalOpen(true)}
              />
            </div>
          )}

          {/* View All Offers Button (shown when no offers or as fallback) */}
          {promotions.length === 0 && (
            <div className="mb-3">
              <Button
                variant="outline"
                onClick={() => setOffersModalOpen(true)}
                className="w-full h-10 text-sm font-semibold border-primary/50 hover:bg-primary/10"
              >
                <Tag className="w-4 h-4 mr-2" />
                View Available Offers & Deals
              </Button>
            </div>
          )}

          {/* Type Filter */}
          <div className="flex items-center gap-2 mb-3">
            <Tabs value={selectedItemType} onValueChange={(v) => setSelectedItemType(v as ItemType | 'all')} className="flex-1">
              <TabsList className="w-full grid grid-cols-4 h-9">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="veg" className="text-xs">
                  <Leaf className="w-3 h-3 mr-1" /> Veg
                </TabsTrigger>
                <TabsTrigger value="non_veg" className="text-xs">
                  <Flame className="w-3 h-3 mr-1" /> Non-Veg
                </TabsTrigger>
                <TabsTrigger value="egg" className="text-xs">Egg</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* View Mode Toggle */}
            <div className="flex gap-1 border rounded-lg p-1 shrink-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7 w-7 p-0"
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'menu' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('menu')}
                className="h-7 w-7 p-0"
                title="Menu View"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs - Horizontal Scroll */}
          <div className="overflow-x-auto -mx-3 xl:-mx-6 px-3 xl:px-6 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => scrollToCategory('all')}
                className="shrink-0 h-8 text-xs"
              >
                All Items
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => scrollToCategory(category.id)}
                  className="shrink-0 h-8 text-xs"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-3 xl:px-6 py-4">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : viewMode === 'menu' ? (
          /* Traditional Menu View */
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([categoryId, { category, items }]) => (
              <div key={categoryId} ref={el => { categoryRefs.current[categoryId] = el; }}>
                {/* Category Header */}
                <div className="mb-6 text-center border-b-2 border-primary pb-2">
                  <h2 className="text-2xl xl:text-3xl font-bold text-primary">{category.name}</h2>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1 italic">{category.description}</p>
                  )}
                </div>

                {/* Menu Items List */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="border-b border-dashed border-border pb-4 last:border-0 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-1">
                            <div className={cn(
                              "inline-flex items-center justify-center w-5 h-5 border-2 rounded shrink-0 mt-0.5",
                              getItemTypeBadgeColor(item.item_type)
                            )}>
                              {getItemTypeIcon(item.item_type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-base xl:text-lg">{item.name}</h3>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.is_bestseller && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Award className="w-3 h-3 mr-1" /> Bestseller
                                  </Badge>
                                )}
                                {item.tags?.includes('spicy') && (
                                  <Badge variant="destructive" className="text-xs">
                                    <Flame className="w-3 h-3 mr-1" /> Spicy
                                  </Badge>
                                )}
                                {item.preparation_time > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" /> {item.preparation_time} mins
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-lg text-primary mb-2">
                            {item.has_portions && item.variants && item.variants.length > 0 ? (
                              <span>
                                <span className="text-xs text-muted-foreground block">From</span>
                                {formatCurrency(Math.min(...item.variants.map(v => v.price)))}
                              </span>
                            ) : (
                              formatCurrency(item.price)
                            )}
                          </p>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([categoryId, { category, items }]) => (
              <div key={categoryId} ref={el => { categoryRefs.current[categoryId] = el; }}>
                {/* Category Header */}
                <div className="mb-4">
                  <h2 className="text-lg xl:text-2xl font-bold">{category.name}</h2>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  )}
                </div>

                {/* Items Grid - Mobile: Horizontal Cards, Desktop: Grid */}
                <div className="space-y-3 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">
                  {items.map((item, index) => {
                    const itemCount = getCartItemCount(item.id);
                    
                    return (
                      <Card
                        key={item.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up border-2 hover:border-primary/50"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <CardContent className="p-0">
                          {/* Mobile: Horizontal Layout */}
                          <div className="flex gap-3 p-3 xl:hidden">
                            {/* Item Details */}
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleItemClick(item)}>
                              {/* Type Badge */}
                              <div className={cn(
                                "inline-flex items-center justify-center w-5 h-5 border-2 rounded mb-2",
                                getItemTypeBadgeColor(item.item_type)
                              )}>
                                {getItemTypeIcon(item.item_type)}
                              </div>

                              {/* Name with Info Icon */}
                              <div className="flex items-start gap-1 mb-1">
                                <h3 className="font-bold text-sm line-clamp-2 flex-1">{item.name}</h3>
                                <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                              </div>

                              {/* Price */}
                              <p className="font-semibold text-sm mb-2">
                                {item.has_portions && item.variants && item.variants.length > 0 ? (
                                  <span>
                                    <span className="text-xs text-muted-foreground">From </span>
                                    {formatCurrency(Math.min(...item.variants.map(v => v.price)))}
                                  </span>
                                ) : (
                                  formatCurrency(item.price)
                                )}
                              </p>

                              {/* Description */}
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {item.description}
                                </p>
                              )}

                              {/* Badges */}
                              <div className="flex flex-wrap gap-1">
                                {item.is_bestseller && (
                                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                                    <Award className="w-3 h-3 mr-0.5" /> Bestseller
                                  </Badge>
                                )}
                                {item.tags?.includes('spicy') && (
                                  <Badge variant="destructive" className="text-xs h-5 px-1.5">
                                    <Flame className="w-3 h-3 mr-0.5" /> Spicy
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Image and Add Button */}
                            <div className="relative shrink-0">
                              {item.image_url ? (
                                <div className="w-24 h-24 rounded-lg overflow-hidden">
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                                  <ChefHat className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                              
                              {/* Add Button */}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                                {itemCount > 0 ? (
                                  <div className="flex items-center gap-1 bg-primary text-primary-foreground rounded-lg shadow-lg">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const cartItem = cart.find(ci => ci.menu_item.id === item.id);
                                        if (cartItem) updateCartItemQuantity(cartItem.id, -1);
                                      }}
                                      className="h-7 w-7 p-0 hover:bg-primary-foreground/20"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-sm font-bold min-w-[20px] text-center">{itemCount}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleAddToCart(item)}
                                      className="h-7 w-7 p-0 hover:bg-primary-foreground/20"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToCart(item)}
                                    className="h-7 px-3 text-xs font-bold shadow-lg"
                                  >
                                    ADD
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Desktop: Vertical Layout */}
                          <div className="hidden xl:block">
                            {/* Image */}
                            <div 
                              className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 cursor-pointer"
                              onClick={() => handleItemClick(item)}
                            >
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ChefHat className="w-16 h-16 text-muted-foreground/30" />
                                </div>
                              )}

                              {/* Badges on Image */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {item.is_bestseller && (
                                  <Badge className="bg-background/90 text-foreground border">
                                    <Award className="w-3 h-3 mr-1" /> Bestseller
                                  </Badge>
                                )}
                                {item.tags?.includes('spicy') && (
                                  <Badge variant="destructive" className="bg-red-500/90">
                                    <Flame className="w-3 h-3 mr-1" /> Spicy
                                  </Badge>
                                )}
                              </div>

                              {/* Type Badge */}
                              <div className={cn(
                                "absolute bottom-2 right-2 w-6 h-6 border-2 rounded bg-background/90 flex items-center justify-center",
                                getItemTypeBadgeColor(item.item_type)
                              )}>
                                {getItemTypeIcon(item.item_type)}
                              </div>

                              {/* Info Button */}
                              <Button
                                size="sm"
                                variant="secondary"
                                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemClick(item);
                                }}
                              >
                                <Info className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Details */}
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.name}</h3>
                              
                              <p className="font-semibold text-lg text-primary mb-2">
                                {item.has_portions && item.variants && item.variants.length > 0 ? (
                                  <span>
                                    <span className="text-sm text-muted-foreground">From </span>
                                    {formatCurrency(Math.min(...item.variants.map(v => v.price)))}
                                  </span>
                                ) : (
                                  formatCurrency(item.price)
                                )}
                              </p>

                              {item.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                  {item.description}
                                </p>
                              )}

                              {/* Add Button */}
                              {itemCount > 0 ? (
                                <div className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg p-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const cartItem = cart.find(ci => ci.menu_item.id === item.id);
                                      if (cartItem) updateCartItemQuantity(cartItem.id, -1);
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="text-lg font-bold min-w-[30px] text-center">{itemCount}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleAddToCart(item)}
                                    className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => handleAddToCart(item)}
                                  className="w-full font-bold"
                                >
                                  ADD TO CART
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-slide-up">
          <Button
            onClick={() => setCartOpen(true)}
            size="lg"
            className="w-full h-14 text-base font-bold shadow-2xl"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
            <span className="ml-auto">{formatCurrency(cartTotal)}</span>
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="bottom" className="h-[90vh] flex flex-col p-0">
          <SheetHeader className="p-4 xl:p-6 border-b">
            <SheetTitle className="text-xl xl:text-2xl">Your Cart ({cartItemCount} items)</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 xl:p-6">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((cartItem) => (
                  <Card key={cartItem.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Item Image */}
                        {cartItem.menu_item.image_url && (
                          <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={cartItem.menu_item.image_url}
                              alt={cartItem.menu_item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm xl:text-base line-clamp-1">
                                {cartItem.menu_item.name}
                              </h4>
                              {cartItem.selectedVariant && (
                                <p className="text-xs text-muted-foreground">{cartItem.selectedVariant.name}</p>
                              )}
                              {cartItem.portionSize && (
                                <p className="text-xs text-muted-foreground">
                                  {cartItem.portionSize === 'half' ? 'Half Portion' : 'Full Portion'}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(cartItem.id)}
                              className="h-8 w-8 p-0 shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          {cartItem.notes && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Note: {cartItem.notes}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 border rounded-lg">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateCartItemQuantity(cartItem.id, -1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-semibold min-w-[20px] text-center">
                                {cartItem.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateCartItemQuantity(cartItem.id, 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Price */}
                            <p className="font-semibold text-sm xl:text-base">
                              {formatCurrency(getItemPrice(cartItem.menu_item, cartItem.selectedVariant, cartItem.portionSize) * cartItem.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 xl:p-6 bg-background space-y-4">
              {/* Promo Code Input */}
              {user?.id && restaurantId && (
                <PromoCodeInput
                  restaurantId={restaurantId}
                  customerId={user.id}
                  orderAmount={cartSubtotal}
                  onPromoApplied={handlePromoApplied}
                  onPromoRemoved={handlePromoRemoved}
                  appliedPromo={appliedPromo}
                />
              )}

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
                </div>
                {appliedPromo?.valid && (
                  <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                    <span className="font-medium">Discount</span>
                    <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} size="lg" className="w-full text-base font-bold">
                Proceed to Checkout
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Item Detail Dialog */}
      <Dialog open={itemDetailDialogOpen} onOpenChange={setItemDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedItem?.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 flex-wrap">
              <div className={cn(
                "inline-flex items-center justify-center w-5 h-5 border-2 rounded",
                selectedItem && getItemTypeBadgeColor(selectedItem.item_type)
              )}>
                {selectedItem && getItemTypeIcon(selectedItem.item_type)}
              </div>
              <span className="font-semibold text-lg text-primary">
                {selectedItem && formatCurrency(selectedItem.price)}
              </span>
              {selectedItem?.is_bestseller && (
                <Badge variant="secondary">
                  <Award className="w-3 h-3 mr-1" /> Bestseller
                </Badge>
              )}
              {selectedItem?.tags?.includes('spicy') && (
                <Badge variant="destructive">
                  <Flame className="w-3 h-3 mr-1" /> Spicy
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              {/* Image */}
              {selectedItem.image_url && (
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              {selectedItem.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedItem.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedItem.preparation_time > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Prep Time</p>
                      <p className="font-medium">{selectedItem.preparation_time} mins</p>
                    </div>
                  </div>
                )}

                {selectedItem.calories && (
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="font-medium">{selectedItem.calories} kcal</p>
                    </div>
                  </div>
                )}

                {selectedItem.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="font-medium">{selectedItem.rating.toFixed(1)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dietary Info */}
              {(selectedItem.is_vegetarian || selectedItem.is_vegan || selectedItem.is_gluten_free) && (
                <div>
                  <h4 className="font-semibold mb-2">Dietary Information</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.is_vegetarian && (
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        <Leaf className="w-3 h-3 mr-1" /> Vegetarian
                      </Badge>
                    )}
                    {selectedItem.is_vegan && (
                      <Badge variant="outline" className="border-green-700 text-green-700">
                        <Leaf className="w-3 h-3 mr-1" /> Vegan
                      </Badge>
                    )}
                    {selectedItem.is_gluten_free && (
                      <Badge variant="outline">Gluten Free</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {selectedItem.ingredients && (
                <div>
                  <h4 className="font-semibold mb-2">Ingredients</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.ingredients}</p>
                </div>
              )}

              {/* Allergens */}
              {selectedItem.allergens && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Allergen Information
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.allergens}</p>
                </div>
              )}

              {/* Variants */}
              {selectedItem.variants && selectedItem.variants.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Available Sizes</h4>
                  <div className="space-y-2">
                    {selectedItem.variants.map((variant, idx) => (
                      <div key={idx} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          {variant.description && (
                            <p className="text-xs text-muted-foreground">{variant.description}</p>
                          )}
                        </div>
                        <span className="font-semibold">{formatCurrency(variant.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button 
                onClick={() => {
                  setItemDetailDialogOpen(false);
                  handleAddToCart(selectedItem);
                }} 
                className="w-full" 
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Item Variant/Portion Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedItem?.name}</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              {/* Portion Selection - Only for items with has_portions enabled */}
              {selectedItem.has_portions && selectedItem.variants && selectedItem.variants.length > 0 && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Choose Portion</Label>
                  <RadioGroup
                    value={selectedPortionSize}
                    onValueChange={(value) => setSelectedPortionSize(value as 'full' | 'half')}
                    className="space-y-3"
                  >
                    {selectedItem.variants.map((variant) => {
                      const portionValue = variant.name.toLowerCase() as 'full' | 'half';
                      return (
                        <div 
                          key={variant.name}
                          className={cn(
                            "flex items-center justify-between border-2 rounded-lg p-4 hover:border-primary transition-all cursor-pointer",
                            selectedPortionSize === portionValue ? "border-primary bg-primary/5" : "border-border"
                          )}
                          onClick={() => setSelectedPortionSize(portionValue)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <RadioGroupItem value={portionValue} id={`portion-${portionValue}`} />
                            <div className="cursor-pointer">
                              <Label htmlFor={`portion-${portionValue}`} className="cursor-pointer font-semibold text-base block">
                                {variant.name}
                              </Label>
                              {variant.description && (
                                <p className="text-sm text-muted-foreground mt-0.5">{variant.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-primary text-lg ml-3">
                            {formatCurrency(variant.price)}
                          </span>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {/* Variant Selection - Only for items with variants (not portions) */}
              {!selectedItem.has_portions && selectedItem.variants && selectedItem.variants.length > 0 && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">Choose Size</Label>
                  <RadioGroup
                    value={selectedVariant?.name}
                    onValueChange={(value) => {
                      const variant = selectedItem.variants?.find(v => v.name === value);
                      setSelectedVariant(variant || null);
                    }}
                    className="space-y-3"
                  >
                    {selectedItem.variants.map((variant, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex items-center justify-between border-2 rounded-lg p-4 hover:border-primary transition-all cursor-pointer",
                          selectedVariant?.name === variant.name ? "border-primary bg-primary/5" : "border-border"
                        )}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <RadioGroupItem value={variant.name} id={`variant-${idx}`} />
                          <div className="flex-1">
                            <Label htmlFor={`variant-${idx}`} className="cursor-pointer font-semibold text-base">
                              {variant.name}
                            </Label>
                            {variant.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{variant.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-primary text-lg ml-3">{formatCurrency(variant.price)}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button onClick={handleConfirmAddToCart} className="w-full" size="lg">
                Add Item - {formatCurrency(
                  getItemPrice(
                    selectedItem, 
                    selectedVariant || undefined, 
                    selectedItem.has_portions ? selectedPortionSize : undefined
                  )
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Table Selection Dialog */}
      {restaurantId && (
        <TableSelectionDialog
          open={tableSelectionOpen}
          onOpenChange={setTableSelectionOpen}
          restaurantId={restaurantId}
          onTableSelected={handleTableSelected}
        />
      )}

      {/* Add to Existing Order Dialog */}
      {existingOrder && (
        <AddToExistingOrderDialog
          open={addToExistingDialogOpen}
          onOpenChange={setAddToExistingDialogOpen}
          existingOrder={existingOrder}
          newItems={cart}
          onAddToExisting={handleAddToExistingOrder}
          onCreateNew={handleCreateNewOrder}
        />
      )}

      {/* Offers Modal */}
      {restaurantId && (
        <OffersModal
          open={offersModalOpen}
          onOpenChange={setOffersModalOpen}
          restaurantId={restaurantId}
          onApplyPromo={handleApplyPromoFromModal}
          promotions={promotions}
        />
      )}

      {/* Order ChatBot */}
      <OrderChatBot
        menuItems={menuItems}
        onAddToCart={handleChatBotAddToCart}
        onCreateOrder={handleCheckout}
      />
    </div>
  );
}
