import { useState, useEffect } from 'react';
import { promotionApi } from '@/db/api';
import type { Promotion } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Tag, Percent, DollarSign, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OffersBannerProps {
  restaurantId: string;
  onOfferClick?: (code: string) => void;
  onViewAllClick?: () => void;
  promotions?: Promotion[];
}

export default function OffersBanner({ 
  restaurantId, 
  onOfferClick, 
  onViewAllClick,
  promotions: externalPromotions 
}: OffersBannerProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(externalPromotions || []);
  const [loading, setLoading] = useState(!externalPromotions);

  useEffect(() => {
    if (externalPromotions) {
      setPromotions(externalPromotions);
    } else if (restaurantId) {
      loadPromotions();
    }
  }, [restaurantId, externalPromotions]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionApi.getActivePromotionsForCustomer(restaurantId);
      setPromotions(data.slice(0, 10));
    } catch (error) {
      console.error('Failed to load promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountText = (promotion: Promotion) => {
    if (promotion.discount_type === 'PERCENTAGE') {
      return `${promotion.discount_value}% OFF`;
    }
    return `$${promotion.discount_value} OFF`;
  };

  const getOfferSummary = (promotion: Promotion) => {
    const parts = [];
    if (promotion.min_order_amount > 0) {
      parts.push(`above $${promotion.min_order_amount}`);
    }
    if (promotion.max_discount) {
      parts.push(`up to $${promotion.max_discount}`);
    }
    return parts.join(' | ');
  };

  if (loading) {
    return (
      <div className="w-full overflow-hidden py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shrink-0 h-16 w-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-3 xl:-mx-6 px-3 xl:px-6">
        {promotions.map((promotion) => (
          <button
            key={promotion.id}
            onClick={() => onOfferClick?.(promotion.code)}
            className={cn(
              "shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all hover:shadow-md hover:scale-[1.02]",
              "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30 hover:border-primary/50"
            )}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 shrink-0">
              {promotion.discount_type === 'PERCENTAGE' ? (
                <Percent className="w-6 h-6 text-primary" />
              ) : (
                <DollarSign className="w-6 h-6 text-primary" />
              )}
            </div>
            
            <div className="text-left">
              <div className="font-bold text-sm text-primary mb-0.5">
                {getDiscountText(promotion)}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                {getOfferSummary(promotion) || promotion.title}
              </div>
            </div>
          </button>
        ))}

        {onViewAllClick && promotions.length > 0 && (
          <button
            onClick={onViewAllClick}
            className="shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all hover:bg-primary/5"
          >
            <span className="text-sm font-semibold text-primary whitespace-nowrap">
              View All
            </span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
}
