# Real-time Updates Troubleshooting

## Issue: Not Seeing Real-time Updates

### Step 1: Verify You're on the Correct Page

**Check the URL in your browser:**

✅ **Correct URL (Real-time works):**
```
http://localhost:5173/customer/menu/:restaurantId
```
Example: `http://localhost:5173/customer/menu/abc-123-def-456`

❌ **Wrong URLs (Real-time won't work):**
```
http://localhost:5173/customer/dashboard
http://localhost:5173/customer/restaurants
http://localhost:5173/customer/orders
```

### Step 2: Open Browser Console

1. Press `F12` (or Right-click → Inspect)
2. Click on **Console** tab
3. Look for these messages:

**✅ If you see this - Real-time is working:**
```
[MenuBrowsing] Setting up real-time subscriptions for restaurant: abc-123
[MenuBrowsing] Menu items subscription status: SUBSCRIBED
[MenuBrowsing] ✅ Successfully subscribed to menu items changes
```

**❌ If you see nothing - You're not on the menu page:**
- Check your URL
- Navigate to: Customer Dashboard → Scan QR → Select Restaurant
- Or go directly to: `/customer/menu/:restaurantId`

### Step 3: Test Real-time Updates

**Once you're on the correct page with subscriptions active:**

1. Keep the customer menu page open
2. Open owner dashboard in another tab
3. Edit a menu item (change price or preparation time)
4. Click "Save"

**Expected Result:**
- Customer console shows: `[MenuBrowsing] Menu item change detected`
- Toast notification appears
- UI updates automatically

### Step 4: Common Issues

#### Issue 1: Opened Menu from Order History

**Problem:** Clicking on an order doesn't navigate to menu page

**Solution:** 
- Use the QR scanner to access the menu
- Or navigate directly to `/customer/menu/:restaurantId`

#### Issue 2: Opened Menu from "Last Visited"

**Problem:** There's no "last visited" feature yet

**Solution:**
- Use QR scanner to access restaurant menu
- Or browse restaurants and select one

#### Issue 3: Console Shows No Messages

**Problem:** Page loaded but no subscription messages

**Solution:**
1. Refresh the page (F5)
2. Check for JavaScript errors (red text in console)
3. Verify you're logged in as a customer

#### Issue 4: Subscription Status is "CLOSED" or "CHANNEL_ERROR"

**Problem:** Connection failed

**Solution:**
1. Check internet connection
2. Verify Supabase is running
3. Check Supabase real-time is enabled

### Step 5: Manual Test

**To manually test if you're on the right page:**

1. Open browser console
2. Type this command:
```javascript
console.log('Current path:', window.location.pathname);
```

3. Check the output:
   - ✅ Should be: `/customer/menu/abc-123-def-456`
   - ❌ If different: Navigate to the menu page

### Step 6: Force Navigation to Menu

**If you want to test real-time updates:**

1. Get a restaurant ID from owner dashboard
2. Navigate to: `http://localhost:5173/customer/menu/[RESTAURANT_ID]`
3. Replace `[RESTAURANT_ID]` with actual ID
4. Check console for subscription messages

### Quick Verification Checklist

```
□ URL contains "/customer/menu/"
□ URL has restaurant ID after "/menu/"
□ Console shows "[MenuBrowsing]" messages
□ Console shows "SUBSCRIBED" status
□ No JavaScript errors in console
□ Logged in as customer
□ Internet connection is stable
```

### How to Access Menu Correctly

**Method 1: QR Scanner (Recommended)**
```
1. Go to Customer Dashboard
2. Click "Open Scanner" or "Scan QR Code"
3. Scan a table QR code
4. Menu page opens with real-time enabled
```

**Method 2: Direct URL**
```
1. Get restaurant ID from owner dashboard
2. Navigate to: /customer/menu/:restaurantId
3. Real-time subscriptions will activate
```

**Method 3: Browse Restaurants**
```
1. Go to Customer Dashboard
2. Click "Browse Restaurants"
3. Select a restaurant
4. Click "View Menu"
5. Menu page opens with real-time enabled
```

### Debug Commands

**Run these in browser console to debug:**

```javascript
// Check current page
console.log('Path:', window.location.pathname);

// Check if on menu page
console.log('On menu page:', window.location.pathname.includes('/customer/menu/'));

// Get restaurant ID
const restaurantId = window.location.pathname.split('/').pop();
console.log('Restaurant ID:', restaurantId);

// Check for subscription logs
console.log('Look for [MenuBrowsing] messages above');
```

### Expected Console Output

**When real-time is working correctly:**

```
[MenuBrowsing] Setting up real-time subscriptions for restaurant: abc-123-def-456
[MenuBrowsing] Menu items subscription status: SUBSCRIBED
[MenuBrowsing] ✅ Successfully subscribed to menu items changes
[MenuBrowsing] Categories subscription status: SUBSCRIBED
[MenuBrowsing] ✅ Successfully subscribed to categories changes

// After owner makes changes:
[MenuBrowsing] Menu item change detected: {
  eventType: "UPDATE",
  table: "menu_items",
  timestamp: "2024-12-05T..."
}
[MenuBrowsing] Full payload: {...}
[MenuBrowsing] Item updated: {
  id: "...",
  name: "Pasta",
  oldPreparationTime: 15,
  newPreparationTime: 20,
  ...
}
[MenuBrowsing] Menu items updated successfully, count: 25
[MenuBrowsing] Updated item at index: 5
```

### Still Not Working?

**If you've verified all the above and it's still not working:**

1. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Clear cache and reload

2. **Hard refresh:**
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

3. **Check Supabase real-time:**
   - Go to Supabase Dashboard
   - Database → Replication
   - Verify `menu_items` table has replication enabled

4. **Restart development server:**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again
   - Reload the page

### Summary

**Real-time updates ONLY work on:**
- `/customer/menu/:restaurantId` page

**Real-time updates DO NOT work on:**
- Customer Dashboard
- Order History
- Browse Restaurants
- Any other page

**To see real-time updates:**
1. Navigate to `/customer/menu/:restaurantId`
2. Check console for subscription messages
3. Make changes in owner dashboard
4. Watch updates appear instantly

---

**Status:** Ready for Testing
**Last Updated:** December 5, 2024
