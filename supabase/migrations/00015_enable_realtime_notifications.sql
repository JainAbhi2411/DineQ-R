/*
# Enable Realtime for Notifications

This migration enables Supabase Realtime for the notifications table
to ensure real-time updates work properly.

1. Enable Realtime publication for notifications table
2. Enable Realtime publication for orders table (for order updates)
*/

-- Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable Realtime for orders table (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
END $$;
