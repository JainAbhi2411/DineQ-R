# Add to Existing Order Feature - Complete Guide

## 🎯 Overview

The "Add to Existing Order" feature solves a common problem in restaurant ordering systems: when customers want to add more items after placing an initial order, the system now intelligently detects active orders and offers to add items to the existing order instead of creating multiple separate orders.

## 📋 Problem Solved

### Before This Feature
**Scenario**: Customer orders dal fry, paneer masala, and 2 sada roti. Later, they want to order 1 more roti.

**Issues**:
- ❌ System creates a new separate order
- ❌ Two different order IDs
- ❌ Two different bills
- ❌ Confusing for restaurant staff
- ❌ Poor customer experience
- ❌ Difficult to track related orders

### After This Feature
**Scenario**: Same situation as above.

**Solution**:
- ✅ System detects existing active order
- ✅ Shows dialog with two options:
  1. **Add to Existing Order** (recommended)
  2. **Create New Separate Order**
- ✅ Customer chooses to add to existing order
- ✅ Items are added to the same order
- ✅ Order total is updated
- ✅ Single bill for all items
- ✅ Restaurant receives notification of additional items

## 🎨 User Experience

### Customer Flow

#### Step 1: Initial Order
1. Customer scans QR code at table
2. Browses menu and adds items to cart:
   - Dal Fry ($12.99)
   - Paneer Masala ($15.99)
   - 2x Sada Roti ($3.99 each)
3. Proceeds to checkout
4. Places order
5. Order status: **Pending** or **Preparing**

#### Step 2: Additional Items
1. Customer wants to order more items
2. Adds 1x Sada Roti to cart ($3.99)
3. Clicks "Proceed to Checkout"

#### Step 3: Smart Detection
**Dialog Appears:**
```
┌─────────────────────────────────────────────┐
│  ⚠️ You Have an Active Order                │
├─────────────────────────────────────────────┤
│  You already have an order in progress.     │
│  Would you like to add these items to your  │
│  existing order or create a new separate    │
│  order?                                     │
│                                             │
│  📋 Current Order                           │
│  ┌─────────────────────────────────────┐   │
│  │ 1x Dal Fry              $12.99      │   │
│  │ 1x Paneer Masala        $15.99      │   │
│  │ 2x Sada Roti            $7.98       │   │
│  │ ─────────────────────────────────── │   │
│  │ Current Total           $36.96      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ➕ Items to Add                            │
│  ┌─────────────────────────────────────┐   │
│  │ 1x Sada Roti            $3.99       │   │
│  │ ─────────────────────────────────── │   │
│  │ New Items Total         $3.99       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Updated Order Total        $40.95          │
│                                             │
│  [➕ Add to Existing Order]                 │
│  [🛒 Create New Separate Order]             │
│  [Cancel]                                   │
└─────────────────────────────────────────────┘
```

#### Step 4: Customer Choice

**Option A: Add to Existing Order** (Recommended)
- Items are added to the existing order
- Order total updated to $40.95
- Cart is cleared
- Success message: "Items Added - Your items have been added to your existing order"
- Redirected to order tracking page
- Restaurant receives notification

**Option B: Create New Separate Order**
- Proceeds to normal checkout
- Creates a new order with new order ID
- Useful for splitting bills or ordering for different people

## 🔧 Technical Implementation

### 1. API Functions

#### `getActiveOrderForCustomer()`
**Location**: `src/db/api.ts`

**Purpose**: Check if customer has an active order

**Parameters**:
- `customerId`: User ID
- `restaurantId`: Restaurant ID
- `tableId`: (Optional) Table ID

**Returns**: `OrderWithItems | null`

**Logic**:
```typescript
- Query orders table
- Filter by customer_id and restaurant_id
- Filter by status IN ('pending', 'preparing')
- Optionally filter by table_id
- Order by created_at DESC
- Return most recent active order or null
```

#### `addItemsToExistingOrder()`
**Location**: `src/db/api.ts`

**Purpose**: Add new items to an existing order

**Parameters**:
- `orderId`: Existing order ID
- `items`: Array of new order items
- `newTotal`: Updated order total

**Logic**:
```typescript
1. Insert new items into order_items table
2. Update order total_amount
3. Update order updated_at timestamp
4. Create order_status_history entry with note: "Additional items added to order"
```

### 2. Component: AddToExistingOrderDialog

**Location**: `src/components/customer/AddToExistingOrderDialog.tsx`

**Props**:
```typescript
interface AddToExistingOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingOrder: OrderWithItems;
  newItems: CartItem[];
  onAddToExisting: () => void;
  onCreateNew: () => void;
}
```

