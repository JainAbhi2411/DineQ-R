import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '@/db/api';
import { OrderWithItems } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Eye } from 'lucide-react';
import { supabase } from '@/db/supabase';
import OrderCard from '@/components/order/OrderCard';
import PrintBill from '@/components/order/PrintBill';
import CustomerLayout from '@/components/customer/CustomerLayout';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [printOrder, setPrintOrder] = useState<OrderWithItems | null>(null);
  const ordersRef = useRef<OrderWithItems[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  const loadOrders = useCallback(async () => {
    if (!user) return;

    try {
      const previousOrders = ordersRef.current;
      const data = await orderApi.getOrdersByCustomer(user.id);
      setOrders(data);

      // Check if any order status changed and show notification
      if (previousOrders.length > 0) {
        data.forEach(newOrder => {
          const oldOrder = previousOrders.find(o => o.id === newOrder.id);
          if (oldOrder) {
            if (oldOrder.status !== newOrder.status) {
              toast({
                title: 'Order Status Updated',
                description: `Order #${newOrder.id.slice(0, 8).toUpperCase()} is now ${newOrder.status}`,
              });
            }
            if (oldOrder.payment_status !== newOrder.payment_status) {
              toast({
                title: 'Payment Status Updated',
                description: `Payment for order #${newOrder.id.slice(0, 8).toUpperCase()} is now ${newOrder.payment_status}`,
              });
            }
          }
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadOrders();

      console.log('[OrderHistory] Setting up real-time subscriptions for customer:', user.id);

      const channel = supabase
        .channel(`customer-orders-history-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `customer_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('[OrderHistory] Received order change:', payload);
            // Small delay to ensure status_history trigger completes
            setTimeout(() => loadOrders(), 300);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'order_status_history',
          },
          (payload) => {
            console.log('[OrderHistory] Received status history change:', payload);
            // Check if this status history belongs to one of the customer's orders
            const orderId = payload.new.order_id;
            if (ordersRef.current.some(order => order.id === orderId)) {
              console.log('[OrderHistory] Status history belongs to customer order, reloading...');
              setTimeout(() => loadOrders(), 300);
            }
          }
        )
        .subscribe((status) => {
          console.log('[OrderHistory] Subscription status:', status);
        });

      return () => {
        console.log('[OrderHistory] Cleaning up subscription');
        supabase.removeChannel(channel);
      };
    }
  }, [user, loadOrders]);

  if (loading) {
    return (
      <CustomerLayout title="Order History">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent glow-purple"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-secondary opacity-20"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Order History">
      <div className="max-w-7xl mx-auto px-3 xl:px-6 py-4 xl:py-8 space-y-6">
        <div className="animate-fade-in-up">
          <p className="text-muted-foreground text-sm xl:text-base">
            Track your orders and view order details
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="glass border-2 border-border animate-fade-in-up">
            <CardContent className="flex flex-col items-center justify-center p-8 xl:p-12">
              <div className="w-16 h-16 xl:w-20 xl:h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 xl:w-10 xl:h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-base xl:text-lg">No orders yet</p>
              <p className="text-sm xl:text-base text-muted-foreground mt-2">
                Start by scanning a QR code at a restaurant table
              </p>
            </CardContent>
          </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPrint={setPrintOrder}
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/order-tracking/${order.id}`)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Track Order
                </Button>
              }
            />
          ))}
        </div>
      )}

      {/* Print Dialog */}
      <Dialog open={!!printOrder} onOpenChange={() => setPrintOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Print E-Bill</DialogTitle>
          </DialogHeader>
          {printOrder && <PrintBill order={printOrder} />}
        </DialogContent>
      </Dialog>
      </div>
    </CustomerLayout>
  );
}
