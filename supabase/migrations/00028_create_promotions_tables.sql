/*
# Create Promotions and Offers System

## Overview
This migration creates a comprehensive promotions system similar to Zomato, allowing
restaurant owners to create offers and customers to apply them during checkout.

## 1. New Tables

### promotions
Stores all promotional offers created by restaurant owners.
- `id` (uuid, primary key)
- `restaurant_id` (uuid, references restaurants) - Which restaurant owns this promotion
- `code` (text, unique per restaurant) - Promo code like "SAVE20", "FIRST50"
- `title` (text) - Display title like "20% Off on Orders Above $30"
- `description` (text) - Detailed description
- `discount_type` (enum) - PERCENTAGE or FIXED_AMOUNT
- `discount_value` (numeric) - The discount value (20 for 20%, or 5 for $5 off)
- `min_order_amount` (numeric) - Minimum order amount to apply offer
- `max_discount` (numeric, nullable) - Maximum discount cap for percentage offers
- `start_date` (timestamptz) - When offer becomes active
- `end_date` (timestamptz) - When offer expires
- `usage_limit_per_customer` (integer, nullable) - How many times one customer can use
- `total_usage_limit` (integer, nullable) - Total number of times offer can be used
- `used_count` (integer, default 0) - How many times offer has been used
- `is_active` (boolean, default true) - Can be toggled on/off by owner
- `terms` (text, nullable) - Terms and conditions
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### promotion_usage
Tracks each time a promotion is used by a customer.
- `id` (uuid, primary key)
- `promotion_id` (uuid, references promotions)
- `customer_id` (uuid, references profiles)
- `order_id` (uuid, references orders)
- `discount_amount` (numeric) - Actual discount amount applied
- `used_at` (timestamptz)

## 2. Security
- Enable RLS on both tables
- Restaurant owners can manage their own promotions
- Customers can view active promotions for restaurants
- Promotion usage is tracked automatically

## 3. Helper Functions
- validate_promotion_code() - Validates if a promo code can be applied
- get_promotion_discount() - Calculates discount amount for an order
*/

-- Create discount type enum
CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  code text NOT NULL,
  title text NOT NULL,
  description text,
  discount_type discount_type NOT NULL,
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  min_order_amount numeric DEFAULT 0 CHECK (min_order_amount >= 0),
  max_discount numeric CHECK (max_discount IS NULL OR max_discount > 0),
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz NOT NULL,
  usage_limit_per_customer integer CHECK (usage_limit_per_customer IS NULL OR usage_limit_per_customer > 0),
  total_usage_limit integer CHECK (total_usage_limit IS NULL OR total_usage_limit > 0),
  used_count integer DEFAULT 0 CHECK (used_count >= 0),
  is_active boolean DEFAULT true,
  terms text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create unique index for code per restaurant (case-insensitive)
CREATE UNIQUE INDEX idx_promotions_unique_code ON promotions(restaurant_id, UPPER(code));

-- Create promotion_usage table
CREATE TABLE IF NOT EXISTS promotion_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_amount numeric NOT NULL CHECK (discount_amount >= 0),
  used_at timestamptz DEFAULT now(),
  CONSTRAINT unique_promotion_per_order UNIQUE (order_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_promotions_restaurant ON promotions(restaurant_id);
CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_active ON promotions(is_active, start_date, end_date);
CREATE INDEX idx_promotion_usage_promotion ON promotion_usage(promotion_id);
CREATE INDEX idx_promotion_usage_customer ON promotion_usage(customer_id);
CREATE INDEX idx_promotion_usage_order ON promotion_usage(order_id);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for promotions table

-- Restaurant owners can manage their own promotions
CREATE POLICY "Owners can manage their restaurant promotions"
  ON promotions
  FOR ALL
  TO authenticated
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  ))
  WITH CHECK (restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  ));

-- Anyone can view active promotions
CREATE POLICY "Anyone can view active promotions"
  ON promotions
  FOR SELECT
  TO public
  USING (
    is_active = true 
    AND start_date <= now() 
    AND end_date >= now()
  );

