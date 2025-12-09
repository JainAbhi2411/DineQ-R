import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { OrderWithItems, CartItem } from '@/types/types';
import { useFormatters } from '@/hooks/useFormatters';
import { Plus, ShoppingCart, Receipt, AlertCircle, Clock, ChefHat, Info } from 'lucide-react';

interface AddToExistingOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingOrder: OrderWithItems;
  newItems: CartItem[];
  onAddToExisting: (servingPreference?: string) => void;
  onCreateNew: () => void;
}

export default function AddToExistingOrderDialog({
  open,
  onOpenChange,
  existingOrder,
  newItems,
  onAddToExisting,
  onCreateNew,
}: AddToExistingOrderDialogProps) {
  const { formatCurrency } = useFormatters();
  const [servingPreference, setServingPreference] = useState<string>('together');

  const getItemPrice = (item: CartItem) => {
    if (item.menu_item.has_portions && item.portionSize && item.menu_item.variants) {
      const portionVariant = item.menu_item.variants.find(
        v => v.name.toLowerCase() === item.portionSize?.toLowerCase()
      );
      if (portionVariant) {
        return portionVariant.price;
      }
    }
    return item.selectedVariant?.price || item.menu_item.price;
  };

  const newItemsTotal = newItems.reduce((sum, item) => {
    return sum + (getItemPrice(item) * item.quantity);
  }, 0);

  const updatedTotal = existingOrder.total_amount + newItemsTotal;

  // Calculate order age
  const orderAge = Date.now() - new Date(existingOrder.created_at).getTime();
  const minutesAgo = Math.floor(orderAge / 60000);

  // Calculate estimated preparation time for new items
  const estimatedPrepTime = newItems.reduce((max, item) => {
    return Math.max(max, item.menu_item.preparation_time || 15);
  }, 0);

  // Determine if order is in early stage (good for adding items)
  const isEarlyStage = minutesAgo < 15 && existingOrder.status === 'pending';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            You Have an Active Order
          </DialogTitle>
          <DialogDescription>
            You already have an order in progress. Would you like to add these items to your existing order or create a new separate order?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Status Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Order Status: <Badge variant={existingOrder.status === 'pending' ? 'secondary' : 'default'} className="ml-1">{existingOrder.status}</Badge>
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Placed {minutesAgo} minute{minutesAgo !== 1 ? 's' : ''} ago
                  {isEarlyStage && ' • Perfect time to add items!'}
                </p>
                {!isEarlyStage && existingOrder.status === 'preparing' && (
                  <p className="text-blue-700 dark:text-blue-300">
                    ⚠️ Your order is being prepared. New items may be served separately.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Existing Order */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Current Order</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
                {existingOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-1">
                      {item.quantity}x {item.menu_item_name}
                      {item.portion_size && ` (${item.portion_size})`}
                      {item.variant_name && ` (${item.variant_name})`}
                    </span>
                    <span className="font-medium ml-2">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Current Total</span>
                  <span>{formatCurrency(existingOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* New Items */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-primary">Items to Add</h3>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                {newItems.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.quantity}x {item.menu_item.name}
                        {item.portionSize && ` (${item.portionSize})`}
                        {item.selectedVariant && ` (${item.selectedVariant.name})`}
                      </span>
                      <span className="font-medium ml-2">{formatCurrency(getItemPrice(item) * item.quantity)}</span>
                    </div>
                    {item.menu_item.preparation_time && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{item.menu_item.preparation_time} min prep time</span>
                      </div>
                    )}
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold text-primary">
                  <span>New Items Total</span>
                  <span>{formatCurrency(newItemsTotal)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <ChefHat className="w-3 h-3" />
                  <span>Est. {estimatedPrepTime} min preparation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Serving Preference */}
          <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
            <Label className="text-base font-semibold">Serving Preference</Label>
            <RadioGroup value={servingPreference} onValueChange={setServingPreference}>
              <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="together" id="together" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="together" className="cursor-pointer font-medium">
                    Serve together with existing order
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kitchen will prepare and serve all items together (may take longer)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="asap" id="asap" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="asap" className="cursor-pointer font-medium">
                    Serve as soon as ready
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    New items will be served when ready (faster, but may arrive separately)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="after" id="after" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="after" className="cursor-pointer font-medium">
                    Serve after current order
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Perfect for desserts or additional courses
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Updated Total */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Updated Order Total</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(updatedTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Single bill for all items</p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={() => onAddToExisting(servingPreference)}
            size="lg"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Existing Order
          </Button>
          <Button
            onClick={onCreateNew}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create New Separate Order
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
