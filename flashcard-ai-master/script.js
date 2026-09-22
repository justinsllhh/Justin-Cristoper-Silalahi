/**
 * FlashMind - Spaced Repetition System (SRS) Engine
 */

// 1. Initial Curated Decks
const DEFAULT_DECKS = [
  {
    id: 'bio_1',
    name: 'Biologi & Anatomi Sel Tubuh',
    icon: '🧬',
    cards: [
      {
        id: 101,
        front: 'Apa fungsi utama organel Mitokondria di dalam sel eukariotik?',
        back: 'Sebagai pusat respirasi seluler yang menghasilkan energi dalam bentuk molekul ATP (Powerhouse of the cell).',
        box: 1,
        nextReview: 0
      },
      {
        id: 102,
        front: 'Di manakah tempat terjadinya proses Fotosintesis pada sel tumbuhan?',
        back: 'Di dalam Kloroplas, khususnya pada membran tilakoid (reaksi terang) dan stroma (siklus Calvin).',
        box: 2,
        nextReview: 0
      },
      {
        id: 103,
        front: 'Apakah peran utama dari Ribosom dalam sel?',
        back: 'Tempat berlangsungnya sintesis protein dengan menerjemahkan kode genetik mRNA.',
        box: 1,
        nextReview: 0
      },
      {
        id: 104,
        front: 'Enzim apakah yang berfungsi mencerna karbohidrat/amilum di dalam rongga mulut?',
        back: 'Enzim Ptialin (Amilase Saliva), mengubah amilum menjadi maltosa.',
        box: 3,
        nextReview: 0
      }
    ]
  },
  {
    id: 'eng_1',
    name: 'Kosakata Bahasa Inggris Akademik (IELTS)',
    icon: '🇬🇧',
    cards: [
      {
        id: 201,
        front: 'Arti & sinonim dari kata "Ubiquitous"',
        back: 'Hadir atau ditemukan di mana-mana pada saat yang sama (Omnipresent / Pervasive).',
        box: 1,
        nextReview: 0
      },
      {
        id: 202,
        front: 'Arti & sinonim dari kata "Pragmatic"',
        back: 'Bersikap praktis dan realistis berdasarkan kondisi nyata daripada teori semata.',
        box: 2,
        nextReview: 0
      },
      {
        id: 203,
        front: 'Arti & sinonim dari kata "Scrutinize"',
        back: 'Memeriksa atau meneliti sesuatu dengan sangat teliti dan cermat.',
        box: 1,
        nextReview: 0
      }
    ]
  },
  {
    id: 'phys_1',
    name: 'Rumus Cepat & Konsep Fisika',
    icon: '⚡',
    cards: [
      {
        id: 301,
        front: 'Apa bunyi dan rumus dari Hukum II Newton?',
        back: 'Percepatan berbanding lurus dengan resultan gaya dan berbanding terbalik dengan massa: F = m × a.',
        box: 4,
        nextReview: 0
      },
      {
        id: 302,
        front: 'Rumus menghitung Energi Potensial Gravitasi benda?',
        back: 'Ep = m × g × h (m: massa, g: percepatan gravitasi, h: ketinggian).',
        box: 3,
        nextReview: 0
      },
      {
        id: 303,
        front: 'Apakah bunyi Hukum Kekekalan Energi?',
        back: 'Energi tidak dapat diciptakan maupun dimusnahkan, melainkan hanya dapat berubah dari satu bentuk ke bentuk lain.',
        box: 2,
        nextReview: 0
      }
    ]
  },
  {
    id: 'hist_1',
    name: 'Sejarah & Tokoh Kemerdekaan RI',
    icon: '🏛️',
    cards: [
      {
        id: 401,
        front: 'Siapakah tokoh yang mengetik naskah Proklamasi Kemerdekaan Indonesia?',
        back: 'Sayuti Melik, setelah disempurnakan dari tulisan tangan Ir. Soekarno.',
        box: 3,
        nextReview: 0
      },
      {
        id: 402,
        front: 'Di manakah teks Proklamasi Kemerdekaan dibacakan pada 17 Agustus 1945?',
        back: 'Di Jalan Pegangsaan Timur No. 56, Jakarta Pusat (kediaman Ir. Soekarno).',
        box: 4,
        nextReview: 0
      }
    ]
  }
];

