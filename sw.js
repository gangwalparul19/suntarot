// Sun Tarot Service Worker v2
// ============================
// Provides offline support, caching, and faster page loads

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `sun-tarot-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `sun-tarot-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `sun-tarot-images-${CACHE_VERSION}`;

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/reading.html',
    '/love-reading.html',
    '/learn.html',
    '/spreads.html',
    '/faq.html',
    '/booking.html',
    '/my-readings.html',
    '/book-appointment.html',
    '/submit-review.html',
    '/my-bookings.html',
    '/css/style.css',
    '/js/main.js',
    '/js/cards.js',
    '/js/auth.js',
    '/js/toast.js',
    '/js/share.js',
    '/js/booking.js',
    '/js/reviews.js'
];

// Card images to cache (local)
const CARD_IMAGES = [
    '/images/ar00.jpg',
    '/images/ar01.jpg',
    '/images/ar02.jpg',
    '/images/ar03.jpg',
    '/images/ar04.jpg',
    '/images/ar05.jpg',
    '/images/ar06.jpg',
    '/images/ar07.jpg',
    '/images/ar08.jpg',
    '/images/ar09.jpg',
    '/images/ar10.jpg',
    '/images/ar11.jpg',
    '/images/ar12.jpg',
    '/images/ar13.jpg',
    '/images/ar14.jpg',
    '/images/ar15.jpg',
    '/images/ar16.jpg',
    '/images/ar17.jpg',
    '/images/ar18.jpg',
    '/images/ar19.jpg',
    '/images/ar20.jpg',
    '/images/ar21.jpg'
];

// All cache names for cleanup
const ALL_CACHES = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];

// Install event - cache static assets and card images
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker v2...');
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            // Cache card images (local files)
            caches.open(IMAGE_CACHE).then(cache => {
                console.log('[SW] Caching card images');
                return cache.addAll(CARD_IMAGES);
            })
        ]).then(() => {
            console.log('[SW] Installation complete!');
            return self.skipWaiting();
        }).catch(err => {
            console.log('[SW] Installation failed:', err);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker v2...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => !ALL_CACHES.includes(name))
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            console.log('[SW] Activation complete!');
            return self.clients.claim();
        })
    );
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Firebase and Google APIs
    if (url.hostname.includes('firebase') ||
        url.hostname.includes('googleapis') ||
        url.hostname.includes('gstatic') ||
        url.hostname.includes('firebaseio')) {
        return;
    }

    // Network-first for HTML pages (always get fresh content)
    if (event.request.destination === 'document' ||
        event.request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the fresh response
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Offline fallback
                    return caches.match(event.request)
                        .then(cached => cached || caches.match('/index.html'));
                })
        );
        return;
    }

    // Cache-first for images
    if (event.request.destination === 'image' ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.webp')) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;

                return fetch(event.request).then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(IMAGE_CACHE).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Return placeholder for offline images
                    return new Response(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150">
                            <rect fill="#1a1a2e" width="100" height="150"/>
                            <text x="50" y="75" fill="#d4a95d" text-anchor="middle" font-size="8">Offline</text>
                        </svg>`,
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                });
            })
        );
        return;
    }

    // Cache-first for static assets (CSS, JS)
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                if (!response || response.status !== 200) {
                    return response;
                }

                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(event.request, responseClone);
                });

                return response;
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
