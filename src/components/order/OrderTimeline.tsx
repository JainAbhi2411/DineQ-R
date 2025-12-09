import { OrderStatusHistory, OrderStatus, PaymentStatus } from '@/types/types';
import { CheckCircle2, Clock, ChefHat, UtensilsCrossed, CreditCard, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useFormatters } from '@/hooks/useFormatters';

interface OrderTimelineProps {
  statusHistory: OrderStatusHistory[];
  currentStatus: OrderStatus;
  currentPaymentStatus: PaymentStatus;
}

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
    case 'cancelled':
      return <XCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'Order Received';
    case 'preparing':
      return 'Preparing';
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

const getPaymentStatusLabel = (paymentStatus: PaymentStatus) => {
  switch (paymentStatus) {
    case 'pending':
      return 'Payment Pending';
    case 'processing':
      return 'Processing Payment';
    case 'completed':
      return 'Payment Collected';
    case 'failed':
      return 'Payment Failed';
    case 'refunded':
      return 'Payment Refunded';
    default:
      return paymentStatus;
  }
};

export default function OrderTimeline({ statusHistory, currentStatus, currentPaymentStatus }: OrderTimelineProps) {
  const { formatDateTime } = useFormatters();
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Timeline</h3>
      <div className="relative">
        {sortedHistory.map((history, index) => {
          const isLast = index === sortedHistory.length - 1;
          const isCompleted = index < sortedHistory.length - 1 || 
                            currentStatus === 'completed' || 
                            currentStatus === 'cancelled';

          return (
            <div key={history.id} className="relative flex gap-4 pb-8">
              {/* Timeline line */}
              {!isLast && (
                <div
                  className={`absolute left-[18px] top-10 w-0.5 h-full ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-muted text-muted-foreground'
                }`}
              >
                {getStatusIcon(history.status)}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{getStatusLabel(history.status)}</p>
                    {history.payment_status && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <CreditCard className="w-4 h-4" />
                        {getPaymentStatusLabel(history.payment_status)}
                      </p>
                    )}
                    {history.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{history.notes}</p>
                    )}
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {formatDateTime(history.created_at, 'MMM dd, HH:mm')}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
