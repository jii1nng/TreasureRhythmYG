// game.js - Version 2026.09.13-PhotocardWithGemsAndSSSGlow
(function () {
    'use strict';

    const SONG_LIST = [
        { id: 'iloveyou', name: 'I LOVE YOU', artist: 'TREASURE', cover: '💎', coverBg: 'linear-gradient(135deg, #00aaff, #0066ff)', coverImg: './covers/iloveyou_small.jpg', detailImg: './covers/iloveyou_big.jpg', video: './songs/iloveyou.mp4', audio: './songs/iloveyou.mp3' },
        { id: 'bona_bona', name: 'BONA BONA', artist: 'TREASURE', cover: '🔥', coverBg: 'linear-gradient(135deg, #ff4466, #cc0033)', coverImg: './covers/bona_bona_small.jpg', detailImg: './covers/bona_bona_big.jpg', video: './songs/bona_bona.mp4', audio: './songs/bona_bona.mp3' },
        { id: 'boy', name: 'BOY', artist: 'TREASURE', cover: '💙', coverBg: 'linear-gradient(135deg, #0055ff, #0022aa)', coverImg: './covers/boy_small.jpg', detailImg: './covers/boy_big.jpg', video: './songs/boy.mp4', audio: './songs/boy.mp3' },
        { id: 'darari', name: 'DARARI', artist: 'TREASURE', cover: '🎶', coverBg: 'linear-gradient(135deg, #ffaa00, #ff4400)', coverImg: './covers/darari_small.jpg', detailImg: './covers/darari_big.jpg', video: './songs/darari.mp4', audio: './songs/darari.mp3' },
        { id: 'jikjin', name: 'JIKJIN', artist: 'TREASURE', cover: '⚡', coverBg: 'linear-gradient(135deg, #00e5ff, #0088cc)', coverImg: './covers/jikjin_small.jpg', detailImg: './covers/jikjin_big.jpg', video: './songs/jikjin.mp4', audio: './songs/jikjin.mp3' },
        { id: 'hello', name: 'HELLO', artist: 'TREASURE', cover: '✨', coverBg: 'linear-gradient(135deg, #7700ff, #aa00ff)', coverImg: './covers/hello_small.jpg', detailImg: './covers/hello_big.jpg', video: './songs/hello.mp4', audio: './songs/hello.mp3' },
        { id: 'mmm', name: 'MMM', artist: 'TREASURE', cover: '🖤', coverBg: 'linear-gradient(135deg, #333333, #000000)', coverImg: './covers/mmm_small.jpg', detailImg: './covers/mmm_big.jpg', video: './songs/mmm.mp4', audio: './songs/mmm.mp3' },
        { id: 'my_treasure', name: 'MY TREASURE', artist: 'TREASURE', cover: '☀️', coverBg: 'linear-gradient(135deg, #ffea00, #ff9900)', coverImg: './covers/my_treasure_small.jpg', detailImg: './covers/my_treasure_big.jpg', video: './songs/my_treasure.mp4', audio: './songs/my_treasure.mp3' },
        { id: 'king_kong', name: 'KING KONG', artist: 'TREASURE', cover: '🦍', coverBg: 'linear-gradient(135deg, #ff2200, #880000)', coverImg: './covers/king_kong_small.jpg', detailImg: './covers/king_kong_big.jpg', video: './songs/king_kong.mp4', audio: './songs/king_kong.mp3' },
        { id: 'b_o_m_b', name: 'B.O.M.B', artist: 'TREASURE', cover: '💣', coverBg: 'linear-gradient(135deg, #ff00aa, #aa0055)', coverImg: './covers/bomb_small.jpg', detailImg: './covers/bomb_big.jpg', video: './songs/bomb.mp4', audio: './songs/bomb.mp3' },
        { id: 'orange', name: 'ORANGE', artist: 'TREASURE', cover: '🍊', coverBg: 'linear-gradient(135deg, #ff7700, #cc4400)', coverImg: './covers/orange_small.jpg', detailImg: './covers/orange_big.jpg', video: './songs/orange.mp4', audio: './songs/orange.mp3' },
        { id: 'going_crazy', name: 'GOING CRAZY', artist: 'TREASURE', cover: '🌀', coverBg: 'linear-gradient(135deg, #00ffcc, #009977)', coverImg: './covers/going_crazy_small.jpg', detailImg: './covers/going_crazy_big.jpg', video: './songs/going_crazy.mp4', audio: './songs/going_crazy.mp3' },
        { id: 'if_i', name: 'IF_I', artist: 'TREASURE', cover: '🌌', coverBg: 'linear-gradient(135deg, #4400ff, #220088)', coverImg: './covers/if_i_small.jpg', detailImg: './covers/if_i_big.jpg', video: './songs/if_i.mp4', audio: './songs/if_i.mp3' },
        { id: 'run', name: 'RUN', artist: 'TREASURE', cover: '🏃', coverBg: 'linear-gradient(135deg, #00ff66, #00aa33)', coverImg: './covers/run_small.jpg', detailImg: './covers/run_big.jpg', video: './songs/run.mp4', audio: './songs/run.mp3' },
        { id: 'zoom_zoom', name: 'ZOOM_ZOOM', artist: 'TREASURE', cover: '🐐', coverBg: 'linear-gradient(135deg, #bbbbbb, #555555)', coverImg: './covers/zoom_zoom_small.jpg', detailImg: './covers/zoom_zoom_big.jpg', video: './songs/zoom_zoom.mp4', audio: './songs/zoom_zoom.mp3' },
        { id: 'danger', name: 'DANGER', artist: 'TREASURE', cover: '🌋', coverBg: 'linear-gradient(135deg, #ff3300, #991100)', coverImg: './covers/danger_small.jpg', detailImg: './covers/danger_big.jpg', video: './songs/danger.mp4', audio: './songs/danger.mp3' },
        { id: 'yellow', name: 'YELLOW', artist: 'TREASURE', cover: '💌', coverBg: 'linear-gradient(135deg, #ff6699, #ff3366)', coverImg: './covers/yellow_small.jpg', detailImg: './covers/yellow_big.jpg', video: './songs/yellow.mp4', audio: './songs/yellow.mp3' },
        { id: 'everyday', name: 'EVERYDAY', artist: 'TREASURE', cover: '🛡️', coverBg: 'linear-gradient(135deg, #0099ff, #0044aa)', coverImg: './covers/everyday_small.jpg', detailImg: './covers/everyday_big.jpg', video: './songs/everyday.mp4', audio: './songs/everyday.mp3' },
        { id: 'move', name: 'MOVE (T5)', artist: 'TREASURE', cover: '💃', coverBg: 'linear-gradient(135deg, #9900ff, #5500aa)', coverImg: './covers/move_small.jpg', detailImg: './covers/move_big.jpg', video: './songs/move.mp4', audio: './songs/move.mp3' },
        { id: 'here_i_stand', name: 'HERE I STAND', artist: 'TREASURE', cover: '🎤', coverBg: 'linear-gradient(135deg, #00e5ff, #0055ff)', coverImg: './covers/here_i_stand_small.jpg', detailImg: './covers/here_i_stand_big.jpg', video: './songs/here_i_stand.mp4', audio: './songs/here_i_stand.mp3' },
        { id: 'everything', name: 'EVERYTHING', artist: 'TREASURE', cover: '🎤', coverBg: 'linear-gradient(135deg, #00e5ff, #0055ff)', coverImg: './covers/everything_small.jpg', detailImg: './covers/everything_big.jpg', video: './songs/everything.mp4', audio: './songs/everything.mp3' },
        { id: 'paradise', name: 'PARADISE', artist: 'TREASURE', cover: '🎤', coverBg: 'linear-gradient(135deg, #00e5ff, #0055ff)', coverImg: './covers/paradise_small.jpg', detailImg: './covers/paradise_big.jpg', video: './songs/paradise.mp4', audio: './songs/paradise.mp3' }
    ];

    const PHOTO_CARDS = [
        // Hyunsuk (8 cards)[cite: 3]
        { id: 'hyunsuk_1', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_1.jpg', rarity: 'R' },
        { id: 'hyunsuk_2', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_2.jpg', rarity: 'R' },
        { id: 'hyunsuk_3', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_3.jpg', rarity: 'SR' },
        { id: 'hyunsuk_4', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_4.jpg', rarity: 'SR' },
        { id: 'hyunsuk_5', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_5.jpg', rarity: 'SSR' },
        { id: 'hyunsuk_6', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_6.jpg', rarity: 'SSR' },
        { id: 'hyunsuk_7', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_7.jpg', rarity: 'UR' },
        { id: 'hyunsuk_8', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_8.jpg', rarity: 'UR' },

        // Jihoon (8 cards)[cite: 3]
        { id: 'jihoon_1', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_1.jpg', rarity: 'R' },
        { id: 'jihoon_2', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_2.jpg', rarity: 'R' },
        { id: 'jihoon_3', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_3.jpg', rarity: 'SR' },
        { id: 'jihoon_4', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_4.jpg', rarity: 'SR' },
        { id: 'jihoon_5', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_5.jpg', rarity: 'SSR' },
        { id: 'jihoon_6', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_6.jpg', rarity: 'SSR' },
        { id: 'jihoon_7', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_7.jpg', rarity: 'UR' },
        { id: 'jihoon_8', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_8.jpg', rarity: 'UR' },

        // Yoshi (8 cards)[cite: 3]
        { id: 'yoshi_1', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_1.jpg', rarity: 'R' },
        { id: 'yoshi_2', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_2.jpg', rarity: 'R' },
        { id: 'yoshi_3', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_3.jpg', rarity: 'SR' },
        { id: 'yoshi_4', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_4.jpg', rarity: 'SR' },
        { id: 'yoshi_5', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_5.jpg', rarity: 'SSR' },
        { id: 'yoshi_6', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_6.jpg', rarity: 'SSR' },
        { id: 'yoshi_7', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_7.jpg', rarity: 'UR' },
        { id: 'yoshi_8', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_8.jpg', rarity: 'UR' },

        // Junkyu (8 cards)[cite: 3]
        { id: 'junkyu_1', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_1.jpg', rarity: 'R' },
        { id: 'junkyu_2', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_2.jpg', rarity: 'R' },
        { id: 'junkyu_3', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_3.jpg', rarity: 'SR' },
        { id: 'junkyu_4', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_4.jpg', rarity: 'SR' },
        { id: 'junkyu_5', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_5.jpg', rarity: 'SSR' },
        { id: 'junkyu_6', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_6.jpg', rarity: 'SSR' },
        { id: 'junkyu_7', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_7.jpg', rarity: 'UR' },
        { id: 'junkyu_8', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_8.jpg', rarity: 'UR' },

        // Jaehyuk (8 cards)[cite: 3]
        { id: 'jaehyuk_1', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_1.jpg', rarity: 'R' },
        { id: 'jaehyuk_2', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_2.jpg', rarity: 'R' },
        { id: 'jaehyuk_3', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_3.jpg', rarity: 'SR' },
        { id: 'jaehyuk_4', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_4.jpg', rarity: 'SR' },
        { id: 'jaehyuk_5', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_5.jpg', rarity: 'SSR' },
        { id: 'jaehyuk_6', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_6.jpg', rarity: 'SSR' },
        { id: 'jaehyuk_7', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_7.jpg', rarity: 'UR' },
        { id: 'jaehyuk_8', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_8.jpg', rarity: 'UR' },

        // Asahi (8 cards)[cite: 3]
        { id: 'asahi_1', name: 'Asahi', group: 'asahi', img: './photocards/asahi_1.jpg', rarity: 'R' },
        { id: 'asahi_2', name: 'Asahi', group: 'asahi', img: './photocards/asahi_2.jpg', rarity: 'R' },
        { id: 'asahi_3', name: 'Asahi', group: 'asahi', img: './photocards/asahi_3.jpg', rarity: 'SR' },
        { id: 'asahi_4', name: 'Asahi', group: 'asahi', img: './photocards/asahi_4.jpg', rarity: 'SR' },
        { id: 'asahi_5', name: 'Asahi', group: 'asahi', img: './photocards/asahi_5.jpg', rarity: 'SSR' },
        { id: 'asahi_6', name: 'Asahi', group: 'asahi', img: './photocards/asahi_6.jpg', rarity: 'SSR' },
        { id: 'asahi_7', name: 'Asahi', group: 'asahi', img: './photocards/asahi_7.jpg', rarity: 'UR' },
        { id: 'asahi_8', name: 'Asahi', group: 'asahi', img: './photocards/asahi_8.jpg', rarity: 'UR' },

        // Doyoung (8 cards)[cite: 3]
        { id: 'doyoung_1', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_1.jpg', rarity: 'R' },
        { id: 'doyoung_2', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_2.jpg', rarity: 'R' },
        { id: 'doyoung_3', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_3.jpg', rarity: 'SR' },
        { id: 'doyoung_4', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_4.jpg', rarity: 'SR' },
        { id: 'doyoung_5', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_5.jpg', rarity: 'SSR' },
        { id: 'doyoung_6', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_6.jpg', rarity: 'SSR' },
        { id: 'doyoung_7', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_7.jpg', rarity: 'UR' },
        { id: 'doyoung_8', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_8.jpg', rarity: 'UR' },

        // Haruto (8 cards)[cite: 3]
        { id: 'haruto_1', name: 'Haruto', group: 'haruto', img: './photocards/haruto_1.jpg', rarity: 'R' },
        { id: 'haruto_2', name: 'Haruto', group: 'haruto', img: './photocards/haruto_2.jpg', rarity: 'R' },
        { id: 'haruto_3', name: 'Haruto', group: 'haruto', img: './photocards/haruto_3.jpg', rarity: 'SR' },
        { id: 'haruto_4', name: 'Haruto', group: 'haruto', img: './photocards/haruto_4.jpg', rarity: 'SR' },
        { id: 'haruto_5', name: 'Haruto', group: 'haruto', img: './photocards/haruto_5.jpg', rarity: 'SSR' },
        { id: 'haruto_6', name: 'Haruto', group: 'haruto', img: './photocards/haruto_6.jpg', rarity: 'SSR' },
        { id: 'haruto_7', name: 'Haruto', group: 'haruto', img: './photocards/haruto_7.jpg', rarity: 'UR' },
        { id: 'haruto_8', name: 'Haruto', group: 'haruto', img: './photocards/haruto_8.jpg', rarity: 'UR' },

        // Jeongwoo (8 cards)[cite: 3]
        { id: 'jeongwoo_1', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_1.jpg', rarity: 'R' },
        { id: 'jeongwoo_2', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_2.jpg', rarity: 'R' },
        { id: 'jeongwoo_3', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_3.jpg', rarity: 'SR' },
        { id: 'jeongwoo_4', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_4.jpg', rarity: 'SR' },
        { id: 'jeongwoo_5', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_5.jpg', rarity: 'SSR' },
        { id: 'jeongwoo_6', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_6.jpg', rarity: 'SSR' },
        { id: 'jeongwoo_7', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_7.jpg', rarity: 'UR' },
        { id: 'jeongwoo_8', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_8.jpg', rarity: 'UR' },

        // Junghwan (8 cards)[cite: 3]
        { id: 'junghwan_1', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_1.jpg', rarity: 'R' },
        { id: 'junghwan_2', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_2.jpg', rarity: 'R' },
        { id: 'junghwan_3', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_3.jpg', rarity: 'SR' },
        { id: 'junghwan_4', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_4.jpg', rarity: 'SR' },
        { id: 'junghwan_5', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_5.jpg', rarity: 'SSR' },
        { id: 'junghwan_6', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_6.jpg', rarity: 'SSR' },
        { id: 'junghwan_7', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_7.jpg', rarity: 'UR' },
        { id: 'junghwan_8', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_8.jpg', rarity: 'UR' },

        // DUO (20 cards)[cite: 3]
        { id: 'duo_1', name: 'DUO 1', group: 'duo', img: './photocards/duo_1.jpg', rarity: 'SR' },
        { id: 'duo_2', name: 'DUO 2', group: 'duo', img: './photocards/duo_2.jpg', rarity: 'SR' },
        { id: 'duo_3', name: 'DUO 3', group: 'duo', img: './photocards/duo_3.jpg', rarity: 'SR' },
        { id: 'duo_4', name: 'DUO 4', group: 'duo', img: './photocards/duo_4.jpg', rarity: 'SR' },
        { id: 'duo_5', name: 'DUO 5', group: 'duo', img: './photocards/duo_5.jpg', rarity: 'SR' },
        { id: 'duo_6', name: 'DUO 6', group: 'duo', img: './photocards/duo_6.jpg', rarity: 'SSR' },
        { id: 'duo_7', name: 'DUO 7', group: 'duo', img: './photocards/duo_7.jpg', rarity: 'SSR' },
        { id: 'duo_8', name: 'DUO 8', group: 'duo', img: './photocards/duo_8.jpg', rarity: 'SSR' },
        { id: 'duo_9', name: 'DUO 9', group: 'duo', img: './photocards/duo_9.jpg', rarity: 'SSR' },
        { id: 'duo_10', name: 'DUO 10', group: 'duo', img: './photocards/duo_10.jpg', rarity: 'SSR' },
        { id: 'duo_11', name: 'DUO 11', group: 'duo', img: './photocards/duo_11.jpg', rarity: 'SSR' },
        { id: 'duo_12', name: 'DUO 12', group: 'duo', img: './photocards/duo_12.jpg', rarity: 'SSR' },
        { id: 'duo_13', name: 'DUO 13', group: 'duo', img: './photocards/duo_13.jpg', rarity: 'SSR' },
        { id: 'duo_14', name: 'DUO 14', group: 'duo', img: './photocards/duo_14.jpg', rarity: 'UR' },
        { id: 'duo_15', name: 'DUO 15', group: 'duo', img: './photocards/duo_15.jpg', rarity: 'UR' },
        { id: 'duo_16', name: 'DUO 16', group: 'duo', img: './photocards/duo_16.jpg', rarity: 'UR' },
        { id: 'duo_17', name: 'DUO 17', group: 'duo', img: './photocards/duo_17.jpg', rarity: 'UR' },
        { id: 'duo_18', name: 'DUO 18', group: 'duo', img: './photocards/duo_18.jpg', rarity: 'UR' },
        { id: 'duo_19', name: 'DUO 19', group: 'duo', img: './photocards/duo_19.jpg', rarity: 'UR' },
        { id: 'duo_20', name: 'DUO 20', group: 'duo', img: './photocards/duo_20.jpg', rarity: 'UR' }
    ];

    const CONFIG_BASE = {
        TRACK_COUNT: 4,
        NOTE_SPEED: 340,
        JUDGE_LINE_Y_RATIO: 0.82,
        TRACK_WIDTH_RATIO: 0.5,
        PERFECT_WINDOW: 60,
        GREAT_WINDOW: 120,
        GOOD_WINDOW: 180,
        MISS_WINDOW: 220
    };

    const KEY_MAP = ['d', 'f', 'j', 'k'];
    const TRACK_COLORS = [
        { main: '#ff0055', glow: '#ff4d6d' },
        { main: '#00ccff', glow: '#4dffff' },
        { main: '#ff6600', glow: '#ffaa4d' },
        { main: '#6600ff', glow: '#b388ff' }
    ];

    class SoundManager {
        constructor() { this.ctx = null; }
        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        }
        playClick() {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(this.ctx.currentTime + 0.05);
        }
        playStart() {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.08, now + idx * 0.06);
                gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.15);
            });
        }
        playHit() {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.50, now);
            osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.04);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        }
    }

    class Game {
        constructor() {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.video = document.getElementById('bg-video');
            this.audio = document.getElementById('bg-music');
            this.sound = new SoundManager();

            this.CONFIG = { ...CONFIG_BASE };
            this.currentSong = null;
            this.selectedMode = 'normal';

            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.gameTime = 0;
            this.startTime = 0;
            this.lastTimestamp = 0;
            this.isPlaying = false;
            this.isPaused = false;
            this.isEnded = false;

            this.stats = { perfect: 0, great: 0, good: 0, miss: 0 };
            this.notes = [];
            this.trackPressState = [false, false, false, false];
            this.hitEffects = [];
            this.floatingTexts = [];
            this.comboAnimScale = 1.0;

            this.scoreEl = document.getElementById('score-value');
            this.gameUiEl = document.getElementById('game-ui');
            this.startScreen = document.getElementById('start-screen');
            this.startBtn = document.getElementById('start-btn');
            this.endScreen = document.getElementById('end-screen');
            this.retryBtn = document.getElementById('retry-btn');
            this.songListEl = document.getElementById('song-list');
            this.songDetailEl = document.getElementById('song-detail');

            this.pauseBtn = document.getElementById('pause-btn');
            this.pauseOverlay = document.getElementById('pause-overlay');
            this.resumeBtn = document.getElementById('resume-btn');
            this.restartInGameBtn = document.getElementById('restart-in-game-btn');
            this.homeBtn = document.getElementById('home-btn');

            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());

            this.setupEventListeners();
            this.setupTouchControls();
            this.renderSongList();
            this.renderSongDetail();

            this.injectCollectionUI();
            this.updateHomeGemsDisplay();

            this.loop = this.loop.bind(this);
        }

        updateHomeGemsDisplay() {
            const gemsEl = document.getElementById('home-gems-display');
            if (gemsEl) {
                const currentGems = parseInt(localStorage.getItem('player_gems') || '1000', 10);
                gemsEl.textContent = currentGems.toLocaleString();
            }
        }

        renderSongList() {
            if (!this.songListEl) return;
            this.songListEl.innerHTML = '';
            SONG_LIST.forEach(song => {
                const storageKey = `high_score_${song.id}_normal`;
                const highScore = parseInt(localStorage.getItem(storageKey) || '0', 10);

                const card = document.createElement('div');
                card.className = 'song-card';
                card.dataset.songId = song.id;
                card.innerHTML = `
                    <div class="song-cover" style="background: ${song.coverBg}; overflow: hidden; padding: 0;">
                        <img src="${song.coverImg}" alt="${song.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${song.cover}</div>
                    </div>
                    <div class="song-info">
                        <div class="song-name">${song.name}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                    <div class="song-score-badge" style="margin-left: auto; text-align: right; padding-right: 12px; font-family: 'Segoe UI', sans-serif;">
                        <div style="font-size: 0.65rem; color: rgba(255,255,255,0.5); font-weight: 600; letter-spacing: 0.5px;">HI-SCORE</div>
                        <div style="font-size: 0.85rem; color: #00e5ff; font-weight: 800;">${highScore > 0 ? highScore.toLocaleString() : '---'}</div>
                    </div>
                `;
                card.addEventListener('click', () => {
                    this.sound.playClick();
                    this.selectSong(song.id);
                });
                this.songListEl.appendChild(card);
            });
        }

        selectSong(songId) {
            const song = SONG_LIST.find(s => s.id === songId);
            if (!song) return;
            this.currentSong = song;
            document.querySelectorAll('.song-card').forEach(card => {
                card.classList.toggle('active', card.dataset.songId === songId);
            });
            this.renderSongDetail();
            if (this.startBtn) {
                this.startBtn.disabled = false;
                this.startBtn.innerHTML = '<span class="btn-text">▶ START GAME</span>';
            }
        }

        renderSongDetail() {
            if (!this.songDetailEl) return;
            if (!this.currentSong) {
                this.songDetailEl.classList.remove('has-song');
                this.songDetailEl.innerHTML = `<div class="no-song-placeholder" style="color: rgba(255,255,255,0.5); padding: 30px 0;">please select a song</div>`;
                return;
            }
            const song = this.currentSong;
            this.songDetailEl.classList.add('has-song');
            this.songDetailEl.innerHTML = `
                <div class="detail-cover-img" style="background: ${song.coverBg}; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                  <img src="${song.detailImg}" alt="${song.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center;">${song.cover}</div>
                </div>
                <h2>${song.name}</h2>
                <p>${song.artist}</p>
                <div class="mode-selector" style="display: flex; gap: 8px; width: 100%; margin-top: 15px;">
                    <button class="mode-btn ${this.selectedMode === 'easy' ? 'active' : ''}" data-mode="easy">EASY</button>
                    <button class="mode-btn ${this.selectedMode === 'normal' ? 'active' : ''}" data-mode="normal">NORMAL</button>
                    <button class="mode-btn ${this.selectedMode === 'hard' ? 'active' : ''}" data-mode="hard">HARD</button>
                </div>
            `;
            this.songDetailEl.querySelectorAll('.mode-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.sound.playClick();
                    this.selectedMode = e.target.dataset.mode;
                    this.renderSongDetail();
                });
            });
        }

        loadSongMedia(song) {
            if (song.video) { this.video.src = song.video; this.video.load(); }
            if (song.audio) { this.audio.src = song.audio; this.audio.load(); }
        }

        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            const isMobile = this.width < 768;
            this.trackAreaWidth = isMobile ? this.width * 0.98 : this.width * this.CONFIG.TRACK_WIDTH_RATIO;
            this.trackAreaLeft = (this.width - this.trackAreaWidth) / 2;
            this.trackWidth = this.trackAreaWidth / this.CONFIG.TRACK_COUNT;
            this.judgeLineY = this.height * this.CONFIG.JUDGE_LINE_Y_RATIO;
        }

        setupEventListeners() {
            document.addEventListener('keydown', (e) => {
                if (this.isPaused) return;
                const trackIdx = KEY_MAP.indexOf(e.key.toLowerCase());
                if (trackIdx !== -1 && !this.trackPressState[trackIdx]) {
                    this.pressTrack(trackIdx);
                }
            });

            document.addEventListener('keyup', (e) => {
                const trackIdx = KEY_MAP.indexOf(e.key.toLowerCase());
                if (trackIdx !== -1) this.releaseTrack(trackIdx);
            });

            this.startBtn.addEventListener('click', () => { this.sound.playStart(); this.startGame(); });
            this.retryBtn.addEventListener('click', () => { this.sound.playStart(); this.startGame(); });
            this.pauseBtn.addEventListener('click', () => { this.togglePause(); });
            this.resumeBtn.addEventListener('click', () => { this.togglePause(); });

            // 修复：点击游戏内重新开始按钮时，关闭暂停浮层并重新开始游戏
            this.restartInGameBtn.addEventListener('click', () => {
                this.pauseOverlay.classList.add('hidden');
                this.sound.playStart();
                this.startGame();
            });

            this.homeBtn.addEventListener('click', () => { this.goHome(); this.renderSongList(); });

            const resultHomeBtn = document.getElementById('result-home-btn');
            if (resultHomeBtn) resultHomeBtn.addEventListener('click', () => { this.goHome(); });
            this.audio.addEventListener('ended', () => {
                this.finishGame();
            });
        }

        setupTouchControls() {
            const handleTouchInput = (clientX) => {
                if (!this.isPlaying || this.isPaused) return -1;
                const relativeX = clientX - this.trackAreaLeft;
                if (relativeX >= 0 && relativeX <= this.trackAreaWidth) {
                    const trackIdx = Math.floor(relativeX / this.trackWidth);
                    if (trackIdx >= 0 && trackIdx < 4) return trackIdx;
                }
                return -1;
            };

            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const idx = handleTouchInput(e.changedTouches[i].clientX);
                    if (idx !== -1 && !this.trackPressState[idx]) this.pressTrack(idx);
                }
            }, { passive: false });

            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                for (let i = 0; i < 4; i++) this.releaseTrack(i);
            }, { passive: false });

            this.canvas.addEventListener('mousedown', (e) => {
                const idx = handleTouchInput(e.clientX);
                if (idx !== -1 && !this.trackPressState[idx]) this.pressTrack(idx);
            });
            this.canvas.addEventListener('mouseup', (e) => {
                for (let i = 0; i < 4; i++) this.releaseTrack(i);
            });
        }

        togglePause() {
            if (!this.isPlaying) return;
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                this.audio.pause();
                this.video.pause();
                this.pauseOverlay.classList.remove('hidden');
            } else {
                this.audio.play().catch(() => { });
                this.video.play().catch(() => { });
                this.pauseOverlay.classList.add('hidden');
                this.lastTimestamp = performance.now();
                requestAnimationFrame(this.loop);
            }
        }

        goHome() {
            this.isPlaying = false;
            this.isPaused = false;
            this.isEnded = false;
            try { this.audio.pause(); } catch (e) { }
            try { this.video.pause(); } catch (e) { }
            this.pauseOverlay.classList.add('hidden');
            this.endScreen.classList.add('hidden');
            this.gameUiEl.classList.add('hidden');
            this.startScreen.style.display = 'flex';
            this.updateHomeGemsDisplay();
        }

        generateNotesByMode() {
            const speedMap = { easy: 260, normal: 340, hard: 440 };
            const intervalMap = { easy: 600, normal: 400, hard: 250 };
            this.CONFIG.NOTE_SPEED = speedMap[this.selectedMode] || 340;
            const interval = intervalMap[this.selectedMode] || 400;
            const totalDuration = (this.audio && this.audio.duration && !isNaN(this.audio.duration)) ? this.audio.duration * 1000 : 120000;

            this.notes = [];
            let currentTime = 2000;
            let noteCount = 0;
            while (currentTime < totalDuration - 3000) {
                const isHold = (noteCount % 7 === 0);
                const duration = isHold ? 800 + Math.random() * 800 : 0;
                this.notes.push({
                    track: Math.floor(Math.random() * 4),
                    time: currentTime,
                    duration: duration,
                    isHolding: false,
                    completed: false,
                    hit: false
                });
                currentTime += isHold ? interval + duration : interval;
                noteCount++;
            }
        }

        startGame() {
            if (!this.currentSong) return;
            this.loadSongMedia(this.currentSong);
            this.startScreen.style.display = 'none';
            this.endScreen.classList.add('hidden');
            this.pauseOverlay.classList.add('hidden');
            this.gameUiEl.classList.remove('hidden');

            this.isPlaying = true;
            this.isPaused = false;
            this.isEnded = false;
            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.stats = { perfect: 0, great: 0, good: 0, miss: 0 };
            this.floatingTexts = [];
            if (this.scoreEl) this.scoreEl.textContent = '0';

            setTimeout(() => {
                if (this.video.src) this.video.play().catch(() => { });
                if (this.audio.src) {
                    this.audio.currentTime = 0;
                    this.audio.play().catch(() => { });
                }
                this.generateNotesByMode();
            }, 300);

            this.startTime = performance.now();
            this.lastTimestamp = this.startTime;
            requestAnimationFrame(this.loop);
        }

        pressTrack(trackIdx) {
            if (!this.isPlaying || this.isPaused) return;
            this.trackPressState[trackIdx] = true;

            // 修复：将原本未定义的 note 改为通过正确的 trackIdx 计算坐标
            const trackX = this.trackAreaLeft + trackIdx * this.trackWidth + this.trackWidth / 2;

            this.hitEffects.push({
                x: trackX, y: this.judgeLineY, radius: 10, maxRadius: 70, alpha: 1.0, color: TRACK_COLORS[trackIdx].glow
            });

            let closestNote = null, closestDiff = Infinity;
            for (const note of this.notes) {
                if (note.completed || note.hit || note.track !== trackIdx) continue;
                const diff = Math.abs(this.gameTime - note.time);
                if (diff < this.CONFIG.MISS_WINDOW && diff < closestDiff) {
                    closestDiff = diff;
                    closestNote = note;
                }
            }

            if (closestNote) {
                closestNote.hit = true;
                let judge = 'miss';
                if (closestDiff <= this.CONFIG.PERFECT_WINDOW) judge = 'perfect';
                else if (closestDiff <= this.CONFIG.GREAT_WINDOW) judge = 'great';
                else if (closestDiff <= this.CONFIG.GOOD_WINDOW) judge = 'good';

                if (closestNote.duration > 0) {
                    closestNote.isHolding = true;
                    this.handleJudge(judge, trackX);
                } else {
                    closestNote.completed = true;
                    this.handleJudge(judge, trackX);
                }
            }
        }

        releaseTrack(trackIdx) {
            this.trackPressState[trackIdx] = false;
            for (const note of this.notes) {
                if (note.track === trackIdx && note.isHolding && !note.completed) {
                    note.isHolding = false;
                    const endTime = note.time + note.duration;
                    const trackX = this.trackAreaLeft + trackIdx * this.trackWidth + this.trackWidth / 2;
                    if (Math.abs(this.gameTime - endTime) <= this.CONFIG.GOOD_WINDOW) {
                        note.completed = true;
                        this.handleJudge('perfect', trackX);
                    } else {
                        note.completed = true;
                        this.handleJudge('miss', trackX);
                    }
                }
            }
        }

        handleJudge(judge, x) {
            if (judge !== 'miss') {
                this.sound.playHit();
            }
            if (judge === 'miss') {
                this.combo = 0;
                this.stats.miss++;
                this.spawnFloatingText('MISS', '#ff4466', x);
            } else {
                this.combo++;
                this.maxCombo = Math.max(this.maxCombo, this.combo);
                this.comboAnimScale = 1.35;
                if (judge === 'perfect') { this.score += 300; this.stats.perfect++; this.spawnFloatingText('PERFECT', '#00e5ff', x); }
                else if (judge === 'great') { this.score += 200; this.stats.great++; this.spawnFloatingText('GREAT', '#00ff66', x); }
                else if (judge === 'good') { this.score += 100; this.stats.good++; this.spawnFloatingText('GOOD', '#ffaa00', x); }
            }
            if (this.scoreEl) this.scoreEl.textContent = this.score.toLocaleString();
        }

        spawnFloatingText(text, color, x) {
            this.floatingTexts.push({
                text: text, color: color,
                x: x || (this.trackAreaLeft + this.trackAreaWidth / 2),
                y: this.judgeLineY - 60, alpha: 1.0, scale: 1.3
            });
        }

        finishGame() {
            if (this.isEnded) return;
            this.isEnded = true;
            this.isPlaying = false;
            try { this.audio.pause(); } catch (e) { }
            try { this.video.pause(); } catch (e) { }
            this.gameUiEl.classList.add('hidden');
            this.updateResultScreen();
            this.triggerPostGameDrops();
            if (this.endScreen) this.endScreen.classList.remove('hidden');
        }

        updateResultScreen() {
            const totalNotes = this.stats.perfect + this.stats.great + this.stats.good + this.stats.miss;
            const accuracy = totalNotes > 0 ? Math.round(((this.stats.perfect * 1 + this.stats.great * 0.8 + this.stats.good * 0.5) / totalNotes) * 100) : 0;
            let rank = accuracy >= 95 ? 'S' : accuracy >= 85 ? 'A' : accuracy >= 75 ? 'B' : accuracy >= 60 ? 'C' : 'D';

            const storageKey = `high_score_${this.currentSong ? this.currentSong.id : 'default'}_${this.selectedMode}`;
            const previousBest = parseInt(localStorage.getItem(storageKey) || '0', 10);
            if (this.score > previousBest) {
                localStorage.setItem(storageKey, this.score.toString());
            }
            const currentBest = Math.max(this.score, previousBest);

            document.getElementById('grade-display').textContent = rank;
            document.getElementById('final-score-value').textContent = this.score.toLocaleString();
            document.getElementById('best-score').textContent = currentBest.toLocaleString();
            document.getElementById('stat-perfect').textContent = this.stats.perfect;
            document.getElementById('stat-great').textContent = this.stats.great;
            document.getElementById('stat-good').textContent = this.stats.good;
            document.getElementById('stat-miss').textContent = this.stats.miss;
            document.getElementById('stat-maxcombo').textContent = this.maxCombo;
            document.getElementById('stat-accuracy').textContent = accuracy + '%';
        }

        triggerPostGameDrops() {
            const dropContainer = document.getElementById('card-drop-result');
            if (!dropContainer) return;

            const earnedGems = 30 + Math.floor(this.score / 2000) + (this.stats.perfect > 20 ? 20 : 5);
            let currentGems = parseInt(localStorage.getItem('player_gems') || '1000', 10);
            currentGems += earnedGems;
            localStorage.setItem('player_gems', currentGems.toString());

            const randomCard = PHOTO_CARDS[Math.floor(Math.random() * PHOTO_CARDS.length)];
            let myCards = JSON.parse(localStorage.getItem('my_photocards') || '[]');
            const isNew = !myCards.includes(randomCard.id);

            if (isNew) {
                myCards.push(randomCard.id);
                localStorage.setItem('my_photocards', JSON.stringify(myCards));
            }

            const isSSS = randomCard.rarity === 'SSS';

            dropContainer.innerHTML = `
                <div style="margin: 10px auto; padding: 12px; background: rgba(0,0,0,0.75); border-radius: 12px; display: inline-block; border: 2px solid ${isSSS ? '#ff00aa' : '#00e5ff'}; box-shadow: 0 0 ${isSSS ? '25px #ff00aa' : '15px rgba(0,229,255,0.4)'};">
                    <div style="font-size: 0.8rem; color: #ffea00; font-weight: bold; margin-bottom: 6px;">🎁 LIVE REWARDS DROPPED!</div>
                    <div style="font-size: 0.75rem; color: #00e5ff; margin-bottom: 8px;">+${earnedGems} 💎 Diamonds Collected!</div>
                    
                    <div style="position: relative; display: inline-block;">
                        ${isSSS ? '<div class="sss-glow-effect"></div>' : ''}
                        <img src="${randomCard.img}" style="width: 90px; height: 125px; object-fit: cover; border-radius: 8px; border: 2px solid ${isSSS ? '#ff00aa' : '#fff'};" onerror="this.src='';">
                    </div>
                    
                    <div style="font-size: 0.8rem; color: white; margin-top: 6px; font-weight: bold;">
                        ${randomCard.name} <span style="color: ${isSSS ? '#ff00aa' : '#00e5ff'};">[${randomCard.rarity}]</span> ${isNew ? '<span style="color:#ff00aa;">NEW!</span>' : ''}
                    </div>
                </div>
            `;
        }

        injectCollectionUI() {
            if (!window._uiDelegateBound) {
                window._uiDelegateBound = true;
                document.addEventListener('click', (e) => {
                    const collectionBtn = e.target.closest('#open-collection-btn');
                    if (collectionBtn) {
                        this.sound.playClick();
                        this.openCollectionModal();
                        return;
                    }

                    const shopBtn = e.target.closest('#open-shop-btn');
                    if (shopBtn) {
                        this.sound.playClick();
                        this.openShopModal();
                        return;
                    }
                });
            }

            const endCard = document.querySelector('.result-card') || this.endScreen;
            if (endCard && !document.getElementById('card-drop-result')) {
                const dropDiv = document.createElement('div');
                dropDiv.id = 'card-drop-result';
                endCard.appendChild(dropDiv);
            }
        }

        openCollectionModal() {
            let modal = document.getElementById('collection-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'collection-modal';
                modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;';
                document.body.appendChild(modal);
            }

            const myCards = JSON.parse(localStorage.getItem('my_photocards') || '[]');
            const currentBias = localStorage.getItem('my_bias') || '';

            let cardsHtml = PHOTO_CARDS.map(card => {
                const owned = myCards.includes(card.id);
                const isBias = currentBias === card.id;
                const isSSS = card.rarity === 'SSS';

                return `
                    <div style="background: rgba(255,255,255,0.05); border: 2px solid ${isBias ? '#ff00aa' : (isSSS && owned ? '#ff00ff' : (owned ? '#00e5ff' : 'rgba(255,255,255,0.1)'))}; border-radius: 10px; padding: 8px; text-align: center; width: 95px; box-sizing: border-box; position: relative; ${isSSS && owned ? 'box-shadow: 0 0 15px rgba(255,0,255,0.6); animation: pulseGlow 1.5s infinite alternate;' : ''}">
                        ${isBias ? '<div style="position: absolute; top: 2px; right: 2px; background: #ff00aa; font-size: 8px; color: white; padding: 1px 4px; border-radius: 4px; z-index: 2;">BIAS</div>' : ''}
                        <div style="position: relative; display: inline-block;">
                            ${isSSS && owned ? '<div style="position: absolute; inset: -3px; border-radius: 8px; background: linear-gradient(45deg, #ff00aa, #00e5ff, #ffea00); z-index: 0; filter: blur(4px); opacity: 0.8; animation: rotateGlow 3s linear infinite;"></div>' : ''}
                            <img src="${card.img}" style="width: 76px; height: 102px; object-fit: cover; border-radius: 6px; position: relative; z-index: 1; filter: ${owned ? 'none' : 'grayscale(100%) brightness(30%)'};" onerror="this.src='';">
                        </div>
                        <div style="font-size: 10px; color: white; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold;">${card.name}</div>
                        <div style="font-size: 9px; color: ${isSSS ? '#ff00aa' : '#00e5ff'}; font-weight: bold;">[${card.rarity}]</div>
                        ${owned ? `<button class="set-bias-btn" data-id="${card.id}" style="margin-top: 4px; font-size: 9px; background: #00e5ff; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">${isBias ? 'BIAS' : 'Set Bias'}</button>` : '<div style="font-size: 9px; color: #888; margin-top:4px;">Locked</div>'}
                    </div>
                `;
            }).join('');

            modal.innerHTML = `
                <div style="background: #111; border: 2px solid #00e5ff; border-radius: 16px; width: 100%; max-width: 720px; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 0 30px rgba(0,229,255,0.3);">
                    <div style="padding: 15px 20px; background: rgba(0,229,255,0.1); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <h3 style="margin: 0; color: #00e5ff; font-size: 1.1rem;">💎 TREASURE PHOTOCOARD ALBUM (${myCards.length}/${PHOTO_CARDS.length})</h3>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <button id="modal-shop-btn" style="background: linear-gradient(135deg, #ff00aa, #ff5500); border: none; color: white; padding: 5px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; cursor: pointer; box-shadow: 0 0 10px rgba(255,0,170,0.4);">🛒 Card Shop</button>
                            <button id="close-modal-btn" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">✕</button>
                        </div>
                    </div>
                    <div style="padding: 15px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; justify-items: center;">
                        ${cardsHtml}
                    </div>
                </div>
            `;

            modal.style.display = 'flex';

            modal.querySelector('#close-modal-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });

            modal.querySelector('#modal-shop-btn').addEventListener('click', () => {
                this.sound.playClick();
                this.openShopModal();
            });

            modal.querySelectorAll('.set-bias-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cardId = e.target.dataset.id;
                    localStorage.setItem('my_bias', cardId);
                    this.sound.playClick();
                    this.openCollectionModal();
                });
            });
        }

        openShopModal() {
            let shopModal = document.getElementById('shop-modal');
            if (!shopModal) {
                shopModal = document.createElement('div');
                shopModal.id = 'shop-modal';
                shopModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;';
                document.body.appendChild(shopModal);
            }

            let gems = parseInt(localStorage.getItem('player_gems') || '1000', 10);

            shopModal.innerHTML = `
                <div style="background: #111; border: 2px solid #ff00aa; border-radius: 16px; width: 100%; max-width: 480px; padding: 25px; box-sizing: border-box; text-align: center; box-shadow: 0 0 35px rgba(255,0,170,0.4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; color: #ff00aa; font-size: 1.3rem;">🛒 TREASURE CARD SHOP & GACHA</h3>
                        <button id="close-shop-btn" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">✕</button>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 20px; font-size: 0.95rem; color: #00e5ff; font-weight: bold;">
                        Your Diamonds: <span id="shop-gems-display">${gems}</span> 💎
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="background: rgba(255,0,170,0.1); border: 1px solid #ff00aa; border-radius: 10px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                            <div style="text-align: left;">
                                <div style="color: white; font-weight: bold; font-size: 1rem;">Single Gacha Draw</div>
                                <div style="color: #aaa; font-size: 0.75rem;">Chance to get glowing SSS cards!</div>
                            </div>
                            <button id="buy-single-btn" style="background: linear-gradient(135deg, #ff00aa, #ff5500); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 0 10px rgba(255,0,170,0.5);">Draw (100 💎)</button>
                        </div>
                    </div>
                    <div id="shop-draw-result" style="margin-top: 20px; min-height: 140px;"></div>
                </div>
            `;

            shopModal.style.display = 'flex';

            shopModal.querySelector('#close-shop-btn').addEventListener('click', () => {
                shopModal.style.display = 'none';
                this.updateHomeGemsDisplay();
            });

            shopModal.querySelector('#buy-single-btn').addEventListener('click', () => {
                let currentGems = parseInt(localStorage.getItem('player_gems') || '1000', 10);
                if (currentGems < 100) {
                    alert('Not enough diamonds! Play songs to earn more!');
                    return;
                }
                currentGems -= 100;
                localStorage.setItem('player_gems', currentGems.toString());
                shopModal.querySelector('#shop-gems-display').textContent = currentGems;
                this.updateHomeGemsDisplay();
                this.sound.playClick();

                const randomCard = PHOTO_CARDS[Math.floor(Math.random() * PHOTO_CARDS.length)];
                let myCards = JSON.parse(localStorage.getItem('my_photocards') || '[]');
                const isNew = !myCards.includes(randomCard.id);
                if (isNew) {
                    myCards.push(randomCard.id);
                    localStorage.setItem('my_photocards', JSON.stringify(myCards));
                }

                const isSSS = randomCard.rarity === 'SSS';
                const resultDiv = shopModal.querySelector('#shop-draw-result');
                resultDiv.innerHTML = `
                    <div style="padding: 12px; background: rgba(0,0,0,0.8); border-radius: 12px; display: inline-block; border: 2px solid ${isSSS ? '#ff00aa' : '#00e5ff'}; box-shadow: 0 0 ${isSSS ? '25px #ff00aa' : '15px rgba(0,229,255,0.4)'};">
                        <div style="font-size: 0.8rem; color: #00e5ff; font-weight: bold; margin-bottom: 6px;">🎉 GACHA SUCCESS! ${isNew ? '<span style="color:#ff00aa;">[NEW CARD!]</span>' : ''}</div>
                        <div style="position: relative; display: inline-block;">
                            ${isSSS ? '<div style="position: absolute; inset: -3px; border-radius: 8px; background: linear-gradient(45deg, #ff00aa, #00e5ff, #ffea00); filter: blur(5px); opacity: 0.9;"></div>' : ''}
                            <img src="${randomCard.img}" style="width: 85px; height: 115px; object-fit: cover; border-radius: 6px; position: relative; z-index: 1;" onerror="this.src='';">
                        </div>
                        <div style="font-size: 0.85rem; color: white; margin-top: 6px; font-weight: bold;">${randomCard.name} <span style="color: ${isSSS ? '#ff00aa' : '#00e5ff'};">[${randomCard.rarity}]</span></div>
                    </div>
                `;
            });
        }

        loop(timestamp) {
            if (!this.isPlaying || this.isPaused) return;
            this.lastTimestamp = timestamp;
            this.gameTime = timestamp - this.startTime;

            if (this.comboAnimScale > 1.0) {
                this.comboAnimScale -= 0.02;
                if (this.comboAnimScale < 1.0) this.comboAnimScale = 1.0;
            }

            for (const note of this.notes) {
                if (note.completed) continue;
                if (note.isHolding) {
                    if (this.gameTime >= note.time + note.duration) {
                        note.completed = true;
                        note.isHolding = false;
                        this.handleJudge('perfect');
                    } else {
                        this.score += 2;
                        if (this.scoreEl) this.scoreEl.textContent = this.score.toLocaleString();
                    }
                } else if (!note.hit && this.gameTime - note.time > this.CONFIG.MISS_WINDOW) {
                    note.completed = true;
                    this.handleJudge('miss');
                }
            }

            this.render();
            if (!this.isEnded) requestAnimationFrame(this.loop);
        }

        render() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawBackgroundReactive();
            this.drawTracks();
            this.drawNotes();
            this.drawJudgeLine();
            this.drawHitEffects();
            this.drawFloatingTexts();
            this.drawTopProgressBar();
            this.drawCenterHUD();
        }

        drawBackgroundReactive() {
            if (this.combo > 10) {
                this.ctx.save();
                this.ctx.fillStyle = `rgba(0, 229, 255, ${Math.min(0.18, (this.combo / 100) * 0.12)})`;
                this.ctx.fillRect(this.trackAreaLeft, 0, this.trackAreaWidth, this.height);
                this.ctx.restore();
            }
        }

        drawTracks() {
            for (let i = 0; i < this.CONFIG.TRACK_COUNT; i++) {
                const x = this.trackAreaLeft + i * this.trackWidth;
                if (this.trackPressState[i]) {
                    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
                    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    grad.addColorStop(1, TRACK_COLORS[i].glow + '88');
                    this.ctx.fillStyle = grad;
                    this.ctx.fillRect(x + 1, 0, this.trackWidth - 2, this.height);
                } else {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                    this.ctx.fillRect(x + 1, 0, this.trackWidth - 2, this.height);
                }
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();
            }
        }

        drawTopProgressBar() {
            const duration = (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0) ? this.audio.duration * 1000 : 120000;
            const progress = Math.min(1, Math.max(0, this.gameTime / duration));

            const barW = Math.min(280, this.trackAreaWidth * 0.85);
            const barH = 6;
            const barX = this.trackAreaLeft + (this.trackAreaWidth - barW) / 2;
            const barY = 40;

            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.beginPath();
            this.ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 4);
            this.ctx.fill();

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.beginPath();
            this.ctx.roundRect(barX, barY, barW, barH, 3);
            this.ctx.fill();

            if (progress > 0) {
                const grad = this.ctx.createLinearGradient(barX, 0, barX + barW, 0);
                grad.addColorStop(0, '#00e5ff');
                grad.addColorStop(1, '#ff00aa');
                this.ctx.fillStyle = grad;
                this.ctx.shadowColor = '#00e5ff';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.roundRect(barX, barY, barW * progress, barH, 3);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        drawNotes() {
            for (const note of this.notes) {
                if (note.completed && !note.isHolding) continue;
                const colorConfig = TRACK_COLORS[note.track];
                const trackX = this.trackAreaLeft + note.track * this.trackWidth + this.trackWidth / 2;
                const centerX = trackX + this.trackWidth / 2;
                const noteW = this.trackWidth * 0.82;
                const noteH = 16;
                const startY = this.judgeLineY - (note.time - this.gameTime) * (this.CONFIG.NOTE_SPEED / 1000);

                if (note.duration > 0) {
                    const endY = this.judgeLineY - ((note.time + note.duration) - this.gameTime) * (this.CONFIG.NOTE_SPEED / 1000);
                    const headY = note.isHolding ? this.judgeLineY : startY;
                    if (headY >= -100 && endY <= this.height + 100) {
                        const tailHeight = Math.max(0, headY - endY);
                        const tailGrad = this.ctx.createLinearGradient(0, endY, 0, headY);
                        tailGrad.addColorStop(0, colorConfig.glow + '55');
                        tailGrad.addColorStop(1, colorConfig.main + 'dd');
                        this.ctx.fillStyle = tailGrad;
                        this.ctx.fillRect(centerX - noteW * 0.4, endY, noteW * 0.8, tailHeight);
                        this.drawStylizedNote(centerX, headY, noteW, noteH, colorConfig);
                    }
                } else {
                    if (startY >= -50 && startY <= this.height + 50) {
                        this.drawStylizedNote(centerX, startY, noteW, noteH, colorConfig);
                    }
                }
            }
        }

        drawStylizedNote(x, y, w, h, colorConfig) {
            this.ctx.save();
            this.ctx.translate(x - w / 2, y - h / 2);
            this.ctx.shadowColor = colorConfig.glow;
            this.ctx.shadowBlur = 18;
            const grad = this.ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, colorConfig.glow);
            grad.addColorStop(1, colorConfig.main);
            this.ctx.fillStyle = grad;
            const r = 8;
            this.ctx.beginPath();
            this.ctx.moveTo(r, 0); this.ctx.lineTo(w - r, 0);
            this.ctx.quadraticCurveTo(w, 0, w, r); this.ctx.lineTo(w, h - r);
            this.ctx.quadraticCurveTo(w, h, w - r, h); this.ctx.lineTo(r, h);
            this.ctx.quadraticCurveTo(0, h, 0, h - r); this.ctx.lineTo(0, r);
            this.ctx.quadraticCurveTo(0, 0, r, 0); this.ctx.closePath();
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            this.ctx.fillRect(4, 3, w - 8, 3);
            this.ctx.restore();
        }

        drawHitEffects() {
            for (let i = this.hitEffects.length - 1; i >= 0; i--) {
                const fx = this.hitEffects[i];
                fx.radius += 3.5; fx.alpha -= 0.07;
                if (fx.alpha <= 0) { this.hitEffects.splice(i, 1); continue; }
                this.ctx.save();
                this.ctx.strokeStyle = fx.color; this.ctx.lineWidth = 4;
                this.ctx.globalAlpha = fx.alpha; this.ctx.shadowColor = fx.color; this.ctx.shadowBlur = 22;
                this.ctx.beginPath(); this.ctx.arc(fx.x, fx.y, fx.radius, 0, Math.PI * 2);
                this.ctx.stroke(); this.ctx.restore();
            }
        }

        drawFloatingTexts() {
            for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
                const ft = this.floatingTexts[i];
                ft.y -= 1.5; ft.alpha -= 0.035; ft.scale = Math.max(1.0, ft.scale - 0.02);
                if (ft.alpha <= 0) { this.floatingTexts.splice(i, 1); continue; }
                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0, ft.alpha);
                this.ctx.font = `900 ${Math.round(22 * ft.scale)}px 'Segoe UI', sans-serif`;
                this.ctx.fillStyle = ft.color; this.ctx.shadowColor = ft.color; this.ctx.shadowBlur = 15;
                this.ctx.textAlign = 'center'; this.ctx.fillText(ft.text, ft.x, ft.y);
                this.ctx.restore();
            }
        }

        drawCenterHUD() {
            if (this.combo > 1) {
                this.ctx.save();
                this.ctx.textAlign = 'center';
                this.ctx.shadowColor = 'rgba(0, 229, 255, 0.9)';
                this.ctx.shadowBlur = 20;
                const centerX = this.trackAreaLeft + this.trackAreaWidth / 2;
                const centerY = this.judgeLineY - 110;
                this.ctx.translate(centerX, centerY);
                this.ctx.scale(this.comboAnimScale, this.comboAnimScale);
                this.ctx.font = '900 42px "Segoe UI", sans-serif';
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(this.combo, 0, 0);
                this.ctx.font = '700 13px "Segoe UI", sans-serif';
                this.ctx.fillStyle = '#00e5ff';
                this.ctx.fillText('COMBO', 0, 22);
                this.ctx.restore();
            }
        }

        drawJudgeLine() {
            this.ctx.shadowColor = '#00e5ff';
            this.ctx.shadowBlur = 25;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 4.5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.trackAreaLeft, this.judgeLineY);
            this.ctx.lineTo(this.trackAreaLeft + this.trackAreaWidth, this.judgeLineY);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
    }

    const styleElem = document.createElement('style');
    styleElem.innerHTML = `
        @keyframes pulseGlow {
            0% { box-shadow: 0 0 10px rgba(255,0,170,0.5); }
            100% { box-shadow: 0 0 25px rgba(0,229,255,0.9); }
        }
        @keyframes rotateGlow {
            0% { filter: hue-rotate(0deg) blur(5px); }
            100% { filter: hue-rotate(360deg) blur(5px); }
        }
    `;
    document.head.appendChild(styleElem);

    window.addEventListener('load', () => {
        window._game = new Game();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(() => console.log('PWA Service Worker 注册成功'))
                .catch((err) => console.log('PWA 注册失败:', err));
        }
    });
})();