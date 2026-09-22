// KataCilik - Core Game Engine & Interaction Controller

class KataCilikGame {
    constructor() {
        this.currentScreen = 'screen-home';
        this.currentMode = 'spelling'; // spelling, syllable, quiz, riddle
        this.currentWorldId = 'world-animals';
        this.currentQuestionIndex = 0;
        this.questionsList = [];
        this.score = 0;
        this.stars = 0;
        this.combo = 0;
        
        // Mode 1: Spelling State
        this.spellingTarget = '';
        this.spellingSlots = [];
        this.spellingPool = [];
        
        // Mode 2: Syllable State
        this.syllableSlots = [];
        this.syllablePool = [];

        // Save Data in LocalStorage
        this.savedData = {
            totalStars: 0,
            unlockedStickers: [],
            highScore: 0
        };

        this.loadSaveData();
        this.initDOM();
        this.initEvents();
        this.initConfetti();
        this.updateHUD();
    }

    loadSaveData() {
        try {
            const data = localStorage.getItem('katacilik_save');
            if (data) {
                this.savedData = Object.assign(this.savedData, JSON.parse(data));
            }
        } catch (e) {
            console.warn('LocalStorage not accessible', e);
        }
    }

    saveGameData() {
        try {
            localStorage.setItem('katacilik_save', JSON.stringify(this.savedData));
        } catch (e) {}
    }

    initDOM() {
        // Screens
        this.screens = {
            home: document.getElementById('screen-home'),
            worldSelect: document.getElementById('screen-world-select'),
            gameplay: document.getElementById('screen-gameplay')
        };

        // HUD Elements
        this.hudTotalStars = document.getElementById('hud-total-stars');
        this.hudStickerCount = document.getElementById('hud-sticker-count');
        this.btnSound = document.getElementById('btn-toggle-sound');
        this.btnMusic = document.getElementById('btn-toggle-music');
        this.btnHome = document.getElementById('btn-header-home');
        this.btnAlbum = document.getElementById('btn-header-album');

        // Modals
        this.winModal = document.getElementById('modal-win');
        this.albumModal = document.getElementById('modal-album');
        this.albumGrid = document.getElementById('album-grid');

        // Gameplay Elements
        this.gameBoard = document.getElementById('game-board');
        this.gameModeTitle = document.getElementById('game-mode-title');
        this.gameProgressBar = document.getElementById('game-progress-fill');
        this.gameStepIndicator = document.getElementById('game-step-indicator');
        this.feedbackBanner = document.getElementById('feedback-banner');
    }

