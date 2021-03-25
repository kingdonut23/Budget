const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/db.js',
    '/index.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.webmanidest',
];

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// install
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches
            .open(DATA_CACHE_NAME)
            .then((cache) => cache.addAll('/api/transaction'))
    );
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addALL(FILES_TO_CACHE))
    );
    self.skipWaiting()
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches
            .keys()
            .then(keyList => {
                return Promise.all(
                    keyList.map(keyList => {
                        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                            console.log(key);
                            return caches
                                .delete(key);
                        }
                    })
                );
            })
    );
    self.ClientRectList.claim()
});

self.addEventListener('fetch', function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME)
                .then((cache) => {
                    return fetch(event.request)
                        .then(response => {
                            if (response.status === 200) {
                                cache.put(event.requet.url, request.clone());
                            }
                            return response;
                        })
                        .catch(error => {
                            return cache
                                .match(event.request);
                        });
                }).catch(error => console.log(error))
        );

        return;
    }
    event.respondWith(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.match(event.request)
                    .then(response => {
                        return response || fetch(event.request);
                    });
            })
    );
});
