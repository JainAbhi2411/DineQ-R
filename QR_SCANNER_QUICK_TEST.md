# QR Scanner - Quick Test Guide

## 30-Second Mobile Test ⚡

### On Your Smartphone:

1. **Open the app** on your mobile device
2. **Navigate to** "Scan QR" page
3. **Tap** the large "Open Camera to Scan" button
4. **Allow** camera permission when prompted
5. **Point** camera at any QR code
6. **Wait** for automatic detection (1-2 seconds)

### ✅ Expected Results:
- Camera opens in fullscreen
- Video stream shows
- QR code detected automatically
- Scanner closes
- Success message appears
- Navigates to menu (if valid table QR)

### ❌ If It Doesn't Work:
- Check camera permission in browser settings
- Try refreshing the page
- Ensure you're using HTTPS
- Try manual entry as fallback

## Visual Checklist

### Mobile View - Before Scan
```
┌─────────────────────────┐
│   📷 Large Button       │ ← Should be visible
│   "Open Camera to Scan" │
└─────────────────────────┘
```

### Mobile View - During Scan
```
┌─────────────────────────┐
│ 📷 Scan QR Code    [X]  │ ← Header with close
│                         │
│   ┌─────────────┐       │
│   │   CAMERA    │       │ ← Video stream
│   │   PREVIEW   │       │
│   └─────────────┘       │
│                         │
│ ● Position QR code...   │ ← Indicator
└─────────────────────────┘
```

### Desktop View
```
┌─────────────────────────┐
│   📱 Smartphone Icon    │ ← Desktop message
│   "Camera scanning      │
│    available on mobile" │
└─────────────────────────┘
```

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No camera button | Open on mobile device |
| Camera won't open | Grant permission in settings |
| QR not detected | Move closer, improve lighting |
| Error message | Use manual entry below |

## Test with Sample QR Code

If you don't have a table QR code, test with any QR code:

1. **Generate test QR:** Use any online QR generator
2. **Scan it:** Should detect and show the text
3. **Validation:** Will fail (expected) but proves scanner works

## Browser Compatibility Quick Check

### ✅ Supported:
- iOS Safari 11+
- iOS Chrome
- Android Chrome 60+
- Android Firefox 68+

### ⚠️ Desktop:
- Shows manual entry option
- Camera not available

## Performance Benchmarks

| Action | Target Time |
|--------|-------------|
| Camera open | < 2 sec |
| QR detection | < 2 sec |
| Total scan | < 5 sec |

## Success Indicators

✅ **Working Correctly:**
- Camera button visible on mobile
- Camera opens when tapped
- Video stream displays
- QR codes detected automatically
- Scanner closes after scan
- Navigation works

❌ **Needs Attention:**
- No camera button on mobile
- Permission errors
- Black screen in scanner
- QR codes not detected
- Scanner doesn't close

## Quick Demo Script

**For showing to others:**

```
"Watch this - I'll scan this QR code..."

1. Tap camera button
2. Point at QR code
3. *Beep* - Detected!
4. Menu opens automatically

"That's it! Takes less than 5 seconds."
```

## Emergency Fallback

**If camera doesn't work:**

1. Scroll down to "Or enter code manually"
2. Type/paste the QR code text
3. Click "Continue"
4. Same result as camera scan

---

**Quick Test Time:** 30 seconds
**Full Test Time:** 2 minutes
**Difficulty:** Easy
**Device Needed:** Smartphone with camera
