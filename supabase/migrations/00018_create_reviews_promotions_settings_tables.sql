/*
# Create Reviews, Promotions, and Settings Tables

## 1. New Tables

### reviews
- `id` (uuid, primary key, default: gen_random_uuid())
- `restaurant_id` (uuid, references restaurants, not null)
- `customer_id` (uuid, references profiles, not null)
- `order_id` (uuid, references orders)
- `rating` (integer, not null, check: 1-5)
- `comment` (text)
- `reply` (text)
- `replied_at` (timestamptz)
- `created_at` (timestamptz, default: now())

### promotions
- `id` (uuid, primary key, default: gen_random_uuid())
- `restaurant_id` (uuid, references restaurants, not null)
- `title` (text, not null)
- `description` (text)
- `discount_type` (text, not null, check: 'percentage', 'fixed', 'bogo')
- `discount_value` (numeric, not null)
- `start_date` (date, not null)
- `end_date` (date, not null)
- `status` (text, not null, default: 'active')
- `usage_count` (integer, default: 0)
- `created_at` (timestamptz, default: now())

### restaurant_settings
- `id` (uuid, primary key, default: gen_random_uuid())
- `restaurant_id` (uuid, references restaurants, unique, not null)
- `timezone` (text, default: 'America/New_York')
- `currency` (text, default: 'USD')
- `auto_accept_orders` (boolean, default: false)
- `online_ordering` (boolean, default: true)
- `email_notifications` (boolean, default: true)
- `sms_notifications` (boolean, default: false)
- `push_notifications` (boolean, default: true)
- `review_alerts` (boolean, default: true)
- `tax_rate` (numeric, default: 0)
- `service_charge` (numeric, default: 0)
- `two_factor_auth` (boolean, default: false)
- `business_hours` (jsonb, default: '{}')
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

## 2. Security
- All tables are public (no RLS) as per project requirements
- Owner has full access to their restaurant data
- Customers can create reviews for their orders

## 3. Indexes
- Added indexes on foreign keys for better query performance
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  reply text,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'bogo')),
  discount_value numeric NOT NULL CHECK (discount_value >= 0),
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE INDEX idx_promotions_restaurant_id ON promotions(restaurant_id);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);

-- Create restaurant_settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE UNIQUE NOT NULL,
  timezone text DEFAULT 'America/New_York',
  currency text DEFAULT 'USD',
  auto_accept_orders boolean DEFAULT false,
  online_ordering boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT true,
  review_alerts boolean DEFAULT true,
  tax_rate numeric DEFAULT 0 CHECK (tax_rate >= 0),
  service_charge numeric DEFAULT 0 CHECK (service_charge >= 0),
  two_factor_auth boolean DEFAULT false,
  business_hours jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_restaurant_settings_restaurant_id ON restaurant_settings(restaurant_id);

-- Function to automatically create default settings when a restaurant is created
CREATE OR REPLACE FUNCTION create_default_restaurant_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO restaurant_settings (restaurant_id)
  VALUES (NEW.id)
  ON CONFLICT (restaurant_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_settings
  AFTER INSERT ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION create_default_restaurant_settings();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_restaurant_settings_updated_at
  BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();