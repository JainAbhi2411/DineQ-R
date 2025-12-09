# Image Upload Feature for Menu Management

## Overview

The restaurant application now supports comprehensive image upload functionality for menu items. Restaurant owners can upload images using three different methods:

1. **Local File Upload** - Upload images directly from your computer with drag-and-drop support
2. **Direct URL Input** - Paste a direct link to an image hosted elsewhere
3. **Automatic Compression** - Files larger than 1MB are automatically compressed to WEBP format

## Features

### 🎯 Core Capabilities

- **Multiple Upload Methods**: Choose between file upload or URL input
- **Drag & Drop**: Simply drag image files into the upload area
- **Automatic Compression**: Files > 1MB are automatically compressed to stay under the limit
- **Image Preview**: See the uploaded image before saving
- **Format Support**: JPEG, PNG, WEBP, GIF, AVIF
- **Validation**: Automatic validation of file types, sizes, and URLs
- **Progress Indicator**: Visual feedback during upload process
- **Remove Option**: Easily remove uploaded images

### 🔒 Security & Validation

- **File Type Validation**: Only image formats are accepted
- **Filename Validation**: Filenames must contain only English letters and numbers
- **URL Validation**: Direct URLs must be valid HTTP/HTTPS links
- **Size Limit**: Maximum 1MB (with automatic compression if exceeded)
- **Secure Storage**: Images stored in Supabase Storage with proper access policies

## How to Use

### For Restaurant Owners

#### Adding/Editing Menu Items

1. **Navigate to Menu Management**
   - Go to Owner Dashboard → Select Restaurant → Menu Management
   - Click "Add Menu Item" or edit an existing item

2. **Upload Image - Method 1: Local File**
   - In the "Basic Info" tab, find the "Menu Item Image" section
   - Click the "Upload File" tab
   - Either:
     - Drag and drop an image file into the upload area, OR
     - Click "Browse Files" to select from your computer
   - Wait for the upload to complete
   - Preview will appear automatically

3. **Upload Image - Method 2: Direct URL**
   - Click the "Image URL" tab
   - Paste the direct link to your image
   - Click "Add" button
   - Preview will appear automatically

4. **Remove Image**
   - Click the X button on the top-right corner of the preview
   - The image will be removed from the form

5. **Save Menu Item**
   - Fill in other required fields (name, category, price)
   - Click "Save" to create/update the menu item

### Automatic Compression

If you upload a file larger than 1MB:

1. The system automatically compresses it to WEBP format
2. Resolution is limited to 1080p (maintaining aspect ratio)
3. Quality is adjusted to keep file size under 1MB
4. You'll see a notification showing the original and final file sizes

**Example Notification:**
```
✅ Success
Image uploaded and compressed from 2048KB to 856KB
```

## Technical Details

### File Structure

```
src/
├── components/
│   └── ui/
│       └── ImageUpload.tsx          # Main upload component
├── utils/
│   └── imageUpload.ts               # Upload utilities
└── components/
    └── owner/
        └── EnhancedMenuItemForm.tsx # Integrated form
```

### Storage Configuration

- **Bucket Name**: `app-7x1ojvae4075_food_images`
- **Max File Size**: 1MB (1,048,576 bytes)
- **Allowed Types**: image/jpeg, image/png, image/webp, image/gif, image/avif
- **Public Access**: Read-only for all users
- **Upload Access**: Restaurant owners only

### Compression Algorithm

When a file exceeds 1MB:

1. **Resize**: Scale down to max 1080p (preserving aspect ratio)
2. **Convert**: Change format to WEBP
3. **Quality Adjustment**: Start at 80% quality, reduce by 10% iteratively
4. **Stop Condition**: File size < 1MB or quality < 10%

### API Functions

#### `validateImageFile(file: File)`
Validates file type and filename

#### `compressImage(file: File)`
Compresses image to WEBP format under 1MB

#### `uploadImageToSupabase(file: File, restaurantId: string)`
Uploads file to Supabase Storage and returns public URL

#### `validateImageUrl(url: string)`
Validates if URL is a valid HTTP/HTTPS link

#### `deleteImageFromSupabase(path: string)`
Deletes image from Supabase Storage

## User Experience

### Visual Feedback

- **Drag Active**: Border highlights when dragging file over upload area
- **Uploading**: Spinner animation and progress bar
- **Success**: Toast notification with compression details (if applicable)
- **Error**: Clear error messages for validation failures
- **Preview**: Full image preview with remove button

### Error Messages

