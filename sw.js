// Sun Tarot Service Worker v2
// ============================
// Provides offline support, caching, and faster page loads

const CACHE_VERSION = 'v4';
const STATIC_CACHE = `sun-tarot-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `sun-tarot-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `sun-tarot-images-${CACHE_VERSION}`;

// ... (STATIC_ASSETS and other consts remain same)

// ... (install and activate listeners remain same)

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

    // Network-first for HTML, CSS, JS (Development friendly - clean cache)
    if (event.request.destination === 'document' ||
        event.request.destination === 'script' ||
        event.request.destination === 'style' ||
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
                        .then(cached => {
                            if (cached) return cached;
                            // Fallback to index.html for navigation requests
                            if (event.request.destination === 'document') {
                                return caches.match('/index.html');
                            }
                        });
                })
        );
        return;
    }

    // Cache-first for images and fonts (Stable assets)
    if (event.request.destination === 'image' ||
        event.request.destination === 'font' ||
        url.pathname.match(/\.(jpg|jpeg|png|webp|svg|ico|eot|ttf|woff|woff2)$/)) {
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
                    if (event.request.destination === 'image') {
                        return new Response(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150">
                            <rect fill="#1a1a2e" width="100" height="150"/>
                            <text x="50" y="75" fill="#d4a95d" text-anchor="middle" font-size="8">Offline</text>
                        </svg>`,
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }
                });
            })
        );
        return;
    }

    // Default: Stale-While-Revalidate for everything else
    event.respondWith(
        caches.match(event.request).then(cached => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            });
            return cached || fetchPromise;
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
