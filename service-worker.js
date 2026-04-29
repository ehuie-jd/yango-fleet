const CACHE_NAME = 'yango-fleet-v1';

// Fichiers vitaux à garder en mémoire pour un chargement instantané
const urlsToCache = [
    './index.html',
    './manifest.json'
];

// Installation du moteur en arrière-plan
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// Nettoyage lors des mises à jour
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Gestion du chargement (Toujours chercher le réseau en premier pour avoir les vraies données)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});