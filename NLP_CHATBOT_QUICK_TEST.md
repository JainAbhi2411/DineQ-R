# NLP Chatbot Quick Test Guide

## 🚀 Quick Start

### 1. Access the Feature
1. Navigate to any restaurant's menu page
2. Look for the floating chat button (💬) in the bottom-right corner
3. Click the button to open the chatbot

### 2. Test Basic Order
**Input:** `I want 2 Margherita Pizza and 1 Daal Tadka`

**Expected Result:**
- ✅ Bot responds with confirmation
- ✅ Shows parsed items: "2x Margherita Pizza", "1x Daal Tadka"
- ✅ "Add to Cart" button appears
- ✅ Click button → Items added to cart
- ✅ Toast notification shows success

### 3. Test Multiple Items
**Input:** `Get me 4 roti, 1 paneer tikka, and 2 naan`

**Expected Result:**
- ✅ Bot confirms all items
- ✅ All items parsed correctly
- ✅ Can add all to cart at once

### 4. Test Item Variations
**Input:** `I want dal tadka` (without double 'a')

**Expected Result:**
- ✅ Bot matches to "Daal Tadka"
- ✅ Successfully adds to cart

### 5. Test Item Not Found
**Input:** `I want 1 burger`

**Expected Result:**
- ✅ Bot mentions item not available
- ✅ No items parsed or empty array
- ✅ Helpful error message

## 📋 Checklist

### UI Elements
- [ ] Floating button visible on menu page
- [ ] Button has primary color and message icon
- [ ] Hover effect works (scale animation)
- [ ] Click opens chat window
- [ ] Chat window has proper size (400x600px on desktop)
- [ ] Header shows "Order Assistant" with close button
- [ ] Welcome message displays on first open
- [ ] Input field and send button visible
- [ ] Example text shows below input

### Functionality
- [ ] Can type in input field
- [ ] Send button disabled when input empty
- [ ] Send button enabled when text present
- [ ] Enter key sends message
- [ ] Message appears in chat (right-aligned, primary color)
- [ ] Bot response streams in real-time
- [ ] Markdown formatting works in bot messages
- [ ] Loading spinner shows during processing
- [ ] Parsed items display as badges
- [ ] "Add to Cart" button appears for valid orders
- [ ] Click "Add to Cart" adds items to cart
- [ ] Toast notification shows on success
- [ ] Cart count updates
- [ ] Can continue conversation after adding items

### Error Handling
- [ ] Network errors show error message
- [ ] Invalid items handled gracefully
- [ ] Empty messages prevented
- [ ] API timeout handled (30s for first token)
- [ ] Partial matches show which items added/not found

### Responsive Design
- [ ] Works on desktop (>768px)
- [ ] Works on tablet (768px-1024px)
- [ ] Works on mobile (<768px)
- [ ] Chat window adapts to screen size
- [ ] Scrolling works properly
- [ ] Touch interactions work on mobile

## 🎯 Test Scenarios

### Scenario 1: First-Time User
1. Open menu page
2. See floating button
3. Click to open chat
4. Read welcome message
5. Try example order: "I want 2 pizzas"
6. See response and parsed items
7. Add to cart
8. Verify cart updated

**Pass Criteria:** User can complete order without confusion

### Scenario 2: Multiple Orders
1. Open chatbot
2. Order: "I want 2 pizzas"
3. Add to cart
4. Order again: "Also get me 4 rotis"
5. Add to cart
6. Check cart has both orders

**Pass Criteria:** Can place multiple orders in one session

### Scenario 3: Conversational Flow
1. Ask: "What pizzas do you have?"
2. Bot lists pizzas
3. Say: "I'll take 2 margherita"
4. Bot understands context
5. Parses order correctly

**Pass Criteria:** Bot maintains conversation context

### Scenario 4: Error Recovery
1. Order: "I want a burger"
2. Bot says not available
3. Order: "Okay, give me 2 pizzas instead"
4. Bot processes new order
5. Successfully adds to cart

**Pass Criteria:** Can recover from errors and continue

