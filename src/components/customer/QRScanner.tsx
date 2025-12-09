import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose?: () => void;
}

export default function QRScanner({ onScanSuccess, onScanError, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isInitializedRef = useRef(false);
  const hasScannedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Prevent double initialization
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initScanner = async () => {
      try {
        setError('');
        setPermissionDenied(false);
        
        // Check if camera permission is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          const errorMsg = 'Camera not supported on this device or browser';
          setError(errorMsg);
          setShowFallback(true);
          onScanError?.(errorMsg);
          return;
        }

        // Request camera permission explicitly first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          // Stop the stream immediately - we just wanted to check permission
          stream.getTracks().forEach(track => track.stop());
        } catch (permError: any) {
          console.error('[QRScanner] Permission error:', permError);
          
          if (permError.name === 'NotAllowedError' || permError.name === 'PermissionDeniedError') {
            setPermissionDenied(true);
            setError('Camera permission denied. Use the "Upload Photo" option below instead.');
            setShowFallback(true);
            onScanError?.('Camera permission denied');
            return;
          } else if (permError.name === 'NotFoundError') {
            setError('No camera found. Use the "Upload Photo" option below instead.');
            setShowFallback(true);
            onScanError?.('No camera found');
            return;
          } else if (permError.name === 'NotReadableError') {
            setError('Camera is in use. Use the "Upload Photo" option below instead.');
            setShowFallback(true);
            onScanError?.('Camera in use');
            return;
          } else {
            setError(`Camera error. Use the "Upload Photo" option below instead.`);
            setShowFallback(true);
            onScanError?.(permError.message);
            return;
          }
        }
        
        // Create scanner instance
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        // Check if camera is available
        const devices = await Html5Qrcode.getCameras();
        
        if (!devices || devices.length === 0) {
          setError('No camera found. Use the "Upload Photo" option below instead.');
          setShowFallback(true);
          onScanError?.('No camera found on this device');
          return;
        }

        // Prefer back camera on mobile
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        const cameraId = backCamera?.id || devices[0].id;

        console.log('[QRScanner] Using camera:', backCamera?.label || devices[0].label);

        // Start scanning
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (hasScannedRef.current) {
              console.log('[QRScanner] Already scanned, ignoring duplicate');
              return;
            }
            
            hasScannedRef.current = true;
            console.log('[QRScanner] Scanned:', decodedText);
            onScanSuccess(decodedText);
            stopScanner();
          },
          (errorMessage) => {
            if (errorMessage.includes('NotFoundException') === false) {
              console.warn('[QRScanner] Scan error:', errorMessage);
            }
          }
        );

        setIsScanning(true);
      } catch (err: any) {
        console.error('[QRScanner] Failed to start scanner:', err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionDenied(true);
          setError('Camera permission denied. Use the "Upload Photo" option below instead.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Use the "Upload Photo" option below instead.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is in use. Use the "Upload Photo" option below instead.');
        } else {
          setError(err.message || 'Failed to start camera. Use the "Upload Photo" option below instead.');
        }
        
        setShowFallback(true);
        onScanError?.(error || 'Failed to start camera');
      }
    };

    initScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        setIsScanning(false);
      } catch (err) {
        console.error('[QRScanner] Failed to stop scanner:', err);
      }
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose?.();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create a temporary scanner instance for file scanning
      const tempScanner = new Html5Qrcode('qr-reader-temp');
      
      const decodedText = await tempScanner.scanFile(file, true);
      
      if (decodedText) {
        console.log('[QRScanner] File scanned:', decodedText);
        onScanSuccess(decodedText);
        handleClose();
      }
    } catch (err: any) {
      console.error('[QRScanner] File scan error:', err);
      setError('Could not read QR code from image. Please try again with a clearer photo.');
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-5 h-5" />
            <span className="font-medium">Scan QR Code</span>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Scanner Container */}
      <div className="flex items-center justify-center h-full p-4">
        <div className="relative w-full max-w-md">
          {/* QR Reader Element */}
          <div id="qr-reader" className="rounded-lg overflow-hidden shadow-2xl" />
          
          {/* Hidden temp element for file scanning */}
          <div id="qr-reader-temp" className="hidden" />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Error Message with Fallback Option */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-lg p-4">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                  {permissionDenied ? (
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  ) : (
                    <X className="w-8 h-8 text-destructive" />
                  )}
                </div>
                
                <Alert variant="destructive" className="mb-4 text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Camera Error</AlertTitle>
                  <AlertDescription className="text-sm mt-2">
                    {error}
                  </AlertDescription>
                </Alert>

                {showFallback && (
                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded-lg p-4 mb-4 text-left border border-primary/20">
                      <p className="text-white text-sm font-medium mb-2">Alternative Method:</p>
                      <p className="text-white/70 text-xs">
                        Take a photo of the QR code instead. This works on all devices without camera permissions.
                      </p>
                    </div>

                    <Button 
                      onClick={handleTakePhoto}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Take Photo of QR Code
                    </Button>

                    {onClose && (
                      <Button 
                        onClick={handleClose} 
                        variant="outline" 
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scanning Indicator */}
          {isScanning && !error && (
            <div className="absolute -bottom-20 left-0 right-0 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Position QR code within the frame</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {!error && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-8">
          <div className="text-center text-white/80 text-sm space-y-2">
            <p>Point your camera at the QR code on your table</p>
            <p className="text-xs text-white/60">The code will be scanned automatically</p>
            
            {/* Alternative option always visible at bottom */}
            <div className="pt-4">
              <Button
                onClick={handleTakePhoto}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Or Upload Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
