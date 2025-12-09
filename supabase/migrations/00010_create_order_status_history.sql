/*
# Create Order Status History Table

## Purpose
Track all status changes for orders to provide a complete timeline of order progress.

## Tables Created

### order_status_history
- `id` (uuid, primary key)
- `order_id` (uuid, references orders, not null)
- `status` (text, not null) - Order status at this point
- `payment_status` (text) - Payment status at this point
- `notes` (text) - Optional notes about the status change
- `created_at` (timestamptz, default: now())
- `created_by` (uuid, references profiles) - Who made the change

## Indexes
- Index on order_id for fast lookups
- Index on created_at for timeline sorting

## Security
- Enable RLS
- Allow restaurant owners to view history for their orders
- Allow customers to view history for their orders
- Only authenticated users can insert records

## Triggers
- Automatically create history entry when order status changes
*/

-- Create order_status_history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  payment_status text,
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at);

-- Enable RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Policy: Restaurant owners can view history for their orders
CREATE POLICY "Restaurant owners can view order history" ON order_status_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = order_status_history.order_id
      AND r.owner_id = auth.uid()
    )
  );

-- Policy: Customers can view history for their orders
CREATE POLICY "Customers can view their order history" ON order_status_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_status_history.order_id
      AND o.customer_id = auth.uid()
    )
  );

-- Policy: Authenticated users can insert history
CREATE POLICY "Authenticated users can insert history" ON order_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to automatically create history entry on order status change
CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create history if status or payment_status changed
  IF (TG_OP = 'INSERT') OR 
     (OLD.status IS DISTINCT FROM NEW.status) OR 
     (OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
    
    INSERT INTO order_status_history (
      order_id,
      status,
      payment_status,
      notes,
      created_by
    ) VALUES (
      NEW.id,
      NEW.status,
      NEW.payment_status,
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'Order created'
        WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'Status changed from ' || OLD.status || ' to ' || NEW.status
        WHEN OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN 'Payment status changed from ' || OLD.payment_status || ' to ' || NEW.payment_status
        ELSE 'Order updated'
      END,
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS order_status_change_trigger ON orders;
CREATE TRIGGER order_status_change_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_status_history();

-- Create initial history entries for existing orders
INSERT INTO order_status_history (order_id, status, payment_status, notes, created_at)
SELECT 
  id,
  status,
  payment_status,
  'Initial status',
  created_at
FROM orders
WHERE NOT EXISTS (
  SELECT 1 FROM order_status_history WHERE order_id = orders.id
);
