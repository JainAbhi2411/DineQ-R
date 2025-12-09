import { useState, useEffect } from 'react';
import { promotionApi } from '@/db/api';
import type { Promotion } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, Copy, Calendar, DollarSign, Percent, Info, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OffersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  onApplyPromo?: (code: string) => void;
  promotions?: Promotion[];
}

export default function OffersModal({ 
  open, 
  onOpenChange, 
  restaurantId, 
  onApplyPromo,
  promotions: externalPromotions 
}: OffersModalProps) {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>(externalPromotions || []);
  const [loading, setLoading] = useState(!externalPromotions);

  useEffect(() => {
    if (externalPromotions) {
      setPromotions(externalPromotions);
      setLoading(false);
    } else if (open && restaurantId) {
      loadPromotions();
    }
  }, [open, restaurantId, externalPromotions]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionApi.getActivePromotionsForCustomer(restaurantId);
      setPromotions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load offers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied!',
      description: 'Promo code copied to clipboard',
    });
  };

  const handleApplyPromo = (code: string) => {
    if (onApplyPromo) {
      onApplyPromo(code);
      onOpenChange(false);
    } else {
      copyPromoCode(code);
    }
  };

  const getDiscountText = (promotion: Promotion) => {
    if (promotion.discount_type === 'PERCENTAGE') {
      return `${promotion.discount_value}% OFF`;
    }
    return `$${promotion.discount_value} OFF`;
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Available Offers
          </DialogTitle>
          <DialogDescription>
            Choose from our exclusive offers and save on your order
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading offers...
          </div>
        ) : promotions.length === 0 ? (
          <div className="py-12 text-center">
            <Tag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No offers available</h3>
            <p className="text-muted-foreground">
              Check back later for exciting deals and discounts
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {promotions.map((promotion) => {
              const expiringSoon = isExpiringSoon(promotion.end_date);
              const daysLeft = getDaysLeft(promotion.end_date);

              return (
                <div
                  key={promotion.id}
                  className={cn(
                    "relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md",
                    "bg-gradient-to-r from-primary/5 to-primary/10",
                    expiringSoon ? "border-orange-500" : "border-primary/30"
                  )}
                >
                  {expiringSoon && (
                    <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysLeft}d left
                    </Badge>
                  )}

                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 shrink-0">
                    {promotion.discount_type === 'PERCENTAGE' ? (
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary">{promotion.discount_value}%</div>
                        <div className="text-[10px] text-primary/70">OFF</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary">${promotion.discount_value}</div>
                        <div className="text-[10px] text-primary/70">OFF</div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-bold text-base mb-1">{promotion.title}</h3>
                      {promotion.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {promotion.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      {promotion.min_order_amount > 0 && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Min. ${promotion.min_order_amount}
                        </span>
                      )}
                      {promotion.max_discount && (
                        <span className="flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Max. ${promotion.max_discount}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Valid till {new Date(promotion.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded border border-border">
                        <Tag className="w-3 h-3 text-primary" />
                        <span className="font-mono font-bold text-sm">{promotion.code}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPromoCode(promotion.code)}
                        className="h-8"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApplyPromo(promotion.code)}
                        className="h-8 ml-auto"
                      >
                        {onApplyPromo ? 'Apply' : 'Copy Code'}
                      </Button>
                    </div>

                    {promotion.terms && (
                      <p className="text-[10px] text-muted-foreground pt-1 border-t">
                        {promotion.terms}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
