import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Camera, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { tableApi, visitedRestaurantApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import QRScanner from '@/components/customer/QRScanner';

export default function ScanQR() {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || (hasTouch && isSmallScreen));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const processQRCode = async (code: string) => {
    // Prevent duplicate processing
    if (isProcessing) {
      console.log('[ScanQR] Already processing, skipping...');
      return;
    }

    if (!profile) {
      toast({
        title: 'Error',
        description: 'Please log in to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setLoading(true);
    try {
      const table = await tableApi.getTableByQRCode(code);
      
      if (!table) {
        toast({
          title: 'Invalid QR Code',
          description: 'This QR code is not valid. Please try scanning again.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Save visited restaurant
      await visitedRestaurantApi.upsertVisitedRestaurant(profile.id, table.restaurant_id);

      // Show success message (only once)
      toast({
        title: '✅ Success!',
        description: `Opening menu for Table ${table.table_number}`,
        duration: 2000,
      });

      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate(`/customer/menu/${table.restaurant_id}?table=${table.id}`);
      }, 500);
    } catch (error: any) {
      console.error('[ScanQR] Error processing QR code:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process QR code',
        variant: 'destructive',
      });
      setIsProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    console.log('[ScanQR] QR Code scanned:', decodedText);
    setShowScanner(false);
    processQRCode(decodedText);
  };

  const handleScanError = (error: string) => {
    console.error('[ScanQR] Scan error:', error);
    toast({
      title: 'Scanner Error',
      description: error,
      variant: 'destructive',
    });
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a QR code',
        variant: 'destructive',
      });
      return;
    }

    await processQRCode(qrCode.trim());
  };

  const handleOpenScanner = () => {
    if (!profile) {
      toast({
        title: 'Login Required',
        description: 'Please log in to scan QR codes',
        variant: 'destructive',
      });
      return;
    }
    setShowScanner(true);
  };

  // Show scanner in fullscreen
  if (showScanner) {
    return (
      <QRScanner
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
        onClose={() => setShowScanner(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Scan QR Code</CardTitle>
          <CardDescription>
            Scan the QR code on your table to view the menu and place orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Camera Scan Button - Show on mobile */}
            {isMobile ? (
              <div className="relative group">
                {/* Animated background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-orange-500 to-primary rounded-2xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse transition duration-1000"></div>
                
                {/* Main button */}
                <Button
                  onClick={handleOpenScanner}
                  className="relative w-full h-40 text-lg bg-gradient-to-br from-primary to-orange-600 hover:from-orange-600 hover:to-primary shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl overflow-hidden"
                  size="lg"
                  disabled={loading || isProcessing}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Button content */}
                  <div className="relative flex flex-col items-center gap-4">
                    {/* Camera icon with animation */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-ping"></div>
                      <Camera className="relative w-16 h-16 drop-shadow-2xl" />
                    </div>
                    
                    {/* Text */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-xl drop-shadow-lg">Scan QR Code</span>
                      <span className="text-sm opacity-90 font-medium">Tap to open camera</span>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="flex gap-2 mt-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed">
                <Smartphone className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center font-medium mb-2">
                  Camera scanning available on mobile devices
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Please open this page on your smartphone to use the camera scanner
                </p>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or enter code manually</span>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qrCode">QR Code</Label>
                <Input
                  id="qrCode"
                  type="text"
                  placeholder="Enter QR code from table"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Continue'}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>The QR code can be found on your restaurant table</p>
              {isMobile && (
                <p className="text-xs text-primary">
                  💡 Tip: Use the camera scanner for faster access
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
