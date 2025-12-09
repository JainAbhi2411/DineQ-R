# Half/Full Portion Feature - User Guide

## 🍽️ Quick Start Guide

### For Restaurant Owners

#### Step 1: Enable Portions for a Menu Item
1. Go to **Menu Management** page
2. Click **"Add Item"** or **Edit** an existing item
3. Navigate to the **"Pricing"** tab
4. Find the **"Enable Half/Full Portions"** toggle
5. Switch it **ON**

#### Step 2: Add Portion Variants
Once enabled, you'll see a helpful hint:
> 💡 Add "Half" and "Full" variants below with their respective prices

1. In the **Price Variants** section:
   - **Name**: Enter "Half" (or "Small", "Regular", etc.)
   - **Price**: Enter the price for half portion (e.g., 10.00)
   - Click **"Add"**

2. Add the full portion:
   - **Name**: Enter "Full" (or "Large", "Family", etc.)
   - **Price**: Enter the price for full portion (e.g., 18.00)
   - Click **"Add"**

3. Click **"Save"** to apply changes

#### Example Configuration
```
Menu Item: Chicken Biryani
Base Price: $18.00
Has Portions: ✓ Enabled

Variants:
- Half: $10.00 (Serves 1 person)
- Full: $18.00 (Serves 2 people)
```

---

### For Customers

#### Step 1: Browse Menu
- View the restaurant menu as usual
- Items with portion options look the same initially

#### Step 2: Add Item to Cart
1. Click **"Add to Cart"** on any menu item
2. **If the item has portions enabled**, a dialog will appear:
   
   ```
   ┌─────────────────────────────────────┐
   │  Choose Portion Size                │
   │  Select your preferred portion      │
   │                                     │
   │  ○ Half                    $10.00  │
   │    Half portion                     │
   │                                     │
   │  ○ Full                    $18.00  │
   │    Full portion                     │
   │                                     │
   │  [Cancel]  [Add to Cart]           │
   └─────────────────────────────────────┘
   ```

3. Select your preferred portion size
4. Click **"Add to Cart"**

#### Step 3: View Cart
Your cart will show:
```
Chicken Biryani [Half]
$10.00 each
Quantity: 1
Total: $10.00
```

#### Step 4: Add Different Portions
You can add both half and full portions of the same item:
```
Cart:
- Chicken Biryani [Half] × 1 = $10.00
- Chicken Biryani [Full] × 2 = $36.00
```

#### Step 5: Checkout
The checkout page displays portion information clearly:
```
Order Summary:
Chicken Biryani (Half)
$10.00 × 1 = $10.00

Chicken Biryani (Full)
$18.00 × 2 = $36.00

Total: $46.00
```

---

## 🎯 Use Cases

### 1. Solo Diner
**Scenario**: Customer dining alone wants a smaller portion
- Selects **Half** portion
- Saves money and reduces waste
- Gets appropriate serving size

### 2. Family Dining
**Scenario**: Family wants to try multiple dishes
- Orders **Half** portions of 4 different items
- Enjoys variety without over-ordering
- Better value than ordering 2 full portions

### 3. Mixed Orders
**Scenario**: Group with different appetites
- Some order **Half** portions
- Others order **Full** portions
- Everyone gets what they want

### 4. Budget-Conscious Customers
**Scenario**: Customer wants to control spending
- Chooses **Half** portions for expensive items
- **Full** portions for favorites
- Optimizes budget while enjoying meal

---

## 💡 Best Practices

### For Restaurant Owners

#### When to Enable Portions
✅ **Good candidates:**
- Main courses (biryani, pasta, curry)
- Sharing platters
- Rice and bread items
- Expensive dishes

❌ **Not recommended:**
- Beverages
- Desserts (unless very large)
- Appetizers (already small)
- Set meals/combos

#### Pricing Strategy
1. **Half Portion**: 50-60% of full price
   - Example: Full $20 → Half $10-12
   
