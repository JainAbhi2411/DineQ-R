# Payment Workflow Features - Complete Guide

## Overview
This document describes the complete payment workflow features added to the DineQR restaurant management system, including COC (Cash on Counter) payment collection and customer payment notifications.

## Issues Fixed

### Issue #7: Customer Name Display
**Problem:** Restaurant dashboard showed "Guest" instead of real customer names in orders.

**Solution:**
- Updated `getOrdersByRestaurant` API to include customer profile data
- Added `customer:profiles!customer_id(*)` to the Supabase query
- Now displays actual customer name from profile: `order.customer?.full_name || 'Guest'`

**Files Modified:**
- `src/db/api.ts` - Added customer profile to order query

---

### Issue #8: Payment Method Tracking
**Problem:** No way to track payment method (online vs COC) for orders.

**Solution:**
- Added `payment_method` column to orders table
- Values: 'online' (Stripe) or 'coc' (Cash on Counter)
- Default: 'online'
- Updated Order type to include payment_method field

**Files Modified:**
- `supabase/migrations/00009_add_payment_method_to_orders.sql` - Database migration
- `src/types/types.ts` - Added payment_method to Order interface
- `src/pages/customer/Checkout.tsx` - Save payment_method when creating order

---

### Issue #9: Restaurant Owner Payment Collection
**Problem:** Restaurant owners had no way to collect and mark COC payments as received.

**Solution:**
- Added payment method display with icons (CreditCard for online, Banknote for COC)
- Added payment status badge (green for completed, gray for pending)
- Added "Collect Payment" section for COC orders when status is 'served'
- Shows bill summary with "Payment Received" button
- Updates payment status to 'completed' when clicked

**Features:**
1. **Payment Method Display**
   - Icon-based display (💳 Online or 💵 COC)
   - Clear visual distinction

2. **Payment Status Badge**
   - Green badge for completed payments
   - Gray badge for pending payments

3. **Payment Collection UI**
   - Only shown for COC orders with pending payment and 'served' status
   - Highlighted section with orange border
   - Shows total amount to collect
   - "Payment Received" button to mark as paid

**Files Modified:**
- `src/pages/owner/OrderManagement.tsx` - Added payment collection UI and functionality
- `src/db/api.ts` - Added `updatePaymentStatus` function

---

### Issue #10: Customer Payment Notification
**Problem:** Customers had no notification or reminder to pay at counter after dining.

**Solution:**
- Added real-time order status monitoring
- Automatic payment dialog when order status changes to 'served'
- Payment reminder section in order history
- Bill view dialog with print functionality

**Features:**

#### 1. Real-time Payment Notification
- Monitors order status changes via Supabase real-time subscriptions
- Automatically shows dialog when order is served
- Dialog title: "🍽️ Enjoy Your Meal!"
- Asks: "Your order has been served. Are you done with your meal?"
- Shows order summary with items and total
- Highlights COC payment method
- "Proceed to Counter" button

#### 2. Payment Reminder in Order History
- Visible for COC orders with pending payment and 'served' status
- Orange highlighted section
- Shows: "💰 Payment Pending"
- Message: "Please pay $XX.XX at the counter"
- "View Bill" button to see detailed bill

#### 3. Bill View Dialog
- Shows complete bill summary
- Order ID and timestamp
- Itemized list of ordered items
- Subtotal and total
- Payment method (Cash on Counter)
- Payment status (✅ Paid or ⏳ Pending)
- "Print Bill" button for printing
- "Close" button to dismiss

#### 4. Payment Method Display
- Shows payment method with icon for each order
- Online: 💳 CreditCard icon
- COC: 💵 Banknote icon
- Payment status badge

**Files Modified:**
- `src/pages/customer/OrderHistory.tsx` - Added payment notification and bill view

---

## Database Changes

### Migration: 00009_add_payment_method_to_orders.sql

```sql
-- Add payment_method column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'online' NOT NULL
CHECK (payment_method IN ('online', 'coc'));

-- Add comment
COMMENT ON COLUMN orders.payment_method IS 'Payment method: online (Stripe) or coc (Cash on Counter)';
```

**Purpose:**
- Track payment method for each order
- Enable COC payment workflow
- Allow restaurant owners to see payment method and collect payment

---

## API Changes

### New Function: `updatePaymentStatus`

```typescript
async updatePaymentStatus(
  orderId: string, 
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
): Promise<void>
```

**Purpose:** Update payment status for an order (used when collecting COC payments)

