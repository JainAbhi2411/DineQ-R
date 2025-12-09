# Image Upload Feature - Quick Test Guide

## 🚀 Quick Start Testing

### Prerequisites

1. ✅ Logged in as a restaurant owner
2. ✅ Have at least one restaurant created
3. ✅ Have at least one menu category created

---

## ✅ Test 1: Upload Small Image (< 1MB)

**Time: 2 minutes**

### Steps:

1. Navigate to: **Owner Dashboard → Select Restaurant → Menu Management**
2. Click **"Add Menu Item"** button
3. In the form, find **"Menu Item Image"** section
4. Click **"Upload File"** tab
5. Click **"Browse Files"** button
6. Select an image file **< 1MB** from your computer
7. Wait for upload to complete

### Expected Results:

- ✅ Upload completes in a few seconds
- ✅ Image preview appears
- ✅ Toast notification: **"Image uploaded successfully"**
- ✅ No compression message

### Screenshot Checkpoint:

```
┌─────────────────────────────────┐
│  ✅ Success                      │
│  Image uploaded successfully    │
└─────────────────────────────────┘

[Image Preview Visible]
```

---

## ✅ Test 2: Upload Large Image (> 1MB)

**Time: 3 minutes**

### Steps:

1. In the same form or create a new menu item
2. Click **"Upload File"** tab
3. Click **"Browse Files"** button
4. Select an image file **> 1MB** from your computer
5. Wait for upload and compression

### Expected Results:

- ✅ Upload takes slightly longer (compression happening)
- ✅ Image preview appears
- ✅ Toast notification shows compression details:
  ```
  ✅ Success
  Image uploaded and compressed from 2048KB to 856KB
  ```
- ✅ Preview shows the compressed image

### What to Check:

- File size reduced to < 1MB
- Image quality still looks good
- Format converted to WEBP

---

## ✅ Test 3: Drag and Drop

**Time: 1 minute**

### Steps:

1. Open file explorer/finder on your computer
2. Find an image file
3. Drag the file over the upload area in the form
4. **Observe**: Border should highlight
5. Drop the file
6. Wait for upload

### Expected Results:

- ✅ Border highlights when dragging over
- ✅ Border returns to normal when dragging away
- ✅ Upload starts immediately on drop
- ✅ Preview appears after upload

### Visual Checkpoint:

```
Drag Over:
┌ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ┐
┃  Border highlighted       ┃
┃  (primary color)          ┃
└ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ┘
```

---

## ✅ Test 4: Add Image URL

**Time: 1 minute**

### Steps:

1. In the menu item form, find **"Menu Item Image"** section
2. Click **"Image URL"** tab
3. Paste this test URL:
   ```
   https://images.unsplash.com/photo-1546069901-ba9599a7e63c
   ```
4. Click **"Add"** button

### Expected Results:

- ✅ Preview appears immediately
- ✅ Toast notification: **"Image URL added successfully"**
- ✅ Image loads in preview

### Alternative Test URLs:

```
Pizza:
https://images.unsplash.com/photo-1565299624946-b28f40a0ae38

Burger:
https://images.unsplash.com/photo-1568901346375-23c9450c58cd

Pasta:
https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9
```

---

## ✅ Test 5: Remove Image

**Time: 30 seconds**

### Steps:

1. After uploading an image (from any previous test)
2. Look for the **[X]** button on top-right of preview
3. Click the **[X]** button

### Expected Results:

- ✅ Preview disappears
- ✅ Toast notification: **"Image Removed"**
- ✅ Upload area reappears
- ✅ Can upload a new image

---

## ✅ Test 6: Invalid File Type

**Time: 1 minute**

### Steps:

1. Try to upload a **non-image file** (e.g., PDF, TXT, DOCX)
2. Click **"Browse Files"**
3. Select the non-image file

### Expected Results:

- ✅ File picker should filter out non-image files
- ✅ If somehow selected, error message appears:
  ```
  ❌ Upload Failed
  Invalid file type. Allowed types: JPEG, PNG, WEBP, GIF, AVIF
  ```

---

## ✅ Test 7: Invalid URL

**Time: 1 minute**

### Steps:

1. Click **"Image URL"** tab
2. Enter an invalid URL:
   ```
   not-a-valid-url
   ```
3. Click **"Add"** button

### Expected Results:

- ✅ Error notification appears:
  ```
  ❌ Invalid URL
  Please enter a valid HTTP or HTTPS URL
  ```
- ✅ No preview appears

---

## ✅ Test 8: Complete Menu Item Creation

**Time: 3 minutes**

### Steps:

1. Create a new menu item with all fields:
   - **Name**: "Test Pizza"
   - **Description**: "Delicious test pizza"
   - **Category**: Select any category
   - **Price**: 12.99
   - **Image**: Upload or add URL
2. Fill in other optional fields if desired
3. Click **"Save"** button

### Expected Results:

- ✅ Menu item created successfully
- ✅ Image URL saved in database
- ✅ Menu item appears in menu list with image
- ✅ Image displays correctly in menu browsing page

---

## ✅ Test 9: Edit Existing Menu Item Image

**Time: 2 minutes**

### Steps:

1. Find an existing menu item
2. Click **"Edit"** button
3. In the form, the current image should show in preview
4. Upload a new image or change URL
5. Click **"Save"**

