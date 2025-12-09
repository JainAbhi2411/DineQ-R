# Real-time Orders and Table Number Fix

## Issues Fixed

### Issue 1: Active Orders Not Showing in Real-time
**Problem:** When customers placed orders, the owner's order management page didn't update automatically.

**Solution:** Enhanced the real-time subscription system in OrderManagement.tsx to listen to multiple tables:
- `orders` table - for new orders and order updates
- `order_items` table - for order item changes
- `order_status_history` table - for status updates

**Changes Made:**
- Added subscription to `order_items` table with event type `*` (all events)
- Updated `order_status_history` subscription to listen to all events (not just INSERT)
- Added proper TypeScript type casting for payload data
- Maintained 300ms delay to ensure all related data is written before reloading

**Result:** Orders now appear instantly on the owner's dashboard when customers place them, with a toast notification showing the order details.

### Issue 2: Table Number Showing as "Unknown"
**Problem:** When customers ordered without scanning a QR code (walk-in or takeaway orders), the table field was null and showed as "unknown" or was hidden.

**Solution:** Updated all components that display table information to show "Walk-in / Takeaway" when table_id is null.

**Files Updated:**

1. **OrderCard.tsx** (Line 99-102)
   - Changed from conditional rendering to always showing table info
   - Shows "Walk-in / Takeaway" when order.table is null
   ```typescript
   <span className="flex items-center gap-1">
     <MapPin className="w-4 h-4" />
     {order.table ? `Table ${order.table.table_number}` : 'Walk-in / Takeaway'}
   </span>
   ```

2. **OrderManagement.tsx** (Line 51-56)
   - Updated toast notification to show proper table info
   ```typescript
   const tableInfo = order.table ? `Table ${order.table.table_number}` : 'Walk-in / Takeaway';
   toast({
     title: '🔔 New Order Received!',
     description: `${tableInfo} - Order #${order.id.slice(0, 8).toUpperCase()}`,
   });
   ```

3. **PrintBill.tsx** (Line 62)
   - Updated bill printing to always show table info
   ```typescript
   <p><strong>Table:</strong> {order.table ? order.table.table_number : 'Walk-in / Takeaway'}</p>
   ```

4. **OrderTracking.tsx** (Line 214-218)
   - Changed from conditional rendering to always showing table info
   ```typescript
   <div className="flex items-center gap-2 text-sm">
     <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
     <span className="font-medium">Table:</span>
     <span>{order.table ? order.table.table_number : 'Walk-in / Takeaway'}</span>
   </div>
   ```

## Technical Details

### Real-time Subscription Architecture
The OrderManagement page now subscribes to three tables:

1. **Orders Table**
   - Filter: `restaurant_id=eq.${restaurantId}`
   - Events: All (INSERT, UPDATE, DELETE)
   - Purpose: Detect new orders and order updates

2. **Order Items Table**
   - Filter: None (checks orderId in callback)
   - Events: All (INSERT, UPDATE, DELETE)
   - Purpose: Detect when items are added/modified/removed

3. **Order Status History Table**
   - Filter: None (checks orderId in callback)
   - Events: All (INSERT, UPDATE, DELETE)
   - Purpose: Detect status changes

### Data Flow
```
Customer places order
    ↓
Order created in database
    ↓
Supabase real-time triggers
    ↓
OrderManagement receives notification
    ↓
300ms delay (ensure all data written)
    ↓
loadData() fetches updated orders
    ↓
Toast notification shown
    ↓
UI updates with new order
```

### Table ID Handling
- Table ID comes from URL query parameter: `?table=<tableId>`
- When customers scan QR code: tableId is present
- When customers browse directly: tableId is null
- Both scenarios are now properly handled

## Testing

### Test Case 1: Real-time Order Updates
1. Open owner's order management page
2. In another browser/tab, place an order as a customer
3. **Expected:** Order appears immediately on owner's page with toast notification
4. **Result:** ✅ Working

### Test Case 2: Table Number Display (With Table)
1. Scan QR code with table number
2. Place order
3. **Expected:** Shows "Table X" in all views
4. **Result:** ✅ Working

### Test Case 3: Table Number Display (Without Table)
1. Navigate directly to menu (no QR scan)
2. Place order
3. **Expected:** Shows "Walk-in / Takeaway" in all views
4. **Result:** ✅ Working

### Test Case 4: Multiple Simultaneous Orders
1. Place multiple orders from different tables
2. **Expected:** All orders appear in real-time with correct table info
3. **Result:** ✅ Working

## Browser Console Logs
When real-time updates are working, you'll see these logs:

```
[OrderManagement] Setting up real-time subscriptions for restaurant: <uuid>
[OrderManagement] Subscription status: SUBSCRIBED
[OrderManagement] Received order change: { eventType: 'INSERT', new: {...}, old: null }
[OrderManagement] Received order items change: { eventType: 'INSERT', new: {...}, old: null }
```

## Performance Considerations
- 300ms delay prevents multiple rapid reloads
- Uses `ordersRef` to maintain order list between renders
- Subscription cleanup on component unmount prevents memory leaks
- Efficient filtering reduces unnecessary data fetches

## Status
✅ **COMPLETE** - Both issues are fully resolved and tested
