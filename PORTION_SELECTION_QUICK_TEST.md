# Quick Test Guide - Portion Selection Feature

## 🎯 What to Test

The new Zomato-style portion selection dialog that appears when adding items with multiple size/portion options to the cart.

---

## 🚀 Quick Test Steps

### Test 1: Basic Portion Selection (2 minutes)

1. **Navigate to Menu**
   - Go to customer menu browsing page
   - Find any item with "has_portions" enabled

2. **Open Portion Dialog**
   - Click the "ADD" button on the item
   - ✅ Dialog should open immediately
   - ✅ Should show "Choose Portion" heading

3. **Check Default Selection**
   - ✅ "Full" portion should be pre-selected (colored border)
   - ✅ Price should be displayed on the right
   - ✅ Button should show "Add Item - $XX.XX"

4. **Select Half Portion**
   - Click on the "Half" option card
   - ✅ Border should change to primary color
   - ✅ Background should have subtle highlight
   - ✅ Price should be exactly half of full price
   - ✅ Button text should update to show new price

5. **Add to Cart**
   - Click "Add Item" button
   - ✅ Dialog should close
   - ✅ Toast notification should appear
   - ✅ Item should be in cart with correct portion

---

### Test 2: Variant Selection (2 minutes)

1. **Find Item with Variants**
   - Look for items with size options (Small, Medium, Large)
   - Click "ADD" button

2. **Check Variant Display**
   - ✅ Should show "Choose Size" heading
   - ✅ All variants should be listed
   - ✅ Each variant should show its price
   - ✅ First variant should be pre-selected

3. **Select Different Variant**
   - Click on a different size option
   - ✅ Selection should change visually
   - ✅ Button price should update
   - ✅ Description (if any) should be visible

4. **Confirm Selection**
   - Click "Add Item"
   - ✅ Correct variant should be added to cart

---

### Test 3: Visual Design Check (1 minute)

1. **Open Any Portion Dialog**
   - ✅ No special instructions field visible
   - ✅ Clean, uncluttered layout
   - ✅ Large, readable text
   - ✅ Prominent pricing in primary color
   - ✅ Adequate spacing between options

2. **Check Interactive States**
   - Hover over unselected option
     - ✅ Border should change color
   - Click to select
     - ✅ Smooth transition
     - ✅ Clear visual feedback

---

### Test 4: Mobile Responsiveness (1 minute)

1. **Resize Browser** (or use mobile device)
   - Make window narrow (< 640px)
   - Open portion dialog

2. **Check Mobile Layout**
   - ✅ Dialog fits screen properly
   - ✅ Cards are full-width
   - ✅ Text is readable
   - ✅ Touch targets are large enough
   - ✅ No horizontal scrolling

---

### Test 5: Edge Cases (2 minutes)

1. **Item Without Portions**
   - Click "ADD" on regular item
   - ✅ Should add directly to cart
   - ✅ No dialog should appear

2. **Item with Both Variants and Portions**
   - Find item with both features
   - ✅ Both sections should appear
   - ✅ Can select from each independently
   - ✅ Price calculation should be correct

3. **Cancel Selection**
   - Open dialog
   - Click outside or press Escape
   - ✅ Dialog should close
   - ✅ Nothing added to cart

---

## ✅ Success Criteria

### Visual Design
- [ ] Clean, focused interface
- [ ] No special instructions field
- [ ] Large, prominent pricing
- [ ] Clear visual selection state
- [ ] Professional appearance

### Functionality
- [ ] Full portion pre-selected by default
- [ ] Prices display correctly
- [ ] Half portion = Full price ÷ 2
- [ ] Selection changes update button price
- [ ] Items add to cart with correct portion
- [ ] Toast notifications appear

### User Experience
- [ ] Fast, smooth interactions
- [ ] Clear visual feedback
- [ ] Easy to understand
- [ ] Mobile-friendly
- [ ] No confusion or errors

---

## 🐛 Common Issues to Watch For

### Issue 1: Wrong Default Selection
**Problem**: Half portion selected by default instead of Full
**Expected**: Full should always be default
**Check**: Line 300 in MenuBrowsing.tsx

