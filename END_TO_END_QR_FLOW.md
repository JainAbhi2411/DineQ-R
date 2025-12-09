# End-to-End QR Code Flow Testing

## Complete Customer Journey with QR Scanner

### Scenario: Customer Visits Restaurant

**Time:** ~2 minutes
**Devices Needed:** 
- Mobile phone with camera
- Printed QR code (from owner dashboard)

---

## Step-by-Step Flow

### 1. Restaurant Owner Setup (One-time)

**Time:** 30 seconds

```
1. Owner logs in to dashboard
2. Navigates to "Tables" section
3. Clicks on a table (e.g., Table 5)
4. Sees QR code displayed
5. Clicks "Download QR Code" button
6. Prints QR code
7. Places printed QR code on Table 5
```

**Verification:**
- ✅ QR code downloaded as image
- ✅ QR code contains table ID
- ✅ QR code is scannable

---

### 2. Customer Arrives at Restaurant

**Time:** 10 seconds

```
1. Customer sits at Table 5
2. Sees QR code on table
3. Takes out smartphone
4. Opens restaurant app
```

**Verification:**
- ✅ QR code visible on table
- ✅ App opens on mobile device

---

### 3. Customer Scans QR Code

**Time:** 30 seconds

#### Option A: Camera Scan (Recommended)

```
1. Customer taps "Scan QR" in navigation
   → Page loads with camera button

2. Customer taps "Open Camera to Scan" button
   → Camera permission dialog appears

3. Customer taps "Allow" on permission dialog
   → Camera opens in fullscreen
   → Video stream shows

4. Customer points camera at QR code on table
   → Scanning indicator shows
   → QR code detected automatically (1-2 sec)

5. Scanner closes automatically
   → Success toast: "Opening menu for Table 5"
   → Navigates to menu page

6. Menu page loads
   → Shows restaurant name
   → Shows "Table 5" badge
   → Shows menu items
```

**Verification:**
- ✅ Camera button visible on mobile
- ✅ Permission dialog appears
- ✅ Camera opens successfully
- ✅ Video stream displays
- ✅ QR code detected < 2 seconds
- ✅ Scanner closes automatically
- ✅ Success message shows
- ✅ Menu page loads
- ✅ Table badge shows "Table 5"

#### Option B: Manual Entry (Fallback)

```
1. Customer taps "Scan QR" in navigation
2. Scrolls to "Or enter code manually"
3. Types QR code text from table
4. Taps "Continue" button
5. Menu page loads with Table 5 selected
```

**Verification:**
- ✅ Manual input field works
- ✅ Continue button enabled
- ✅ Same result as camera scan

---

### 4. Customer Browses Menu

**Time:** 2 minutes

```
1. Customer sees menu categories
2. Browses through items
3. Sees food images, prices, descriptions
4. Table badge remains visible: "Table 5"
```

**Verification:**
- ✅ Menu items display correctly
- ✅ Categories work
- ✅ Images load
- ✅ Prices show
- ✅ Table badge persists

---

### 5. Customer Places Order

**Time:** 1 minute

```
1. Customer taps "Add to Cart" on items
2. Cart icon shows item count
3. Customer taps cart icon
4. Reviews order
5. Taps "Place Order" button
6. Order submitted
7. Success message appears
```

**Verification:**
- ✅ Items added to cart
- ✅ Cart count updates
- ✅ Order review shows items
- ✅ Table 5 included in order
- ✅ Order submitted successfully

---

### 6. Owner Receives Order

**Time:** Instant

```
1. Owner dashboard updates in real-time
2. New order card appears
3. Shows "Table 5"
4. Shows ordered items with images
5. Shows customer name
6. Toast notification: "New Order Received!"
```

**Verification:**
- ✅ Order appears in < 1 second
- ✅ Table number correct
- ✅ Items display with images
- ✅ Customer info correct
- ✅ Notification shows

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    RESTAURANT OWNER                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Create Tables   │
                  │  Generate QR     │
                  │  Print & Place   │
                  └──────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       CUSTOMER                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Sits at Table   │
                  │  Sees QR Code    │
                  └──────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Opens App       │
                  │  Taps "Scan QR"  │
                  └──────────────────┘
                            │
                            ↓
        ┌───────────────────┴───────────────────┐
        │                                       │
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│  Camera Scan     │                  │  Manual Entry    │
│  (Mobile)        │                  │  (All Devices)   │
└──────────────────┘                  └──────────────────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            ↓
                  ┌──────────────────┐
                  │  Validate QR     │
                  │  Get Table Info  │
                  └──────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Load Menu       │
                  │  Show Table #    │
                  └──────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Browse Items    │
                  │  Add to Cart     │
                  └──────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Place Order     │
                  │  Include Table # │
                  └──────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    RESTAURANT OWNER                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Receive Order   │
                  │  See Table #     │
                  │  See Items       │
                  └──────────────────┘
                            │
                            ↓
                  ┌──────────────────┐
                  │  Prepare Food    │
                  │  Serve to Table  │
                  └──────────────────┘
