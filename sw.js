// Sun Tarot Service Worker
// =========================
// Provides offline support and caching

const CACHE_NAME = 'sun-tarot-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/reading.html',
    '/love-reading.html',
    '/learn.html',
    '/spreads.html',
    '/faq.html',
    '/booking.html',
    '/css/style.css',
    '/js/main.js',
    '/js/cards.js',
    '/images/cards/major/the-fool.jpg',
    '/images/cards/major/the-magician.jpg',
    '/images/cards/major/the-high-priestess.jpg',
    '/images/cards/major/the-empress.jpg',
    '/images/cards/major/the-emperor.jpg',
    '/images/cards/major/the-hierophant.jpg',
    '/images/cards/major/the-lovers.jpg',
    '/images/cards/major/the-chariot.jpg',
    '/images/cards/major/strength.jpg',
    '/images/cards/major/the-hermit.jpg',
    '/images/cards/major/wheel-of-fortune.jpg',
    '/images/cards/major/justice.jpg',
    '/images/cards/major/the-hanged-man.jpg',
    '/images/cards/major/death.jpg',
    '/images/cards/major/temperance.jpg',
    '/images/cards/major/the-devil.jpg',
    '/images/cards/major/the-tower.jpg',
    '/images/cards/major/the-star.jpg',
    '/images/cards/major/the-moon.jpg',
    '/images/cards/major/the-sun.jpg',
    '/images/cards/major/judgement.jpg',
    '/images/cards/major/the-world.jpg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(err => {
                console.log('[SW] Cache failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests and Firebase requests
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('firebase') ||
        event.request.url.includes('googleapis') ||
        event.request.url.includes('gstatic')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }

                // Fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Clone and cache the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Offline fallback for HTML pages
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for bookings (future enhancement)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-bookings') {
        console.log('[SW] Syncing bookings...');
    }
});

// Push notifications (future enhancement)
self.addEventListener('push', event => {
    const data = event.data?.json() || {};
    const title = data.title || 'Sun Tarot';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/images/icons/icon-192.png',
        badge: '/images/icons/icon-72.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
