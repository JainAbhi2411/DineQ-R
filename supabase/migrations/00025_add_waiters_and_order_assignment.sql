/*
# Add Waiters Table and Order Assignment

## Overview
This migration adds waiter management functionality, allowing restaurant owners to:
1. Manage their staff (waiters)
2. Assign waiters to orders for better service tracking

## Changes

### 1. New Tables
- `waiters`
  - `id` (uuid, primary key)
  - `restaurant_id` (uuid, foreign key to restaurants)
  - `name` (text, not null) - Waiter's full name
  - `phone` (text, nullable) - Contact number
  - `status` (text, default 'active') - Employment status
  - `created_at` (timestamptz, default now())

### 2. Table Modifications
- `orders` table:
  - Added `waiter_id` (uuid, nullable, foreign key to waiters)
  - ON DELETE SET NULL - if waiter is deleted, orders remain but assignment is cleared

### 3. Security (RLS Policies)
- Waiters table:
  - Restaurant owners can view, create, update, and delete their own restaurant's waiters
  - Public read access for active waiters (needed for order assignment)
  
### 4. Indexes
- Index on `restaurant_id` for fast waiter lookup by restaurant
- Index on `status` for filtering active waiters

## Notes
- Waiter assignment is optional (nullable)
- Only active waiters should appear in assignment dropdowns
- Deleting a waiter doesn't affect existing orders
*/

-- Create waiters table
CREATE TABLE IF NOT EXISTS waiters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Add waiter_id to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS waiter_id uuid REFERENCES waiters(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waiters_restaurant_id ON waiters(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_waiters_status ON waiters(status);
CREATE INDEX IF NOT EXISTS idx_orders_waiter_id ON orders(waiter_id);

-- Enable RLS
ALTER TABLE waiters ENABLE ROW LEVEL SECURITY;

-- Policy: Restaurant owners can manage their waiters
CREATE POLICY "Owners can manage their restaurant waiters" ON waiters
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = waiters.restaurant_id
      AND r.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = waiters.restaurant_id
      AND r.owner_id = auth.uid()
    )
  );

-- Policy: Anyone can view active waiters (needed for order assignment)
CREATE POLICY "Anyone can view active waiters" ON waiters
  FOR SELECT
  USING (status = 'active');