```

---

## Testing Checklist

### Pre-Test Setup
- [ ] Owner account created
- [ ] Restaurant profile complete
- [ ] Menu items added with images
- [ ] Tables created
- [ ] QR codes generated
- [ ] QR codes printed
- [ ] Customer account created

### Camera Scan Test (Mobile)
- [ ] Open app on mobile device
- [ ] Navigate to "Scan QR" page
- [ ] Camera button visible
- [ ] Tap camera button
- [ ] Grant permission
- [ ] Camera opens
- [ ] Video stream shows
- [ ] Point at QR code
- [ ] QR detected < 2 seconds
- [ ] Scanner closes
- [ ] Success message shows
- [ ] Menu loads
- [ ] Table badge shows correct number

### Manual Entry Test
- [ ] Open "Scan QR" page
- [ ] Scroll to manual entry
- [ ] Enter QR code text
- [ ] Tap Continue
- [ ] Menu loads
- [ ] Table badge shows

### Desktop Test
- [ ] Open app on desktop
- [ ] Navigate to "Scan QR"
- [ ] Desktop message shows
- [ ] No camera button
- [ ] Manual entry works

### Order Flow Test
- [ ] Add items to cart
- [ ] Cart count updates
- [ ] Review order
- [ ] Place order
- [ ] Success message
- [ ] Order includes table number

### Owner Dashboard Test
- [ ] Order appears in real-time
- [ ] Table number correct
- [ ] Items show with images
- [ ] Customer info correct
- [ ] Notification appears

---

## Common Issues & Solutions

### Issue 1: Camera Button Not Showing

**Symptoms:**
- Desktop message shows on mobile
- No camera button

**Causes:**
- Browser user agent not detected
- Screen size too large
- Touch not detected

**Solutions:**
1. Refresh page
2. Check device is actually mobile
3. Try different browser
4. Use manual entry

---

### Issue 2: Camera Won't Open

**Symptoms:**
- Black screen
- Error message
- Permission denied

**Causes:**
- Camera permission denied
- Camera in use by another app
- Browser doesn't support camera
- Not using HTTPS

**Solutions:**
1. Grant camera permission in settings
2. Close other apps using camera
3. Update browser
4. Ensure HTTPS is used
5. Use manual entry

---

### Issue 3: QR Code Not Detected

**Symptoms:**
- Camera shows but no detection
- Scanning indicator shows but nothing happens

**Causes:**
- QR code too far
- Poor lighting
- QR code damaged
- Wrong QR format

**Solutions:**
1. Move camera closer
2. Improve lighting
3. Hold steady
4. Try different angle
5. Use manual entry

---

### Issue 4: Wrong Table Loaded

**Symptoms:**
- Menu loads but wrong table number
- Table badge shows different number

**Causes:**
- Scanned wrong QR code
- QR code mislabeled
- Database mismatch

**Solutions:**
1. Verify QR code on correct table
2. Check table number in owner dashboard
3. Re-generate QR code
4. Use manual entry with correct code

---

## Performance Benchmarks

### Target Times

| Action | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Camera open | < 1 sec | < 2 sec | > 3 sec |
| QR detection | < 1 sec | < 2 sec | > 3 sec |
| Menu load | < 1 sec | < 2 sec | > 3 sec |
| Total flow | < 3 sec | < 5 sec | > 7 sec |

### Actual Performance

Test on your device and record:

| Action | Time | Status |
|--------|------|--------|
| Camera open | ___ sec | ✅/❌ |
| QR detection | ___ sec | ✅/❌ |
| Menu load | ___ sec | ✅/❌ |
| Total flow | ___ sec | ✅/❌ |

---

## Success Criteria

### ✅ Test Passes If:

1. **Mobile Camera Scan:**
   - Camera button visible on mobile
   - Camera opens successfully
   - QR code detected < 2 seconds
   - Menu loads with correct table

2. **Manual Entry:**
   - Input field works
   - Validation works
   - Same result as camera scan

3. **Desktop Fallback:**
   - Shows appropriate message
   - Manual entry available
   - No camera button

4. **Order Flow:**
   - Table number included in order
   - Owner sees correct table
   - Real-time updates work

5. **Error Handling:**
   - Invalid QR shows error
   - Permission denied handled
   - Network errors handled

### ❌ Test Fails If:

- Camera button not showing on mobile
- Camera won't open
- QR codes not detected
- Wrong table loaded
- Order missing table number
- Real-time updates not working
- Errors not handled gracefully

---

## Report Template

**Test Date:** ___________
**Tester:** ___________
**Device:** ___________
**Browser:** ___________

### Results:

**Camera Scan:** ✅ Pass / ❌ Fail
- Notes: ___________

**Manual Entry:** ✅ Pass / ❌ Fail
- Notes: ___________

**Desktop View:** ✅ Pass / ❌ Fail
- Notes: ___________

**Order Flow:** ✅ Pass / ❌ Fail
- Notes: ___________

**Performance:**
- Camera open: ___ sec
- QR detection: ___ sec
- Total flow: ___ sec

**Issues Found:**
1. ___________
2. ___________

**Overall Status:** ✅ Pass / ❌ Fail

---

**Total Test Time:** 5-10 minutes
**Difficulty:** Easy
**Prerequisites:** Mobile device, printed QR code
**Status:** Ready for Testing ✅
