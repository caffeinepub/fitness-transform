const CACHE_NAME = 'fitness-app-v1';
const RUNTIME_CACHE = 'fitness-app-runtime-v1';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
];

// Global error handler
self.addEventListener('error', (event) => {
  console.error('[SW] Unhandled error in service worker:', event.error);
  console.error('[SW] Error message:', event.message);
  console.error('[SW] Error filename:', event.filename);
  console.error('[SW] Error line:', event.lineno);
  console.error('[SW] Error column:', event.colno);
  console.error('[SW] Error stack:', event.error?.stack);
});

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Install event started');
  console.log('[SW] Cache name:', CACHE_NAME);
  console.log('[SW] URLs to precache:', PRECACHE_URLS);

  event.waitUntil(
    (async () => {
      try {
        console.log('[SW] Opening cache...');
        const cache = await caches.open(CACHE_NAME);
        console.log('[SW] Cache opened successfully');
        
        console.log('[SW] Adding URLs to cache...');
        await cache.addAll(PRECACHE_URLS);
        console.log('[SW] All URLs cached successfully');
        
        console.log('[SW] Skipping waiting to activate immediately');
        await self.skipWaiting();
        console.log('[SW] Install event completed successfully');
      } catch (error) {
        console.error('[SW] Install event failed:', error);
        console.error('[SW] Error name:', error.name);
        console.error('[SW] Error message:', error.message);
        console.error('[SW] Error stack:', error.stack);
        throw error;
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event started');
  
  event.waitUntil(
    (async () => {
      try {
        console.log('[SW] Getting all cache names...');
        const cacheNames = await caches.keys();
        console.log('[SW] Found caches:', cacheNames);
        
        console.log('[SW] Deleting old caches...');
        const deletionPromises = cacheNames
          .filter((cacheName) => {
            const isOldCache = cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            if (isOldCache) {
              console.log('[SW] Marking cache for deletion:', cacheName);
            }
            return isOldCache;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          });
        
        await Promise.all(deletionPromises);
        console.log('[SW] Old caches deleted successfully');
        
        console.log('[SW] Claiming clients...');
        await self.clients.claim();
        console.log('[SW] Clients claimed successfully');
        
        console.log('[SW] Activate event completed successfully');
      } catch (error) {
        console.error('[SW] Activate event failed:', error);
        console.error('[SW] Error name:', error.name);
        console.error('[SW] Error message:', error.message);
        console.error('[SW] Error stack:', error.stack);
        throw error;
      }
    })()
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    console.log('[SW] Skipping non-GET request:', request.method, url.pathname);
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    console.log('[SW] Skipping non-HTTP request:', url.protocol, url.href);
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try cache first for app shell resources
        if (url.origin === self.location.origin) {
          console.log('[SW] Checking cache for:', url.pathname);
          const cachedResponse = await caches.match(request);
          
          if (cachedResponse) {
            console.log('[SW] Cache HIT:', url.pathname);
            return cachedResponse;
          }
          
          console.log('[SW] Cache MISS:', url.pathname);
        }
        
        // Fetch from network
        console.log('[SW] Fetching from network:', url.pathname);
        const networkResponse = await fetch(request);
        
        // Cache successful responses for same-origin requests
        if (networkResponse.ok && url.origin === self.location.origin) {
          try {
            console.log('[SW] Caching network response:', url.pathname);
            const cache = await caches.open(RUNTIME_CACHE);
            await cache.put(request, networkResponse.clone());
            console.log('[SW] Network response cached successfully:', url.pathname);
          } catch (cacheError) {
            console.error('[SW] Failed to cache network response:', url.pathname);
            console.error('[SW] Cache error:', cacheError.message);
            // Continue without caching
          }
        }
        
        console.log('[SW] Returning network response:', url.pathname, 'Status:', networkResponse.status);
        return networkResponse;
      } catch (error) {
        console.error('[SW] Fetch failed for:', url.pathname);
        console.error('[SW] Fetch error:', error.message);
        console.error('[SW] Error stack:', error.stack);
        
        // Try to return cached version as fallback
        console.log('[SW] Attempting cache fallback for:', url.pathname);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
          console.log('[SW] Returning cached fallback for:', url.pathname);
          return cachedResponse;
        }
        
        console.error('[SW] No cached fallback available for:', url.pathname);
        throw error;
      }
    })()
  );
});

console.log('[SW] Service worker script loaded');
