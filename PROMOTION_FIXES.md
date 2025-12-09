# Promotion System Fixes - Summary

## 🎯 Quick Status

| Issue | Status | Action Required |
|-------|--------|-----------------|
| Ambiguous column error when applying promo code | ✅ **FIXED** | None - ready to test |
| Promotions not showing in "Available Offers" | ⚠️ **Needs Debug** | Check browser console |
| Offers display style | ✅ **UPDATED** | Zomato-style compact cards |

## ✅ Recent Updates

### UI/UX Improvements
**Changed offers display to Zomato-style compact cards**:
- ✅ Replaced large gradient cards with compact horizontal scrollable cards
- ✅ Simplified design with icon + discount text + summary
- ✅ More offers visible at once (up to 10 instead of 5)
- ✅ Cleaner, more modern look similar to Zomato
- ✅ Updated modal to show compact offer cards instead of large cards

## ✅ Issues Fixed

### 1. "Column reference 'promotion_id' is ambiguous" Error - **FIXED**
**Problem**: When applying a promo code, the system threw an error: `column reference 'promotion_id' is ambiguous`

**Root Cause**: The `validate_promotion_code` RPC function had an ambiguous column reference in the per-customer usage check query. PostgreSQL couldn't determine if `promotion_id` referred to the table column or a potential variable.

**Solution**: Updated the function to use explicit table aliases:
```sql
-- Before (ambiguous)
FROM promotion_usage
WHERE promotion_id = v_promotion.id

-- After (explicit)
FROM promotion_usage pu
WHERE pu.promotion_id = v_promotion.id
```

**Migration**: `00030_fix_validate_promotion_code_ambiguous_column.sql`

**Test Result**: ✅ Function now works correctly. Test with code 'SAVE30' on $25 order returns $4 discount (30% capped at max_discount).

---

### 2. Promotions Not Showing in "Available Offers" - **NEEDS FRONTEND DEBUGGING**
**Status**: ✅ Database query is working correctly. Promotion is active and should be visible.

**Root Cause Analysis**:
- ✅ Database has active promotion (SAVE30)
- ✅ Promotion dates are valid (started: true, not_expired: true)
- ✅ Query returns promotion correctly
- ⚠️ **Possible Issue**: Frontend may not be receiving or displaying the data

**What to Check**:
1. **Browser Console**: Open browser console (F12) and look for:
   - `[MenuBrowsing] Loaded promotions:` - Should show array with promotion data
   - Any JavaScript errors that might prevent rendering
   
2. **Network Tab**: Check if the API call to fetch promotions is successful:
   - Look for a request to `/rest/v1/promotions`
   - Check if response contains the promotion data
   
3. **Restaurant ID**: Verify you're viewing the correct restaurant:
   - The promotion is for restaurant ID: `426c2f81-1b10-4c79-82e8-09c1433f145a`
   - Check the URL or console logs to confirm the restaurant ID matches

4. **Component Rendering**: The OffersBanner component should render when `promotions.length > 0`
   - If promotions array is empty, check why the API call failed
   - If promotions array has data but banner doesn't show, check OffersBanner component

**Database Verification**:
```sql
-- Check active promotions
SELECT id, code, title, discount_type, discount_value, start_date, end_date, is_active
FROM promotions 
WHERE restaurant_id = 'YOUR_RESTAURANT_ID'
  AND is_active = true
  AND start_date <= now()
  AND end_date >= now();
```

**Quick Test**:
Run this in browser console while on the menu page:
```javascript
// Check if promotions are loaded
console.log('Promotions:', window.location.pathname);
// Look for React DevTools to inspect component state
```

### 2. "Column reference 'promotion_id' is ambiguous" Error ✅ FIXED
**Root Cause**: The `validate_promotion_code` RPC function had an ambiguous column reference. When checking per-customer usage limits, the query referenced `promotion_id` without specifying the table name, causing PostgreSQL to be unsure if it referred to the table column or a potential variable.

