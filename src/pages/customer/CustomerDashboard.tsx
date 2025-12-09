import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/db/api';
import { OrderWithItems } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Clock, ChefHat, CheckCircle, AlertCircle, Scan, Hash, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import { supabase } from '@/db/supabase';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function CustomerDashboard() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const { toast } = useToast();
  const { formatCurrency, formatDateTime } = useFormatters();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();

    if (!profile) return;

    console.log('[CustomerDashboard] Setting up real-time subscription for customer:', profile.id);

    const channel = supabase
      .channel(`customer-orders-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('[CustomerDashboard] Received order change:', payload);
          setTimeout(() => loadData(), 300);
        }
      )
      .subscribe((status) => {
        console.log('[CustomerDashboard] Subscription status:', status);
      });

    return () => {
      console.log('[CustomerDashboard] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const ordersData = await orderApi.getOrdersByCustomer(profile.id);
      setOrders(ordersData);
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

  const handleManualCodeSubmit = () => {
    if (!manualCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a QR code',
        variant: 'destructive',
      });
      return;
    }
    
    // Navigate to scan page with the manual code
    navigate(`/customer/scan?code=${encodeURIComponent(manualCode)}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'served':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'served':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Get active orders (pending, preparing, served)
  const activeOrders = orders.filter(o => ['pending', 'preparing', 'served'].includes(o.status));

  if (loading) {
    return (
      <CustomerLayout title="Home">
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
    <CustomerLayout title="Home">
      <div className="max-w-7xl mx-auto px-3 xl:px-6 py-4 xl:py-8">
        {/* Welcome Section */}
        <div className="mb-6 xl:mb-8 animate-fade-in-up">
          <h2 className="text-2xl xl:text-3xl font-bold mb-2 gradient-text-secondary">
            Welcome back, {profile?.full_name || 'Guest'}!
          </h2>
          <p className="text-muted-foreground text-sm xl:text-base">Scan a QR code to start ordering</p>
        </div>

        {/* QR Scanner Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 mb-6 xl:mb-8">
          {/* Scan QR Code */}
          <Card className="glass border-2 border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up overflow-hidden group">
            <div className="scan-line" />
            <CardHeader className="p-4 xl:p-6 relative z-10">
              <CardTitle className="text-lg xl:text-xl flex items-center gap-2">
                <Scan className="w-5 h-5 xl:w-6 xl:h-6 text-primary" />
                Scan QR Code
              </CardTitle>
              <CardDescription className="text-xs xl:text-sm">Use your camera to scan the table QR code</CardDescription>
            </CardHeader>
            <CardContent className="p-4 xl:p-6 relative z-10">
              <Button 
                className="w-full morph-button hover-glow-orange text-base xl:text-lg py-5 xl:py-6" 
                onClick={() => navigate('/customer/scan')}
              >
                <QrCode className="w-5 h-5 mr-2" />
                Open Scanner
              </Button>
            </CardContent>
          </Card>

          {/* Manual Code Entry */}
          <Card className="glass border-2 border-border hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-200 overflow-hidden group">
            <div className="scan-line" />
            <CardHeader className="p-4 xl:p-6 relative z-10">
              <CardTitle className="text-lg xl:text-xl flex items-center gap-2">
                <Hash className="w-5 h-5 xl:w-6 xl:h-6 text-secondary" />
                Enter Code Manually
              </CardTitle>
              <CardDescription className="text-xs xl:text-sm">Type the QR code if scanning doesn't work</CardDescription>
            </CardHeader>
            <CardContent className="p-4 xl:p-6 space-y-3 relative z-10">
              <Input
                placeholder="Enter QR code..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualCodeSubmit()}
                className="text-base"
              />
              <Button 
                className="w-full morph-button hover-glow-purple" 
                variant="outline"
                onClick={handleManualCodeSubmit}
              >
                Submit Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Orders Section */}
        <Card className="glass border-2 border-border animate-fade-in-up animation-delay-400 overflow-hidden">
          <div className="scan-line" />
          <CardHeader className="p-4 xl:p-6 relative z-10">
            <CardTitle className="text-lg xl:text-2xl flex items-center gap-2">
              <Clock className="w-5 h-5 xl:w-6 xl:h-6 text-primary" />
              Current Orders
            </CardTitle>
            <CardDescription className="text-xs xl:text-sm">
              {activeOrders.length > 0 
                ? `You have ${activeOrders.length} active order${activeOrders.length > 1 ? 's' : ''}`
                : 'No active orders at the moment'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 xl:p-6 relative z-10">
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 xl:py-12">
                <div className="w-16 h-16 xl:w-20 xl:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 xl:w-10 xl:h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm xl:text-base mb-4">No active orders</p>
                <Button 
                  onClick={() => navigate('/customer/scan')}
                  className="morph-button hover-glow-orange"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR to Order
                </Button>
              </div>
            ) : (
              <div className="space-y-3 xl:space-y-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="border-2 hover:border-primary/50 transition-all">
                    <CardHeader className="p-3 xl:p-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-base xl:text-lg mb-1">
                            {order.restaurant?.name || 'Restaurant'}
                          </CardTitle>
                          <CardDescription className="text-xs xl:text-sm">
                            {order.table?.table_number ? `Table ${order.table.table_number}` : 'Walk-in'}
                            {order.waiter && ` • Waiter: ${order.waiter.name}`}
                            {' • '}{formatDateTime(order.created_at)}
                          </CardDescription>
                        </div>
                        <Badge className={cn('text-xs flex items-center gap-1', getStatusColor(order.status))}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 xl:p-4 pt-0">
                      <div className="space-y-2">
                        {order.order_items?.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between text-xs xl:text-sm">
                            <span className="text-muted-foreground">
                              {item.quantity}x {item.menu_item?.name || 'Item'}
                            </span>
                            <span className="font-medium">${formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        {order.order_items && order.order_items.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.order_items.length - 3} more item{order.order_items.length - 3 > 1 ? 's' : ''}
                          </p>
                        )}
                        <div className="pt-2 border-t flex justify-between items-center">
                          <span className="font-semibold text-sm xl:text-base">Total</span>
                          <span className="font-bold text-base xl:text-lg text-primary">
                            ${formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