// 2. Sound Effects Synthesizer
class FlashAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playTone(freq, dur = 0.1, type = 'sine') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }
  flip() { this.playTone(400, 0.08, 'triangle'); }
  rateAgain() { this.playTone(220, 0.2, 'sawtooth'); }
  rateGood() {
    this.playTone(523, 0.1, 'sine');
    setTimeout(() => this.playTone(659, 0.15, 'sine'), 70);
  }
  rateEasy() {
    this.playTone(659, 0.1, 'sine');
    setTimeout(() => this.playTone(880, 0.2, 'triangle'), 80);
  }
}

const flashSound = new FlashAudio();

// 3. FlashMind Controller
class FlashMindApp {
  constructor() {
    this.decks = JSON.parse(localStorage.getItem('flashmind_decks')) || DEFAULT_DECKS;
    this.currentDeckId = this.decks[0].id;
    this.currentCardIndex = 0;
    this.isCardFlipped = false;

    // Quiz State
    this.quizCards = [];
    this.quizIndex = 0;
    this.quizScore = 0;

    this.initDOM();
    this.loadCurrentDeck();
    this.renderDecksGrid();
    this.updateStats();
  }

  initDOM() {
    // Navigation Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(`tab-${btn.dataset.tab}`);
        if (target) target.classList.add('active');

        if (btn.dataset.tab === 'quiz') this.initQuiz();
        if (btn.dataset.tab === 'stats') this.updateStats();
      });
    });

    // Sound toggle
    const sBtn = document.getElementById('btn-sound');
    sBtn.addEventListener('click', () => {
      flashSound.enabled = !flashSound.enabled;
      sBtn.textContent = flashSound.enabled ? '🔊' : '🔇';
    });

    // 3D Card Click to Flip
    const cardEl = document.getElementById('active-flashcard');
    cardEl.addEventListener('click', () => this.toggleCardFlip());

    document.getElementById('btn-flip-trigger').addEventListener('click', () => this.toggleCardFlip());

    // Prev / Next card
    document.getElementById('btn-prev-card').addEventListener('click', () => {
      const deck = this.getCurrentDeck();
      if (this.currentCardIndex > 0) {
        this.currentCardIndex--;
        this.renderActiveCard();
      }
    });

    document.getElementById('btn-next-card').addEventListener('click', () => {
      const deck = this.getCurrentDeck();
      if (this.currentCardIndex < deck.cards.length - 1) {
        this.currentCardIndex++;
        this.renderActiveCard();
      }
    });

    // Keyboard space to flip
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.getElementById('tab-study').classList.contains('active')) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.toggleCardFlip();
        }
      }
    });

    // SRS Rating Buttons
    document.querySelectorAll('.btn-srs').forEach(btn => {
      btn.addEventListener('click', () => {
        this.rateCurrentCard(btn.dataset.rating);
      });
    });

    // Deck Creation Modal
    document.getElementById('btn-create-deck').addEventListener('click', () => {
      document.getElementById('deck-modal').classList.add('active');
    });
    document.getElementById('btn-close-deck-modal').addEventListener('click', () => {
      document.getElementById('deck-modal').classList.remove('active');
    });

    document.getElementById('deck-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('deck-name-input').value.trim();
      const icon = document.getElementById('deck-icon-input').value.trim() || '📖';

      if (!name) return;
      const newDeck = {
        id: 'deck_' + Date.now(),
        name,
        icon,
        cards: []
      };
      this.decks.push(newDeck);
      this.saveDecks();
      this.renderDecksGrid();
      document.getElementById('deck-form').reset();
      document.getElementById('deck-modal').classList.remove('active');
    });

    // Card Creation Modal
    document.getElementById('btn-create-card').addEventListener('click', () => {
      this.populateDeckSelect();
      document.getElementById('card-modal').classList.add('active');
    });
    document.getElementById('btn-close-card-modal').addEventListener('click', () => {
      document.getElementById('card-modal').classList.remove('active');
    });

    document.getElementById('card-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const targetDeckId = document.getElementById('card-deck-select').value;
      const front = document.getElementById('card-front-input').value.trim();
      const back = document.getElementById('card-back-input').value.trim();

      if (!front || !back) return;
      const deck = this.decks.find(d => d.id === targetDeckId);
      if (deck) {
        deck.cards.push({
          id: Date.now(),
          front,
          back,
          box: 1,
          nextReview: 0
        });
        this.saveDecks();
        this.renderDecksGrid();
        if (this.currentDeckId === targetDeckId) this.renderActiveCard();
      }
      document.getElementById('card-form').reset();
      document.getElementById('card-modal').classList.remove('active');
    });

    // Export Decks
    document.getElementById('btn-export-decks').addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.decks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "flashmind_decks.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    // Quiz Next Button
    document.getElementById('btn-quiz-next').addEventListener('click', () => {
      this.quizIndex++;
      this.renderQuizQuestion();
    });
  }

  getCurrentDeck() {
    return this.decks.find(d => d.id === this.currentDeckId) || this.decks[0];
  }

  loadCurrentDeck() {
    const deck = this.getCurrentDeck();
    document.getElementById('current-deck-name').textContent = `${deck.icon} ${deck.name}`;
    this.currentCardIndex = 0;
    this.renderActiveCard();
  }

  renderActiveCard() {
    const deck = this.getCurrentDeck();
    this.isCardFlipped = false;
    document.getElementById('active-flashcard').classList.remove('flipped');

    if (deck.cards.length === 0) {
      document.getElementById('card-front-text').textContent = 'Deck ini masih kosong. Klik "Tambah Kartu" untuk menambahkan materi baru!';
      document.getElementById('card-back-text').textContent = 'Belum ada jawaban.';
      document.getElementById('study-progress-text').textContent = '0 / 0 Kartu';
      return;
    }

    const card = deck.cards[this.currentCardIndex];
    document.getElementById('card-front-text').textContent = card.front;
    document.getElementById('card-back-text').textContent = card.back;
    document.getElementById('study-progress-text').textContent = `Kartu ${this.currentCardIndex + 1} dari ${deck.cards.length} (Kotak SRS ${card.box})`;
  }

  toggleCardFlip() {
    this.isCardFlipped = !this.isCardFlipped;
    document.getElementById('active-flashcard').classList.toggle('flipped', this.isCardFlipped);
    flashSound.flip();
  }

  rateCurrentCard(rating) {
    const deck = this.getCurrentDeck();
    if (deck.cards.length === 0) return;

    const card = deck.cards[this.currentCardIndex];

    if (rating === 'again') {
      card.box = 1; // Reset to box 1
      flashSound.rateAgain();
    } else if (rating === 'hard') {
      card.box = Math.max(1, card.box);
      flashSound.rateGood();
    } else if (rating === 'good') {
      card.box = Math.min(4, card.box + 1);
      flashSound.rateGood();
    } else if (rating === 'easy') {
      card.box = Math.min(4, card.box + 2);
      flashSound.rateEasy();
    }

    this.saveDecks();
    this.updateStats();

    // Auto advance to next card
    if (this.currentCardIndex < deck.cards.length - 1) {
      this.currentCardIndex++;
    } else {
      this.currentCardIndex = 0;
    }
    this.renderActiveCard();
  }

  populateDeckSelect() {
    const sel = document.getElementById('card-deck-select');
    sel.innerHTML = '';
    this.decks.forEach(d => {
      sel.add(new Option(`${d.icon} ${d.name}`, d.id));
    });
    sel.value = this.currentDeckId;
  }

  renderDecksGrid() {
    const grid = document.getElementById('decks-grid');
    grid.innerHTML = '';

    this.decks.forEach(deck => {
      const card = document.createElement('div');
      card.className = `deck-card ${deck.id === this.currentDeckId ? 'active-deck' : ''}`;
      card.innerHTML = `
        <div class="deck-top">
          <span class="deck-icon">${deck.icon}</span>
          <div>
            <div class="deck-title">${deck.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${deck.cards.length} Flashcard</div>
          </div>
        </div>
        <div class="deck-meta">
          <span>Mastery: ${this.calcDeckMastery(deck)}%</span>
          <span style="color: var(--accent-purple); font-weight:700;">Pelajari ➔</span>
        </div>
      `;
      card.addEventListener('click', () => {
        this.currentDeckId = deck.id;
        this.loadCurrentDeck();
        this.renderDecksGrid();
        document.querySelector('.nav-btn[data-tab="study"]').click();
      });
      grid.appendChild(card);
    });
  }

  calcDeckMastery(deck) {
    if (deck.cards.length === 0) return 0;
    const totalPoints = deck.cards.reduce((acc, c) => acc + (c.box || 1), 0);
    const maxPoints = deck.cards.length * 4;
    return Math.round((totalPoints / maxPoints) * 100);
  }

  // Quiz Sprint Engine
  initQuiz() {
    const deck = this.getCurrentDeck();
    if (deck.cards.length < 2) {
      document.getElementById('quiz-q-text').textContent = 'Deck ini membutuhkan minimal 2 kartu untuk memulai kuis pilihan ganda.';
      document.getElementById('quiz-options').innerHTML = '';
      return;
    }

    this.quizCards = [...deck.cards].sort(() => Math.random() - 0.5);
    this.quizIndex = 0;
    this.quizScore = 0;
    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    if (this.quizIndex >= this.quizCards.length) {
      // Quiz Finished!
      document.getElementById('quiz-progress').textContent = 'Selesai! 🏆';
      document.getElementById('quiz-q-text').textContent = `Ujian Selesai! Skor Akhirmu: ${this.quizScore} / ${this.quizCards.length * 20} Poin.`;
      document.getElementById('quiz-options').innerHTML = '';
      document.getElementById('btn-quiz-next').style.display = 'none';
      document.getElementById('quiz-result-msg').innerHTML = '<span style="color: var(--accent-emerald);">Luar biasa! Hafalanmu semakin melekat di ingatan.</span>';
      return;
    }

    const currentCard = this.quizCards[this.quizIndex];
    document.getElementById('quiz-progress').textContent = `Soal ${this.quizIndex + 1} / ${this.quizCards.length}`;
    document.getElementById('quiz-score-live').textContent = `Skor: ${this.quizScore}`;
    document.getElementById('quiz-q-text').textContent = currentCard.front;

    const optContainer = document.getElementById('quiz-options');
    optContainer.innerHTML = '';
    document.getElementById('quiz-result-msg').textContent = '';
    document.getElementById('btn-quiz-next').style.display = 'none';

    // Generate 3 choices (1 correct, 2 distractors)
    const otherCards = this.getCurrentDeck().cards.filter(c => c.id !== currentCard.id);
    const distractors = otherCards.sort(() => Math.random() - 0.5).slice(0, 2).map(c => c.back);
    const choices = [currentCard.back, ...distractors].sort(() => Math.random() - 0.5);

    choices.forEach(ans => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = ans;
      btn.addEventListener('click', () => {
        const all = optContainer.querySelectorAll('.quiz-opt-btn');
        all.forEach(b => b.disabled = true);

        if (ans === currentCard.back) {
          btn.classList.add('correct');
          flashSound.rateGood();
          this.quizScore += 20;
          document.getElementById('quiz-result-msg').innerHTML = '<span style="color: var(--accent-emerald);">✓ Jawaban Tepat! (+20 Poin)</span>';
        } else {
          btn.classList.add('wrong');
          flashSound.rateAgain();
          all.forEach(b => {
            if (b.textContent === currentCard.back) b.classList.add('correct');
          });
          document.getElementById('quiz-result-msg').innerHTML = '<span style="color: var(--accent-rose);">❌ Kurang tepat. Jawaban benar telah ditandai hijau.</span>';
        }
        document.getElementById('quiz-score-live').textContent = `Skor: ${this.quizScore}`;
        document.getElementById('btn-quiz-next').style.display = 'inline-block';
      });
      optContainer.appendChild(btn);
    });
  }

  updateStats() {
    let b1 = 0, b2 = 0, b3 = 0, b4 = 0, totalCards = 0;
    this.decks.forEach(d => {
      d.cards.forEach(c => {
        totalCards++;
        if (c.box === 1) b1++;
        else if (c.box === 2) b2++;
        else if (c.box === 3) b3++;
        else if (c.box === 4) b4++;
      });
    });

    document.getElementById('box1-count').textContent = `${b1} kartu`;
    document.getElementById('box2-count').textContent = `${b2} kartu`;
    document.getElementById('box3-count').textContent = `${b3} kartu`;
    document.getElementById('box4-count').textContent = `${b4} kartu`;

    document.getElementById('mastered-count').textContent = `${b4} Kartu`;

    const masteryPercent = totalCards > 0 ? Math.round(((b2 * 0.33 + b3 * 0.66 + b4 * 1) / totalCards) * 100) : 0;
    document.getElementById('mastery-fill').style.width = `${masteryPercent}%`;
    document.getElementById('mastery-percentage-text').textContent = `${masteryPercent}% Materi Telah Menetap di Memori Jangka Panjang`;
  }

  saveDecks() {
    localStorage.setItem('flashmind_decks', JSON.stringify(this.decks));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.flashMind = new FlashMindApp();
});
