# Visual Guide - Mobile QR Scanner

## What You'll See

### 1. Mobile Device - Scan QR Page

```
╔═══════════════════════════════════╗
║  ← DineQR                    ☰   ║
╠═══════════════════════════════════╣
║                                   ║
║         ┌─────────┐               ║
║         │   🔲   │               ║
║         └─────────┘               ║
║                                   ║
║      Scan QR Code                 ║
║                                   ║
║  Scan the QR code on your table  ║
║  to view the menu and place      ║
║  orders                           ║
║                                   ║
║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ║
║  ┃                           ┃  ║
║  ┃         📷                ┃  ║
║  ┃                           ┃  ║
║  ┃  Open Camera to Scan      ┃  ║ ← TAP HERE
║  ┃                           ┃  ║
║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ║
║                                   ║
║  ─── Or enter code manually ───  ║
║                                   ║
║  QR Code                          ║
║  ┌─────────────────────────────┐ ║
║  │ Enter QR code from table... │ ║
║  └─────────────────────────────┘ ║
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │       Continue              │ ║
║  └─────────────────────────────┘ ║
║                                   ║
║  The QR code can be found on     ║
║  your restaurant table            ║
║  💡 Tip: Use the camera scanner  ║
║     for faster access             ║
║                                   ║
╚═══════════════════════════════════╝
```

### 2. Camera Permission Dialog

```
╔═══════════════════════════════════╗
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │                             │ ║
║  │  "DineQR" Would Like to     │ ║
║  │  Access the Camera          │ ║
║  │                             │ ║
║  │  ┌───────────┐ ┌──────────┐│ ║
║  │  │Don't Allow│ │    OK    ││ ║ ← TAP OK
║  │  └───────────┘ └──────────┘│ ║
║  │                             │ ║
║  └─────────────────────────────┘ ║
║                                   ║
╚═══════════════════════════════════╝
```

### 3. Camera Scanner Active (Fullscreen)

```
╔═══════════════════════════════════╗
║ 📷 Scan QR Code              ✕   ║ ← Close button
╠═══════════════════════════════════╣
║                                   ║
║                                   ║
║                                   ║
║        ┏━━━━━━━━━━━━━┓            ║
║        ┃             ┃            ║
║        ┃   CAMERA    ┃            ║
║        ┃   VIDEO     ┃            ║ ← Live camera feed
║        ┃   STREAM    ┃            ║
║        ┃             ┃            ║
║        ┗━━━━━━━━━━━━━┛            ║
║                                   ║
║                                   ║
║    ┌─────────────────────────┐   ║
║    │ ● Position QR code      │   ║ ← Scanning indicator
║    │   within the frame      │   ║
║    └─────────────────────────┘   ║
║                                   ║
║                                   ║
║  Point your camera at the QR     ║
║  code on your table               ║
║  The code will be scanned         ║
║  automatically                    ║
║                                   ║
╚═══════════════════════════════════╝
```

### 4. QR Code Detected - Success

```
╔═══════════════════════════════════╗
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │  ✅ Success!                │ ║
║  │                             │ ║
║  │  Opening menu for Table 5   │ ║ ← Success message
║  │                             │ ║
║  └─────────────────────────────┘ ║
║                                   ║
╚═══════════════════════════════════╝
```

### 5. Menu Page with Table Badge

```
╔═══════════════════════════════════╗
║  ← La Bella Italia          🛒 3  ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────┐                  ║
║  │  Table 5    │                  ║ ← Table badge
║  └─────────────┘                  ║
║                                   ║
║  ┌─ Appetizers ─┬─ Main ─┬─ ... ║
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │ 🍕 Margherita Pizza         │ ║
║  │ Classic tomato & mozzarella │ ║
║  │ $12.99          [Add to Cart]│ ║
║  └─────────────────────────────┘ ║
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │ 🥗 Caesar Salad             │ ║
║  │ Fresh romaine lettuce       │ ║
║  │ $8.99           [Add to Cart]│ ║
║  └─────────────────────────────┘ ║
║                                   ║
╚═══════════════════════════════════╝
```

### 6. Desktop View - No Camera

