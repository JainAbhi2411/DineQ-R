# Bill Generation Feature - Quick Test Guide

## 🚀 Quick Test Steps

### Test 1: Customer View Bill from Order Tracking

1. **Login as Customer**
   - Navigate to login page
   - Login with customer credentials

2. **Place a Test Order**
   - Scan QR code or browse restaurants
   - Add 2-3 items to cart
   - Apply a promo code (if available)
   - Complete checkout

3. **Navigate to Order Tracking**
   - Go to "My Orders"
   - Click on the recent order
   - Or use direct URL: `/customer/orders/:orderId`

4. **View Bill**
   - Scroll to bottom of order details
   - Click "View Detailed Bill" button
   - Bill modal should open

5. **Verify Bill Contents**
   - ✓ Restaurant name and details
   - ✓ Invoice number and date
   - ✓ Customer information
   - ✓ Table number
   - ✓ All order items with correct prices
   - ✓ Variant and portion information
   - ✓ Subtotal calculation
   - ✓ Discount (if applied)
   - ✓ CGST (2.5%)
   - ✓ SGST (2.5%)
   - ✓ Grand total
   - ✓ Payment method
   - ✓ Payment status badge
   - ✓ QR code
   - ✓ Terms & conditions

6. **Test Print**
   - Click "Print Bill" button
   - Print dialog should open
   - Preview should show clean layout
   - No UI buttons in preview
   - Cancel or print

7. **Test Download**
   - Click "Download PDF" button
   - Button should show "Downloading..."
   - PDF should download (1-2 seconds)
   - Check Downloads folder
   - Open PDF and verify contents
   - Filename: `bill-[ORDER_ID].pdf`

### Test 2: Customer View Bill from Order History

1. **Navigate to Order History**
   - Go to "My Orders" page
   - View list of all orders

2. **Expand Completed Order**
   - Find a completed order
   - Click to expand order card
   - Look for "Print E-Bill" button

3. **Open Bill**
   - Click "Print E-Bill" button
   - Bill modal should open

4. **Verify and Test**
   - Verify all bill contents
   - Test print functionality
   - Test PDF download

### Test 3: Owner View Bill

1. **Login as Restaurant Owner**
   - Navigate to login page
   - Login with owner credentials

2. **Navigate to Order Management**
   - Go to restaurant dashboard
   - Click "Orders" or "Order Management"
   - View list of orders

3. **Expand Completed Order**
   - Find a completed order
   - Click to expand order card
   - Look for "Print E-Bill" button

4. **Open Bill**
   - Click "Print E-Bill" button
   - Bill modal should open

5. **Verify Owner View**
   - ✓ Customer details visible
   - ✓ All order information
   - ✓ Payment status
   - ✓ Waiter assignment (if any)

6. **Test Actions**
   - Test print functionality
   - Test PDF download

### Test 4: Bill with Different Scenarios

#### Scenario A: Order with Discount
1. Place order with promo code
2. View bill
3. Verify discount line appears
4. Verify promo code shown
5. Verify calculations correct

#### Scenario B: Order with Variants
1. Add items with variants (size, type)
2. Complete order
3. View bill
4. Verify variant names shown
5. Verify correct prices

#### Scenario C: Order with Portions
1. Add items with half/full portions
2. Complete order
3. View bill
4. Verify portion sizes shown
5. Verify half-price calculation

#### Scenario D: Order with Special Instructions
1. Add special instructions during checkout
2. Complete order
3. View bill
4. Verify instructions appear in bill

#### Scenario E: Walk-in Order (No Table)
1. Create order without table
2. View bill
3. Verify shows "Takeaway"
4. Verify no table number

#### Scenario F: Cash on Collection
1. Place order with COC payment
2. View bill
3. Verify payment method shows "Cash on Collection"
4. Verify payment status

### Test 5: PDF Quality Check

1. **Download PDF**
   - Generate and download bill PDF

2. **Open PDF**
   - Open in PDF reader

3. **Verify Quality**
   - ✓ Text is clear and readable
   - ✓ No blurry text
   - ✓ QR code is scannable
   - ✓ Layout is proper
   - ✓ No cut-off content
   - ✓ Colors are correct
   - ✓ All sections visible

