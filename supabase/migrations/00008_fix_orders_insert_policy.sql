/*
# Fix Orders Insert Policy

## Problem
Customers cannot create orders due to missing INSERT policy on orders table.
Error: "new row violates row-level security policy for table 'orders'"

## Solution
Add INSERT policy to allow authenticated customers to create their own orders.
Add INSERT policy for order_items to allow creating items for their orders.

## Security
- Customers can only insert orders with their own customer_id
- Customers can only insert order_items for orders they created
- Restaurant owners can insert orders for their restaurants
- All policies maintain data integrity and security
*/

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Owners can create orders" ON orders;
DROP POLICY IF EXISTS "Customers can update own orders" ON orders;
DROP POLICY IF EXISTS "Owners can update restaurant orders" ON orders;
DROP POLICY IF EXISTS "Customers can create order items" ON order_items;
DROP POLICY IF EXISTS "Owners can create order items" ON order_items;

-- Allow customers to create orders for themselves
CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

-- Allow restaurant owners to create orders for their restaurants
CREATE POLICY "Owners can create orders" ON orders
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Allow customers to update their own orders (e.g., cancel)
CREATE POLICY "Customers can update own orders" ON orders
  FOR UPDATE 
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

-- Allow restaurant owners to update orders for their restaurants
CREATE POLICY "Owners can update restaurant orders" ON orders
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Allow customers to create order items for their own orders
CREATE POLICY "Customers can create order items" ON order_items
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id AND o.customer_id = auth.uid()
    )
  );

-- Allow restaurant owners to create order items for orders in their restaurants
CREATE POLICY "Owners can create order items" ON order_items
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN restaurants r ON r.id = o.restaurant_id
      WHERE o.id = order_id AND r.owner_id = auth.uid()
    )
  );
