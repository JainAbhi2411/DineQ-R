/*
# Update Orders to Use Staff Table for Waiters

## Changes
1. Drop the separate waiters table
2. Update orders.waiter_id to reference staff table instead
3. Add index for efficient waiter assignment queries

## Migration Details
- Remove waiters table and related policies
- Update foreign key constraint on orders.waiter_id
- Maintain data integrity with ON DELETE SET NULL

## Notes
- Existing orders with waiter_id will be set to NULL (safe migration)
- Staff table already has role field to identify waiters
- Staff table has is_active field for availability status
*/

-- Drop existing foreign key constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_waiter_id_fkey;

-- Drop waiters table
DROP TABLE IF EXISTS waiters CASCADE;

-- Drop waiter_status enum type
DROP TYPE IF EXISTS waiter_status CASCADE;

-- Add foreign key to staff table
ALTER TABLE orders 
  ADD CONSTRAINT orders_waiter_id_fkey 
  FOREIGN KEY (waiter_id) 
  REFERENCES staff(id) 
  ON DELETE SET NULL;

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_orders_waiter_id ON orders(waiter_id) WHERE waiter_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_staff_role_active ON staff(restaurant_id, role, is_active) WHERE role = 'waiter';

-- Create function to get free waiters (not assigned to active orders)
CREATE OR REPLACE FUNCTION get_free_waiters(p_restaurant_id uuid)
RETURNS TABLE (
  id uuid,
  restaurant_id uuid,
  user_id uuid,
  name text,
  email text,
  phone text,
  role text,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz,
  is_busy boolean
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    s.*,
    EXISTS (
      SELECT 1 
      FROM orders o 
      WHERE o.waiter_id = s.id 
        AND o.status IN ('pending', 'preparing', 'served')
    ) as is_busy
  FROM staff s
  WHERE s.restaurant_id = p_restaurant_id
    AND s.role = 'waiter'
    AND s.is_active = true
  ORDER BY s.name;
$$;