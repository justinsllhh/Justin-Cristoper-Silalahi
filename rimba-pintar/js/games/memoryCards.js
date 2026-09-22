/**
 * Game 4: Memory Match (Kartu Memori & Otak Cemerlang)
 * Melatih daya ingat visual, konsentrasi, dan pengenalan konsep visual anak.
 */

class MemoryCardsGame {
  constructor() {
    this.container = document.getElementById('memory-game-content');
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.totalPairs = 6;
    this.isLocked = false;

    this.cardPool = [
      { id: 'tiger', emoji: '🐯', label: 'Harimau Rimba' },
      { id: 'elephant', emoji: '🐘', label: 'Gajah Pintar' },
      { id: 'rocket', emoji: '🚀', label: 'Roket Angkasa' },
      { id: 'tree', emoji: '🌳', label: 'Pohon Rimbun' },
      { id: 'star', emoji: '⭐', label: 'Bintang Emas' },
      { id: 'apple', emoji: '🍎', label: 'Apel Segar' },
      { id: 'owl', emoji: '🦉', label: 'Burung Hantu Bijak' },
      { id: 'planet', emoji: '🪐', label: 'Planet Saturnus' }
    ];
  }

  start() {
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isLocked = false;
    this.setupDeck();
    this.updateHUD();
    this.render();

    window.speechEngine.speak('Cari dan cocokkan pasangan kartu bergambar yang sama!');
  }

  setupDeck() {
    // Ambil 6 pasang unik dari cardPool
    const selected = [...this.cardPool].sort(() => 0.5 - Math.random()).slice(0, this.totalPairs);
    const deck = [];

    selected.forEach(item => {
      deck.push({ ...item, uid: Math.random() });
      deck.push({ ...item, uid: Math.random() });
    });

    // Shuffle deck
    this.cards = deck.sort(() => 0.5 - Math.random());
  }

  updateHUD() {
    document.getElementById('memory-round-val').innerText = `${this.matchedPairs}/${this.totalPairs}`;
    document.getElementById('memory-score-val').innerText = `${this.moves} Langkah`;
  }

  render() {
    this.container.innerHTML = `
      <div class="helper-speech-bubble">
        <div class="speech-text-wrap">
          <span class="speech-avatar">🧠</span>
          <span class="speech-text">Buka kartu dan temukan pasangan yang cocok!</span>
        </div>
        <button class="speech-speak-btn" onclick="window.speechEngine.speak('Buka dua kartu untuk mencari pasangan yang cocok!')">🔊</button>
      </div>

      <div class="memory-game-area">
        <div class="memory-cards-grid">
          ${this.cards.map((c, idx) => `
            <div class="memory-card" data-index="${idx}">
              <div class="memory-card-inner">
                <div class="card-face card-front">❓</div>
                <div class="card-face card-back">
                  <span class="card-emoji">${c.emoji}</span>
                  <span class="card-label">${c.label}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const cardElems = this.container.querySelectorAll('.memory-card');
    cardElems.forEach(cardElem => {
      cardElem.addEventListener('click', () => {
        const idx = parseInt(cardElem.getAttribute('data-index'));
        this.flipCard(idx, cardElem);
      });
    });
  }

  flipCard(idx, cardElem) {
    if (this.isLocked) return;
    if (cardElem.classList.contains('flipped') || cardElem.classList.contains('matched')) return;

    window.soundEngine.playFlip();
    cardElem.classList.add('flipped');
    this.flippedCards.push({ idx, card: this.cards[idx], elem: cardElem });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateHUD();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [first, second] = this.flippedCards;

    if (first.card.id === second.card.id) {
      // Cocok!
      setTimeout(() => {
        first.elem.classList.add('matched');
        second.elem.classList.add('matched');
        this.matchedPairs++;
        this.updateHUD();
        window.soundEngine.playCorrect();
        window.speechEngine.speak(`Hebat! Kamu menemukan pasangan ${first.card.label}!`);

        this.flippedCards = [];
        this.isLocked = false;

        if (this.matchedPairs === this.totalPairs) {
          setTimeout(() => this.finishGame(), 600);
        }
      }, 400);

    } else {
      // Tidak cocok, tutup kembali
      setTimeout(() => {
        window.soundEngine.playWrong();
        first.elem.classList.remove('flipped');
        second.elem.classList.remove('flipped');
        this.flippedCards = [];
        this.isLocked = false;
      }, 1000);
    }
  }

  finishGame() {
    window.soundEngine.playVictory();
    const starsEarned = this.moves <= 10 ? 5 : (this.moves <= 14 ? 4 : 3);
    window.appState.addStars(starsEarned);
    window.appState.unlockBadge('memory_champion');

    window.appState.showCelebrationModal({
      title: 'Juara Memori Super! 🧠',
      desc: `Luar biasa! Kamu menyelesaikan kartu memori dalam ${this.moves} langkah dengan daya ingat yang sangat tajam!`,
      stars: starsEarned,
      gameType: 'memory'
    });
  }
}

window.memoryCardsGame = new MemoryCardsGame();
