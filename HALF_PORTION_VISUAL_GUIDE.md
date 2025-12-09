# Half Portion Feature - Visual Guide

## 🎨 What Customers See

### 1. Menu Card Display

#### Before (Without Portions)
```
┌─────────────────────────────────┐
│  🌱 Crispy Spring Rolls         │
│                                 │
│  $8.99                          │
│                                 │
│  Fresh vegetables wrapped in    │
│  crispy pastry...               │
│                                 │
│           [ADD] ←               │
└─────────────────────────────────┘
```

#### After (With Portions) ✨
```
┌─────────────────────────────────┐
│  🌱 Crispy Spring Rolls         │
│                                 │
│  From $4.45  ← Shows minimum!   │
│                                 │
│  Fresh vegetables wrapped in    │
│  crispy pastry...               │
│                                 │
│           [ADD] ←               │
└─────────────────────────────────┘
```

**Key Changes:**
- ✅ "From" prefix in smaller, muted text
- ✅ Shows minimum price ($4.45 instead of $8.99)
- ✅ Indicates multiple pricing options available

---

### 2. Portion Selection Dialog

When customer clicks "ADD":

```
┌─────────────────────────────────────────┐
│  Choose Portion                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ○ Half                    $4.45   │ │
│  │   Half portion                    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ● Full                    $8.99   │ │ ← Default
│  │   Full portion                    │ │
│  └───────────────────────────────────┘ │
│                                         │
│              [Add to Cart]              │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ Clear radio button selection
- ✅ Portion name (Half/Full)
- ✅ Description below name
- ✅ Price on the right
- ✅ Full portion selected by default
- ✅ Selected option has colored border

---

### 3. Selected State

When customer selects "Half":

```
┌─────────────────────────────────────────┐
│  Choose Portion                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌═══════════════════════════════════┐ │ ← Blue border
│  │ ● Half                    $4.45   │ │ ← Selected
│  │   Half portion                    │ │
│  └═══════════════════════════════════┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ○ Full                    $8.99   │ │
│  │   Full portion                    │ │
│  └───────────────────────────────────┘ │
│                                         │
│              [Add to Cart]              │
└─────────────────────────────────────────┘
```

**Visual Feedback:**
- ✅ Filled radio button (●)
- ✅ Colored border (primary color)
- ✅ Light background tint
- ✅ Clear visual distinction

---

### 4. Cart Display

#### Half Portion in Cart
```
┌─────────────────────────────────────────┐
│  Your Cart (1 item)                     │
├─────────────────────────────────────────┤
│                                         │
│  Crispy Spring Rolls (Half) ← Portion!  │
│  $4.45                                  │
│                                         │
│  [-]  1  [+]                            │
│                                         │
├─────────────────────────────────────────┤
│  Total                          $4.45   │
│                                         │
│           [Proceed to Checkout]         │
└─────────────────────────────────────────┘
```

#### Full Portion in Cart
```
┌─────────────────────────────────────────┐
│  Your Cart (1 item)                     │
├─────────────────────────────────────────┤
│                                         │
│  Crispy Spring Rolls (Full) ← Portion!  │
│  $8.99                                  │
│                                         │
│  [-]  1  [+]                            │
│                                         │
├─────────────────────────────────────────┤
│  Total                          $8.99   │
│                                         │
│           [Proceed to Checkout]         │
└─────────────────────────────────────────┘
```

#### Multiple Portions in Cart
```
┌─────────────────────────────────────────┐
│  Your Cart (2 items)                    │
├─────────────────────────────────────────┤
│                                         │
│  Crispy Spring Rolls (Half)             │
│  $4.45                                  │
│  [-]  1  [+]                            │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Crispy Spring Rolls (Full)             │
│  $8.99                                  │
│  [-]  1  [+]                            │
│                                         │
├─────────────────────────────────────────┤
│  Total                         $13.44   │
│                                         │
│           [Proceed to Checkout]         │
└─────────────────────────────────────────┘
```

**Cart Features:**
- ✅ Portion size shown in parentheses
- ✅ Correct price for each portion
- ✅ Separate line items for different portions
- ✅ Accurate total calculation

---

### 5. Toast Notifications

#### Adding Half Portion
```
┌─────────────────────────────────────────┐
│  ✓ Added to cart                        │
│  Crispy Spring Rolls (Half) added       │
└─────────────────────────────────────────┘
```

#### Adding Full Portion
```
┌─────────────────────────────────────────┐
│  ✓ Added to cart                        │
│  Crispy Spring Rolls (Full) added       │
└─────────────────────────────────────────┘
```

---

## 📱 Responsive Views

### Mobile View (< 768px)

#### Menu Card (Horizontal Layout)
```
┌─────────────────────────────────────────────┐
│  🌱                                         │
│                                             │
│  Crispy Spring Rolls                        │
│  From $4.45                                 │
│                                             │
│  Fresh vegetables wrapped...        [IMG]  │
│                                      [ADD]  │
└─────────────────────────────────────────────┘
```

#### Portion Dialog (Full Screen)
```
┌─────────────────────────────────────────────┐
│  ← Choose Portion                           │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ○ Half                      $4.45   │   │
│  │   Half portion                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ● Full                      $8.99   │   │
│  │   Full portion                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│                                             │
│                                             │
│            [Add to Cart]                    │
└─────────────────────────────────────────────┘
```

### Desktop View (≥ 1280px)

#### Menu Card (Grid Layout)
```
┌───────────────────────┐
│                       │
│      [IMAGE]          │
│                       │
│  🌱 Bestseller         │
├───────────────────────┤
│  Crispy Spring Rolls  │
│                       │
│  From $4.45           │
│                       │
│  Fresh vegetables...  │
│                       │
│  [ADD TO CART]        │
└───────────────────────┘
```

#### Portion Dialog (Centered Modal)
```
        ┌─────────────────────────────────┐
        │  Choose Portion                 │
        ├─────────────────────────────────┤
        │                                 │
        │  ┌───────────────────────────┐ │
        │  │ ○ Half            $4.45   │ │
        │  │   Half portion            │ │
        │  └───────────────────────────┘ │
        │                                 │
        │  ┌───────────────────────────┐ │
        │  │ ● Full            $8.99   │ │
        │  │   Full portion            │ │
        │  └───────────────────────────┘ │
        │                                 │
        │        [Add to Cart]            │
        └─────────────────────────────────┘
