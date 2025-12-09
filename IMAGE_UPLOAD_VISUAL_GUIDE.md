# Image Upload Feature - Visual Guide

## 🎨 User Interface Overview

### Main Upload Interface

The image upload component appears in the menu item form with two tabs:

```
┌─────────────────────────────────────────────────────┐
│  Menu Item Image                                     │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┬──────────────┐                    │
│  │ Upload File  │  Image URL   │  ← Tabs            │
│  └──────────────┴──────────────┘                    │
│                                                      │
│  [Upload Area or URL Input]                         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📤 Method 1: Upload File

### Initial State (No Image)

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────┬──────────────┐                    │
│  │ Upload File  │  Image URL   │                    │
│  └──────────────┴──────────────┘                    │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│  │                                                 │ │
│  │              ┌───────────┐                      │ │
│  │              │  📷 Icon  │                      │ │
│  │              └───────────┘                      │ │
│  │                                                 │ │
│  │     Drag and drop your image here               │ │
│  │     or click the button below to browse         │ │
│  │                                                 │ │
│  │     Supported: JPEG, PNG, WEBP, GIF, AVIF      │ │
│  │              (Max 1MB)                          │ │
│  │                                                 │ │
│  │          ┌──────────────────┐                   │ │
│  │          │ 📤 Browse Files  │                   │ │
│  │          └──────────────────┘                   │ │
│  │                                                 │ │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│                                                      │
│  ⚠️ Files larger than 1MB will be automatically     │
│     compressed to WEBP format                       │
└─────────────────────────────────────────────────────┘
```

### Drag Active State

```
┌─────────────────────────────────────────────────────┐
│  ┌ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ┐ │
│  ┃  ← Border highlights in primary color          ┃ │
│  ┃              ┌───────────┐                      ┃ │
│  ┃              │  📷 Icon  │                      ┃ │
│  ┃              └───────────┘                      ┃ │
│  ┃                                                 ┃ │
│  ┃     Drop your image here                        ┃ │
│  ┃                                                 ┃ │
│  └ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ┘ │
└─────────────────────────────────────────────────────┘
```

### Uploading State

```
┌─────────────────────────────────────────────────────┐
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│  │                                                 │ │
│  │              ┌───────────┐                      │ │
│  │              │  🔄 Spin  │  ← Animated spinner │ │
│  │              └───────────┘                      │ │
│  │                                                 │ │
│  │            Uploading...                         │ │
│  │                                                 │ │
│  │     ████████████░░░░░░░░░░░░  60%              │ │
│  │     ← Progress bar                              │ │
│  │                                                 │ │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
└─────────────────────────────────────────────────────┘
```

### Success State (With Preview)

```
┌─────────────────────────────────────────────────────┐
│  Menu Item Image                                     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │                                          [X]│   │
│  │                                             │   │
│  │         ╔═══════════════════════╗           │   │
│  │         ║                       ║           │   │
│  │         ║   🍕 Food Image       ║           │   │
│  │         ║   Preview             ║           │   │
│  │         ║                       ║           │   │
│  │         ╚═══════════════════════╝           │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│  ↑ Click X to remove                                │
│                                                      │
│  ┌──────────────┬──────────────┐                    │
│  │ Upload File  │  Image URL   │                    │
│  └──────────────┴──────────────┘                    │
└─────────────────────────────────────────────────────┘
```

---

## 🔗 Method 2: Image URL

