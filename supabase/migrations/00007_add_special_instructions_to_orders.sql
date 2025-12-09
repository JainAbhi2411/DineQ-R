/*
# Add special_instructions column to orders table

## Changes
1. Add special_instructions column to orders table
2. Allow NULL values for optional instructions
3. Add index for text search if needed

## Purpose
This column allows customers to add special requests or instructions for their orders:
- Dietary restrictions
- Cooking preferences
- Delivery instructions
- Special requests
*/

-- Add special_instructions column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS special_instructions text;

-- Create index for faster text searches (optional, for future search functionality)
CREATE INDEX IF NOT EXISTS idx_orders_special_instructions ON orders USING gin(to_tsvector('english', special_instructions)) WHERE special_instructions IS NOT NULL;