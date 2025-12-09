/*
# Add Half Portion Support to Crispy Spring Rolls

## Overview
This migration enables half/full portion selection for the Crispy Spring Rolls menu item.
The full portion price is $8.99 and the half portion price is $4.45.

## Changes Made

### 1. Update Crispy Spring Rolls Menu Item
- Enable `has_portions` flag
- Add variants array with half and full portion options
- Full portion: $8.99
- Half portion: $4.45

## Usage
Customers can now select between:
- Half Portion: $4.45
- Full Portion: $8.99 (default)

## Notes
- The base price remains $8.99 (full portion)
- Variants are stored in JSONB format
- Order items will store the selected portion_size and variant_name
*/

-- Update Crispy Spring Rolls to enable portions
UPDATE menu_items
SET 
  has_portions = true,
  variants = '[
    {
      "name": "Half",
      "price": 4.45,
      "description": "Half portion"
    },
    {
      "name": "Full",
      "price": 8.99,
      "description": "Full portion"
    }
  ]'::jsonb
WHERE 
  name = 'Crispy Spring Rolls'
  AND restaurant_id IN (SELECT id FROM restaurants LIMIT 1);

-- Verify the update
DO $$
DECLARE
  v_item_count integer;
BEGIN
  SELECT COUNT(*) INTO v_item_count
  FROM menu_items
  WHERE name = 'Crispy Spring Rolls' AND has_portions = true;
  
  IF v_item_count > 0 THEN
    RAISE NOTICE 'Successfully enabled half/full portions for Crispy Spring Rolls';
  ELSE
    RAISE WARNING 'Could not find Crispy Spring Rolls to update';
  END IF;
END $$;