-- RLS Policies for promotion_usage table

-- Restaurant owners can view usage of their promotions
CREATE POLICY "Owners can view their promotion usage"
  ON promotion_usage
  FOR SELECT
  TO authenticated
  USING (promotion_id IN (
    SELECT p.id FROM promotions p
    JOIN restaurants r ON r.id = p.restaurant_id
    WHERE r.owner_id = auth.uid()
  ));

-- Customers can view their own promotion usage
CREATE POLICY "Customers can view their own usage"
  ON promotion_usage
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- System can insert promotion usage (handled by application logic)
CREATE POLICY "Authenticated users can insert usage"
  ON promotion_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- Function to validate promotion code
CREATE OR REPLACE FUNCTION validate_promotion_code(
  p_code text,
  p_restaurant_id uuid,
  p_customer_id uuid,
  p_order_amount numeric
)
RETURNS TABLE (
  valid boolean,
  promotion_id uuid,
  discount_amount numeric,
  error_message text
) AS $$
DECLARE
  v_promotion promotions;
  v_customer_usage_count integer;
  v_calculated_discount numeric;
BEGIN
  -- Find the promotion
  SELECT * INTO v_promotion
  FROM promotions
  WHERE UPPER(code) = UPPER(p_code)
    AND restaurant_id = p_restaurant_id
    AND is_active = true
    AND start_date <= now()
    AND end_date >= now();

  -- Check if promotion exists
  IF v_promotion.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::uuid, 0::numeric, 'Invalid or expired promo code'::text;
    RETURN;
  END IF;

  -- Check minimum order amount
  IF p_order_amount < v_promotion.min_order_amount THEN
    RETURN QUERY SELECT false, v_promotion.id, 0::numeric, 
      format('Minimum order amount is $%s', v_promotion.min_order_amount)::text;
    RETURN;
  END IF;

  -- Check total usage limit
  IF v_promotion.total_usage_limit IS NOT NULL 
     AND v_promotion.used_count >= v_promotion.total_usage_limit THEN
    RETURN QUERY SELECT false, v_promotion.id, 0::numeric, 'Promotion usage limit reached'::text;
    RETURN;
  END IF;

  -- Check per-customer usage limit
  IF v_promotion.usage_limit_per_customer IS NOT NULL THEN
    SELECT COUNT(*) INTO v_customer_usage_count
    FROM promotion_usage
    WHERE promotion_id = v_promotion.id
      AND customer_id = p_customer_id;

    IF v_customer_usage_count >= v_promotion.usage_limit_per_customer THEN
      RETURN QUERY SELECT false, v_promotion.id, 0::numeric, 
        'You have already used this promotion'::text;
      RETURN;
    END IF;
  END IF;

  -- Calculate discount
  IF v_promotion.discount_type = 'PERCENTAGE' THEN
    v_calculated_discount := (p_order_amount * v_promotion.discount_value / 100);
    -- Apply max discount cap if exists
    IF v_promotion.max_discount IS NOT NULL 
       AND v_calculated_discount > v_promotion.max_discount THEN
      v_calculated_discount := v_promotion.max_discount;
    END IF;
  ELSE
    v_calculated_discount := v_promotion.discount_value;
  END IF;

  -- Ensure discount doesn't exceed order amount
  IF v_calculated_discount > p_order_amount THEN
    v_calculated_discount := p_order_amount;
  END IF;

  -- Return success
  RETURN QUERY SELECT true, v_promotion.id, v_calculated_discount, NULL::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update promotion used count
CREATE OR REPLACE FUNCTION increment_promotion_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE promotions
  SET used_count = used_count + 1
  WHERE id = NEW.promotion_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment used_count
CREATE TRIGGER trigger_increment_promotion_usage
  AFTER INSERT ON promotion_usage
  FOR EACH ROW
  EXECUTE FUNCTION increment_promotion_usage();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_promotions_timestamp
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_promotions_updated_at();
