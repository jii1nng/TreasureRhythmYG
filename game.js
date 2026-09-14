(function () {
    'use strict';
    // 替换为你的 Supabase 项目 URL 和 Anon Key
    const SUPABASE_URL = 'https://khjzhoiltfujezxlddfs.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_G0ym78XaN3eeOry4BlyWww_JTaq6JP9';

    let supabaseClient = null;
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        };
        document.head.appendChild(script);
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getPlayerName() {
        return localStorage.getItem('player_id_name') || '';
    }

    function showNameModal() {
        const modal = document.getElementById('name-modal');
        if (modal) modal.style.display = 'flex';
        const input = document.getElementById('player-name-input');
        if (input) input.value = getPlayerName();
    }

    function hideNameModal() {
        const modal = document.getElementById('name-modal');
        if (modal) modal.style.display = 'none';
    }

    function updatePlayerChip() {
        const name = getPlayerName() || 'GUEST';
        const chip = document.getElementById('player-name-chip');
        if (chip) chip.textContent = name;
        const avatar = document.querySelector('.player-avatar');
        if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
    }

    function setRankStatus(text) {
        const el = document.getElementById('rank-sync-status');
        if (el) el.textContent = text;
    }

    function readLocalBoard() {
        try {
            const rows = JSON.parse(localStorage.getItem('local_leaderboard') || '[]');
            return Array.isArray(rows) ? rows : [];
        } catch (err) {
            return [];
        }
    }

    function writeLocalBoard(rows) {
        localStorage.setItem('local_leaderboard', JSON.stringify(rows.slice(-200)));
    }

    function mergeBestScores(rows) {
        const best = {};
        rows.forEach((row) => {
            const name = String((row && row.player_name) || 'UNKNOWN').trim() || 'UNKNOWN';
            const score = Number(row && row.score) || 0;
            if (!best[name] || score > Number(best[name].score || 0)) {
                best[name] = {
                    player_name: name,
                    song_name: (row && row.song_name) || 'UNKNOWN',
                    score: score
                };
            }
        });
        return Object.keys(best)
            .map((name) => best[name])
            .sort((a, b) => b.score - a.score || a.player_name.localeCompare(b.player_name))
            .slice(0, 50);
    }

    async function fetchAndRenderLeaderboard() {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;
        listContainer.innerHTML = '<div class="empty-state">SYNCING CLOUD RANKING...</div>';
        setRankStatus('Refreshing live ranking...');

        try {
            let remote = [];
            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from('scores')
                    .select('player_name, song_name, score')
                    .order('score', { ascending: false })
                    .limit(100);
                if (!error && data) remote = data;
            }

            const data = mergeBestScores([].concat(remote || [], readLocalBoard()));
            const me = getPlayerName();

            if (!data || data.length === 0) {
                listContainer.innerHTML = '<div class="empty-state">No scores yet. Clear a song to claim 1st place.</div>';
                setRankStatus('Cloud ranking is empty');
                return;
            }

            listContainer.innerHTML = data.map((row, index) => {
                const isMe = me && row.player_name === me;
                return `<div class="rank-row${isMe ? ' me' : ''}">
                    <div class="rank-pos">${index + 1}</div>
                    <div>
                        <div class="rank-name">${escapeHtml(row.player_name || 'UNKNOWN')}${isMe ? ' · YOU' : ''}</div>
                        <div class="rank-song">${escapeHtml(row.song_name || 'UNKNOWN')}</div>
                    </div>
                    <div class="rank-score">${Number(row.score || 0).toLocaleString()}</div>
                </div>`;
            }).join('');
            setRankStatus('Updated just now · Top ' + data.length);
        } catch (err) {
            console.error('loading leaderboard failed:', err);
            const data = mergeBestScores(readLocalBoard());
            if (!data.length) {
                listContainer.innerHTML = '<div class="empty-state">Cloud ranking unavailable. Play a song and try again.</div>';
                setRankStatus('Sync failed');
                return;
            }
            const me = getPlayerName();
            listContainer.innerHTML = data.map((row, index) => {
                const isMe = me && row.player_name === me;
                return `<div class="rank-row${isMe ? ' me' : ''}">
                    <div class="rank-pos">${index + 1}</div>
                    <div>
                        <div class="rank-name">${escapeHtml(row.player_name || 'UNKNOWN')}${isMe ? ' · YOU' : ''}</div>
                        <div class="rank-song">${escapeHtml(row.song_name || 'UNKNOWN')}</div>
                    </div>
                    <div class="rank-score">${Number(row.score || 0).toLocaleString()}</div>
                </div>`;
            }).join('');
            setRankStatus('Showing local ranking · cloud sync pending');
        }
    }

    async function uploadScoreToCloud(playerName, songName, score) {
        const payload = {
            player_name: playerName,
            song_name: songName,
            score: Number(score) || 0
        };
        const localRows = readLocalBoard();
        localRows.push(payload);
        writeLocalBoard(localRows);

        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('leaderboard')
                .insert([payload]);
            if (error) {
                console.error('Supabase upload error:', error);
                throw error;
            }
        }
        return true;
    }


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
        // Hyunsuk (20 cards)
        { id: 'hyunsuk_1', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_1.jpg', rarity: 'R' },
        { id: 'hyunsuk_2', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_2.jpg', rarity: 'R' },
        { id: 'hyunsuk_3', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_3.jpg', rarity: 'SR' },
        { id: 'hyunsuk_4', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_4.jpg', rarity: 'SR' },
        { id: 'hyunsuk_5', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_5.jpg', rarity: 'SSR' },
        { id: 'hyunsuk_6', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_6.jpg', rarity: 'SSR' },
        { id: 'hyunsuk_7', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_7.jpg', rarity: 'UR' },
        { id: 'hyunsuk_8', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_8.jpg', rarity: 'UR' },
        { id: 'hyunsuk_9', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_9.jpg', rarity: 'UR' },
        { id: 'hyunsuk_10', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_10.jpg', rarity: 'UR' },
        { id: 'hyunsuk_11', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_11.jpg', rarity: 'R' },
        { id: 'hyunsuk_12', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_12.jpg', rarity: 'R' },
        { id: 'hyunsuk_13', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_13.jpg', rarity: 'SR' },
        { id: 'hyunsuk_14', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_14.jpg', rarity: 'SR' },
        { id: 'hyunsuk_15', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_15.jpg', rarity: 'SSR' },
        { id: 'hyunsuk_16', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_16.jpg', rarity: 'SSR' },
        { id: 'hyunsuk_17', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_17.jpg', rarity: 'UR' },
        { id: 'hyunsuk_18', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_18.jpg', rarity: 'UR' },
        { id: 'hyunsuk_19', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_19.jpg', rarity: 'UR' },
        { id: 'hyunsuk_20', name: 'Hyunsuk', group: 'hyunsuk', img: './photocards/hyunsuk_20.jpg', rarity: 'UR' },

        // Jihoon (20 cards)
        { id: 'jihoon_1', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_1.jpg', rarity: 'R' },
        { id: 'jihoon_2', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_2.jpg', rarity: 'R' },
        { id: 'jihoon_3', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_3.jpg', rarity: 'SR' },
        { id: 'jihoon_4', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_4.jpg', rarity: 'SR' },
        { id: 'jihoon_5', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_5.jpg', rarity: 'SSR' },
        { id: 'jihoon_6', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_6.jpg', rarity: 'SSR' },
        { id: 'jihoon_7', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_7.jpg', rarity: 'UR' },
        { id: 'jihoon_8', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_8.jpg', rarity: 'UR' },
        { id: 'jihoon_9', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_9.jpg', rarity: 'UR' },
        { id: 'jihoon_10', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_10.jpg', rarity: 'UR' },
        { id: 'jihoon_11', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_11.jpg', rarity: 'R' },
        { id: 'jihoon_12', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_12.jpg', rarity: 'R' },
        { id: 'jihoon_13', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_13.jpg', rarity: 'SR' },
        { id: 'jihoon_14', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_14.jpg', rarity: 'SR' },
        { id: 'jihoon_15', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_15.jpg', rarity: 'SSR' },
        { id: 'jihoon_16', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_16.jpg', rarity: 'SSR' },
        { id: 'jihoon_17', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_17.jpg', rarity: 'UR' },
        { id: 'jihoon_18', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_18.jpg', rarity: 'UR' },
        { id: 'jihoon_19', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_19.jpg', rarity: 'UR' },
        { id: 'jihoon_20', name: 'Jihoon', group: 'jihoon', img: './photocards/jihoon_20.jpg', rarity: 'UR' },

        // Yoshi (20 cards)
        { id: 'yoshi_1', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_1.jpg', rarity: 'R' },
        { id: 'yoshi_2', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_2.jpg', rarity: 'R' },
        { id: 'yoshi_3', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_3.jpg', rarity: 'SR' },
        { id: 'yoshi_4', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_4.jpg', rarity: 'SR' },
        { id: 'yoshi_5', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_5.jpg', rarity: 'SSR' },
        { id: 'yoshi_6', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_6.jpg', rarity: 'SSR' },
        { id: 'yoshi_7', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_7.jpg', rarity: 'UR' },
        { id: 'yoshi_8', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_8.jpg', rarity: 'UR' },
        { id: 'yoshi_9', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_9.jpg', rarity: 'UR' },
        { id: 'yoshi_10', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_10.jpg', rarity: 'UR' },
        { id: 'yoshi_11', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_11.jpg', rarity: 'R' },
        { id: 'yoshi_12', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_12.jpg', rarity: 'R' },
        { id: 'yoshi_13', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_13.jpg', rarity: 'SR' },
        { id: 'yoshi_14', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_14.jpg', rarity: 'SR' },
        { id: 'yoshi_15', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_15.jpg', rarity: 'SSR' },
        { id: 'yoshi_16', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_16.jpg', rarity: 'SSR' },
        { id: 'yoshi_17', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_17.jpg', rarity: 'UR' },
        { id: 'yoshi_18', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_18.jpg', rarity: 'UR' },
        { id: 'yoshi_19', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_19.jpg', rarity: 'UR' },
        { id: 'yoshi_20', name: 'Yoshi', group: 'yoshi', img: './photocards/yoshi_20.jpg', rarity: 'UR' },

        // Junkyu (20 cards)
        { id: 'junkyu_1', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_1.jpg', rarity: 'R' },
        { id: 'junkyu_2', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_2.jpg', rarity: 'R' },
        { id: 'junkyu_3', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_3.jpg', rarity: 'SR' },
        { id: 'junkyu_4', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_4.jpg', rarity: 'SR' },
        { id: 'junkyu_5', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_5.jpg', rarity: 'SSR' },
        { id: 'junkyu_6', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_6.jpg', rarity: 'SSR' },
        { id: 'junkyu_7', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_7.jpg', rarity: 'UR' },
        { id: 'junkyu_8', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_8.jpg', rarity: 'UR' },
        { id: 'junkyu_9', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_9.jpg', rarity: 'UR' },
        { id: 'junkyu_10', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_10.jpg', rarity: 'UR' },
        { id: 'junkyu_11', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_11.jpg', rarity: 'R' },
        { id: 'junkyu_12', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_12.jpg', rarity: 'R' },
        { id: 'junkyu_13', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_13.jpg', rarity: 'SR' },
        { id: 'junkyu_14', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_14.jpg', rarity: 'SR' },
        { id: 'junkyu_15', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_15.jpg', rarity: 'SSR' },
        { id: 'junkyu_16', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_16.jpg', rarity: 'SSR' },
        { id: 'junkyu_17', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_17.jpg', rarity: 'UR' },
        { id: 'junkyu_18', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_18.jpg', rarity: 'UR' },
        { id: 'junkyu_19', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_19.jpg', rarity: 'UR' },
        { id: 'junkyu_20', name: 'Junkyu', group: 'junkyu', img: './photocards/junkyu_20.jpg', rarity: 'UR' },

        // Jaehyuk (20 cards)
        { id: 'jaehyuk_1', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_1.jpg', rarity: 'R' },
        { id: 'jaehyuk_2', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_2.jpg', rarity: 'R' },
        { id: 'jaehyuk_3', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_3.jpg', rarity: 'SR' },
        { id: 'jaehyuk_4', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_4.jpg', rarity: 'SR' },
        { id: 'jaehyuk_5', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_5.jpg', rarity: 'SSR' },
        { id: 'jaehyuk_6', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_6.jpg', rarity: 'SSR' },
        { id: 'jaehyuk_7', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_7.jpg', rarity: 'UR' },
        { id: 'jaehyuk_8', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_8.jpg', rarity: 'UR' },
        { id: 'jaehyuk_9', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_9.jpg', rarity: 'UR' },
        { id: 'jaehyuk_10', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_10.jpg', rarity: 'UR' },
        { id: 'jaehyuk_11', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_11.jpg', rarity: 'R' },
        { id: 'jaehyuk_12', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_12.jpg', rarity: 'R' },
        { id: 'jaehyuk_13', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_13.jpg', rarity: 'SR' },
        { id: 'jaehyuk_14', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_14.jpg', rarity: 'SR' },
        { id: 'jaehyuk_15', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_15.jpg', rarity: 'SSR' },
        { id: 'jaehyuk_16', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_16.jpg', rarity: 'SSR' },
        { id: 'jaehyuk_17', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_17.jpg', rarity: 'UR' },
        { id: 'jaehyuk_18', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_18.jpg', rarity: 'UR' },
        { id: 'jaehyuk_19', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_19.jpg', rarity: 'UR' },
        { id: 'jaehyuk_20', name: 'Jaehyuk', group: 'jaehyuk', img: './photocards/jaehyuk_20.jpg', rarity: 'UR' },

        // Asahi (20 cards)
        { id: 'asahi_1', name: 'Asahi', group: 'asahi', img: './photocards/asahi_1.jpg', rarity: 'R' },
        { id: 'asahi_2', name: 'Asahi', group: 'asahi', img: './photocards/asahi_2.jpg', rarity: 'R' },
        { id: 'asahi_3', name: 'Asahi', group: 'asahi', img: './photocards/asahi_3.jpg', rarity: 'SR' },
        { id: 'asahi_4', name: 'Asahi', group: 'asahi', img: './photocards/asahi_4.jpg', rarity: 'SR' },
        { id: 'asahi_5', name: 'Asahi', group: 'asahi', img: './photocards/asahi_5.jpg', rarity: 'SSR' },
        { id: 'asahi_6', name: 'Asahi', group: 'asahi', img: './photocards/asahi_6.jpg', rarity: 'SSR' },
        { id: 'asahi_7', name: 'Asahi', group: 'asahi', img: './photocards/asahi_7.jpg', rarity: 'UR' },
        { id: 'asahi_8', name: 'Asahi', group: 'asahi', img: './photocards/asahi_8.jpg', rarity: 'UR' },
        { id: 'asahi_9', name: 'Asahi', group: 'asahi', img: './photocards/asahi_9.jpg', rarity: 'UR' },
        { id: 'asahi_10', name: 'Asahi', group: 'asahi', img: './photocards/asahi_10.jpg', rarity: 'UR' },
        { id: 'asahi_11', name: 'Asahi', group: 'asahi', img: './photocards/asahi_11.jpg', rarity: 'R' },
        { id: 'asahi_12', name: 'Asahi', group: 'asahi', img: './photocards/asahi_12.jpg', rarity: 'R' },
        { id: 'asahi_13', name: 'Asahi', group: 'asahi', img: './photocards/asahi_13.jpg', rarity: 'SR' },
        { id: 'asahi_14', name: 'Asahi', group: 'asahi', img: './photocards/asahi_14.jpg', rarity: 'SR' },
        { id: 'asahi_15', name: 'Asahi', group: 'asahi', img: './photocards/asahi_15.jpg', rarity: 'SSR' },
        { id: 'asahi_16', name: 'Asahi', group: 'asahi', img: './photocards/asahi_16.jpg', rarity: 'SSR' },
        { id: 'asahi_17', name: 'Asahi', group: 'asahi', img: './photocards/asahi_17.jpg', rarity: 'UR' },
        { id: 'asahi_18', name: 'Asahi', group: 'asahi', img: './photocards/asahi_18.jpg', rarity: 'UR' },
        { id: 'asahi_19', name: 'Asahi', group: 'asahi', img: './photocards/asahi_19.jpg', rarity: 'UR' },
        { id: 'asahi_20', name: 'Asahi', group: 'asahi', img: './photocards/asahi_20.jpg', rarity: 'UR' },

        // Doyoung (20 cards)
        { id: 'doyoung_1', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_1.jpg', rarity: 'R' },
        { id: 'doyoung_2', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_2.jpg', rarity: 'R' },
        { id: 'doyoung_3', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_3.jpg', rarity: 'SR' },
        { id: 'doyoung_4', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_4.jpg', rarity: 'SR' },
        { id: 'doyoung_5', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_5.jpg', rarity: 'SSR' },
        { id: 'doyoung_6', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_6.jpg', rarity: 'SSR' },
        { id: 'doyoung_7', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_7.jpg', rarity: 'UR' },
        { id: 'doyoung_8', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_8.jpg', rarity: 'UR' },
        { id: 'doyoung_9', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_9.jpg', rarity: 'UR' },
        { id: 'doyoung_10', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_10.jpg', rarity: 'UR' },
        { id: 'doyoung_11', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_11.jpg', rarity: 'R' },
        { id: 'doyoung_12', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_12.jpg', rarity: 'R' },
        { id: 'doyoung_13', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_13.jpg', rarity: 'SR' },
        { id: 'doyoung_14', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_14.jpg', rarity: 'SR' },
        { id: 'doyoung_15', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_15.jpg', rarity: 'SSR' },
        { id: 'doyoung_16', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_16.jpg', rarity: 'SSR' },
        { id: 'doyoung_17', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_17.jpg', rarity: 'UR' },
        { id: 'doyoung_18', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_18.jpg', rarity: 'UR' },
        { id: 'doyoung_19', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_19.jpg', rarity: 'UR' },
        { id: 'doyoung_20', name: 'Doyoung', group: 'doyoung', img: './photocards/doyoung_20.jpg', rarity: 'UR' },

        // Haruto (20 cards)
        { id: 'haruto_1', name: 'Haruto', group: 'haruto', img: './photocards/haruto_1.jpg', rarity: 'R' },
        { id: 'haruto_2', name: 'Haruto', group: 'haruto', img: './photocards/haruto_2.jpg', rarity: 'R' },
        { id: 'haruto_3', name: 'Haruto', group: 'haruto', img: './photocards/haruto_3.jpg', rarity: 'SR' },
        { id: 'haruto_4', name: 'Haruto', group: 'haruto', img: './photocards/haruto_4.jpg', rarity: 'SR' },
        { id: 'haruto_5', name: 'Haruto', group: 'haruto', img: './photocards/haruto_5.jpg', rarity: 'SSR' },
        { id: 'haruto_6', name: 'Haruto', group: 'haruto', img: './photocards/haruto_6.jpg', rarity: 'SSR' },
        { id: 'haruto_7', name: 'Haruto', group: 'haruto', img: './photocards/haruto_7.jpg', rarity: 'UR' },
        { id: 'haruto_8', name: 'Haruto', group: 'haruto', img: './photocards/haruto_8.jpg', rarity: 'UR' },
        { id: 'haruto_9', name: 'Haruto', group: 'haruto', img: './photocards/haruto_9.jpg', rarity: 'UR' },
        { id: 'haruto_10', name: 'Haruto', group: 'haruto', img: './photocards/haruto_10.jpg', rarity: 'UR' },
        { id: 'haruto_11', name: 'Haruto', group: 'haruto', img: './photocards/haruto_11.jpg', rarity: 'R' },
        { id: 'haruto_12', name: 'Haruto', group: 'haruto', img: './photocards/haruto_12.jpg', rarity: 'R' },
        { id: 'haruto_13', name: 'Haruto', group: 'haruto', img: './photocards/haruto_13.jpg', rarity: 'SR' },
        { id: 'haruto_14', name: 'Haruto', group: 'haruto', img: './photocards/haruto_14.jpg', rarity: 'SR' },
        { id: 'haruto_15', name: 'Haruto', group: 'haruto', img: './photocards/haruto_15.jpg', rarity: 'SSR' },
        { id: 'haruto_16', name: 'Haruto', group: 'haruto', img: './photocards/haruto_16.jpg', rarity: 'SSR' },
        { id: 'haruto_17', name: 'Haruto', group: 'haruto', img: './photocards/haruto_17.jpg', rarity: 'UR' },
        { id: 'haruto_18', name: 'Haruto', group: 'haruto', img: './photocards/haruto_18.jpg', rarity: 'UR' },
        { id: 'haruto_19', name: 'Haruto', group: 'haruto', img: './photocards/haruto_19.jpg', rarity: 'UR' },
        { id: 'haruto_20', name: 'Haruto', group: 'haruto', img: './photocards/haruto_20.jpg', rarity: 'UR' },

        // Jeongwoo (20 cards)
        { id: 'jeongwoo_1', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_1.jpg', rarity: 'R' },
        { id: 'jeongwoo_2', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_2.jpg', rarity: 'R' },
        { id: 'jeongwoo_3', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_3.jpg', rarity: 'SR' },
        { id: 'jeongwoo_4', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_4.jpg', rarity: 'SR' },
        { id: 'jeongwoo_5', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_5.jpg', rarity: 'SSR' },
        { id: 'jeongwoo_6', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_6.jpg', rarity: 'SSR' },
        { id: 'jeongwoo_7', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_7.jpg', rarity: 'UR' },
        { id: 'jeongwoo_8', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_8.jpg', rarity: 'UR' },
        { id: 'jeongwoo_9', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_9.jpg', rarity: 'UR' },
        { id: 'jeongwoo_10', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_10.jpg', rarity: 'UR' },
        { id: 'jeongwoo_11', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_11.jpg', rarity: 'R' },
        { id: 'jeongwoo_12', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_12.jpg', rarity: 'R' },
        { id: 'jeongwoo_13', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_13.jpg', rarity: 'SR' },
        { id: 'jeongwoo_14', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_14.jpg', rarity: 'SR' },
        { id: 'jeongwoo_15', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_15.jpg', rarity: 'SSR' },
        { id: 'jeongwoo_16', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_16.jpg', rarity: 'SSR' },
        { id: 'jeongwoo_17', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_17.jpg', rarity: 'UR' },
        { id: 'jeongwoo_18', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_18.jpg', rarity: 'UR' },
        { id: 'jeongwoo_19', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_19.jpg', rarity: 'UR' },
        { id: 'jeongwoo_20', name: 'Jeongwoo', group: 'jeongwoo', img: './photocards/jeongwoo_20.jpg', rarity: 'UR' },

        // Junghwan (20 cards)
        { id: 'junghwan_1', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_1.jpg', rarity: 'R' },
        { id: 'junghwan_2', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_2.jpg', rarity: 'R' },
        { id: 'junghwan_3', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_3.jpg', rarity: 'SR' },
        { id: 'junghwan_4', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_4.jpg', rarity: 'SR' },
        { id: 'junghwan_5', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_5.jpg', rarity: 'SSR' },
        { id: 'junghwan_6', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_6.jpg', rarity: 'SSR' },
        { id: 'junghwan_7', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_7.jpg', rarity: 'UR' },
        { id: 'junghwan_8', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_8.jpg', rarity: 'UR' },
        { id: 'junghwan_9', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_9.jpg', rarity: 'UR' },
        { id: 'junghwan_10', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_10.jpg', rarity: 'UR' },
        { id: 'junghwan_11', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_11.jpg', rarity: 'R' },
        { id: 'junghwan_12', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_12.jpg', rarity: 'R' },
        { id: 'junghwan_13', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_13.jpg', rarity: 'SR' },
        { id: 'junghwan_14', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_14.jpg', rarity: 'SR' },
        { id: 'junghwan_15', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_15.jpg', rarity: 'SSR' },
        { id: 'junghwan_16', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_16.jpg', rarity: 'SSR' },
        { id: 'junghwan_17', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_17.jpg', rarity: 'UR' },
        { id: 'junghwan_18', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_18.jpg', rarity: 'UR' },
        { id: 'junghwan_19', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_19.jpg', rarity: 'UR' },
        { id: 'junghwan_20', name: 'Junghwan', group: 'junghwan', img: './photocards/junghwan_20.jpg', rarity: 'UR' },

        // UNIT Cards (40 cards)
        { id: 'unit_1', name: 'UNIT 1', group: 'unit', img: './photocards/duo_1.jpg', rarity: 'SR' },
        { id: 'unit_2', name: 'UNIT 2', group: 'unit', img: './photocards/duo_2.jpg', rarity: 'SR' },
        { id: 'unit_3', name: 'UNIT 3', group: 'unit', img: './photocards/duo_3.jpg', rarity: 'SR' },
        { id: 'unit_4', name: 'UNIT 4', group: 'unit', img: './photocards/duo_4.jpg', rarity: 'SR' },
        { id: 'unit_5', name: 'UNIT 5', group: 'unit', img: './photocards/duo_5.jpg', rarity: 'SR' },
        { id: 'unit_6', name: 'UNIT 6', group: 'unit', img: './photocards/duo_6.jpg', rarity: 'SSR' },
        { id: 'unit_7', name: 'UNIT 7', group: 'unit', img: './photocards/duo_7.jpg', rarity: 'SSR' },
        { id: 'unit_8', name: 'UNIT 8', group: 'unit', img: './photocards/duo_8.jpg', rarity: 'SSR' },
        { id: 'unit_9', name: 'UNIT 9', group: 'unit', img: './photocards/duo_9.jpg', rarity: 'SSR' },
        { id: 'unit_10', name: 'UNIT 10', group: 'unit', img: './photocards/duo_10.jpg', rarity: 'SSR' },
        { id: 'unit_11', name: 'UNIT 11', group: 'unit', img: './photocards/duo_11.jpg', rarity: 'SSR' },
        { id: 'unit_12', name: 'UNIT 12', group: 'unit', img: './photocards/duo_12.jpg', rarity: 'SSR' },
        { id: 'unit_13', name: 'UNIT 13', group: 'unit', img: './photocards/duo_13.jpg', rarity: 'SSR' },
        { id: 'unit_14', name: 'UNIT 14', group: 'unit', img: './photocards/duo_14.jpg', rarity: 'UR' },
        { id: 'unit_15', name: 'UNIT 15', group: 'unit', img: './photocards/duo_15.jpg', rarity: 'UR' },
        { id: 'unit_16', name: 'UNIT 16', group: 'unit', img: './photocards/duo_16.jpg', rarity: 'UR' },
        { id: 'unit_17', name: 'UNIT 17', group: 'unit', img: './photocards/duo_17.jpg', rarity: 'UR' },
        { id: 'unit_18', name: 'UNIT 18', group: 'unit', img: './photocards/duo_18.jpg', rarity: 'UR' },
        { id: 'unit_19', name: 'UNIT 19', group: 'unit', img: './photocards/duo_19.jpg', rarity: 'UR' },
        { id: 'unit_20', name: 'UNIT 20', group: 'unit', img: './photocards/duo_20.jpg', rarity: 'UR' },
        { id: 'unit_21', name: 'UNIT 21', group: 'unit', img: './photocards/duo_21.jpg', rarity: 'UR' },
        { id: 'unit_22', name: 'UNIT 22', group: 'unit', img: './photocards/duo_22.jpg', rarity: 'UR' },
        { id: 'unit_23', name: 'UNIT 23', group: 'unit', img: './photocards/duo_23.jpg', rarity: 'UR' },
        { id: 'unit_24', name: 'UNIT 24', group: 'unit', img: './photocards/duo_24.jpg', rarity: 'UR' },
        { id: 'unit_25', name: 'UNIT 25', group: 'unit', img: './photocards/duo_25.jpg', rarity: 'SSR' },
        { id: 'unit_26', name: 'UNIT 26', group: 'unit', img: './photocards/duo_26.jpg', rarity: 'SSR' },
        { id: 'unit_27', name: 'UNIT 27', group: 'unit', img: './photocards/duo_27.jpg', rarity: 'SSR' },
        { id: 'unit_28', name: 'UNIT 28', group: 'unit', img: './photocards/duo_28.jpg', rarity: 'UR' },
        { id: 'unit_29', name: 'UNIT 29', group: 'unit', img: './photocards/duo_29.jpg', rarity: 'UR' },
        { id: 'unit_30', name: 'UNIT 30', group: 'unit', img: './photocards/duo_30.jpg', rarity: 'UR' },
        { id: 'unit_31', name: 'UNIT 31', group: 'unit', img: './photocards/duo_31.jpg', rarity: 'SR' },
        { id: 'unit_32', name: 'UNIT 32', group: 'unit', img: './photocards/duo_32.jpg', rarity: 'SR' },
        { id: 'unit_33', name: 'UNIT 33', group: 'unit', img: './photocards/duo_33.jpg', rarity: 'SSR' },
        { id: 'unit_34', name: 'UNIT 34', group: 'unit', img: './photocards/duo_34.jpg', rarity: 'SSR' },
        { id: 'unit_35', name: 'UNIT 35', group: 'unit', img: './photocards/duo_35.jpg', rarity: 'UR' },
        { id: 'unit_36', name: 'UNIT 36', group: 'unit', img: './photocards/duo_36.jpg', rarity: 'UR' },
        { id: 'unit_37', name: 'UNIT 37', group: 'unit', img: './photocards/duo_37.jpg', rarity: 'UR' },
        { id: 'unit_38', name: 'UNIT 38', group: 'unit', img: './photocards/duo_38.jpg', rarity: 'UR' },
        { id: 'unit_39', name: 'UNIT 39', group: 'unit', img: './photocards/duo_39.jpg', rarity: 'UR' },
        { id: 'unit_40', name: 'UNIT 40', group: 'unit', img: './photocards/duo_40.jpg', rarity: 'UR' }];

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
            this.stageHitbox = document.getElementById('stage-hitbox');

            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            window.addEventListener('orientationchange', () => setTimeout(() => this.resizeCanvas(), 120));

            this.setupEventListeners();
            this.setupTouchControls();
            this.renderSongList();
            this.renderSongDetail();
            this.setupLobbyTabs();
            this.injectCollectionUI();
            this.updateHomeGemsDisplay();
            updatePlayerChip();
            this.renderStorePage();
            this.renderAlbumPage();
            this.updateFeaturedBanner();
            if (!getPlayerName()) showNameModal();

            this.loop = this.loop.bind(this);
        }

        updateHomeGemsDisplay() {
            const gemsEl = document.getElementById('home-gems-display');
            if (gemsEl) {
                const currentGems = parseInt(localStorage.getItem('player_gems') || '1000', 10);
                gemsEl.textContent = currentGems.toLocaleString();
            }
        }

        setupLobbyTabs() {
            const tabbar = document.getElementById('bottom-tabbar');
            if (!tabbar || tabbar.dataset.bound === '1') return;
            tabbar.dataset.bound = '1';
            tabbar.addEventListener('click', (e) => {
                const btn = e.target.closest('.tab-btn');
                if (!btn) return;
                this.sound.playClick();
                this.switchLobbyTab(btn.dataset.tab);
            });

            const refreshBtn = document.getElementById('refresh-leaderboard-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    this.sound.playClick();
                    fetchAndRenderLeaderboard();
                });
            }

            const playerChip = document.getElementById('player-chip');
            if (playerChip) {
                playerChip.addEventListener('click', () => {
                    this.sound.playClick();
                    showNameModal();
                });
            }

            const saveNameBtn = document.getElementById('save-name-btn');
            if (saveNameBtn && !saveNameBtn.dataset.bound) {
                saveNameBtn.dataset.bound = '1';
                saveNameBtn.addEventListener('click', () => {
                    const inputVal = (document.getElementById('player-name-input').value || '').trim();
                    if (!inputVal) {
                        alert('please input a player name!');
                        return;
                    }
                    localStorage.setItem('player_id_name', inputVal);
                    hideNameModal();
                    updatePlayerChip();
                    this.sound.playClick();
                });
            }
        }

        switchLobbyTab(tab) {
            const target = tab || 'songs';
            document.querySelectorAll('.tab-btn').forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.tab === target);
            });
            document.querySelectorAll('.lobby-page').forEach((page) => {
                page.classList.toggle('active', page.dataset.tab === target);
            });
            if (target === 'rank') fetchAndRenderLeaderboard();
            if (target === 'store') this.renderStorePage();
            if (target === 'album') this.renderAlbumPage();
            if (target === 'songs') this.updateFeaturedBanner();
        }

        updateFeaturedBanner() {
            const song = this.currentSong || SONG_LIST[0];
            if (!song) return;
            const art = document.getElementById('featured-art');
            const title = document.getElementById('featured-title');
            const artist = document.getElementById('featured-artist');
            if (art) {
                art.style.backgroundImage = `linear-gradient(180deg, rgba(5,6,12,0.08), rgba(5,6,12,0.78)), url('${song.detailImg || song.coverImg}')`;
            }
            if (title) title.textContent = song.name;
            if (artist) artist.textContent = song.artist + '  ·  LIVE STAGE';
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
            this.updateFeaturedBanner();
            if (this.startBtn) {
                this.startBtn.disabled = false;
                this.startBtn.innerHTML = '<span class="btn-text">START LIVE</span>';
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
            const box = this.canvas.parentElement.getBoundingClientRect();
            const cssW = Math.max(1, Math.round(box.width || window.innerWidth));
            const cssH = Math.max(1, Math.round(box.height || window.innerHeight));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.canvas.style.width = cssW + 'px';
            this.canvas.style.height = cssH + 'px';
            this.canvas.width = Math.round(cssW * dpr);
            this.canvas.height = Math.round(cssH * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.width = cssW;
            this.height = cssH;

            const landscape = cssW > cssH;
            const desktop = cssW >= 900;
            if (landscape) {
                this.trackAreaWidth = Math.min(cssW * 0.62, desktop ? 720 : 560);
                this.judgeLineY = cssH * 0.78;
            } else {
                this.trackAreaWidth = Math.min(cssW * 0.96, desktop ? 430 : cssW * 0.96);
                this.judgeLineY = cssH * this.CONFIG.JUDGE_LINE_Y_RATIO;
            }
            this.trackAreaLeft = (cssW - this.trackAreaWidth) / 2;
            this.trackWidth = this.trackAreaWidth / this.CONFIG.TRACK_COUNT;
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

            const hitTarget = this.stageHitbox || this.canvas;
            hitTarget.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const idx = handleTouchInput(e.changedTouches[i].clientX - rect.left);
                    if (idx !== -1 && !this.trackPressState[idx]) this.pressTrack(idx);
                }
            }, { passive: false });

            hitTarget.addEventListener('touchend', (e) => {
                e.preventDefault();
                for (let i = 0; i < 4; i++) this.releaseTrack(i);
            }, { passive: false });

            hitTarget.addEventListener('mousedown', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const idx = handleTouchInput(e.clientX - rect.left);
                if (idx !== -1 && !this.trackPressState[idx]) this.pressTrack(idx);
            });
            hitTarget.addEventListener('mouseup', (e) => {
                for (let i = 0; i < 4; i++) this.releaseTrack(i);
            });
        }

        setStageLive(live) {
            if (this.stageHitbox) this.stageHitbox.classList.toggle('active', !!live);
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
            this.startScreen.classList.remove('hidden');
            this.setStageLive(false);
            this.updateHomeGemsDisplay();
            this.switchLobbyTab('songs');
            this.renderSongList();
            this.updateFeaturedBanner();
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
            if (!getPlayerName()) {
                showNameModal();
                return;
            }
            this.loadSongMedia(this.currentSong);
            this.startScreen.classList.add('hidden');
            this.endScreen.classList.add('hidden');
            this.pauseOverlay.classList.add('hidden');
            this.gameUiEl.classList.remove('hidden');
            this.setStageLive(true);

            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.stats = { perfect: 0, great: 0, good: 0, miss: 0 };
            this.floatingTexts = [];
            if (this.scoreEl) this.scoreEl.textContent = '0';

            this.audio.onloadedmetadata = () => {
                if (this.video.src) this.video.play().catch(() => { });
                this.audio.currentTime = 0;
                this.audio.play().catch(() => { });

                this.generateNotesByMode();

                this.isPlaying = true;
                this.isPaused = false;
                this.isEnded = false;
                this.startTime = performance.now();
                this.lastTimestamp = this.startTime;
                requestAnimationFrame(this.loop);
            };

            if (this.audio.readyState >= 1) {
                this.audio.onloadedmetadata();
            }
        }

        pressTrack(trackIdx) {
            if (!this.isPlaying || this.isPaused) return;
            this.trackPressState[trackIdx] = true;

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

            this.submitScoreToCloud();

            if (this.endScreen) this.endScreen.classList.remove('hidden');
        }

        async submitScoreToCloud() {
            const statusEl = document.getElementById('upload-status');
            const playerName = getPlayerName();
            const songName = this.currentSong ? (this.currentSong.name || this.currentSong.id) : 'Unknown Song';
            const score = this.score || 0;
            if (statusEl) statusEl.textContent = 'Uploading score to cloud ranking...';
            if (!playerName) {
                if (statusEl) statusEl.textContent = 'Set a stage name to upload your score.';
                showNameModal();
                return;
            }
            try {
                await uploadScoreToCloud(playerName, songName, score);
                if (statusEl) statusEl.textContent = 'Cloud ranking updated: ' + score.toLocaleString() + ' pts';
            } catch (err) {
                console.error('上传排行榜失败:', err);
                if (statusEl) statusEl.textContent = 'Score saved locally. Cloud upload failed.';
            }
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
            const endCard = document.querySelector('.result-card') || this.endScreen;
            if (endCard && !document.getElementById('card-drop-result')) {
                const dropDiv = document.createElement('div');
                dropDiv.id = 'card-drop-result';
                endCard.appendChild(dropDiv);
            }
        }

        renderAlbumPage() {
            const grid = document.getElementById('album-grid');
            const progress = document.getElementById('album-progress');
            if (!grid) return;
            const myCards = JSON.parse(localStorage.getItem('my_photocards') || '[]');
            const currentBias = localStorage.getItem('my_bias') || '';
            if (progress) progress.textContent = myCards.length + ' / ' + PHOTO_CARDS.length + ' cards collected';
            grid.innerHTML = PHOTO_CARDS.map((card) => {
                const owned = myCards.includes(card.id);
                const isBias = currentBias === card.id;
                return `<div class="album-card${owned ? '' : ' locked'}">
                    <img src="${card.img}" alt="${escapeHtml(card.name)}" onerror="this.style.opacity='0.2'">
                    <div class="name">${escapeHtml(card.name)}${isBias ? ' · BIAS' : ''}</div>
                    <div class="rarity">${card.rarity}</div>
                    ${owned ? `<button class="set-bias-btn" data-id="${card.id}">${isBias ? 'BIAS' : 'SET BIAS'}</button>` : '<div class="rarity">LOCKED</div>'}
                </div>`;
            }).join('');
            grid.querySelectorAll('.set-bias-btn').forEach((btn) => {
                btn.addEventListener('click', () => {
                    localStorage.setItem('my_bias', btn.dataset.id);
                    this.sound.playClick();
                    this.renderAlbumPage();
                });
            });
        }

        renderStorePage() {
            const panel = document.getElementById('store-panel');
            if (!panel) return;
            const gems = parseInt(localStorage.getItem('player_gems') || '1000', 10);
            panel.innerHTML = `
                <div class="gacha-hero">
                    <h3>TREASURE GACHA</h3>
                    <p>100 diamonds per draw. Highest rarity cards can drop on any pull.</p>
                    <div class="gems-chip" style="margin: 0 0 14px; width: fit-content;">
                        <span class="gem-icon"></span>
                        <span>${gems.toLocaleString()}</span>
                    </div>
                    <button id="buy-single-btn" class="btn primary" type="button">DRAW  ·  100</button>
                    <div id="shop-draw-result" class="draw-result"></div>
                </div>
            `;
            const buyBtn = panel.querySelector('#buy-single-btn');
            buyBtn.addEventListener('click', () => {
                let currentGems = parseInt(localStorage.getItem('player_gems') || '1000', 10);
                if (currentGems < 100) {
                    alert('Not enough diamonds! Play songs to earn more!');
                    return;
                }
                currentGems -= 100;
                localStorage.setItem('player_gems', currentGems.toString());
                this.updateHomeGemsDisplay();
                this.sound.playClick();
                const randomCard = PHOTO_CARDS[Math.floor(Math.random() * PHOTO_CARDS.length)];
                let myCards = JSON.parse(localStorage.getItem('my_photocards') || '[]');
                const isNew = !myCards.includes(randomCard.id);
                if (isNew) {
                    myCards.push(randomCard.id);
                    localStorage.setItem('my_photocards', JSON.stringify(myCards));
                }
                const resultDiv = panel.querySelector('#shop-draw-result');
                resultDiv.innerHTML = `
                    <img src="${randomCard.img}" style="width:92px;height:124px;object-fit:cover;border-radius:8px;border:1px solid rgba(232,197,107,0.5);">
                    <div style="margin-top:8px;font-weight:800;">${escapeHtml(randomCard.name)} [${randomCard.rarity}] ${isNew ? 'NEW' : ''}</div>
                `;
                this.renderAlbumPage();
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
                const trackX = this.trackAreaLeft + note.track * this.trackWidth;
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