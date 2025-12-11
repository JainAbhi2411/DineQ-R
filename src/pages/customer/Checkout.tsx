import { useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi, promotionApi } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useFormatters } from '@/hooks/useFormatters';
import { ArrowLeft, CreditCard, ShoppingBag, Wallet, Banknote, Tag } from 'lucide-react';
import { supabase } from '@/db/supabase';

export default function Checkout() {
  const { restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const { formatCurrency, formatDateTime, formatDate } = useFormatters();
  
  const tableIdFromUrl = searchParams.get('table');
  const { cart, restaurant, tableId: tableIdFromState, appliedPromo } = location.state || {};
  const tableId = tableIdFromUrl || tableIdFromState;
  
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'coc'>('online');
  const [loading, setLoading] = useState(false);

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cart is Empty</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Please add items to your cart before checkout
            </p>
            <Button onClick={() => navigate(-1)}>
              Go Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTotalAmount = () => {
    const subtotal = cart.reduce((total: number, item: any) => {
      const menuItem = item.menuItem || item.menu_item;
      let price = item.selectedVariant?.price || menuItem?.price || 0;
      
      if (menuItem?.has_portions && item.portionSize === 'half') {
        price = price / 2;
      }
      
      return total + price * item.quantity;
    }, 0);

    const discountAmount = appliedPromo?.valid ? appliedPromo.discount_amount : 0;
    return Math.max(0, subtotal - discountAmount);
  };

  const getSubtotal = () => {
    return cart.reduce((total: number, item: any) => {
      const menuItem = item.menuItem || item.menu_item;
      let price = item.selectedVariant?.price || menuItem?.price || 0;
      
      if (menuItem?.has_portions && item.portionSize === 'half') {
        price = price / 2;
      }
      
      return total + price * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!restaurantId) {
      toast({
        title: 'Error',
        description: 'Restaurant ID is required. Please go back and select a restaurant.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === 'coc') {
        const orderData = {
          restaurant_id: restaurantId,
          customer_id: profile?.id || null,
          table_id: tableId || null,
          total_amount: getTotalAmount(),
          status: 'pending' as const,
          payment_status: 'pending' as const,
          payment_method: 'coc' as const,
          special_instructions: specialInstructions || null,
          assigned_to: null,
          waiter_id: null,
          promotion_id: appliedPromo?.valid ? appliedPromo.promotion_id : null,
          discount_amount: appliedPromo?.valid ? appliedPromo.discount_amount : 0,
          promo_code: appliedPromo?.valid ? appliedPromo.code : null,
        };

        const order = await orderApi.createOrder(orderData);

        const orderItems = cart.map((item: any) => {
          const menuItem = item.menuItem || item.menu_item;
          let price = item.selectedVariant?.price || menuItem.price;
          
          if (menuItem?.has_portions && item.portionSize === 'half') {
            price = price / 2;
          }
          
          return {
            order_id: order.id,
            menu_item_id: menuItem.id,
            menu_item_name: menuItem.name,
            quantity: item.quantity,
            price: price,
            portion_size: item.portionSize || null,
            variant_name: item.selectedVariant?.name || null,
            notes: item.notes || null,
          };
        });

        await orderApi.createOrderItems(orderItems);

        // Record promotion usage if a promo was applied
        if (appliedPromo?.valid && appliedPromo.promotion_id && profile?.id) {
          try {
            await promotionApi.recordPromotionUsage(
              appliedPromo.promotion_id,
              profile.id,
              order.id,
              appliedPromo.discount_amount
            );
          } catch (error) {
            console.error('Failed to record promotion usage:', error);
            // Don't fail the order if promotion recording fails
          }
        }

        toast({
          title: 'Order Placed Successfully!',
          description: 'You can add more items anytime. Please pay at the counter when you receive your order.',
        });
        // Navigate back to menu so customer can easily add more items
        navigate(`/customer/menu/${restaurantId}?table=${tableId}`);
      } else {
        const items = cart.map((item: any) => {
          const menuItem = item.menuItem || item.menu_item;
          let price = item.selectedVariant?.price || menuItem.price;
          
          if (menuItem?.has_portions && item.portionSize === 'half') {
            price = price / 2;
          }
          
          return {
            menu_item_id: menuItem.id,
            menu_item_name: menuItem.name,
            price: price,
            quantity: item.quantity,
            notes: item.notes || null,
            portion_size: item.portionSize || null,
            variant_name: item.selectedVariant?.name || null,
            image_url: menuItem.image_url || null,
          };
        });

        const { data, error } = await supabase.functions.invoke('create_stripe_checkout', {
          body: {
            restaurant_id: restaurantId,
            table_id: tableId || null,
            items: items,
            special_instructions: specialInstructions || null,
            currency: 'usd',
            promotion_id: appliedPromo?.valid ? appliedPromo.promotion_id : null,
            discount_amount: appliedPromo?.valid ? appliedPromo.discount_amount : 0,
            promo_code: appliedPromo?.valid ? appliedPromo.code : null,
          },
        });

        if (error) {
          const errorMsg = await error?.context?.text();
          throw new Error(errorMsg || 'Failed to create payment session');
        }

        if (data?.data?.url) {
          window.open(data.data.url, '_blank');
          toast({
            title: 'Redirecting to Payment',
            description: 'Please complete your payment in the new tab.',
          });
          setTimeout(() => {
            navigate('/customer/orders');
          }, 2000);
        } else {
          throw new Error('No payment URL received');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item: any, index: number) => {
                    const menuItem = item.menuItem || item.menu_item;
                    let itemPrice = item.selectedVariant?.price || menuItem.price;
                    
                    if (menuItem?.has_portions && item.portionSize === 'half') {
                      itemPrice = itemPrice / 2;
                    }
                    
                    return (
                      <div key={`${menuItem.id}-${item.portionSize || 'default'}-${index}`} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div className="flex gap-4">
                          {menuItem.image_url && (
                            <img
                              src={menuItem.image_url}
                              alt={menuItem.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold">
                              {menuItem.name}
                              {item.portionSize && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                  ({item.portionSize === 'half' ? 'Half' : 'Full'})
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(itemPrice)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          {formatCurrency((itemPrice * item.quantity))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'online' | 'coc')}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Online Payment</p>
                        <p className="text-sm text-muted-foreground">Pay securely with credit/debit card</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors mt-3">
                    <RadioGroupItem value="coc" id="coc" />
                    <Label htmlFor="coc" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Cash on Counter (COC)</p>
                        <p className="text-sm text-muted-foreground">Pay at the counter when you collect your order</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
                <CardDescription>Any special requests for your order?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="E.g., No onions, extra spicy, etc."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Bill Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(getSubtotal())}</span>
                  </div>
                  {appliedPromo?.valid && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Discount ({appliedPromo.code})
                      </span>
                      <span className="font-semibold">-{formatCurrency(appliedPromo.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatCurrency((getTotalAmount() * 0.1))}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency((getTotalAmount() * 1.1))}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Restaurant:</strong> {restaurant?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Items:</strong> {cart.reduce((total: number, item: any) => total + item.quantity, 0)}
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {paymentMethod === 'coc' ? (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      {loading ? 'Processing...' : 'Place Order (Pay at Counter)'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {loading ? 'Processing...' : 'Proceed to Payment'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  {paymentMethod === 'coc' 
                    ? 'You will pay at the counter when collecting your order'
                    : 'You will be redirected to a secure payment page'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
