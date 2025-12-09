import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CameraScanTest() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cameraInfo, setCameraInfo] = useState<string>('');
  const [scanCount, setScanCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  const startCamera = async () => {
    try {
      setError('');
      setScannedData('');
      setScanCount(0);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device or browser');
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('No camera found on this device');
      }

      setCameraInfo(`Found ${videoDevices.length} camera(s): ${videoDevices.map(d => d.label || 'Unknown').join(', ')}`);

      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );

      const constraints: MediaStreamConstraints = {
        video: backCamera 
          ? { deviceId: { exact: backCamera.deviceId } }
          : { facingMode: 'environment' }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        videoRef.current.onloadedmetadata = () => {
          scanQRCode();
        };
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to access camera');
      setIsScanning(false);
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      console.log('QR Code detected:', code.data);
      setScannedData(code.data);
      setScanCount(prev => prev + 1);
      
      context.strokeStyle = '#00FF00';
      context.lineWidth = 4;
      context.strokeRect(
        code.location.topLeftCorner.x,
        code.location.topLeftCorner.y,
        code.location.bottomRightCorner.x - code.location.topLeftCorner.x,
        code.location.bottomRightCorner.y - code.location.topLeftCorner.y
      );
    }

    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-6 h-6" />
              Camera QR Scanner Test (jsQR)
            </CardTitle>
            <CardDescription>
              Test camera functionality and QR code scanning using jsQR library
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startCamera} className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="destructive" className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Stop Camera
                </Button>
              )}
            </div>

            {cameraInfo && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Information</AlertTitle>
                <AlertDescription>{cameraInfo}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {scannedData && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">QR Code Detected!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  <div className="space-y-2 mt-2">
                    <div>
                      <strong>Scan Count:</strong> {scanCount}
                    </div>
                    <div>
                      <strong>Data:</strong>
                      <pre className="mt-1 p-2 bg-white dark:bg-gray-900 rounded text-xs overflow-auto">
                        {scannedData}
                      </pre>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-auto"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
              
              {isScanning && (
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Camera Active - Point at QR Code</span>
                    </div>
                  </div>
                </div>
              )}

              {!isScanning && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center text-white/60">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Click "Start Camera" to begin scanning</p>
                  </div>
                </div>
              )}
            </div>

            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-base">Testing Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Click "Start Camera" button</li>
                  <li>Allow camera permissions when prompted</li>
                  <li>Point your camera at a QR code</li>
                  <li>The QR code will be detected automatically</li>
                  <li>A green box will appear around detected QR codes</li>
                  <li>Scanned data will appear above the video</li>
                </ol>
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                    <strong>Note:</strong> If you don't have a QR code handy, you can generate one online at qr-code-generator.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-base">Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>Library:</strong> jsQR
                  </div>
                  <div>
                    <strong>Status:</strong> {isScanning ? '🟢 Active' : '🔴 Inactive'}
                  </div>
                  <div>
                    <strong>Camera API:</strong> MediaDevices
                  </div>
                  <div>
                    <strong>Scans:</strong> {scanCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
