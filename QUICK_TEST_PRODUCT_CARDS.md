# Quick Test Guide - Product Cards Real-time Fix

## 1-Minute Test

### Setup (10 seconds)
1. Open Owner Dashboard
2. Open Browser Console (F12)
3. Look for: `[OwnerDashboard] Subscription status: SUBSCRIBED`

### Test (30 seconds)
1. In another tab, place an order as a customer with 2-3 items
2. Switch back to Owner Dashboard

### Verify (20 seconds)
✅ **Expected Results:**
- Order card appears within 1 second
- Order shows item names (e.g., "2x Margherita Pizza")
- Order shows item prices
- Console shows: `Orders with items: [{ id: 'xxx', items: 3 }]`
- Toast notification appears

❌ **If Items Don't Show:**
- Check console for errors
- Verify: `Orders with items` shows `items: 0` (means API issue)
- Hard refresh (Ctrl+Shift+R)

## Detailed Test (3 Minutes)

### Test 1: Single Order with Multiple Items (1 min)

**Steps:**
```
1. Owner Dashboard → Note current order count
2. Customer → Add 3 different items to cart
3. Customer → Place order
4. Owner Dashboard → Watch for update
```

**Expected:**
```
✅ Order card appears in < 1 second
✅ Shows all 3 items with names
✅ Shows quantities (1x, 2x, etc.)
✅ Shows prices for each item
✅ Shows total amount
✅ Console: "Orders with items: [{ id: 'xxx', items: 3 }]"
```

### Test 2: Multiple Orders (1 min)

**Steps:**
```
1. Owner Dashboard → Open
2. Customer Tab 1 → Place order with 2 items
3. Customer Tab 2 → Place order with 1 item
4. Customer Tab 3 → Place order with 4 items
```

**Expected:**
```
✅ All 3 orders appear in real-time
✅ Each order shows correct items
✅ No mixing of items between orders
✅ Console shows 3 separate order entries
```

### Test 3: Cross-Tab Sync (1 min)

**Steps:**
```
1. Open Owner Dashboard in Tab A
2. Open Owner Dashboard in Tab B
3. Place order as customer
4. Check both tabs
```

**Expected:**
```
✅ Both tabs update simultaneously
✅ Both show same order with items
✅ No refresh needed in either tab
✅ Both consoles show same logs
```

## Console Output Reference

### ✅ Good Output
```
[OwnerDashboard] Setting up real-time subscriptions for restaurant: abc-123
[OwnerDashboard] Subscription status: SUBSCRIBED
[OwnerDashboard] Received order change: { eventType: 'INSERT', ... }
[OwnerDashboard] Reloading data due to real-time update
[OwnerDashboard] Loaded orders: 5
[OwnerDashboard] Orders with items: [
  { id: 'abc12345', items: 3 },  ← Shows item count
  { id: 'def67890', items: 2 }
]
```

### ❌ Bad Output
```
[OwnerDashboard] Subscription status: CLOSED  ← Problem!
[OwnerDashboard] Orders with items: [
  { id: 'abc12345', items: 0 }  ← No items!
]
Error: Failed to load orders  ← API error!
```

## Visual Checklist

### Order Card Should Show:

```
┌─────────────────────────────────────┐
│ [PENDING]  ⏰ 2 mins ago            │
│ Order #abc12345                     │
│                           $45.99    │ ← Total
├─────────────────────────────────────┤
│ 👤 Table 5                          │
│                                     │
│ Items:                              │ ← Section header
│ 2x Margherita Pizza      $24.00    │ ← Item 1 ✅
│ 1x Caesar Salad          $12.00    │ ← Item 2 ✅
│ 1x Coca Cola             $3.99     │ ← Item 3 ✅
│ +2 more items                       │ ← If > 3 items
│                                     │
│ [View Details]                      │
└─────────────────────────────────────┘
```

### If Items Missing:

```
┌─────────────────────────────────────┐
│ [PENDING]  ⏰ 2 mins ago            │
│ Order #abc12345                     │
│                           $45.99    │
├─────────────────────────────────────┤
│ 👤 Table 5                          │
│                                     │
│ Items:                              │
│ (empty)                             │ ← ❌ Problem!
│                                     │
│ [View Details]                      │
└─────────────────────────────────────┘
```

## Troubleshooting Quick Reference

| Symptom | Cause | Solution |
|---------|-------|----------|
| No items showing | Stale closure (fixed) | Already fixed in this update |
| Console shows `items: 0` | API not fetching items | Check RLS policies |
| No real-time updates | Subscription failed | Check Supabase dashboard |
| Slow updates (> 5 sec) | Network latency | Check internet connection |
| Duplicate orders | Multiple subscriptions | Close extra dashboard tabs |

## Quick Fixes

### Fix 1: Hard Refresh
```
Press: Ctrl + Shift + R (Windows/Linux)
Press: Cmd + Shift + R (Mac)
```

### Fix 2: Clear Console
```
1. Open Console (F12)
2. Click "Clear console" icon
3. Reload page
4. Watch for subscription status
```

### Fix 3: Check Supabase
```
1. Go to Supabase Dashboard
2. Database → Realtime
3. Verify "order_items" is enabled
4. Check RLS policies allow SELECT
```

## Success Criteria

### ✅ Test Passes If:
1. Order cards appear in < 1 second
2. All items show with correct names
3. Quantities and prices are correct
4. Console shows `items: X` (X > 0)
5. No errors in console
6. Works across multiple tabs

### ❌ Test Fails If:
1. Items don't show (empty section)
2. Console shows `items: 0`
3. Requires manual refresh
4. Errors in console
5. Slow updates (> 5 seconds)

## Performance Benchmarks

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Update Time | < 1 sec | < 3 sec | > 5 sec |
| Item Load | 100% | 100% | < 100% |
| Console Errors | 0 | 0 | > 0 |
| Cross-Tab Sync | < 1 sec | < 3 sec | > 5 sec |

## Report Template

If you find issues, report using this template:

```
**Issue:** Product cards not showing in real-time

**Steps to Reproduce:**
1. Open Owner Dashboard
2. Place order with 3 items
3. Check dashboard

**Expected:** Items show immediately
**Actual:** Items don't show / show after refresh

**Console Output:**
[Paste console logs here]

**Browser:** Chrome 120 / Firefox 121 / Safari 17
**Device:** Desktop / Mobile
**Network:** Fast / Slow / Offline
```

---

**Status:** Test Ready ✅
**Estimated Time:** 1-3 minutes
**Difficulty:** Easy
**Prerequisites:** Owner account, Customer account
