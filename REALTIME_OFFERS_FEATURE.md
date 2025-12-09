# Real-time Offers Display with Swiggy-like UI

## Overview
This feature provides customers with a beautiful, real-time display of promotional offers on the menu browsing page, similar to Swiggy's offers UI. Offers update instantly when restaurant owners create, modify, or delete promotions.

## Features Implemented

### 1. Real-time Promotions Subscription
- **Location**: `src/pages/customer/MenuBrowsing.tsx`
- **Technology**: Supabase Real-time Subscriptions
- **Events Handled**:
  - `INSERT`: New promotion added → Shows toast notification and adds to banner
  - `UPDATE`: Promotion modified → Updates display and shows notification
  - `DELETE`: Promotion removed → Removes from display and shows notification

### 2. Swiggy-style Offers Banner
- **Component**: `src/components/customer/OffersBanner.tsx`
- **Design Features**:
  - Horizontal scrollable cards (up to 5 offers)
  - Gradient background with primary color theme
  - Decorative patterns for visual appeal
  - Discount badges (percentage or fixed amount)
  - Promo code display with copy functionality
  - Expiring soon indicators (for offers with ≤3 days left)
  - Min/max order amount display
  - "View All" card at the end
- **Interactions**:
  - Click any offer card to auto-apply the promo code
  - Click "View All" to open the full offers modal
  - Smooth hover effects and transitions

### 3. Enhanced Offers Modal
- **Component**: `src/components/customer/OffersModal.tsx`
- **Updates**:
  - Now accepts `promotions` prop for real-time data sync
  - Falls back to API call if no promotions provided
  - Displays all available offers with detailed information
  - Copy promo code functionality
  - Apply offer directly from modal

### 4. Toast Notifications
- **New Offer**: 🎉 "New Offer Available! [Title] - Use code [CODE]"
- **Updated Offer**: ✏️ "Offer Updated - [Title] has been updated"
- **Removed Offer**: 🗑️ "Offer Removed - An offer is no longer available"

## How to Test

### Testing Real-time Updates

#### Setup:
1. Open two browser windows/tabs
2. Window 1: Login as restaurant owner → Go to Promotions page
3. Window 2: Open customer menu browsing page for that restaurant

#### Test Scenarios:

**Scenario 1: Create New Offer**
1. In Owner window: Click "Create Promotion"
2. Fill in details:
   - Code: `SAVE20`
   - Title: `20% Off on Orders Above $30`
   - Discount Type: Percentage
   - Discount Value: 20
   - Min Order Amount: 30
   - Start Date: Today
   - End Date: 7 days from now
3. Click "Create Promotion"
4. **Expected Result in Customer window**:
   - Toast notification appears: "🎉 New Offer Available!"
   - New offer card appears in the banner instantly
   - Offer shows 20% discount badge
   - Promo code "SAVE20" is displayed

**Scenario 2: Update Existing Offer**
1. In Owner window: Click "Edit" on an existing promotion
2. Change the discount value or title
3. Click "Update Promotion"
4. **Expected Result in Customer window**:
   - Toast notification: "✏️ Offer Updated"
   - Offer card updates instantly with new information

**Scenario 3: Delete Offer**
1. In Owner window: Click "Delete" on a promotion
2. Confirm deletion
3. **Expected Result in Customer window**:
   - Toast notification: "🗑️ Offer Removed"
   - Offer card disappears from banner instantly

**Scenario 4: Toggle Offer Active Status**
1. In Owner window: Toggle the "Active" switch on a promotion
2. **Expected Result in Customer window**:
   - When deactivated: Offer disappears from banner
   - When reactivated: Offer reappears in banner

### Testing Offer Application

**Test 1: Click Offer from Banner**
1. Customer window: Click on any offer card in the banner
2. **Expected Result**:
   - Promo code is automatically validated
   - If valid: Success toast and discount applied to cart
   - If invalid: Error toast with reason (e.g., "Minimum order amount is $30")

**Test 2: View All Offers**
1. Customer window: Click "View All" button/card
2. **Expected Result**:
   - Modal opens showing all available offers
   - Each offer displays full details (terms, validity, limits)
   - Can copy promo code or apply directly

**Test 3: Expiring Soon Indicator**
1. Create an offer that expires in 2 days
2. **Expected Result**:
   - Offer card shows orange border
   - "Expiring Soon!" badge appears
   - Days left indicator shows "2d left"

## UI Components Breakdown

### OffersBanner Component
```tsx
<OffersBanner
  restaurantId={restaurantId}
  promotions={promotions}
  onOfferClick={handleApplyPromoFromModal}
  onViewAllClick={() => setOffersModalOpen(true)}
/>
```

