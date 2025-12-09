# Portion Selection - Visual Guide

## Before vs After Comparison

### BEFORE: Cluttered Dialog
```
┌────────────────────────────────────────────────────┐
│  Chicken Biryani                                   │
│  Aromatic basmati rice with tender chicken         │
├────────────────────────────────────────────────────┤
│                                                    │
│  Select Portion                                    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ ○ Full                          $18.00   │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ ○ Half                           $9.00   │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  Special Instructions (Optional)                   │
│  ┌──────────────────────────────────────────┐    │
│  │ e.g., Less spicy, no onions              │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │         Add to Cart - $18.00             │    │
│  └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```
**Issues:**
- ❌ Too many elements competing for attention
- ❌ Special instructions distract from main decision
- ❌ Smaller touch targets
- ❌ Less prominent pricing
- ❌ More scrolling required on mobile

---

### AFTER: Clean, Focused Dialog (Zomato-style)
```
┌────────────────────────────────────────────────────┐
│  Chicken Biryani                                   │
│  Aromatic basmati rice with tender chicken         │
├────────────────────────────────────────────────────┤
│                                                    │
│  Choose Portion                                    │
│                                                    │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    │
│  ┃ ◉ Full                          $18.00   ┃    │ ← Selected
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ ○ Half                           $9.00   │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │          Add Item - $18.00               │    │
│  └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```
**Improvements:**
- ✅ Single focus: Choose your portion
- ✅ Larger, more tappable cards
- ✅ Bold, prominent pricing
- ✅ Visual feedback on selection
- ✅ Cleaner, less cluttered
- ✅ Faster decision making

---

## Detailed Component Breakdown

### 1. Dialog Header
```
┌────────────────────────────────────────┐
│  Chicken Biryani              [text-xl]│  ← Larger title
│  Aromatic basmati rice...    [text-sm] │  ← Description
└────────────────────────────────────────┘
```

### 2. Portion Selection Cards

#### Unselected State
```
┌────────────────────────────────────────┐
│                                        │
│  ○  Half                      $9.00   │  ← Gray border
│      [font-semibold]  [text-primary]  │
│                                        │
└────────────────────────────────────────┘
     ↑                              ↑
  Radio button              Bold price
```

#### Selected State
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                        ┃
┃  ◉  Full                     $18.00   ┃  ← Primary border
┃      [font-semibold]  [text-primary]  ┃     + light bg
┃                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

#### Hover State
```
┌────────────────────────────────────────┐
│                                        │  ← Border changes
│  ○  Half                      $9.00   │     to primary color
│                                        │     on hover
└────────────────────────────────────────┘
```

### 3. Action Button
```
┌────────────────────────────────────────┐
│          Add Item - $18.00             │  ← Shows selected
│                                        │     portion price
└────────────────────────────────────────┘
```

---

## Interactive States

### State 1: Dialog Opens
```
Default Selection: Full (pre-selected)
Price Display: Base price shown
Button Text: "Add Item - $18.00"
```

### State 2: User Selects Half
```
Selection Changes: Half becomes selected
Price Updates: Button shows "$9.00"
Visual Feedback: Border color changes
Button Text: "Add Item - $9.00"
```

### State 3: User Confirms
```
Action: Click "Add Item"
Result: Item added to cart with selected portion
Feedback: Toast notification appears
Dialog: Closes automatically
```

---

## Mobile View (< 640px)

### Portrait Mode
```
┌─────────────────────────┐
│  Chicken Biryani        │
│  Aromatic basmati...    │
├─────────────────────────┤
│                         │
│  Choose Portion         │
│                         │
│  ┏━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ◉ Full      $18.00┃ │
│  ┗━━━━━━━━━━━━━━━━━━━┛ │
│                         │
│  ┌───────────────────┐ │
│  │ ○ Half       $9.00│ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │ Add Item - $18.00 │ │
│  └───────────────────┘ │
└─────────────────────────┘
```
**Mobile Optimizations:**
- Larger touch targets (min 44px height)
- Full-width cards
- Adequate spacing between options
- Easy thumb reach for buttons

---

## Desktop View (≥ 1280px)

