/*
# Enable Realtime for Order Items

This migration enables Supabase Realtime for the order_items table
to ensure order item updates work properly in real-time.

1. Enable Realtime publication for order_items table
*/

-- Enable Realtime for order_items table
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;