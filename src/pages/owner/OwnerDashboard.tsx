import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { restaurantApi, orderApi, menuItemApi } from '@/db/api';
import { Restaurant, OrderWithItems, MenuItem } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, User, MapPin, Phone, Star, TrendingUp, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import OwnerLayout from '@/components/owner/OwnerLayout';
import { supabase } from '@/db/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export default function OwnerDashboard() {
  const { profile } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { formatCurrency, formatDateTime, formatDate } = useFormatters();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const ordersRef = useRef<OrderWithItems[]>([]);
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ordersRef in sync with orders state
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // Load orders data function
  const loadOrdersData = useCallback(async () => {
    if (!restaurants.length || !restaurants[0]?.id) return;

    try {
      const previousOrders = ordersRef.current;
      const ordersData = await orderApi.getOrdersByRestaurant(restaurants[0].id);
      
      console.log('[OwnerDashboard] Loaded orders:', ordersData.length);
      console.log('[OwnerDashboard] Orders with items:', ordersData.map(o => ({ id: o.id.slice(0, 8), items: o.order_items?.length || 0 })));
      setOrders(ordersData);

      // Check for new orders and show notification
      if (previousOrders.length > 0 && ordersData.length > previousOrders.length) {
        const newOrders = ordersData.filter(
          newOrder => !previousOrders.some(oldOrder => oldOrder.id === newOrder.id)
        );
        
        console.log('[OwnerDashboard] New orders detected:', newOrders.length);
        
        newOrders.forEach(order => {
          const tableInfo = order.table ? `Table ${order.table.table_number}` : 'Walk-in / Takeaway';
          toast({
            title: '🔔 New Order Received!',
            description: `${tableInfo} - Order #${order.id.slice(0, 8)}`,
            duration: 5000,
          });
        });
      }
    } catch (error: any) {
      console.error('[OwnerDashboard] Error loading orders:', error);
    }
  }, [restaurants, toast]);

  // Schedule reload with debounce
  const scheduleReload = useCallback(() => {
    // Clear any existing timeout
    if (reloadTimeoutRef.current) {
      clearTimeout(reloadTimeoutRef.current);
    }

    // Schedule a reload after 300ms to debounce multiple rapid changes
    reloadTimeoutRef.current = setTimeout(() => {
      console.log('[OwnerDashboard] Reloading data due to real-time update');
      loadOrdersData();
    }, 300);
  }, [loadOrdersData]);

  useEffect(() => {
    loadData();
  }, [profile]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!restaurants.length || !restaurants[0]?.id) return;

    const restaurantId = restaurants[0].id;
    console.log('[OwnerDashboard] Setting up real-time subscriptions for restaurant:', restaurantId);

    // Create a channel for real-time updates
    const channel = supabase.channel(`dashboard-${restaurantId}`);

    // Subscribe to orders changes
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('[OwnerDashboard] Received order change:', payload);
          scheduleReload();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
        },
        (payload) => {
          console.log('[OwnerDashboard] Received order items change:', payload);
          scheduleReload();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_status_history',
        },
        (payload) => {
          console.log('[OwnerDashboard] Received status history change:', payload);
          scheduleReload();
        }
      )
      .subscribe((status) => {
        console.log('[OwnerDashboard] Subscription status:', status);
      });

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      console.log('[OwnerDashboard] Cleaning up subscriptions');
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [restaurants, scheduleReload]);

  const loadData = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const restaurantsData = await restaurantApi.getRestaurantsByOwner(profile.id);
      setRestaurants(restaurantsData);

      if (restaurantsData.length > 0) {
        const [ordersData, menuData] = await Promise.all([
          orderApi.getOrdersByRestaurant(restaurantsData[0].id),
          menuItemApi.getItemsByRestaurant(restaurantsData[0].id),
        ]);
        setOrders(ordersData);
        setMenuItems(menuData);
      }
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

  const getActiveOrders = () => {
    return orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
  };

  const getTodayRevenue = () => {
    const today = new Date().toDateString();
    return orders
      .filter(o => o.status === 'completed' && new Date(o.created_at).toDateString() === today)
      .reduce((sum, o) => sum + o.total_amount, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'preparing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ready':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'completed':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent glow-orange"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary opacity-20"></div>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  const activeOrders = getActiveOrders();
  const todayRevenue = getTodayRevenue();

  return (
    <OwnerLayout>
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass border-2 border-border hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-3xl font-bold gradient-text-primary">{activeOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-2 border-border hover:border-secondary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-3xl font-bold gradient-text-secondary">${formatCurrency(todayRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-2 border-border hover:border-electric/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Menu Items</p>
                  <p className="text-3xl font-bold gradient-text-electric">{menuItems.length}</p>
                </div>
                <div className="w-12 h-12 bg-electric/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-electric" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold gradient-text-primary">Active Orders</h2>
            {restaurants.length > 0 && (
              <Button asChild variant="outline" className="morph-button">
                <Link to={`/owner/orders/${restaurants[0].id}`}>View All</Link>
              </Button>
            )}
          </div>

          {activeOrders.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">No active orders at the moment</p>
                <p className="text-sm text-muted-foreground mt-2">New orders will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeOrders.slice(0, 6).map((order) => (
                <Card key={order.id} className="glass border-2 border-border hover:border-primary/50 transition-all hover:-translate-y-1 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(order.created_at)}
                          </span>
                        </div>
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${formatCurrency(order.total_amount)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {order.table ? `Table ${order.table.table_number}` : 'No table assigned'}
                        </span>
                      </div>
                      
                      <div className="border-t border-border pt-3">
                        <p className="text-xs text-muted-foreground mb-2">Items:</p>
                        <div className="space-y-1">
                          {order.order_items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.menu_item_name}</span>
                              <span className="text-muted-foreground">{formatCurrency((item.price * item.quantity))}</span>
                            </div>
                          ))}
                          {order.order_items && order.order_items.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{order.order_items.length - 3} more items</p>
                          )}
                        </div>
                      </div>

                      <Button asChild className="w-full morph-button hover-glow-orange">
                        <Link to={`/owner/orders/${restaurants[0].id}?orderId=${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold gradient-text-secondary">Your Menu</h2>
            {restaurants.length > 0 && (
              <Button asChild variant="outline" className="morph-button">
                <Link to={`/owner/menu/${restaurants[0].id}`}>Manage Menu</Link>
              </Button>
            )}
          </div>

          {menuItems.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">No menu items yet</p>
                <p className="text-sm text-muted-foreground mt-2">Add your first menu item to get started</p>
                {restaurants.length > 0 && (
                  <Button asChild className="mt-4 morph-button">
                    <Link to={`/owner/menu/${restaurants[0].id}`}>Add Menu Item</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {menuItems.slice(0, 8).map((item) => (
                <Card key={item.id} className="glass border-2 border-border hover:border-secondary/50 transition-all hover:-translate-y-1 group overflow-hidden">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Star className="w-12 h-12 text-muted-foreground opacity-30" />
                      </div>
                    )}
                    {!item.is_available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <Badge variant="destructive" className="text-sm px-3 py-1">Unavailable</Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                        {item.item_type === 'veg' && '🥗 Veg'}
                        {item.item_type === 'non_veg' && '🍖 Non-Veg'}
                        {item.item_type === 'vegan' && '🌱 Vegan'}
                        {item.item_type === 'egg' && '🥚 Egg'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1 mb-1">{item.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                      {item.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xl font-bold gradient-text-primary">${formatCurrency(item.price)}</span>
                      <Badge 
                        variant={item.is_available ? 'default' : 'secondary'} 
                        className={item.is_available ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50' : ''}
                      >
                        {item.is_available ? '✓ Available' : '✗ Out of Stock'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        {restaurants.length > 0 && (
          <Card className="glass border-2 border-border">
            <CardHeader>
              <CardTitle className="gradient-text-electric">Restaurant Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{restaurants[0].location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="font-medium">{restaurants[0].phone || restaurants[0].contact_details || 'Not set'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <Button asChild className="morph-button hover-glow-purple">
                    <Link to="/owner/settings">Update Restaurant Info</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </OwnerLayout>
  );
}
