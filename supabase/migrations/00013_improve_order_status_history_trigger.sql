/*
# Improve Order Status History Trigger

## Purpose
Add better error handling and validation to the order status history trigger.

## Changes
1. Add validation for payment_status before inserting
2. Add error logging
3. Handle NULL payment_status gracefully
*/

CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
DECLARE
  safe_payment_status text;
BEGIN
  -- Only create history if status or payment_status changed
  IF (TG_OP = 'INSERT') OR 
     (OLD.status IS DISTINCT FROM NEW.status) OR 
     (OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
    
    -- Safely convert payment_status to text, handling NULL
    safe_payment_status := COALESCE(NEW.payment_status::text, 'pending');
    
    -- Validate that payment_status is one of the valid enum values
    IF safe_payment_status NOT IN ('pending', 'processing', 'completed', 'failed', 'refunded') THEN
      RAISE WARNING 'Invalid payment_status detected: %. Defaulting to pending.', safe_payment_status;
      safe_payment_status := 'pending';
    END IF;

    RAISE NOTICE 'Creating history entry for order %. Status: %, Payment Status: %', 
      NEW.id, NEW.status, safe_payment_status;
    
    INSERT INTO order_status_history (
      order_id,
      status,
      payment_status,
      notes,
      created_by
    ) VALUES (
      NEW.id,
      NEW.status,
      safe_payment_status,
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'Order created'
        WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'Status changed from ' || OLD.status || ' to ' || NEW.status
        WHEN OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN 'Payment status changed from ' || COALESCE(OLD.payment_status::text, 'NULL') || ' to ' || safe_payment_status
        ELSE 'Order updated'
      END,
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in create_order_status_history: %. SQLSTATE: %', SQLERRM, SQLSTATE;
    RETURN NEW; -- Don't fail the main operation
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
