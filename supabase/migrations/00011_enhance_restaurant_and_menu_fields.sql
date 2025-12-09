/*
# Enhance Restaurant and Menu Fields

## Overview
This migration adds comprehensive fields to restaurants, menu items, and categories
to support better restaurant management and customer experience.

## Changes Made

### 1. Restaurant Table Enhancements
- `restaurant_type` (restaurant_type_enum: 'veg', 'non_veg', 'both') - Type of food served
- `cuisine_types` (text[]) - Array of cuisine types (e.g., Italian, Chinese, Indian)
- `images` (text[]) - Array of restaurant image URLs
- `description` (text) - Detailed restaurant description
- `phone` (text) - Restaurant contact phone number
- `address` (text) - Full restaurant address
- `average_rating` (numeric) - Average customer rating (0-5)
- `opening_hours` (jsonb) - Opening hours in JSON format

### 2. Menu Items Table Enhancements
- `item_type` (item_type_enum: 'veg', 'non_veg', 'vegan', 'egg') - Food type indicator
- `variants` (jsonb) - Price variants for different sizes/quantities
  Format: [{"name": "Small", "price": 10.99}, {"name": "Large", "price": 15.99}]
- `rating` (numeric) - Average item rating (0-5)
- `is_bestseller` (boolean) - Mark popular items
- `tags` (text[]) - Searchable tags for the item

### 3. Menu Categories Table Enhancements
- `image_url` (text) - Category image/icon URL
- `is_active` (boolean) - Enable/disable category visibility

### 4. New Enums
- `restaurant_type_enum`: 'veg', 'non_veg', 'both'
- `item_type_enum`: 'veg', 'non_veg', 'vegan', 'egg'

### 5. Security
- No RLS changes required - existing policies cover new fields
- All new fields are nullable for backward compatibility

## Notes
- Existing data remains unchanged
- New fields are optional (nullable) to maintain backward compatibility
- Variants JSON structure allows flexible pricing models
- Opening hours JSON allows complex schedules
*/

-- Create enums for restaurant and item types
DO $$ BEGIN
  CREATE TYPE restaurant_type_enum AS ENUM ('veg', 'non_veg', 'both');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE item_type_enum AS ENUM ('veg', 'non_veg', 'vegan', 'egg');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enhance restaurants table
ALTER TABLE restaurants 
  ADD COLUMN IF NOT EXISTS restaurant_type restaurant_type_enum DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS cuisine_types text[],
  ADD COLUMN IF NOT EXISTS images text[],
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS average_rating numeric(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  ADD COLUMN IF NOT EXISTS opening_hours jsonb;

-- Add comment for opening_hours format
COMMENT ON COLUMN restaurants.opening_hours IS 'JSON format: {"monday": {"open": "09:00", "close": "22:00", "closed": false}, ...}';

-- Enhance menu_items table
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS item_type item_type_enum DEFAULT 'veg',
  ADD COLUMN IF NOT EXISTS variants jsonb,
  ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags text[];

-- Add comment for variants format
COMMENT ON COLUMN menu_items.variants IS 'JSON format: [{"name": "Small", "price": 10.99, "description": "Serves 1"}, ...]';

-- Enhance menu_categories table
ALTER TABLE menu_categories
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_restaurants_type ON restaurants(restaurant_type);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_type ON menu_items(item_type);
CREATE INDEX IF NOT EXISTS idx_menu_items_rating ON menu_items(rating DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_bestseller ON menu_items(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_tags ON menu_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants USING GIN(cuisine_types);
CREATE INDEX IF NOT EXISTS idx_menu_categories_active ON menu_categories(is_active) WHERE is_active = true;

-- Create function to update restaurant average rating
CREATE OR REPLACE FUNCTION calculate_restaurant_rating(rest_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating numeric;
BEGIN
  SELECT COALESCE(AVG(rating), 0)
  INTO avg_rating
  FROM menu_items
  WHERE restaurant_id = rest_id AND rating > 0;
  
  UPDATE restaurants
  SET average_rating = ROUND(avg_rating, 2)
  WHERE id = rest_id;
  
  RETURN avg_rating;
END;
$$;

-- Create function to migrate existing vegetarian/vegan flags to item_type
CREATE OR REPLACE FUNCTION migrate_item_types()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update vegan items
  UPDATE menu_items
  SET item_type = 'vegan'::item_type_enum
  WHERE is_vegan = true;
  
  -- Update vegetarian items (but not vegan)
  UPDATE menu_items
  SET item_type = 'veg'::item_type_enum
  WHERE is_vegetarian = true AND is_vegan = false;
  
  -- Update non-vegetarian items
  UPDATE menu_items
  SET item_type = 'non_veg'::item_type_enum
  WHERE is_vegetarian = false AND is_vegan = false;
END;
$$;

-- Run migration for existing data
SELECT migrate_item_types();

-- Drop the migration function as it's no longer needed
DROP FUNCTION IF EXISTS migrate_item_types();
