# Sample Menu Data Added

## Summary
Added comprehensive sample menu data to the database for UI testing and demonstration purposes.

## Data Statistics

### Categories Added (6 total)
1. **Appetizers** - 5 items
2. **Soups & Salads** - 4 items
3. **Main Course** - 9 items (including 1 existing item)
4. **Desserts** - 5 items
5. **Beverages** - 5 items
6. **Specials** - 3 items

**Total: 31 menu items across 6 categories**

## Sample Items by Category

### Appetizers ($5.99 - $13.99)
- Crispy Spring Rolls - $8.99 ⭐ Bestseller
- Buffalo Wings - $12.99 ⭐ Bestseller
- Mozzarella Sticks - $9.99
- Garlic Bread - $5.99
- Calamari Rings - $13.99

### Soups & Salads ($7.99 - $11.99)
- Caesar Salad - $11.99 ⭐ Bestseller
- Tomato Basil Soup - $7.99
- Greek Salad - $10.99
- French Onion Soup - $8.99

### Main Course ($15.99 - $35.99)
- Grilled Salmon - $24.99 ⭐ Bestseller
- Beef Tenderloin Steak - $35.99 ⭐ Bestseller
- Chicken Alfredo Pasta - $18.99 ⭐ Bestseller
- Vegetable Stir Fry - $15.99
- BBQ Ribs - $26.99 ⭐ Bestseller
- Margherita Pizza - $16.99
- Lamb Curry - $22.99
- Seafood Paella - $28.99 ⭐ Bestseller

### Desserts ($7.99 - $9.99)
- Chocolate Lava Cake - $9.99 ⭐ Bestseller
- Tiramisu - $8.99 ⭐ Bestseller
- New York Cheesecake - $8.99
- Apple Pie - $7.99
- Crème Brûlée - $9.99

### Beverages ($3.99 - $10.99)
- Fresh Orange Juice - $5.99
- Iced Coffee - $4.99
- Mojito - $10.99
- Craft Beer - $7.99
- Sparkling Water - $3.99

### Specials ($32.99 - $65.99)
- Chef's Tasting Menu - $65.99 ⭐ Bestseller
- Lobster Thermidor - $45.99 ⭐ Bestseller
- Wagyu Beef Burger - $32.99 ⭐ Bestseller

## Item Features

All items include:
- ✅ Detailed descriptions
- ✅ Accurate pricing (various price points for testing)
- ✅ Preparation time estimates
- ✅ Calorie information
- ✅ Customer ratings (4.2 - 5.0 stars)
- ✅ Dietary information (vegetarian, vegan, gluten-free)
- ✅ Spice level indicators (where applicable)
- ✅ Bestseller badges (15 items marked as bestsellers)

## Testing Currency Formatting

The menu includes items at various price points to test currency formatting:
- **Low range**: $3.99 - $9.99 (beverages, appetizers, desserts)
- **Mid range**: $10.99 - $28.99 (salads, main courses)
- **High range**: $32.99 - $65.99 (premium specials)

This variety ensures the currency formatter works correctly across all price ranges.

## How to View the Data

1. **Customer View**:
   - Navigate to `/customer/menu`
   - Browse through all categories
   - Add items to cart to see price calculations

2. **Owner View**:
   - Navigate to `/owner/menu`
   - View and manage all menu items
   - Edit prices to test currency formatting updates

3. **Test Currency Changes**:
   - Go to `/owner/settings`
   - Change currency from USD to EUR, GBP, or JPY
   - Navigate back to menu pages
   - Verify all prices display with correct currency symbol

## Next Steps

You can now:
1. ✅ Test the menu browsing UI with real data
2. ✅ Verify currency formatting across different price ranges
3. ✅ Test the cart and checkout flow with multiple items
4. ✅ Create orders to test order management features
5. ✅ Test analytics with order data
6. ✅ Verify the global currency settings work correctly

## Notes

- All items are marked as available
- No images are included (image_url is null)
- Items can be edited or deleted through the owner menu management interface
- Additional items can be added through the UI or database
