# Half Portion Feature - Testing Guide

## Quick Test Checklist

### ✅ Database Verification
- [x] Crispy Spring Rolls has `has_portions = true`
- [x] Variants array contains Half ($4.45) and Full ($8.99) options
- [x] Item is available and in Appetizers category

### 🧪 Customer Experience Testing

#### Test 1: Menu Display
**Steps:**
1. Navigate to the restaurant menu as a customer
2. Scroll to the "Appetizers" category
3. Find "Crispy Spring Rolls"

**Expected Results:**
- ✅ Price shows "From $4.45" (not just "$8.99")
- ✅ "From" text is in smaller, muted color
- ✅ Works in both Grid and Menu view modes
- ✅ Works on both mobile and desktop layouts

#### Test 2: Portion Selection Dialog
**Steps:**
1. Click "Add" or "ADD TO CART" on Crispy Spring Rolls
2. Observe the dialog that appears

**Expected Results:**
- ✅ Dialog title: "Choose Portion"
- ✅ Two options displayed:
  - **Half** - $4.45 (Half portion)
  - **Full** - $8.99 (Full portion)
- ✅ Full portion is selected by default (highlighted with primary color)
- ✅ Clicking on an option selects it
- ✅ Selected option has colored border and background
- ✅ Prices are clearly visible on the right side

#### Test 3: Add Half Portion to Cart
**Steps:**
1. Open portion selection dialog
2. Select "Half" option
3. Click "Add to Cart"
4. Open cart

**Expected Results:**
- ✅ Toast notification: "Crispy Spring Rolls (Half) added to cart"
- ✅ Cart shows "Crispy Spring Rolls"
- ✅ Portion size displayed: "(Half)"
- ✅ Price: $4.45
- ✅ Quantity: 1
- ✅ Cart total: $4.45

#### Test 4: Add Full Portion to Cart
**Steps:**
1. Open portion selection dialog
2. Keep "Full" selected (default)
3. Click "Add to Cart"
4. Open cart

**Expected Results:**
- ✅ Toast notification: "Crispy Spring Rolls (Full) added to cart"
- ✅ Cart shows "Crispy Spring Rolls"
- ✅ Portion size displayed: "(Full)"
- ✅ Price: $8.99
- ✅ Quantity: 1
- ✅ Cart total: $8.99

#### Test 5: Multiple Portions in Cart
**Steps:**
1. Add 1x Half portion ($4.45)
2. Add 1x Full portion ($8.99)
3. Open cart

**Expected Results:**
- ✅ Two separate line items in cart:
  - Crispy Spring Rolls (Half) - $4.45 x 1 = $4.45
  - Crispy Spring Rolls (Full) - $8.99 x 1 = $8.99
- ✅ Cart total: $13.44
- ✅ Item count: 2 items

#### Test 6: Quantity Adjustments
**Steps:**
1. Add Half portion to cart
2. Increase quantity to 3
3. Check cart total

**Expected Results:**
- ✅ Quantity shows: 3
- ✅ Line total: $4.45 x 3 = $13.35
- ✅ Cart total updates correctly

#### Test 7: Checkout Process
**Steps:**
1. Add Half portion to cart
2. Proceed to checkout
3. Complete order
4. Check order details

**Expected Results:**
- ✅ Order summary shows correct portion and price
- ✅ Order is created successfully
- ✅ Order items table stores:
  - `portion_size`: "half"
  - `variant_name`: "Half"
  - `price`: 4.45

#### Test 8: Mixed Cart
**Steps:**
1. Add Crispy Spring Rolls (Half) - $4.45
2. Add another item without portions (e.g., Caesar Salad - $11.99)
3. Add Crispy Spring Rolls (Full) - $8.99
4. Check cart

**Expected Results:**
- ✅ All items display correctly
- ✅ Portion items show portion size
- ✅ Non-portion items show normally
- ✅ Total: $4.45 + $11.99 + $8.99 = $25.43

### 📱 Responsive Design Testing

#### Mobile View (< 768px)
- ✅ Portion selection dialog is full-screen and easy to use
- ✅ Radio buttons are large and touch-friendly
- ✅ Prices are clearly visible
- ✅ "From" price indicator works in horizontal card layout

#### Desktop View (≥ 1280px)
- ✅ Portion selection dialog is centered modal
- ✅ Grid view shows "From" price correctly
- ✅ Menu view shows "From" price correctly
- ✅ All interactions work with mouse

### 🔍 Edge Cases Testing

#### Test 9: Default Selection
**Steps:**
1. Open portion dialog
2. Immediately click "Add to Cart" without changing selection

**Expected Results:**
- ✅ Full portion is added (default)
- ✅ Price: $8.99

