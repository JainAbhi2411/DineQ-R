/*
# Create Promotion Menu Items Junction Table

This migration creates a junction table to link promotions with specific menu items,
allowing promotions to be applied to selected food items automatically.

1. New Tables
   - `promotion_menu_items`
     - `id` (uuid, primary key)
     - `promotion_id` (uuid, references promotions)
     - `menu_item_id` (uuid, references menu_items)
     - `created_at` (timestamptz, default: now())

2. Indexes
   - Index on promotion_id for fast lookup
   - Index on menu_item_id for fast lookup
   - Unique constraint on (promotion_id, menu_item_id) to prevent duplicates

3. Notes
   - If a promotion has no linked menu items, it applies to all items (restaurant-wide)
   - If a promotion has linked menu items, it only applies to those specific items
*/

-- Create promotion_menu_items junction table
CREATE TABLE IF NOT EXISTS promotion_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid REFERENCES promotions(id) ON DELETE CASCADE NOT NULL,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(promotion_id, menu_item_id)
);

-- Create indexes for performance
CREATE INDEX idx_promotion_menu_items_promotion_id ON promotion_menu_items(promotion_id);
CREATE INDEX idx_promotion_menu_items_menu_item_id ON promotion_menu_items(menu_item_id);
