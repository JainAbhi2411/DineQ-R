# Add to Existing Order - Quick Reference

## 🎯 What It Does

Prevents multiple orders and bills when customers want to add more items during their dining session.

## 🔄 How It Works

```
Customer adds items to cart
         ↓
Clicks "Proceed to Checkout"
         ↓
System checks for active orders
         ↓
    ┌────┴────┐
    ↓         ↓
Active Order  No Active Order
Found         Found
    ↓         ↓
Show Dialog   Normal Checkout
    ↓
┌───┴───┐
↓       ↓
Add to  Create
Existing New
Order   Order
```

## 📋 Key Features

- ✅ Automatic detection of active orders
- ✅ Shows existing order details
- ✅ Displays new items to be added
- ✅ Calculates updated total
- ✅ Customer choice: add or create new
- ✅ Single bill per dining session

## 🎨 Dialog Preview

```
┌─────────────────────────────────────┐
│  ⚠️ You Have an Active Order        │
├─────────────────────────────────────┤
│  Current Order:                     │
│  • Dal Fry - $12.99                 │
│  • Paneer Masala - $15.99           │
│  • 2x Sada Roti - $7.98             │
│  Current Total: $36.96              │
│                                     │
│  Items to Add:                      │
│  • 1x Sada Roti - $3.99             │
│  New Items Total: $3.99             │
│                                     │
│  Updated Total: $40.95              │
│                                     │
│  [Add to Existing Order]            │
│  [Create New Separate Order]        │
└─────────────────────────────────────┘
```

## 🔧 Technical Details

### API Functions
- `getActiveOrderForCustomer()` - Check for active orders
- `addItemsToExistingOrder()` - Add items to existing order

### Component
- `AddToExistingOrderDialog.tsx` - Dialog component

### Modified Files
- `src/db/api.ts` - API functions
- `src/pages/customer/MenuBrowsing.tsx` - Checkout flow
- `src/components/customer/AddToExistingOrderDialog.tsx` - Dialog UI

## 📊 Order Status Logic

### Active Statuses (can add items)
- `pending` - Order placed, not started
- `preparing` - Order being prepared

### Inactive Statuses (cannot add items)
- `served` - Order served
- `completed` - Order complete and paid
- `cancelled` - Order cancelled

## 🧪 Quick Test

1. Login as customer
2. Place an order (dal fry, paneer masala, 2 roti)
3. Add 1 more roti to cart
4. Click "Proceed to Checkout"
5. Dialog should appear ✅
6. Click "Add to Existing Order"
7. Items added to same order ✅
8. Single bill ✅

## 💡 Use Cases

### ✅ When to Use "Add to Existing"
- Adding forgotten items
- Ordering desserts after main course
- Adding drinks during meal
- Family/group dining

### ✅ When to Use "Create New"
- Splitting bills
- Ordering for different people
- Separate payment required
- Different table/location

## 🎯 Benefits

**For Customers:**
- Single bill
- Easy to add items
- Clear order history

**For Restaurants:**
- Easier order management
- Less confusion
- Better tracking

## 📝 Quick Commands

### Check for Active Order
```typescript
const activeOrder = await orderApi.getActiveOrderForCustomer(
  userId,
  restaurantId,
  tableId
);
```

### Add Items to Order
```typescript
await orderApi.addItemsToExistingOrder(
  orderId,
  orderItems,
  newTotal
);
```

## 🔍 Troubleshooting

**Dialog not appearing?**
- Check if user is logged in
- Verify order status is 'pending' or 'preparing'
- Check browser console for errors

**Items not added?**
- Check database permissions
- Verify order ID
- Review API logs

**Total incorrect?**
- Verify price calculation
- Check portion sizes
- Review variant prices

## 📚 Full Documentation

See `ADD_TO_EXISTING_ORDER_GUIDE.md` for complete details.

## ✅ Status

**Implementation**: Complete ✅  
**Testing**: Ready for testing  
**Production**: Ready to deploy  
