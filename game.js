// game.js - Version 2026.09.13-BabyMonster
(function () {
    'use strict';

    const SONG_LIST = [
        { id: 'sheesh', name: 'SHEESH', artist: 'BABYMONSTER', cover: '💥', coverBg: 'linear-gradient(135deg, #ff0055, #6600cc)', coverImg: './covers/sheesh_small.jpg', detailImg: './covers/sheesh_big.jpg', video: './songs/sheesh.mp4', audio: './songs/sheesh.mp3' },
        { id: 'batter_up', name: 'BATTER UP', artist: 'BABYMONSTER', cover: '⚾', coverBg: 'linear-gradient(135deg, #0055ff, #00e5ff)', coverImg: './covers/batter_up_small.jpg', detailImg: './covers/batter_up_big.jpg', video: './songs/batter_up.mp4', audio: './songs/batter_up.mp3' },
        { id: 'stuck_in_the_middle', name: 'STUCK IN THE MIDDLE', artist: 'BABYMONSTER', cover: '💫', coverBg: 'linear-gradient(135deg, #ffaa00, #ff2266)', coverImg: './covers/stuck_small.jpg', detailImg: './covers/stuck_big.jpg', video: './songs/stuck.mp4', audio: './songs/stuck.mp3' },
        { id: 'forever', name: 'FOREVER', artist: 'BABYMONSTER', cover: '👑', coverBg: 'linear-gradient(135deg, #00ffcc, #0066ff)', coverImg: './covers/forever_small.jpg', detailImg: './covers/forever_big.jpg', video: './songs/forever.mp4', audio: './songs/forever.mp3' },
        { id: 'like_that', name: 'LIKE THAT', artist: 'BABYMONSTER', cover: '🔥', coverBg: 'linear-gradient(135deg, #ff2200, #880000)', coverImg: './covers/like_that_small.jpg', detailImg: './covers/like_that_big.jpg', video: './songs/like_that.mp4', audio: './songs/like_that.mp3' },
        { id: 'click_clack', name: 'CLICK CLACK', artist: 'BABYMONSTER', cover: '🎤', coverBg: 'linear-gradient(135deg, #333333, #000000)', coverImg: './covers/click_clack_small.jpg', detailImg: './covers/click_clack_big.jpg', video: './songs/click_clack.mp4', audio: './songs/click_clack.mp3' },
        { id: 'drip', name: 'DRIP', artist: 'BABYMONSTER', cover: '💧', coverBg: 'linear-gradient(135deg, #0099ff, #0022aa)', coverImg: './covers/drip_small.jpg', detailImg: './covers/drip_big.jpg', video: './songs/drip.mp4', audio: './songs/drip.mp3' }
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
            this.loop = this.loop.bind(this);
        }

        renderSongList() {
            if (!this.songListEl) return;
            this.songListEl.innerHTML = '';
            SONG_LIST.forEach(song => {
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
                this.songDetailEl.innerHTML = `<div class="no-song-placeholder" style="color: rgba(255,255,255,0.5); padding: 30px 0;">请先选择歌曲</div>`;
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
                if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
                    if (this.isPlaying) this.togglePause();
                    return;
                }
                if (this.isPaused) return;
                const trackIdx = KEY_MAP.indexOf(e.key.toLowerCase());
                if (trackIdx !== -1 && !this.trackPressState[trackIdx]) this.pressTrack(trackIdx);
            });
            document.addEventListener('keyup', (e) => {
                const trackIdx = KEY_MAP.indexOf(e.key.toLowerCase());
                if (trackIdx !== -1) this.releaseTrack(trackIdx);
            });
            this.startBtn.addEventListener('click', () => { this.sound.playStart(); this.startGame(); });
            this.retryBtn.addEventListener('click', () => { this.sound.playStart(); this.startGame(); });
            this.pauseBtn.addEventListener('click', () => this.togglePause());
            this.resumeBtn.addEventListener('click', () => this.togglePause());
            this.restartInGameBtn.addEventListener('click', () => { this.togglePause(); this.sound.playStart(); this.startGame(); });
            this.homeBtn.addEventListener('click', () => this.goHome());

            const resultHomeBtn = document.getElementById('result-home-btn');
            if (resultHomeBtn) resultHomeBtn.addEventListener('click', () => this.goHome());

            this.audio.addEventListener('ended', () => {
                if (this.isPlaying && !this.isEnded) this.endGame();
            });
        }

        setupTouchControls() {
            const handleTouchInput = (clientX) => {
                if (!this.isPlaying || this.isPaused) return;
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
                if (idx !== -1) this.pressTrack(idx);
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

        endGame() {
            if (this.isEnded) return;
            this.isEnded = true;
            this.isPlaying = false;
            try { this.audio.pause(); } catch (e) { }
            try { this.video.pause(); } catch (e) { }
            this.gameUiEl.classList.add('hidden');
            this.updateResultScreen();
            if (this.endScreen) this.endScreen.classList.remove('hidden');
        }

        updateResultScreen() {
            const totalNotes = this.stats.perfect + this.stats.great + this.stats.good + this.stats.miss;
            const accuracy = totalNotes > 0 ? Math.round(((this.stats.perfect * 1 + this.stats.great * 0.8 + this.stats.good * 0.5) / totalNotes) * 100) : 0;
            let rank = accuracy >= 95 ? 'S' : accuracy >= 85 ? 'A' : accuracy >= 75 ? 'B' : accuracy >= 60 ? 'C' : 'D';

            const storageKey = `high_score_${this.currentSong ? this.currentSong.id : 'default'}_${this.selectedMode}`;
            const previousBest = parseInt(localStorage.getItem(storageKey) || '0', 10);
            if (this.score > previousBest) localStorage.setItem(storageKey, this.score.toString());
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

    window.addEventListener('load', () => { window._game = new Game(); });
})();