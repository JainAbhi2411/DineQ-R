/*
# Create visited_restaurants table

## Purpose
Track restaurants that customers have visited by scanning QR codes, allowing quick access for reordering.

## Tables

### visited_restaurants
- `id` (uuid, primary key, default: gen_random_uuid())
- `customer_id` (uuid, references profiles.id, not null)
- `restaurant_id` (uuid, references restaurants.id, not null)
- `first_visited_at` (timestamptz, default: now())
- `last_visited_at` (timestamptz, default: now())
- `visit_count` (integer, default: 1)
- `created_at` (timestamptz, default: now())

## Indexes
- Unique index on (customer_id, restaurant_id) to prevent duplicates
- Index on customer_id for fast lookups
- Index on last_visited_at for sorting

## Security
- Enable RLS on visited_restaurants table
- Customers can view their own visited restaurants
- Customers can insert their own visited restaurants
- Customers can update their own visited restaurants (for visit count and timestamps)

## Functions
- `upsert_visited_restaurant`: Function to insert or update visited restaurant record
*/

-- Create visited_restaurants table
CREATE TABLE IF NOT EXISTS visited_restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  first_visited_at timestamptz DEFAULT now(),
  last_visited_at timestamptz DEFAULT now(),
  visit_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, restaurant_id)
);

-- Create indexes
CREATE INDEX idx_visited_restaurants_customer ON visited_restaurants(customer_id);
CREATE INDEX idx_visited_restaurants_last_visited ON visited_restaurants(last_visited_at DESC);

-- Enable RLS
ALTER TABLE visited_restaurants ENABLE ROW LEVEL SECURITY;

-- Policies for customers to manage their own visited restaurants
CREATE POLICY "Customers can view own visited restaurants" ON visited_restaurants
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert own visited restaurants" ON visited_restaurants
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own visited restaurants" ON visited_restaurants
  FOR UPDATE USING (auth.uid() = customer_id);

-- Function to upsert visited restaurant
CREATE OR REPLACE FUNCTION upsert_visited_restaurant(
  p_customer_id uuid,
  p_restaurant_id uuid
)
RETURNS visited_restaurants
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result visited_restaurants;
BEGIN
  -- Insert or update the visited restaurant record
  INSERT INTO visited_restaurants (customer_id, restaurant_id, first_visited_at, last_visited_at, visit_count)
  VALUES (p_customer_id, p_restaurant_id, now(), now(), 1)
  ON CONFLICT (customer_id, restaurant_id)
  DO UPDATE SET
    last_visited_at = now(),
    visit_count = visited_restaurants.visit_count + 1
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$;