```
╔═══════════════════════════════════╗
║  ← DineQR                    ☰   ║
╠═══════════════════════════════════╣
║                                   ║
║         ┌─────────┐               ║
║         │   🔲   │               ║
║         └─────────┘               ║
║                                   ║
║      Scan QR Code                 ║
║                                   ║
║  Scan the QR code on your table  ║
║  to view the menu and place      ║
║  orders                           ║
║                                   ║
║  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ║
║  │                           │  ║
║  │         📱                │  ║
║  │                           │  ║
║  │  Camera scanning          │  ║
║  │  available on mobile      │  ║ ← Desktop message
║  │  devices                  │  ║
║  │                           │  ║
║  │  Please open this page on │  ║
║  │  your smartphone to use   │  ║
║  │  the camera scanner       │  ║
║  │                           │  ║
║  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  ║
║                                   ║
║  ─── Or enter code manually ───  ║
║                                   ║
║  QR Code                          ║
║  ┌─────────────────────────────┐ ║
║  │ Enter QR code from table... │ ║
║  └─────────────────────────────┘ ║
║                                   ║
║  ┌─────────────────────────────┐ ║
║  │       Continue              │ ║
║  └─────────────────────────────┘ ║
║                                   ║
╚═══════════════════════════════════╝
```

## Color Scheme

### Mobile Scanner
- **Background:** Black (#000000) - Fullscreen
- **Header:** White text on black
- **Scanning Box:** White border
- **Indicator:** Primary color with pulse animation
- **Instructions:** White text with transparency

### Scan QR Page
- **Background:** Gradient (background → accent/10 → background)
- **Card:** White background
- **Primary Button:** Orange (#FF6B35)
- **Text:** Dark gray (#2C3E50)
- **Icons:** Primary color

## Animation & Feedback

### Camera Opening
```
Button Tap → Fade Out → Camera Fade In
Duration: 300ms
```

### QR Detection
```
Scanning... → Detected! → Success Toast → Navigate
Duration: < 2 seconds total
```

### Success Toast
```
┌─────────────────────────────┐
│ ✅ Success!                 │
│ Opening menu for Table 5    │
└─────────────────────────────┘
Duration: 3 seconds
Position: Top of screen
```

### Error Toast
```
┌─────────────────────────────┐
│ ❌ Invalid QR Code          │
│ This QR code is not valid.  │
│ Please try scanning again.  │
└─────────────────────────────┘
Duration: 5 seconds
Position: Top of screen
```

## User Actions

### Primary Flow (Mobile)
1. **Tap** "Open Camera to Scan" button
2. **Allow** camera permission
3. **Point** camera at QR code
4. **Wait** for automatic detection
5. **View** menu automatically

### Fallback Flow (All Devices)
1. **Scroll** to manual entry section
2. **Type** QR code text
3. **Tap** "Continue" button
4. **View** menu

## Tips for Best Experience

### For Customers
```
✅ DO:
- Use mobile device for camera scanning
- Hold phone steady
- Ensure good lighting
- Point directly at QR code
- Wait for automatic detection

❌ DON'T:
- Move phone while scanning
- Cover QR code partially
- Scan from too far away
- Use desktop for camera scan
```

### For Restaurant Owners
```
✅ DO:
- Print QR codes clearly
- Place in visible location
- Ensure good lighting at tables
- Keep QR codes clean
- Test QR codes regularly

❌ DON'T:
- Use low-quality prints
- Place in dark areas
- Cover QR codes
- Use damaged QR codes
```

## Accessibility

### Visual
- ✅ High contrast colors
- ✅ Large touch targets (48px minimum)
- ✅ Clear instructions
- ✅ Visual feedback

### Interaction
- ✅ Touch-friendly buttons
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Error messages clear

## Responsive Design

### Mobile Portrait (< 768px)
- Large camera button (full width)
- Fullscreen scanner
- Stacked layout
- Touch-optimized

### Mobile Landscape
- Adjusted scanner layout
- Horizontal orientation support
- Optimized video stream

### Tablet (768px - 1024px)
- May show camera button (if touch-enabled)
- Centered card layout
- Larger touch targets

### Desktop (> 1024px)
- Desktop message shown
- No camera button
- Manual entry emphasized
- Centered card layout

---

**Visual Guide Complete** ✅
**All UI States Documented**
**Ready for Implementation Testing**
