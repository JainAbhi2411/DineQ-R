/*
# Fix Tables Schema

## Changes
1. Add missing `qr_code` column to tables table (alias for qr_code_data for backward compatibility)
2. Add missing `capacity` column to tables table
3. Ensure RLS policies allow owners to create tables

## Tables Modified
- `tables`: Added qr_code and capacity columns
*/

-- Add missing columns to tables
ALTER TABLE tables ADD COLUMN IF NOT EXISTS qr_code text;
ALTER TABLE tables ADD COLUMN IF NOT EXISTS capacity integer DEFAULT 4 NOT NULL;

-- Update qr_code to match qr_code_data for existing records
UPDATE tables SET qr_code = qr_code_data WHERE qr_code IS NULL;

-- Make qr_code unique
CREATE UNIQUE INDEX IF NOT EXISTS tables_qr_code_unique ON tables(qr_code);

-- Ensure RLS is enabled
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Restaurant owners can manage their tables" ON tables;
DROP POLICY IF EXISTS "Customers can view tables" ON tables;

-- Create comprehensive RLS policies for tables
CREATE POLICY "Restaurant owners can manage their tables" ON tables
  FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Customers can view tables" ON tables
  FOR SELECT
  USING (true);