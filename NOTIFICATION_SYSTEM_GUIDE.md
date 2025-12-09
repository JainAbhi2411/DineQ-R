# 🔔 Real-Time Notification System - User Guide

## What is the Notification System?

The notification system keeps you informed about important events in real-time without needing to refresh your browser. Whether you're a restaurant owner managing orders or a customer tracking your meal, you'll receive instant updates.

## 📍 Where to Find Notifications

Look for the **bell icon** (🔔) in the top-right corner of the header, next to your profile picture.

### Notification Badge
- **No Badge**: You have no unread notifications
- **Red Badge with Number**: Shows how many unread notifications you have
- **"9+"**: You have 9 or more unread notifications

## 👨‍💼 For Restaurant Owners

### What Notifications You'll Receive

#### 1. New Order Notifications
**When**: A customer places a new order at your restaurant

**What You'll See**:
- 🔔 Bell badge updates (e.g., 0 → 1)
- Toast notification appears: "🔔 New Order Received!"
- Message: "New order from Table [X] at [Restaurant Name]"

**What to Do**:
1. Click the bell icon to view details
2. Navigate to Order Management to process the order
3. Mark notification as read after viewing

#### 2. How to View Notifications
1. **Click the bell icon** in the header
2. A panel will slide out showing all your notifications
3. **Unread notifications** have a blue dot indicator
4. **Read notifications** appear in normal text

#### 3. Managing Notifications

**Mark Single Notification as Read**:
- Hover over the notification
- Click the checkmark (✓) icon that appears

**Mark All as Read**:
- Click the "Mark all read" button at the top of the notification panel
- All notifications will be marked as read
- Badge counter resets to 0

**Delete a Notification**:
- Hover over the notification
- Click the trash (🗑️) icon that appears
- Notification is permanently removed

### Real-Time Updates

**No Refresh Needed!**
- When a customer places an order, you'll see the notification instantly
- The order will appear in your Order Management page automatically
- No need to refresh your browser or check manually

## 👤 For Customers

### What Notifications You'll Receive

#### 1. Order Status Updates
**When**: Your order status changes

**Status Types**:
- **Preparing**: "Your order at [Restaurant] is being prepared"
- **Served**: "Your order at [Restaurant] has been served"
- **Completed**: "Your order at [Restaurant] is completed"
- **Cancelled**: "Your order at [Restaurant] has been cancelled"

**What You'll See**:
- 🔔 Bell badge updates
- Toast notification with status message
- Notification appears in the bell panel

#### 2. How to Track Your Order

**Method 1: Notification Bell**
1. Click the bell icon
2. View your order status notifications
3. See the timeline of status changes

**Method 2: Order History Page**
1. Go to "Order History" from the menu
2. View real-time status updates
3. See detailed order timeline

**Method 3: Customer Dashboard**
1. Go to your dashboard
2. View active orders section
3. See status updates automatically

### Real-Time Updates

**No Refresh Needed!**
- When the restaurant updates your order status, you'll see it instantly
- Your order timeline updates automatically
- Toast notifications keep you informed

## 🎯 Notification Features

### 1. Real-Time Delivery
- Notifications appear within milliseconds
- No page refresh required
- Works across all pages of the application

### 2. Toast Notifications
- Brief pop-up messages that appear temporarily
- Show important updates immediately
- Automatically disappear after a few seconds

### 3. Browser Notifications (Optional)
- Desktop notifications even when tab is not active
- Browser will ask for permission first
- Can be enabled/disabled in browser settings

### 4. Notification History
- All notifications are saved
- View past notifications anytime
- Scroll through notification history

### 5. Unread Counter
- Badge shows number of unread notifications
- Updates in real-time
- Resets when you mark notifications as read

## 📱 Notification Panel Features

