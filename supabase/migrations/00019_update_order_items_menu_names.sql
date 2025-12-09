/*
# Update Order Items with Menu Item Names

This migration updates existing order_items records that have NULL or empty menu_item_name
by fetching the name from the related menu_items table.

1. Updates
   - Update order_items.menu_item_name from menu_items.name where menu_item_name is NULL or empty
   - Ensures all existing order items have proper menu item names for analytics

2. Notes
   - This is a data fix migration for existing records
   - New orders will automatically have menu_item_name populated
*/

-- Update order_items with menu_item_name from menu_items table
UPDATE order_items oi
SET menu_item_name = mi.name
FROM menu_items mi
WHERE oi.menu_item_id = mi.id
  AND (oi.menu_item_name IS NULL OR oi.menu_item_name = '');

-- For order items where menu_item was deleted (menu_item_id is NULL), set a default name
UPDATE order_items
SET menu_item_name = 'Deleted Item'
WHERE menu_item_id IS NULL
  AND (menu_item_name IS NULL OR menu_item_name = '');
