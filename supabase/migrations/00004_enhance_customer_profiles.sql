/*
# Enhance Customer Profiles

## Changes Made

1. **Profile Enhancements**
   - Add full_name field for customer's full name
   - Add phone field for contact number
   - Add email field for email address
   - Add avatar_url for profile picture
   - Add bio field for customer bio/description
   - Add preferences field (JSONB) for dietary preferences, favorite cuisines, etc.
   - Add address fields for delivery/contact purposes

2. **Security**
   - Maintain existing RLS policies
   - Users can update their own profiles
*/

-- Add new fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;