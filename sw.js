// sw.js - 离线缓存核心文件
const CACHE_NAME = 'superstar-treasure-v3';

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

    // 小卡图片缓存 (每个成员 1-20)
    './photocards/doyoung_1.jpg', './photocards/doyoung_2.jpg', './photocards/doyoung_3.jpg', './photocards/doyoung_4.jpg', './photocards/doyoung_5.jpg',
    './photocards/doyoung_6.jpg', './photocards/doyoung_7.jpg', './photocards/doyoung_8.jpg', './photocards/doyoung_9.jpg', './photocards/doyoung_10.jpg',
    './photocards/doyoung_11.jpg', './photocards/doyoung_12.jpg', './photocards/doyoung_13.jpg', './photocards/doyoung_14.jpg', './photocards/doyoung_15.jpg',
    './photocards/doyoung_16.jpg', './photocards/doyoung_17.jpg', './photocards/doyoung_18.jpg', './photocards/doyoung_19.jpg', './photocards/doyoung_20.jpg',

    './photocards/asahi_1.jpg', './photocards/asahi_2.jpg', './photocards/asahi_3.jpg', './photocards/asahi_4.jpg', './photocards/asahi_5.jpg',
    './photocards/asahi_6.jpg', './photocards/asahi_7.jpg', './photocards/asahi_8.jpg', './photocards/asahi_9.jpg', './photocards/asahi_10.jpg',
    './photocards/asahi_11.jpg', './photocards/asahi_12.jpg', './photocards/asahi_13.jpg', './photocards/asahi_14.jpg', './photocards/asahi_15.jpg',
    './photocards/asahi_16.jpg', './photocards/asahi_17.jpg', './photocards/asahi_18.jpg', './photocards/asahi_19.jpg', './photocards/asahi_20.jpg',

    './photocards/yoshi_1.jpg', './photocards/yoshi_2.jpg', './photocards/yoshi_3.jpg', './photocards/yoshi_4.jpg', './photocards/yoshi_5.jpg',
    './photocards/yoshi_6.jpg', './photocards/yoshi_7.jpg', './photocards/yoshi_8.jpg', './photocards/yoshi_9.jpg', './photocards/yoshi_10.jpg',
    './photocards/yoshi_11.jpg', './photocards/yoshi_12.jpg', './photocards/yoshi_13.jpg', './photocards/yoshi_14.jpg', './photocards/yoshi_15.jpg',
    './photocards/yoshi_16.jpg', './photocards/yoshi_17.jpg', './photocards/yoshi_18.jpg', './photocards/yoshi_19.jpg', './photocards/yoshi_20.jpg',

    './photocards/junkyu_1.jpg', './photocards/junkyu_2.jpg', './photocards/junkyu_3.jpg', './photocards/junkyu_4.jpg', './photocards/junkyu_5.jpg',
    './photocards/junkyu_6.jpg', './photocards/junkyu_7.jpg', './photocards/junkyu_8.jpg', './photocards/junkyu_9.jpg', './photocards/junkyu_10.jpg',
    './photocards/junkyu_11.jpg', './photocards/junkyu_12.jpg', './photocards/junkyu_13.jpg', './photocards/junkyu_14.jpg', './photocards/junkyu_15.jpg',
    './photocards/junkyu_16.jpg', './photocards/junkyu_17.jpg', './photocards/junkyu_18.jpg', './photocards/junkyu_19.jpg', './photocards/junkyu_20.jpg',

    './photocards/jeongwoo_1.jpg', './photocards/jeongwoo_2.jpg', './photocards/jeongwoo_3.jpg', './photocards/jeongwoo_4.jpg', './photocards/jeongwoo_5.jpg',
    './photocards/jeongwoo_6.jpg', './photocards/jeongwoo_7.jpg', './photocards/jeongwoo_8.jpg', './photocards/jeongwoo_9.jpg', './photocards/jeongwoo_10.jpg',
    './photocards/jeongwoo_11.jpg', './photocards/jeongwoo_12.jpg', './photocards/jeongwoo_13.jpg', './photocards/jeongwoo_14.jpg', './photocards/jeongwoo_15.jpg',
    './photocards/jeongwoo_16.jpg', './photocards/jeongwoo_17.jpg', './photocards/jeongwoo_18.jpg', './photocards/jeongwoo_19.jpg', './photocards/jeongwoo_20.jpg',

    './photocards/hyunsuk_1.jpg', './photocards/hyunsuk_2.jpg', './photocards/hyunsuk_3.jpg', './photocards/hyunsuk_4.jpg', './photocards/hyunsuk_5.jpg',
    './photocards/hyunsuk_6.jpg', './photocards/hyunsuk_7.jpg', './photocards/hyunsuk_8.jpg', './photocards/hyunsuk_9.jpg', './photocards/hyunsuk_10.jpg',
    './photocards/hyunsuk_11.jpg', './photocards/hyunsuk_12.jpg', './photocards/hyunsuk_13.jpg', './photocards/hyunsuk_14.jpg', './photocards/hyunsuk_15.jpg',
    './photocards/hyunsuk_16.jpg', './photocards/hyunsuk_17.jpg', './photocards/hyunsuk_18.jpg', './photocards/hyunsuk_19.jpg', './photocards/hyunsuk_20.jpg',

    './photocards/haruto_1.jpg', './photocards/haruto_2.jpg', './photocards/haruto_3.jpg', './photocards/haruto_4.jpg', './photocards/haruto_5.jpg',
    './photocards/haruto_6.jpg', './photocards/haruto_7.jpg', './photocards/haruto_8.jpg', './photocards/haruto_9.jpg', './photocards/haruto_10.jpg',
    './photocards/haruto_11.jpg', './photocards/haruto_12.jpg', './photocards/haruto_13.jpg', './photocards/haruto_14.jpg', './photocards/haruto_15.jpg',
    './photocards/haruto_16.jpg', './photocards/haruto_17.jpg', './photocards/haruto_18.jpg', './photocards/haruto_19.jpg', './photocards/haruto_20.jpg',

    './photocards/junghwan_1.jpg', './photocards/junghwan_2.jpg', './photocards/junghwan_3.jpg', './photocards/junghwan_4.jpg', './photocards/junghwan_5.jpg',
    './photocards/junghwan_6.jpg', './photocards/junghwan_7.jpg', './photocards/junghwan_8.jpg', './photocards/junghwan_9.jpg', './photocards/junghwan_10.jpg',
    './photocards/junghwan_11.jpg', './photocards/junghwan_12.jpg', './photocards/junghwan_13.jpg', './photocards/junghwan_14.jpg', './photocards/junghwan_15.jpg',
    './photocards/junghwan_16.jpg', './photocards/junghwan_17.jpg', './photocards/junghwan_18.jpg', './photocards/junghwan_19.jpg', './photocards/junghwan_20.jpg',

    './photocards/jaehyuk_1.jpg', './photocards/jaehyuk_2.jpg', './photocards/jaehyuk_3.jpg', './photocards/jaehyuk_4.jpg', './photocards/jaehyuk_5.jpg',
    './photocards/jaehyuk_6.jpg', './photocards/jaehyuk_7.jpg', './photocards/jaehyuk_8.jpg', './photocards/jaehyuk_9.jpg', './photocards/jaehyuk_10.jpg',
    './photocards/jaehyuk_11.jpg', './photocards/jaehyuk_12.jpg', './photocards/jaehyuk_13.jpg', './photocards/jaehyuk_14.jpg', './photocards/jaehyuk_15.jpg',
    './photocards/jaehyuk_16.jpg', './photocards/jaehyuk_17.jpg', './photocards/jaehyuk_18.jpg', './photocards/jaehyuk_19.jpg', './photocards/jaehyuk_20.jpg',

    './photocards/jihoon_1.jpg', './photocards/jihoon_2.jpg', './photocards/jihoon_3.jpg', './photocards/jihoon_4.jpg', './photocards/jihoon_5.jpg',
    './photocards/jihoon_6.jpg', './photocards/jihoon_7.jpg', './photocards/jihoon_8.jpg', './photocards/jihoon_9.jpg', './photocards/jihoon_10.jpg',
    './photocards/jihoon_11.jpg', './photocards/jihoon_12.jpg', './photocards/jihoon_13.jpg', './photocards/jihoon_14.jpg', './photocards/jihoon_15.jpg',
    './photocards/jihoon_16.jpg', './photocards/jihoon_17.jpg', './photocards/jihoon_18.jpg', './photocards/jihoon_19.jpg', './photocards/jihoon_20.jpg',

    // Unit / Duo Cards (1 - 40)
    './photocards/duo_1.jpg', './photocards/duo_2.jpg', './photocards/duo_3.jpg', './photocards/duo_4.jpg', './photocards/duo_5.jpg',
    './photocards/duo_6.jpg', './photocards/duo_7.jpg', './photocards/duo_8.jpg', './photocards/duo_9.jpg', './photocards/duo_10.jpg',
    './photocards/duo_11.jpg', './photocards/duo_12.jpg', './photocards/duo_13.jpg', './photocards/duo_14.jpg', './photocards/duo_15.jpg',
    './photocards/duo_16.jpg', './photocards/duo_17.jpg', './photocards/duo_18.jpg', './photocards/duo_19.jpg', './photocards/duo_20.jpg',
    './photocards/duo_21.jpg', './photocards/duo_22.jpg', './photocards/duo_23.jpg', './photocards/duo_24.jpg', './photocards/duo_25.jpg',
    './photocards/duo_26.jpg', './photocards/duo_27.jpg', './photocards/duo_28.jpg', './photocards/duo_29.jpg', './photocards/duo_30.jpg',
    './photocards/duo_31.jpg', './photocards/duo_32.jpg', './photocards/duo_33.jpg', './photocards/duo_34.jpg', './photocards/duo_35.jpg',
    './photocards/duo_36.jpg', './photocards/duo_37.jpg', './photocards/duo_38.jpg', './photocards/duo_39.jpg', './photocards/duo_40.jpg'
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