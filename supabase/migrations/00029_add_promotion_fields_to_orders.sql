/*
# Add Promotion Fields to Orders Table

## Plain English Explanation
This migration adds promotion/discount tracking fields to the orders table so that each order can store information about any applied promo code and discount amount.

## Changes Made

### 1. New Columns Added to `orders` Table
- `promotion_id` (uuid, nullable) - References the promotion that was applied
- `discount_amount` (numeric, default 0) - The discount amount applied to this order
- `promo_code` (text, nullable) - The promo code that was used (for easy reference)

### 2. Benefits
- Orders can now track which promotion was used
- Discount amount is stored directly on the order
- Promo code is stored for easy display and reference
- Links to promotion_usage table for detailed tracking

## Notes
- All fields are nullable/have defaults to maintain compatibility with existing orders
- Foreign key to promotions table with SET NULL on delete (if promotion is deleted, order history is preserved)
- No data migration needed as all new fields have safe defaults
*/

-- Add promotion-related columns to orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS promotion_id uuid REFERENCES promotions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  ADD COLUMN IF NOT EXISTS promo_code text;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_promotion ON orders(promotion_id);

-- Add comment for documentation
COMMENT ON COLUMN orders.promotion_id IS 'The promotion that was applied to this order';
COMMENT ON COLUMN orders.discount_amount IS 'The discount amount applied from the promotion';
COMMENT ON COLUMN orders.promo_code IS 'The promo code that was used (stored for reference)';