### Issue 2: Price Not Updating
**Problem**: Button shows wrong price after selection change
**Expected**: Button price should match selected option
**Check**: getItemPrice function

### Issue 3: Special Instructions Still Visible
**Problem**: Old special instructions field appears
**Expected**: Should be completely removed
**Check**: Dialog content section

### Issue 4: Selection Not Visual
**Problem**: Can't tell which option is selected
**Expected**: Selected option has colored border and background
**Check**: CSS classes on radio group items

---

## 📱 Device Testing Matrix

| Device Type | Screen Size | Status |
|-------------|-------------|--------|
| Mobile      | 375px       | ⬜ Test |
| Tablet      | 768px       | ⬜ Test |
| Desktop     | 1280px      | ⬜ Test |
| Large       | 1920px      | ⬜ Test |

---

## 🎨 Visual Checklist

### Typography
- [ ] Dialog title: Large and bold
- [ ] Portion names: Semibold, readable
- [ ] Prices: Bold, primary color
- [ ] Descriptions: Smaller, muted

### Colors
- [ ] Selected border: Primary color
- [ ] Selected background: Light primary tint
- [ ] Unselected border: Gray
- [ ] Prices: Primary color
- [ ] Text: Proper contrast

### Spacing
- [ ] Adequate padding in cards
- [ ] Good spacing between options
- [ ] Comfortable margins
- [ ] No cramped elements

### Interactions
- [ ] Hover effects work
- [ ] Click feedback is instant
- [ ] Transitions are smooth
- [ ] No lag or delay

---

## 🔄 Comparison Test

### Before (Old Design)
- Special instructions field present
- Smaller cards
- Less prominent pricing
- More cluttered

### After (New Design)
- No special instructions
- Larger, clickable cards
- Bold, prominent pricing
- Clean and focused

**Test**: Open dialog and verify it matches "After" description

---

## 📊 Performance Check

1. **Dialog Open Speed**
   - ✅ Should open instantly (< 100ms)

2. **Selection Response**
   - ✅ Visual feedback immediate
   - ✅ No lag when clicking

3. **Add to Cart**
   - ✅ Quick response
   - ✅ Smooth dialog close

---

## 🎯 User Flow Test

### Complete Order Flow
1. Browse menu → ✅
2. Click ADD on item with portions → ✅
3. See clean portion dialog → ✅
4. Select preferred portion → ✅
5. Click Add Item → ✅
6. See item in cart → ✅
7. Proceed to checkout → ✅
8. Complete order → ✅

**Time to complete**: Should be faster than before

---

## 💡 Tips for Testing

### Quick Visual Test
1. Open dialog
2. Take screenshot
3. Compare with visual guide
4. Check all elements match

### Functionality Test
1. Try all combinations
2. Verify prices calculate correctly
3. Check cart contents
4. Test on different devices

### User Experience Test
1. Pretend you're a customer
2. Is it intuitive?
3. Any confusion?
4. Would you use it?

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________
Device: ___________

✅ PASSED TESTS:
- 
- 
- 

❌ FAILED TESTS:
- 
- 

💡 OBSERVATIONS:
- 
- 

🐛 BUGS FOUND:
- 
- 

⭐ RATING: ___/10
```

---

## 🚨 Critical Tests (Must Pass)

1. **Default Selection**: Full portion pre-selected ✅
2. **Price Display**: All prices visible and correct ✅
3. **No Special Instructions**: Field completely removed ✅
4. **Visual Feedback**: Selection state clearly visible ✅
5. **Cart Addition**: Items add with correct portion ✅

**If any critical test fails, report immediately!**

---

## ✨ Expected Results Summary

After testing, you should observe:
- ✅ Cleaner, more focused interface
- ✅ Faster decision-making process
- ✅ Better price visibility
- ✅ Improved mobile experience
- ✅ Professional, polished look
- ✅ Matches Zomato's UX pattern

---

## 📞 Need Help?

If you encounter issues:
1. Check the main documentation: `PORTION_SELECTION_IMPROVEMENT.md`
2. Review visual guide: `PORTION_SELECTION_VISUAL_GUIDE.md`
3. Check code: `src/pages/customer/MenuBrowsing.tsx`
4. Run lint: `npm run lint`

---

**Happy Testing! 🎉**