### Panel Layout
```
┌─────────────────────────────────────┐
│  Notifications          Mark all read│
│  X unread notifications              │
├─────────────────────────────────────┤
│  🛍️ New Order Received              │
│  New order from Table 5 at...       │
│  2 minutes ago                  ✓ 🗑️│
├─────────────────────────────────────┤
│  🕐 Order Status Updated            │
│  Your order at Restaurant is...     │
│  5 minutes ago                  ✓ 🗑️│
├─────────────────────────────────────┤
│  ✓ Order Status Updated             │
│  Your order at Restaurant is...     │
│  1 hour ago                       🗑️│
└─────────────────────────────────────┘
```

### Icons Explained
- 🛍️ **Shopping Bag**: New order notification
- 🕐 **Clock**: Order status change
- ✓ **Checkmark**: Mark as read
- 🗑️ **Trash**: Delete notification
- **Blue Dot**: Unread indicator

## 🔄 How Real-Time Works

### The Technology
The system uses **Supabase Realtime** to deliver instant updates:

1. **Event Occurs**: Customer places order or owner updates status
2. **Database Trigger**: Automatically creates notification
3. **Real-Time Broadcast**: Notification sent to user instantly
4. **UI Updates**: Bell badge and notification panel update automatically
5. **Toast Appears**: Brief notification message shows

### What This Means for You
- **Instant Updates**: No waiting or refreshing
- **Always Current**: Information is always up-to-date
- **Reliable**: Built on enterprise-grade technology
- **Efficient**: Minimal battery and data usage

## 💡 Tips and Best Practices

### For Restaurant Owners
1. **Keep Notifications Enabled**: Stay informed of new orders
2. **Check Regularly**: Review notifications during busy hours
3. **Mark as Read**: Keep your notification list organized
4. **Use Toast Notifications**: Quick glance at new orders
5. **Enable Browser Notifications**: Get alerts even when not on the page

### For Customers
1. **Track Your Order**: Use notifications to follow order progress
2. **No Need to Refresh**: Updates come automatically
3. **Check Order History**: View detailed order timeline
4. **Enable Browser Notifications**: Get updates even when browsing other tabs

## 🛠️ Troubleshooting

### Not Receiving Notifications?

**Check 1: Internet Connection**
- Ensure you have a stable internet connection
- Real-time updates require active connection

**Check 2: Browser Permissions**
- Check if browser notifications are blocked
- Allow notifications in browser settings

**Check 3: Page Refresh**
- Try refreshing the page
- Log out and log back in

**Check 4: Browser Compatibility**
- Use modern browsers (Chrome, Firefox, Safari, Edge)
- Update to latest browser version

### Notifications Not Updating?

**Solution 1: Refresh the Page**
- Press F5 or Ctrl+R (Cmd+R on Mac)
- This will re-establish the real-time connection

**Solution 2: Check Network**
- Ensure you're not behind a restrictive firewall
- Some corporate networks may block WebSocket connections

**Solution 3: Clear Cache**
- Clear browser cache and cookies
- Log in again

## 🔐 Privacy and Security

### Your Notifications are Private
- Only you can see your notifications
- Notifications are filtered by user account
- Secure database connections

### Data Storage
- Notifications are stored securely in the database
- You can delete notifications anytime
- No notification data is shared with third parties

## 📊 Notification Statistics

### What Gets Tracked
- Number of notifications sent
- Read/unread status
- Notification creation time

### What Doesn't Get Tracked
- How long you view notifications
- Which notifications you click
- Your notification preferences (future feature)

## 🚀 Future Features

Coming soon to the notification system:
- 📧 Email notifications for important events
- 📱 SMS notifications for critical updates
- 🔕 Notification preferences (enable/disable types)
- 🔊 Custom notification sounds
- 📦 Notification grouping
- 🔍 Search and filter notifications

## 📞 Need Help?

If you're experiencing issues with notifications:
1. Check this guide for troubleshooting steps
2. Ensure your browser is up to date
3. Try logging out and back in
4. Contact support if issues persist

---

**Remember**: The notification system is designed to keep you informed without being intrusive. You're always in control of your notifications!