**Props**:
- `restaurantId`: Restaurant ID for loading offers
- `promotions`: Array of active promotions (optional, for real-time sync)
- `onOfferClick`: Callback when an offer card is clicked
- `onViewAllClick`: Callback when "View All" is clicked

### Offer Card Design
- **Gradient Background**: Uses primary color with opacity variations
- **Decorative Circles**: White circles with opacity for visual interest
- **Discount Badge**: White semi-transparent box with discount value
- **Promo Code**: White background box with primary color text
- **Details**: Min/max amounts shown at bottom
- **Hover Effect**: Scale up slightly and show shadow

## Mobile Responsiveness

### Mobile View (< 640px)
- Offer cards: 280px width
- Horizontal scroll with touch support
- Smaller font sizes
- Compact layout

### Desktop View (≥ 1280px)
- Offer cards: 320px width
- Larger fonts and spacing
- More prominent hover effects

## Technical Implementation

### Real-time Subscription Setup
```typescript
const promotionsChannel = supabase
  .channel(`promotions_${restaurantId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'promotions',
    filter: `restaurant_id=eq.${restaurantId}`
  }, (payload) => {
    // Handle INSERT, UPDATE, DELETE
  })
  .subscribe();
```

### Promotion Validation
- Only shows active promotions
- Checks start_date ≤ now ≤ end_date
- Filters out inactive promotions automatically

### Performance Optimization
- Loads promotions once on page load
- Real-time updates only modify state, no re-fetch
- Horizontal scroll uses CSS for smooth performance
- Lazy loading for offer images (if any)

## Database Schema

### Promotions Table
```sql
CREATE TABLE promotions (
  id uuid PRIMARY KEY,
  restaurant_id uuid REFERENCES restaurants(id),
  code text NOT NULL,
  title text NOT NULL,
  description text,
  discount_type discount_type NOT NULL, -- PERCENTAGE or FIXED_AMOUNT
  discount_value numeric NOT NULL,
  min_order_amount numeric DEFAULT 0,
  max_discount numeric,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  used_count integer DEFAULT 0,
  -- ... other fields
);
```

## API Functions Used

### promotionApi.getActivePromotionsForCustomer()
- Fetches all active promotions for a restaurant
- Filters by: is_active = true, start_date ≤ now, end_date ≥ now
- Returns: Array of Promotion objects

### promotionApi.validatePromoCode()
- Validates if a promo code can be applied
- Checks: validity, min order amount, usage limits
- Returns: PromotionValidation object with discount amount

## Styling Details

### Color Scheme
- Primary gradient: `from-primary via-primary/80 to-primary/60`
- Decorative elements: White with 10% opacity
- Discount badge: White with 20% opacity + border
- Promo code box: White with 90% opacity
- Text: White for contrast on gradient

### Animations
- Hover: `scale-[1.02]` + shadow-lg
- Transition: All properties with smooth easing
- Loading: Pulse animation for skeleton cards

## Browser Compatibility
- Modern browsers with CSS Grid and Flexbox support
- Horizontal scroll works on all touch devices
- Backdrop blur supported (graceful degradation)

## Future Enhancements
- [ ] Auto-apply best offer based on cart value
- [ ] Offer categories/filters
- [ ] Personalized offers based on order history
- [ ] Push notifications for new offers
- [ ] Offer countdown timer
- [ ] Social sharing for offers

## Troubleshooting

### Offers not updating in real-time
1. Check browser console for subscription status
2. Verify Supabase real-time is enabled for promotions table
3. Check RLS policies allow public read access for active promotions

### Offers not showing
1. Verify promotions exist in database
2. Check is_active = true
3. Verify start_date and end_date are valid
4. Check restaurant_id matches

### Promo code not applying
1. Check minimum order amount requirement
2. Verify usage limits not exceeded
3. Check promotion is still active
4. Verify customer hasn't used it before (if per-customer limit exists)

## Files Modified/Created

### Created:
- `src/components/customer/OffersBanner.tsx` - New Swiggy-style banner component

### Modified:
- `src/pages/customer/MenuBrowsing.tsx` - Added real-time subscription and banner display
- `src/components/customer/OffersModal.tsx` - Added promotions prop for real-time sync

## Testing Checklist
- [x] Real-time INSERT event works
- [x] Real-time UPDATE event works
- [x] Real-time DELETE event works
- [x] Toast notifications appear correctly
- [x] Offer cards display correctly
- [x] Click to apply promo code works
- [x] View All modal opens
- [x] Expiring soon indicator works
- [x] Mobile responsive design
- [x] Desktop responsive design
- [x] Horizontal scroll works smoothly
- [x] Linter passes with 0 errors

## Conclusion
This feature provides a modern, real-time offers experience for customers, matching the quality and user experience of popular food delivery apps like Swiggy. The implementation is fully responsive, performant, and integrates seamlessly with the existing promotions system.
