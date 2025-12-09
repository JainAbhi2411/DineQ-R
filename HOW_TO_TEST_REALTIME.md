# How to Test Real-time Orders

## Quick Test Guide

### Test Real-time Order Updates

**What you need:**
- 2 browser windows (or 1 normal + 1 incognito)

**Steps:**

1. **Window 1 - Owner:**
   - Login as restaurant owner
   - Go to "Order Management" page
   - Keep this window visible
   - Open browser console (F12) to see logs

2. **Window 2 - Customer:**
   - Login as customer (or browse as guest)
   - Scan a QR code or browse restaurant menu
   - Add items to cart
   - Click "Proceed to Checkout"
   - Complete the order (use Cash on Counter for quick testing)

3. **Watch Window 1:**
   - Within 1 second, you should see:
     - ✅ Toast notification: "🔔 New Order Received!"
     - ✅ New order appears at the top
     - ✅ Console logs showing real-time events

### Test Order Items Display

**Steps:**

1. Go to "Order Management" page
2. Find any order
3. Click the down arrow (▼) to expand order details
4. You should see:
   - ✅ "Order Items (X)" header showing count
   - ✅ List of all items with names, quantities, prices
   - ✅ Total amount at bottom

### What to Look For in Console

When real-time is working, you'll see these logs:

```
[OrderManagement] Setting up real-time subscriptions for restaurant: <uuid>
[OrderManagement] Subscription status: SUBSCRIBED
[OrderManagement] Received order change: { eventType: 'INSERT', ... }
[OrderManagement] Received order items change: { eventType: 'INSERT', ... }
[OrderManagement] Loading data for restaurant: <uuid>
[OrderManagement] Loaded orders: X
[OrderManagement] New orders detected: 1
```

## Common Issues

### Issue: No toast notification appears
**Solution:** Check console for errors. Make sure you're logged in as the restaurant owner.

### Issue: Order appears but shows 0 items
**Solution:** 
1. Check console logs - look for the order data structure
2. Expand the order to see if items are there
3. If items are missing, check if the order was created properly

### Issue: Console shows "CLOSED" or "ERROR"
**Solution:** 
1. Refresh the page
2. Check your internet connection
3. Verify you're logged in

## Expected Behavior

✅ **Real-time Updates:**
- Orders appear within 1 second of being placed
- No page refresh needed
- Toast notification shows immediately

✅ **Order Items:**
- All items display when expanded
- Shows correct quantities and prices
- Total matches sum of items

✅ **Table Information:**
- Shows "Table X" for QR code orders
- Shows "Walk-in / Takeaway" for direct orders

## Need Help?

If real-time isn't working:
1. Check browser console for errors
2. Verify you're logged in as restaurant owner
3. Try refreshing the page
4. Check your internet connection
5. Review the detailed troubleshooting guide in REALTIME_FIX_COMPLETE.md
