const CACHE_NAME = 'kpop-game-v1';
const ASSETS = [
    './index.html',
    './game.js',
    // 你可以在这里按需加入核心静态资源
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});