**Solution**: Updated the function to use explicit table aliases (e.g., `pu.promotion_id` instead of just `promotion_id`).

**Fixes Applied**:
1. ✅ **FIXED AMBIGUOUS COLUMN ERROR**: Updated `validate_promotion_code` RPC function in migration 00030 to use explicit table aliases

2. ✅ Added promotion tracking fields to orders table:
   - `promotion_id` (uuid, references promotions)
   - `discount_amount` (numeric)
   - `promo_code` (text)

3. ✅ Updated Checkout.tsx to pass promotion data when creating orders (both COC and online payment)

4. ✅ Updated create_stripe_checkout Edge Function to:
   - Accept promotion data in request
   - Save promotion fields to orders table
   - Record promotion usage in promotion_usage table
   - Apply discount to Stripe checkout session

5. ✅ Updated TypeScript types to include new promotion fields in Order interface

**The ambiguous column error is now fixed!** You should be able to apply promo codes without any errors.

## Testing Steps

### Test Promotion Display
1. Navigate to the menu browsing page
2. Check if the "Available Offers" banner appears
3. Click "View Available Offers & Deals"
4. Verify promotions are listed in the modal

### Test Promo Code Application
1. Add items to cart (ensure total meets minimum order amount)
2. Click "Apply Promo Code"
3. Enter code: `SAVE30`
4. Click "Apply"
5. Verify discount is applied to cart total
6. Proceed to checkout
7. Complete order (COC or online payment)
8. Verify order is created with promotion data

### Verify Database Records
After placing an order with a promo code:
```sql
-- Check order has promotion data
SELECT id, total_amount, discount_amount, promo_code, promotion_id
FROM orders 
WHERE promo_code IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- Check promotion usage was recorded
SELECT pu.*, p.code, p.title
FROM promotion_usage pu
JOIN promotions p ON pu.promotion_id = p.id
ORDER BY pu.used_at DESC
LIMIT 5;
```

## Files Modified

1. **supabase/migrations/00029_add_promotion_fields_to_orders.sql**
   - Added promotion tracking columns to orders table

2. **src/types/types.ts**
   - Updated Order interface with promotion fields

3. **src/pages/customer/Checkout.tsx**
   - Added promotion data to COC payment order creation
   - Added promotion data to Stripe checkout request

4. **supabase/functions/create_stripe_checkout/index.ts**
   - Added promotion fields to CheckoutRequest interface
   - Save promotion data when creating orders
   - Record promotion usage
   - Apply discount to Stripe session

## Current Promotion in Database

```
Code: SAVE30
Title: 30% off on orders above $19
Type: PERCENTAGE
Value: 30%
Min Order: $7
Max Discount: $4
Start: 2025-12-06 18:30:00 UTC
End: 2025-12-07 18:29:59 UTC
Status: Active
Restaurant ID: 426c2f81-1b10-4c79-82e8-09c1433f145a
```

**Example**: For a $25 order, the discount would be 30% = $7.50, but capped at max_discount of $4.

## Next Steps

1. **Test the promotion display** - Check browser console for any errors
2. **Test promo code application** - Try applying SAVE30 to an order
3. **Check for ambiguous column errors** - If you see this error, provide the full error message and stack trace
4. **Verify order creation** - Ensure orders are created with promotion data

## Debugging Tips

### Enable Detailed Logging
The code already has console.log statements. Check browser console for:
- `[MenuBrowsing] Loaded promotions:` - Shows fetched promotions
- `[promotionApi] Fetching active promotions` - Shows API calls
- `[promotionApi] Query result:` - Shows database query results

### Common Issues
1. **Promotions not showing**: Check if restaurant_id matches
2. **Promo code not applying**: Check minimum order amount
3. **Ambiguous column error**: Provide full error message for specific fix
4. **Order not saving promotion**: Check browser console for errors during checkout