4. **Test QR Code**
   - Use phone to scan QR code
   - Should show order ID

### Test 6: Print Quality Check

1. **Open Print Preview**
   - Click "Print Bill"
   - View print preview

2. **Verify Print Layout**
   - ✓ No UI buttons visible
   - ✓ Clean layout
   - ✓ Proper margins
   - ✓ Content fits on page
   - ✓ No unnecessary elements
   - ✓ Professional appearance

3. **Test Print Settings**
   - Try different paper sizes
   - Try portrait/landscape
   - Verify layout adapts

### Test 7: Error Handling

1. **Test with Missing Data**
   - View bill for order with minimal data
   - Should handle gracefully
   - No errors in console

2. **Test PDF Generation Failure**
   - Open browser console
   - Watch for errors during download
   - Should show error toast if fails

3. **Test Network Issues**
   - Disable network briefly
   - Try to view bill
   - Should show appropriate error

## ✅ Expected Results

### Bill Display
- ✓ Modal opens smoothly
- ✓ All sections render correctly
- ✓ Calculations are accurate
- ✓ QR code displays
- ✓ Responsive layout

### Print Functionality
- ✓ Print dialog opens
- ✓ Clean print preview
- ✓ No UI elements in print
- ✓ Professional format

### PDF Download
- ✓ PDF generates successfully
- ✓ Download starts automatically
- ✓ Correct filename
- ✓ High quality output
- ✓ All content included

### Calculations
- ✓ Subtotal = Sum of items
- ✓ Discount applied correctly
- ✓ CGST = 2.5% of subtotal after discount
- ✓ SGST = 2.5% of subtotal after discount
- ✓ Grand Total = Subtotal - Discount + Tax

### User Experience
- ✓ Fast loading
- ✓ Smooth interactions
- ✓ Clear notifications
- ✓ Intuitive buttons
- ✓ Professional appearance

## 🐛 Common Issues to Check

### Issue 1: PDF Not Downloading
**Symptoms**: Click download but nothing happens
**Check**:
- Browser console for errors
- Popup blocker settings
- Browser permissions
- Network connection

### Issue 2: Print Layout Broken
**Symptoms**: Print preview looks wrong
**Check**:
- Browser compatibility (use Chrome/Edge)
- Print CSS styles
- Page margins
- Content overflow

### Issue 3: Missing Information
**Symptoms**: Some fields are empty
**Check**:
- Order data completeness
- Restaurant profile setup
- Customer profile data
- Database records

### Issue 4: Wrong Calculations
**Symptoms**: Totals don't match
**Check**:
- Item prices
- Discount amount
- Tax percentages
- Rounding issues

### Issue 5: QR Code Not Showing
**Symptoms**: QR code area is blank
**Check**:
- QRCode library loaded
- Order ID exists
- Console errors
- Network issues

## 📊 Test Checklist

```
Customer Tests:
□ View bill from order tracking
□ View bill from order history
□ Print bill
□ Download PDF
□ Verify all details
□ Test with discount
□ Test with variants
□ Test with portions

Owner Tests:
□ View bill from order management
□ Print bill
□ Download PDF
□ Verify customer details
□ Test multiple orders

Quality Tests:
□ PDF quality check
□ Print quality check
□ QR code scan test
□ Calculation accuracy
□ Responsive layout

Error Tests:
□ Missing data handling
□ Network error handling
□ PDF generation error
□ Print error handling
```

## 🎯 Success Criteria

All tests should pass with:
- ✓ No console errors
- ✓ Accurate calculations
- ✓ Professional appearance
- ✓ Fast performance
- ✓ Smooth user experience
- ✓ Proper error handling
- ✓ High-quality output

## 📝 Test Report Template

```
Test Date: ___________
Tester: ___________

Customer View Bill: PASS / FAIL
Owner View Bill: PASS / FAIL
Print Functionality: PASS / FAIL
PDF Download: PASS / FAIL
Calculations: PASS / FAIL
QR Code: PASS / FAIL
Responsive Design: PASS / FAIL
Error Handling: PASS / FAIL

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
___________
```

---

**Quick Test Guide Version**: 1.0.0
**Last Updated**: December 2025
