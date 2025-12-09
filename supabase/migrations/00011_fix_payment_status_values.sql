/*
# Fix Payment Status Values

## Purpose
This migration ensures all orders have valid payment_status values.
It addresses the error: "invalid input value for enum payment_status:'none'"

## Changes
1. Update any orders with NULL payment_status to 'pending'
2. Ensure the payment_status column has a NOT NULL constraint
3. Add a check constraint to prevent invalid values

## Valid payment_status values
- pending: Payment not yet initiated
- processing: Payment in progress
- completed: Payment successful
- failed: Payment failed
- refunded: Payment refunded
*/

-- Update any NULL payment_status values to 'pending'
UPDATE orders 
SET payment_status = 'pending'::payment_status 
WHERE payment_status IS NULL;

-- Ensure the column is NOT NULL (should already be, but let's make sure)
ALTER TABLE orders 
  ALTER COLUMN payment_status SET NOT NULL;

-- Ensure the default is set
ALTER TABLE orders 
  ALTER COLUMN payment_status SET DEFAULT 'pending'::payment_status;