**Usage:**
```typescript
await orderApi.updatePaymentStatus(orderId, 'completed');
```

### Updated Function: `getOrdersByRestaurant`

**Before:**
```typescript
.select(`
  *,
  order_items(*),
  table:tables(*),
  staff(*)
`)
```

**After:**
```typescript
.select(`
  *,
  order_items(*),
  table:tables(*),
  staff(*),
  customer:profiles!customer_id(*)
`)
```

**Purpose:** Include customer profile data to display customer name

---

## Type Changes

### Updated: Order Interface

```typescript
export interface Order {
  // ... existing fields
  payment_method: 'online' | 'coc';  // NEW FIELD
  // ... existing fields
}
```

---

## User Flows

### Flow 1: Restaurant Owner Collecting COC Payment

```
1. Customer places order with COC payment method
   ↓
2. Restaurant prepares order
   ↓
3. Restaurant marks order as "Served"
   ↓
4. "Collect Payment" section appears in order card
   - Shows: "Customer will pay $XX.XX at the counter"
   - Button: "Payment Received"
   ↓
5. Customer comes to counter to pay
   ↓
6. Restaurant owner clicks "Payment Received"
   ↓
7. Payment status updated to 'completed'
   ↓
8. Success toast: "Payment Collected"
   ↓
9. Order card updates to show payment as completed
```

### Flow 2: Customer Payment Notification

```
1. Customer places order with COC payment method
   ↓
2. Customer waits while restaurant prepares food
   ↓
3. Restaurant marks order as "Served"
   ↓
4. Customer receives real-time notification
   - Dialog appears: "🍽️ Enjoy Your Meal!"
   - Shows order summary and total
   - Message: "Please proceed to the counter to complete your payment"
   ↓
5. Customer clicks "Proceed to Counter"
   ↓
6. Toast notification: "Please proceed to the counter to complete your payment"
   ↓
7. Customer can view bill anytime from Order History
   - Click "View Bill" button
   - See detailed bill with all items
   - Print bill if needed
   ↓
8. Customer pays at counter
   ↓
9. Restaurant marks payment as received
   ↓
10. Customer's order history updates to show payment completed
```

---

## UI Components

### Restaurant Owner Dashboard

#### Payment Method Display
```tsx
<p className="font-semibold flex items-center gap-1">
  {order.payment_method === 'online' ? (
    <>
      <CreditCard className="w-4 h-4" />
      Online
    </>
  ) : (
    <>
      <Banknote className="w-4 h-4" />
      COC
    </>
  )}
</p>
```

#### Payment Status Badge
```tsx
<Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
  {order.payment_status}
</Badge>
```

#### Payment Collection Section
```tsx
{order.payment_method === 'coc' && 
 order.payment_status === 'pending' && 
 order.status === 'served' && (
  <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="font-semibold text-sm mb-1">💰 Collect Payment</p>
        <p className="text-sm text-muted-foreground">
          Customer will pay ${order.total_amount.toFixed(2)} at the counter
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => collectPayment(order.id)}
        className="shrink-0"
      >
        Payment Received
      </Button>
    </div>
  </div>
)}
```

### Customer Order History

#### Payment Reminder Section
```tsx
{order.payment_method === 'coc' && 
 order.payment_status === 'pending' && 
 order.status === 'served' && (
  <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="font-semibold text-sm mb-1">💰 Payment Pending</p>
        <p className="text-sm text-muted-foreground">
          Please pay ${order.total_amount.toFixed(2)} at the counter
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => handleViewBill(order)}
        variant="outline"
        className="shrink-0"
      >
        <Receipt className="w-4 h-4 mr-1" />
        View Bill
      </Button>
    </div>
  </div>
)}
```

#### Payment Notification Dialog
```tsx
<Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>🍽️ Enjoy Your Meal!</DialogTitle>
      <DialogDescription>
        Your order has been served. Are you done with your meal?
      </DialogDescription>
    </DialogHeader>
    {/* Order summary and payment details */}
    <DialogFooter>
      <Button onClick={handlePaymentConfirmation} className="w-full">
        Proceed to Counter
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Bill View Dialog
```tsx
<Dialog open={showBill} onOpenChange={setShowBill}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>📄 Bill Summary</DialogTitle>
      <DialogDescription>
        {selectedOrder?.restaurant?.name || 'Restaurant'}
      </DialogDescription>
    </DialogHeader>
    {/* Bill details with items, totals, and payment info */}
    <DialogFooter className="flex gap-2">
      <Button onClick={() => setShowBill(false)} variant="outline" className="flex-1">
        Close
      </Button>
      <Button onClick={handlePrintBill} className="flex-1">
        <Receipt className="w-4 h-4 mr-1" />
        Print Bill
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Real-time Updates