### Wider Dialog
```
┌──────────────────────────────────────────────────────┐
│  Chicken Biryani                                     │
│  Aromatic basmati rice with tender chicken pieces    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Choose Portion                                      │
│                                                      │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│  ┃ ◉  Full                              $18.00   ┃ │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ ○  Half                               $9.00   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │              Add Item - $18.00                 │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## With Variants (Size Selection)

### Multiple Options
```
┌────────────────────────────────────────────────────┐
│  Margherita Pizza                                  │
│  Classic pizza with fresh mozzarella               │
├────────────────────────────────────────────────────┤
│                                                    │
│  Choose Size                                       │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ ○ Small (8")                     $12.00  │    │
│  │   Serves 1 person                        │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓    │
│  ┃ ◉ Medium (12")                   $18.00  ┃    │
│  ┃   Serves 2-3 people                      ┃    │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ ○ Large (16")                    $24.00  │    │
│  │   Serves 4-5 people                      │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │          Add Item - $18.00               │    │
│  └──────────────────────────────────────────┘    │
└────────────────────────────────────────────────────┘
```

---

## Color Specifications

### Border Colors
- **Default**: `border-border` (hsl(var(--border)))
- **Hover**: `border-primary` (hsl(var(--primary)))
- **Selected**: `border-primary` with `border-2`

### Background Colors
- **Default**: `transparent`
- **Selected**: `bg-primary/5` (5% opacity primary color)

### Text Colors
- **Portion Name**: `text-foreground` (default text color)
- **Price**: `text-primary` (accent color)
- **Description**: `text-muted-foreground` (subtle gray)

### Font Weights
- **Portion Name**: `font-semibold` (600)
- **Price**: `font-bold` (700)
- **Section Label**: `font-semibold` (600)

---

## Spacing & Sizing

### Card Padding
- **Mobile**: `p-4` (16px all sides)
- **Desktop**: `p-4` (16px all sides)

### Gap Between Cards
- **Mobile**: `space-y-3` (12px vertical)
- **Desktop**: `space-y-3` (12px vertical)

### Border Width
- **Default**: `border` (1px)
- **Selected**: `border-2` (2px)

### Border Radius
- **All Cards**: `rounded-lg` (8px)

---

## Accessibility Features

### Keyboard Navigation
```
Tab       → Move between options
Space     → Select option
Enter     → Confirm selection (Add to cart)
Escape    → Close dialog
```

### Screen Reader Support
- Radio buttons properly labeled
- Price announced with option
- Selection state announced
- Button text includes price

### Touch Targets
- Minimum 44px height for mobile
- Full card clickable (not just radio button)
- Adequate spacing between targets

---

## Animation & Transitions

### On Dialog Open
```
Fade in: 200ms ease-out
Scale: 0.95 → 1.0
```

### On Selection Change
```
Border color: 150ms ease-in-out
Background: 150ms ease-in-out
```

### On Hover
```
Border color: 150ms ease-in-out
```

---

## Real-World Examples

### Example 1: Biryani Restaurant
```
Item: Chicken Biryani
Base Price: $18.00

Options:
┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ◉ Full Plate    $18.00 ┃  ← Default
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

┌────────────────────────┐
│ ○ Half Plate     $9.00 │
└────────────────────────┘
```

### Example 2: Pizza Place
```
Item: Margherita Pizza

Options:
┌────────────────────────┐
│ ○ Small (8")    $12.00 │
└────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ◉ Medium (12")  $18.00 ┃  ← Default
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

┌────────────────────────┐
│ ○ Large (16")   $24.00 │
└────────────────────────┘
```

### Example 3: Beverage
```
Item: Fresh Juice

Options:
┌────────────────────────┐
│ ○ Small (8oz)    $4.00 │
└────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ◉ Regular (12oz) $6.00 ┃  ← Default
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

┌────────────────────────┐
│ ○ Large (16oz)   $8.00 │
└────────────────────────┘
```

---

## Summary

The new design provides:
- ✅ **Cleaner Interface**: Single focus on portion selection
- ✅ **Better Visibility**: Larger text and prominent pricing
- ✅ **Improved UX**: Easier to tap and select
- ✅ **Faster Flow**: No distractions from special instructions
- ✅ **Professional Look**: Matches industry-leading apps
- ✅ **Mobile-First**: Optimized for touch interactions
- ✅ **Accessible**: Keyboard and screen reader friendly

This Zomato-style approach significantly improves the ordering experience by focusing on what matters most: choosing the right portion size at the right price.
