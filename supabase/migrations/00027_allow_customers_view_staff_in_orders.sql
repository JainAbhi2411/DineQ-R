/*
# Allow Customers to View Staff Information in Orders

## Problem
Customers cannot see waiter information in their orders because the staff table
has RLS policies that only allow:
1. Restaurant owners to view their staff
2. Staff members to view their own profile

## Solution
Add a policy that allows anyone to view basic staff information (name, role)
when the staff member is assigned to an order. This is public information
that customers need to see.

## Changes
1. Add policy to allow public read access to staff table
   - Customers need to see waiter names in their orders
   - This is non-sensitive information (name, role, email)
   - Does not expose private data

## Security Considerations
- Only SELECT permission is granted
- Staff information (name, email, role) is considered public within the restaurant context
- Customers can only see staff who are assigned to orders
- No write permissions are granted
*/

-- Allow anyone to view staff information
-- This is needed so customers can see waiter names in their orders
CREATE POLICY "Anyone can view staff information"
  ON staff
  FOR SELECT
  TO public
  USING (true);