### URL Input Interface

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────┬──────────────┐                    │
│  │ Upload File  │  Image URL   │                    │
│  └──────────────┴──────────────┘                    │
│                                                      │
│  Image URL                                           │
│  ┌─────────────────────────────────────────────┐   │
│  │ https://example.com/image.jpg              │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────┐                                       │
│  │ ✓ Add    │                                       │
│  └──────────┘                                       │
│                                                      │
│  Enter a direct link to an image                    │
│  (must start with http:// or https://)              │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Toast Notifications

### Success - Normal Upload

```
┌─────────────────────────────────┐
│  ✅ Success                      │
│  Image uploaded successfully    │
└─────────────────────────────────┘
```

### Success - With Compression

```
┌─────────────────────────────────────────────┐
│  ✅ Success                                  │
│  Image uploaded and compressed from         │
│  2048KB to 856KB                            │
└─────────────────────────────────────────────┘
```

### Success - URL Added

```
┌─────────────────────────────────┐
│  ✅ Success                      │
│  Image URL added successfully   │
└─────────────────────────────────┘
```

### Error - Invalid File Type

```
┌─────────────────────────────────────────────┐
│  ❌ Upload Failed                            │
│  Invalid file type. Allowed types:          │
│  JPEG, PNG, WEBP, GIF, AVIF                 │
└─────────────────────────────────────────────┘
```

### Error - Invalid Filename

```
┌─────────────────────────────────────────────┐
│  ❌ Upload Failed                            │
│  Filename must contain only English         │
│  letters and numbers                        │
└─────────────────────────────────────────────┘
```

### Error - Invalid URL

```
┌─────────────────────────────────────────────┐
│  ❌ Invalid URL                              │
│  Please enter a valid HTTP or HTTPS URL     │
└─────────────────────────────────────────────┘
```

---

## 🎯 Complete User Flow

### Flow 1: Upload from Computer

```
1. Click "Add Menu Item" or Edit existing item
   │
   ▼
2. Navigate to "Basic Info" tab
   │
   ▼
3. Find "Menu Item Image" section
   │
   ▼
4. Choose "Upload File" tab
   │
   ├─→ Option A: Drag & Drop
   │   │
   │   ├─→ Drag image file over upload area
   │   │   (Border highlights)
   │   │
   │   └─→ Drop file
   │       (Upload starts)
   │
   └─→ Option B: Browse
       │
       ├─→ Click "Browse Files" button
       │
       ├─→ Select image from file picker
       │
       └─→ Upload starts automatically
   │
   ▼
5. Wait for upload (progress bar shows)
   │
   ▼
6. See preview and success notification
   │
   ▼
7. Fill other fields and save menu item
```

### Flow 2: Add Image URL

```
1. Click "Add Menu Item" or Edit existing item
   │
   ▼
2. Navigate to "Basic Info" tab
   │
   ▼
3. Find "Menu Item Image" section
   │
   ▼
4. Choose "Image URL" tab
   │
   ▼
5. Paste image URL in input field
   │
   ▼
6. Click "Add" button (or press Enter)
   │
   ▼
7. See preview and success notification
   │
   ▼
8. Fill other fields and save menu item
```

### Flow 3: Remove Image

```
1. Image preview is showing
   │
   ▼
2. Click [X] button on top-right of preview
   │
   ▼
3. Preview disappears
   │
   ▼
4. "Image Removed" notification appears
   │
   ▼
5. Can upload new image or leave empty
```

---

## 🎨 Visual States Summary

| State | Visual Indicator |
|-------|------------------|
| **Empty** | Dashed border, upload icon, instructions |
| **Drag Active** | Highlighted border (primary color) |
| **Uploading** | Spinner animation, progress bar |
| **Success** | Image preview with remove button |
| **Error** | Toast notification with error message |

---

## 💡 Tips for Best User Experience

### Visual Cues

1. **Dashed Border**: Indicates drag-and-drop area
2. **Highlighted Border**: Shows drag is active
3. **Spinner**: Upload in progress
4. **Progress Bar**: Shows upload percentage
5. **Preview**: Confirms successful upload
6. **X Button**: Allows removing image

### Interactive Elements

- **Upload Area**: Click to open file picker
- **Browse Button**: Alternative way to open file picker
- **URL Input**: Type or paste image URL
- **Add Button**: Confirm URL input
- **Remove Button**: Delete uploaded image
- **Tab Switcher**: Toggle between upload methods

### Feedback Mechanisms

- **Visual**: Border changes, icons, progress bars
- **Textual**: Instructions, notifications, error messages
- **Interactive**: Buttons enable/disable based on state

---

## 📊 Compression Visualization

### Before Compression (> 1MB)

```
Original File: 2.5 MB
┌────────────────────────────────────┐
│ ████████████████████████████████   │ 2500 KB
└────────────────────────────────────┘
                ↓
         [Auto Compress]
                ↓
```

### After Compression (< 1MB)

```
Compressed File: 0.85 MB
┌─────────────────┐
│ ████████████    │ 850 KB
└─────────────────┘

✅ Reduced by 66%
✅ WEBP format
✅ Max 1080p resolution
✅ 80% quality (adjusted as needed)
```

---

## 🎬 Animation Behaviors

### Drag & Drop Animation

```
1. Drag Enter  → Border color changes to primary
2. Drag Over   → Border stays highlighted
3. Drag Leave  → Border returns to normal
4. Drop        → Upload starts, spinner appears
```

### Upload Progress Animation

```
1. Start       → Spinner rotates, progress at 10%
2. Uploading   → Progress bar fills gradually
3. Complete    → Progress reaches 100%
4. Success     → Preview fades in, notification appears
```

### Remove Animation

```
1. Click X     → Button highlights
2. Remove      → Preview fades out
3. Complete    → Upload area reappears
```

---

## 🔍 Accessibility Features

- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader Support**: Descriptive labels and ARIA attributes
- **Visual Feedback**: Clear state changes for all actions
- **Error Messages**: Specific, actionable error descriptions
- **Progress Indicators**: Visual and textual upload status

---

## 📱 Responsive Design

### Desktop View (> 1024px)

```
┌─────────────────────────────────────────────────────┐
│  Full width upload area                              │
│  Large preview (192px height)                        │
│  Side-by-side tabs                                   │
└─────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌───────────────────────┐
│  Compact upload area  │
│  Smaller preview      │
│  Stacked tabs         │
└───────────────────────┘
```

---

## ✨ Summary

The image upload interface provides:

- **Clear Visual Hierarchy**: Easy to understand layout
- **Multiple Input Methods**: File upload and URL input
- **Real-time Feedback**: Progress bars and notifications
- **Error Prevention**: Validation before upload
- **User Control**: Easy to add, preview, and remove images
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard and screen reader friendly
