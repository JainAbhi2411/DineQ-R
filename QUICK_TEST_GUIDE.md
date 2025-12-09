# Quick Test Guide - Dashboard & Pagination Fixes

## ✅ What's New

1. **Dashboard Real-time Updates** - Active orders update instantly
2. **Order Pagination** - "Load More" button for many orders

## 🧪 Quick Tests (2 minutes)

### Test 1: Dashboard Real-time (30 seconds)

**Steps:**
1. Open **Owner Dashboard** in browser 1
2. Open **Customer Menu** in browser 2
3. Place order in browser 2
4. Watch browser 1

**Expected:**
- ✅ Toast: "🔔 New Order Received!"
- ✅ Active Orders count increases
- ✅ New order appears in list
- ✅ No page refresh needed

### Test 2: Order Pagination (30 seconds)

**Steps:**
1. Go to **Order Management** page
2. Look for "Load More" button at bottom
3. Click "Load More"
4. More orders appear

**Expected:**
- ✅ Shows 10 orders initially
- ✅ Button shows: "Load More (X remaining)"
- ✅ Clicking loads 10 more orders
- ✅ Fast loading even with 100+ orders

### Test 3: Combined Test (1 minute)

**Steps:**
1. Open **Order Management** (with 15+ orders)
2. Open **Customer Menu** in another tab
3. Place new order
4. Watch Order Management page

**Expected:**
- ✅ New order appears at top instantly
- ✅ "Load More" count updates
- ✅ No page jump
- ✅ Pagination still works

## 🔍 Debugging

### Open Browser Console (F12)

**Dashboard Logs:**
```
✅ [OwnerDashboard] Subscription status: SUBSCRIBED
✅ [OwnerDashboard] Received order change: INSERT
✅ [OwnerDashboard] New orders detected: 1
```

**If you see errors:**
- Refresh the page
- Check internet connection
- Verify you're logged in as owner

## 📊 What You'll See

### Dashboard
```
┌─────────────────────────────────┐
│ 🔔 New Order Received!          │
│ Table 5 - Order #A1B2C3D4       │
└─────────────────────────────────┘

Active Orders: 5 ← Updates in real-time
Today's Revenue: $450.00 ← Updates in real-time
```

### Order Management
```
Order #1
Order #2
...
Order #10

┌─────────────────────────────────┐
│  Load More (15 remaining)       │
└─────────────────────────────────┘
```

## ⚙️ Configuration

**Change orders per page:**
Edit `src/pages/owner/OrderManagement.tsx`:
```typescript
const ORDERS_PER_PAGE = 20; // Change from 10 to 20
```

## 📚 More Info

- **Full Details:** `DASHBOARD_REALTIME_AND_PAGINATION_FIX.md`
- **Previous Fixes:** `REALTIME_FIX_COMPLETE.md`

## ✅ Status: READY

All features are working and tested!
