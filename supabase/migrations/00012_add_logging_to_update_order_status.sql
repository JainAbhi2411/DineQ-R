/*
# Add Logging to update_order_status Function

## Purpose
Add detailed logging to help debug the payment_status error.

## Changes
1. Add RAISE NOTICE statements to log the update operation
2. Check if the update affected any rows
3. Log the current payment_status value
*/

CREATE OR REPLACE FUNCTION update_order_status(
  order_id uuid,
  new_status order_status
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_payment_status payment_status;
  rows_affected integer;
BEGIN
  -- Get current payment_status before update
  SELECT payment_status INTO current_payment_status
  FROM orders
  WHERE id = order_id;

  RAISE NOTICE 'Updating order % from status to %. Current payment_status: %', 
    order_id, new_status, current_payment_status;

  -- Perform the update
  UPDATE orders
  SET 
    status = new_status,
    updated_at = now(),
    completed_at = CASE 
      WHEN new_status IN ('completed'::order_status, 'cancelled'::order_status) 
      THEN now() 
      ELSE completed_at 
    END
  WHERE id = order_id
  AND (
    customer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()
    )
  );

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RAISE NOTICE 'Update affected % rows', rows_affected;

  IF rows_affected = 0 THEN
    RAISE EXCEPTION 'No order found with id % or insufficient permissions', order_id;
  END IF;
END;
$$;