```

---

## 🎯 User Flow Diagram

```
Customer Views Menu
        ↓
Sees "From $4.45" on Crispy Spring Rolls
        ↓
Clicks "ADD" button
        ↓
Portion Selection Dialog Opens
        ↓
    ┌───────┴───────┐
    ↓               ↓
Selects Half    Selects Full
  $4.45           $8.99
    ↓               ↓
    └───────┬───────┘
            ↓
    Clicks "Add to Cart"
            ↓
    Toast Notification
            ↓
    Item Added to Cart
    (with portion info)
            ↓
    Proceeds to Checkout
            ↓
    Order Created
    (portion stored in DB)
```

---

## 🎨 Color Scheme

### Selection States

#### Unselected
- Border: `border-border` (neutral gray)
- Background: `bg-background` (white/dark)
- Text: `text-foreground` (default)

#### Selected
- Border: `border-primary` (blue/brand color)
- Background: `bg-primary/5` (light tint)
- Text: `text-foreground` (default)
- Radio: `fill-primary` (filled)

#### Hover
- Border: `hover:border-primary` (blue/brand)
- Transition: Smooth 300ms

### Price Display
- Price: `text-primary` (blue/brand color)
- "From" text: `text-muted-foreground` (gray)
- Font: Bold for prices

---

## 📊 Comparison Table

| Feature | Without Portions | With Portions |
|---------|-----------------|---------------|
| **Price Display** | $8.99 | From $4.45 |
| **Add Button** | Direct add | Opens dialog |
| **Cart Entry** | Single item | Portion specified |
| **Flexibility** | One size only | Half or Full |
| **Customer Choice** | No choice | Choose portion |

---

## ✨ Key Visual Elements

### 1. "From" Indicator
```css
<span className="text-xs text-muted-foreground">From </span>
```
- Small font size
- Muted color (gray)
- Indicates starting price

### 2. Portion Options
```css
<div className="border-2 rounded-lg p-4 hover:border-primary">
  <RadioGroupItem />
  <Label>Half</Label>
  <span className="text-primary font-bold">$4.45</span>
</div>
```
- Large touch targets
- Clear visual hierarchy
- Prominent pricing

### 3. Selected State
```css
className={cn(
  "border-2 rounded-lg p-4",
  selected ? "border-primary bg-primary/5" : "border-border"
)}
```
- Colored border
- Light background tint
- Clear visual feedback

---

## 🎬 Animation States

### Dialog Opening
- Fade in: 200ms
- Slide up: 300ms
- Smooth easing

### Selection Change
- Border color: 150ms
- Background: 150ms
- Instant radio fill

### Toast Notification
- Slide in from top
- Auto-dismiss after 3s
- Smooth fade out

---

## 📱 Touch Targets

### Mobile Optimization
- Minimum height: 48px
- Padding: 16px
- Full-width clickable area
- Large radio buttons

### Desktop Optimization
- Hover states
- Cursor pointer
- Smooth transitions
- Clear focus states

---

## ✅ Accessibility

### Visual
- High contrast ratios
- Clear focus indicators
- Large touch targets
- Readable font sizes

### Semantic
- Proper label associations
- Radio group structure
- ARIA attributes
- Keyboard navigation

---

## 🎉 Success Indicators

**Feature is visually correct when:**
- ✅ "From" text is visible but subtle
- ✅ Prices are prominent and clear
- ✅ Selected option is obviously highlighted
- ✅ Dialog is easy to use on all devices
- ✅ Cart shows portion information
- ✅ No visual glitches or overlaps
- ✅ Smooth animations and transitions
- ✅ Consistent with overall design system
