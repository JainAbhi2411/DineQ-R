/*
# Create Initial Database Schema for DineQR

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `full_name` (text)
  - `phone` (text)
  - `role` (user_role: 'owner' or 'customer')
  - `created_at` (timestamptz)

- `restaurants`
  - `id` (uuid, primary key)
  - `owner_id` (uuid, references profiles)
  - `name` (text, not null)
  - `location` (text)
  - `contact_details` (text)
  - `business_info` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- `menu_categories`
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid, references restaurants)
  - `name` (text, not null)
  - `display_order` (integer)
  - `created_at` (timestamptz)

- `menu_items`
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid, references restaurants)
  - `category_id` (uuid, references menu_categories)
  - `name` (text, not null)
  - `description` (text)
  - `price` (numeric, not null)
  - `image_url` (text)
  - `is_available` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- `tables`
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid, references restaurants)
  - `table_number` (text, not null)
  - `qr_code_data` (text, unique)
  - `created_at` (timestamptz)

- `orders`
  - `id` (uuid, primary key)
  - `customer_id` (uuid, references profiles)
  - `restaurant_id` (uuid, references restaurants)
  - `table_id` (uuid, references tables)
  - `status` (order_status: 'pending', 'preparing', 'served', 'completed', 'cancelled')
  - `total_amount` (numeric, not null)
  - `currency` (text, default 'usd')
  - `stripe_session_id` (text, unique)
  - `stripe_payment_intent_id` (text)
  - `customer_email` (text)
  - `customer_name` (text)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- `order_items`
  - `id` (uuid, primary key)
  - `order_id` (uuid, references orders)
  - `menu_item_id` (uuid, references menu_items)
  - `quantity` (integer, not null)
  - `price` (numeric, not null)
  - `notes` (text)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on all tables
- Create admin helper function
- Owners can manage their own restaurants and related data
- Customers can view menus and manage their own orders
- Public can view menus without authentication

3. Enums
- user_role: 'owner', 'customer'
- order_status: 'pending', 'preparing', 'served', 'completed', 'cancelled'
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('owner', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'served', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  phone text,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  location text,
  contact_details text,
  business_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tables table
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  table_number text NOT NULL,
  qr_code_data text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(restaurant_id, table_number)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  table_id uuid REFERENCES tables(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending'::order_status NOT NULL,
  total_amount numeric(12,2) NOT NULL CHECK (total_amount >= 0),
  currency text DEFAULT 'usd' NOT NULL,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  customer_email text,
  customer_name text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  menu_item_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_tables_restaurant_id ON tables(restaurant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is owner
CREATE OR REPLACE FUNCTION is_owner(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'owner'::user_role
  );
$$;

-- Create helper function to check if user owns a restaurant
CREATE OR REPLACE FUNCTION owns_restaurant(uid uuid, rest_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM restaurants r
    WHERE r.id = rest_id AND r.owner_id = uid
  );
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Restaurants policies
CREATE POLICY "Anyone can view restaurants" ON restaurants
  FOR SELECT USING (true);

CREATE POLICY "Owners can create restaurants" ON restaurants
  FOR INSERT WITH CHECK (auth.uid() = owner_id AND is_owner(auth.uid()));

CREATE POLICY "Owners can update own restaurants" ON restaurants
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own restaurants" ON restaurants
  FOR DELETE USING (auth.uid() = owner_id);

-- Menu categories policies
CREATE POLICY "Anyone can view menu categories" ON menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage categories" ON menu_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = menu_categories.restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Menu items policies
CREATE POLICY "Anyone can view available menu items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage menu items" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = menu_items.restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Tables policies
CREATE POLICY "Anyone can view tables" ON tables
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage tables" ON tables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = tables.restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Owners can view restaurant orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Order items policies
CREATE POLICY "Users can view order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id 
      AND (o.customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM restaurants r
        WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Service role can manage order items" ON order_items
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create trigger function to sync auth.users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'customer'::user_role
  );
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create RPC function to update order status
CREATE OR REPLACE FUNCTION update_order_status(
  order_id uuid,
  new_status order_status
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE orders
  SET 
    status = new_status,
    updated_at = now(),
    completed_at = CASE 
      WHEN new_status IN ('completed'::order_status, 'cancelled'::order_status) 
      THEN now() 
      ELSE completed_at 
    END
  WHERE id = order_id
  AND (
    customer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()
    )
  );
END;
$$;