const CACHE_NAME = 'blogbreeze-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/assets/react.svg',
  '/public/icon.png',
  '/src/index.css',
  '/src/main.jsx',
];

// Install event: Cache core files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files...');
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

// Activate event: Remove old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Fetch event: Serve cached or network fallback
self.addEventListener('fetch', (event) => {
  console.log('Fetch event for:', event.request.url);
  if (event.request.url.includes('firestore.googleapis.com')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});

// Sync event: Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Sync event triggered for tag:', event.tag || '(no tag)');

  event.waitUntil(
    (async () => {
      try {
        console.log('Performing background sync task for tag:', event.tag);

        // Simulated fetch
        const response = await fetch('/');
        if (response.ok) {
          console.log('Fetch successful');
        }

        // Simulate delay
        await new Promise((res) => setTimeout(res, 1000));

        console.log('Sync task complete for tag:', event.tag);
        console.log('Sync successful');

        // Notify all clients
        const allClients = await self.clients.matchAll();
        allClients.forEach(client => {
          client.postMessage({
            type: 'SYNC_SUCCESS',
            tag: event.tag,
            message: `Sync completed for: ${event.tag}`
          });
        });

      } catch (err) {
        console.error('Sync task failed:', err);
      }
    })()
  );
});

// Push Notification: Handle push events
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    if (data.method === 'pushMessage') {
      const options = {
        body: data.message || 'Hello, this is a default message!',
        icon: '/src/assets/react.svg',
        badge: '/src/assets/react.svg',
      };

      if (Notification.permission === 'granted') {
        event.waitUntil(
          self.registration.showNotification('Blog Breeze', options)
        );
      } else {
        console.warn('Notification permission not granted');
      }
    }
  }
});
