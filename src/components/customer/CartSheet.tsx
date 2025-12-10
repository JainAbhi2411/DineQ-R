import { ShoppingCart, X, Minus, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CartSheet() {
  const { cart, cartOpen, setCartOpen, updateCartItemQuantity, removeFromCart, restaurantName, getItemPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + getItemPrice(item.menu_item, item.selectedVariant, item.portionSize) * item.quantity,
    0
  );
  const cartTotal = cartSubtotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      navigate('/customer/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Navigate to checkout page with cart data
    const restaurantId = cart[0]?.restaurant_id;
    if (restaurantId) {
      navigate(`/customer/checkout/${restaurantId}`);
      setCartOpen(false);
    }
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col p-0">
        <SheetHeader className="p-4 xl:p-6 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl xl:text-2xl">Your Cart</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • {restaurantName || 'Restaurant'}
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 xl:p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-4">Add items from the menu to get started</p>
              <Button variant="outline" onClick={() => setCartOpen(false)}>
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((cartItem, index) => (
                <Card 
                  key={cartItem.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
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
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout} 
              size="lg" 
              className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group"
            >
              <span className="flex-1 text-left">Proceed to Checkout</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{formatCurrency(cartTotal)}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
