# Offers Feature - Quick Reference Guide

## 🚀 Quick Start

### For Customers:
1. Open any restaurant's menu page
2. Scroll down to see the offers banner
3. Click any offer card to apply the promo code
4. Discount applies automatically to your cart

### For Restaurant Owners:
1. Go to **Promotions** page in owner dashboard
2. Click **"Create Promotion"**
3. Fill in offer details and save
4. Customers see it **instantly** on the menu page

## 📍 Where to Find Offers

### Customer Side:
- **Menu Browsing Page**: Below restaurant header, above menu items
- **Cart**: Applied promo shows in cart summary
- **Checkout**: Discount reflected in final total

### Owner Side:
- **Promotions Page**: Create, edit, delete offers
- **Analytics**: View offer usage statistics

## 🎨 Offer Card Elements

```
┌─────────────────────────────┐
│  ╔═══════════╗  [2d left]   │ ← Expiring soon badge
│  ║   20%     ║              │ ← Discount badge
│  ║   OFF     ║              │
│  ╚═══════════╝              │
│  20% Off on Orders Above $30 │ ← Title
│  ┌────────────────────────┐ │
│  │ 🏷️ SAVE20             │ │ ← Promo code
│  └────────────────────────┘ │
│  Min. $30    Max. $10       │ ← Limits
└─────────────────────────────┘
```

## 🔔 Real-time Notifications

| Event | Notification | Icon |
|-------|-------------|------|
| New offer added | "New Offer Available! [Title] - Use code [CODE]" | 🎉 |
| Offer updated | "Offer Updated - [Title] has been updated" | ✏️ |
| Offer removed | "Offer Removed - An offer is no longer available" | 🗑️ |

## 💡 Key Features

### 1. Horizontal Scroll
- Swipe left/right to see more offers
- Shows up to 5 offers in banner
- "View All" card at the end

### 2. One-Click Apply
- Click any offer card
- Promo code validates automatically
- Discount applies to cart instantly

### 3. Expiring Soon
- Orange border for offers with ≤3 days left
- "Expiring Soon!" badge
- Days left counter (e.g., "2d left")

### 4. Offer Details
- Discount amount (20% or $5)
- Promo code (SAVE20)
- Minimum order amount
- Maximum discount (if applicable)
- Validity period

## 🎯 Common Use Cases

### Use Case 1: Apply Offer from Banner
1. Browse menu
2. See offers banner
3. Click offer card
4. ✅ Discount applied

### Use Case 2: View All Offers
1. Click "View All" button
2. Modal opens with all offers
3. Read full details
4. Click "Apply Offer"
5. ✅ Discount applied

### Use Case 3: Remove Applied Promo
1. Open cart
2. See applied promo
3. Click "Remove"
4. ✅ Discount removed

## 🔧 Troubleshooting

### Offers Not Showing?
- ✅ Check if restaurant has active promotions
- ✅ Verify offer dates are valid (start ≤ now ≤ end)
- ✅ Ensure `is_active = true`

### Promo Code Not Applying?
- ✅ Check minimum order amount requirement
- ✅ Verify you haven't exceeded usage limit
- ✅ Ensure offer is still active

### Real-time Updates Not Working?
- ✅ Check browser console for subscription status
- ✅ Refresh the page
- ✅ Verify Supabase real-time is enabled

## 📱 Mobile vs Desktop

### Mobile (< 640px)
- Card width: 280px
- Compact layout
- Touch scrolling
- Smaller fonts

### Desktop (≥ 1280px)
- Card width: 320px
- Hover effects
- Mouse scrolling
- Larger fonts

## 🎨 Visual States

### Normal Offer
- Primary color gradient
- White text
- Standard border

### Expiring Soon
- Orange border
- Orange badge
- Days left indicator

### Applied Promo
- Green text in cart
- Shows discount amount
- Remove button available

## 📊 Offer Types

### Percentage Discount
- Shows: "20% OFF"
- Icon: Percent symbol (%)
- Example: 20% off orders above $30

### Fixed Amount Discount
- Shows: "$5 OFF"
- Icon: Dollar sign ($)
- Example: $5 off first order

## 🔐 Validation Rules

### Offer Must Be:
- ✅ Active (`is_active = true`)
- ✅ Started (`start_date ≤ now`)
- ✅ Not expired (`end_date ≥ now`)
- ✅ Within usage limits

### Order Must Meet:
- ✅ Minimum order amount
- ✅ Customer usage limit (if set)
- ✅ Total usage limit (if set)

## 🎯 Best Practices

### For Customers:
1. **Check expiring offers first** - They won't last long!
2. **Compare offers** - Click "View All" to see all options
3. **Read terms** - Check minimum order requirements
4. **Apply early** - Some offers have usage limits

### For Owners:
1. **Set clear titles** - "20% Off Orders Above $30"
2. **Use memorable codes** - "SAVE20", "FIRST50"
3. **Set reasonable limits** - Don't make it too restrictive
4. **Monitor usage** - Check analytics regularly
5. **Update regularly** - Keep offers fresh and relevant

## 📚 Documentation Links

### Full Documentation:
- **Technical Guide**: `REALTIME_OFFERS_FEATURE.md`
- **Visual Guide**: `OFFERS_VISUAL_GUIDE.md`
- **Implementation Summary**: `OFFERS_IMPLEMENTATION_SUMMARY.md`

### Code Files:
- **Banner Component**: `src/components/customer/OffersBanner.tsx`
- **Menu Page**: `src/pages/customer/MenuBrowsing.tsx`
- **Offers Modal**: `src/components/customer/OffersModal.tsx`

## ⚡ Quick Commands

### Test Real-time Updates:
```bash
# Open two browser windows
# Window 1: Owner dashboard → Promotions
# Window 2: Customer menu page
# Create/edit/delete offer in Window 1
# Watch instant update in Window 2
```

### Check Subscription Status:
```javascript
// Open browser console on menu page
// Look for: "[MenuBrowsing] ✅ Successfully subscribed to promotions changes"
```

## 🎉 Key Benefits

### For Customers:
- ✅ See all offers at a glance
- ✅ Apply promo with one click
- ✅ Get instant notifications for new offers
- ✅ Beautiful, easy-to-use interface

### For Owners:
- ✅ Create offers in seconds
- ✅ Customers see them instantly
- ✅ Update or remove anytime
- ✅ Track usage and performance

## 📞 Support

### Common Questions:

**Q: How many offers can I create?**  
A: Unlimited! But only 5 show in the banner (rest in "View All")

**Q: Can I schedule offers for future?**  
A: Yes! Set `start_date` to future date

**Q: Can I limit offers to specific customers?**  
A: Yes! Use `usage_limit_per_customer` field

**Q: How do I make an offer expire?**  
A: Set `end_date` or toggle `is_active` to false

**Q: Can customers use multiple offers?**  
A: No, only one promo code per order

## ✨ Pro Tips

### For Maximum Impact:
1. **Create urgency** - Set short validity periods
2. **Use scarcity** - Set total usage limits
3. **Make it visible** - Use clear, attractive titles
4. **Test first** - Create test offer to see how it looks
5. **Monitor performance** - Check which offers work best

### For Best UX:
1. **Keep codes simple** - Easy to remember and type
2. **Set reasonable minimums** - Don't make it too high
3. **Update regularly** - Keep offers fresh
4. **Communicate clearly** - Write clear terms
5. **Be generous** - Good offers drive more orders

---

**Quick Reference Version**: 1.0  
**Last Updated**: December 6, 2025  
**Status**: ✅ Production Ready
