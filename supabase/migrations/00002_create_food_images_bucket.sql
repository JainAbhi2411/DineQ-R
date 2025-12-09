/*
# Create Storage Bucket for Food Images

1. Storage Bucket
- Create bucket: app-7x1ojvae4075_food_images
- Max file size: 1MB
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

2. Security
- Owners can upload images for their restaurants
- Public read access for all images
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-7x1ojvae4075_food_images',
  'app-7x1ojvae4075_food_images',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for food images"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-7x1ojvae4075_food_images');

-- Allow authenticated owners to upload
CREATE POLICY "Owners can upload food images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'app-7x1ojvae4075_food_images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'owner'::user_role
  )
);

-- Allow owners to update their images
CREATE POLICY "Owners can update food images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'app-7x1ojvae4075_food_images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'owner'::user_role
  )
);

-- Allow owners to delete their images
CREATE POLICY "Owners can delete food images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'app-7x1ojvae4075_food_images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'owner'::user_role
  )
);