### Expected Results:

- ✅ Current image shows in preview when form opens
- ✅ Can replace with new image
- ✅ New image saves successfully
- ✅ Old image replaced with new one

---

## ✅ Test 10: Non-English Filename

**Time: 1 minute**

### Steps:

1. Rename an image file to include Chinese/special characters
   - Example: `美食图片.jpg` or `фото.png`
2. Try to upload this file

### Expected Results:

- ✅ Error notification appears:
  ```
  ❌ Upload Failed
  Filename must contain only English letters and numbers
  ```
- ✅ Upload is blocked

---

## 🎯 Complete Test Checklist

Use this checklist to verify all features work:

- [ ] Small image upload (< 1MB)
- [ ] Large image upload (> 1MB) with compression
- [ ] Drag and drop functionality
- [ ] Direct URL input
- [ ] Image preview display
- [ ] Remove image functionality
- [ ] Invalid file type rejection
- [ ] Invalid URL rejection
- [ ] Non-English filename rejection
- [ ] Complete menu item creation with image
- [ ] Edit existing menu item image
- [ ] Image displays in menu browsing page

---

## 🐛 Common Issues & Solutions

### Issue 1: Upload button doesn't work

**Check:**
- Are you logged in as owner?
- Do you have permission to upload?
- Check browser console for errors

**Solution:**
- Refresh page and try again
- Clear browser cache
- Try different browser

---

### Issue 2: Image doesn't appear in preview

**Check:**
- Is the URL valid and accessible?
- Is the file format supported?
- Check browser console for CORS errors

**Solution:**
- Try a different image URL
- Upload file instead of using URL
- Check image URL in new browser tab

---

### Issue 3: Compression takes too long

**Check:**
- File size of original image
- Internet connection speed
- Browser performance

**Solution:**
- Use smaller source images (< 5MB)
- Close other browser tabs
- Try different browser

---

### Issue 4: Image quality too low after compression

**Check:**
- Original image quality
- Original image size

**Solution:**
- Start with higher quality source image
- Use images already optimized for web
- Try WEBP or JPEG format

---

## 📊 Test Results Template

Use this template to record your test results:

```
Date: _______________
Tester: _______________
Browser: _______________

Test Results:
✅ Test 1: Small image upload          [ PASS / FAIL ]
✅ Test 2: Large image upload          [ PASS / FAIL ]
✅ Test 3: Drag and drop               [ PASS / FAIL ]
✅ Test 4: Image URL                   [ PASS / FAIL ]
✅ Test 5: Remove image                [ PASS / FAIL ]
✅ Test 6: Invalid file type           [ PASS / FAIL ]
✅ Test 7: Invalid URL                 [ PASS / FAIL ]
✅ Test 8: Complete creation           [ PASS / FAIL ]
✅ Test 9: Edit existing image         [ PASS / FAIL ]
✅ Test 10: Non-English filename       [ PASS / FAIL ]

Overall Status: [ PASS / FAIL ]

Notes:
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 🎬 Video Test Scenario

For a comprehensive test, follow this complete scenario:

### Scenario: Add New Menu Item with Image

**Time: 5 minutes**

1. **Login** as restaurant owner
2. **Navigate** to Menu Management
3. **Click** "Add Menu Item"
4. **Fill** basic information:
   - Name: "Margherita Pizza"
   - Description: "Classic Italian pizza"
   - Category: "Main Course"
   - Price: 14.99
5. **Upload** image using drag-and-drop
6. **Wait** for upload to complete
7. **Verify** preview appears
8. **Fill** additional details (optional)
9. **Click** "Save"
10. **Navigate** to Menu Browsing page
11. **Verify** image displays correctly

### Success Criteria:

- ✅ All steps complete without errors
- ✅ Image uploads successfully
- ✅ Menu item created with image
- ✅ Image displays in menu browsing
- ✅ Image loads quickly
- ✅ Image quality is good

---

## 📱 Mobile Testing

If testing on mobile device:

### Additional Tests:

1. **Touch Drag**: Try dragging image on mobile (may not work)
2. **File Picker**: Use mobile file picker to select image
3. **Camera Upload**: Take photo and upload directly
4. **URL Input**: Test keyboard input on mobile
5. **Preview Size**: Verify preview fits mobile screen

### Mobile-Specific Checks:

- [ ] Upload button easily tappable
- [ ] Preview image fits screen
- [ ] Tabs switch smoothly
- [ ] Notifications readable
- [ ] Form scrolls properly

---

## ✅ Final Verification

After all tests pass:

1. **Create 3-5 menu items** with different images
2. **View menu browsing page** as customer
3. **Verify all images** load correctly
4. **Check image quality** on different devices
5. **Test page load speed** with multiple images

### Success Indicators:

- ✅ All images display correctly
- ✅ Page loads in < 3 seconds
- ✅ Images are properly sized
- ✅ No broken image links
- ✅ Responsive on mobile and desktop

---

## 🎉 Test Complete!

If all tests pass, the image upload feature is working correctly and ready for production use!

**Next Steps:**
- Train restaurant owners on how to use the feature
- Monitor upload success rates
- Collect user feedback
- Optimize based on usage patterns