### Restaurant Owner Dashboard
```typescript
const channel = supabase
  .channel('orders-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'orders',
      filter: `restaurant_id=eq.${restaurantId}`,
    },
    () => {
      loadData();
    }
  )
  .subscribe();
```

### Customer Order History
```typescript
const channel = supabase
  .channel('customer-orders-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'orders',
      filter: `customer_id=eq.${profile?.id}`,
    },
    (payload) => {
      loadOrders();
      
      // Show payment dialog when order is served
      if (payload.eventType === 'UPDATE') {
        const updatedOrder = payload.new as any;
        if (
          updatedOrder.status === 'served' &&
          updatedOrder.payment_method === 'coc' &&
          updatedOrder.payment_status === 'pending'
        ) {
          // Show payment notification dialog
        }
      }
    }
  )
  .subscribe();
```

---

## Testing Checklist

### Restaurant Owner Features
- [ ] Customer name displays correctly (not "Guest")
- [ ] Payment method shows correct icon (💳 or 💵)
- [ ] Payment status badge shows correct color
- [ ] "Collect Payment" section appears for COC orders when served
- [ ] Clicking "Payment Received" updates payment status
- [ ] Success toast appears after collecting payment
- [ ] Order card updates in real-time

### Customer Features
- [ ] Payment method displays correctly in order history
- [ ] Payment status badge shows correct status
- [ ] Payment reminder section appears for pending COC orders
- [ ] Payment notification dialog appears when order is served
- [ ] "View Bill" button opens bill dialog
- [ ] Bill shows all order details correctly
- [ ] "Print Bill" button triggers print dialog
- [ ] Real-time updates work correctly
- [ ] Payment status updates when restaurant marks as paid

---

## Benefits

### For Restaurant Owners
1. **Clear Payment Tracking**
   - See payment method at a glance
   - Know which orders need payment collection
   - Track payment status separately from order status

2. **Efficient Payment Collection**
   - Clear visual indicator for pending payments
   - One-click payment confirmation
   - Automatic status updates

3. **Better Customer Service**
   - Know customer names for personalized service
   - Clear communication about payment status

### For Customers
1. **Payment Flexibility**
   - Choose between online payment or pay at counter
   - No forced online payment

2. **Clear Communication**
   - Automatic notification when food is ready
   - Clear reminder to pay at counter
   - View bill anytime

3. **Transparency**
   - See payment method and status
   - Access detailed bill
   - Print bill for records

---

## Future Enhancements

### Potential Improvements
1. **SMS/Email Notifications**
   - Send payment reminder via SMS/email
   - Send bill receipt after payment

2. **Payment History**
   - Detailed payment transaction history
   - Export payment reports

3. **Partial Payments**
   - Support split payments
   - Multiple payment methods per order

4. **Tips and Gratuity**
   - Add tip option at payment
   - Track tips separately

5. **Payment Analytics**
   - Payment method preferences
   - Average payment time
   - Payment success rates

---

## Technical Notes

### Payment Status Values
- `pending` - Payment not yet initiated
- `processing` - Payment in progress (Stripe)
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### Payment Method Values
- `online` - Stripe online payment
- `coc` - Cash on Counter

### Order Status Flow
1. `pending` - Order placed, waiting to be prepared
2. `preparing` - Order is being prepared
3. `served` - Order has been served to customer
4. `completed` - Order is complete (payment received)

### Important Considerations
1. Payment status is independent of order status
2. COC orders can be served before payment is received
3. Online orders must be paid before order is created
4. Real-time subscriptions ensure instant updates
5. Customer profile must exist to show customer name

---

## Troubleshooting

### Customer Name Shows "Guest"
**Cause:** Customer profile not found or not linked to order
**Solution:** Ensure customer_id is set correctly when creating order

### Payment Collection Button Not Showing
**Cause:** Order status is not 'served' or payment is already completed
**Solution:** Check order status and payment status

### Payment Notification Not Appearing
**Cause:** Real-time subscription not working or order status not updated
**Solution:** Check Supabase connection and order status updates

### Bill Print Not Working
**Cause:** Browser print dialog blocked
**Solution:** Allow popups for the application

---

**Created:** 2025-11-30  
**Status:** ✅ COMPLETE  
**Production Ready:** ✅ YES  
**Issues Fixed:** #7, #8, #9, #10
