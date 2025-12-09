import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { OrderWithItems } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Printer, MapPin, User, CreditCard, Banknote, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import OrderTimeline from './OrderTimeline';
import { useFormatters } from '@/hooks/useFormatters';

interface OrderCardProps {
  order: OrderWithItems;
  onPrint?: (order: OrderWithItems) => void;
  showCustomerInfo?: boolean;
  actions?: ReactNode;
  waiterAssignment?: ReactNode;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'preparing':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'served':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'completed':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'processing':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'completed':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'refunded':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function OrderCard({ order, onPrint, showCustomerInfo = false, actions, waiterAssignment }: OrderCardProps) {
  const { formatCurrency, formatDateTime } = useFormatters();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // Detect when order status or payment status changes
  useEffect(() => {
    setIsUpdated(true);
    const timer = setTimeout(() => setIsUpdated(false), 2000);
    return () => clearTimeout(timer);
  }, [order.status, order.payment_status, order.status_history?.length]);

  const canPrint = order.status === 'completed' && order.payment_status === 'completed';

  return (
    <Card className={`overflow-hidden transition-all duration-500 ${isUpdated ? 'ring-2 ring-primary shadow-lg' : ''}`}>
      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
              <Badge className={getPaymentStatusColor(order.payment_status)}>
                {order.payment_status}
              </Badge>
              {order.payment_method && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {order.payment_method === 'online' ? (
                    <>
                      <CreditCard className="w-3 h-3" />
                      Online
                    </>
                  ) : (
                    <>
                      <Banknote className="w-3 h-3" />
                      Cash on Collection
                    </>
                  )}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {order.table ? `Table ${order.table.table_number}` : 'Walk-in / Takeaway'}
              </span>
              {showCustomerInfo && order.customer && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {order.customer.full_name || order.customer.username}
                </span>
              )}
              {order.waiter && (
                <span className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  {order.waiter.name}
                </span>
              )}
              <span>{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Order Items */}
          <div>
            <h4 className="font-semibold mb-3">Order Items ({order.order_items?.length || 0})</h4>
            <div className="space-y-2">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.menu_item_name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground italic mt-1">Note: {item.notes}</p>
                      )}
                    </div>
                    <p className="font-semibold">{formatCurrency((item.price * item.quantity))}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground bg-muted/30 rounded-lg">
                  No items found in this order
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">
                ${formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div>
              <h4 className="font-semibold mb-2">Special Instructions</h4>
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                {order.special_instructions}
              </p>
            </div>
          )}

          {/* Order Timeline */}
          {order.status_history && order.status_history.length > 0 && (
            <div className="pt-4 border-t">
              <OrderTimeline
                statusHistory={order.status_history}
                currentStatus={order.status}
                currentPaymentStatus={order.payment_status}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {canPrint && onPrint && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrint(order)}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print E-Bill
              </Button>
            )}
            {waiterAssignment}
            {actions}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
