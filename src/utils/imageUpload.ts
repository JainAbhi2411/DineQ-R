import { supabase } from '@/db/supabase';

const BUCKET_NAME = 'app-7x1ojvae4075_food_images';
const MAX_FILE_SIZE = 1048576; // 1MB in bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export interface ImageUploadResult {
  url: string;
  path: string;
  compressed: boolean;
  originalSize: number;
  finalSize: number;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: JPEG, PNG, WEBP, GIF, AVIF`,
    };
  }

  const fileName = file.name;
  const hasNonEnglish = /[^\x00-\x7F]/.test(fileName);
  if (hasNonEnglish) {
    return {
      valid: false,
      error: 'Filename must contain only English letters and numbers',
    };
  }

  return { valid: true };
};

export const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_DIMENSION = 1080;
        if (width > height && width > MAX_DIMENSION) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const compressRecursively = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              if (blob.size <= MAX_FILE_SIZE || quality <= 0.1) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                compressRecursively(quality - 0.1);
              }
            },
            'image/webp',
            quality
          );
        };

        compressRecursively(0.8);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

export const uploadImageToSupabase = async (
  file: File,
  restaurantId: string
): Promise<ImageUploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const originalSize = file.size;
  let fileToUpload = file;
  let compressed = false;

  if (file.size > MAX_FILE_SIZE) {
    fileToUpload = await compressImage(file);
    compressed = true;
  }

  const finalSize = fileToUpload.size;
  const fileExt = fileToUpload.name.split('.').pop();
  const fileName = `${restaurantId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, fileToUpload, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
    compressed,
    originalSize,
    finalSize,
  };
};

export const deleteImageFromSupabase = async (path: string): Promise<void> => {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
