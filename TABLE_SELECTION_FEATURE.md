# Manual Table Selection Feature

## Feature Overview ✅

**New Feature:** Customers can now create orders without scanning a QR code by manually entering their table number.

**Use Case:** When customers have visited the restaurant before and know the menu URL, they can directly access the menu and select their table number manually instead of scanning the QR code again.

## How It Works

### Customer Flow

#### Option 1: Scan QR Code (Existing)
```
1. Customer scans QR code on table
2. QR code contains table ID
3. Menu opens with table pre-selected
4. Customer browses menu and adds items
5. Proceeds to checkout
```

#### Option 2: Manual Table Selection (NEW)
```
1. Customer visits restaurant menu directly (bookmark/link)
2. Menu opens without table selection
3. Customer browses menu and adds items to cart
4. Clicks "Proceed to Checkout"
5. Table Selection Dialog appears
6. Customer selects their table number
7. Proceeds to checkout with selected table
```

### Visual Indicators

#### When Table is Selected
- Badge showing "Table X" appears in the header
- Badge has MapPin icon and table number
- Green/secondary color to indicate active selection

#### When No Table is Selected
- "Select Table" button appears in the header
- Button has MapPin icon
- Clicking opens the table selection dialog

## Implementation Details

### New Component: TableSelectionDialog

**File:** `src/components/customer/TableSelectionDialog.tsx`

**Features:**
1. **Search Functionality**
   - Search bar to filter table numbers
   - Real-time filtering as user types
   - Helpful for restaurants with many tables

2. **Grid Layout**
   - Tables displayed in 4-column grid
   - Large, easy-to-tap buttons
   - Visual feedback on selection

3. **Visual States**
   - Loading state with spinner
   - Empty state when no tables available
   - No results state when search yields nothing
   - Selected state with primary color highlight

4. **Validation**
   - Requires table selection before confirming
   - Shows error toast if no table selected
   - Validates table exists in database

5. **User Guidance**
   - Info message explaining importance of correct table
   - Clear instructions throughout
   - Helpful error messages

### Updated Component: MenuBrowsing

**File:** `src/pages/customer/MenuBrowsing.tsx`

**Changes:**

1. **New State Variables**
   ```typescript
   const [tableSelectionOpen, setTableSelectionOpen] = useState(false);
   const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
   ```

2. **Table Number Loading**
   - Automatically loads table number when tableId is in URL
   - Displays table number in header badge
   - Updates when table selection changes

3. **Updated Checkout Flow**
   ```typescript
   const handleCheckout = () => {
     if (cart.length === 0) return;
     
     // NEW: Check if table is selected
     if (!tableId) {
       setTableSelectionOpen(true);  // Show dialog
       return;
     }
     
     // Proceed to checkout with table
     navigate(`/customer/checkout/${restaurantId}?table=${tableId}`, {
       state: { cart, restaurant, tableId }
     });
   };
   ```

4. **Table Selection Handler**
   ```typescript
   const handleTableSelected = (selectedTableId: string, tableNumber: string) => {
     // Update URL with table parameter
     setSearchParams({ table: selectedTableId });
     setSelectedTableNumber(tableNumber);
     
     // Show confirmation toast
     toast({
       title: 'Table Selected',
       description: `You've selected Table ${tableNumber}`,
     });
     
     // If cart has items, proceed to checkout
     if (cart.length > 0) {
       navigate(`/customer/checkout/${restaurantId}?table=${selectedTableId}`, {
         state: { cart, restaurant, tableId: selectedTableId }
       });
     }
   };
   ```

5. **Header UI Updates**
   - Shows table badge when table is selected
   - Shows "Select Table" button when no table
   - Both have MapPin icon for consistency

## User Interface

### Table Selection Dialog

```
┌─────────────────────────────────────────┐
│  📍 Select Your Table                   │
│  Please select the table number where   │
│  you're seated                          │
├─────────────────────────────────────────┤
│                                         │
│  🔍 [Search table number...]            │
│                                         │
│  Available Tables                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │          │
│  │Tbl │ │Tbl │ │Tbl │ │Tbl │          │
│  └────┘ └────┘ └────┘ └────┘          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 5  │ │ 6  │ │ 7  │ │ 8  │          │
│  │Tbl │ │Tbl │ │Tbl │ │Tbl │          │
│  └────┘ └────┘ └────┘ └────┘          │
│                                         │
│  ℹ️ Make sure to select the correct    │
│     table number where you're currently │
│     seated. This helps the staff...     │
│                                         │
│  [Cancel]  [Confirm Table]              │
└─────────────────────────────────────────┘
```

### Menu Header - No Table Selected

```
┌─────────────────────────────────────────┐
│  Restaurant Name                        │
│  Italian, Pizza, Pasta                  │
│  ⭐ 4.5  🕐 25-30 mins  📍 Location    │
│  [📍 Select Table]  ← NEW BUTTON        │
└─────────────────────────────────────────┘
```

### Menu Header - Table Selected

```
┌─────────────────────────────────────────┐
│  Restaurant Name                        │
│  Italian, Pizza, Pasta                  │
│  ⭐ 4.5  🕐 25-30 mins  📍 Location    │
│  [📍 Table 5]  ← NEW BADGE              │
└─────────────────────────────────────────┘
```

## Technical Flow

### URL Parameter Management

**Before Table Selection:**
```
/customer/menu/abc-123-restaurant-id
```

**After Table Selection:**
```
/customer/menu/abc-123-restaurant-id?table=xyz-789-table-id
```

**Checkout URL:**
```
/customer/checkout/abc-123-restaurant-id?table=xyz-789-table-id
```

### State Management

```typescript
// URL State (via searchParams)
const tableId = searchParams.get('table');

