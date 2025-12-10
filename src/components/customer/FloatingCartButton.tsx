import { ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export default function FloatingCartButton() {
  const { cart, setCartOpen } = useCart();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.menu_item.price * item.quantity,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (cartItemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-slide-up">
      <Button
        onClick={() => setCartOpen(true)}
        size="lg"
        className="w-full h-16 text-base font-bold shadow-2xl bg-primary hover:bg-primary/90 relative overflow-hidden group"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-glow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-background text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-primary">
                {cartItemCount}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">View Cart</span>
              <span className="text-xs opacity-90">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatCurrency(cartTotal)}</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </Button>
    </div>
  );
}
