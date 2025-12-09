# Offers Not Showing - Troubleshooting Guide

## Issue: Offers not appearing on customer menu page

### Step 1: Check Browser Console

Open the customer menu page and check the browser console (F12 → Console tab). Look for these log messages:

```
[MenuBrowsing] Loading data for restaurant: <restaurant-id>
[promotionApi] Fetching active promotions for restaurant: <restaurant-id>
[promotionApi] Current time: 2025-12-07T...
[promotionApi] Query result: { data: [...], error: null }
[promotionApi] Returning promotions: <count>
[MenuBrowsing] Loaded promotions: [...]
[MenuBrowsing] Promotions state updated: { count: <count>, promotions: [...] }
```

### Step 2: Verify Promotion Data

Check what the console logs show:

#### If you see `Returning promotions: 0`:
The query is not finding any active promotions. Check:

1. **Is the promotion active?**
   - Go to Owner Dashboard → Promotions
   - Check if the "Active" toggle is ON (green)

2. **Are the dates valid?**
   - Start Date should be today or earlier
   - End Date should be today or later
   - Check the dates in the promotion details

3. **Is the restaurant ID correct?**
   - The promotion must belong to the same restaurant
   - Check the restaurant_id in the promotion

#### If you see an error in the console:
```
[promotionApi] Error fetching promotions: { message: "..." }
```

This could be:
- **RLS Policy Issue**: The policy might be blocking access
- **Database Connection Issue**: Supabase might be down
- **Query Error**: There might be a syntax error in the query

### Step 3: Check Promotion Details in Database

You can check the promotion directly in Supabase:

1. Go to Supabase Dashboard
2. Click on "Table Editor"
3. Select "promotions" table
4. Find your promotion and check:
   - `is_active` = true
   - `start_date` ≤ current date/time
   - `end_date` ≥ current date/time
   - `restaurant_id` matches the restaurant you're viewing

### Step 4: Test the Query Manually

In Supabase SQL Editor, run this query:

```sql
SELECT 
  id,
  code,
  title,
  is_active,
  start_date,
  end_date,
  restaurant_id,
  NOW() as current_time,
  CASE 
    WHEN is_active = true 
      AND start_date <= NOW() 
      AND end_date >= NOW() 
    THEN 'VISIBLE'
    ELSE 'HIDDEN'
  END as visibility_status
FROM promotions
WHERE restaurant_id = '<your-restaurant-id>'
ORDER BY created_at DESC;
```

Replace `<your-restaurant-id>` with your actual restaurant ID.

This will show you:
- All promotions for the restaurant
- Current server time
- Why each promotion is visible or hidden

### Step 5: Common Issues and Fixes

#### Issue 1: Dates are in the future
**Problem**: Start date is set to a future date  
**Fix**: Edit the promotion and set start_date to today or earlier

#### Issue 2: Dates are in the past
**Problem**: End date has already passed  
**Fix**: Edit the promotion and extend the end_date

#### Issue 3: Promotion is inactive
**Problem**: The "Active" toggle is OFF  
**Fix**: Toggle it ON in the promotions page

#### Issue 4: Wrong restaurant
**Problem**: Promotion belongs to a different restaurant  
**Fix**: Create a new promotion for the correct restaurant

#### Issue 5: Timezone mismatch
**Problem**: Server time and your local time are different  
**Fix**: Use UTC times or adjust dates accordingly

### Step 6: Test with a Simple Promotion

Create a test promotion with these settings:

```
Code: TEST123
Title: Test Offer
Discount Type: Percentage
Discount Value: 10
Min Order Amount: 0
Start Date: Yesterday
End Date: Tomorrow (or 7 days from now)
Active: YES (toggle ON)
```

This should definitely show up on the customer page.

### Step 7: Check RLS Policies

Run this query in Supabase SQL Editor to verify the RLS policy:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'promotions';
```

You should see a policy named "Anyone can view active promotions" with:
- `cmd` = SELECT
- `roles` = {public}
- `qual` should include checks for is_active, start_date, and end_date

### Step 8: Verify Real-time Subscription

Check the console for this message:

```
[MenuBrowsing] ✅ Successfully subscribed to promotions changes
```

If you see an error instead, the real-time subscription might not be working.

### Step 9: Test Real-time Updates

1. Keep the customer menu page open
2. Open Owner Dashboard → Promotions in another tab
3. Create a new promotion
4. You should see a toast notification on the customer page
5. The new offer should appear in the banner

If this doesn't work, check:
- Supabase real-time is enabled for the promotions table
- The subscription is active (check console logs)

### Step 10: Clear Cache and Reload

Sometimes the issue is just browser cache:

1. Open DevTools (F12)
2. Right-click the reload button
3. Select "Empty Cache and Hard Reload"
4. Check if offers appear now

### Debug Checklist

Use this checklist to verify everything:

- [ ] Promotion exists in database
- [ ] `is_active` = true
- [ ] `start_date` ≤ now
- [ ] `end_date` ≥ now
- [ ] `restaurant_id` matches
- [ ] RLS policy allows SELECT
- [ ] Console shows promotions loaded
- [ ] No errors in console
- [ ] Real-time subscription active
- [ ] Browser cache cleared

### Getting More Help

If you've checked all the above and offers still don't show:

1. **Copy the console logs** - All messages starting with `[MenuBrowsing]` and `[promotionApi]`
2. **Take a screenshot** of the promotion details in Supabase
3. **Note the restaurant ID** you're trying to view
4. **Check the network tab** in DevTools for any failed requests

### Expected Console Output (Success)

When everything works correctly, you should see:

```
[MenuBrowsing] Loading data for restaurant: abc123...
[promotionApi] Fetching active promotions for restaurant: abc123...
[promotionApi] Current time: 2025-12-07T03:20:00.000Z
[promotionApi] Query result: { data: [{ id: "...", code: "TEST123", ... }], error: null }
[promotionApi] Returning promotions: 1
[MenuBrowsing] Loaded promotions: [{ id: "...", code: "TEST123", ... }]
[MenuBrowsing] Promotions state updated: { count: 1, promotions: [...] }
[MenuBrowsing] ✅ Successfully subscribed to promotions changes
```

And on the page, you should see:
- The offers banner with gradient cards
- Your promotion displayed with the discount badge
- The promo code shown
- Ability to click and apply the offer

### Quick Fix Commands

If you need to manually fix a promotion in SQL:

```sql
-- Make a promotion active
UPDATE promotions
SET is_active = true
WHERE code = 'YOUR_CODE';

-- Extend end date by 7 days
UPDATE promotions
SET end_date = NOW() + INTERVAL '7 days'
WHERE code = 'YOUR_CODE';

-- Set start date to now
UPDATE promotions
SET start_date = NOW()
WHERE code = 'YOUR_CODE';

-- Fix all dates for a promotion
UPDATE promotions
SET 
  is_active = true,
  start_date = NOW(),
  end_date = NOW() + INTERVAL '7 days'
WHERE code = 'YOUR_CODE';
```

---

## Summary

The most common reasons offers don't show:

1. ❌ Promotion is not active (toggle is OFF)
2. ❌ Start date is in the future
3. ❌ End date has passed
4. ❌ Wrong restaurant ID
5. ❌ RLS policy blocking access

**Quick Test**: Create a new promotion with start_date = yesterday, end_date = next week, and active = true. It should show immediately!
