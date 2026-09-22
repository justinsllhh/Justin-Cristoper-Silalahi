// ============================================================
// GAME MANAGER & CORE LOGIC
// Ksatria Karakter: Pahlawan Kebaikan
// ============================================================

class CharacterGame {
    constructor() {
        this.state = {
            playerName: "Sahabat Cilik",
            stars: 0,
            kindnessPoints: 0,
            unlockedBadges: [],
            completedStories: [],
            currentStoryIndex: 0,
            sortScore: 0,
            currentSortIndex: 0,
            sortShuffled: [],
            missionScore: 0,
            currentMissionIndex: 0,
            quizScore: 0,
            currentQuizIndex: 0,
            quizStreak: 0,
            currentScreen: "home"
        };

        this.treeVisualizer = null;
        this.init();
    }

    init() {
        this.loadSavedState();
        this.setupEventListeners();
        this.updateHUD();
        this.initTree();
        this.renderBadgesGrid();
    }

    // ------------------------------------------------------------
    // LOCAL STORAGE MANAGEMENT
    // ------------------------------------------------------------
    loadSavedState() {
        const saved = localStorage.getItem('ksatria_save_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
            } catch (e) {
                console.error("Gagal membaca save data:", e);
            }
        }
    }

    saveState() {
        localStorage.setItem('ksatria_save_data', JSON.stringify({
            playerName: this.state.playerName,
            stars: this.state.stars,
            kindnessPoints: this.state.kindnessPoints,
            unlockedBadges: this.state.unlockedBadges,
            completedStories: this.state.completedStories
        }));
        this.updateHUD();
        if (this.treeVisualizer) {
            this.treeVisualizer.updateState(this.state.kindnessPoints);
        }
    }

    resetProgress() {
        if (confirm("Apakah kamu yakin ingin mengulang seluruh petualangan dari awal?")) {
            localStorage.removeItem('ksatria_save_data');
            this.state.stars = 0;
            this.state.kindnessPoints = 0;
            this.state.unlockedBadges = [];
            this.state.completedStories = [];
            this.saveState();
            this.renderBadgesGrid();
            this.showScreen('home');
            this.showToast("🌟 Petualangan dimulai kembali dari awal!");
        }
    }

    // ------------------------------------------------------------
    // HUD & STATE UPDATES
    // ------------------------------------------------------------
    updateHUD() {
        const starEl = document.getElementById('hud-total-stars');
        const pointsEl = document.getElementById('hud-total-points');
        const badgeEl = document.getElementById('hud-badge-count');
        const nameEl = document.getElementById('hud-player-name');
        const levelBadgeEl = document.getElementById('hud-level-badge');

        if (starEl) starEl.textContent = this.state.stars;
        if (pointsEl) pointsEl.textContent = this.state.kindnessPoints;
        if (badgeEl) badgeEl.textContent = `${this.state.unlockedBadges.length}/${window.GAME_DATA.badges.length}`;
        if (nameEl) nameEl.textContent = this.state.playerName;

        // Hitung Tingkatan Ksatria
        if (levelBadgeEl) {
            let levelTitle = "Ksatria Pemula";
            if (this.state.kindnessPoints >= 350) levelTitle = "Ksatria Kebaikan Agung 👑";
            else if (this.state.kindnessPoints >= 220) levelTitle = "Ksatria Karakter Utama ⭐";
            else if (this.state.kindnessPoints >= 120) levelTitle = "Ksatria Berbudi Luhur 🛡️";
            else if (this.state.kindnessPoints >= 50) levelTitle = "Ksatria Harapan 🌱";
            levelBadgeEl.textContent = levelTitle;
        }
    }

    // ------------------------------------------------------------
    // NAVIGATION & SCREENS
    // ------------------------------------------------------------
    showScreen(screenId) {
        window.audioManager.playClick();
        document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));

        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.classList.add('active');
            this.state.currentScreen = screenId;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (screenId === 'tree' && this.treeVisualizer) {
                this.treeVisualizer.updateState(this.state.kindnessPoints);
                this.treeVisualizer.startLoop();
                this.updateTreeStatusUI();
            } else if (this.treeVisualizer) {
                this.treeVisualizer.stopLoop();
            }

            if (screenId === 'certificate') {
                this.renderCertificate();
            }
        }
    }

    // ------------------------------------------------------------
    // EVENT LISTENERS
    // ------------------------------------------------------------
    setupEventListeners() {
        // Navigasi Header
        document.getElementById('btn-header-home')?.addEventListener('click', () => this.showScreen('home'));
        document.getElementById('btn-header-tree')?.addEventListener('click', () => this.showScreen('tree'));
        document.getElementById('btn-header-badges')?.addEventListener('click', () => this.showScreen('badges'));

        // Audio Toggles
        const btnSound = document.getElementById('btn-toggle-sound');
        btnSound?.addEventListener('click', () => {
            const enabled = window.audioManager.toggleSound();
            btnSound.textContent = enabled ? '🔊' : '🔇';
            btnSound.classList.toggle('active-glow', enabled);
        });

        const btnMusic = document.getElementById('btn-toggle-music');
        btnMusic?.addEventListener('click', () => {
            const enabled = window.audioManager.toggleMusic();
            btnMusic.textContent = enabled ? '🎵' : '🎼';
            btnMusic.classList.toggle('active-glow', enabled);
        });

        const btnSpeech = document.getElementById('btn-toggle-speech');
        btnSpeech?.addEventListener('click', () => {
            const enabled = window.audioManager.toggleSpeech();
            btnSpeech.textContent = enabled ? '🗣️' : '🤐';
            btnSpeech.classList.toggle('active-glow', enabled);
            this.showToast(enabled ? "Narasi Suara Aktif" : "Narasi Suara Nonaktif");
        });

        // Mode Cards dari Home
        document.getElementById('btn-mode-story')?.addEventListener('click', () => this.startStoryMode());
        document.getElementById('btn-mode-sort')?.addEventListener('click', () => this.startSortMode());
        document.getElementById('btn-mode-mission')?.addEventListener('click', () => this.startMissionMode());
        document.getElementById('btn-mode-quiz')?.addEventListener('click', () => this.startQuizMode());

        // Edit Nama Pemain
        document.getElementById('btn-edit-name')?.addEventListener('click', () => {
            const newName = prompt("Masukkan Nama Ksatria Kamu:", this.state.playerName);
            if (newName && newName.trim().length > 0) {
                this.state.playerName = newName.trim().slice(0, 20);
                this.saveState();
                this.updateHUD();
                window.audioManager.playSuccess();
                this.showToast(`Halo, Ksatria ${this.state.playerName}! ✨`);
            }
        });

        // Reset Data Button
        document.getElementById('btn-reset-data')?.addEventListener('click', () => this.resetProgress());
    }

    // ============================================================
    // MODE 1: PETUALANGAN CERITA (STORY RPG)
    // ============================================================
    startStoryMode(index = 0) {
        this.state.currentStoryIndex = index;
        this.showScreen('story');
        this.renderStoryList();
        this.loadStoryScenario(index);
    }

    renderStoryList() {
        const container = document.getElementById('story-chapters-tabs');
        if (!container) return;

        const stories = window.GAME_DATA.stories;
        container.innerHTML = stories.map((s, idx) => {
            const isDone = this.state.completedStories.includes(s.id);
            const isCurrent = idx === this.state.currentStoryIndex;
            return `
                <button class="chapter-tab ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}" 
                        onclick="window.gameApp.startStoryMode(${idx})">
                    <span class="tab-icon">${isDone ? '✅' : s.icon}</span>
                    <span class="tab-label">Bab ${idx + 1}</span>
                </button>
            `;
        }).join('');
    }

    loadStoryScenario(index) {
        const stories = window.GAME_DATA.stories;
        if (index < 0 || index >= stories.length) return;

        const story = stories[index];
        const titleEl = document.getElementById('story-title');
        const categoryEl = document.getElementById('story-category');
        const mascotEl = document.getElementById('story-mascot');
        const scenarioEl = document.getElementById('story-scenario-text');
        const questionEl = document.getElementById('story-question-text');
        const choicesContainer = document.getElementById('story-choices-container');
        const feedbackBox = document.getElementById('story-feedback-box');

        if (titleEl) titleEl.textContent = `${story.title}`;
        if (categoryEl) categoryEl.textContent = `Nilai: ${story.category}`;
        if (mascotEl) mascotEl.textContent = story.icon;
        if (scenarioEl) scenarioEl.textContent = story.scenario;
        if (questionEl) questionEl.textContent = story.question;
        if (feedbackBox) feedbackBox.classList.add('hidden');

        // Narasi Suara
        window.audioManager.speak(`${story.title}. ${story.scenario}. ${story.question}`);

        // Render Pilihan Jawaban
        if (choicesContainer) {
            choicesContainer.innerHTML = story.choices.map((choice, cIdx) => `
                <button class="story-choice-btn" onclick="window.gameApp.chooseStoryOption(${index}, ${cIdx})">
                    <span class="choice-alphabet">${String.fromCharCode(65 + cIdx)}</span>
                    <span class="choice-text">${choice.text}</span>
                </button>
            `).join('');
        }
    }

    chooseStoryOption(storyIndex, choiceIndex) {
        const story = window.GAME_DATA.stories[storyIndex];
        const choice = story.choices[choiceIndex];

        const feedbackBox = document.getElementById('story-feedback-box');
        const choicesContainer = document.getElementById('story-choices-container');

        // Nonaktifkan tombol pilihan
        if (choicesContainer) {
            const btns = choicesContainer.querySelectorAll('.story-choice-btn');
            btns.forEach((b, i) => {
                b.disabled = true;
                if (i === choiceIndex) {
                    b.classList.add(choice.isBest ? 'choice-best' : 'choice-bad');
                }
            });
        }

        if (choice.isBest) {
            window.audioManager.playSuccess();
            window.audioManager.playStar();
            this.createConfetti();

            // Tambah Bintang & Poin Kebaikan
            this.state.stars += choice.stars;
            this.state.kindnessPoints += choice.karma;

            if (!this.state.completedStories.includes(story.id)) {
                this.state.completedStories.push(story.id);
            }

            // Unlock Badge jika ada
            if (story.badgeAward && !this.state.unlockedBadges.includes(story.badgeAward)) {
                this.state.unlockedBadges.push(story.badgeAward);
                this.showBadgeUnlockedModal(story.badgeAward);
            }

            this.saveState();
        } else {
            window.audioManager.playWrong();
            if (choice.karma > 0) {
                this.state.kindnessPoints += choice.karma;
                this.state.stars += choice.stars;
                this.saveState();
            }
        }

        // Tampilkan Feedback & Nilai Moral
        if (feedbackBox) {
            feedbackBox.className = `story-feedback-card ${choice.isBest ? 'feedback-success' : 'feedback-warning'}`;
            feedbackBox.innerHTML = `
                <div class="feedback-header">
                    <span class="feedback-icon">${choice.isBest ? '🌟 SANGAT TEPAT!' : '💡 RENUNGAN KARAKTER'}</span>
                    <span class="karma-badge">+${choice.karma} Poin Kebaikan</span>
                </div>
                <p class="feedback-body">${choice.feedback}</p>
                <div class="moral-lesson-banner">${choice.moralLesson}</div>
                <div class="feedback-actions">
                    ${storyIndex < window.GAME_DATA.stories.length - 1 
                        ? `<button class="btn-action-primary" onclick="window.gameApp.startStoryMode(${storyIndex + 1})">Bab Selanjutnya ➡️</button>`
                        : `<button class="btn-action-primary" onclick="window.gameApp.showScreen('tree')">Lihat Pohon Kebaikanmu 🌳</button>`
                    }
                    <button class="btn-action-secondary" onclick="window.gameApp.startStoryMode(${storyIndex})">Ulangi Cerita 🔄</button>
                </div>
            `;
            feedbackBox.classList.remove('hidden');

            window.audioManager.speak(choice.feedback + " " + choice.moralLesson);
        }

        this.renderStoryList();
    }

    // ============================================================
    // MODE 2: DETEKTIF PERILAKU (SORTING GAME)
    // ============================================================
    startSortMode() {
        this.state.sortScore = 0;
        this.state.currentSortIndex = 0;
        // Acak kartu
        this.state.sortShuffled = [...window.GAME_DATA.sortingCards].sort(() => Math.random() - 0.5);
        this.showScreen('sort');
        this.renderCurrentSortCard();
    }

    renderCurrentSortCard() {
        const cards = this.state.sortShuffled;
        const index = this.state.currentSortIndex;

        const container = document.getElementById('sort-card-area');
        const progressEl = document.getElementById('sort-progress-badge');
        const scoreEl = document.getElementById('sort-current-score');

        if (scoreEl) scoreEl.textContent = `Skor: ${this.state.sortScore}`;
        if (progressEl) progressEl.textContent = `Kartu ${index + 1} dari ${cards.length}`;

        if (index >= cards.length) {
            this.renderSortGameEnd();
            return;
        }

        const card = cards[index];
        if (container) {
            container.innerHTML = `
                <div class="sort-interactive-card animate-pop" id="active-sort-card">
                    <div class="sort-card-icon">${card.icon}</div>
                    <div class="sort-card-text">"${card.text}"</div>
                    <div class="sort-card-instruction">Apakah ini Perilaku Terpuji (Pahlawan) atau Perilaku Tercela?</div>
                </div>
            `;
        }

        window.audioManager.speak(card.text);
    }

    submitSortAnswer(category) {
        const card = this.state.sortShuffled[this.state.currentSortIndex];
        const isCorrect = card.category === category;
        const cardEl = document.getElementById('active-sort-card');

        if (isCorrect) {
            window.audioManager.playSuccess();
            this.state.sortScore += 10;
            this.state.kindnessPoints += 5;
            this.state.stars += 1;
            if (cardEl) cardEl.classList.add('sort-correct');
        } else {
            window.audioManager.playWrong();
            if (cardEl) cardEl.classList.add('sort-incorrect');
        }

        // Tampilkan Modal Penjelasan Singkat
        this.showSortFeedbackModal(isCorrect, card);
    }

    showSortFeedbackModal(isCorrect, card) {
        const modal = document.getElementById('sort-modal-overlay');
        const titleEl = document.getElementById('sort-modal-title');
        const bodyEl = document.getElementById('sort-modal-body');
        const explanationEl = document.getElementById('sort-modal-explanation');

        if (modal && titleEl && bodyEl && explanationEl) {
            titleEl.textContent = isCorrect ? "🎉 Jawabanmu Tepat Sekali!" : "💡 Mari Kita Pelajari!";
            titleEl.className = isCorrect ? "text-success" : "text-warning";
            bodyEl.textContent = `Perilaku "${card.text}" termasuk tindakan ${card.category === 'terpuji' ? '✨ TERPUJI (Pahlawan Kebaikan)' : '⚠️ TERCELA (Perlu Dihindari)'}.`;
            explanationEl.textContent = card.explanation;

            modal.classList.add('active');
        }
    }

    nextSortCard() {
        const modal = document.getElementById('sort-modal-overlay');
        if (modal) modal.classList.remove('active');

        this.state.currentSortIndex++;
        this.saveState();
        this.renderCurrentSortCard();
    }

    renderSortGameEnd() {
        const container = document.getElementById('sort-card-area');
        window.audioManager.playFanfare();
        this.createConfetti();

        if (container) {
            container.innerHTML = `
                <div class="game-result-card animate-pop">
                    <div class="result-trophy">🕵️‍♂️⭐</div>
                    <h2>Misi Detektif Selesai!</h2>
                    <p class="result-subtitle">Kamu telah berhasil menganalisis perilaku sehari-hari!</p>
                    <div class="result-stat-box">
                        <div class="stat-item">
                            <span class="stat-number">${this.state.sortScore}</span>
                            <span class="stat-title">Total Skor</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">+${Math.floor(this.state.sortScore / 2)}</span>
                            <span class="stat-title">Poin Kebaikan</span>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="btn-action-primary" onclick="window.gameApp.startSortMode()">Mainkan Lagi 🔄</button>
                        <button class="btn-action-secondary" onclick="window.gameApp.showScreen('tree')">Cek Pohon Kebaikan 🌳</button>
                    </div>
                </div>
            `;
        }
    }

    // ============================================================
    // MODE 3: MISI AKSI KEBAIKAN (EMPATHY MISSIONS)
    // ============================================================
    startMissionMode(index = 0) {
        this.state.currentMissionIndex = index;
        this.showScreen('mission');
        this.renderMission();
    }

    renderMission() {
        const missions = window.GAME_DATA.missions;
        const index = this.state.currentMissionIndex;

        const progressEl = document.getElementById('mission-progress-indicator');
        const container = document.getElementById('mission-content-area');

        if (progressEl) progressEl.textContent = `Misi ${index + 1} / ${missions.length}`;

        if (index >= missions.length) {
            this.renderMissionEnd();
            return;
        }

        const mission = missions[index];
        if (container) {
            container.innerHTML = `
                <div class="mission-card animate-pop">
                    <div class="mission-avatar">${mission.icon}</div>
                    <div class="mission-situation-box">
                        <div class="situation-label">Situasi Masalah:</div>
                        <h3 class="situation-text">"${mission.situation}"</h3>
                    </div>
                    <div class="mission-options-grid">
                        ${mission.options.map((opt, oIdx) => `
                            <button class="mission-opt-btn" onclick="window.gameApp.chooseMissionOption(${index}, ${oIdx})">
                                <span class="opt-indicator">${oIdx + 1}</span>
                                <span class="opt-text">${opt.text}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div id="mission-inline-feedback" class="hidden"></div>
                </div>
            `;
        }

        window.audioManager.speak(mission.situation);
    }

    chooseMissionOption(mIdx, oIdx) {
        const mission = window.GAME_DATA.missions[mIdx];
        const opt = mission.options[oIdx];
        const feedbackEl = document.getElementById('mission-inline-feedback');

        if (opt.isCorrect) {
            window.audioManager.playSuccess();
            this.state.kindnessPoints += 15;
            this.state.stars += 2;
            this.saveState();

            if (feedbackEl) {
                feedbackEl.className = "mission-feedback success animate-pop";
                feedbackEl.innerHTML = `
                    <div class="feedback-msg-title">✨ Tindakan Ksatria Terbaik!</div>
                    <p>${opt.feedback}</p>
                    <button class="btn-action-primary" onclick="window.gameApp.startMissionMode(${mIdx + 1})">Lanjut Misi Berikutnya ➡️</button>
                `;
                feedbackEl.classList.remove('hidden');
            }
            this.createConfetti();
        } else {
            window.audioManager.playWrong();
            if (feedbackEl) {
                feedbackEl.className = "mission-feedback warning animate-pop";
                feedbackEl.innerHTML = `
                    <div class="feedback-msg-title">💡 Pikirkan Kembali...</div>
                    <p>Pilihan ini belum mencerminkan solusi terbaik yang penuh empati dan kasih sayang. Yuk coba pilih tindakan lainnya!</p>
                `;
                feedbackEl.classList.remove('hidden');
            }
        }
    }

    renderMissionEnd() {
        const container = document.getElementById('mission-content-area');
        window.audioManager.playFanfare();
        this.createConfetti();

        if (container) {
            container.innerHTML = `
                <div class="game-result-card animate-pop">
                    <div class="result-trophy">🤝💖</div>
                    <h2>Seluruh Misi Kebaikan Tuntas!</h2>
                    <p class="result-subtitle">Kamu membuktikan dirimu peka dan tanggap menolong sesama!</p>
                    <div class="result-actions">
                        <button class="btn-action-primary" onclick="window.gameApp.startMissionMode(0)">Ulangi Misi 🔄</button>
                        <button class="btn-action-secondary" onclick="window.gameApp.showScreen('home')">Ke Beranda 🏠</button>
                    </div>
                </div>
            `;
        }
    }

    // ============================================================
    // MODE 4: KUIS KSATRIA BINTANG (TRIVIA)
    // ============================================================
    startQuizMode() {
        this.state.quizScore = 0;
        this.state.currentQuizIndex = 0;
        this.state.quizStreak = 0;
        this.showScreen('quiz');
        this.renderQuizQuestion();
    }

    renderQuizQuestion() {
        const quizList = window.GAME_DATA.quiz;
        const index = this.state.currentQuizIndex;

        const progressEl = document.getElementById('quiz-progress-badge');
        const streakEl = document.getElementById('quiz-streak-badge');
        const container = document.getElementById('quiz-question-container');

        if (progressEl) progressEl.textContent = `Soal ${index + 1} dari ${quizList.length}`;
        if (streakEl) streakEl.textContent = `🔥 Streak: ${this.state.quizStreak}`;

        if (index >= quizList.length) {
            this.renderQuizEnd();
            return;
        }

        const q = quizList[index];
        if (container) {
            container.innerHTML = `
                <div class="quiz-card animate-pop">
                    <div class="quiz-header-badge">${q.icon} Kuis Budi Pekerti</div>
                    <h3 class="quiz-question-title">${q.question}</h3>
                    <div class="quiz-options-list">
                        ${q.options.map((opt, idx) => `
                            <button class="quiz-opt-item" onclick="window.gameApp.submitQuizAnswer(${index}, ${idx})">
                                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                                <span class="opt-label">${opt}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div id="quiz-explanation-box" class="hidden"></div>
                </div>
            `;
        }

        window.audioManager.speak(q.question);
    }

    submitQuizAnswer(qIdx, selectedIdx) {
        const q = window.GAME_DATA.quiz[qIdx];
        const isCorrect = selectedIdx === q.answerIndex;
        const explanationBox = document.getElementById('quiz-explanation-box');
        const container = document.getElementById('quiz-question-container');

        if (container) {
            const btns = container.querySelectorAll('.quiz-opt-item');
            btns.forEach((b, i) => {
                b.disabled = true;
                if (i === q.answerIndex) b.classList.add('correct');
                else if (i === selectedIdx) b.classList.add('incorrect');
            });
        }

        if (isCorrect) {
            window.audioManager.playSuccess();
            this.state.quizStreak++;
            this.state.quizScore += 10 + this.state.quizStreak * 2;
            this.state.kindnessPoints += 8;
            this.state.stars += 1;
            this.saveState();
        } else {
            window.audioManager.playWrong();
            this.state.quizStreak = 0;
        }

        if (explanationBox) {
            explanationBox.className = `quiz-feedback-box ${isCorrect ? 'correct' : 'wrong'} animate-pop`;
            explanationBox.innerHTML = `
                <div class="quiz-fb-title">${isCorrect ? '✅ Jawaban Benar!' : '❌ Jawaban Kurang Tepat'}</div>
                <p class="quiz-fb-text">${q.explanation}</p>
                <button class="btn-action-primary" onclick="window.gameApp.nextQuizQuestion()">Soal Berikutnya ➡️</button>
            `;
            explanationBox.classList.remove('hidden');
        }
    }

    nextQuizQuestion() {
        this.state.currentQuizIndex++;
        this.renderQuizQuestion();
    }

    renderQuizEnd() {
        const container = document.getElementById('quiz-question-container');
        window.audioManager.playFanfare();
        this.createConfetti();

        if (container) {
            container.innerHTML = `
                <div class="game-result-card animate-pop">
                    <div class="result-trophy">🎓🏆</div>
                    <h2>Kuis Budi Pekerti Selesai!</h2>
                    <p class="result-subtitle">Pengetahuan karaktermu semakin mantap dan tajam!</p>
                    <div class="result-stat-box">
                        <div class="stat-item">
                            <span class="stat-number">${this.state.quizScore}</span>
                            <span class="stat-title">Skor Akhir</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">+${Math.floor(this.state.quizScore / 3)}</span>
                            <span class="stat-title">Poin Kebaikan</span>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="btn-action-primary" onclick="window.gameApp.startQuizMode()">Ulangi Kuis 🔄</button>
                        <button class="btn-action-secondary" onclick="window.gameApp.showScreen('tree')">Pohon Kebaikan 🌳</button>
                    </div>
                </div>
            `;
        }
    }

    // ============================================================
    // POHON KEBAIKAN AJAIB VIEW
    // ============================================================
    initTree() {
        this.treeVisualizer = new window.TreeOfVirtue('tree-virtue-canvas');
        if (this.treeVisualizer) {
            this.treeVisualizer.updateState(this.state.kindnessPoints);
        }

        document.getElementById('btn-water-tree')?.addEventListener('click', () => {
            window.audioManager.playMagicBloom();
            this.createWaterDrops();
            this.showToast("💧 Pohon Kebaikan disiram dengan kasih sayang!");
        });
    }

    updateTreeStatusUI() {
        const stages = window.GAME_DATA.treeStages;
        let currentStageIdx = 0;
        for (let i = stages.length - 1; i >= 0; i--) {
            if (this.state.kindnessPoints >= stages[i].minPoints) {
                currentStageIdx = i;
                break;
            }
        }

        const stage = stages[currentStageIdx];
        const titleEl = document.getElementById('tree-stage-title');
        const descEl = document.getElementById('tree-stage-desc');
        const barFill = document.getElementById('tree-progress-fill');
        const pointsText = document.getElementById('tree-points-text');

        if (titleEl) titleEl.textContent = `${stage.icon} ${stage.title}`;
        if (descEl) descEl.textContent = stage.desc;
        if (pointsText) pointsText.textContent = `${this.state.kindnessPoints} Poin Kebaikan`;

        if (barFill) {
            const nextMin = stages[currentStageIdx + 1] ? stages[currentStageIdx + 1].minPoints : 400;
            const prevMin = stage.minPoints;
            const pct = Math.min(100, Math.max(0, ((this.state.kindnessPoints - prevMin) / (nextMin - prevMin)) * 100));
            barFill.style.width = `${pct}%`;
        }
    }

    // ============================================================
    // RUANG MEDALI & PIAGAM PENGHARGAAN
    // ============================================================
    renderBadgesGrid() {
        const container = document.getElementById('badges-grid-container');
        if (!container) return;

        const allBadges = window.GAME_DATA.badges;
        container.innerHTML = allBadges.map(b => {
            const isUnlocked = this.state.unlockedBadges.includes(b.id);
            return `
                <div class="badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-icon-wrap" style="${isUnlocked ? `border-color:${b.color};` : ''}">
                        <span class="badge-emoji">${isUnlocked ? b.icon : '🔒'}</span>
                    </div>
                    <h4 class="badge-name">${b.title}</h4>
                    <span class="badge-category">${b.category}</span>
                    <p class="badge-desc">${b.description}</p>
                    <span class="badge-status-pill">${isUnlocked ? '✨ Diraih' : 'Belum Terbuka'}</span>
                </div>
            `;
        }).join('');
    }

    showBadgeUnlockedModal(badgeId) {
        const badge = window.GAME_DATA.badges.find(b => b.id === badgeId);
        if (!badge) return;

        window.audioManager.playFanfare();
        this.createConfetti();

        const modal = document.getElementById('badge-modal-overlay');
        const iconEl = document.getElementById('modal-badge-icon');
        const titleEl = document.getElementById('modal-badge-title');
        const descEl = document.getElementById('modal-badge-desc');

        if (modal && iconEl && titleEl && descEl) {
            iconEl.textContent = badge.icon;
            titleEl.textContent = badge.title;
            descEl.textContent = badge.description;
            modal.classList.add('active');
        }

        this.renderBadgesGrid();
    }

    closeBadgeModal() {
        const modal = document.getElementById('badge-modal-overlay');
        if (modal) modal.classList.remove('active');
    }

    renderCertificate() {
        const certName = document.getElementById('cert-player-name');
        const certDate = document.getElementById('cert-date');
        const certPoints = document.getElementById('cert-points');
        const certBadgeCount = document.getElementById('cert-badge-count');

        if (certName) certName.textContent = this.state.playerName;
        if (certDate) {
            const now = new Date();
            certDate.textContent = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        if (certPoints) certPoints.textContent = `${this.state.kindnessPoints} Poin Kebaikan`;
        if (certBadgeCount) certBadgeCount.textContent = `${this.state.unlockedBadges.length} Medali Karakter Diraih`;
    }

    printCertificate() {
        window.print();
    }

    // ============================================================
    // VISUAL EFFECTS & TOAST
    // ============================================================
    createConfetti() {
        const container = document.body;
        const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-20px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 6}px`;
            confetti.style.height = `${Math.random() * 14 + 6}px`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animation = `fallConfetti ${Math.random() * 2 + 1.5}s linear forwards`;

            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3500);
        }
    }

    createWaterDrops() {
        const canvas = document.getElementById('tree-virtue-canvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        for (let i = 0; i < 15; i++) {
            const drop = document.createElement('div');
            drop.className = 'water-drop';
            drop.textContent = '💧';
            drop.style.left = `${rect.left + Math.random() * rect.width * 0.6 + rect.width * 0.2}px`;
            drop.style.top = `${rect.top + 20}px`;
            document.body.appendChild(drop);

            setTimeout(() => drop.remove(), 1000);
        }
    }

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'game-toast animate-pop';
        toast.textContent = msg;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 2200);
    }
}

// Inisialisasi saat window dimuat
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new CharacterGame();
});
