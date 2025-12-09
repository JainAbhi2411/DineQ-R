/*
# Create Notifications System

1. New Tables
- `notifications`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles) - The user who should receive this notification
  - `type` (text) - Type of notification: 'new_order', 'order_status_change', 'order_completed'
  - `title` (text, not null) - Notification title
  - `message` (text, not null) - Notification message
  - `order_id` (uuid, references orders) - Related order
  - `is_read` (boolean, default false) - Whether notification has been read
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `notifications` table
- Users can only view their own notifications
- Users can update their own notifications (mark as read)
- System can insert notifications for any user (via triggers)

3. Triggers
- Auto-create notification for restaurant owner when new order is placed
- Auto-create notification for customer when order status changes

4. Functions
- `create_order_notification` - Trigger function to create notifications on order events
- `mark_notification_as_read` - RPC to mark notification as read
- `mark_all_notifications_as_read` - RPC to mark all user's notifications as read
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow system to insert notifications (via triggers)
CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Function to create notification for new order
CREATE OR REPLACE FUNCTION create_new_order_notification()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_owner_id uuid;
  restaurant_name text;
  table_number text;
BEGIN
  -- Get restaurant owner and name
  SELECT r.owner_id, r.name INTO restaurant_owner_id, restaurant_name
  FROM restaurants r
  WHERE r.id = NEW.restaurant_id;

  -- Get table number
  SELECT t.table_number INTO table_number
  FROM tables t
  WHERE t.id = NEW.table_id;

  -- Create notification for restaurant owner
  INSERT INTO notifications (user_id, type, title, message, order_id)
  VALUES (
    restaurant_owner_id,
    'new_order',
    'New Order Received',
    'New order from Table ' || COALESCE(table_number, 'Unknown') || ' at ' || restaurant_name,
    NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification for order status change
CREATE OR REPLACE FUNCTION create_order_status_notification()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_name text;
  status_message text;
BEGIN
  -- Only create notification if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get restaurant name
    SELECT r.name INTO restaurant_name
    FROM restaurants r
    WHERE r.id = NEW.restaurant_id;

    -- Create appropriate message based on status
    CASE NEW.status
      WHEN 'preparing' THEN
        status_message := 'Your order at ' || restaurant_name || ' is being prepared';
      WHEN 'served' THEN
        status_message := 'Your order at ' || restaurant_name || ' has been served';
      WHEN 'completed' THEN
        status_message := 'Your order at ' || restaurant_name || ' is completed';
      WHEN 'cancelled' THEN
        status_message := 'Your order at ' || restaurant_name || ' has been cancelled';
      ELSE
        status_message := 'Your order status has been updated';
    END CASE;

    -- Create notification for customer
    INSERT INTO notifications (user_id, type, title, message, order_id)
    VALUES (
      NEW.customer_id,
      'order_status_change',
      'Order Status Updated',
      status_message,
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new orders
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_new_order_notification();

-- Create trigger for order status changes
CREATE TRIGGER on_order_status_changed
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_status_notification();

-- RPC function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET is_read = true
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read()
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET is_read = true
  WHERE user_id = auth.uid() AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM notifications
    WHERE user_id = auth.uid() AND is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