2. **Full Portion**: Standard price
   - Example: Full $20

3. **Value Perception**: Make half portions attractive
   - Don't price half at 75% of full
   - Customers should feel they're getting value

#### Naming Conventions
**Standard Options:**
- Half / Full
- Small / Large
- Regular / Family
- Solo / Sharing

**Creative Options:**
- Personal / Party
- Light / Hearty
- Taste / Feast
- Single / Double

### For Customers

#### Choosing Portions
**Select Half When:**
- Trying new dishes
- Dining solo
- Ordering multiple items
- Watching budget
- Smaller appetite

**Select Full When:**
- Sharing with others
- Very hungry
- It's your favorite dish
- Better value per serving
- Taking leftovers home

---

## 🔍 Technical Details

### Database Storage
Each order item stores:
- `portion_size`: "Half" or "Full" (or custom name)
- `variant_name`: Same as portion_size
- `price`: Actual price paid for that portion

### Cart Behavior
- Same item with different portions = separate cart entries
- Each entry has its own quantity counter
- Prices calculated based on selected portion

### Order History
- Past orders show portion information
- Analytics track portion preferences
- Helps restaurants optimize menu

---

## ❓ FAQ

### For Restaurant Owners

**Q: Can I change portion prices after creating them?**
A: Yes, edit the menu item and update the variant prices. Existing orders keep their original prices.

**Q: Can I have more than 2 portions?**
A: Yes! Add as many variants as needed (Small, Medium, Large, Extra Large, etc.)

**Q: What if I disable portions later?**
A: New orders won't show portion options, but existing orders with portions remain unchanged.

**Q: Can I see which portions are more popular?**
A: Yes, use the `get_portion_stats()` database function for analytics.

### For Customers

**Q: Can I order both half and full of the same item?**
A: Yes! They appear as separate items in your cart.

**Q: What if I accidentally select the wrong portion?**
A: Remove the item from cart and add it again with the correct portion.

**Q: Do half portions take less time to prepare?**
A: Preparation time is usually the same, but check with the restaurant.

**Q: Can I change portion size after adding to cart?**
A: Remove the item and add it again with the desired portion.

---

## 🎨 UI Elements

### Owner Interface
- **Toggle Switch**: Enable/disable portions
- **Variant Input Fields**: Name and price
- **Add Button**: Add new variant
- **Variant List**: Shows all configured portions
- **Remove Button**: Delete unwanted variants

### Customer Interface
- **Portion Dialog**: Modal with radio buttons
- **Portion Badge**: Shows selected portion in cart
- **Price Display**: Clear pricing for each option
- **Selection Indicator**: Radio button for current choice

---

## 📊 Analytics Insights

### Available Metrics
1. **Portion Preference Rate**
   - % of customers choosing half vs full
   
2. **Revenue Impact**
   - Total revenue from half portions
   - Total revenue from full portions
   
3. **Order Patterns**
   - Items most ordered as half
   - Items most ordered as full
   
4. **Customer Behavior**
   - Average portions per order
   - Mixed portion orders

---

## 🚀 Tips for Success

### Restaurant Owners
1. **Start Small**: Enable portions for 3-5 popular items first
2. **Monitor Feedback**: Ask customers about portion sizes
3. **Adjust Pricing**: Fine-tune based on sales data
4. **Promote Feature**: Mention portion options in menu descriptions
5. **Train Staff**: Ensure staff understand the portion system

### Customers
1. **Ask Questions**: Inquire about portion sizes if unsure
2. **Start with Half**: Try half portions when exploring new dishes
3. **Mix and Match**: Combine half and full portions strategically
4. **Share Wisely**: Full portions are great for sharing
5. **Save Money**: Use half portions to try more variety

---

## 📞 Support

For technical issues or questions:
- Check the main documentation
- Review the implementation guide
- Contact system administrator

---

**Last Updated**: 2025-11-30
**Feature Version**: 1.0
**Status**: ✅ Production Ready
