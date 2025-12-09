# Offers Feature - Visual Guide

## 🎨 What You'll See

### 1. Offers Banner on Menu Page

When you browse a restaurant's menu, you'll see a beautiful horizontal scrollable banner with offers:

```
┌─────────────────────────────────────────────────────────────────────┐
│  🏷️ Offers for You                                    View All →   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │ ╔══════╗ │  │ ╔══════╗ │  │ ╔══════╗ │  │ ╔══════╗ │  │ View │ │
│  │ ║ 20%  ║ │  │ ║ $5   ║ │  │ ║ 30%  ║ │  │ ║ $10  ║ │  │ All  │ │
│  │ ║  OFF ║ │  │ ║ OFF  ║ │  │ ║  OFF ║ │  │ ║ OFF  ║ │  │ →    │ │
│  │ ╚══════╝ │  │ ╚══════╝ │  │ ╚══════╝ │  │ ╚══════╝ │  │      │ │
│  │          │  │          │  │          │  │          │  │      │ │
│  │ 20% Off  │  │ $5 Off   │  │ 30% Off  │  │ $10 Off  │  │      │ │
│  │ Orders   │  │ First    │  │ Weekend  │  │ Orders   │  │      │ │
│  │ Above $30│  │ Order    │  │ Special  │  │ Above $50│  │      │ │
│  │          │  │          │  │          │  │          │  │      │ │
│  │ SAVE20   │  │ FIRST5   │  │ WEEKEND30│  │ BIG10    │  │      │ │
│  │          │  │          │  │          │  │          │  │      │ │
│  │ Min. $30 │  │ Min. $15 │  │ Min. $25 │  │ Min. $50 │  │      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────┘ │
│                                                                       │
│  ← Swipe to see more offers →                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Offer Card Details

Each offer card shows:

```
┌─────────────────────────────┐
│  ╔═══════════╗  [2d left]   │  ← Expiring soon badge (if applicable)
│  ║   20%     ║              │
│  ║    %      ║              │  ← Discount badge (gradient background)
│  ║   OFF     ║              │
│  ╚═══════════╝              │
│                              │
│  20% Off on Orders Above $30 │  ← Offer title
│                              │
│  ┌────────────────────────┐ │
│  │ 🏷️ SAVE20             │ │  ← Promo code (white background)
│  └────────────────────────┘ │
│                              │
│  Min. $30    Max. $10       │  ← Order limits
│                              │
│  [Gradient Background]       │  ← Primary color gradient
└─────────────────────────────┘
```

### 3. Real-time Update Notifications

When offers change, you'll see toast notifications:

**New Offer Added:**
```
┌────────────────────────────────────┐
│ 🎉 New Offer Available!            │
│ 20% Off on Orders Above $30        │
│ Use code SAVE20                    │
└────────────────────────────────────┘
```

**Offer Updated:**
```
┌────────────────────────────────────┐
│ ✏️ Offer Updated                   │
│ 20% Off on Orders Above $30        │
│ has been updated                   │
└────────────────────────────────────┘
```

**Offer Removed:**
```
┌────────────────────────────────────┐
│ 🗑️ Offer Removed                   │
│ An offer is no longer available    │
└────────────────────────────────────┘
```

### 4. Offers Modal (View All)

Click "View All" to see detailed offer information:

```
┌─────────────────────────────────────────────────────────────────┐
│  🏷️ Available Offers                                      [X]   │
│  Choose from our exclusive offers and save on your order        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ╔═══════╗  20% Off on Orders Above $30                   │ │
│  │  ║  20%  ║                                                 │ │
│  │  ║  OFF  ║  Get 20% discount on orders above $30          │ │
│  │  ╚═══════╝                                                 │ │
│  │             ┌──────────────────────────┐                   │ │
│  │             │ 🏷️ SAVE20          [📋] │                   │ │
│  │             └──────────────────────────┘                   │ │
│  │                                                             │ │
│  │  💵 Min. order: $30    ℹ️ Max. discount: $10             │ │
│  │  📅 Valid till Dec 31, 2025 (25 days left)                │ │
│  │                                                             │ │
│  │  Terms: Valid on all menu items. Cannot be combined...    │ │
│  │                                                             │ │
│  │  Limited to 1 use(s) per customer                          │ │
│  │  [45 left]                                                 │ │
│  │                                                             │ │
│  │  [Apply Offer]                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ╔═══════╗  $5 Off on First Order                         │ │
│  │  ║  $5   ║                                                 │ │
│  │  ║  OFF  ║  Get $5 off on your first order                │ │
│  │  ╚═══════╝                                                 │ │
│  │             ┌──────────────────────────┐                   │ │
│  │             │ 🏷️ FIRST5          [📋] │                   │ │
│  │             └──────────────────────────┘                   │ │
│  │                                                             │ │
│  │  💵 Min. order: $15                                        │ │
│  │  📅 Valid till Dec 31, 2025 (25 days left)                │ │
│  │                                                             │ │
│  │  [Apply Offer]                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Applied Promo in Cart

When you apply a promo code, it shows in your cart:

```
┌─────────────────────────────────────────┐
│  Your Cart (3 items)                    │
├─────────────────────────────────────────┤
│                                          │
│  [Cart Items...]                         │
│                                          │
├─────────────────────────────────────────┤
│  ┌────────────────────────────────────┐ │
│  │ 🏷️ SAVE20              [Remove]   │ │
│  │ 20% Off - Saved $6.00!             │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Subtotal                      $30.00   │
│  Discount                      -$6.00   │  ← Green text
│  ─────────────────────────────────────  │
│  Total                         $24.00   │
│                                          │
│  [Proceed to Checkout]                  │
└─────────────────────────────────────────┘
```

## 🎬 User Flow

### Scenario 1: Customer Applies Offer from Banner

1. Customer opens menu page
2. Sees offers banner with 5 offers
3. Clicks on "20% OFF - SAVE20" card
4. ✅ Toast: "Success! Promo code SAVE20 applied. You saved $6.00!"
5. Discount appears in cart
6. Proceeds to checkout with discount

### Scenario 2: Owner Creates New Offer (Real-time)

**Owner Side:**
1. Owner goes to Promotions page
2. Clicks "Create Promotion"
3. Fills in offer details
4. Clicks "Create Promotion"

**Customer Side (Instant Update):**
1. Customer is browsing menu
2. 🎉 Toast appears: "New Offer Available! 30% Off Weekend Special - Use code WEEKEND30"
3. New offer card appears in banner
4. Customer can immediately click and apply it

### Scenario 3: Expiring Soon Offer

When an offer has ≤3 days left:

```
┌─────────────────────────────────────┐
│  [Expiring Soon!]                   │  ← Orange badge
│  ╔═══════════╗  [2d left]           │  ← Days left indicator
│  ║   30%     ║                      │
│  ║    %      ║                      │
│  ║   OFF     ║                      │
│  ╚═══════════╝                      │
│                                      │
│  30% Off Weekend Special            │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🏷️ WEEKEND30                  │ │
│  └────────────────────────────────┘ │
│                                      │
│  Min. $25    Max. $15              │
└─────────────────────────────────────┘
   ↑ Orange border
```

## 📱 Mobile View

On mobile devices (< 640px):

```
┌─────────────────────────────┐
│ 🏷️ Offers for You  View All→│
├─────────────────────────────┤
│                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 20%  │ │ $5   │ │ 30%  │ │
│ │ OFF  │ │ OFF  │ │ OFF  │ │
│ │      │ │      │ │      │ │
│ │SAVE20│ │FIRST5│ │WEEK..│ │
│ └──────┘ └──────┘ └──────┘ │
│                              │
│ ← Swipe →                   │
└─────────────────────────────┘
```

- Smaller cards (280px width)
- Touch-friendly scrolling
- Compact layout
- All information still visible

## 🎨 Color Scheme

### Offer Cards
- **Background**: Gradient from primary color
  - `from-primary` (full opacity)
  - `via-primary/80` (80% opacity)
  - `to-primary/60` (60% opacity)
- **Decorative Circles**: White with 10% opacity
- **Discount Badge**: White with 20% opacity + white border
- **Promo Code Box**: White with 90% opacity
- **Text on Gradient**: White for maximum contrast

### Status Indicators
- **Expiring Soon**: Orange border + orange badge
- **Active**: Primary color border
- **Applied**: Green text for discount amount

## ✨ Animations

### Hover Effects
- Card scales up to 102% size
- Shadow appears (shadow-lg)
- Smooth transition (0.3s)

### Loading State
- Skeleton cards with pulse animation
- Maintains layout structure
- Smooth fade-in when loaded

### Real-time Updates
- New cards fade in from right
- Removed cards fade out
- Updated cards flash briefly

## 🔧 Interactive Elements

### Clickable Areas
1. **Offer Card**: Click anywhere to apply promo
2. **View All Button**: Opens full offers modal
3. **Copy Code Button**: Copies promo code to clipboard
4. **Apply Offer Button**: Applies promo and closes modal

### Feedback
- **Hover**: Visual feedback (scale + shadow)
- **Click**: Toast notification with result
- **Success**: Green toast with checkmark
- **Error**: Red toast with error message

## 📊 Information Hierarchy

### Primary Information (Most Prominent)
1. Discount value (20%, $5)
2. Offer title
3. Promo code

### Secondary Information
1. Minimum order amount
2. Maximum discount (if applicable)
3. Expiring soon indicator

### Tertiary Information (In Modal)
1. Full description
2. Terms and conditions
3. Usage limits
4. Validity dates

## 🎯 Key Features Highlighted

### Visual Indicators
- ✅ Discount badge (large, prominent)
- ✅ Promo code (easy to read, copyable)
- ✅ Expiring soon (orange, urgent)
- ✅ Days left (countdown)
- ✅ Usage limits (scarcity)

### User Actions
- ✅ Click to apply (one-tap)
- ✅ Copy code (clipboard)
- ✅ View details (modal)
- ✅ Remove promo (if applied)

### Real-time Updates
- ✅ Instant appearance of new offers
- ✅ Live updates to existing offers
- ✅ Immediate removal of deleted offers
- ✅ Toast notifications for all changes

This visual guide shows exactly what users will see and experience when using the offers feature!
