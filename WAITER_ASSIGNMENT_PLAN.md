# Waiter Assignment Feature - Implementation Plan

## Feature Overview
Restaurant owners can assign waiters to orders for better service management and accountability.

## Requirements

### 1. Waiter Management
- Owner can add/edit/delete waiters
- Each waiter belongs to a specific restaurant
- Waiter information: name, phone, status (active/inactive)

### 2. Order Assignment
- Owner can assign waiter to any order
- Assignment can be changed anytime
- Waiter name shows in order details

### 3. Display
- Show assigned waiter in order list
- Show assigned waiter in order details
- Filter orders by waiter (optional)

## Implementation Steps

### Step 1: Database Schema ✅
- [ ] Create `waiters` table
  - id (uuid, primary key)
  - restaurant_id (uuid, foreign key)
  - name (text, not null)
  - phone (text)
  - status (text, default 'active')
  - created_at (timestamptz)
  
- [ ] Add `waiter_id` to `orders` table
  - waiter_id (uuid, foreign key to waiters, nullable)
  
- [ ] Create RLS policies
  - Owners can manage their restaurant's waiters
  - Anyone can view active waiters

### Step 2: TypeScript Types ✅
- [ ] Add Waiter interface to types.ts
- [ ] Update Order interface with waiter_id

### Step 3: API Functions ✅
- [ ] waiterApi.getWaitersByRestaurant(restaurantId)
- [ ] waiterApi.createWaiter(waiter)
- [ ] waiterApi.updateWaiter(id, updates)
- [ ] waiterApi.deleteWaiter(id)
- [ ] orderApi.assignWaiter(orderId, waiterId)

### Step 4: UI Components ✅
- [ ] WaiterManagement page (owner)
  - List all waiters
  - Add new waiter dialog
  - Edit waiter dialog
  - Delete confirmation
  
- [ ] Waiter assignment in OrderManagement
  - Dropdown to select waiter
  - Show assigned waiter
  - Update assignment

### Step 5: Integration ✅
- [ ] Add waiter info to order queries
- [ ] Display waiter in order list
- [ ] Display waiter in order details
- [ ] Add navigation to waiter management

## User Flow

### Owner - Manage Waiters:
```
1. Go to Restaurant Dashboard
2. Click "Staff Management" or "Waiters"
3. See list of all waiters
4. Click "Add Waiter"
5. Enter name, phone
6. Save
7. Waiter appears in list
```

### Owner - Assign Waiter to Order:
```
1. Go to Order Management
2. See list of orders
3. Click on order or use dropdown
4. Select waiter from dropdown
5. Waiter assigned
6. Waiter name shows in order details
```

## Database Schema

### Waiters Table:
```sql
CREATE TABLE waiters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);
```

### Orders Table Update:
```sql
ALTER TABLE orders 
ADD COLUMN waiter_id uuid REFERENCES waiters(id) ON DELETE SET NULL;
```

## UI Mockup

### Waiter Management Page:
```
┌─────────────────────────────────────────┐
│ Staff Management                         │
├─────────────────────────────────────────┤
│ [+ Add Waiter]                          │
│                                          │
│ ┌────────────────────────────────────┐ │
│ │ Name: John Doe                      │ │
│ │ Phone: +91 98765 43210             │ │
│ │ Status: Active                      │ │
│ │ [Edit] [Delete]                     │ │
│ └────────────────────────────────────┘ │
│                                          │
│ ┌────────────────────────────────────┐ │
│ │ Name: Jane Smith                    │ │
│ │ Phone: +91 98765 43211             │ │
│ │ Status: Active                      │ │
│ │ [Edit] [Delete]                     │ │
│ └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Order with Waiter Assignment:
```
┌─────────────────────────────────────────┐
│ Order #1234                              │
├─────────────────────────────────────────┤
│ Table: 5                                 │
│ Status: Preparing                        │
│ Total: ₹450                             │
│                                          │
│ Assigned Waiter:                        │
│ [Select Waiter ▼] → John Doe           │
│                                          │
│ Items:                                   │
│ - Dal Fry x1                            │
│ - Paneer Masala x1                      │
└─────────────────────────────────────────┘
```

## Success Criteria

- [x] Owner can add/edit/delete waiters
- [x] Owner can assign waiter to order
- [x] Waiter name shows in order details
- [x] All features work seamlessly
- [x] Code passes linting
- [x] Responsive design

## Notes
- Waiter assignment is optional (can be null)
- Only active waiters show in assignment dropdown
- Deleting waiter doesn't delete orders (ON DELETE SET NULL)
- Owner can change waiter assignment anytime