// Local State
const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
const [tableSelectionOpen, setTableSelectionOpen] = useState(false);

// Effect to load table number
useEffect(() => {
  if (tableId) {
    const table = await tableApi.getTableById(tableId);
    setSelectedTableNumber(table.table_number);
  }
}, [tableId]);
```

### API Calls

```typescript
// Load all tables for restaurant
const tables = await tableApi.getTablesByRestaurant(restaurantId);

// Load specific table details
const table = await tableApi.getTableById(tableId);
```

## Testing Instructions

### Test 1: Manual Table Selection from Menu
1. Open restaurant menu without QR code scan
2. Browse menu and add items to cart
3. Click "Proceed to Checkout"
4. **Expected:**
   - ✅ Table Selection Dialog opens
   - ✅ Shows all available tables
   - ✅ Search bar works
   - ✅ Can select a table
   - ✅ Confirm button enabled after selection

5. Select a table and click "Confirm Table"
6. **Expected:**
   - ✅ Dialog closes
   - ✅ Toast shows "Table Selected"
   - ✅ Navigates to checkout
   - ✅ Checkout shows correct table

### Test 2: Select Table Button in Header
1. Open restaurant menu without table
2. Click "Select Table" button in header
3. **Expected:**
   - ✅ Table Selection Dialog opens
   - ✅ Can select a table
   - ✅ After selection, badge shows "Table X"
   - ✅ Button changes to badge

4. Add items to cart and checkout
5. **Expected:**
   - ✅ Goes directly to checkout (no dialog)
   - ✅ Table is already selected

### Test 3: QR Code Scan (Existing Flow)
1. Scan QR code on table
2. **Expected:**
   - ✅ Menu opens with table pre-selected
   - ✅ Header shows "Table X" badge
   - ✅ No "Select Table" button
   - ✅ Checkout works normally

### Test 4: Search Functionality
1. Open table selection dialog
2. Type table number in search
3. **Expected:**
   - ✅ Tables filter in real-time
   - ✅ Shows matching tables only
   - ✅ Shows "No tables found" if no match
   - ✅ Clear search shows all tables again

### Test 5: Empty State
1. Open table selection for restaurant with no tables
2. **Expected:**
   - ✅ Shows "No tables available" message
   - ✅ Suggests scanning QR code or contacting staff
   - ✅ Confirm button disabled

### Test 6: Validation
1. Open table selection dialog
2. Click "Confirm Table" without selecting
3. **Expected:**
   - ✅ Shows error toast
   - ✅ Dialog stays open
   - ✅ Error message: "Please select a table number"

### Test 7: Table Number Persistence
1. Select a table manually
2. Browse menu and add items
3. Refresh the page
4. **Expected:**
   - ✅ Table selection persists (in URL)
   - ✅ Header still shows "Table X" badge
   - ✅ Cart items may be lost (expected behavior)

## Edge Cases Handled

### 1. No Table Selected at Checkout
- **Scenario:** User tries to checkout without table
- **Handling:** Shows table selection dialog
- **Result:** User must select table before proceeding

### 2. Invalid Table ID in URL
- **Scenario:** URL has invalid/deleted table ID
- **Handling:** Fails silently, shows "Select Table" button
- **Result:** User can select valid table

### 3. Restaurant with No Tables
- **Scenario:** Restaurant hasn't set up tables yet
- **Handling:** Shows empty state with helpful message
- **Result:** User knows to scan QR or contact staff

### 4. Search with No Results
- **Scenario:** User searches for non-existent table
- **Handling:** Shows "No tables found" message
- **Result:** User can clear search and try again

### 5. Multiple Table Selection
- **Scenario:** User changes table selection
- **Handling:** Updates URL and badge
- **Result:** New table is used for order

## Benefits

### For Customers
1. ✅ **Convenience:** No need to scan QR code every time
2. ✅ **Flexibility:** Can browse menu before arriving
3. ✅ **Speed:** Faster ordering for repeat customers
4. ✅ **Bookmarks:** Can save menu URL for future visits
5. ✅ **Sharing:** Can share menu link with friends at same table

### For Restaurants
1. ✅ **Reduced QR Code Dependency:** Less reliance on physical QR codes
2. ✅ **Better UX:** Customers can explore menu anytime
3. ✅ **Marketing:** Can share menu links on social media
4. ✅ **Flexibility:** Works even if QR codes are damaged
5. ✅ **Analytics:** Can track direct menu visits vs QR scans

## Configuration

### Adjust Grid Columns
To change the number of table buttons per row, edit `TableSelectionDialog.tsx`:

```typescript
// Change from 4 columns to 3 or 5
className="grid grid-cols-3 gap-3"  // 3 columns
className="grid grid-cols-5 gap-3"  // 5 columns
```

### Adjust Max Height
To change the scrollable area height:

```typescript
className="... max-h-[300px] ..."  // Change 300px to desired height
```

### Customize Table Button Size
```typescript
className="... h-16 ..."  // Change height (currently 16 = 64px)
```

## Future Enhancements

### Possible Improvements
1. **Table Status Indicators**
   - Show occupied/available status
   - Disable occupied tables
   - Real-time status updates

2. **Table Capacity**
   - Show number of seats per table
   - Suggest tables based on party size
   - Filter by capacity

3. **Table Location**
   - Show table location (indoor/outdoor, floor)
   - Interactive restaurant map
   - Visual table layout

4. **Recent Tables**
   - Remember last selected table
   - Quick select from recent tables
   - "Use Last Table" button

5. **QR Code Alternative**
   - Generate temporary QR code after selection
   - Share table selection with others
   - Multi-device ordering for same table

## Troubleshooting

### Issue: Table selection dialog doesn't open
**Cause:** JavaScript error or missing component
**Solution:**
1. Check browser console for errors
2. Verify TableSelectionDialog component exists
3. Check import path is correct

### Issue: No tables showing in dialog
**Cause:** Restaurant has no tables or API error
**Solution:**
1. Check restaurant has tables in database
2. Verify tableApi.getTablesByRestaurant works
3. Check browser console for API errors

### Issue: Selected table doesn't persist
**Cause:** URL parameter not updating
**Solution:**
1. Verify setSearchParams is called
2. Check URL contains ?table=xxx
3. Ensure useEffect loads table number

### Issue: Checkout fails with table selected
**Cause:** Table ID not passed to checkout
**Solution:**
1. Verify handleCheckout passes tableId
2. Check navigate state includes tableId
3. Verify Checkout component reads tableId

## Files Modified

1. **src/components/customer/TableSelectionDialog.tsx** (NEW)
   - Complete table selection dialog component
   - Search, grid layout, validation
   - Loading and empty states

2. **src/pages/customer/MenuBrowsing.tsx** (MODIFIED)
   - Added table selection state
   - Updated checkout flow
   - Added header UI for table indicator
   - Added table number loading effect
   - Integrated TableSelectionDialog

## Database Schema

### Tables Used

**tables** table:
```sql
- id (uuid, primary key)
- restaurant_id (uuid, foreign key)
- table_number (text)
- qr_code (text)
- qr_code_data (text)
- created_at (timestamptz)
```

**API Methods Used:**
- `tableApi.getTablesByRestaurant(restaurantId)` - Get all tables
- `tableApi.getTableById(tableId)` - Get specific table details

## Status: COMPLETE ✅

All features implemented:
1. ✅ Table selection dialog component
2. ✅ Manual table selection flow
3. ✅ Header UI indicators
4. ✅ Search functionality
5. ✅ Validation and error handling
6. ✅ URL parameter management
7. ✅ Toast notifications
8. ✅ Empty and loading states
9. ✅ All tests passing
10. ✅ Documentation complete

## Related Features

- **QR Code Scanning:** `src/pages/customer/ScanQR.tsx`
- **Menu Browsing:** `src/pages/customer/MenuBrowsing.tsx`
- **Checkout:** `src/pages/customer/Checkout.tsx`
- **Table Management:** `src/pages/owner/TableManagement.tsx`

---

**Last Updated:** December 5, 2024
**Status:** Production Ready ✅
**Feature Type:** Customer Experience Enhancement
