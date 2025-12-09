import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '@/db/api';
import { OrderWithItems, OrderStatus } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  ChefHat,
  UtensilsCrossed,
  Package,
  MapPin,
  CreditCard,
  Banknote,
  FileText,
  Loader2,
  UserCheck,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/db/supabase';
import PrintBill from '@/components/order/PrintBill';

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatCurrency, formatDateTime } = useFormatters();
  
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBill, setShowBill] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  // Real-time subscription for order updates
  useEffect(() => {
    if (!orderId) return;

    console.log('[OrderTracking] Setting up real-time subscription for order:', orderId);

    // Subscribe to order changes
    const orderChannel = supabase
      .channel(`order_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        async (payload) => {
          console.log('[OrderTracking] Order updated:', payload);
          
          // Reload full order data to get related items
          await loadOrder();
          
          const updatedOrder = payload.new as any;
          const oldOrder = payload.old as any;
          
          // Show notification if status changed
          if (updatedOrder.status !== oldOrder.status) {
            const statusMessages = {
              pending: '⏳ Order Received',
              preparing: '👨‍🍳 Your order is being prepared!',
              served: '🍽️ Your order has been served!',
              completed: '✅ Order completed!',
              cancelled: '❌ Order cancelled'
            };
            
            toast({
              title: 'Order Status Updated',
              description: statusMessages[updatedOrder.status as OrderStatus] || 'Order status changed',
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    // Subscribe to order status history changes
    const statusHistoryChannel = supabase
      .channel(`order_status_history_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${orderId}`
        },
        async () => {
          console.log('[OrderTracking] Order status history updated');
          // Reload order to get updated status history
          await loadOrder();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      console.log('[OrderTracking] Cleaning up real-time subscriptions');
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(statusHistoryChannel);
    };
  }, [orderId, toast]);

  const loadOrder = async () => {
    try {
      const data = await orderApi.getOrderById(orderId!);
      setOrder(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5" />;
      case 'served':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'preparing':
        return 'bg-blue-500';
      case 'served':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'preparing':
        return 'Being Prepared';
      case 'served':
        return 'Served';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'completed':
        return <Badge className="bg-green-600">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-600">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-blue-600 text-blue-600">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>;
    }
  };

  const orderStatuses: OrderStatus[] = ['pending', 'preparing', 'served', 'completed'];
  const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : -1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground mb-6 text-center">
              The order you're looking for doesn't exist
            </p>
            <Button onClick={() => navigate('/customer/orders')}>
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate('/customer/orders')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                  <CardDescription className="mt-1">
                    Placed on {formatDateTime(order.created_at)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <div className="flex justify-between items-center">
                  {orderStatuses.map((status, index) => (
                    <div key={status} className="flex flex-col items-center flex-1 relative">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center z-10 transition-colors",
                          index <= currentStatusIndex ? getStatusColor(status) : 'bg-muted',
                          index <= currentStatusIndex ? 'text-white' : 'text-muted-foreground'
                        )}
                      >
                        {getStatusIcon(status)}
                      </div>
                      <span className="text-xs mt-2 text-center max-w-[80px]">
                        {getStatusLabel(status)}
                      </span>
                      {index < orderStatuses.length - 1 && (
                        <div
                          className={cn(
                            "absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-1 -z-0",
                            index < currentStatusIndex ? getStatusColor(status) : 'bg-muted'
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Restaurant:</span>
                    <span>{order.restaurant?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Table:</span>
                    <span>{order.table ? order.table.table_number : 'Walk-in / Takeaway'}</span>
                  </div>
                  {order.waiter && (
                    <div className="flex items-center gap-2 text-sm">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Waiter:</span>
                      <span>{order.waiter.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {order.payment_method === 'online' ? (
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Banknote className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">Payment:</span>
                    <span>{order.payment_method === 'online' ? 'Online' : 'Cash on Counter'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Status:</span>
                    {getPaymentStatusBadge(order.payment_status)}
                  </div>
                </div>
              </div>

              {order.special_instructions && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Special Instructions</h4>
                    <p className="text-sm text-muted-foreground">{order.special_instructions}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                    <div className="flex gap-4 flex-1">
                      {item.menu_item?.image_url && (
                        <img
                          src={item.menu_item.image_url}
                          alt={item.menu_item_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.menu_item_name}</h4>
                        {item.portion_size && (
                          <p className="text-sm text-muted-foreground">Size: {item.portion_size}</p>
                        )}
                        {item.variant_name && (
                          <p className="text-sm text-muted-foreground">Variant: {item.variant_name}</p>
                        )}
                        {item.notes && (
                          <p className="text-sm text-muted-foreground italic">Note: {item.notes}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* View Bill Button */}
              <div className="mt-6 pt-4 border-t">
                <Button
                  onClick={() => setShowBill(true)}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Receipt className="w-5 h-5" />
                  View Detailed Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bill Dialog */}
      <Dialog open={showBill} onOpenChange={setShowBill}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Bill</DialogTitle>
          </DialogHeader>
          {order && <PrintBill order={order} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