| Error | Message |
|-------|---------|
| Invalid file type | "Invalid file type. Allowed types: JPEG, PNG, WEBP, GIF, AVIF" |
| Non-English filename | "Filename must contain only English letters and numbers" |
| Invalid URL | "Please enter a valid HTTP or HTTPS URL" |
| Upload failed | "Upload failed: [specific error]" |
| Image load failed | "Failed to load image" |

## Testing Guide

### Test Case 1: Upload Small Image (< 1MB)

1. Create/edit a menu item
2. Upload an image < 1MB
3. **Expected**: Image uploads successfully without compression
4. **Verify**: Preview appears, no compression notification

### Test Case 2: Upload Large Image (> 1MB)

1. Create/edit a menu item
2. Upload an image > 1MB
3. **Expected**: Image is automatically compressed
4. **Verify**: 
   - Preview appears
   - Toast shows "compressed from XKB to YKB"
   - Final size < 1MB

### Test Case 3: Drag and Drop

1. Create/edit a menu item
2. Drag an image file over the upload area
3. **Expected**: Border highlights
4. Drop the file
5. **Expected**: Upload starts automatically

### Test Case 4: Direct URL

1. Create/edit a menu item
2. Switch to "Image URL" tab
3. Paste a valid image URL
4. Click "Add"
5. **Expected**: Preview appears immediately

### Test Case 5: Invalid File Type

1. Try to upload a PDF or text file
2. **Expected**: Error message about invalid file type

### Test Case 6: Non-English Filename

1. Try to upload an image with Chinese/special characters in filename
2. **Expected**: Error message about filename requirements

### Test Case 7: Remove Image

1. Upload an image
2. Click the X button on preview
3. **Expected**: Preview disappears, image removed from form

### Test Case 8: Invalid URL

1. Switch to "Image URL" tab
2. Enter an invalid URL (e.g., "not-a-url")
3. Click "Add"
4. **Expected**: Error message about invalid URL

## Troubleshooting

### Issue: Upload fails with "Upload failed" error

**Solution**: Check that you're logged in as a restaurant owner and have proper permissions

### Issue: Image doesn't appear in preview

**Solution**: 
- Verify the URL is accessible
- Check browser console for CORS errors
- Ensure the URL points directly to an image file

### Issue: Compression takes too long

**Solution**: 
- Use smaller source images (< 5MB recommended)
- Ensure stable internet connection
- Try a different browser if issue persists

### Issue: "Filename must contain only English letters" error

**Solution**: Rename your file to use only English letters, numbers, and basic symbols before uploading

## Best Practices

### For Optimal Results

1. **Image Dimensions**: Use images at least 800x600px for best quality
2. **Aspect Ratio**: 4:3 or 16:9 works best for menu items
3. **File Format**: WEBP or JPEG recommended for best compression
4. **File Size**: Keep original files under 2MB for faster uploads
5. **Image Content**: Use well-lit, high-quality photos of food
6. **Background**: Clean, simple backgrounds work best

### Recommended Image Specifications

- **Minimum Resolution**: 800x600px
- **Recommended Resolution**: 1920x1080px
- **Aspect Ratio**: 4:3 or 16:9
- **Format**: WEBP, JPEG, or PNG
- **File Size**: < 2MB (will be compressed if larger)

## Files Modified/Created

### New Files

1. **src/utils/imageUpload.ts**
   - Image validation functions
   - Compression algorithm
   - Supabase upload/delete functions
   - URL validation

2. **src/components/ui/ImageUpload.tsx**
   - Main upload component
   - Drag-and-drop interface
   - URL input interface
   - Preview functionality

### Modified Files

1. **src/components/owner/EnhancedMenuItemForm.tsx**
   - Integrated ImageUpload component
   - Replaced simple URL input with full upload interface

## Future Enhancements

Potential improvements for future versions:

- [ ] Multiple image upload for menu items
- [ ] Image cropping tool
- [ ] Image filters and adjustments
- [ ] Bulk image upload
- [ ] Image gallery for reusing uploaded images
- [ ] AI-powered image optimization
- [ ] Image CDN integration for faster loading

## Support

For issues or questions about the image upload feature:

1. Check this documentation first
2. Review the troubleshooting section
3. Check browser console for error messages
4. Verify Supabase Storage bucket permissions

## Summary

The image upload feature provides a comprehensive, user-friendly solution for adding images to menu items. With support for multiple upload methods, automatic compression, and robust validation, restaurant owners can easily enhance their menu with high-quality food photos.

**Key Benefits:**
- ✅ Multiple upload methods (file, URL)
- ✅ Automatic compression for large files
- ✅ Drag-and-drop support
- ✅ Real-time preview
- ✅ Secure storage
- ✅ User-friendly interface
- ✅ Comprehensive validation
