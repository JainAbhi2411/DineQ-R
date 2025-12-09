// PWA utility functions

/**
 * Check if the app is running as a PWA (installed)
 */
export const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Check if the app is running on iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * Check if the app is running on Android
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Check if service worker is supported
 */
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

/**
 * Check if push notifications are supported
 */
export const isPushNotificationSupported = (): boolean => {
  return 'PushManager' in window && 'Notification' in window;
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported');
  }

  const permission = await Notification.requestPermission();
  return permission;
};

/**
 * Show a local notification
 */
export const showNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  if (!isPushNotificationSupported()) {
    console.warn('Notifications are not supported');
    return;
  }

  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    if (isPWA() && navigator.serviceWorker.controller) {
      // Use service worker to show notification
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      });
    } else {
      // Fallback to regular notification
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        ...options,
      });
    }
  }
};

/**
 * Clear all caches (useful for debugging)
 */
export const clearAllCaches = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  console.log('All caches cleared');
};

/**
 * Update service worker
 */
export const updateServiceWorker = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.update();
    console.log('Service worker updated');
  }
};

/**
 * Unregister service worker (for debugging)
 */
export const unregisterServiceWorker = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.unregister();
    console.log('Service worker unregistered');
  }
};

/**
 * Get app installation status
 */
export const getInstallationStatus = (): {
  isPWA: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  canInstall: boolean;
} => {
  return {
    isPWA: isPWA(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    canInstall: !isPWA() && (isAndroid() || isIOS()),
  };
};

/**
 * Share content using Web Share API
 */
export const shareContent = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    console.warn('Web Share API is not supported');
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
};

/**
 * Check if app needs update
 */
export const checkForUpdates = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    return false;
  }

  await registration.update();
  return !!registration.waiting;
};

/**
 * Install app update
 */
export const installUpdate = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration || !registration.waiting) {
    return;
  }

  // Tell the waiting service worker to activate
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });

  // Reload the page when the new service worker activates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
};

/**
 * Get network status
 */
export const getNetworkStatus = (): {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
} => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  };
};

/**
 * Listen for online/offline events
 */
export const onNetworkChange = (callback: (online: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
