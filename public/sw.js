// Service Worker for DineQR PWA
// IMPORTANT: Increment this version number when deploying updates
const VERSION = '1.0.12';
const CACHE_NAME = `dineqr-v${VERSION}`;
const RUNTIME_CACHE = `dineqr-runtime-v${VERSION}`;

// Build timestamp to force cache invalidation on deployment
const BUILD_TIMESTAMP = new Date().toISOString();

// Assets to cache on install
const STATIC_ASSETS = [
  '/favicon.png',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Installing version ${VERSION} (${BUILD_TIMESTAMP})...`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Failed to cache some assets:', err);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    })
  );
  // Don't force immediate activation - wait for user action
  // self.skipWaiting() is now called only when user clicks "Update Now"
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`[Service Worker] Activating version ${VERSION}...`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`[Service Worker] Version ${VERSION} activated successfully`);
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - network first for HTML, cache for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // NEVER cache Supabase API requests or authentication endpoints
  if (
    url.hostname.includes('supabase') || 
    url.hostname.includes('api-integrations') ||
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/rest/v1/')
  ) {
    event.respondWith(
      fetch(request, {
        cache: 'no-store', // Force fresh fetch, no caching
        credentials: 'include',
      })
    );
    return;
  }

  // ALWAYS use network-first for HTML files (index.html, etc.)
  if (request.mode === 'navigate' || request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache HTML files to always get fresh content
          return response;
        })
        .catch(() => {
          // Fallback to cache only if network fails
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Network first strategy for API calls
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Network first for JavaScript and CSS files (to get updates immediately)
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the new version
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Cache first strategy ONLY for images and fonts
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response before caching
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        });
      })
    );
    return;
  }

  // Default: Network first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// Push notification event (for future use)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from DineQR',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'dineqr-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification('DineQR', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
