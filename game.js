(function () {
    'use strict';

    const SONG_LIST = [
        {
            id: 'demo1',
            name: 'BONA BONA',
            artist: 'TREASURE',
            cover: '💎',
            coverBg: 'linear-gradient(135deg, #00aaff, #0066ff)',
            video: 'https://www.w3schools.com/html/mov_bbb.mp4',
            audio: 'https://www.w3schools.com/html/horse.mp3',
            bpm: 90,
            duration: '1:00',
            difficulty: 'normal',
            noteSpeed: 320,
        },
        {
            id: 'demo2',
            name: 'HELLO',
            artist: 'TREASURE',
            cover: '🌟',
            coverBg: 'linear-gradient(135deg, #ffaa00, #ff6600)',
            video: 'treasure_hello_mv.mp4',
            audio: 'treasure_hello_song.mp3',
            bpm: 105,
            duration: '3:20',
            difficulty: 'easy',
            noteSpeed: 300,
        },
        {
            id: 'demo3',
            name: 'JIKJIN',
            artist: 'TREASURE',
            cover: '⚡',
            coverBg: 'linear-gradient(135deg, #ff4466, #cc0033)',
            video: 'treasure_jikjin_mv.mp4',
            audio: 'treasure_jikjin_song.mp3',
            bpm: 120,
            duration: '3:05',
            difficulty: 'hard',
            noteSpeed: 380,
        },
        {
            id: 'demo4',
            name: 'MY TREASURE',
            artist: 'TREASURE',
            cover: '🌈',
            coverBg: 'linear-gradient(135deg, #aa66ff, #6600cc)',
            video: 'treasure_mytreasure_mv.mp4',
            audio: 'treasure_mytreasure_song.mp3',
            bpm: 110,
            duration: '3:30',
            difficulty: 'normal',
            noteSpeed: 340,
        },
        {
            id: 'demo5',
            name: 'DARARI',
            artist: 'TREASURE',
            cover: '💜',
            coverBg: 'linear-gradient(135deg, #66aaff, #3344cc)',
            video: 'treasure_darari_mv.mp4',
            audio: 'treasure_darari_song.mp3',
            bpm: 85,
            duration: '3:40',
            difficulty: 'easy',
            noteSpeed: 290,
        },
        {
            id: 'demo6',
            name: 'LOVE SCENARIO',
            artist: 'TREASURE (Cover)',
            cover: '🎭',
            coverBg: 'linear-gradient(135deg, #44ddaa, #11aa66)',
            video: 'treasure_love_scenario_mv.mp4',
            audio: 'treasure_love_scenario_song.mp3',
            bpm: 128,
            duration: '3:30',
            difficulty: 'expert',
            noteSpeed: 420,
        },
    ];

    const CONFIG_BASE = {
        TRACK_COUNT: 4,
        NOTE_SPEED: 320,
        JUDGE_LINE_Y_RATIO: 0.85,
        TRACK_WIDTH_RATIO: 0.5,
        PERFECT_WINDOW: 60,
        GREAT_WINDOW: 120,
        GOOD_WINDOW: 180,
        MISS_WINDOW: 220,
        PERFECT_SCORE: 300,
        GREAT_SCORE: 200,
        GOOD_SCORE: 100,
        HOLD_TICK_SCORE: 10,
        COMBO_BONUS_THRESHOLD: 10,
    };

    const KEY_MAP = ['d', 'f', 'j', 'k'];
    const TRACK_COLORS = [
        ['#ff4d6d', '#ff0055'],
        ['#4dffff', '#00ccff'],
        ['#ffaa4d', '#ff6600'],
        ['#8a4dff', '#6600ff'],
    ];

    const GRADE_THRESHOLDS = [
        { grade: 'S', minAcc: 95 },
        { grade: 'A', minAcc: 85 },
        { grade: 'B', minAcc: 70 },
        { grade: 'C', minAcc: 50 },
        { grade: 'D', minAcc: 0 },
    ];

    class Game {
        constructor() {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.video = document.getElementById('bg-video');
            this.audio = document.getElementById('bg-music');

            this.CONFIG = { ...CONFIG_BASE };
            this.currentSong = null;

            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());

            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.gameTime = 0;
            this.startTime = 0;
            this.lastTimestamp = 0;
            this.isPlaying = false;
            this.isEnded = false;

            this.stats = {
                perfect: 0,
                great: 0,
                good: 0,
                miss: 0,
            };

            this.notes = [];
            this.particles = [];
            this.holdEffects = [];
            this.trackPressState = [false, false, false, false];
            this.trackFlashState = [0, 0, 0, 0];

            this.scoreEl = document.getElementById('score-value');
            this.comboEl = document.getElementById('combo-display');
            this.comboValueEl = document.getElementById('combo-value');
            this.judgeEl = document.getElementById('judge-display');
            this.judgeTextEl = document.getElementById('judge-text');
            this.startScreen = document.getElementById('start-screen');
            this.startBtn = document.getElementById('start-btn');
            this.endScreen = document.getElementById('end-screen');
            this.retryBtn = document.getElementById('retry-btn');
            this.songListEl = document.getElementById('song-list');
            this.songDetailEl = document.getElementById('song-detail');

            this.activeTouches = new Map();

            this.setupEventListeners();
            this.renderSongList();
            this.generateDemoNotes();
            this.loop = this.loop.bind(this);
        }

        renderSongList() {
            this.songListEl.innerHTML = '';
            SONG_LIST.forEach(song => {
                const card = document.createElement('div');
                card.className = 'song-card';
                card.dataset.songId = song.id;

                const diffClass = 'diff-' + song.difficulty;
                const diffText = song.difficulty.toUpperCase();

                card.innerHTML = `
                    <div class="song-cover" style="background: ${song.coverBg}">
                        ${song.cover}
                    </div>
                    <div class="song-info">
                        <div class="song-name">${song.name}</div>
                        <div class="song-artist">${song.artist}</div>
                        <div class="song-meta">
                            <span class="difficulty-badge ${diffClass}">${diffText}</span>
                            <span class="song-duration">${song.duration}</span>
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => this.selectSong(song.id));
                card.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.selectSong(song.id);
                }, { passive: false });

                this.songListEl.appendChild(card);
            });

            this.songDetailEl.innerHTML = `
                <div class="detail-empty">
                    <div class="detail-empty-icon">🎵</div>
                    <div class="detail-empty-text">← 请从左侧选择一首歌曲</div>
                </div>
            `;
        }

        selectSong(songId) {
            const song = SONG_LIST.find(s => s.id === songId);
            if (!song) return;
            this.currentSong = song;

            document.querySelectorAll('.song-card').forEach(card => {
                if (card.dataset.songId === songId) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            const diffClass = 'detail-diff diff-' + song.difficulty;
            const diffText = song.difficulty.toUpperCase();
            const noteCount = this.getNoteCountForSong(song);

            this.songDetailEl.classList.add('has-song');
            this.songDetailEl.innerHTML = `
                <div class="detail-cover" style="background: ${song.coverBg}">
                    ${song.cover}
                </div>
                <div class="detail-name">${song.name}</div>
                <div class="detail-artist">${song.artist}</div>
                <span class="${diffClass}">${diffText}</span>
                <div class="detail-stats">
                    <div class="detail-stat">
                        <div class="detail-stat-label">BPM</div>
                        <div class="detail-stat-value">${song.bpm}</div>
                    </div>
                    <div class="detail-stat">
                        <div class="detail-stat-label">时长</div>
                        <div class="detail-stat-value">${song.duration}</div>
                    </div>
                    <div class="detail-stat">
                        <div class="detail-stat-label">音符</div>
                        <div class="detail-stat-value">${noteCount}+</div>
                    </div>
                </div>
            `;

            this.startBtn.disabled = false;
            this.startBtn.innerHTML = `
                <span style="font-size:24px;">▶</span>
                <span class="btn-text">START GAME</span>
            `;
        }

        getNoteCountForSong(song) {
            const bpm = song.bpm;
            const beatTime = 60000 / bpm;
            const patterns = this.getPatternsForBpm(bpm);
            return patterns.length * 4;
        }

        loadSongMedia(song) {
            const videoSources = this.video.querySelectorAll('source');
            if (videoSources.length > 0) {
                videoSources[0].src = song.video;
            } else {
                const source = document.createElement('source');
                source.src = song.video;
                source.type = 'video/mp4';
                this.video.appendChild(source);
            }
            this.video.load();

            const audioSources = this.audio.querySelectorAll('source');
            if (audioSources.length > 0) {
                audioSources[0].src = song.audio;
            } else {
                const source = document.createElement('source');
                source.src = song.audio;
                source.type = 'audio/mpeg';
                this.audio.appendChild(source);
            }
            this.audio.load();
        }

        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.width = this.canvas.width;
            this.height = this.canvas.height;

            if (this.width < 768) {
                this.trackAreaWidth = this.width * 0.95;
            } else {
                this.trackAreaWidth = this.width * this.CONFIG.TRACK_WIDTH_RATIO;
            }
            this.trackAreaLeft = (this.width - this.trackAreaWidth) / 2;
            this.trackWidth = this.trackAreaWidth / this.this.CONFIG.TRACK_COUNT;
            this.judgeLineY = this.height * this.CONFIG.JUDGE_LINE_Y_RATIO;
            this.noteHeight = Math.min(28, this.trackWidth * 0.25);
        }

        getTrackFromX(x) {
            if (x < this.trackAreaLeft || x > this.trackAreaLeft + this.trackAreaWidth) {
                return -1;
            }
            const localX = x - this.trackAreaLeft;
            const idx = Math.floor(localX / this.trackWidth);
            return Math.max(0, Math.min(this.CONFIG.TRACK_COUNT - 1, idx));
        }

        pressTrack(trackIdx) {
            if (trackIdx < 0 || trackIdx >= this.CONFIG.TRACK_COUNT) return;
            if (this.trackPressState[trackIdx]) return;
            this.trackPressState[trackIdx] = true;
            this.trackFlashState[trackIdx] = 1;
            this.handleTrackPress(trackIdx);
        }

        releaseTrack(trackIdx) {
            if (trackIdx < 0 || trackIdx >= this.CONFIG.TRACK_COUNT) return;
            this.trackPressState[trackIdx] = false;
            this.handleTrackRelease(trackIdx);
        }

        setupEventListeners() {
            document.addEventListener('keydown', (e) => {
                const key = e.key.toLowerCase();
                const trackIdx = KEY_MAP.indexOf(key);
                if (trackIdx !== -1) {
                    this.pressTrack(trackIdx);
                }
            });

            document.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
                const trackIdx = KEY_MAP.indexOf(key);
                if (trackIdx !== -1) {
                    this.releaseTrack(trackIdx);
                }
            });

            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                for (const touch of e.changedTouches) {
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;
                    const trackIdx = this.getTrackFromX(x);
                    if (trackIdx !== -1) {
                        this.activeTouches.set(touch.identifier, trackIdx);
                        this.pressTrack(trackIdx);
                    }
                }
            }, { passive: false });

            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                for (const touch of e.changedTouches) {
                    const prevTrack = this.activeTouches.get(touch.identifier);
                    const x = touch.clientX - rect.left;
                    const newTrack = this.getTrackFromX(x);
                    if (prevTrack !== undefined && prevTrack !== newTrack) {
                        this.releaseTrack(prevTrack);
                        this.activeTouches.set(touch.identifier, newTrack);
                        if (newTrack !== -1) {
                            this.pressTrack(newTrack);
                        }
                    }
                }
            }, { passive: false });

            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                for (const touch of e.changedTouches) {
                    const trackIdx = this.activeTouches.get(touch.identifier);
                    if (trackIdx !== undefined) {
                        this.releaseTrack(trackIdx);
                        this.activeTouches.delete(touch.identifier);
                    }
                }
            }, { passive: false });

            this.canvas.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                for (const touch of e.changedTouches) {
                    const trackIdx = this.activeTouches.get(touch.identifier);
                    if (trackIdx !== undefined) {
                        this.releaseTrack(trackIdx);
                        this.activeTouches.delete(touch.identifier);
                    }
                }
            }, { passive: false });

            this.startBtn.addEventListener('click', () => this.startGame());
            this.startBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.startGame();
            }, { passive: false });

            this.retryBtn.addEventListener('click', () => this.restartGame());
            this.retryBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.restartGame();
            }, { passive: false });

            this.audio.addEventListener('ended', () => {
                if (this.isPlaying && !this.isEnded) {
                    this.endGame();
                }
            });
        }

        getPatternsForBpm(bpm) {
            const beatTime = 60000 / bpm;
            return [
                { track: 0, time: beatTime * 2, type: 'tap' },
                { track: 1, time: beatTime * 3, type: 'tap' },
                { track: 2, time: beatTime * 4, type: 'tap' },
                { track: 3, time: beatTime * 5, type: 'tap' },
                { track: 0, time: beatTime * 6, type: 'tap' },
                { track: 2, time: beatTime * 6, type: 'tap' },
                { track: 1, time: beatTime * 7, type: 'tap' },
                { track: 3, time: beatTime * 7, type: 'tap' },
                { track: 0, time: beatTime * 8, type: 'hold', duration: beatTime * 2 },
                { track: 3, time: beatTime * 9, type: 'hold', duration: beatTime * 1.5 },
                { track: 1, time: beatTime * 10, type: 'tap' },
                { track: 2, time: beatTime * 10, type: 'tap' },
                { track: 0, time: beatTime * 11, type: 'tap' },
                { track: 1, time: beatTime * 11.5, type: 'tap' },
                { track: 2, time: beatTime * 12, type: 'tap' },
                { track: 3, time: beatTime * 12.5, type: 'tap' },
                { track: 1, time: beatTime * 13, type: 'hold', duration: beatTime * 2.5 },
                { track: 2, time: beatTime * 13, type: 'hold', duration: beatTime * 2.5 },
                { track: 0, time: beatTime * 14, type: 'tap' },
                { track: 3, time: beatTime * 14, type: 'tap' },
                { track: 0, time: beatTime * 15, type: 'tap' },
                { track: 1, time: beatTime * 15, type: 'tap' },
                { track: 2, time: beatTime * 15, type: 'tap' },
                { track: 3, time: beatTime * 15, type: 'tap' },
                { track: 0, time: beatTime * 16, type: 'tap' },
                { track: 3, time: beatTime * 16.5, type: 'tap' },
                { track: 1, time: beatTime * 17, type: 'tap' },
                { track: 2, time: beatTime * 17.5, type: 'tap' },
                { track: 0, time: beatTime * 18, type: 'hold', duration: beatTime * 3 },
                { track: 1, time: beatTime * 19, type: 'tap' },
                { track: 2, time: beatTime * 20, type: 'tap' },
                { track: 3, time: beatTime * 18, type: 'hold', duration: beatTime * 3 },
            ];
        }

        generateDemoNotes() {
            const song = this.currentSong || SONG_LIST[0];
            const bpm = song.bpm || 90;
            const beatTime = 60000 / bpm;
            const patterns = this.getPatternsForBpm(bpm);

            this.CONFIG = { ...CONFIG_BASE };
            this.this.CONFIG.NOTE_SPEED = song.noteSpeed || CONFIG_BASE.NOTE_SPEED;

            this.notes = [];
            const loopCount = 4;
            const loopDuration = beatTime * 20;
            for (let i = 0; i < loopCount; i++) {
                const offset = loopDuration * i;
                patterns.forEach(p => {
                    this.notes.push({
                        track: p.track,
                        time: p.time + offset,
                        type: p.type,
                        duration: p.duration || 0,
                        hit: false,
                        completed: false,
                        holdStarted: false,
                        lastTickTime: p.time + offset,
                    });
                });
            }

            this.maxPossibleScore = 0;
            this.notes.forEach(n => {
                if (n.type === 'tap') {
                    this.maxPossibleScore += this.this.CONFIG.PERFECT_SCORE;
                } else if (n.type === 'hold') {
                    this.maxPossibleScore += this.this.CONFIG.PERFECT_SCORE;
                    const ticks = Math.floor(n.duration / 50);
                    this.maxPossibleScore += ticks * this.this.CONFIG.HOLD_TICK_SCORE;
                    this.maxPossibleScore += this.this.CONFIG.PERFECT_SCORE;
                }
            });
        }

        startGame() {
            if (!this.currentSong) {
                this.currentSong = SONG_LIST[0];
            }

            this.loadSongMedia(this.currentSong);

            this.startScreen.style.display = 'none';
            this.endScreen.classList.add('hidden');
            this.isPlaying = true;
            this.isEnded = false;
            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.gameTime = 0;
            this.particles = [];
            this.holdEffects = [];
            this.stats = { perfect: 0, great: 0, good: 0, miss: 0 };
            this.trackPressState = [false, false, false, false];
            this.trackFlashState = [0, 0, 0, 0];

            this.generateDemoNotes();

            const mediaTimeoutMs = 1500;
            setTimeout(() => {
                if (this.video.paused) {
                    this.video.play().catch(() => {});
                }
                if (this.audio.paused) {
                    this.audio.currentTime = 0;
                    this.audio.play().catch(() => {
                        setTimeout(() => {
                            if (this.isPlaying && !this.isEnded) {
                                const song = this.currentSong || SONG_LIST[0];
                                const bpm = song.bpm || 90;
                                const beatTime = 60000 / bpm;
                                const totalTime = beatTime * 20 * 4 + 3000;
                                setTimeout(() => this.endGame(), totalTime);
                            }
                        }, 1000);
                    });
                }
            }, mediaTimeoutMs);

            this.startTime = performance.now();
            this.lastTimestamp = this.startTime;
            this.updateScore();
            requestAnimationFrame(this.loop);
        }

        restartGame() {
            this.endScreen.classList.add('hidden');
            this.startScreen.style.display = 'flex';
            this.renderSongList();
            this.currentSong = null;

            document.querySelectorAll('.song-card').forEach(c => c.classList.remove('active'));
            this.songDetailEl.classList.remove('has-song');
            this.songDetailEl.innerHTML = `
                <div class="detail-empty">
                    <div class="detail-empty-icon">🎵</div>
                    <div class="detail-empty-text">← 请从左侧选择一首歌曲</div>
                </div>
            `;
            this.startBtn.disabled = true;
            this.startBtn.innerHTML = `
                <span class="btn-lock">🔒</span>
                <span class="btn-text">请先选择歌曲</span>
            `;

            try { this.audio.pause(); } catch (e) {}
            try { this.video.pause(); } catch (e) {}
        }

        endGame() {
            if (this.isEnded) return;
            this.isEnded = true;
            this.isPlaying = false;

            try {
                this.audio.pause();
            } catch (e) {}

            setTimeout(() => {
                this.showEndScreen();
            }, 800);
        }

        showEndScreen() {
            const totalJudged = this.stats.perfect + this.stats.great + this.stats.good + this.stats.miss;
            const accuracy = totalJudged > 0
                ? ((this.stats.perfect * 100 + this.stats.great * 80 + this.stats.good * 50) / (totalJudged * 100)) * 100
                : 0;

            let grade = 'D';
            for (const g of GRADE_THRESHOLDS) {
                if (accuracy >= g.minAcc) {
                    grade = g.grade;
                    break;
                }
            }

            let bonusScore = 0;
            if (this.stats.miss === 0) bonusScore += 2000;
            if (this.stats.good === 0) bonusScore += 1500;
            if (grade === 'S') bonusScore += 5000;
            else if (grade === 'A') bonusScore += 3000;
            else if (grade === 'B') bonusScore += 1500;
            bonusScore += this.maxCombo * 20;

            this.score += bonusScore;

            const gradeDisplay = document.getElementById('grade-display');
            gradeDisplay.className = 'grade-display';
            gradeDisplay.classList.add('grade-' + grade.toLowerCase());
            gradeDisplay.textContent = grade;

            document.getElementById('final-score-value').textContent = this.score.toLocaleString();
            document.getElementById('stat-perfect').textContent = this.stats.perfect;
            document.getElementById('stat-great').textContent = this.stats.great;
            document.getElementById('stat-good').textContent = this.stats.good;
            document.getElementById('stat-miss').textContent = this.stats.miss;
            document.getElementById('stat-maxcombo').textContent = this.maxCombo;
            document.getElementById('stat-accuracy').textContent = accuracy.toFixed(1) + '%';
            document.getElementById('stat-bonus').textContent = '+' + bonusScore.toLocaleString();

            this.endScreen.classList.remove('hidden');
        }

        loop(timestamp) {
            if (!this.isPlaying) return;

            const dt = timestamp - this.lastTimestamp;
            this.lastTimestamp = timestamp;
            this.gameTime = timestamp - this.startTime;

            this.update(dt);
            this.render();

            const allNotesDone = this.notes.every(n => n.completed);
            if (allNotesDone && this.gameTime > 5000 && !this.isEnded) {
                const musicDuration = (this.audio.duration || 0) * 1000;
                if (musicDuration > 0 && this.gameTime >= musicDuration - 500) {
                    this.endGame();
                } else if (musicDuration === 0 && this.gameTime > this.notes[this.notes.length - 1].time + 3000) {
                    this.endGame();
                }
            }

            requestAnimationFrame(this.loop);
        }

        update(dt) {
            for (let i = 0; i < this.CONFIG.TRACK_COUNT; i++) {
                if (this.trackFlashState[i] > 0) {
                    this.trackFlashState[i] = Math.max(0, this.trackFlashState[i] - dt / 200);
                }
            }

            this.updateNotes();
            this.updateHoldEffects(dt);
            this.updateParticles(dt);
        }

        updateNotes() {
            for (const note of this.notes) {
                if (note.completed) continue;

                if (note.type === 'tap') {
                    if (!note.hit && this.gameTime - note.time > this.CONFIG.MISS_WINDOW) {
                        note.completed = true;
                        this.handleJudge('miss', note.track);
                    }
                } else if (note.type === 'hold') {
                    const endTime = note.time + note.duration;

                    if (!note.hit && this.gameTime - note.time > this.CONFIG.MISS_WINDOW) {
                        note.completed = true;
                        this.handleJudge('miss', note.track);
                        continue;
                    }

                    if (note.hit && this.trackPressState[note.track] && this.gameTime < endTime) {
                        if (this.gameTime - note.lastTickTime >= 50) {
                            note.lastTickTime = this.gameTime;
                            this.score += this.CONFIG.HOLD_TICK_SCORE;
                            this.updateScore();
                            const noteY = this.judgeLineY;
                            const noteX = this.trackAreaLeft + note.track * this.trackWidth + this.trackWidth / 2;
                            this.spawnHoldParticle(noteX, noteY, note.track);
                        }
                    }

                    if (this.gameTime >= endTime) {
                        note.completed = true;
                        if (note.hit) {
                            this.handleJudge('perfect', note.track, true);
                        }
                    }
                }
            }
        }

        handleTrackPress(trackIdx) {
            if (!this.isPlaying) return;

            let closestNote = null;
            let closestDiff = Infinity;

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
                if (closestNote.type === 'hold') {
                    closestNote.holdStarted = true;
                }

                let judge = 'miss';
                if (closestDiff <= this.CONFIG.PERFECT_WINDOW) {
                    judge = 'perfect';
                } else if (closestDiff <= this.CONFIG.GREAT_WINDOW) {
                    judge = 'great';
                } else if (closestDiff <= this.CONFIG.GOOD_WINDOW) {
                    judge = 'good';
                }

                if (closestNote.type === 'tap') {
                    closestNote.completed = true;
                }

                this.handleJudge(judge, trackIdx, closestNote.type === 'hold');
            }
        }

        handleTrackRelease(trackIdx) {
            if (!this.isPlaying) return;

            for (const note of this.notes) {
                if (note.type === 'hold' && note.hit && !note.completed && note.track === trackIdx) {
                    const endTime = note.time + note.duration;
                    const releaseDiff = endTime - this.gameTime;

                    if (releaseDiff > this.CONFIG.GOOD_WINDOW) {
                        note.completed = true;
                        this.handleJudge('good', trackIdx);
                    }
                }
            }
        }

        handleJudge(judge, trackIdx, isHoldHead = false) {
            let scoreAdd = 0;

            switch (judge) {
                case 'perfect':
                    scoreAdd = this.CONFIG.PERFECT_SCORE;
                    this.combo++;
                    this.stats.perfect++;
                    break;
                case 'great':
                    scoreAdd = this.CONFIG.GREAT_SCORE;
                    this.combo++;
                    this.stats.great++;
                    break;
                case 'good':
                    scoreAdd = this.CONFIG.GOOD_SCORE;
                    this.combo++;
                    this.stats.good++;
                    break;
                case 'miss':
                    this.combo = 0;
                    this.stats.miss++;
                    break;
            }

            if (this.combo >= this.CONFIG.COMBO_BONUS_THRESHOLD) {
                scoreAdd = Math.floor(scoreAdd * 1.1);
            }

            this.score += scoreAdd;
            this.maxCombo = Math.max(this.maxCombo, this.combo);

            if (!isHoldHead) {
                this.updateScore();
                this.updateCombo();
                this.showJudge(judge);
            } else if (judge !== 'miss') {
                this.updateScore();
                this.updateCombo();
            }

            const noteX = this.trackAreaLeft + trackIdx * this.trackWidth + this.trackWidth / 2;
            const noteY = this.judgeLineY;

            if (judge === 'miss') {
                this.spawnMissEffect(noteX, noteY);
            } else {
                this.spawnHitParticles(noteX, noteY, trackIdx, judge);
            }
        }

        updateScore() {
            this.scoreEl.textContent = this.score.toLocaleString();
        }

        updateCombo() {
            if (this.combo > 0) {
                this.comboEl.classList.remove('hidden');
                this.comboValueEl.textContent = this.combo;
                this.comboEl.style.animation = 'none';
                this.comboEl.offsetHeight;
                this.comboEl.style.animation = 'comboPulse 0.2s ease-out';
            } else {
                this.comboEl.classList.add('hidden');
            }
        }

        showJudge(judge) {
            this.judgeTextEl.className = 'judge-text';
            switch (judge) {
                case 'perfect':
                    this.judgeTextEl.classList.add('judge-perfect');
                    this.judgeTextEl.textContent = 'PERFECT';
                    break;
                case 'great':
                    this.judgeTextEl.classList.add('judge-great');
                    this.judgeTextEl.textContent = 'GREAT';
                    break;
                case 'good':
                    this.judgeTextEl.classList.add('judge-good');
                    this.judgeTextEl.textContent = 'GOOD';
                    break;
                case 'miss':
                    this.judgeTextEl.classList.add('judge-miss');
                    this.judgeTextEl.textContent = 'MISS';
                    break;
            }

            this.judgeEl.classList.remove('hidden');
            this.judgeEl.style.animation = 'none';
            this.judgeEl.offsetHeight;
            this.judgeEl.style.animation = 'judgeAnim 0.5s ease-out forwards';
        }

        spawnHitParticles(x, y, trackIdx, judge) {
            const colors = TRACK_COLORS[trackIdx];
            const intensity = judge === 'perfect' ? 1 : judge === 'great' ? 0.8 : 0.6;
            const count = Math.floor(30 * intensity);

            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
                const speed = 100 + Math.random() * 250 * intensity;
                const size = 3 + Math.random() * 5;

                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 100,
                    life: 1,
                    decay: 1.5 + Math.random() * 1.5,
                    size: size,
                    color: Math.random() < 0.5 ? colors[0] : colors[1],
                    type: 'spark',
                });
            }

            this.particles.push({
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                life: 1,
                decay: 3,
                size: this.trackWidth * 0.6,
                color: colors[0],
                type: 'ring',
            });

            this.particles.push({
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                life: 1,
                decay: 2,
                size: this.trackWidth * 0.3,
                color: '#ffffff',
                type: 'flash',
            });
        }

        spawnHoldParticle(x, y, trackIdx) {
            const colors = TRACK_COLORS[trackIdx];
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
            const speed = 50 + Math.random() * 100;

            this.particles.push({
                x: x + (Math.random() - 0.5) * this.trackWidth * 0.5,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 2 + Math.random(),
                size: 2 + Math.random() * 4,
                color: Math.random() < 0.5 ? colors[0] : colors[1],
                type: 'spark',
            });
        }

        spawnMissEffect(x, y) {
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 50 + Math.random() * 100;

                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: 2,
                    size: 2 + Math.random() * 3,
                    color: '#ff4444',
                    type: 'spark',
                });
            }
        }

        updateHoldEffects(dt) {
            for (let i = this.holdEffects.length - 1; i >= 0; i--) {
                this.holdEffects[i].life -= dt / 1000 * 2;
                if (this.holdEffects[i].life <= 0) {
                    this.holdEffects.splice(i, 1);
                }
            }
        }

        updateParticles(dt) {
            const dtSec = dt / 1000;
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.life -= dtSec * p.decay;
                p.x += p.vx * dtSec;
                p.y += p.vy * dtSec;
                p.vy += 500 * dtSec;
                p.vx *= 0.98;

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }

        render() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            this.drawTracks();
            this.drawNotes();
            this.drawJudgeLine();
            this.drawTrackFlashes();
            this.drawParticles();
        }

        drawTracks() {
            for (let i = 0; i < this.CONFIG.TRACK_COUNT; i++) {
                const x = this.trackAreaLeft + i * this.trackWidth;

                const gradient = this.ctx.createLinearGradient(x, 0, x, this.height);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.08)');

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x + 1, 0, this.trackWidth - 2, this.height);

                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();

                if (this.trackPressState[i]) {
                    const pressGradient = this.ctx.createLinearGradient(
                        x, this.judgeLineY - 200,
                        x, this.judgeLineY + 50
                    );
                    const colors = TRACK_COLORS[i];
                    pressGradient.addColorStop(0, `${colors[0]}00`);
                    pressGradient.addColorStop(1, `${colors[0]}40`);
                    this.ctx.fillStyle = pressGradient;
                    this.ctx.fillRect(x + 1, this.judgeLineY - 200, this.trackWidth - 2, 250);
                }
            }

            const rightEdge = this.trackAreaLeft + this.trackAreaWidth;
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctx.beginPath();
            this.ctx.moveTo(rightEdge, 0);
            this.ctx.lineTo(rightEdge, this.height);
            this.ctx.stroke();
        }

        drawNotes() {
            for (const note of this.notes) {
                if (note.completed) continue;

                const trackX = this.trackAreaLeft + note.track * this.trackWidth;
                const centerX = trackX + this.trackWidth / 2;
                const colors = TRACK_COLORS[note.track];

                if (note.type === 'tap') {
                    const y = this.calculateNoteY(note.time);
                    if (y < -50 || y > this.height + 50) continue;

                    this.drawTapNote(centerX, y, colors, note.hit);
                } else if (note.type === 'hold') {
                    const headY = this.calculateNoteY(note.time);
                    const endTime = note.time + note.duration;
                    const tailY = this.calculateNoteY(endTime);

                    if (tailY < -100 || headY > this.height + 100) continue;

                    this.drawHoldNoteBody(
                        centerX,
                        Math.max(headY, -100),
                        Math.min(tailY, this.height + 50),
                        colors,
                        note
                    );

                    if (headY >= -50 && headY <= this.height + 50) {
                        this.drawTapNote(centerX, headY, colors, note.hit);
                    }
                }
            }
        }

        calculateNoteY(noteTime) {
            const timeToJudge = noteTime - this.gameTime;
            const pixelsPerMs = this.CONFIG.NOTE_SPEED / 1000;
            return this.judgeLineY - timeToJudge * pixelsPerMs;
        }

        drawTapNote(x, y, colors, isHit) {
            const width = this.trackWidth * 0.75;
            const height = this.noteHeight;
            const halfW = width / 2;
            const halfH = height / 2;

            this.ctx.save();

            if (!isHit) {
                this.ctx.shadowColor = colors[1];
                this.ctx.shadowBlur = 25;
            }

            const gradient = this.ctx.createLinearGradient(x, y - halfH, x, y + halfH);
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(0.5, '#ffffff');
            gradient.addColorStop(1, colors[1]);

            this.ctx.fillStyle = isHit ? colors[0] + '60' : gradient;

            const r = halfH * 0.8;
            this.ctx.beginPath();
            this.ctx.moveTo(x - halfW + r, y - halfH);
            this.ctx.lineTo(x + halfW - r, y - halfH);
            this.ctx.quadraticCurveTo(x + halfW, y - halfH, x + halfW, y - halfH + r);
            this.ctx.lineTo(x + halfW, y + halfH - r);
            this.ctx.quadraticCurveTo(x + halfW, y + halfH, x + halfW - r, y + halfH);
            this.ctx.lineTo(x - halfW + r, y + halfH);
            this.ctx.quadraticCurveTo(x - halfW, y + halfH, x - halfW, y + halfH - r);
            this.ctx.lineTo(x - halfW, y - halfH + r);
            this.ctx.quadraticCurveTo(x - halfW, y - halfH, x - halfW + r, y - halfH);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (!isHit) {
                const highlightGradient = this.ctx.createLinearGradient(
                    x - halfW * 0.6, y - halfH,
                    x + halfW * 0.2, y + halfH
                );
                highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
                highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                this.ctx.fillStyle = highlightGradient;
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        drawHoldNoteBody(x, topY, bottomY, colors, note) {
            const width = this.trackWidth * 0.55;
            const halfW = width / 2;

            this.ctx.save();

            const progress = note.hit ? Math.min(1, (this.gameTime - note.time) / note.duration) : 0;
            const activatedY = topY + (bottomY - topY) * progress;

            if (progress < 1) {
                const bodyGradient = this.ctx.createLinearGradient(x - halfW, 0, x + halfW, 0);
                bodyGradient.addColorStop(0, colors[0] + '40');
                bodyGradient.addColorStop(0.5, colors[0] + '90');
                bodyGradient.addColorStop(1, colors[0] + '40');

                this.ctx.fillStyle = note.hit ? colors[0] + '20' : bodyGradient;
                this.ctx.fillRect(x - halfW, activatedY, width, bottomY - activatedY);
            }

            if (progress > 0) {
                const filledGradient = this.ctx.createLinearGradient(x - halfW, 0, x + halfW, 0);
                filledGradient.addColorStop(0, colors[1] + '80');
                filledGradient.addColorStop(0.5, '#ffffffc0');
                filledGradient.addColorStop(1, colors[1] + '80');

                this.ctx.fillStyle = filledGradient;
                this.ctx.fillRect(x - halfW, topY, width, activatedY - topY);
            }

            this.ctx.strokeStyle = colors[1];
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.6;
            this.ctx.strokeRect(x - halfW, topY, width, bottomY - topY);
            this.ctx.globalAlpha = 1;

            if (note.hit && this.trackPressState[note.track] && this.gameTime < note.time + note.duration) {
                const glowGradient = this.ctx.createRadialGradient(x, activatedY, 0, x, activatedY, width);
                glowGradient.addColorStop(0, colors[0] + 'aa');
                glowGradient.addColorStop(1, colors[0] + '00');
                this.ctx.fillStyle = glowGradient;
                this.ctx.fillRect(x - width, activatedY - width, width * 2, width * 2);
            }

            this.ctx.restore();
        }

        drawJudgeLine() {
            const y = this.judgeLineY;
            const left = this.trackAreaLeft;
            const right = this.trackAreaLeft + this.trackAreaWidth;

            this.ctx.save();

            const glowGradient = this.ctx.createLinearGradient(0, y - 30, 0, y + 30);
            glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
            glowGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
            glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            this.ctx.fillStyle = glowGradient;
            this.ctx.fillRect(left, y - 30, this.trackAreaWidth, 60);

            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 4;
            this.ctx.shadowColor = '#ffd700';
            this.ctx.shadowBlur = 20;
            this.ctx.beginPath();
            this.ctx.moveTo(left, y);
            this.ctx.lineTo(right, y);
            this.ctx.stroke();

            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.shadowBlur = 0;
            this.ctx.beginPath();
            this.ctx.moveTo(left, y);
            this.ctx.lineTo(right, y);
            this.ctx.stroke();

            for (let i = 0; i < this.CONFIG.TRACK_COUNT; i++) {
                const trackCenter = left + i * this.trackWidth + this.trackWidth / 2;
                const colors = TRACK_COLORS[i];

                const buttonSize = this.trackWidth * 0.7;
                const halfB = buttonSize / 2;
                const pressed = this.trackPressState[i];

                const btnGradient = this.ctx.createLinearGradient(
                    trackCenter, y - halfB,
                    trackCenter, y + halfB
                );
                btnGradient.addColorStop(0, pressed ? colors[0] : colors[0] + '60');
                btnGradient.addColorStop(1, pressed ? colors[1] : colors[1] + '60');

                this.ctx.fillStyle = btnGradient;
                this.ctx.shadowColor = pressed ? colors[1] : colors[1] + '80';
                this.ctx.shadowBlur = pressed ? 30 : 15;

                const r = 10;
                this.ctx.beginPath();
                this.ctx.moveTo(trackCenter - halfB + r, y - halfB);
                this.ctx.lineTo(trackCenter + halfB - r, y - halfB);
                this.ctx.quadraticCurveTo(trackCenter + halfB, y - halfB, trackCenter + halfB, y - halfB + r);
                this.ctx.lineTo(trackCenter + halfB, y + halfB - r);
                this.ctx.quadraticCurveTo(trackCenter + halfB, y + halfB, trackCenter + halfB - r, y + halfB);
                this.ctx.lineTo(trackCenter - halfB + r, y + halfB);
                this.ctx.quadraticCurveTo(trackCenter - halfB, y + halfB, trackCenter - halfB, y + halfB - r);
                this.ctx.lineTo(trackCenter - halfB, y - halfB + r);
                this.ctx.quadraticCurveTo(trackCenter - halfB, y - halfB, trackCenter - halfB + r, y - halfB);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = pressed ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
                this.ctx.lineWidth = pressed ? 3 : 2;
                this.ctx.shadowBlur = 0;
                this.ctx.stroke();

                this.ctx.fillStyle = pressed ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
                this.ctx.font = `900 ${this.trackWidth * 0.35}px Impact, Arial Black, sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(KEY_MAP[i].toUpperCase(), trackCenter, y);
            }

            this.ctx.restore();
        }

        drawTrackFlashes() {
            for (let i = 0; i < this.CONFIG.TRACK_COUNT; i++) {
                if (this.trackFlashState[i] <= 0) continue;

                const x = this.trackAreaLeft + i * this.trackWidth;
                const colors = TRACK_COLORS[i];
                const alpha = this.trackFlashState[i] * 0.5;

                const flashGradient = this.ctx.createLinearGradient(
                    x, this.judgeLineY - 300,
                    x, this.judgeLineY + 50
                );
                flashGradient.addColorStop(0, colors[0] + '00');
                flashGradient.addColorStop(1, colors[0] + Math.floor(alpha * 255).toString(16).padStart(2, '0'));

                this.ctx.fillStyle = flashGradient;
                this.ctx.fillRect(x, this.judgeLineY - 300, this.trackWidth, 350);
            }
        }

        drawParticles() {
            for (const p of this.particles) {
                const alpha = Math.max(0, Math.min(1, p.life));

                this.ctx.save();
                this.ctx.globalAlpha = alpha;

                if (p.type === 'spark') {
                    this.ctx.fillStyle = p.color;
                    this.ctx.shadowColor = p.color;
                    this.ctx.shadowBlur = 10;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (p.type === 'ring') {
                    const ringSize = p.size * (2 - alpha);
                    this.ctx.strokeStyle = p.color;
                    this.ctx.lineWidth = 5 * alpha;
                    this.ctx.shadowColor = p.color;
                    this.ctx.shadowBlur = 20;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, ringSize, 0, Math.PI * 2);
                    this.ctx.stroke();
                } else if (p.type === 'flash') {
                    const flashSize = p.size * alpha;
                    const gradient = this.ctx.createRadialGradient(
                        p.x, p.y, 0,
                        p.x, p.y, flashSize
                    );
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, flashSize, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
            }
        }
    }

    window.addEventListener('load', () => {
        const game = new Game();
        window._game = game;
    });
})();
