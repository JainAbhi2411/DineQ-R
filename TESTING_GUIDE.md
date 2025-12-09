# Testing Guide for Checkout Flow

## Prerequisites
Before testing the checkout flow, ensure you have:
1. At least one restaurant in the database
2. Menu items added to that restaurant
3. (Optional) A user account for testing authenticated checkout

## Test Scenarios

### Scenario 1: Guest Checkout with Cash on Counter (COC)
**Steps:**
1. Navigate to a restaurant's menu page (e.g., `/customer/menu/:restaurantId?table=:tableId`)
2. Add items to cart by clicking on menu items
3. Click the shopping cart icon in the top right
4. Review cart items in the drawer
5. Click "Proceed to Checkout"
6. **Expected:** Should navigate to `/customer/checkout/:restaurantId?table=:tableId`
7. Review order details
8. Select "Cash on Counter" payment method
9. (Optional) Add special instructions
10. Click "Place Order"
11. **Expected:** 
    - Success toast: "Order Placed Successfully!"
    - Navigate to `/order-tracking/:orderId`
    - Order status shows "pending"
    - Payment status shows "pending"

### Scenario 2: Authenticated Checkout with Online Payment
**Steps:**
1. Login to the application
2. Navigate to a restaurant's menu page
3. Add items to cart
4. Click "Proceed to Checkout"
5. **Expected:** Should navigate to checkout page with cart data
6. Select "Online Payment" method
7. Click "Place Order"
8. **Expected:**
    - If STRIPE_SECRET_KEY is valid:
      - New tab opens with Stripe checkout page
      - Current tab navigates to `/customer/orders`
    - If STRIPE_SECRET_KEY is placeholder:
      - Error toast with Stripe error message
      - Order still created in database with "processing" status

### Scenario 3: Order Tracking
**Steps:**
1. After placing an order (COC or Online)
2. Navigate to `/order-tracking/:orderId`
3. **Expected:**
    - Order details displayed
    - Progress bar showing current status
    - All order items listed with images
    - Total amount displayed
    - Page auto-refreshes every 10 seconds

### Scenario 4: Order History with Tracking
**Steps:**
1. Login to the application
2. Navigate to `/customer/orders`
3. **Expected:** List of all your orders
4. Click "Track Order" button on any order
5. **Expected:** Navigate to order tracking page for that order

## Common Issues and Solutions

### Issue: "Proceed to Checkout" button not working
**Solution:** 
- The navigation has been fixed to include restaurantId in the URL
- Ensure cart has items before clicking checkout
- Check browser console for any errors

### Issue: Checkout page shows "Cart is Empty"
**Solution:**
- Don't refresh the page after clicking "Proceed to Checkout"
- Cart data is passed via navigation state

### Issue: Online payment fails
**Solution:**
- Update STRIPE_SECRET_KEY in Supabase secrets with actual Stripe key
- Current placeholder value will cause errors

## Manual Testing Checklist

- [ ] Can add items to cart
- [ ] Cart drawer shows correct items and total
- [ ] "Proceed to Checkout" navigates to checkout page with restaurantId
- [ ] Checkout page displays all cart items
- [ ] Can select payment method (COC/Online)
- [ ] Can add special instructions
- [ ] COC order creates successfully
- [ ] COC order redirects to tracking page
- [ ] Order tracking page displays order details
- [ ] Order tracking page auto-refreshes
- [ ] Order history shows all orders
- [ ] "Track Order" button works from order history

## What Was Fixed

1. **Navigation URL**: Updated `handleCheckout` in MenuBrowsing.tsx to include restaurantId in the URL path
2. **Table ID Handling**: Updated Checkout.tsx to accept tableId from both URL params and navigation state
3. **Order History**: Added "Track Order" button to each order card

The checkout flow should now work correctly!
