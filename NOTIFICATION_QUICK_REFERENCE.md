# 🔔 Notification System - Quick Reference

## For Developers

### Database

#### Table: `notifications`
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES profiles(id)
type            text ('new_order', 'order_status_change', 'order_completed')
title           text
message         text
order_id        uuid REFERENCES orders(id)
is_read         boolean DEFAULT false
created_at      timestamptz DEFAULT now()
```

#### Triggers
- `on_order_created` → Creates notification for restaurant owner
- `on_order_status_changed` → Creates notification for customer

#### RPC Functions
- `mark_notification_as_read(notification_id uuid)`
- `mark_all_notifications_as_read()`
- `get_unread_notification_count()`

### API Functions

```typescript
import { notificationApi } from '@/db/api';

// Get all notifications
const notifications = await notificationApi.getNotifications(userId, limit);

// Get unread notifications
const unread = await notificationApi.getUnreadNotifications(userId);

// Get unread count
const count = await notificationApi.getUnreadCount(userId);

// Mark as read
await notificationApi.markAsRead(notificationId);

// Mark all as read
await notificationApi.markAllAsRead();

// Delete notification
await notificationApi.deleteNotification(notificationId);
```

### React Hook

```typescript
import { useNotifications } from '@/hooks/use-notifications';

function MyComponent() {
  const {
    notifications,      // Array of notifications
    unreadCount,        // Number of unread notifications
    isLoading,          // Loading state
    markAsRead,         // Function to mark as read
    markAllAsRead,      // Function to mark all as read
    deleteNotification, // Function to delete
    refresh,            // Function to refresh notifications
  } = useNotifications(userId);
}
```

### Components

#### NotificationBell
```typescript
import { NotificationBell } from '@/components/notifications/NotificationBell';

<NotificationBell userId={profile.id} />
```

#### NotificationList
```typescript
import { NotificationList } from '@/components/notifications/NotificationList';

<NotificationList
  notifications={notifications}
  onMarkAsRead={markAsRead}
  onMarkAllAsRead={markAllAsRead}
  onDelete={deleteNotification}
/>
```

### Real-Time Subscription

```typescript
import { supabase } from '@/db/supabase';

// Subscribe to notification changes
const channel = supabase
  .channel('notifications-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      const newNotification = payload.new as Notification;
      // Handle new notification
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

### TypeScript Types

```typescript
export type NotificationType = 'new_order' | 'order_status_change' | 'order_completed';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationWithOrder extends Notification {
  order?: Order;
}
```

## For Users

### Restaurant Owners

**Receive notifications for:**
- ✅ New orders placed by customers

**Actions:**
- View notification details
- Mark as read
- Delete notifications
- Mark all as read

### Customers

**Receive notifications for:**
- ✅ Order status changes (preparing, served, completed, cancelled)

**Actions:**
- View notification details
- Mark as read
- Delete notifications
- Mark all as read

## Testing

### Test New Order Notification
```bash
# Window 1: Owner Dashboard
# Window 2: Customer - Place Order
# Expected: Owner sees notification instantly
```

### Test Status Update Notification
```bash
# Window 1: Owner - Update order status
# Window 2: Customer Dashboard
# Expected: Customer sees notification instantly
```

## Key Features

✅ Real-time updates (no refresh needed)
✅ Toast notifications
✅ Browser notifications (optional)
✅ Notification history
✅ Unread counter
✅ Mark as read/unread
✅ Delete notifications
✅ Secure (RLS enabled)

## Files

### New Files
- `supabase/migrations/00014_create_notifications_system.sql`
- `src/hooks/use-notifications.ts`
- `src/components/notifications/NotificationBell.tsx`
- `src/components/notifications/NotificationList.tsx`

### Modified Files
- `src/types/types.ts`
- `src/db/api.ts`
- `src/components/common/Header.tsx`
- `src/pages/customer/CustomerDashboard.tsx`

## Performance

- **Indexed Queries**: Fast notification retrieval
- **Pagination**: Limited to 50 notifications by default
- **Scoped Subscriptions**: Only relevant notifications
- **Efficient Updates**: Minimal re-renders

## Security

- **RLS Enabled**: Users can only see their own notifications
- **Secure Triggers**: SECURITY DEFINER functions
- **User Isolation**: Database-level filtering

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## Dependencies

- Supabase Realtime
- date-fns (for relative time)
- Lucide React (for icons)
- shadcn/ui components

---

**Quick Tip**: The notification bell is always visible in the header for authenticated users!
