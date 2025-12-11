import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Trash2, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CacheManager() {
  const { toast } = useToast();
  const [clearing, setClearing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>('Calculating...');

  // Calculate cache size
  const calculateCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usageInMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(2);
        setCacheSize(`${usageInMB} MB`);
      } catch (error) {
        setCacheSize('Unknown');
      }
    } else {
      setCacheSize('Not supported');
    }
  };

  // Clear all caches
  const handleClearCache = async () => {
    setClearing(true);
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      }

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Unregister service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      toast({
        title: 'Cache Cleared',
        description: 'All cached data has been cleared. The page will reload.',
      });

      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cache. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setClearing(false);
    }
  };

  // Force update check
  const handleForceUpdate = async () => {
    setUpdating(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting) {
            // New version is available
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            toast({
              title: 'Update Available',
              description: 'Installing update... The page will reload.',
            });
          } else {
            toast({
              title: 'Already Up to Date',
              description: 'You are running the latest version.',
            });
          }
        } else {
          toast({
            title: 'No Service Worker',
            description: 'Service worker is not registered.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      toast({
        title: 'Error',
        description: 'Failed to check for updates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Hard reload (bypass cache)
  const handleHardReload = () => {
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          App Cache & Updates
        </CardTitle>
        <CardDescription>
          Manage cached data and check for app updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            If you're experiencing issues after an update, try clearing the cache or forcing an update.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Cache Size</p>
              <p className="text-sm text-muted-foreground">{cacheSize}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={calculateCacheSize}
            >
              Calculate
            </Button>
          </div>

          <div className="grid gap-2">
            <Button
              onClick={handleForceUpdate}
              disabled={updating}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
              {updating ? 'Checking...' : 'Check for Updates'}
            </Button>

            <Button
              onClick={handleHardReload}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Hard Reload (Bypass Cache)
            </Button>

            <Button
              onClick={handleClearCache}
              disabled={clearing}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {clearing ? 'Clearing...' : 'Clear All Cache & Reload'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p><strong>Check for Updates:</strong> Manually check if a new version is available</p>
          <p><strong>Hard Reload:</strong> Reload the page and bypass cached files</p>
          <p><strong>Clear Cache:</strong> Remove all cached data and service workers (use if experiencing issues)</p>
        </div>
      </CardContent>
    </Card>
  );
}
