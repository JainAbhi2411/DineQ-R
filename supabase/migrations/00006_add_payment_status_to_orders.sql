/*
# Add payment_status column to orders table

## Changes
1. Add payment_status column to orders table
2. Set default value to 'pending'
3. Update existing orders to have payment_status based on their status

## Purpose
This column tracks the payment status separately from order status:
- pending: Payment not yet initiated
- processing: Payment in progress
- completed: Payment successful
- failed: Payment failed
- refunded: Payment refunded
*/

-- Create payment status type
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add payment_status column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status payment_status DEFAULT 'pending'::payment_status NOT NULL;

-- Update existing orders: if status is 'completed', set payment_status to 'completed'
UPDATE orders 
SET payment_status = 'completed'::payment_status 
WHERE status = 'completed'::order_status AND payment_status = 'pending'::payment_status;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);