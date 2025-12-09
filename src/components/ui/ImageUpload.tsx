import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Check } from 'lucide-react';
import { uploadImageToSupabase, validateImageUrl } from '@/utils/imageUpload';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  restaurantId: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
}

export default function ImageUpload({
  restaurantId,
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setProgress(10);

      const result = await uploadImageToSupabase(file, restaurantId);
      
      setProgress(100);
      setPreviewUrl(result.url);
      onImageUploaded(result.url);

      toast({
        title: 'Success',
        description: result.compressed
          ? `Image uploaded and compressed from ${(result.originalSize / 1024).toFixed(0)}KB to ${(result.finalSize / 1024).toFixed(0)}KB`
          : 'Image uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [restaurantId]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    if (!validateImageUrl(urlInput)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid HTTP or HTTPS URL',
        variant: 'destructive',
      });
      return;
    }

    setPreviewUrl(urlInput);
    onImageUploaded(urlInput);
    toast({
      title: 'Success',
      description: 'Image URL added successfully',
    });
    setUrlInput('');
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setUrlInput('');
    if (onImageRemoved) {
      onImageRemoved();
    }
    toast({
      title: 'Image Removed',
      description: 'Image has been removed',
    });
  };

  return (
    <div className="space-y-4">
      <Label>Menu Item Image</Label>

      {previewUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => {
              toast({
                title: 'Error',
                description: 'Failed to load image',
                variant: 'destructive',
              });
              setPreviewUrl(null);
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              dragActive ? 'border-primary bg-primary/5' : 'border-border',
              uploading && 'opacity-50 pointer-events-none'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={uploading}
            />

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                {uploading ? (
                  <div className="animate-spin">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                ) : (
                  <ImageIcon className="h-8 w-8 text-primary" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Drag and drop your image here'}
                </p>
                <p className="text-xs text-muted-foreground">
                  or click the button below to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: JPEG, PNG, WEBP, GIF, AVIF (Max 1MB)
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            </div>

            {uploading && progress > 0 && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            ⚠️ Files larger than 1MB will be automatically compressed to WEBP format
          </p>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
              />
              <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                <Check className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a direct link to an image (must start with http:// or https://)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
