const CACHE_NAME = 'organizador-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json'
];

// Instalação do cache
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

// Ativação
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Fetch
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