### Scenario 5: Complex Order
1. Order: "I want 1 daal tadka, 4 roti, 1 paneer tikka, 2 naan, and 1 margherita pizza"
2. Bot parses all 5 items
3. Shows all in parsed order
4. Adds all to cart successfully

**Pass Criteria:** Handles complex multi-item orders

## 🐛 Common Issues & Solutions

### Issue: Button not appearing
**Check:**
- Are you on the MenuBrowsing page?
- Is restaurantId valid?
- Check browser console for errors

### Issue: No response from bot
**Check:**
- Network connection
- Browser console for API errors
- VITE_APP_ID environment variable set
- API endpoint accessible

### Issue: Items not adding to cart
**Check:**
- Item names match menu exactly
- Items marked as available
- Cart integration function working
- Console for JavaScript errors

### Issue: Slow responses
**Note:** First token can take up to 30 seconds (normal for LLM)
**Check:**
- Network speed
- API endpoint status
- Browser console for timeout errors

### Issue: Incorrect parsing
**Check:**
- Menu item names are clear and unique
- LLM received correct menu context
- JSON parsing working correctly

## 📊 Performance Metrics

### Expected Timings
- **Button Click to Chat Open:** <0.5s
- **Message Send to First Token:** 5-30s (LLM processing)
- **Streaming Speed:** Real-time (as tokens arrive)
- **Add to Cart:** <0.5s
- **Toast Notification:** <0.3s

### Success Criteria
- ✅ 95%+ accuracy in item matching
- ✅ <30s response time for first token
- ✅ 100% cart integration success
- ✅ No UI freezing or lag
- ✅ Smooth animations

## 🎨 Visual Verification

### Colors
- [ ] Floating button uses primary color
- [ ] Header uses primary color
- [ ] User messages use primary color
- [ ] Bot messages use muted background
- [ ] Badges use secondary color
- [ ] Buttons have proper hover states

### Typography
- [ ] Text is readable
- [ ] Proper font sizes
- [ ] Good contrast ratios
- [ ] Markdown formatting works

### Spacing
- [ ] Proper padding in messages
- [ ] Good spacing between elements
- [ ] No overlapping content
- [ ] Scrolling works smoothly

### Animations
- [ ] Button hover scales up
- [ ] Chat window slides in
- [ ] Messages fade in
- [ ] Streaming text appears smoothly
- [ ] Badges animate in
- [ ] Toast slides down

## ✅ Final Checklist

Before marking as complete:
- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Linter passes (0 errors)
- [ ] Works on all screen sizes
- [ ] Error handling works
- [ ] Cart integration works
- [ ] Toast notifications work
- [ ] Documentation complete
- [ ] Code is clean and commented
- [ ] Performance is acceptable

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

Basic Order Test: ☐ Pass ☐ Fail
Multiple Items Test: ☐ Pass ☐ Fail
Item Variations Test: ☐ Pass ☐ Fail
Item Not Found Test: ☐ Pass ☐ Fail
Conversational Flow: ☐ Pass ☐ Fail
Error Recovery: ☐ Pass ☐ Fail
Complex Order: ☐ Pass ☐ Fail

Desktop Responsive: ☐ Pass ☐ Fail
Tablet Responsive: ☐ Pass ☐ Fail
Mobile Responsive: ☐ Pass ☐ Fail

Performance: ☐ Pass ☐ Fail
Visual Design: ☐ Pass ☐ Fail
Accessibility: ☐ Pass ☐ Fail

Overall: ☐ Pass ☐ Fail

Notes:
_________________________________
_________________________________
_________________________________
```

## 🎉 Success Indicators

You'll know the feature is working perfectly when:
1. ✅ Customers can order using natural language
2. ✅ Bot understands and confirms orders correctly
3. ✅ Items are added to cart automatically
4. ✅ Error messages are helpful and clear
5. ✅ UI is smooth and responsive
6. ✅ No technical issues or bugs
7. ✅ Users find it intuitive and easy to use

## 🚀 Ready for Production

Once all tests pass:
- ✅ Feature is production-ready
- ✅ Can be deployed to live environment
- ✅ Users can start ordering with natural language
- ✅ Monitor for any issues in production
- ✅ Gather user feedback for improvements

---

**Happy Testing! 🎉**