**Features**:
- Displays existing order items with quantities and prices
- Shows current order total
- Displays new items to be added (highlighted)
- Shows new items total
- Calculates and displays updated order total
- Two action buttons: "Add to Existing" and "Create New"
- Cancel button to close dialog

### 3. Updated Checkout Flow

**Location**: `src/pages/customer/MenuBrowsing.tsx`

**Modified Function**: `handleCheckout()`

**New Logic**:
```typescript
async handleCheckout() {
  1. Check if cart is empty → return
  2. Check if table is selected → show table selection if not
  3. Check if user is logged in → redirect to login if not
  4. Call getActiveOrderForCustomer()
  5. If active order exists:
     - Set existingOrder state
     - Open AddToExistingOrderDialog
  6. If no active order:
     - Proceed to normal checkout
}
```

**New Functions**:
- `proceedToCheckout()`: Navigate to checkout page
- `handleAddToExistingOrder()`: Add items to existing order
- `handleCreateNewOrder()`: Create new separate order

## 📊 Database Changes

### No Schema Changes Required ✅

The existing database schema already supports this feature:

**Tables Used**:
- `orders`: Stores order information
- `order_items`: Stores individual items in orders
- `order_status_history`: Tracks order status changes

**Key Fields**:
- `orders.status`: Used to filter active orders ('pending', 'preparing')
- `orders.total_amount`: Updated when items are added
- `orders.updated_at`: Updated to reflect latest modification
- `order_status_history.notes`: Records "Additional items added to order"

## 🎯 Business Logic

### When to Show Dialog

**Conditions**:
1. ✅ Customer is logged in
2. ✅ Customer has items in cart
3. ✅ Table is selected
4. ✅ Customer has an existing order with status 'pending' or 'preparing'
5. ✅ Existing order is for the same restaurant
6. ✅ (Optional) Existing order is for the same table

### When NOT to Show Dialog

**Conditions**:
- ❌ No existing active order
- ❌ Existing order status is 'completed', 'cancelled', or 'served'
- ❌ Customer is not logged in
- ❌ Cart is empty

### Order Status Filtering

**Active Statuses** (can add items):
- `pending`: Order placed, not yet started
- `preparing`: Order is being prepared

**Inactive Statuses** (cannot add items):
- `served`: Order has been served
- `completed`: Order is complete and paid
- `cancelled`: Order was cancelled

## 🔔 Notifications

### Restaurant Notification

When items are added to an existing order:

**Notification Content**:
- Title: "Additional Items Added"
- Message: "Customer added items to Order #[ORDER_ID]"
- Order details with new items highlighted
- Updated order total

**Notification Trigger**:
- Created in `order_status_history` table
- Status: 'pending'
- Notes: "Additional items added to order"

## 📱 UI/UX Details

### Dialog Design

**Visual Elements**:
- Alert icon (⚠️) to draw attention
- Clear section headers with icons
- Existing order in muted background
- New items in highlighted primary color background
- Updated total in gradient background with large text
- Clear action buttons with icons

**Color Coding**:
- Existing order: Muted gray background
- New items: Primary color background (light tint)
- Updated total: Gradient background with primary color

**Responsive Design**:
- Mobile: Full-screen dialog with scrolling
- Desktop: Centered modal dialog
- Touch-friendly button sizes
- Clear visual hierarchy

### Button Actions

**Primary Button**: "Add to Existing Order"
- Icon: Plus (+)
- Style: Primary color, full width
- Action: Adds items and navigates to order tracking

**Secondary Button**: "Create New Separate Order"
- Icon: Shopping cart
- Style: Outline, full width
- Action: Proceeds to normal checkout

**Tertiary Button**: "Cancel"
- Style: Ghost, small, full width
- Action: Closes dialog, returns to menu

## 🧪 Testing Scenarios

### Test Case 1: Add to Existing Order
**Steps**:
1. Login as customer
2. Scan table QR code
3. Add items to cart and place order
4. Wait for order status to be 'pending' or 'preparing'
5. Add more items to cart
6. Click "Proceed to Checkout"
7. Dialog should appear
8. Click "Add to Existing Order"

**Expected Results**:
- ✅ Dialog shows existing order details
- ✅ Dialog shows new items
- ✅ Updated total is correct
- ✅ Items are added to existing order
- ✅ Order total is updated in database
- ✅ Success toast notification appears
- ✅ Cart is cleared
- ✅ Redirected to order tracking page
- ✅ Restaurant receives notification

