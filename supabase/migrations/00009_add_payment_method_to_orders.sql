/*
# Add payment_method column to orders table

## Changes
1. Add payment_method column to orders table
   - Type: TEXT
   - Values: 'online' or 'coc' (Cash on Counter)
   - Default: 'online'
   - Not null

## Purpose
- Track payment method for each order
- Enable COC (Cash on Counter) payment workflow
- Allow restaurant owners to see payment method and collect payment
*/

-- Add payment_method column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'online' NOT NULL
CHECK (payment_method IN ('online', 'coc'));

-- Add comment
COMMENT ON COLUMN orders.payment_method IS 'Payment method: online (Stripe) or coc (Cash on Counter)';
