/*
# Add Advanced Features to DineQR

## Changes Made

1. **Menu Categories Enhancement**
   - Add description field to menu_categories table

2. **Menu Items Enhancement**
   - Add ingredients, allergens, preparation_time, calories, is_vegetarian, is_vegan, is_gluten_free fields

3. **Staff/Waiters Table**
   - Create staff table for waiters/agents
   - Link staff to restaurants
   - Track assigned orders

4. **Chat/Messages Table**
   - Create messages table for real-time chat
   - Support customer-to-restaurant communication
   - Track message status (sent, read)

5. **Order Assignments**
   - Add assigned_to field in orders table to link with staff

6. **Security**
   - RLS policies for staff table
   - RLS policies for messages table
   - Ensure proper access control
*/

-- Add description to menu_categories if not exists
ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS description TEXT;

-- Enhance menu_items table with advanced fields
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS allergens TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS preparation_time INTEGER DEFAULT 15;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS calories INTEGER;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS spice_level TEXT CHECK (spice_level IN ('none', 'mild', 'medium', 'hot', 'extra_hot'));

-- Create staff table for waiters/agents
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'waiter' CHECK (role IN ('waiter', 'chef', 'manager')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_restaurant ON staff(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_staff_user ON staff(user_id);

-- Add assigned_to field to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES staff(id) ON DELETE SET NULL;

-- Create messages table for real-time chat
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'owner', 'staff')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_order ON messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_restaurant ON messages(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Staff policies
CREATE POLICY "Restaurant owners can manage their staff"
  ON staff FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view their own profile"
  ON staff FOR SELECT
  USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages for their orders"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid() OR
    order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()) OR
    restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid()) OR
    sender_id IN (SELECT user_id FROM staff WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (sender_id = auth.uid() OR restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for staff table
DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RPC function to assign waiter to order
CREATE OR REPLACE FUNCTION assign_waiter_to_order(
  order_id UUID,
  staff_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE orders
  SET assigned_to = staff_id
  WHERE id = order_id;
END;
$$;

-- Create RPC function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_order_id UUID,
  p_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE messages
  SET is_read = true
  WHERE order_id = p_order_id
    AND sender_id != p_user_id
    AND is_read = false;
END;
$$;