### Test Case 2: Create New Order
**Steps**:
1-7. Same as Test Case 1
8. Click "Create New Separate Order"

**Expected Results**:
- ✅ Dialog closes
- ✅ Proceeds to normal checkout
- ✅ New order is created with new order ID
- ✅ Cart is not cleared until checkout completes

### Test Case 3: No Active Order
**Steps**:
1. Login as customer
2. Scan table QR code
3. Add items to cart
4. Click "Proceed to Checkout"

**Expected Results**:
- ✅ No dialog appears
- ✅ Proceeds directly to checkout
- ✅ Normal order creation flow

### Test Case 4: Completed Order
**Steps**:
1. Login as customer with a completed order
2. Add items to cart
3. Click "Proceed to Checkout"

**Expected Results**:
- ✅ No dialog appears (completed orders are not active)
- ✅ Proceeds directly to checkout
- ✅ Creates new order

### Test Case 5: Different Table
**Steps**:
1. Login as customer
2. Place order at Table 1
3. Scan QR code for Table 2
4. Add items to cart
5. Click "Proceed to Checkout"

**Expected Results**:
- ✅ Dialog appears (if table filter is not strict)
- OR
- ✅ No dialog appears (if table filter is strict)
- Behavior depends on implementation choice

### Test Case 6: Not Logged In
**Steps**:
1. Browse menu without logging in
2. Add items to cart
3. Click "Proceed to Checkout"

**Expected Results**:
- ✅ Redirected to login page
- ✅ Toast notification: "Login Required"

## 🎓 Usage Examples

### Example 1: Family Dining
**Scenario**: Family orders main course, then wants to add desserts later

**Flow**:
1. Initial order: 3 main courses
2. After eating, add 4 desserts to cart
3. System detects active order
4. Choose "Add to Existing Order"
5. Desserts added to same bill
6. Single payment at the end

### Example 2: Business Lunch
**Scenario**: Colleagues order lunch, then want to add drinks

**Flow**:
1. Initial order: 5 lunch items
2. During meal, add 5 drinks to cart
3. System detects active order
4. Choose "Add to Existing Order"
5. Drinks added to same order
6. Company pays single bill

### Example 3: Split Bill
**Scenario**: Friends want separate bills

**Flow**:
1. Friend A orders and pays
2. Friend B adds items to cart
3. System detects Friend A's order
4. Friend B chooses "Create New Separate Order"
5. Friend B gets separate bill
6. Each friend pays their own bill

## 🔍 Troubleshooting

### Issue: Dialog doesn't appear when it should

**Possible Causes**:
1. User not logged in
2. Order status is not 'pending' or 'preparing'
3. API error when checking for active orders

**Solutions**:
1. Check browser console for errors
2. Verify user authentication status
3. Check order status in database
4. Review API logs

### Issue: Items not added to existing order

**Possible Causes**:
1. Database permission error
2. Order ID mismatch
3. Invalid item data

**Solutions**:
1. Check database RLS policies
2. Verify order ID in request
3. Check order_items table structure
4. Review API error logs

### Issue: Order total incorrect

**Possible Causes**:
1. Price calculation error
2. Portion size not considered
3. Variant price not used

**Solutions**:
1. Verify getItemPrice() function
2. Check portion_size and variant_name fields
3. Review cart item structure

## 📈 Benefits

### For Customers
- ✅ Single bill for entire dining session
- ✅ Easy to add items without confusion
- ✅ Clear order history
- ✅ Flexibility to create separate orders if needed

### For Restaurants
- ✅ Easier order management
- ✅ Reduced confusion for kitchen staff
- ✅ Better order tracking
- ✅ Improved customer satisfaction
- ✅ Accurate order history

### For System
- ✅ Better data organization
- ✅ Accurate analytics
- ✅ Reduced duplicate orders
- ✅ Improved database efficiency

## 🚀 Future Enhancements

### Potential Improvements
1. **Time-based Auto-merge**: Automatically merge orders within X minutes
2. **Table-based Grouping**: Group all orders from same table
3. **Split Bill Feature**: Split items from single order into multiple bills
4. **Order Modification**: Allow removing items from active orders
5. **Batch Notifications**: Group multiple additions into single notification
6. **Order Notes**: Add notes when adding items (e.g., "For dessert")

## 📝 Summary

The "Add to Existing Order" feature significantly improves the restaurant ordering experience by:
- Detecting active orders automatically
- Giving customers control over order management
- Reducing confusion and errors
- Maintaining single bill per dining session
- Providing flexibility when needed

This feature is production-ready and fully integrated into the DineQR system.