    initEvents() {
        // Navigation Buttons
        this.btnHome.addEventListener('click', () => {
            window.soundCtrl.playClick();
            this.showScreen('screen-home');
        });

        this.btnAlbum.addEventListener('click', () => {
            window.soundCtrl.playClick();
            this.openStickerAlbum();
        });

        document.getElementById('btn-close-album').addEventListener('click', () => {
            window.soundCtrl.playClick();
            this.albumModal.classList.remove('active');
        });

        // Sound & Music Toggles
        this.btnSound.addEventListener('click', () => {
            const enabled = window.soundCtrl.toggleSound();
            this.btnSound.textContent = enabled ? '🔊' : '🔇';
            this.btnSound.classList.toggle('active-glow', enabled);
            window.soundCtrl.playClick();
        });

        this.btnMusic.addEventListener('click', () => {
            const enabled = window.soundCtrl.toggleMusic();
            this.btnMusic.textContent = enabled ? '🎵' : '🎼';
            this.btnMusic.classList.toggle('active-glow', enabled);
            window.soundCtrl.playClick();
        });

        // Home Screen Mode Cards
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                window.soundCtrl.playPop();
                this.selectMode(mode);
            });
        });

        // Win Modal Next Button
        document.getElementById('btn-next-level').addEventListener('click', () => {
            window.soundCtrl.playClick();
            this.winModal.classList.remove('active');
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questionsList.length) {
                this.loadCurrentQuestion();
            } else {
                this.showScreen('screen-world-select');
            }
        });

        // Start BGM on first user interaction
        const startAudioOnce = () => {
            window.soundCtrl.startBGM();
            window.removeEventListener('click', startAudioOnce);
            window.removeEventListener('touchstart', startAudioOnce);
        };
        window.addEventListener('click', startAudioOnce);
        window.addEventListener('touchstart', startAudioOnce);
    }

    showScreen(screenId) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (screenId === 'screen-home') {
            this.screens.home.classList.add('active');
        } else if (screenId === 'screen-world-select') {
            this.renderWorldSelect();
            this.screens.worldSelect.classList.add('active');
        } else if (screenId === 'screen-gameplay') {
            this.screens.gameplay.classList.add('active');
        }
        this.currentScreen = screenId;
    }

    updateHUD() {
        if (this.hudTotalStars) this.hudTotalStars.textContent = this.savedData.totalStars;
        if (this.hudStickerCount) this.hudStickerCount.textContent = this.savedData.unlockedStickers.length;
    }

    selectMode(mode) {
        this.currentMode = mode;
        this.showScreen('screen-world-select');
    }

    renderWorldSelect() {
        const grid = document.getElementById('worlds-grid');
        grid.innerHTML = '';

        WORLDS.forEach(world => {
            const card = document.createElement('div');
            card.className = `world-card ${world.themeClass}`;
            card.innerHTML = `
                <div class="world-card-icon">${world.icon}</div>
                <h3>${world.name}</h3>
                <p>${world.desc}</p>
            `;
            card.addEventListener('click', () => {
                window.soundCtrl.playPop();
                this.startWorld(world.id);
            });
            grid.appendChild(card);
        });
    }

    startWorld(worldId) {
        this.currentWorldId = worldId;
        this.currentQuestionIndex = 0;
        
        // Filter questions by mode & world
        if (this.currentMode === 'spelling') {
            this.questionsList = SPELLING_QUESTIONS.filter(q => q.worldId === worldId);
        } else if (this.currentMode === 'syllable') {
            this.questionsList = SYLLABLE_QUESTIONS.filter(q => q.worldId === worldId);
            if (this.questionsList.length === 0) {
                this.questionsList = SYLLABLE_QUESTIONS; // Fallback all
            }
        } else if (this.currentMode === 'quiz') {
            this.questionsList = PICTURE_QUIZ_QUESTIONS.filter(q => q.worldId === worldId);
            if (this.questionsList.length === 0) {
                this.questionsList = PICTURE_QUIZ_QUESTIONS;
            }
        } else if (this.currentMode === 'riddle') {
            this.questionsList = RIDDLE_QUESTIONS.filter(q => q.worldId === worldId);
            if (this.questionsList.length === 0) {
                this.questionsList = RIDDLE_QUESTIONS;
            }
        }

        this.showScreen('screen-gameplay');
        this.loadCurrentQuestion();
    }

    loadCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questionsList.length) {
            this.showScreen('screen-world-select');
            return;
        }

        const q = this.questionsList[this.currentQuestionIndex];
        const progressPct = ((this.currentQuestionIndex) / this.questionsList.length) * 100;
        this.gameProgressBar.style.width = `${progressPct}%`;
        this.gameStepIndicator.textContent = `${this.currentQuestionIndex + 1}/${this.questionsList.length}`;

        // Reset Feedback
        this.feedbackBanner.className = 'feedback-banner';
        this.feedbackBanner.style.display = 'none';

        if (this.currentMode === 'spelling') {
            this.gameModeTitle.textContent = "✨ Susun Huruf Kata";
            this.renderSpellingMode(q);
        } else if (this.currentMode === 'syllable') {
            this.gameModeTitle.textContent = "🧩 Sambung Suku Kata";
            this.renderSyllableMode(q);
        } else if (this.currentMode === 'quiz') {
            this.gameModeTitle.textContent = "🎯 Tebak Gambar & Kata";
            this.renderQuizMode(q);
        } else if (this.currentMode === 'riddle') {
            this.gameModeTitle.textContent = "🔍 Detektif Teka-Teki";
            this.renderRiddleMode(q);
        }
    }

    // ================= MODE 1: SPELLING =================
    renderSpellingMode(q) {
        this.spellingTarget = q.word.toUpperCase();
        this.spellingSlots = new Array(this.spellingTarget.length).fill(null);
        
        // Shuffle letters + 1-2 random distractors for excitement
        const letters = this.spellingTarget.split('');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (letters.length <= 5) {
            letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
        }
        // Fisher-Yates shuffle
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        this.spellingPool = letters.map((char, index) => ({ id: `tile_${index}`, char, used: false }));

        this.gameBoard.innerHTML = `
            <div class="clue-hero-box">
                <div class="clue-emoji-display">${q.emoji}</div>
                <div class="clue-hint-pill">💡 Petunjuk: ${q.hint}</div>
                <button class="sound-pronounce-btn" id="btn-pronounce-word">
                    🔊 Dengarkan Suara Kata
                </button>
            </div>

            <!-- Letter Slots Area -->
            <div class="letter-slots-container" id="spelling-slots-box"></div>

            <!-- Letter Tiles Pool -->
            <div class="letter-pool-container" id="spelling-pool-box"></div>
        `;

        document.getElementById('btn-pronounce-word').addEventListener('click', () => {
            window.soundCtrl.speak(q.word);
        });

        // Auto speak hint on start
        window.soundCtrl.speak(q.word);

        this.updateSpellingDOM();
    }

    updateSpellingDOM() {
        const slotsBox = document.getElementById('spelling-slots-box');
        const poolBox = document.getElementById('spelling-pool-box');
        if (!slotsBox || !poolBox) return;

        // Render Slots
        slotsBox.innerHTML = '';
        this.spellingSlots.forEach((slotItem, index) => {
            const slotEl = document.createElement('div');
            slotEl.className = `letter-slot ${slotItem ? 'filled' : ''}`;
            slotEl.textContent = slotItem ? slotItem.char : '';
            
            // Remove letter on slot click
            if (slotItem) {
                slotEl.addEventListener('click', () => {
                    window.soundCtrl.playPop();
                    const poolObj = this.spellingPool.find(p => p.id === slotItem.poolId);
                    if (poolObj) poolObj.used = false;
                    this.spellingSlots[index] = null;
                    this.updateSpellingDOM();
                });
            }
            slotsBox.appendChild(slotEl);
        });

        // Render Pool Tiles
        poolBox.innerHTML = '';
        this.spellingPool.forEach(tile => {
            const tileEl = document.createElement('div');
            tileEl.className = `letter-tile ${tile.used ? 'used' : ''}`;
            tileEl.textContent = tile.char;

            tileEl.addEventListener('click', () => {
                if (tile.used) return;
                // Find first empty slot
                const emptySlotIndex = this.spellingSlots.findIndex(s => s === null);
                if (emptySlotIndex !== -1) {
                    window.soundCtrl.playLetterPlace();
                    tile.used = true;
                    this.spellingSlots[emptySlotIndex] = { char: tile.char, poolId: tile.id };
                    this.updateSpellingDOM();
                    this.checkSpellingAnswer();
                }
            });
            poolBox.appendChild(tileEl);
        });
    }

    checkSpellingAnswer() {
        const isFull = this.spellingSlots.every(s => s !== null);
        if (!isFull) return;

        const assembledWord = this.spellingSlots.map(s => s.char).join('');
        if (assembledWord === this.spellingTarget) {
            // Correct!
            window.soundCtrl.playCorrect();
            window.soundCtrl.speak(`Luar biasa! Benar! ${this.spellingTarget}`);
            this.showFeedback(true, `Hebat! Kata yang benar adalah ${this.spellingTarget}! 🎉`);
            this.launchConfetti();
            
            setTimeout(() => {
                this.triggerLevelWin();
            }, 1200);
        } else {
            // Incorrect
            window.soundCtrl.playWrong();
            this.showFeedback(false, `Kurang tepat, coba susun kembali ya! 😊`);
        }
    }

    // ================= MODE 2: SYLLABLE MATCH =================
    renderSyllableMode(q) {
        this.syllableSlots = [];
        const correctParts = [...q.parts];
        const allChips = [...q.parts, ...q.distractors];
        
        // Shuffle chips
        for (let i = allChips.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allChips[i], allChips[j]] = [allChips[j], allChips[i]];
        }
        this.syllablePool = allChips.map((syl, i) => ({ id: `syl_${i}`, text: syl, used: false }));

        this.gameBoard.innerHTML = `
            <div class="clue-hero-box">
                <div class="clue-emoji-display">${q.emoji}</div>
                <div class="syllable-target-word">Lengkapi Suku Kata: <strong>${q.targetWord}</strong></div>
                <button class="sound-pronounce-btn" id="btn-pronounce-syl">
                    🔊 Dengarkan Kata
                </button>
            </div>

            <!-- Syllable Chain Box -->
            <div class="syllable-chain-container" id="syl-chain-box"></div>

            <!-- Syllable Pool -->
            <div class="syllable-pool" id="syl-pool-box"></div>
        `;

        document.getElementById('btn-pronounce-syl').addEventListener('click', () => {
            window.soundCtrl.speak(q.targetWord);
        });
        window.soundCtrl.speak(q.targetWord);

        this.updateSyllableDOM(q);
    }

    updateSyllableDOM(q) {
        const chainBox = document.getElementById('syl-chain-box');
        const poolBox = document.getElementById('syl-pool-box');
        if (!chainBox || !poolBox) return;

        chainBox.innerHTML = '';
        for (let i = 0; i < q.parts.length; i++) {
            const slotData = this.syllableSlots[i];
            const slotEl = document.createElement('div');
            slotEl.className = `syllable-chain-slot ${slotData ? 'filled' : ''}`;
            slotEl.textContent = slotData ? slotData.text : `Bagian ${i+1}`;

            if (slotData) {
                slotEl.addEventListener('click', () => {
                    window.soundCtrl.playPop();
                    const pObj = this.syllablePool.find(p => p.id === slotData.poolId);
                    if (pObj) pObj.used = false;
                    this.syllableSlots.splice(i, 1);
                    this.updateSyllableDOM(q);
                });
            }
            chainBox.appendChild(slotEl);
        }

        poolBox.innerHTML = '';
        this.syllablePool.forEach(chip => {
            const chipEl = document.createElement('div');
            chipEl.className = `syllable-chip ${chip.used ? 'used' : ''}`;
            chipEl.textContent = chip.text;

            chipEl.addEventListener('click', () => {
                if (chip.used) return;
                if (this.syllableSlots.length < q.parts.length) {
                    window.soundCtrl.playLetterPlace();
                    chip.used = true;
                    this.syllableSlots.push({ text: chip.text, poolId: chip.id });
                    this.updateSyllableDOM(q);
                    this.checkSyllableAnswer(q);
                }
            });
            poolBox.appendChild(chipEl);
        });
    }

    checkSyllableAnswer(q) {
        if (this.syllableSlots.length < q.parts.length) return;

        const assembled = this.syllableSlots.map(s => s.text).join('');
        const expected = q.parts.join('');

        if (assembled === expected) {
            window.soundCtrl.playCorrect();
            window.soundCtrl.speak(`Pintar sekali! ${q.targetWord}`);
            this.showFeedback(true, `Bagus sekali! Suku kata tersambung: ${q.targetWord} 🌟`);
            this.launchConfetti();
            setTimeout(() => {
                this.triggerLevelWin();
            }, 1200);
        } else {
            window.soundCtrl.playWrong();
            this.showFeedback(false, `Belum tepat, yuk coba rangkai lagi! 💪`);
        }
    }

    // ================= MODE 3: PICTURE & CHOICE QUIZ =================
    renderQuizMode(q) {
        this.gameBoard.innerHTML = `
            <div class="clue-hero-box">
                <div class="clue-emoji-display">${q.imageEmoji}</div>
                <div class="clue-hint-pill" style="font-size: 1.15rem;">❓ ${q.question}</div>
                <button class="sound-pronounce-btn" id="btn-pronounce-question">
                    🔊 Bacakan Soal
                </button>
            </div>

            <!-- 4 Options Grid -->
            <div class="quiz-options-grid" id="quiz-grid"></div>
        `;

        document.getElementById('btn-pronounce-question').addEventListener('click', () => {
            window.soundCtrl.speak(q.question);
        });
        window.soundCtrl.speak(q.question);

        const grid = document.getElementById('quiz-grid');
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `<span style="font-size: 1.8rem;">${opt.icon || '📌'}</span> <span>${opt.text}</span>`;
            
            btn.addEventListener('click', () => {
                if (opt.correct) {
                    btn.classList.add('correct');
                    window.soundCtrl.playCorrect();
                    window.soundCtrl.speak(`Benar! ${opt.text}. ${q.explanation}`);
                    this.showFeedback(true, `Tepat sekali! ${q.explanation} ⭐`);
                    this.launchConfetti();
                    setTimeout(() => {
                        this.triggerLevelWin();
                    }, 1400);
                } else {
                    btn.classList.add('wrong');
                    window.soundCtrl.playWrong();
                    this.showFeedback(false, `Masih kurang tepat, coba pilihan yang lain ya! 😊`);
                }
            });
            grid.appendChild(btn);
        });
    }

    // ================= MODE 4: DETECTIVE RIDDLES =================
    renderRiddleMode(q) {
        this.gameBoard.innerHTML = `
            <div class="clue-hero-box">
                <div class="clue-emoji-display">🕵️‍♂️</div>
                <div class="riddle-parchment">
                    "${q.riddle}"
                </div>
                <button class="sound-pronounce-btn" id="btn-pronounce-riddle">
                    🔊 Bacakan Teka-Teki
                </button>
            </div>

            <!-- Riddle Options -->
            <div class="quiz-options-grid" id="riddle-grid"></div>
        `;

        document.getElementById('btn-pronounce-riddle').addEventListener('click', () => {
            window.soundCtrl.speak(q.riddle);
        });
        window.soundCtrl.speak(q.riddle);

        const grid = document.getElementById('riddle-grid');
        q.options.forEach(optText => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = `<span>🔍</span> <span>${optText}</span>`;

            btn.addEventListener('click', () => {
                if (optText === q.answer) {
                    btn.classList.add('correct');
                    window.soundCtrl.playCorrect();
                    window.soundCtrl.speak(`Jawaban kamu tepat! Jawabannya adalah ${q.answer}`);
                    this.showFeedback(true, `Hebat Detektif Cilik! Jawabannya adalah ${q.answer}! 🏆`);
                    this.launchConfetti();
                    setTimeout(() => {
                        this.triggerLevelWin();
                    }, 1300);
                } else {
                    btn.classList.add('wrong');
                    window.soundCtrl.playWrong();
                    this.showFeedback(false, `Bukan itu jawabannya, coba renungkan lagi ya! 🧐`);
                }
            });
            grid.appendChild(btn);
        });
    }

    showFeedback(isCorrect, msg) {
        this.feedbackBanner.style.display = 'flex';
        this.feedbackBanner.className = `feedback-banner ${isCorrect ? 'show-correct' : 'show-wrong'}`;
        this.feedbackBanner.innerHTML = `${isCorrect ? '🌟' : '💡'} ${msg}`;
    }

    triggerLevelWin() {
        window.soundCtrl.playWin();
        this.savedData.totalStars += 3;

        // Check if there is a sticker to unlock in this world
        const currentWorld = WORLDS.find(w => w.id === this.currentWorldId);
        let unlockedSticker = null;
        if (currentWorld && currentWorld.stickers.length > 0) {
            const availableStickers = currentWorld.stickers.filter(stk => !this.savedData.unlockedStickers.includes(stk.id));
            if (availableStickers.length > 0) {
                unlockedSticker = availableStickers[0];
                this.savedData.unlockedStickers.push(unlockedSticker.id);
                window.soundCtrl.playStickerUnlock();
            }
        }

        this.saveGameData();
        this.updateHUD();

        // Show Modal
        const showcaseBox = document.getElementById('modal-sticker-showcase');
        if (unlockedSticker) {
            showcaseBox.style.display = 'flex';
            showcaseBox.innerHTML = `
                <div class="sticker-unlock-emoji">${unlockedSticker.emoji}</div>
                <div class="sticker-unlock-name">🎉 Stiker Baru: ${unlockedSticker.name}!</div>
                <div class="sticker-unlock-fact">"${unlockedSticker.fact}"</div>
            `;
        } else {
            showcaseBox.style.display = 'none';
        }

        // Animate Stars
        const starEls = document.querySelectorAll('.modal-star');
        starEls.forEach((el, idx) => {
            el.classList.remove('awarded');
            setTimeout(() => {
                el.classList.add('awarded');
                window.soundCtrl.playStar();
            }, 300 + idx * 250);
        });

        this.winModal.classList.add('active');
    }

    openStickerAlbum() {
        this.albumGrid.innerHTML = '';
        
        WORLDS.forEach(world => {
            world.stickers.forEach(stk => {
                const isUnlocked = this.savedData.unlockedStickers.includes(stk.id);
                const item = document.createElement('div');
                item.className = `sticker-item-card ${isUnlocked ? 'unlocked' : ''}`;
                item.innerHTML = `
                    <div class="sticker-item-emoji">${stk.emoji}</div>
                    <div class="sticker-item-name">${isUnlocked ? stk.name : '??? Terkunci'}</div>
                `;
                if (isUnlocked) {
                    item.title = stk.fact;
                    item.addEventListener('click', () => {
                        window.soundCtrl.playPop();
                        window.soundCtrl.speak(`${stk.name}. ${stk.fact}`);
                    });
                }
                this.albumGrid.appendChild(item);
            });
        });

        this.albumModal.classList.add('active');
    }

    // ================= CONFETTI CELEBRATION ENGINE =================
    initConfetti() {
        this.confettiCanvas = document.getElementById('confetti-canvas');
        this.confettiCtx = this.confettiCanvas.getContext('2d');
        this.confettiParticles = [];
        this.confettiAnimationId = null;

        window.addEventListener('resize', () => {
            if (this.confettiCanvas) {
                this.confettiCanvas.width = this.confettiCanvas.parentElement.clientWidth;
                this.confettiCanvas.height = this.confettiCanvas.parentElement.clientHeight;
            }
        });
        if (this.confettiCanvas) {
            this.confettiCanvas.width = this.confettiCanvas.parentElement.clientWidth;
            this.confettiCanvas.height = this.confettiCanvas.parentElement.clientHeight;
        }
    }

    launchConfetti() {
        if (!this.confettiCanvas) return;
        this.confettiCanvas.width = this.confettiCanvas.parentElement.clientWidth;
        this.confettiCanvas.height = this.confettiCanvas.parentElement.clientHeight;
        
        const colors = ['#FFD13B', '#FF5E7E', '#38BDF8', '#10B981', '#A855F7', '#FF8A00'];
        this.confettiParticles = [];

        for (let i = 0; i < 70; i++) {
            this.confettiParticles.push({
                x: this.confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
                y: this.confettiCanvas.height / 2,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.8) * 14 - 3,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.35,
                alpha: 1
            });
        }

        if (this.confettiAnimationId) cancelAnimationFrame(this.confettiAnimationId);
        this.renderConfettiFrame();
    }

    renderConfettiFrame() {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        let activeCount = 0;

        this.confettiParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotSpeed;
            p.alpha -= 0.012;

            if (p.alpha > 0) {
                activeCount++;
                this.confettiCtx.save();
                this.confettiCtx.globalAlpha = p.alpha;
                this.confettiCtx.translate(p.x, p.y);
                this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
                this.confettiCtx.fillStyle = p.color;
                this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
                this.confettiCtx.restore();
            }
        });

        if (activeCount > 0) {
            this.confettiAnimationId = requestAnimationFrame(() => this.renderConfettiFrame());
        }
    }
}

// Instantiate Game on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KataCilikGame();
});
