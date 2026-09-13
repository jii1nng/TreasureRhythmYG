// sw.js - 离线缓存核心文件
const CACHE_NAME = 'superstar-treasure-v2';

// 自动提取游戏里所有静态资源、音频和图片进行离线缓存
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './manifest.json',
    // 自动把所有歌单的音频和图片加入缓存列表
    './songs/iloveyou.mp3', './songs/iloveyou.mp4', './covers/iloveyou_small.jpg', './covers/iloveyou_big.jpg',
    './songs/bona_bona.mp3', './songs/bona_bona.mp4', './covers/bona_bona_small.jpg', './covers/bona_bona_big.jpg',
    './songs/boy.mp3', './songs/boy.mp4', './covers/boy_small.jpg', './covers/boy_big.jpg',
    './songs/darari.mp3', './songs/darari.mp4', './covers/darari_small.jpg', './covers/darari_big.jpg',
    './songs/jikjin.mp3', './songs/jikjin.mp4', './covers/jikjin_small.jpg', './covers/jikjin_big.jpg',
    './songs/hello.mp3', './songs/hello.mp4', './covers/hello_small.jpg', './covers/hello_big.jpg',
    './songs/mmm.mp3', './songs/mmm.mp4', './covers/mmm_small.jpg', './covers/mmm_big.jpg',
    './songs/my_treasure.mp3', './songs/my_treasure.mp4', './covers/my_treasure_small.jpg', './covers/my_treasure_big.jpg',
    './songs/king_kong.mp3', './songs/king_kong.mp4', './covers/king_kong_small.jpg', './covers/king_kong_big.jpg',
    './songs/bomb.mp3', './songs/bomb.mp4', './covers/bomb_small.jpg', './covers/bomb_big.jpg',
    './songs/orange.mp3', './songs/orange.mp4', './covers/orange_small.jpg', './covers/orange_big.jpg',
    './songs/going_crazy.mp3', './songs/going_crazy.mp4', './covers/going_crazy_small.jpg', './covers/going_crazy_big.jpg',
    './songs/if_i.mp3', './songs/if_i.mp4', './covers/if_i_small.jpg', './covers/if_i_big.jpg',
    './songs/run.mp3', './songs/run.mp4', './covers/run_small.jpg', './covers/run_big.jpg',
    './songs/zoom_zoom.mp3', './songs/zoom_zoom.mp4', './covers/zoom_zoom_small.jpg', './covers/zoom_zoom_big.jpg',
    './songs/danger.mp3', './songs/danger.mp4', './covers/danger_small.jpg', './covers/danger_big.jpg',
    './songs/yellow.mp3', './songs/yellow.mp4', './covers/yellow_small.jpg', './covers/yellow_big.jpg',
    './songs/everyday.mp3', './songs/everyday.mp4', './covers/everyday_small.jpg', './covers/everyday_big.jpg',
    './songs/move.mp3', './songs/move.mp4', './covers/move_small.jpg', './covers/move_big.jpg',
    './songs/here_i_stand.mp3', './songs/here_i_stand.mp4', './covers/here_i_stand_small.jpg', './covers/here_i_stand_big.jpg',
    './songs/everything.mp3', './songs/everything.mp4', './covers/everything_small.jpg', './covers/everything_big.jpg',
    './songs/paradise.mp3', './songs/paradise.mp4', './covers/paradise_small.jpg', './covers/paradise_big.jpg',
    // 小卡图片缓存
    './photocards/doyoung_1.jpg', './photocards/doyoung_2.jpg', './photocards/doyoung_3.jpg', './photocards/doyoung_4.jpg', './photocards/doyoung_5.jpg',
    './photocards/doyoung_6.jpg', './photocards/doyoung_7.jpg', './photocards/doyoung_8.jpg', './photocards/doyoung_9.jpg', './photocards/doyoung_10.jpg',
    './photocards/asahi_1.jpg', './photocards/asahi_2.jpg', './photocards/asahi_3.jpg', './photocards/asahi_4.jpg', './photocards/asahi_5.jpg',
    './photocards/asahi_6.jpg', './photocards/asahi_7.jpg', './photocards/asahi_8.jpg', './photocards/asahi_9.jpg', './photocards/asahi_10.jpg',
    './photocards/yoshi_1.jpg', './photocards/yoshi_2.jpg', './photocards/yoshi_3.jpg', './photocards/yoshi_4.jpg', './photocards/yoshi_5.jpg',
    './photocards/yoshi_6.jpg', './photocards/yoshi_7.jpg', './photocards/yoshi_8.jpg', './photocards/yoshi_9.jpg', './photocards/yoshi_10.jpg',
    './photocards/duo_1.jpg', './photocards/duo_2.jpg', './photocards/duo_3.jpg', './photocards/duo_4.jpg',
    './photocards/duo_5.jpg', './photocards/duo_6.jpg', './photocards/duo_7.jpg', './photocards/duo_8.jpg', './photocards/duo_9.jpg', './photocards/duo_10.jpg',
    './photocards/duo_11.jpg', './photocards/duo_12.jpg', './photocards/duo_13.jpg', './photocards/duo_14.jpg', './photocards/duo_15.jpg', './photocards/duo_16.jpg',
    './photocards/duo_17.jpg', './photocards/duo_18.jpg', './photocards/duo_19.jpg', './photocards/duo_20.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('正在缓存离线资源...');
            return cache.addAll(urlsToCache).catch(err => {
                console.warn('部分资源缓存失败，但不影响核心运行:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // 如果缓存里有，直接返回缓存；如果没有，尝试从网络获取并动态缓存
            if (response) {
                return response;
            }
            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // 彻底断网且没有缓存时的降级处理
                console.log('离线且无缓存:', event.request.url);
            });
        })
    );
});