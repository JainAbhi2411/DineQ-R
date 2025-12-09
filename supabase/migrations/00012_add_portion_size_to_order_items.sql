/*
# Add Portion Size Support to Order Items

## Overview
This migration adds support for half/full portion selection in orders.
Customers can now choose between different portion sizes (e.g., Half Plate, Full Plate)
when ordering items that have this option enabled.

## Changes Made

### 1. Order Items Table Enhancement
- `portion_size` (text) - Stores the selected portion size name (e.g., "Half", "Full", "Small", "Large")
- `variant_name` (text) - Stores the variant name if a specific variant was selected

### 2. Menu Items Enhancement
- `has_portions` (boolean) - Flag to indicate if item supports half/full portions
- Default is false for backward compatibility

## Usage Examples

### Menu Item with Half/Full Portions
```json
{
  "name": "Chicken Biryani",
  "price": 18.00,
  "has_portions": true,
  "variants": [
    {"name": "Half", "price": 10.00, "description": "Half portion"},
    {"name": "Full", "price": 18.00, "description": "Full portion"}
  ]
}
```

### Order Item with Portion Selection
```sql
INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, price, portion_size, variant_name)
VALUES ('...', '...', 'Chicken Biryani', 1, 10.00, 'Half', 'Half');
```

## Notes
- All new fields are nullable for backward compatibility
- Existing orders without portion_size will display normally
- The portion_size field is informational and helps track customer preferences
- Variant pricing is stored in the variants JSONB field on menu_items
*/

-- Add portion_size and variant_name to order_items table
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS portion_size text,
  ADD COLUMN IF NOT EXISTS variant_name text;

-- Add has_portions flag to menu_items table
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS has_portions boolean DEFAULT false;

-- Add comment for portion_size field
COMMENT ON COLUMN order_items.portion_size IS 'Selected portion size (e.g., "Half", "Full", "Small", "Large")';
COMMENT ON COLUMN order_items.variant_name IS 'Selected variant name from menu_items.variants';
COMMENT ON COLUMN menu_items.has_portions IS 'Indicates if item supports half/full portion selection';

-- Create index for querying items with portions
CREATE INDEX IF NOT EXISTS idx_menu_items_has_portions ON menu_items(has_portions) WHERE has_portions = true;

-- Create function to get portion statistics for a menu item
CREATE OR REPLACE FUNCTION get_portion_stats(item_id uuid)
RETURNS TABLE(
  portion_size text,
  order_count bigint,
  percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_orders bigint;
BEGIN
  -- Get total orders for this item
  SELECT COUNT(*)
  INTO total_orders
  FROM order_items
  WHERE menu_item_id = item_id;
  
  -- Return portion statistics
  RETURN QUERY
  SELECT 
    oi.portion_size,
    COUNT(*) as order_count,
    CASE 
      WHEN total_orders > 0 THEN ROUND((COUNT(*)::numeric / total_orders::numeric) * 100, 2)
      ELSE 0
    END as percentage
  FROM order_items oi
  WHERE oi.menu_item_id = item_id
    AND oi.portion_size IS NOT NULL
  GROUP BY oi.portion_size
  ORDER BY order_count DESC;
END;
$$;

-- Add comment for the function
COMMENT ON FUNCTION get_portion_stats(uuid) IS 'Returns statistics on portion size preferences for a menu item';
