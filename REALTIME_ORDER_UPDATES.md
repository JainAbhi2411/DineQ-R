# Real-Time Order Status Updates

## Overview
The customer order history page now updates automatically in real-time when the restaurant changes the order status. No manual refresh is required.

## Implementation Details

### 1. Dual Subscription Strategy
The system now listens to changes on **two** database tables:

#### Orders Table Subscription
- Listens to all changes (INSERT, UPDATE, DELETE) on the `orders` table
- Filters to only the current customer's orders
- Triggers a refresh when order details change

#### Order Status History Subscription
- Listens to INSERT events on the `order_status_history` table
- Checks if the new history entry belongs to one of the customer's orders
- Triggers a refresh when new status history is added

### 2. Timing Optimization
A 300ms delay is added before refreshing data to ensure:
- The database trigger that creates status history entries completes
- All related data is fully written to the database
- The query returns complete and consistent data

### 3. Visual Feedback

#### Card Highlight Animation
When an order updates, the order card:
- Shows a primary-colored ring border
- Displays an elevated shadow
- Animation lasts for 2 seconds
- Automatically fades back to normal state

#### Toast Notifications
Users receive notifications when:
- **Order Status Changes**: "Order Status Updated - Order #XXXXX is now [status]"
- **Payment Status Changes**: "Payment Status Updated - Payment for order #XXXXX is now [status]"

### 4. Performance Optimization
- Uses `useRef` to track orders without causing re-renders
- Uses `useCallback` to memoize the loadOrders function
- Prevents unnecessary effect re-runs
- Efficient change detection by comparing previous and new order states

## User Experience

### Before
1. Customer places order
2. Restaurant updates order status
3. Customer must manually refresh the page to see updates
4. Timeline appears outdated until refresh

### After
1. Customer places order
2. Restaurant updates order status
3. **Order card automatically highlights with animation**
4. **Toast notification appears with status update**
5. **Timeline updates instantly without any user action**
6. Customer sees real-time progress of their order

## Technical Flow

```
Restaurant Updates Order Status
         ↓
Database Trigger Creates Status History Entry
         ↓
Supabase Real-Time Broadcasts Changes
         ↓
Customer's Browser Receives Two Events:
  1. orders table UPDATE
  2. order_status_history table INSERT
         ↓
300ms Delay (ensure consistency)
         ↓
Fetch Updated Order Data
         ↓
Compare with Previous State
         ↓
Show Toast Notification (if status changed)
         ↓
Update UI with Highlight Animation
         ↓
Timeline Automatically Reflects New Status
```

## Code Changes

### Files Modified

1. **src/pages/customer/OrderHistory.tsx**
   - Added dual subscription to orders and order_status_history tables
   - Implemented change detection with toast notifications
   - Added useRef and useCallback for performance optimization

2. **src/components/order/OrderCard.tsx**
   - Added visual highlight animation on status updates
   - Detects changes in status, payment_status, and status_history length
   - 2-second highlight effect with ring border and shadow

## Benefits

✅ **No Manual Refresh Required** - Updates happen automatically
✅ **Instant Feedback** - Customers see changes within 300ms
✅ **Visual Indicators** - Clear animations and notifications
✅ **Better UX** - Customers stay informed about order progress
✅ **Reliable** - Dual subscription ensures no updates are missed
✅ **Performance** - Optimized to prevent unnecessary re-renders

## Testing Scenarios

### Test 1: Order Status Change
1. Customer views their order (status: pending)
2. Restaurant changes status to "preparing"
3. **Expected**: Card highlights, toast shows "Order Status Updated", timeline updates

### Test 2: Payment Status Change
1. Customer views their order (payment: pending)
2. Restaurant marks payment as "completed"
3. **Expected**: Card highlights, toast shows "Payment Status Updated"

### Test 3: Multiple Orders
1. Customer has multiple orders visible
2. Restaurant updates one specific order
3. **Expected**: Only the updated order card highlights and shows notification

### Test 4: Rapid Updates
1. Restaurant makes multiple status changes quickly
2. **Expected**: Each change triggers update with proper timing, no race conditions

## Future Enhancements

Potential improvements for future iterations:
- Sound notification option for status changes
- Browser push notifications when app is in background
- Estimated time remaining for each status
- Real-time chat with restaurant staff
- Order tracking map for delivery orders
