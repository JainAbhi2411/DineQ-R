# Half Portion Feature Implementation

## Overview
The half portion feature has been successfully implemented for the Crispy Spring Rolls menu item. Customers can now choose between half and full portions when ordering, with accurate pricing from the database.

## Database Configuration

### Menu Item: Crispy Spring Rolls
- **Full Portion Price**: $8.99
- **Half Portion Price**: $4.45
- **Has Portions Enabled**: Yes

### Database Structure
```json
{
  "name": "Crispy Spring Rolls",
  "price": 8.99,
  "has_portions": true,
  "variants": [
    {
      "name": "Half",
      "price": 4.45,
      "description": "Half portion"
    },
    {
      "name": "Full",
      "price": 8.99,
      "description": "Full portion"
    }
  ]
}
```

## Features Implemented

### 1. Menu Display
- Items with portions show "From $4.45" instead of a fixed price
- Displays the minimum price from available variants
- Works in all view modes (Grid, Menu/List)

### 2. Portion Selection Dialog
When customers click "Add" on Crispy Spring Rolls:
- A dialog appears with portion options
- Each option shows:
  - Portion name (Half/Full)
  - Description
  - Exact price from database
- Selected option is highlighted with primary color
- Full portion is selected by default

### 3. Cart Integration
- Cart items display the selected portion size
- Prices are calculated from the database variants
- Each portion size is treated as a separate cart item
- Accurate total calculation

### 4. Order Processing
- Order items store:
  - `portion_size`: "half" or "full"
  - `variant_name`: "Half" or "Full"
  - `price`: Actual price from the variant

## How It Works

### Price Calculation Logic
```typescript
const getItemPrice = (item: MenuItem, variant?: MenuItemVariant, portionSize?: string) => {
  // If item has portions and a portion size is specified, find the variant price
  if (item.has_portions && portionSize && item.variants) {
    const portionVariant = item.variants.find(v => v.name.toLowerCase() === portionSize.toLowerCase());
    if (portionVariant) {
      return portionVariant.price;
    }
  }
  // Otherwise use variant price or base price
  return variant?.price || item.price;
};
```

### Display Logic
```typescript
// Show "From" price for items with portions
{item.has_portions && item.variants && item.variants.length > 0 ? (
  <span>
    <span className="text-xs text-muted-foreground">From </span>
    {formatCurrency(Math.min(...item.variants.map(v => v.price)))}
  </span>
) : (
  formatCurrency(item.price)
)}
```

## Testing the Feature

### Customer Flow
1. Navigate to the restaurant menu
2. Find "Crispy Spring Rolls" in the Appetizers category
3. Notice the price shows "From $4.45"
4. Click "Add" or "ADD TO CART"
5. Portion selection dialog appears
6. Choose between:
   - **Half**: $4.45 (Half portion)
   - **Full**: $8.99 (Full portion)
7. Click "Add to Cart"
8. Item appears in cart with selected portion and correct price

### Verification Points
- ✅ Menu shows "From $4.45" for Crispy Spring Rolls
- ✅ Dialog shows both portion options with correct prices
- ✅ Cart displays selected portion size
- ✅ Cart total calculates correctly
- ✅ Order items store portion information
- ✅ Full portion is selected by default

## Adding More Items with Portions

To add half/full portions to other menu items:

### SQL Update
```sql
UPDATE menu_items
SET 
  has_portions = true,
  variants = '[
    {
      "name": "Half",
      "price": [HALF_PRICE],
      "description": "Half portion"
    },
    {
      "name": "Full",
      "price": [FULL_PRICE],
      "description": "Full portion"
    }
  ]'::jsonb
WHERE name = '[ITEM_NAME]';
```

### Example: Add portions to "Buffalo Wings"
```sql
UPDATE menu_items
SET 
  has_portions = true,
  variants = '[
    {
      "name": "Half",
      "price": 6.50,
      "description": "Half portion"
    },
    {
      "name": "Full",
      "price": 12.99,
      "description": "Full portion"
    }
  ]'::jsonb
WHERE name = 'Buffalo Wings';
```

## Technical Details

### Files Modified
1. **Database Migration**: `supabase/migrations/00023_add_half_portion_to_spring_rolls.sql`
   - Enabled `has_portions` flag
   - Added variants with prices

2. **Customer Menu Page**: `src/pages/customer/MenuBrowsing.tsx`
   - Updated portion selection dialog to use database variants
   - Modified price display to show "From" for items with portions
   - Updated `getItemPrice()` function to use variant prices
   - Applied changes to all view modes (Grid, Menu, Mobile, Desktop)

### Key Functions
- `getItemPrice()`: Calculates price based on selected portion
- `handleAddToCart()`: Handles portion selection before adding to cart
- Portion selection dialog: Dynamically renders options from variants

## Benefits

1. **Flexible Pricing**: Prices come from database, easy to update
2. **Customer Choice**: Customers can order smaller portions
3. **Accurate Billing**: Exact prices stored in orders
4. **Scalable**: Easy to add portions to more items
5. **User-Friendly**: Clear visual indication of portion options

## Notes

- The base `price` field remains $8.99 (full portion price)
- Variants array contains the actual prices for each portion
- The system automatically detects items with `has_portions = true`
- Portion selection is required before adding to cart
- Each portion size creates a separate cart item
