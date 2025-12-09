-- Check Promotions Visibility
-- Run this in Supabase SQL Editor to see why promotions are/aren't showing

-- 1. Show all promotions with their visibility status
SELECT 
  id,
  code,
  title,
  is_active,
  start_date,
  end_date,
  restaurant_id,
  NOW() as current_server_time,
  CASE 
    WHEN is_active = false THEN '❌ INACTIVE'
    WHEN start_date > NOW() THEN '⏰ NOT STARTED YET'
    WHEN end_date < NOW() THEN '⏰ EXPIRED'
    WHEN is_active = true AND start_date <= NOW() AND end_date >= NOW() THEN '✅ VISIBLE'
    ELSE '❓ UNKNOWN'
  END as visibility_status,
  CASE 
    WHEN is_active = false THEN 'Turn on the Active toggle'
    WHEN start_date > NOW() THEN 'Start date is ' || (start_date - NOW()) || ' in the future'
    WHEN end_date < NOW() THEN 'Expired ' || (NOW() - end_date) || ' ago'
    WHEN is_active = true AND start_date <= NOW() AND end_date >= NOW() THEN 'Should be visible to customers'
    ELSE 'Check the data'
  END as reason
FROM promotions
ORDER BY created_at DESC;

-- 2. Count visible vs hidden promotions
SELECT 
  COUNT(*) FILTER (WHERE is_active = true AND start_date <= NOW() AND end_date >= NOW()) as visible_count,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_count,
  COUNT(*) FILTER (WHERE start_date > NOW()) as not_started_count,
  COUNT(*) FILTER (WHERE end_date < NOW()) as expired_count,
  COUNT(*) as total_count
FROM promotions;

-- 3. Show promotions by restaurant
SELECT 
  r.name as restaurant_name,
  r.id as restaurant_id,
  COUNT(p.id) as total_promotions,
  COUNT(p.id) FILTER (WHERE p.is_active = true AND p.start_date <= NOW() AND p.end_date >= NOW()) as visible_promotions
FROM restaurants r
LEFT JOIN promotions p ON p.restaurant_id = r.id
GROUP BY r.id, r.name
ORDER BY r.name;

-- 4. Quick fix: Make all promotions active and extend dates
-- UNCOMMENT THE LINES BELOW TO RUN THIS FIX
-- WARNING: This will modify your data!

-- UPDATE promotions
-- SET 
--   is_active = true,
--   start_date = CASE 
--     WHEN start_date > NOW() THEN NOW() 
--     ELSE start_date 
--   END,
--   end_date = CASE 
--     WHEN end_date < NOW() THEN NOW() + INTERVAL '7 days'
--     ELSE end_date
--   END
-- WHERE is_active = false OR start_date > NOW() OR end_date < NOW();

-- 5. Check RLS policies
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
