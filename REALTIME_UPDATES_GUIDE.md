# Real-Time Order Updates - User Guide

## What's New? 🎉

Your order history page now updates **automatically in real-time** when the restaurant changes your order status. No more manual refreshing!

## How It Works

### Visual Indicators

#### 1. **Animated Card Highlight** ✨
When your order status changes:
- The order card gets a **bright blue ring border**
- The card **elevates with a shadow effect**
- The animation lasts for **2 seconds** then fades away
- This draws your attention to the updated order

#### 2. **Toast Notifications** 🔔
You'll see a notification popup in the corner showing:
- **"Order Status Updated"** - When your order moves to a new stage
- **"Payment Status Updated"** - When payment is processed
- The notification includes your order number and new status

#### 3. **Updated Timeline** 📊
The order timeline automatically refreshes to show:
- New status entries
- Timestamp of each change
- Complete history of your order progress

## Example Scenarios

### Scenario 1: Order Accepted
```
You place an order → Status: "pending"
↓
Restaurant accepts → Status changes to "preparing"
↓
✨ Your screen automatically:
  • Card highlights with blue ring
  • Toast appears: "Order Status Updated - Order #ABC123 is now preparing"
  • Timeline shows new "Preparing" entry
```

### Scenario 2: Order Ready
```
Order is being prepared → Status: "preparing"
↓
Food is ready → Status changes to "served"
↓
✨ Your screen automatically:
  • Card highlights with blue ring
  • Toast appears: "Order Status Updated - Order #ABC123 is now served"
  • Timeline shows new "Served" entry
```

### Scenario 3: Payment Collected
```
You finish eating → Payment: "pending"
↓
Restaurant collects payment → Payment changes to "completed"
↓
✨ Your screen automatically:
  • Card highlights with blue ring
  • Toast appears: "Payment Status Updated - Payment for order #ABC123 is now completed"
  • Timeline shows payment collected
  • "Print E-Bill" button becomes available
```

## Status Progression

Your order typically follows this flow:

```
1. 🕐 PENDING
   "Order Received"
   Restaurant has received your order
   ↓
2. 👨‍🍳 PREPARING
   "Preparing"
   Kitchen is preparing your food
   ↓
3. 🍽️ SERVED
   "Served"
   Food has been delivered to your table
   ↓
4. ✅ COMPLETED
   "Completed"
   Order is complete and paid
```

## Payment Status Flow

```
1. 🕐 PENDING
   "Payment Pending"
   Waiting for payment
   ↓
2. 💳 PROCESSING
   "Processing Payment"
   Payment is being processed
   ↓
3. ✅ COMPLETED
   "Payment Collected"
   Payment successful - you can now print your bill
```

## Benefits

✅ **Stay Informed** - Know exactly when your order status changes
✅ **No Manual Refresh** - Updates happen automatically
✅ **Clear Feedback** - Visual and text notifications
✅ **Complete History** - See full timeline of your order
✅ **Real-Time** - Updates appear within seconds of restaurant action

## Tips

💡 **Keep the page open** - Leave your order history page open to see updates as they happen

💡 **Check notifications** - Look for the toast notifications in the corner of your screen

💡 **Expand order details** - Click on any order card to see the full timeline

💡 **Print your bill** - Once payment is completed, use the "Print E-Bill" button

## Troubleshooting

**Q: I don't see updates**
- Make sure you're logged in
- Check your internet connection
- Try refreshing the page once

**Q: Updates are delayed**
- Updates typically appear within 1-2 seconds
- Network conditions may cause slight delays

**Q: Multiple notifications appear**
- This is normal if the restaurant makes multiple changes quickly
- Each change triggers its own notification

## Technical Details

For developers and technical users:

- **Technology**: Supabase Real-Time subscriptions
- **Latency**: ~300-500ms from database change to UI update
- **Subscriptions**: Dual subscription to orders and order_status_history tables
- **Performance**: Optimized with useRef and useCallback hooks
- **Animation**: CSS transitions with 500ms duration
- **Notification Duration**: Toast notifications auto-dismiss after 5 seconds

---

Enjoy your seamless ordering experience! 🎉
