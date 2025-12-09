import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import { promotionApi } from '@/db/api';
import type { PromotionValidation } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PromoCodeInputProps {
  restaurantId: string;
  customerId: string;
  orderAmount: number;
  onPromoApplied: (validation: PromotionValidation) => void;
  onPromoRemoved: () => void;
  appliedPromo?: PromotionValidation | null;
  className?: string;
}

export default function PromoCodeInput({
  restaurantId,
  customerId,
  orderAmount,
  onPromoApplied,
  onPromoRemoved,
  appliedPromo,
  className,
}: PromoCodeInputProps) {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a promo code',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const validation = await promotionApi.validatePromoCode(
        promoCode.trim().toUpperCase(),
        restaurantId,
        customerId,
        orderAmount
      );

      if (validation.valid) {
        onPromoApplied(validation);
        toast({
          title: 'Success!',
          description: `Promo code applied! You saved $${validation.discount_amount.toFixed(2)}`,
        });
        setPromoCode('');
      } else {
        toast({
          title: 'Invalid Promo Code',
          description: validation.error_message || 'This promo code cannot be applied',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to apply promo code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePromo = () => {
    onPromoRemoved();
    toast({
      title: 'Promo Removed',
      description: 'Promo code has been removed from your order',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyPromo();
    }
  };

  if (appliedPromo && appliedPromo.valid) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">
                Promo Applied!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                You saved ${appliedPromo.discount_amount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemovePromo}
            className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Have a promo code?</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={handleApplyPromo}
          disabled={loading || !promoCode.trim()}
          className="min-w-[100px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Applying
            </>
          ) : (
            'Apply'
          )}
        </Button>
      </div>
    </div>
  );
}
