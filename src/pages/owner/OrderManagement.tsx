import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { restaurantApi, orderApi, staffApi } from '@/db/api';
import { Restaurant, OrderWithItems, OrderStatus, Staff } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, CheckCircle, ChefHat, UtensilsCrossed, Banknote, ChevronDown, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/db/supabase';
import OrderCard from '@/components/order/OrderCard';
import PrintBill from '@/components/order/PrintBill';
import OwnerLayout from '@/components/owner/OwnerLayout';

const ORDERS_PER_PAGE = 10;

export default function OrderManagement() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [printOrder, setPrintOrder] = useState<OrderWithItems | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);
  const [displayCounts, setDisplayCounts] = useState({
    all: ORDERS_PER_PAGE,
    pending: ORDERS_PER_PAGE,
    preparing: ORDERS_PER_PAGE,
    served: ORDERS_PER_PAGE,
    completed: ORDERS_PER_PAGE,
  });
  const [waiters, setWaiters] = useState<Staff[]>([]);
  const ordersRef = useRef<OrderWithItems[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  const loadData = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const previousOrders = ordersRef.current;
      console.log('[OrderManagement] Loading data for restaurant:', restaurantId);
      console.log('[OrderManagement] Previous orders count:', previousOrders.length);
      
      const [restaurantData, ordersData, waitersData] = await Promise.all([
        restaurantApi.getRestaurantById(restaurantId),
        orderApi.getOrdersByRestaurant(restaurantId),
        staffApi.getFreeWaiters(restaurantId),
      ]);
      
      console.log('[OrderManagement] Loaded orders:', ordersData.length);
      console.log('[OrderManagement] Orders data:', ordersData);
      console.log('[OrderManagement] Loaded waiters:', waitersData.length);
      
      setRestaurant(restaurantData);
      setOrders(ordersData);
      setWaiters(waitersData);

      // Check for new orders and show notification
      if (previousOrders.length > 0 && ordersData.length > previousOrders.length) {
        const newOrders = ordersData.filter(
          newOrder => !previousOrders.some(oldOrder => oldOrder.id === newOrder.id)
        );
        
        console.log('[OrderManagement] New orders detected:', newOrders.length);
        
        newOrders.forEach(order => {
          const tableInfo = order.table ? `Table ${order.table.table_number}` : 'Walk-in / Takeaway';
          toast({
            title: '🔔 New Order Received!',
            description: `${tableInfo} - Order #${order.id.slice(0, 8).toUpperCase()}`,
          });
        });
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
  }, [restaurantId, toast]);

  useEffect(() => {
    setLoading(true);
    loadData();
    
    console.log('[OrderManagement] Setting up real-time subscriptions for restaurant:', restaurantId);
    
    const channel = supabase
      .channel(`restaurant-orders-${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('[OrderManagement] Received order change:', payload);
          // Small delay to ensure all related data is written
          setTimeout(() => loadData(), 300);
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
          console.log('[OrderManagement] Received order items change:', payload);
          // Check if this order item belongs to one of the restaurant's orders
          const orderId = (payload.new as any)?.order_id || (payload.old as any)?.order_id;
          if (orderId && ordersRef.current.some(order => order.id === orderId)) {
            console.log('[OrderManagement] Order item belongs to restaurant order, reloading...');
            setTimeout(() => loadData(), 300);
          }
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
          console.log('[OrderManagement] Received status history change:', payload);
          // Check if this status history belongs to one of the restaurant's orders
          const orderId = (payload.new as any)?.order_id || (payload.old as any)?.order_id;
          if (orderId && ordersRef.current.some(order => order.id === orderId)) {
            console.log('[OrderManagement] Status history belongs to restaurant order, reloading...');
            setTimeout(() => loadData(), 300);
          }
        }
      )
      .subscribe((status) => {
        console.log('[OrderManagement] Subscription status:', status);
      });

    return () => {
      console.log('[OrderManagement] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [restaurantId, loadData]);

  // Handle orderId query parameter for highlighting specific order
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId && orders.length > 0) {
      console.log('[OrderManagement] Highlighting order:', orderId);
      
      // Find the order
      const order = orders.find(o => o.id === orderId);
      if (order) {
        // Set the appropriate tab based on order status
        if (['pending', 'preparing', 'served', 'completed'].includes(order.status)) {
          setActiveTab(order.status);
        } else {
          setActiveTab('all');
        }
        
        // Highlight the order
        setHighlightedOrderId(orderId);
        
        // Scroll to the order after a short delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(`order-${orderId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          setHighlightedOrderId(null);
        }, 3000);
      } else {
        console.log('[OrderManagement] Order not found:', orderId);
        toast({
          title: 'Order Not Found',
          description: 'The requested order could not be found.',
          variant: 'destructive',
        });
      }
    }
  }, [searchParams, orders, toast]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, status);
      toast({
        title: 'Success',
        description: `Order status updated to ${status}`,
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const collectPayment = async (orderId: string) => {
    try {
      await orderApi.updatePaymentStatus(orderId, 'completed');
      await orderApi.updateOrderStatus(orderId, 'completed');
      toast({
        title: 'Payment Collected',
        description: 'Payment has been marked as received and order completed',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  const assignWaiter = async (orderId: string, waiterId: string | null) => {
    try {
      await staffApi.assignWaiterToOrder(orderId, waiterId);
      toast({
        title: 'Success',
        description: waiterId ? 'Waiter assigned successfully' : 'Waiter assignment removed',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign waiter',
        variant: 'destructive',
      });
    }
  };

  const filterOrders = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const loadMore = (tab: string) => {
    setDisplayCounts(prev => ({
      ...prev,
      [tab]: prev[tab as keyof typeof prev] + ORDERS_PER_PAGE,
    }));
  };

  const renderOrderList = (ordersList: OrderWithItems[], tab: string, emptyIcon: React.ReactNode, emptyMessage: string) => {
    const displayCount = displayCounts[tab as keyof typeof displayCounts];
    const displayedOrders = ordersList.slice(0, displayCount);
    const hasMore = ordersList.length > displayCount;

    if (ordersList.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            {emptyIcon}
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {displayedOrders.map(order => (
            <div
              key={order.id}
              id={`order-${order.id}`}
              className={`transition-all duration-500 ${
                highlightedOrderId === order.id
                  ? 'ring-4 ring-primary ring-offset-2 ring-offset-background rounded-lg'
                  : ''
              }`}
            >
              <OrderCard
                order={order}
                showCustomerInfo
                onPrint={setPrintOrder}
                waiterAssignment={getWaiterAssignment(order)}
                actions={getOrderActions(order)}
              />
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => loadMore(tab)}
              className="gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              Load More ({ordersList.length - displayCount} remaining)
            </Button>
          </div>
        )}
      </>
    );
  };

  const getWaiterAssignment = (order: OrderWithItems) => {
    if (waiters.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-muted-foreground" />
        <Select
          value={order.waiter_id || 'none'}
          onValueChange={(value) => assignWaiter(order.id, value === 'none' ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Assign waiter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No waiter</SelectItem>
            {waiters.map((waiter) => (
              <SelectItem key={waiter.id} value={waiter.id}>
                {waiter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const getOrderActions = (order: OrderWithItems) => {
    const actions = [];

    if (order.status === 'pending') {
      actions.push(
        <Button
          key="preparing"
          size="sm"
          onClick={() => updateOrderStatus(order.id, 'preparing')}
          className="flex items-center gap-2"
        >
          <ChefHat className="w-4 h-4" />
          Start Preparing
        </Button>
      );
    }

    if (order.status === 'preparing') {
      actions.push(
        <Button
          key="served"
          size="sm"
          onClick={() => updateOrderStatus(order.id, 'served')}
          className="flex items-center gap-2"
        >
          <UtensilsCrossed className="w-4 h-4" />
          Mark as Served
        </Button>
      );
    }

    if (order.status === 'served' && order.payment_method === 'coc' && order.payment_status === 'pending') {
      actions.push(
        <Button
          key="collect"
          size="sm"
          onClick={() => collectPayment(order.id)}
          className="flex items-center gap-2"
        >
          <Banknote className="w-4 h-4" />
          Payment Received
        </Button>
      );
    }

    if (order.status === 'served' && order.payment_status === 'completed') {
      actions.push(
        <Button
          key="complete"
          size="sm"
          variant="outline"
          onClick={() => updateOrderStatus(order.id, 'completed')}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Complete Order
        </Button>
      );
    }

    return <div className="flex gap-2 flex-wrap">{actions}</div>;
  };

  const pendingOrders = filterOrders('pending');
  const preparingOrders = filterOrders('preparing');
  const servedOrders = filterOrders('served');
  const completedOrders = filterOrders('completed');

  if (loading) {
    return (
      <OwnerLayout title="Order Management">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Clock className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout title={`Order Management - ${restaurant?.name}`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{restaurant?.name}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingOrders.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Preparing</CardDescription>
            <CardTitle className="text-3xl">{preparingOrders.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Served</CardDescription>
            <CardTitle className="text-3xl">{servedOrders.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedOrders.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({preparingOrders.length})</TabsTrigger>
          <TabsTrigger value="served">Served ({servedOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderOrderList(
            orders,
            'all',
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />,
            'No orders yet'
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {renderOrderList(
            pendingOrders,
            'pending',
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />,
            'No pending orders'
          )}
        </TabsContent>

        <TabsContent value="preparing" className="mt-6">
          {renderOrderList(
            preparingOrders,
            'preparing',
            <ChefHat className="w-12 h-12 text-muted-foreground mb-4" />,
            'No orders being prepared'
          )}
        </TabsContent>

        <TabsContent value="served" className="mt-6">
          {renderOrderList(
            servedOrders,
            'served',
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground mb-4" />,
            'No served orders'
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderOrderList(
            completedOrders,
            'completed',
            <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />,
            'No completed orders'
          )}
        </TabsContent>
      </Tabs>

      {/* Print Dialog */}
      <Dialog open={!!printOrder} onOpenChange={() => setPrintOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Print E-Bill</DialogTitle>
          </DialogHeader>
          {printOrder && <PrintBill order={printOrder} />}
        </DialogContent>
      </Dialog>
    </OwnerLayout>
  );
}
