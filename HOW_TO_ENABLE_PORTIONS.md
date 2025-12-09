# How to Enable Portions for Menu Items

## Overview
This guide explains how restaurant owners can enable half/full portion options for their menu items, allowing customers to choose their preferred serving size.

---

## 🎯 What Are Portions?

Portions allow customers to order different serving sizes of the same dish:
- **Full Portion**: Standard serving size at full price
- **Half Portion**: Smaller serving at half the price

**Important**: Portions and Variants are **mutually exclusive**:
- Use **Portions** (`has_portions: true`) for simple Half/Full split
- Use **Variants** for different sizes with custom pricing (Small, Medium, Large)
- **Never use both** on the same item

### Common Use Cases for Portions
- **Biryani**: Full plate ($18) or Half plate ($9)
- **Curry Dishes**: Full serving or Half serving
- **Appetizers**: Regular or Small portion
- **Desserts**: Full or Half portion

### When to Use Variants Instead
- **Pizza**: Small (8"), Medium (12"), Large (16") - different prices
- **Beverages**: Small, Regular, Large - custom pricing
- **Combo Meals**: Different size combinations

---

## 📋 Prerequisites

Before enabling portions, ensure:
1. You have access to the restaurant owner dashboard
2. You have menu items already created
3. You understand your pricing strategy

---

## 🚀 Method 1: Enable via Dashboard (Recommended)

### Step 1: Navigate to Menu Management
```
Dashboard → Menu Management → Menu Items
```

### Step 2: Edit Menu Item
1. Find the item you want to enable portions for
2. Click the "Edit" button (pencil icon)
3. Scroll to the "Portion Settings" section

### Step 3: Enable Portions
1. Toggle the "Enable Portions" switch to ON
2. The system will automatically:
   - Set Full portion price = Base price
   - Set Half portion price = Base price ÷ 2

### Step 4: Save Changes
1. Click "Save" or "Update Item"
2. The item now supports portion selection

---

## 💻 Method 2: Enable via Database (Advanced)

### Using SQL
```sql
-- Enable portions for a specific item
UPDATE menu_items
SET has_portions = true
WHERE id = 'your-item-id';

-- Enable portions for all items in a category
UPDATE menu_items
SET has_portions = true
WHERE category_id = 'your-category-id';

-- Enable portions for all main course items
UPDATE menu_items
SET has_portions = true
WHERE category_id IN (
  SELECT id FROM menu_categories 
  WHERE name ILIKE '%main%' OR name ILIKE '%curry%'
);
```

### Using Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Select `menu_items` table
4. Find your item
5. Set `has_portions` column to `true`
6. Click Save

---

## 🎨 Method 3: Using Variants (Advanced Pricing)

For more control over pricing, use variants instead:

### Example: Custom Portion Pricing
```json
{
  "has_portions": false,
  "variants": [
    {
      "name": "Half",
      "price": 9.99,
      "description": "Perfect for one person"
    },
    {
      "name": "Full",
      "price": 17.99,
      "description": "Serves 2 people"
    },
    {
      "name": "Family",
      "price": 32.99,
      "description": "Serves 4-5 people"
    }
  ]
}
```

### When to Use Variants
- ✅ Non-standard pricing (not exactly half)
- ✅ More than 2 portion sizes
- ✅ Different descriptions for each size
- ✅ Special pricing strategies

### When to Use has_portions
- ✅ Simple half/full split
- ✅ Automatic half-price calculation
- ✅ Standard portion sizes
- ✅ Quick setup

---

## 📊 Pricing Examples

### Example 1: Simple Half/Full
```
Item: Chicken Biryani
Base Price: $18.00
has_portions: true

Result:
- Full: $18.00 (base price)
- Half: $9.00 (automatic calculation)
```

### Example 2: Custom Variants
```
Item: Margherita Pizza
Base Price: $18.00
has_portions: false
variants: [
  {"name": "Small (8\")", "price": 12.00},
  {"name": "Medium (12\")", "price": 18.00},
  {"name": "Large (16\")", "price": 24.00}
]

Result:
- Small: $12.00
- Medium: $18.00
- Large: $24.00
```

### Example 3: Portions vs Variants (Choose One)
```
❌ WRONG - Don't use both:
Item: Butter Chicken
Base Price: $16.00
has_portions: true
variants: [...]  // Don't do this!

✅ CORRECT - Use portions only:
Item: Butter Chicken
Base Price: $16.00
has_portions: true
variants: null

Result:
- Full: $16.00
- Half: $8.00

✅ CORRECT - Use variants only:
Item: Butter Chicken
Base Price: $16.00
has_portions: false
variants: [
  {"name": "Regular", "price": 16.00},
  {"name": "Extra Spicy", "price": 17.00},
  {"name": "Family Size", "price": 28.00}
]

Result:
- Regular: $16.00
- Extra Spicy: $17.00
- Family Size: $28.00
```

---

## ✅ Best Practices

### Do's ✅
- Enable portions for dishes that can be easily split
- Use consistent naming (Full/Half)
- Test the customer experience after enabling
- Consider your kitchen's ability to prepare half portions
- Update menu descriptions if needed

### Don'ts ❌
- Don't enable portions for items that can't be split (e.g., single burger)
- Don't use portions for beverages (use variants instead)
- Don't enable without informing kitchen staff
- Don't forget to test the ordering flow

---

## 🍽️ Recommended Items for Portions

### Great for Portions
- ✅ Rice dishes (Biryani, Fried Rice)
- ✅ Curry dishes
- ✅ Pasta dishes
- ✅ Noodle dishes
- ✅ Large appetizers
- ✅ Sharing platters

### Not Recommended
- ❌ Individual burgers
- ❌ Single sandwiches
- ❌ Beverages
- ❌ Pre-packaged items
- ❌ Set meals

---

## 🔄 Bulk Enable Portions

### Enable for Multiple Items at Once

#### Method 1: By Category
```sql
-- Enable portions for all items in "Main Course" category
UPDATE menu_items mi
SET has_portions = true
FROM menu_categories mc
WHERE mi.category_id = mc.id
  AND mc.name = 'Main Course';
```

#### Method 2: By Price Range
```sql
-- Enable portions for items priced $15 and above
UPDATE menu_items
SET has_portions = true
WHERE price >= 15.00;
```

#### Method 3: By Tags
```sql
-- Enable portions for items tagged as "shareable"
UPDATE menu_items
SET has_portions = true
WHERE 'shareable' = ANY(tags);
```

---

## 📱 Customer Experience

### What Customers See

#### Before Enabling Portions
```
[Chicken Biryani]
$18.00
[ADD] ← Adds directly to cart
```

#### After Enabling Portions
```
[Chicken Biryani]
$18.00
[ADD] ← Opens portion selection dialog

Dialog shows:
┌─────────────────────────┐
│ Choose Portion          │
│                         │
│ ◉ Full         $18.00  │
│ ○ Half          $9.00  │
│                         │
│ [Add Item - $18.00]    │
└─────────────────────────┘
```

---

## 🧪 Testing Your Changes

### Test Checklist
1. **Browse Menu**
   - [ ] Item displays correctly
   - [ ] Price shows base price

2. **Add to Cart**
   - [ ] Click ADD button
   - [ ] Portion dialog appears
   - [ ] Full is pre-selected
   - [ ] Half shows correct price (base ÷ 2)

3. **Select Portions**
   - [ ] Can select Full
   - [ ] Can select Half
   - [ ] Price updates in button
   - [ ] Visual feedback works

4. **Complete Order**
   - [ ] Item adds to cart with correct portion
   - [ ] Cart shows portion size
   - [ ] Checkout displays correctly
   - [ ] Order confirmation shows portion

---

## 🔧 Troubleshooting

### Issue 1: Portion Dialog Not Appearing
**Cause**: `has_portions` not set to true
**Solution**: 
```sql
UPDATE menu_items 
SET has_portions = true 
WHERE id = 'your-item-id';
```

### Issue 2: Wrong Half Price
**Cause**: Using variants instead of has_portions
**Solution**: Either:
- Remove variants and use has_portions, OR
- Set correct half price in variants

### Issue 3: Can't Enable Portions in Dashboard
**Cause**: UI not updated or permissions issue
**Solution**: Use SQL method or contact support

### Issue 4: Portions Not Saving to Order
**Cause**: Frontend not passing portion data
**Solution**: Check MenuBrowsing.tsx implementation

---

## 📊 Analytics & Reporting

### Track Portion Preferences
```sql
-- See which portions are most popular
SELECT 
  portion_size,
  COUNT(*) as order_count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM order_items
WHERE menu_item_id = 'your-item-id'
  AND portion_size IS NOT NULL
GROUP BY portion_size
ORDER BY order_count DESC;
```

### Example Output
```
portion_size | order_count | percentage
-------------+-------------+-----------
Full         | 150         | 65.22
Half         | 80          | 34.78
```

---

## 💡 Pro Tips

### Tip 1: Seasonal Portions
Enable portions during lunch hours when customers want smaller servings:
```sql
-- Can be automated with a scheduled job
UPDATE menu_items
SET has_portions = true
WHERE category_id IN (SELECT id FROM menu_categories WHERE name = 'Lunch Specials');
```

### Tip 2: Combo with Promotions
Offer discounts on full portions:
```sql
-- Create promotion for full portions
INSERT INTO promotions (restaurant_id, title, discount_type, discount_value)
VALUES ('your-restaurant-id', 'Full Portion Special', 'percentage', 10);
```

### Tip 3: Kitchen Display
Ensure kitchen staff can see portion size:
- Order tickets should clearly show "HALF" or "FULL"
- Use different colored labels if possible
- Train staff on portion sizes

---

## 📈 Business Benefits

### Increased Revenue
- Customers who want smaller portions can now order
- Previously lost sales are captured
- Higher order frequency

### Better Customer Satisfaction
- Flexibility in portion sizes
- Reduced food waste
- Better value perception

### Operational Insights
- Track which items are ordered as half portions
- Adjust menu based on preferences
- Optimize ingredient purchasing

---

## 🎓 Training Your Staff

### Kitchen Staff
1. Explain half portion sizes
2. Show how orders will appear
3. Practice preparing half portions
4. Ensure consistency

### Front-of-House Staff
1. Explain the feature to customers
2. Recommend appropriate portions
3. Handle special requests
4. Upsell when appropriate

---

## 📞 Support

### Need Help?
- Check documentation: `PORTION_SELECTION_IMPROVEMENT.md`
- View visual guide: `PORTION_SELECTION_VISUAL_GUIDE.md`
- Test guide: `PORTION_SELECTION_QUICK_TEST.md`
- Contact technical support

---

## 🔄 Disabling Portions

### If You Need to Disable
```sql
-- Disable portions for a specific item
UPDATE menu_items
SET has_portions = false
WHERE id = 'your-item-id';

-- Disable portions for all items
UPDATE menu_items
SET has_portions = false;
```

**Note**: Existing orders with portions will still display correctly.

---

## ✨ Summary

Enabling portions is simple:
1. Set `has_portions = true` on menu item
2. System automatically calculates half price
3. Customers see clean portion selection dialog
4. Orders include selected portion size

**Result**: Better customer experience and increased sales! 🎉
