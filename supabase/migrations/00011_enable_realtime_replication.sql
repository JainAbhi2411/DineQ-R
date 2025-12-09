/*
# Enable Real-time Replication for Menu Tables

## Purpose
Enable Supabase real-time replication for menu_items and menu_categories tables
to allow customers to see instant updates when restaurant owners make changes.

## Tables Affected
- `menu_items` - Enable real-time updates for menu item changes
- `menu_categories` - Enable real-time updates for category changes
- `orders` - Enable real-time updates for order status changes
- `order_status_history` - Enable real-time updates for status history

## What This Does
Adds these tables to the supabase_realtime publication, which enables
real-time subscriptions via WebSocket connections.

## Impact
- Customers will see menu updates instantly (< 1 second)
- No polling required
- Reduced server load
- Better user experience

## Security
Real-time replication respects Row Level Security (RLS) policies.
Only data that users have permission to read will be broadcast.
*/

-- Enable real-time replication for menu_items table (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'menu_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
  END IF;
END $$;

-- Enable real-time replication for menu_categories table (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'menu_categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE menu_categories;
  END IF;
END $$;

-- Enable real-time replication for order_status_history table (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'order_status_history'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE order_status_history;
  END IF;
END $$;

-- Enable real-time replication for tables table (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tables'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tables;
  END IF;
END $$;
