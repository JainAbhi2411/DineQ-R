/*
# Enable Realtime for Order Status History

This migration enables Supabase Realtime for the order_status_history table
to ensure order timeline updates work properly in real-time.

1. Enable Realtime publication for order_status_history table
*/

-- Enable Realtime for order_status_history table
ALTER PUBLICATION supabase_realtime ADD TABLE order_status_history;
