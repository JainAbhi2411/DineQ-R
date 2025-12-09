# Half/Full Portion Feature - Quick Reference Card

## 🎯 At a Glance

### What It Does
Allows restaurants to offer multiple portion sizes (Half/Full) for menu items with different pricing for each option.

### Who Benefits
- **Restaurant Owners**: Increase sales, reduce waste, offer flexibility
- **Customers**: Better value, portion control, more choices

---

## 🔧 Setup (Restaurant Owner)

### Enable Portions - 3 Steps
```
1. Edit Menu Item → Pricing Tab
2. Toggle "Enable Half/Full Portions" ON
3. Add Variants:
   - Name: "Half" | Price: $10
   - Name: "Full" | Price: $18
```

### Example
```
Item: Butter Chicken
✓ Has Portions Enabled

Variants:
├─ Half  → $12.00 (1 person)
└─ Full  → $20.00 (2-3 people)
```

---

## 🛒 Ordering (Customer)

### How to Order
```
1. Click "Add to Cart"
2. Dialog appears → Select portion
3. Choose Half or Full
4. Click "Add to Cart"
```

### Cart Display
```
🛒 Your Cart
├─ Butter Chicken [Half] × 1 = $12.00
├─ Naan Bread [Full] × 2 = $8.00
└─ Total: $20.00
```

---

## 💾 Database Schema

### Tables Modified
```sql
-- menu_items
has_portions BOOLEAN DEFAULT false

-- order_items
portion_size TEXT NULL
variant_name TEXT NULL
```

### Query Portion Stats
```sql
SELECT * FROM get_portion_stats('item-uuid-here');
```

---

## 🎨 UI Components

### Owner Side
| Component | Location | Purpose |
|-----------|----------|---------|
| Toggle Switch | Pricing Tab | Enable/disable portions |
| Variant Input | Pricing Tab | Add portion options |
| Variant List | Pricing Tab | View all portions |

### Customer Side
| Component | Location | Purpose |
|-----------|----------|---------|
| Portion Dialog | On Add to Cart | Select portion size |
| Portion Badge | Cart/Checkout | Show selected portion |
| Price Display | Dialog/Cart | Show portion price |

---

## 📊 Key Features

### ✅ Implemented
- [x] Enable/disable per menu item
- [x] Multiple portion variants
- [x] Individual pricing per portion
- [x] Portion selection dialog
- [x] Cart differentiation
- [x] Order tracking
- [x] Analytics function
- [x] Backward compatibility

### 🔮 Future Enhancements
- [ ] Bulk enable portions
- [ ] Portion analytics dashboard
- [ ] Seasonal pricing
- [ ] Inventory integration

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Portion dialog doesn't appear
- **Check**: Is `has_portions` enabled?
- **Check**: Are variants added?

**Issue**: Wrong price in cart
- **Check**: Variant price set correctly?
- **Check**: Using `selectedVariant?.price`?

**Issue**: Can't add both portions
- **Solution**: They should be separate cart items

---

## 📝 Code Snippets

### Check if Item Has Portions
```typescript
if (item.has_portions && item.variants?.length > 0) {
  // Show portion selection
}
```

### Add to Cart with Portion
```typescript
addToCart(menuItem, selectedVariant);
```

### Calculate Price
```typescript
const price = item.selectedVariant?.price || item.menu_item.price;
```

### Display Portion Badge
```tsx
{item.portionSize && (
  <Badge variant="secondary">{item.portionSize}</Badge>
)}
```

---

## 🎓 Best Practices

### Pricing
- Half = 50-60% of full price
- Full = Standard price
- Make half portions attractive

### Naming
- Keep it simple: "Half" / "Full"
- Or creative: "Solo" / "Sharing"
- Be consistent across menu

### When to Use
✅ Main courses, rice dishes, expensive items
❌ Beverages, small appetizers, desserts

---

## 📞 Quick Help

### Files to Check
```
Database:
└─ supabase/migrations/00012_add_portion_size_to_order_items.sql

Types:
└─ src/types/types.ts

Components:
├─ src/components/owner/EnhancedMenuItemForm.tsx
├─ src/pages/customer/MenuBrowsing.tsx
└─ src/pages/customer/Checkout.tsx

API:
└─ src/db/api.ts
```

### Key Functions
```typescript
// MenuBrowsing.tsx
addToCart(item, variant?)
removeFromCart(itemId, portionSize?)
getTotalAmount()

// Checkout.tsx
getTotalAmount()
handlePlaceOrder()
```

---

## 🚦 Status Indicators

### Feature Status
- ✅ Database: Ready
- ✅ Types: Updated
- ✅ UI: Implemented
- ✅ API: Updated
- ✅ Testing: Passed
- ✅ Documentation: Complete

### Compatibility
- ✅ Backward compatible
- ✅ Existing orders unaffected
- ✅ Optional feature
- ✅ No breaking changes

---

## 📈 Success Metrics

### Track These
1. **Adoption Rate**: % of items with portions enabled
2. **Usage Rate**: % of orders with portion selections
3. **Revenue Impact**: Sales from half vs full
4. **Customer Satisfaction**: Feedback on portion options

### SQL Query Example
```sql
-- Get portion distribution
SELECT 
  portion_size,
  COUNT(*) as order_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM order_items
WHERE portion_size IS NOT NULL
GROUP BY portion_size;
```

---

## 🎉 Quick Wins

### For Restaurants
1. Enable portions on top 5 sellers
2. Price half at 55% of full
3. Promote in menu descriptions
4. Monitor sales for 1 week
5. Adjust based on data

### For Customers
1. Try half portions for new dishes
2. Mix half and full for variety
3. Share full portions with friends
4. Save money with half portions
5. Enjoy more menu items

---

**Version**: 1.0  
**Last Updated**: 2025-11-30  
**Status**: 🟢 Production Ready
