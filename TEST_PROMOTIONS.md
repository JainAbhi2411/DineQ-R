# Promotion System Testing Guide

## ✅ Pre-Test Checklist

1. **Database Migrations Applied**:
   - ✅ 00028_create_promotions_tables.sql
   - ✅ 00029_add_promotion_fields_to_orders.sql
   - ✅ 00030_fix_validate_promotion_code_ambiguous_column.sql

2. **Active Promotion Available**:
   - Code: `SAVE30`
   - Discount: 30% off (max $4)
   - Min Order: $7
   - Valid: Dec 6, 2025 18:30 - Dec 7, 2025 18:29 UTC
   - Restaurant ID: `426c2f81-1b10-4c79-82e8-09c1433f145a`

## 🧪 Test Scenarios

### Test 1: View Available Offers
**Steps**:
1. Navigate to the menu browsing page
2. Look for "Available Offers" banner at the top
3. Click "View Available Offers & Deals"

**Expected Result**:
- Banner should appear with promotion count
- Modal should open showing SAVE30 promotion
- Promotion details should be displayed correctly

**If It Fails**:
- Open browser console (F12)
- Look for `[MenuBrowsing] Loaded promotions:` log
- Check if promotions array is empty or has data
- Verify restaurant ID matches

---

### Test 2: Apply Promo Code (Below Minimum)
**Steps**:
1. Add items to cart totaling less than $7
2. Click "Apply Promo Code"
3. Enter code: `SAVE30`
4. Click "Apply"

**Expected Result**:
- Error message: "Minimum order amount is $7"
- No discount applied

---

### Test 3: Apply Promo Code (Valid Order)
**Steps**:
1. Add items to cart totaling $25 or more
2. Click "Apply Promo Code"
3. Enter code: `SAVE30`
4. Click "Apply"

**Expected Result**:
- Success message: "Promo code applied successfully!"
- Discount of $4 applied (30% of $25 = $7.50, capped at $4)
- Cart total reduced by $4
- Promo code badge appears showing "SAVE30"

---

### Test 4: Complete Order with Promo Code (COC Payment)
**Steps**:
1. Apply promo code SAVE30 to cart (as in Test 3)
2. Proceed to checkout
3. Select "Cash on Collection" payment method
4. Fill in customer details
5. Click "Place Order"

**Expected Result**:
- Order created successfully
- Order total reflects discount
- Database records:
  - `orders` table has `promotion_id`, `discount_amount`, `promo_code`
  - `promotion_usage` table has new record
  - `promotions.used_count` incremented by 1

**Verify in Database**:
```sql
-- Check order
SELECT id, total_amount, discount_amount, promo_code, promotion_id
FROM orders 
WHERE promo_code = 'SAVE30'
ORDER BY created_at DESC
LIMIT 1;

-- Check promotion usage
SELECT * FROM promotion_usage
ORDER BY used_at DESC
LIMIT 1;
```

---

### Test 5: Complete Order with Promo Code (Online Payment)
**Steps**:
1. Apply promo code SAVE30 to cart
2. Proceed to checkout
3. Select "Pay Online" payment method
4. Fill in customer details
5. Click "Proceed to Payment"
6. Complete Stripe checkout

**Expected Result**:
- Redirected to Stripe checkout
- Discount applied in Stripe session
- After payment, order created with promotion data
- Same database records as Test 4

---

### Test 6: Invalid Promo Code
**Steps**:
1. Add items to cart
2. Click "Apply Promo Code"
3. Enter code: `INVALID123`
4. Click "Apply"

**Expected Result**:
- Error message: "Invalid or expired promo code"
- No discount applied

---

### Test 7: Expired Promo Code
**Steps**:
1. Wait until after Dec 7, 2025 18:29 UTC
2. Try to apply SAVE30

**Expected Result**:
- Error message: "Invalid or expired promo code"
- No discount applied

---

## 🐛 Debugging Tips

### Promotions Not Showing
1. **Check Browser Console**:
   ```javascript
   // Look for these logs:
   [MenuBrowsing] Loaded promotions: [...]
   [promotionApi] Fetching active promotions for restaurant: ...
   [promotionApi] Query result: ...
   ```

2. **Check Network Tab**:
   - Look for request to `/rest/v1/promotions`
   - Verify response contains promotion data
   - Check for any 401/403 errors (RLS policy issues)

3. **Verify Restaurant ID**:
   ```sql
   -- Get restaurant ID from URL or console
   SELECT id, name FROM restaurants;
   
   -- Check if promotion exists for that restaurant
   SELECT * FROM promotions WHERE restaurant_id = 'YOUR_RESTAURANT_ID';
   ```

### Promo Code Not Applying
1. **Check Console for Errors**:
   - Look for validation errors
   - Check if RPC function is being called

2. **Test RPC Function Directly**:
   ```sql
   SELECT * FROM validate_promotion_code(
     'SAVE30',
     '426c2f81-1b10-4c79-82e8-09c1433f145a',
     '00000000-0000-0000-0000-000000000000',
     25.00
   );
   ```

3. **Check Promotion Status**:
   ```sql
   SELECT 
     code, 
     is_active,
     start_date <= now() as started,
     end_date >= now() as not_expired,
     used_count,
     total_usage_limit
   FROM promotions 
   WHERE code = 'SAVE30';
   ```

### Order Not Saving Promotion Data
1. **Check Checkout.tsx**:
   - Verify `appliedPromo` is being passed to order creation
   - Check console logs for order data

2. **Check Edge Function Logs** (for online payment):
   - Go to Supabase Dashboard > Edge Functions > Logs
   - Look for errors in `create_stripe_checkout` function

3. **Verify Database Schema**:
   ```sql
   -- Check if columns exist
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'orders' 
     AND column_name IN ('promotion_id', 'discount_amount', 'promo_code');
   ```

## 📊 Success Criteria

All tests should pass with:
- ✅ Promotions visible in UI
- ✅ Promo codes validate correctly
- ✅ Discounts calculate accurately
- ✅ Orders save promotion data
- ✅ Promotion usage tracked
- ✅ No console errors
- ✅ No database errors

## 🔍 Known Issues

1. **Promotions Not Showing**: Database is working correctly, but frontend may not be receiving data. Check browser console and network tab.

2. **Ambiguous Column Error**: ✅ FIXED in migration 00030. If you still see this error, please report with full error message.
