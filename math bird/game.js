/**
 * game.js - Core Engine for Math Bird (Flappy Math)
 * Supports: Single Player, 20 Level Adventure, Endless Mode, and Multiplayer Duel (vs BOT AI & Local 2 Players)
 */

class MathBirdGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Logical Resolution
        this.width = 420;
        this.height = 700;
        
        // Modules
        this.mathGen = new MathGenerator();
        this.sound = new SoundEngine();

        // Game Mode & Level Configuration
        this.gameMode = 'level'; // 'level', 'endless', or 'duel'
        this.currentLevelId = 1;
        this.selectedWorldTab = 1;

        // Duel Mode Configuration
        this.duelOpponent = 'bot'; // 'bot' or 'human'
        this.botDifficulty = 'easy'; // 'easy' (70%), 'medium' (88%), 'hard' (98%)
        this.duelTargetMode = 'survival'; // 'survival' (until K.O.), '10', '20'
        this.duelTargetScore = Infinity;
        this.duelOperation = 'add';

        // Load Persistent Progress
        this.unlockedLevel = parseInt(localStorage.getItem('math_bird_unlocked_level') || '1', 10);
        this.levelStars = JSON.parse(localStorage.getItem('math_bird_stars') || '{}');
        this.highScore = parseInt(localStorage.getItem('math_bird_highscore') || '0', 10);

        // Endless Config
        this.operation = 'add';
        this.difficulty = 'easy';
        this.mode = 'learn';
        this.maxLives = 3;
        this.lives = 3;

        // Level Run Stats
        this.levelCorrectCount = 0;
        this.levelWrongCount = 0;
        this.levelTarget = 5;

        // Overall Run State
        this.state = 'MENU'; // 'MENU', 'READY', 'PLAYING', 'PAUSED', 'GAMEOVER', 'VICTORY', 'DUEL_WINNER'
        this.score = 0;
        this.streak = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.missedQuestions = [];

        // Screen Shake & SlowMo
        this.shakeTimer = 0;
        this.shakeIntensity = 0;
        this.slowMoTimer = 0;

        // Visual Parallax Elements
        this.bgOffset = 0;
        this.clouds = [];
        this.mathSymbols = [];
        this.particles = [];
        this.floatingTexts = [];
        this.gates = [];
        this.worldTheme = 'forest';

        // Player 1 (Yellow Scholar Bird)
        this.bird = {
            x: 85,
            y: 350,
            radius: 15,
            vy: 0,
            gravity: 0.38,
            jumpStrength: -7.2,
            rotation: 0,
            wingPhase: 0,
            invulnerableTimer: 0,
            lives: 3,
            score: 0,
            correctCount: 0,
            wrongCount: 0,
            hasShield: false,
            doubleScoreCount: 0,
            tag: 'P1',
            color: 'yellow'
        };

        // Player 2 / BOT (Blue Wizard / Cyber Bird)
        this.bird2 = {
            x: 135,
            y: 350,
            radius: 15,
            vy: 0,
            gravity: 0.38,
            jumpStrength: -7.2,
            rotation: 0,
            wingPhase: 0.5,
            invulnerableTimer: 0,
            lives: 3,
            score: 0,
            correctCount: 0,
            wrongCount: 0,
            hasShield: false,
            doubleScoreCount: 0,
            isBot: true,
            botAccuracy: 0.70,
            botTargetY: 265,
            botJumpCooldown: 0,
            botCurrentGate: null,
            tag: 'BOT',
            color: 'blue'
        };

        // Scroll speed & pipe distance
        this.scrollSpeed = 2.3;
        this.gateDistance = 420;

        // DOM Elements
        this.dom = {
            hud: document.getElementById('game-hud'),
            soloTopBar: document.getElementById('solo-top-bar'),
            duelTopBar: document.getElementById('duel-top-bar'),
            currentScore: document.getElementById('current-score'),
            hudLevelBadge: document.getElementById('hud-level-badge'),
            hudProgressContainer: document.getElementById('hud-progress-container'),
            hudProgressFill: document.getElementById('hud-progress-fill'),
            hudProgressText: document.getElementById('hud-progress-text'),
            questionText: document.getElementById('question-text'),
            operationLabel: document.getElementById('operation-label'),
            streakBanner: document.getElementById('streak-banner'),
            livesContainer: document.getElementById('lives-container'),
            hearts: [
                document.getElementById('heart-1'),
                document.getElementById('heart-2'),
                document.getElementById('heart-3')
            ],
            readyPrompt: document.getElementById('ready-prompt'),
            
            // Duel HUD
            duelP1Score: document.getElementById('duel-p1-score'),
            duelP1Lives: document.getElementById('duel-p1-lives'),
            duelP2Score: document.getElementById('duel-p2-score'),
            duelP2Lives: document.getElementById('duel-p2-lives'),
            duelP2HudName: document.getElementById('duel-p2-hud-name'),
            duelTargetBadge: document.getElementById('duel-target-badge'),
            duelTouchControls: document.getElementById('duel-touch-controls'),
            touchBtnP1: document.getElementById('touch-btn-p1'),
            touchBtnP2: document.getElementById('touch-btn-p2'),
            hudDuelPauseBtn: document.getElementById('hud-duel-pause-btn'),

            // Screens
            menuScreen: document.getElementById('menu-screen'),
            levelsScreen: document.getElementById('levels-screen'),
            endlessScreen: document.getElementById('endless-screen'),
            duelScreen: document.getElementById('duel-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            victoryScreen: document.getElementById('victory-screen'),
            gameoverScreen: document.getElementById('gameover-screen'),
            duelWinnerScreen: document.getElementById('duel-winner-screen'),
            instructionsScreen: document.getElementById('instructions-screen'),
            
            // Duel Setup Elements
            botDiffGroup: document.getElementById('bot-diff-group'),
            duelControlsHint: document.getElementById('duel-controls-hint'),

            // Duel Winner Elements
            duelWinnerTitle: document.getElementById('duel-winner-title'),
            duelWinnerSubtitle: document.getElementById('duel-winner-subtitle'),
            duelResP1Score: document.getElementById('duel-res-p1-score'),
            duelResP1Acc: document.getElementById('duel-res-p1-acc'),
            duelResP1Lives: document.getElementById('duel-res-p1-lives'),
            duelResP2Name: document.getElementById('duel-res-p2-name'),
            duelResP2Score: document.getElementById('duel-res-p2-score'),
            duelResP2Acc: document.getElementById('duel-res-p2-acc'),
            duelResP2Lives: document.getElementById('duel-res-p2-lives'),

            // Level Select Elements
            levelGrid: document.getElementById('level-grid'),
            worldTabs: document.getElementById('world-tabs'),
            currentWorldTitle: document.getElementById('current-world-title'),

            // Victory Modal Elements
            victoryLevelName: document.getElementById('victory-level-name'),
            victoryStars: [
                document.getElementById('v-star-1'),
                document.getElementById('v-star-2'),
                document.getElementById('v-star-3')
            ],
            victoryScore: document.getElementById('victory-score'),
            victoryAccuracy: document.getElementById('victory-accuracy'),
            victoryTime: document.getElementById('victory-time'),

            // Game Over Elements
            finalScore: document.getElementById('final-score'),
            finalHighScore: document.getElementById('final-high-score'),
            finalAccuracy: document.getElementById('final-accuracy'),
            gameoverTitle: document.getElementById('gameover-title'),
            gameoverSubtitle: document.getElementById('gameover-subtitle'),
            evaluationContainer: document.getElementById('evaluation-container'),

            // Controls
            soundBtn: document.getElementById('hud-sound-btn'),
            pauseBtn: document.getElementById('hud-pause-btn')
        };

        this.initCanvasSize();
        this.initBackgroundElements();
        this.bindEvents();
        this.renderLevelGrid();

        // Start animation loop
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    initCanvasSize() {
        const resize = () => {
            const container = document.getElementById('game-container');
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.ctx.resetTransform?.();
            this.ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', resize);
        resize();
    }

    initBackgroundElements() {
        this.clouds = [
            { x: 50, y: 80, scale: 1.2, speed: 0.3 },
            { x: 220, y: 160, scale: 0.8, speed: 0.2 },
            { x: 340, y: 60, scale: 1.0, speed: 0.25 },
            { x: 480, y: 130, scale: 1.1, speed: 0.28 }
        ];

        const symbols = ['+', '-', '×', '÷', '=', 'π', '%', '√', '7', '9', '3'];
        this.mathSymbols = [];
        for (let i = 0; i < 14; i++) {
            this.mathSymbols.push({
                char: symbols[Math.floor(Math.random() * symbols.length)],
                x: Math.random() * this.width,
                y: Math.random() * (this.height - 100),
                size: 14 + Math.random() * 18,
                alpha: 0.15 + Math.random() * 0.2,
                speed: 0.4 + Math.random() * 0.5,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    bindEvents() {
        // Keyboard Jump Handlers
        window.addEventListener('keydown', (e) => {
            if (e.target.closest && e.target.closest('button, .card, input')) return;

            if (this.gameMode === 'duel') {
                if (e.code === 'KeyW' || e.code === 'Space' || e.code === 'KeyA') {
                    if (this.state === 'READY') this.startGameplay();
                    if (this.state === 'PLAYING') this.jumpPlayer1();
                }
                if (e.code === 'ArrowUp' || e.code === 'ArrowRight' || e.code === 'Enter') {
                    if (!this.bird2.isBot) {
                        if (this.state === 'READY') this.startGameplay();
                        if (this.state === 'PLAYING') this.jumpPlayer2();
                    }
                }
            } else {
                if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                    if (this.state === 'READY') {
                        this.startGameplay();
                        this.jumpPlayer1();
                    } else if (this.state === 'PLAYING') {
                        this.jumpPlayer1();
                    }
                }
            }
        });

        // Canvas Pointer Down
        this.canvas.addEventListener('pointerdown', (e) => {
            if (e.target.closest && e.target.closest('button, .card')) return;
            if (this.gameMode === 'duel' && !this.bird2.isBot) {
                // Determine left or right side tap
                const rect = this.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX < rect.width / 2) {
                    if (this.state === 'READY') this.startGameplay();
                    if (this.state === 'PLAYING') this.jumpPlayer1();
                } else {
                    if (this.state === 'READY') this.startGameplay();
                    if (this.state === 'PLAYING') this.jumpPlayer2();
                }
            } else {
                if (this.state === 'READY') {
                    this.startGameplay();
                    this.jumpPlayer1();
                } else if (this.state === 'PLAYING') {
                    this.jumpPlayer1();
                }
            }
        });

        // Touch Control Buttons for Duel
        this.dom.touchBtnP1.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            if (this.state === 'READY') this.startGameplay();
            if (this.state === 'PLAYING') this.jumpPlayer1();
        });

        this.dom.touchBtnP2.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            if (!this.bird2.isBot) {
                if (this.state === 'READY') this.startGameplay();
                if (this.state === 'PLAYING') this.jumpPlayer2();
            }
        });

        // Main Menu Navigation
        document.getElementById('open-levels-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.menuScreen.classList.add('hidden');
            this.dom.levelsScreen.classList.remove('hidden');
            this.renderLevelGrid();
        });

        document.getElementById('open-duel-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.menuScreen.classList.add('hidden');
            this.dom.duelScreen.classList.remove('hidden');
        });

        document.getElementById('close-duel-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.duelScreen.classList.add('hidden');
            this.dom.menuScreen.classList.remove('hidden');
        });

        document.getElementById('close-levels-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.levelsScreen.classList.add('hidden');
            this.dom.menuScreen.classList.remove('hidden');
        });

        document.getElementById('open-endless-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.menuScreen.classList.add('hidden');
            this.dom.endlessScreen.classList.remove('hidden');
        });

        document.getElementById('close-endless-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.endlessScreen.classList.add('hidden');
            this.dom.menuScreen.classList.remove('hidden');
        });

        document.getElementById('how-to-play-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.menuScreen.classList.add('hidden');
            this.dom.instructionsScreen.classList.remove('hidden');
        });

        document.getElementById('back-from-instructions-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.instructionsScreen.classList.add('hidden');
            this.dom.menuScreen.classList.remove('hidden');
        });

        // Duel Setup Selectors
        document.querySelectorAll('#duel-opponent-selector .pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#duel-opponent-selector .pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.duelOpponent = btn.dataset.opponent;

                if (this.duelOpponent === 'bot') {
                    this.dom.botDiffGroup.classList.remove('hidden');
                    this.dom.botDiffGroup.style.display = 'block';
                    this.dom.duelControlsHint.classList.add('hidden');
                    this.dom.duelControlsHint.style.display = 'none';
                } else {
                    this.dom.botDiffGroup.classList.add('hidden');
                    this.dom.botDiffGroup.style.display = 'none';
                    this.dom.duelControlsHint.classList.remove('hidden');
                    this.dom.duelControlsHint.style.display = 'flex';
                }
            });
        });

        document.querySelectorAll('#bot-diff-selector .pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#bot-diff-selector .pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.botDifficulty = btn.dataset.bot;
            });
        });

        document.querySelectorAll('#duel-op-selector .pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#duel-op-selector .pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.duelOperation = btn.dataset.op;
            });
        });

        document.querySelectorAll('#duel-target-selector .pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#duel-target-selector .pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.duelTargetMode = btn.dataset.target;
                this.duelTargetScore = (this.duelTargetMode === 'survival') ? Infinity : parseInt(this.duelTargetMode, 10);
            });
        });

        document.getElementById('start-duel-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.gameMode = 'duel';
            this.dom.duelScreen.classList.add('hidden');
            this.prepareNewGame();
        });

        // World Tab Clicks
        document.querySelectorAll('#world-tabs .world-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#world-tabs .world-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.selectedWorldTab = parseInt(tab.dataset.world, 10);
                this.renderLevelGrid();
            });
        });

        // Endless Option Selectors
        document.querySelectorAll('#op-selector .pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#op-selector .pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.operation = btn.dataset.op;
            });
        });

        document.querySelectorAll('#diff-selector .pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#diff-selector .pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.diff;
            });
        });

        document.querySelectorAll('#mode-selector .pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.sound.playClick();
                document.querySelectorAll('#mode-selector .pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.mode = btn.dataset.mode;
                this.maxLives = this.mode === 'learn' ? 3 : 1;
            });
        });

        document.getElementById('start-endless-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.gameMode = 'endless';
            this.dom.endlessScreen.classList.add('hidden');
            this.prepareNewGame();
        });

        // HUD Pause Buttons
        document.getElementById('hud-pause-btn').addEventListener('click', () => {
            if (this.state === 'PLAYING') {
                this.sound.playClick();
                this.pauseGame();
            }
        });

        this.dom.hudDuelPauseBtn?.addEventListener('click', () => {
            if (this.state === 'PLAYING') {
                this.sound.playClick();
                this.pauseGame();
            }
        });

        document.getElementById('resume-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.resumeGame();
        });

        document.getElementById('quit-to-menu-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.returnToMenu();
        });

        // Victory Modal Buttons
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.sound.playClick();
            if (this.currentLevelId < 20) {
                this.startLevel(this.currentLevelId + 1);
            } else {
                this.returnToMenu();
            }
        });

        document.getElementById('replay-level-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.startLevel(this.currentLevelId);
        });

        document.getElementById('victory-select-level-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.victoryScreen.classList.add('hidden');
            this.dom.hud.classList.add('hidden');
            this.dom.levelsScreen.classList.remove('hidden');
            this.renderLevelGrid();
            this.state = 'MENU';
        });

        // Game Over Buttons
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.sound.playClick();
            if (this.gameMode === 'level') {
                this.startLevel(this.currentLevelId);
            } else {
                this.prepareNewGame();
            }
        });

        document.getElementById('gameover-levels-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.gameoverScreen.classList.add('hidden');
            this.dom.hud.classList.add('hidden');
            this.dom.levelsScreen.classList.remove('hidden');
            this.renderLevelGrid();
            this.state = 'MENU';
        });

        document.getElementById('gameover-menu-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.returnToMenu();
        });

        // Duel Winner Buttons
        document.getElementById('restart-duel-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.duelWinnerScreen.classList.add('hidden');
            this.prepareNewGame();
        });

        document.getElementById('change-duel-setup-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.dom.duelWinnerScreen.classList.add('hidden');
            this.dom.hud.classList.add('hidden');
            this.dom.duelScreen.classList.remove('hidden');
            this.state = 'MENU';
        });

        document.getElementById('duel-to-menu-btn').addEventListener('click', () => {
            this.sound.playClick();
            this.returnToMenu();
        });

        // Audio Mute Toggle
        this.dom.soundBtn.addEventListener('click', () => {
            const muted = this.sound.toggleMute();
            this.dom.soundBtn.textContent = muted ? '🔇' : '🔊';
        });
    }

    renderLevelGrid() {
        const worldNames = {
            1: 'Babak 1: Hutan Penjumlahan (+)',
            2: 'Babak 2: Lembah Pengurangan (-)',
            3: 'Babak 3: Gunung Perkalian (×)',
            4: 'Babak 4: Samudra Pembagian (÷)',
            5: 'Babak 5: Kuil Master Matematika (Mix)'
        };
        this.dom.currentWorldTitle.textContent = worldNames[this.selectedWorldTab] || 'Daftar Level';

        const filteredLevels = this.mathGen.levelDefs.filter(l => l.world === this.selectedWorldTab);
        let gridHtml = '';

        filteredLevels.forEach(lvl => {
            const isUnlocked = lvl.id <= this.unlockedLevel;
            const stars = this.levelStars[lvl.id] || 0;
            let starDisplay = isUnlocked ? ('⭐'.repeat(stars) + '☆'.repeat(3 - stars)) : '🔒';

            gridHtml += `
                <div class="level-card ${isUnlocked ? '' : 'locked'}" data-level-id="${lvl.id}">
                    <div class="level-card-top">
                        <span class="level-num">Level ${lvl.id}</span>
                        <span class="level-stars">${starDisplay}</span>
                    </div>
                    <div class="level-title">${lvl.name}</div>
                    <div class="level-target">🎯 Target: ${lvl.target} Soal</div>
                </div>
            `;
        });

        this.dom.levelGrid.innerHTML = gridHtml;

        this.dom.levelGrid.querySelectorAll('.level-card:not(.locked)').forEach(card => {
            card.addEventListener('click', () => {
                const lvlId = parseInt(card.dataset.levelId, 10);
                this.sound.playClick();
                this.startLevel(lvlId);
            });
        });
    }

    startLevel(levelId) {
        this.gameMode = 'level';
        this.currentLevelId = levelId;
        this.maxLives = 3;
        this.dom.levelsScreen.classList.add('hidden');
        this.dom.victoryScreen.classList.add('hidden');
        this.prepareNewGame();
    }

    prepareNewGame() {
        this.score = 0;
        this.streak = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.levelCorrectCount = 0;
        this.levelWrongCount = 0;
        this.missedQuestions = [];

        // Reset Bird 1 (P1)
        this.bird.x = 85;
        this.bird.y = 350;
        this.bird.vy = 0;
        this.bird.rotation = 0;
        this.bird.invulnerableTimer = 0;
        this.bird.lives = this.maxLives;
        this.bird.score = 0;
        this.bird.correctCount = 0;
        this.bird.wrongCount = 0;
        this.bird.hasShield = false;
        this.bird.doubleScoreCount = 0;

        // Reset Bird 2 (P2 / BOT)
        this.bird2.x = 135;
        this.bird2.y = 350;
        this.bird2.vy = 0;
        this.bird2.rotation = 0;
        this.bird2.invulnerableTimer = 0;
        this.bird2.lives = 3;
        this.bird2.score = 0;
        this.bird2.correctCount = 0;
        this.bird2.wrongCount = 0;
        this.bird2.hasShield = false;
        this.bird2.doubleScoreCount = 0;
        this.bird2.botJumpCooldown = 0;
        this.bird2.botCurrentGate = null;
        this.slowMoTimer = 0;

        // Configure Game Mode Specifics
        if (this.gameMode === 'level') {
            const levelDef = this.mathGen.getLevel(this.currentLevelId);
            this.levelTarget = levelDef.target;
            this.scrollSpeed = levelDef.speed;
            this.worldTheme = levelDef.theme;
            this.dom.soloTopBar.classList.remove('hidden');
            this.dom.duelTopBar.classList.add('hidden');
            this.dom.duelTouchControls.classList.add('hidden');
            this.dom.soloTopBar.style.display = 'flex';
            this.dom.duelTopBar.style.display = 'none';
            this.dom.duelTouchControls.style.display = 'none';
            this.dom.hudLevelBadge.textContent = `LV ${this.currentLevelId}`;
            this.dom.operationLabel.textContent = `${levelDef.worldName.toUpperCase()} - ${levelDef.name}`;
            this.dom.hudProgressContainer.style.display = 'flex';
            this.updateProgressBar();
            this.updateLivesDisplay();
            this.dom.readyPrompt.textContent = '👆 Ketuk Layar / Tekan SPASI untuk Terbang!';
        } else if (this.gameMode === 'duel') {
            this.worldTheme = 'temple';
            this.scrollSpeed = 2.4;
            this.bird2.isBot = (this.duelOpponent === 'bot');

            if (this.botDifficulty === 'easy') this.bird2.botAccuracy = 0.70;
            else if (this.botDifficulty === 'medium') this.bird2.botAccuracy = 0.88;
            else this.bird2.botAccuracy = 0.98;

            this.bird2.name = this.bird2.isBot ? (this.botDifficulty === 'easy' ? 'Budi Bot' : this.botDifficulty === 'medium' ? 'Prof. Owl' : 'Einstein') : 'Pemain 2';
            this.bird2.tag = this.bird2.isBot ? 'BOT' : 'P2';

            this.dom.soloTopBar.classList.add('hidden');
            this.dom.duelTopBar.classList.remove('hidden');
            this.dom.duelTouchControls.classList.toggle('hidden', this.bird2.isBot); // Show touch only if 2 humans
            this.dom.soloTopBar.style.display = 'none';
            this.dom.duelTopBar.style.display = 'flex';
            this.dom.duelTouchControls.style.display = this.bird2.isBot ? 'none' : 'flex';

            this.dom.duelP2HudName.textContent = this.bird2.tag;
            this.dom.duelTargetBadge.textContent = (this.duelTargetMode === 'survival') ? '🔥 SURVIVAL K.O.' : `🎯 ${this.duelTargetScore}`;
            this.dom.operationLabel.textContent = `DUEL MATEMATIKA (${this.duelOperation.toUpperCase()})`;
            
            this.updateDuelHUD();
            this.dom.readyPrompt.textContent = this.bird2.isBot ? '👆 Tekan SPASI / [W] untuk Memulai Duel!' : '👆 P1: [W] | P2: [↑] untuk Duel!';
        } else {
            // Endless Mode
            this.worldTheme = 'forest';
            if (this.difficulty === 'easy') this.scrollSpeed = 2.2;
            else if (this.difficulty === 'medium') this.scrollSpeed = 2.7;
            else this.scrollSpeed = 3.2;
            this.dom.soloTopBar.classList.remove('hidden');
            this.dom.duelTopBar.classList.add('hidden');
            this.dom.duelTouchControls.classList.add('hidden');
            this.dom.soloTopBar.style.display = 'flex';
            this.dom.duelTopBar.style.display = 'none';
            this.dom.duelTouchControls.style.display = 'none';
            this.dom.hudLevelBadge.textContent = 'BEBAS';
            this.dom.hudProgressContainer.style.display = 'none';
            this.updateHUDOperationLabel();
            this.updateLivesDisplay();
            this.dom.readyPrompt.textContent = '👆 Ketuk Layar / Tekan SPASI untuk Terbang!';
        }

        // Reset Gates & Particles
        this.gates = [];
        this.particles = [];
        this.floatingTexts = [];
        this.shakeTimer = 0;

        // Generate First Gates
        this.spawnGate(this.width + 120);
        this.spawnGate(this.width + 120 + this.gateDistance);

        // Update Question HUD
        this.updateActiveQuestionHUD();

        this.dom.currentScore.textContent = '0';
        this.dom.streakBanner.classList.remove('active');

        // Hide menus & Show HUD + Ready Prompt
        this.dom.menuScreen.classList.add('hidden');
        this.dom.pauseScreen.classList.add('hidden');
        this.dom.gameoverScreen.classList.add('hidden');
        this.dom.instructionsScreen.classList.add('hidden');
        this.dom.victoryScreen.classList.add('hidden');
        this.dom.duelWinnerScreen.classList.add('hidden');
        this.dom.hud.classList.remove('hidden');
        this.dom.readyPrompt.classList.remove('hidden');

        this.state = 'READY';
    }

    startGameplay() {
        this.state = 'PLAYING';
        this.dom.readyPrompt.classList.add('hidden');
        this.sound.startBGM();
    }

    pauseGame() {
        this.state = 'PAUSED';
        this.dom.pauseScreen.classList.remove('hidden');
    }

    resumeGame() {
        this.state = 'PLAYING';
        this.dom.pauseScreen.classList.add('hidden');
    }

    returnToMenu() {
        this.dom.pauseScreen.classList.add('hidden');
        this.dom.gameoverScreen.classList.add('hidden');
        this.dom.victoryScreen.classList.add('hidden');
        this.dom.duelWinnerScreen.classList.add('hidden');
        this.dom.hud.classList.add('hidden');
        this.dom.readyPrompt.classList.add('hidden');
        this.dom.duelTouchControls.classList.add('hidden');
        this.dom.menuScreen.classList.remove('hidden');
        this.sound.stopBGM();
        this.state = 'MENU';
    }

    jumpPlayer1() {
        this.bird.vy = this.bird.jumpStrength;
        this.bird.rotation = -0.4;
        this.sound.playFlap();

        for (let i = 0; i < 4; i++) {
            this.particles.push({
                x: this.bird.x - 10,
                y: this.bird.y + 8,
                vx: -1.5 - Math.random() * 2,
                vy: 0.5 + (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 3,
                color: '#fde047',
                alpha: 0.8,
                decay: 0.04
            });
        }
    }

    jumpPlayer2() {
        this.bird2.vy = this.bird2.jumpStrength;
        this.bird2.rotation = -0.4;
        this.sound.playFlap();

        for (let i = 0; i < 4; i++) {
            this.particles.push({
                x: this.bird2.x - 10,
                y: this.bird2.y + 8,
                vx: -1.5 - Math.random() * 2,
                vy: 0.5 + (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 3,
                color: '#38bdf8',
                alpha: 0.8,
                decay: 0.04
            });
        }
    }

    spawnGate(startX) {
        let problem;
        if (this.gameMode === 'level') {
            problem = this.mathGen.generateForLevel(this.currentLevelId, 2);
        } else if (this.gameMode === 'duel') {
            problem = this.mathGen.generateProblem(this.duelOperation, 'medium', 2);
        } else {
            problem = this.mathGen.generateProblem(this.operation, this.difficulty, 2);
        }

        // ~38% chance of spawning a special powerup on the correct slot
        let assignedPowerup = null;
        if (Math.random() < 0.38) {
            const r = Math.random();
            if (r < 0.35) assignedPowerup = 'heal';         // 💖 Pemulihan Nyawa (+1 ❤️)
            else if (r < 0.65) assignedPowerup = 'shield';   // 🛡️ Perisai Pelindung
            else if (r < 0.85) assignedPowerup = 'double';   // ⚡ 2X Poin
            else assignedPowerup = 'slowmo';                 // ❄️ Waktu Lambat
        }

        const slotHeight = 140;
        const slots = [
            { 
                y: 265, 
                val: problem.options[0], 
                isCorrect: problem.options[0] === problem.answer,
                powerup: (problem.options[0] === problem.answer) ? assignedPowerup : null 
            },
            { 
                y: 515, 
                val: problem.options[1], 
                isCorrect: problem.options[1] === problem.answer,
                powerup: (problem.options[1] === problem.answer) ? assignedPowerup : null 
            }
        ];

        this.gates.push({
            x: startX,
            width: 76,
            problem: problem,
            slots: slots,
            slotHeight: slotHeight,
            passed: false,
            p1Evaluated: false,
            p2Evaluated: false
        });
    }

    updateActiveQuestionHUD() {
        const firstUnpassedGate = this.gates.find(g => !g.passed);
        if (firstUnpassedGate) {
            this.dom.questionText.textContent = `${firstUnpassedGate.problem.questionText} = ?`;
        }
    }

    updateProgressBar() {
        if (this.gameMode !== 'level') return;
        const pct = Math.min(100, (this.levelCorrectCount / this.levelTarget) * 100);
        this.dom.hudProgressFill.style.width = `${pct}%`;
        this.dom.hudProgressText.textContent = `${this.levelCorrectCount}/${this.levelTarget}`;
    }

    updateDuelHUD() {
        this.dom.duelP1Score.textContent = `⭐ ${this.bird.score}`;
        this.dom.duelP1Lives.textContent = '❤️'.repeat(Math.max(0, this.bird.lives)) + '🖤'.repeat(Math.max(0, 3 - this.bird.lives));

        this.dom.duelP2Score.textContent = `⭐ ${this.bird2.score}`;
        this.dom.duelP2Lives.textContent = '💙'.repeat(Math.max(0, this.bird2.lives)) + '🖤'.repeat(Math.max(0, 3 - this.bird2.lives));
    }

    updateHUDOperationLabel() {
        const labels = {
            add: 'PENJUMLAHAN (+)',
            sub: 'PENGURANGAN (-)',
            mul: 'PERKALIAN (×)',
            div: 'PEMBAGIAN (÷)',
            mixed: 'CAMPURAN (MIX)'
        };
        this.dom.operationLabel.textContent = labels[this.operation] || 'BERHITUNG';
    }

    updateLivesDisplay() {
        this.dom.hearts.forEach((heartEl, index) => {
            if (index < this.maxLives) {
                heartEl.style.display = 'inline-block';
                heartEl.classList.toggle('lost', index >= this.bird.lives);
            } else {
                heartEl.style.display = 'none';
            }
        });
    }

    triggerScreenShake(intensity = 10, duration = 15) {
        this.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }

    // ==========================================
    // COLLISION & SCORING HANDLERS WITH POWERUPS
    // ==========================================

    handleWrongAnswer(gate, chosenSlot) {
        if (this.gameMode === 'duel') {
            this.handleDuelWrong(1, gate, chosenSlot);
            return;
        }

        // Shield Absorption
        if (this.bird.hasShield) {
            this.bird.hasShield = false;
            this.bird.invulnerableTimer = 60;
            this.sound.playShieldBreak();
            this.triggerScreenShake(8, 12);
            this.floatingTexts.push({
                text: '🛡️ SHIELD MELINDUNGI!',
                x: this.bird.x + 20,
                y: this.bird.y - 20,
                color: '#38bdf8',
                vy: -1.5,
                alpha: 1,
                size: 20
            });
            for (let i = 0; i < 14; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 2 + Math.random() * 4;
                this.particles.push({
                    x: this.bird.x,
                    y: this.bird.y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    size: 3 + Math.random() * 3,
                    color: '#38bdf8',
                    alpha: 1,
                    decay: 0.035,
                    shape: 'star'
                });
            }
            return;
        }

        this.wrongCount++;
        this.levelWrongCount++;
        this.streak = 0;
        this.dom.streakBanner.classList.remove('active');
        this.sound.playWrong();
        this.triggerScreenShake(12, 18);

        this.missedQuestions.push({
            question: gate.problem.questionText,
            correct: gate.problem.answer,
            chosen: chosenSlot ? chosenSlot.val : 'Tabrakan Pipa'
        });

        this.floatingTexts.push({
            text: '❌ SALAH!',
            x: this.bird.x + 20,
            y: this.bird.y - 20,
            color: '#ef4444',
            vy: -1.5,
            alpha: 1,
            size: 20
        });

        this.bird.lives--;
        this.updateLivesDisplay();
        this.bird.invulnerableTimer = 60;

        if (this.bird.lives <= 0) {
            this.gameOver();
        }
    }

    handleCorrectAnswer(gate, slot) {
        if (this.gameMode === 'duel') {
            this.handleDuelCorrect(1, gate, slot);
            return;
        }

        this.correctCount++;
        this.levelCorrectCount++;
        this.streak++;
        
        let earnedScore = 100 + Math.min(this.streak * 20, 150);
        if (this.bird.doubleScoreCount > 0) {
            earnedScore *= 2;
            this.bird.doubleScoreCount--;
        }

        this.score += earnedScore;
        this.dom.currentScore.textContent = this.score;

        // Trigger Power-Up Effects
        if (slot.powerup === 'heal') {
            if (this.bird.lives < this.maxLives) {
                this.bird.lives++;
                this.sound.playHeal();
                this.updateLivesDisplay();
                this.floatingTexts.push({ text: '💖 +1 ❤️ PULIH!', x: this.bird.x + 20, y: this.bird.y - 35, color: '#10b981', vy: -1.8, alpha: 1, size: 20 });
            } else {
                this.sound.playCorrect();
            }
        } else if (slot.powerup === 'shield') {
            this.bird.hasShield = true;
            this.sound.playShield();
            this.floatingTexts.push({ text: '🛡️ SHIELD AKTIF!', x: this.bird.x + 20, y: this.bird.y - 35, color: '#38bdf8', vy: -1.8, alpha: 1, size: 20 });
        } else if (slot.powerup === 'double') {
            this.bird.doubleScoreCount = 3;
            this.sound.playPowerup();
            this.floatingTexts.push({ text: '⚡ 2X POIN (3 SOAL)!', x: this.bird.x + 20, y: this.bird.y - 35, color: '#f59e0b', vy: -1.8, alpha: 1, size: 20 });
        } else if (slot.powerup === 'slowmo') {
            this.slowMoTimer = 360; // 6s
            this.sound.playPowerup();
            this.floatingTexts.push({ text: '❄️ WAKTU LAMBAT!', x: this.bird.x + 20, y: this.bird.y - 35, color: '#67e8f9', vy: -1.8, alpha: 1, size: 20 });
        } else {
            if (this.streak >= 3) {
                this.sound.playCombo(this.streak);
                this.dom.streakBanner.textContent = `🔥 COMBO x${this.streak}! (+${earnedScore} Poin)`;
                this.dom.streakBanner.classList.add('active');
            } else {
                this.sound.playCorrect();
            }
        }

        this.floatingTexts.push({
            text: `+${earnedScore} ⭐`,
            x: this.bird.x + 20,
            y: this.bird.y - 15,
            color: '#10b981',
            vy: -1.8,
            alpha: 1,
            size: 22
        });

        // Star Particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            this.particles.push({
                x: gate.x + gate.width / 2,
                y: slot.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4 + Math.random() * 6,
                color: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)],
                alpha: 1,
                decay: 0.025,
                shape: Math.random() < 0.5 ? 'star' : 'circle'
            });
        }

        this.updateProgressBar();

        if (this.gameMode === 'level' && this.levelCorrectCount >= this.levelTarget) {
            this.levelVictory();
        }
    }

    // Duel Player 1 / Player 2 Actions (dengan Power-Up Spesial)
    handleDuelCorrect(playerNum, gate, slot) {
        const p = (playerNum === 1) ? this.bird : this.bird2;
        let earnedPoints = 1;
        if (p.doubleScoreCount > 0) {
            earnedPoints = 2;
            p.doubleScoreCount--;
        }

        p.score += earnedPoints;
        p.correctCount++;

        // Trigger Power-Up Effects
        if (slot.powerup === 'heal') {
            if (p.lives < 3) {
                p.lives++;
                this.sound.playHeal();
                this.floatingTexts.push({ text: `${p.tag} 💖 +1 ❤️ PULIH!`, x: p.x + 15, y: p.y - 35, color: '#10b981', vy: -1.8, alpha: 1, size: 20 });
            } else {
                this.sound.playCorrect();
            }
        } else if (slot.powerup === 'shield') {
            p.hasShield = true;
            this.sound.playShield();
            this.floatingTexts.push({ text: `${p.tag} 🛡️ SHIELD AKTIF!`, x: p.x + 15, y: p.y - 35, color: '#38bdf8', vy: -1.8, alpha: 1, size: 20 });
        } else if (slot.powerup === 'double') {
            p.doubleScoreCount = 3;
            this.sound.playPowerup();
            this.floatingTexts.push({ text: `${p.tag} ⚡ 2X POIN!`, x: p.x + 15, y: p.y - 35, color: '#f59e0b', vy: -1.8, alpha: 1, size: 20 });
        } else if (slot.powerup === 'slowmo') {
            this.slowMoTimer = 360;
            this.sound.playPowerup();
            this.floatingTexts.push({ text: '❄️ WAKTU LAMBAT!', x: p.x + 15, y: p.y - 35, color: '#67e8f9', vy: -1.8, alpha: 1, size: 20 });
        } else {
            this.sound.playCorrect();
        }

        this.floatingTexts.push({
            text: `${p.tag} +${earnedPoints} ⭐`,
            x: p.x + 15,
            y: p.y - 15,
            color: (playerNum === 1) ? '#f59e0b' : '#38bdf8',
            vy: -1.8,
            alpha: 1,
            size: 20
        });

        // Spawn spark particles
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            this.particles.push({
                x: p.x,
                y: p.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 4 + Math.random() * 4,
                color: (playerNum === 1) ? '#fde047' : '#38bdf8',
                alpha: 1,
                decay: 0.03,
                shape: 'star'
            });
        }

        this.updateDuelHUD();
        this.checkDuelWinCondition();
    }

    handleDuelWrong(playerNum, gate, chosenSlot) {
        const p = (playerNum === 1) ? this.bird : this.bird2;

        // Shield Absorption in Duel
        if (p.hasShield) {
            p.hasShield = false;
            p.invulnerableTimer = 60;
            this.sound.playShieldBreak();
            if (playerNum === 1) this.triggerScreenShake(8, 10);
            this.floatingTexts.push({
                text: `${p.tag} 🛡️ SHIELD MELINDUNGI!`,
                x: p.x + 15,
                y: p.y - 20,
                color: '#38bdf8',
                vy: -1.5,
                alpha: 1,
                size: 18
            });
            for (let i = 0; i < 14; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 2 + Math.random() * 4;
                this.particles.push({
                    x: p.x,
                    y: p.y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    size: 3 + Math.random() * 3,
                    color: '#38bdf8',
                    alpha: 1,
                    decay: 0.035,
                    shape: 'star'
                });
            }
            return;
        }

        p.lives--;
        p.wrongCount++;
        p.invulnerableTimer = 60;

        this.sound.playWrong();
        if (playerNum === 1) this.triggerScreenShake(10, 15);

        this.floatingTexts.push({
            text: `${p.tag} -1 ❤️`,
            x: p.x + 15,
            y: p.y - 15,
            color: '#ef4444',
            vy: -1.5,
            alpha: 1,
            size: 18
        });

        this.updateDuelHUD();
        this.checkDuelWinCondition();
    }

    checkDuelWinCondition() {
        if (this.duelTargetMode === 'survival' || this.duelTargetScore === Infinity) {
            // Mode Bertahan Hidup Hingga Salah Satu Kalah (K.O.)
            if (this.bird.lives <= 0 && this.bird2.lives <= 0) {
                if (this.bird.score >= this.bird2.score) this.duelVictory(1);
                else this.duelVictory(2);
            } else if (this.bird2.lives <= 0) {
                this.duelVictory(1);
            } else if (this.bird.lives <= 0) {
                this.duelVictory(2);
            }
        } else {
            // Mode Balapan Skor
            if (this.bird.score >= this.duelTargetScore || this.bird2.lives <= 0) {
                this.duelVictory(1);
            } else if (this.bird2.score >= this.duelTargetScore || this.bird.lives <= 0) {
                this.duelVictory(2);
            }
        }
    }

    duelVictory(winnerNum) {
        this.state = 'DUEL_WINNER';
        this.sound.stopBGM();
        this.sound.playDuelWin();

        const p1Acc = Math.round((this.bird.correctCount / Math.max(1, this.bird.correctCount + this.bird.wrongCount)) * 100);
        const p2Acc = Math.round((this.bird2.correctCount / Math.max(1, this.bird2.correctCount + this.bird2.wrongCount)) * 100);

        this.dom.duelResP1Score.textContent = this.bird.score;
        this.dom.duelResP1Acc.textContent = `Akurasi: ${p1Acc}%`;
        this.dom.duelResP1Lives.textContent = '❤️'.repeat(Math.max(0, this.bird.lives)) + '🖤'.repeat(Math.max(0, 3 - this.bird.lives));

        this.dom.duelResP2Name.textContent = `🔵 ${this.bird2.name}`;
        this.dom.duelResP2Score.textContent = this.bird2.score;
        this.dom.duelResP2Acc.textContent = `Akurasi: ${p2Acc}%`;
        this.dom.duelResP2Lives.textContent = '💙'.repeat(Math.max(0, this.bird2.lives)) + '🖤'.repeat(Math.max(0, 3 - this.bird2.lives));

        if (winnerNum === 1) {
            this.dom.duelWinnerTitle.textContent = '🏆 PEMAIN 1 MENANG!';
            this.dom.duelWinnerTitle.style.color = '#f59e0b';
            this.dom.duelWinnerSubtitle.textContent = 'Hebat! Kecepatan dan ketepatanmu luar biasa!';
        } else {
            this.dom.duelWinnerTitle.textContent = `🏆 ${this.bird2.name.toUpperCase()} MENANG!`;
            this.dom.duelWinnerTitle.style.color = '#38bdf8';
            this.dom.duelWinnerSubtitle.textContent = 'Pertandingan sengit! Ayo coba tanding ulang!';
        }

        this.dom.duelWinnerScreen.classList.remove('hidden');
    }

    levelVictory() {
        this.state = 'VICTORY';
        this.sound.stopBGM();
        this.sound.playLevelVictory();

        let stars = 3;
        if (this.levelWrongCount === 1) stars = 2;
        else if (this.levelWrongCount >= 2) stars = 1;

        const prevStars = this.levelStars[this.currentLevelId] || 0;
        if (stars > prevStars) {
            this.levelStars[this.currentLevelId] = stars;
            localStorage.setItem('math_bird_stars', JSON.stringify(this.levelStars));
        }

        if (this.currentLevelId >= this.unlockedLevel && this.currentLevelId < 20) {
            this.unlockedLevel = this.currentLevelId + 1;
            localStorage.setItem('math_bird_unlocked_level', this.unlockedLevel.toString());
        }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('math_bird_highscore', this.highScore.toString());
        }

        const lvlDef = this.mathGen.getLevel(this.currentLevelId);
        this.dom.victoryLevelName.textContent = `Level ${this.currentLevelId}: ${lvlDef.name}`;
        this.dom.victoryScore.textContent = this.score;
        
        const total = this.levelCorrectCount + this.levelWrongCount;
        const acc = Math.round((this.levelCorrectCount / total) * 100);
        this.dom.victoryAccuracy.textContent = `${acc}%`;
        this.dom.victoryTime.textContent = `${this.levelCorrectCount}/${this.levelTarget}`;

        this.dom.victoryStars.forEach((starEl, idx) => {
            starEl.className = 'victory-star';
            setTimeout(() => {
                if (idx < stars) {
                    starEl.classList.add('earned');
                    this.sound.playStarDing(idx + 1);
                } else {
                    starEl.classList.add('dim');
                }
            }, (idx + 1) * 350);
        });

        const nextBtn = document.getElementById('next-level-btn');
        if (this.currentLevelId >= 20) {
            nextBtn.querySelector('span').textContent = 'Tamat! Kembali ke Menu 🏆';
        } else {
            nextBtn.querySelector('span').textContent = 'Level Berikutnya ➡️';
        }

        this.dom.victoryScreen.classList.remove('hidden');
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.sound.stopBGM();
        this.sound.playGameOver();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('math_bird_highscore', this.highScore.toString());
        }

        const total = this.correctCount + this.wrongCount;
        const accuracy = total > 0 ? Math.round((this.correctCount / total) * 100) : 100;

        this.dom.finalScore.textContent = this.score;
        this.dom.finalHighScore.textContent = this.highScore;
        this.dom.finalAccuracy.textContent = `${accuracy}%`;

        if (accuracy >= 80 && this.score > 200) {
            this.dom.gameoverTitle.textContent = 'Luar Biasa! 🏆';
            this.dom.gameoverSubtitle.textContent = 'Kemampuan berhitungmu sangat hebat!';
        } else {
            this.dom.gameoverTitle.textContent = 'Permainan Selesai!';
            this.dom.gameoverSubtitle.textContent = 'Terus berlatih untuk menjadi lebih pintar!';
        }

        let evalHtml = '';
        if (this.missedQuestions.length === 0 && this.correctCount > 0) {
            evalHtml = `
                <div class="perfect-score-banner">
                    🌟 <strong>Nilai Sempurna!</strong> Kamu menjawab semua soal matematika dengan benar tanpa ada yang keliru!
                </div>
            `;
        } else if (this.missedQuestions.length > 0) {
            evalHtml = `
                <div class="missed-questions-box">
                    <h4>Catatan Belajar (Soal yang Keliru):</h4>
                    ${this.missedQuestions.slice(0, 4).map(item => `
                        <div class="missed-item">
                            <span>${item.question} = <strong class="correct-ans">${item.correct}</strong></span>
                            <span>(Pilihanmu: ${item.chosen})</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        this.dom.evaluationContainer.innerHTML = evalHtml;

        this.dom.gameoverScreen.classList.remove('hidden');
    }

    // ==========================================
    // MAIN GAME LOOP & UPDATES
    // ==========================================

    loop(time) {
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        if (this.shakeTimer > 0) {
            this.shakeTimer--;
        }

        this.updateBackground(dt);

        if (this.state === 'MENU' || this.state === 'READY') {
            this.bird.y = 350 + Math.sin(performance.now() * 0.004) * 12;
            this.bird.rotation = Math.sin(performance.now() * 0.004) * 0.1;
            this.bird.wingPhase += 0.15;

            if (this.gameMode === 'duel') {
                this.bird2.y = 350 + Math.sin(performance.now() * 0.004 + 1.2) * 12;
                this.bird2.rotation = Math.sin(performance.now() * 0.004 + 1.2) * 0.1;
                this.bird2.wingPhase += 0.15;
            }
            return;
        }

        if (this.state !== 'PLAYING') return;

        // Update Bird 1 (P1)
        this.updateBirdPhysics(this.bird);

        // Update Bird 2 (P2 / Bot)
        if (this.gameMode === 'duel') {
            this.updateBirdPhysics(this.bird2);
            if (this.bird2.isBot) {
                this.updateBotAI();
            }
        }

        let currentSpeed = this.scrollSpeed;
        if (this.slowMoTimer > 0) {
            this.slowMoTimer--;
            currentSpeed *= 0.65;
        }

        // Update Gates & Collisions
        for (let i = 0; i < this.gates.length; i++) {
            const gate = this.gates[i];
            gate.x -= currentSpeed;

            // Check Collision for P1
            this.checkGateCollisionForBird(this.bird, gate, 1);

            // Check Collision for P2 / BOT
            if (this.gameMode === 'duel') {
                this.checkGateCollisionForBird(this.bird2, gate, 2);
            }

            // Gate Passed
            if (!gate.passed && gate.x + gate.width < Math.min(this.bird.x, this.bird2.x)) {
                gate.passed = true;
                this.updateActiveQuestionHUD();
            }
        }

        // Spawn new gates
        if (this.gates.length > 0 && this.gates[0].x + this.gates[0].width < -50) {
            this.gates.shift();
            const lastGate = this.gates[this.gates.length - 1];
            const newX = lastGate ? lastGate.x + this.gateDistance : this.width + 100;
            this.spawnGate(newX);
        }

        // Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Floating Texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.alpha -= 0.02;
            if (ft.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    updateBirdPhysics(bird) {
        bird.vy += bird.gravity;
        bird.y += bird.vy;
        bird.wingPhase += 0.25;

        if (bird.vy < 0) {
            bird.rotation = Math.max(-0.45, bird.rotation - 0.08);
        } else {
            bird.rotation = Math.min(1.2, bird.rotation + 0.04);
        }

        if (bird.invulnerableTimer > 0) {
            bird.invulnerableTimer--;
        }

        const ceilingY = 80;
        const groundY = this.height - 40;

        if (bird.y - bird.radius < ceilingY) {
            bird.y = ceilingY + bird.radius;
            bird.vy = 0;
        }

        if (bird.y + bird.radius > groundY) {
            bird.y = groundY - bird.radius;
            if (bird.invulnerableTimer === 0) {
                if (this.gameMode === 'duel') {
                    this.handleDuelWrong(bird === this.bird ? 1 : 2, this.gates[0] || { problem: { questionText: 'Jatuh', answer: '!' } }, null);
                } else {
                    this.handleWrongAnswer(this.gates[0] || { problem: { questionText: 'Jatuh', answer: '!' } }, null);
                }
            }
        }
    }

    /**
     * AI Controller for Bot
     */
    updateBotAI() {
        if (this.bird2.botJumpCooldown > 0) {
            this.bird2.botJumpCooldown--;
        }

        // Find closest upcoming gate
        const nextGate = this.gates.find(g => g.x + g.width > this.bird2.x - 30);
        if (!nextGate) return;

        // Bot makes decision for new gate
        if (this.bird2.botCurrentGate !== nextGate) {
            this.bird2.botCurrentGate = nextGate;
            const willBeCorrect = Math.random() < this.bird2.botAccuracy;
            const correctSlot = nextGate.slots.find(s => s.isCorrect);
            const wrongSlot = nextGate.slots.find(s => !s.isCorrect);
            
            const targetSlot = willBeCorrect ? correctSlot : (wrongSlot || correctSlot);
            this.bird2.botTargetY = targetSlot ? targetSlot.y : 265;
        }

        // Steer bot toward target Y
        const targetY = this.bird2.botTargetY;
        const currentY = this.bird2.y;

        // If bot is lower than target and falling/cooldown ready -> jump!
        if (currentY > targetY + 8 && this.bird2.vy > -1.2 && this.bird2.botJumpCooldown === 0) {
            this.jumpPlayer2();
            this.bird2.botJumpCooldown = 8 + Math.floor(Math.random() * 8);
        }
    }

    checkGateCollisionForBird(bird, gate, playerNum) {
        const birdRight = bird.x + bird.radius - 4;
        const birdLeft = bird.x - bird.radius + 4;
        const birdTop = bird.y - bird.radius + 4;
        const birdBottom = bird.y + bird.radius - 4;

        const gateLeft = gate.x;
        const gateRight = gate.x + gate.width;

        if (birdRight > gateLeft && birdLeft < gateRight) {
            let inSlot = null;
            for (const slot of gate.slots) {
                const halfH = gate.slotHeight / 2 - 8;
                if (birdTop >= slot.y - halfH && birdBottom <= slot.y + halfH) {
                    inSlot = slot;
                    break;
                }
            }

            const evaluatedProp = (playerNum === 1) ? 'p1Evaluated' : 'p2Evaluated';

            if (!inSlot && bird.invulnerableTimer === 0) {
                if (this.gameMode === 'duel') {
                    this.handleDuelWrong(playerNum, gate, null);
                } else {
                    this.handleWrongAnswer(gate, null);
                }
            } else if (inSlot && !gate[evaluatedProp]) {
                gate[evaluatedProp] = true;
                if (inSlot.isCorrect) {
                    if (this.gameMode === 'duel') {
                        this.handleDuelCorrect(playerNum, gate, inSlot);
                    } else {
                        this.handleCorrectAnswer(gate, inSlot);
                    }
                } else if (bird.invulnerableTimer === 0) {
                    if (this.gameMode === 'duel') {
                        this.handleDuelWrong(playerNum, gate, inSlot);
                    } else {
                        this.handleWrongAnswer(gate, inSlot);
                    }
                }
            }
        }
    }

    updateBackground(dt) {
        let currentSpeed = this.scrollSpeed;
        if (this.slowMoTimer > 0) currentSpeed *= 0.65;

        for (const cloud of this.clouds) {
            cloud.x -= cloud.speed;
            if (cloud.x < -120) cloud.x = this.width + 60;
        }

        for (const s of this.mathSymbols) {
            s.x -= s.speed;
            s.rot += s.rotSpeed;
            if (s.x < -40) {
                s.x = this.width + 40;
                s.y = Math.random() * (this.height - 120);
            }
        }

        this.bgOffset = (this.bgOffset + currentSpeed * 0.4) % this.width;
    }

    // ==========================================
    // RENDERING
    // ==========================================

    render() {
        this.ctx.save();

        if (this.shakeTimer > 0) {
            const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
            const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
            this.ctx.translate(offsetX, offsetY);
        }

        this.drawSky();
        this.drawHills();
        this.drawMathSymbols();
        this.drawClouds();
        this.drawGates();
        this.drawGround();
        this.drawParticles();

        // Draw Player 1 (Only show tag badge in duel mode)
        const p1Tag = (this.gameMode === 'duel') ? 'P1' : null;
        this.drawSingleBird(this.bird, 'yellow', p1Tag);

        // Draw Player 2 / Bot in Duel Mode
        if (this.gameMode === 'duel') {
            this.drawSingleBird(this.bird2, 'blue', this.bird2.tag || 'BOT');
        }

        this.drawFloatingTexts();

        this.ctx.restore();
    }

    drawSky() {
        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        
        switch (this.worldTheme) {
            case 'canyon':
                skyGrad.addColorStop(0, '#f97316');
                skyGrad.addColorStop(0.5, '#fb923c');
                skyGrad.addColorStop(1, '#fde047');
                break;
            case 'mountain':
                skyGrad.addColorStop(0, '#312e81');
                skyGrad.addColorStop(0.5, '#6366f1');
                skyGrad.addColorStop(1, '#a5b4fc');
                break;
            case 'ocean':
                skyGrad.addColorStop(0, '#0284c7');
                skyGrad.addColorStop(0.5, '#38bdf8');
                skyGrad.addColorStop(1, '#99f6e4');
                break;
            case 'temple':
                skyGrad.addColorStop(0, '#1e1b4b');
                skyGrad.addColorStop(0.5, '#4338ca');
                skyGrad.addColorStop(1, '#818cf8');
                break;
            case 'forest':
            default:
                skyGrad.addColorStop(0, '#38bdf8');
                skyGrad.addColorStop(0.55, '#7dd3fc');
                skyGrad.addColorStop(1, '#bae6fd');
        }

        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawHills() {
        this.ctx.save();
        let farColor = '#6ee7b7';
        let nearColor = '#34d399';

        if (this.worldTheme === 'canyon') {
            farColor = '#fdba74'; nearColor = '#fb923c';
        } else if (this.worldTheme === 'mountain') {
            farColor = '#818cf8'; nearColor = '#4f46e5';
        } else if (this.worldTheme === 'ocean') {
            farColor = '#2dd4bf'; nearColor = '#0d9488';
        } else if (this.worldTheme === 'temple') {
            farColor = '#a5b4fc'; nearColor = '#6366f1';
        }

        this.ctx.fillStyle = farColor;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 70);
        for (let x = 0; x <= this.width; x += 30) {
            const y = this.height - 110 + Math.sin((x + this.bgOffset * 0.2) * 0.015) * 35;
            this.ctx.lineTo(x, y);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.fill();

        this.ctx.fillStyle = nearColor;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height - 50);
        for (let x = 0; x <= this.width; x += 25) {
            const y = this.height - 85 + Math.sin((x + this.bgOffset * 0.5) * 0.02) * 20;
            this.ctx.lineTo(x, y);
        }
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawClouds() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        for (const c of this.clouds) {
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, 22 * c.scale, 0, Math.PI * 2);
            this.ctx.arc(c.x + 20 * c.scale, c.y - 10 * c.scale, 28 * c.scale, 0, Math.PI * 2);
            this.ctx.arc(c.x + 45 * c.scale, c.y, 24 * c.scale, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    drawMathSymbols() {
        this.ctx.save();
        for (const s of this.mathSymbols) {
            this.ctx.save();
            this.ctx.translate(s.x, s.y);
            this.ctx.rotate(s.rot);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
            this.ctx.font = `800 ${s.size}px Fredoka, Outfit, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(s.char, 0, 0);
            this.ctx.restore();
        }
        this.ctx.restore();
    }

    drawGates() {
        for (const gate of this.gates) {
            const w = gate.width;
            const x = gate.x;

            if (x < -w || x > this.width + 50) continue;

            const slotH = gate.slotHeight;
            const topSlotY = gate.slots[0].y;
            const btmSlotY = gate.slots[1].y;

            // Pipe Segments
            const topPipeEnd = topSlotY - slotH / 2;
            this.drawPipeColumn(x, 0, w, topPipeEnd, true);

            const midPipeStart = topSlotY + slotH / 2;
            const midPipeEnd = btmSlotY - slotH / 2;
            this.drawPipeColumn(x, midPipeStart, w, midPipeEnd - midPipeStart, false);

            const btmPipeStart = btmSlotY + slotH / 2;
            const groundY = this.height - 40;
            this.drawPipeColumn(x, btmPipeStart, w, groundY - btmPipeStart, false);

            // Answer Badges with Powerup Auras
            gate.slots.forEach(slot => {
                this.drawAnswerBadge(x + w / 2, slot.y, slot.val, slot.isCorrect, slot.powerup);
            });
        }
    }

    drawPipeColumn(x, y, w, h, isTopCap) {
        if (h <= 0) return;
        this.ctx.save();

        const grad = this.ctx.createLinearGradient(x, 0, x + w, 0);
        grad.addColorStop(0, '#4f46e5');
        grad.addColorStop(0.3, '#818cf8');
        grad.addColorStop(0.7, '#6366f1');
        grad.addColorStop(1, '#3730a3');

        this.ctx.fillStyle = grad;
        this.ctx.strokeStyle = '#312e81';
        this.ctx.lineWidth = 3;

        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeRect(x, y, w, h);

        const rimH = 16;
        const rimW = w + 8;
        const rimX = x - 4;
        let rimY = isTopCap ? y + h - rimH : y;

        const rimGrad = this.ctx.createLinearGradient(rimX, 0, rimX + rimW, 0);
        rimGrad.addColorStop(0, '#6366f1');
        rimGrad.addColorStop(0.5, '#a5b4fc');
        rimGrad.addColorStop(1, '#3730a3');

        this.ctx.fillStyle = rimGrad;
        this.ctx.beginPath();
        this.ctx.roundRect ? this.ctx.roundRect(rimX, rimY, rimW, rimH, 5) : this.ctx.rect(rimX, rimY, rimW, rimH);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawAnswerBadge(cx, cy, val, isCorrect, powerup) {
        this.ctx.save();

        // If slot carries special powerup, draw glowing powerup halo
        if (isCorrect && powerup) {
            this.ctx.save();
            let auraColor = 'rgba(56, 189, 248, 0.45)';
            if (powerup === 'heal') auraColor = 'rgba(16, 185, 129, 0.45)';
            else if (powerup === 'double') auraColor = 'rgba(245, 158, 11, 0.45)';
            else if (powerup === 'slowmo') auraColor = 'rgba(103, 232, 249, 0.45)';

            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 37 + Math.sin(performance.now() * 0.008) * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = auraColor;
            this.ctx.fill();
            this.ctx.restore();
        }

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 34, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 29, 0, Math.PI * 2);
        this.ctx.fillStyle = '#b45309';
        this.ctx.fill();

        const badgeGrad = this.ctx.createRadialGradient(cx - 7, cy - 7, 3, cx, cy, 27);
        badgeGrad.addColorStop(0, '#ffffff');
        badgeGrad.addColorStop(0.35, '#fef08a');
        badgeGrad.addColorStop(0.85, '#f59e0b');
        badgeGrad.addColorStop(1, '#d97706');

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 27, 0, Math.PI * 2);
        this.ctx.fillStyle = badgeGrad;
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.font = '800 26px Fredoka, Outfit, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(val, cx, cy + 1);

        // Draw Power-Up Badge Tag on Top Right
        if (isCorrect && powerup) {
            let icon = '💖';
            let tagBg = '#10b981';
            if (powerup === 'shield') { icon = '🛡️'; tagBg = '#0284c7'; }
            else if (powerup === 'double') { icon = '⚡'; tagBg = '#d97706'; }
            else if (powerup === 'slowmo') { icon = '❄️'; tagBg = '#0891b2'; }

            this.ctx.save();
            this.ctx.shadowColor = 'transparent';
            this.ctx.translate(cx + 20, cy - 20);
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 11, 0, Math.PI * 2);
            this.ctx.fillStyle = tagBg;
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.font = '11px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(icon, 0, 1);
            this.ctx.restore();
        }

        this.ctx.restore();
    }

    drawGround() {
        this.ctx.save();
        const groundY = this.height - 40;

        this.ctx.fillStyle = '#15803d';
        this.ctx.fillRect(0, groundY, this.width, 40);

        this.ctx.fillStyle = '#22c55e';
        this.ctx.fillRect(0, groundY, this.width, 10);

        this.ctx.fillStyle = '#854d0e';
        this.ctx.fillRect(0, groundY + 10, this.width, 30);

        this.ctx.fillStyle = '#a16207';
        for (let x = 10; x < this.width; x += 30) {
            this.ctx.beginPath();
            this.ctx.arc(x, groundY + 22, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawSingleBird(b, colorTheme = 'yellow', tag = null) {
        this.ctx.save();
        this.ctx.translate(b.x, b.y);
        this.ctx.rotate(b.rotation);
        this.ctx.scale(0.7, 0.7);

        // Pulsating Active Shield Forcefield
        if (b.hasShield) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 26 + Math.sin(performance.now() * 0.008) * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
            this.ctx.fill();
            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.lineWidth = 2.5;
            this.ctx.setLineDash([6, 3]);
            this.ctx.lineDashOffset = performance.now() * 0.03;
            this.ctx.stroke();
            this.ctx.restore();
        }

        if (b.invulnerableTimer > 0 && Math.floor(b.invulnerableTimer / 4) % 2 === 0) {
            this.ctx.globalAlpha = 0.4;
        }

        const isYellow = (colorTheme === 'yellow');

        // Floating Tag Badge (Only displayed in duel mode or when doubleScore powerup is active)
        const hasDoubleScore = (b.doubleScoreCount > 0);
        if (tag || hasDoubleScore) {
            this.ctx.save();
            this.ctx.rotate(-b.rotation); // Keep tag upright
            this.ctx.fillStyle = hasDoubleScore ? '#f59e0b' : (isYellow ? '#f59e0b' : '#0284c7');
            
            const badgeText = tag ? (hasDoubleScore ? `${tag}⚡` : tag) : '⚡2X';
            const badgeWidth = tag ? 32 : 38;
            const badgeOffset = -badgeWidth / 2;

            this.ctx.beginPath();
            this.ctx.roundRect ? this.ctx.roundRect(badgeOffset, -42, badgeWidth, 16, 8) : this.ctx.rect(badgeOffset, -42, badgeWidth, 16);
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '800 11px Fredoka, Outfit, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(badgeText, 0, -34);
            this.ctx.restore();
        }

        // Back Wing
        const wingY = Math.sin(b.wingPhase) * 6;
        this.ctx.save();
        this.ctx.fillStyle = isYellow ? '#d97706' : '#0369a1';
        this.ctx.beginPath();
        this.ctx.ellipse(-8, -4 + wingY, 13, 8, -0.4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // Bird Body Gradient
        const bodyGrad = this.ctx.createRadialGradient(-4, -4, 4, 0, 0, b.radius);
        if (isYellow) {
            bodyGrad.addColorStop(0, '#fef08a');
            bodyGrad.addColorStop(0.4, '#fde047');
            bodyGrad.addColorStop(1, '#f59e0b');
        } else {
            bodyGrad.addColorStop(0, '#bae6fd');
            bodyGrad.addColorStop(0.4, '#38bdf8');
            bodyGrad.addColorStop(1, '#0284c7');
        }

        this.ctx.beginPath();
        this.ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = bodyGrad;
        this.ctx.fill();
        this.ctx.strokeStyle = isYellow ? '#d97706' : '#0369a1';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Belly
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.ellipse(3, 7, 12, 10, 0.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Front Wing
        this.ctx.save();
        this.ctx.fillStyle = isYellow ? '#f59e0b' : '#0284c7';
        this.ctx.strokeStyle = isYellow ? '#b45309' : '#075985';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(-6, 2 - wingY, 14, 9, 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();

        // Eye
        const eyeX = 9;
        const eyeY = -6;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(eyeX, eyeY, 8.5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 1.8;
        this.ctx.stroke();

        // Pupil
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.arc(eyeX + 3, eyeY, 4.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Eye shine
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(eyeX + 2, eyeY - 2, 1.8, 0, Math.PI * 2);
        this.ctx.fill();

        // Beak
        this.ctx.fillStyle = '#ea580c';
        this.ctx.strokeStyle = '#c2410c';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(16, -4);
        this.ctx.lineTo(28, 0);
        this.ctx.lineTo(16, 6);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Scholar / Cyber Hat
        this.ctx.save();
        this.ctx.translate(0, -b.radius + 2);
        
        this.ctx.fillStyle = isYellow ? '#312e81' : '#1e1b4b';
        this.ctx.fillRect(-8, -4, 16, 5);

        this.ctx.fillStyle = isYellow ? '#4f46e5' : '#0284c7';
        this.ctx.strokeStyle = isYellow ? '#312e81' : '#075985';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -10);
        this.ctx.lineTo(18, -4);
        this.ctx.lineTo(0, 2);
        this.ctx.lineTo(-18, -4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#fde047';
        this.ctx.beginPath();
        this.ctx.arc(0, -4, 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#fde047';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -4);
        this.ctx.lineTo(-14, 2 + Math.sin(b.wingPhase) * 2);
        this.ctx.stroke();

        this.ctx.restore();

        this.ctx.restore();
    }

    drawParticles() {
        this.ctx.save();
        for (const p of this.particles) {
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'star') {
                this.drawStar(p.x, p.y, 5, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawFloatingTexts() {
        this.ctx.save();
        for (const ft of this.floatingTexts) {
            this.ctx.globalAlpha = Math.max(0, ft.alpha);
            this.ctx.fillStyle = ft.color;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 4;
            this.ctx.font = `800 ${ft.size}px Fredoka, Outfit, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.strokeText(ft.text, ft.x, ft.y);
            this.ctx.fillText(ft.text, ft.x, ft.y);
        }
        this.ctx.restore();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.mathBird = new MathBirdGame();
});