#### Test 10: Dialog Cancellation
**Steps:**
1. Open portion dialog
2. Click outside dialog or press ESC
3. Try adding item again

**Expected Results:**
- ✅ Dialog closes without adding to cart
- ✅ Can reopen dialog and select portion
- ✅ Previous selection is reset to Full

#### Test 11: Rapid Additions
**Steps:**
1. Quickly add Half portion 3 times
2. Check cart

**Expected Results:**
- ✅ Either 3 separate items OR 1 item with quantity 3
- ✅ Total: $4.45 x 3 = $13.35
- ✅ No duplicate entries with wrong prices

### 🎨 Visual Testing

#### UI Elements
- ✅ "From" text is subtle but visible
- ✅ Portion options have clear visual hierarchy
- ✅ Selected option is obviously highlighted
- ✅ Prices are in primary color and bold
- ✅ Descriptions are in muted color
- ✅ Radio buttons are properly aligned

#### Animations
- ✅ Dialog opens smoothly
- ✅ Selection changes have visual feedback
- ✅ Toast notifications appear correctly

### 🔧 Owner Dashboard Testing

#### Test 12: View Menu Item
**Steps:**
1. Login as owner
2. Go to Menu Management
3. Find Crispy Spring Rolls
4. Click Edit

**Expected Results:**
- ✅ "Enable Half/Full Portions" toggle is ON
- ✅ Variants section shows both portions
- ✅ Can view but not accidentally modify

#### Test 13: Add New Item with Portions
**Steps:**
1. Create new menu item
2. Enable "Half/Full Portions"
3. Add variants with custom prices
4. Save

**Expected Results:**
- ✅ Item is created with portions enabled
- ✅ Variants are saved correctly
- ✅ Item appears in customer menu with "From" price

### 📊 Database Testing

#### Test 14: Order Data Integrity
**Steps:**
1. Create order with Half portion
2. Query database

**SQL:**
```sql
SELECT 
  oi.menu_item_name,
  oi.price,
  oi.portion_size,
  oi.variant_name,
  oi.quantity
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE oi.menu_item_name = 'Crispy Spring Rolls'
  AND oi.portion_size IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 1;
```

**Expected Results:**
- ✅ `portion_size`: "half" or "full"
- ✅ `variant_name`: "Half" or "Full"
- ✅ `price`: 4.45 or 8.99 (matches variant)

### 🐛 Known Issues & Limitations

#### Current Behavior
- ✅ Old orders (before feature) have `null` portion_size - This is expected
- ✅ Each portion size creates separate cart item - This is by design
- ✅ Base price remains $8.99 - Variants override this

#### Not Issues
- Existing orders without portion data - These were created before the feature
- Full portion price matches base price - This is intentional

### 📈 Success Metrics

**Feature is working correctly if:**
1. ✅ Customers can see "From $4.45" on menu
2. ✅ Portion selection dialog appears when adding item
3. ✅ Correct prices are used for each portion
4. ✅ Cart calculates totals accurately
5. ✅ Orders store portion information
6. ✅ No errors in console
7. ✅ Works on all devices and screen sizes

### 🚀 Quick Verification Commands

```sql
-- Verify menu item configuration
SELECT name, price, has_portions, variants 
FROM menu_items 
WHERE name = 'Crispy Spring Rolls';

-- Check recent orders with portions
SELECT 
  o.id,
  oi.menu_item_name,
  oi.portion_size,
  oi.price,
  o.total_amount,
  o.created_at
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE oi.portion_size IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 5;

-- Get portion statistics
SELECT 
  portion_size,
  COUNT(*) as order_count,
  SUM(quantity) as total_quantity,
  SUM(price * quantity) as total_revenue
FROM order_items
WHERE menu_item_name = 'Crispy Spring Rolls'
  AND portion_size IS NOT NULL
GROUP BY portion_size;
```

## Test Results Template

```
Date: ___________
Tester: ___________

Menu Display: ☐ Pass ☐ Fail
Portion Dialog: ☐ Pass ☐ Fail
Half Portion Cart: ☐ Pass ☐ Fail
Full Portion Cart: ☐ Pass ☐ Fail
Multiple Portions: ☐ Pass ☐ Fail
Quantity Adjust: ☐ Pass ☐ Fail
Checkout: ☐ Pass ☐ Fail
Mobile View: ☐ Pass ☐ Fail
Desktop View: ☐ Pass ☐ Fail

Notes:
_________________________________
_________________________________
_________________________________
```

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify database configuration
3. Clear browser cache and reload
4. Check network tab for API responses
5. Review HALF_PORTION_IMPLEMENTATION.md for technical details
