/**
 * Game 1: Eco-Sorter (Pilah Sampah Cerdas & Peduli Bumi)
 */

class EcoSorterGame {
  constructor() {
    this.container = document.getElementById('eco-game-content');
    this.score = 0;
    this.round = 1;
    this.maxRounds = 8;
    this.currentItem = null;
    this.streak = 0;

    this.itemsPool = [
      { id: 'banana', name: 'Kulit Pisang', emoji: '🍌', type: 'organik', fact: 'Kulit pisang adalah sampah organik yang bisa diolah jadi pupuk kompos!' },
      { id: 'apple', name: 'Sisa Apel', emoji: '🍎', type: 'organik', fact: 'Sisa buah mudah membusuk dan sangat baik untuk nutrisi cacing tanah.' },
      { id: 'leaf', name: 'Daun Kering', emoji: '🍂', type: 'organik', fact: 'Daun gugur bisa ditimbun di tanah untuk menyuburkan tanaman bunga.' },
      { id: 'fishbone', name: 'Tulang Ikan', emoji: '🐟', type: 'organik', fact: 'Sisa makanan hewani masuk kategori organik alami.' },
      
      { id: 'plastic_bottle', name: 'Botol Plastik', emoji: '🍾', type: 'anorganik', fact: 'Botol plastik butuh ratusan tahun untuk terurai. Yuk daur ulang!' },
      { id: 'soda_can', name: 'Kaleng Soda', emoji: '🥫', type: 'anorganik', fact: 'Kaleng aluminium dapat dilebur kembali menjadi kaleng baru berulang kali.' },
      { id: 'plastic_bag', name: 'Kantong Plastik', emoji: '🛍️', type: 'anorganik', fact: 'Gunakan tas kain belanja agar kita mengurangi sampah plastik ya!' },
      { id: 'straw', name: 'Sedotan Plastik', emoji: '🥤', type: 'anorganik', fact: 'Sedotan plastik kecil bisa membahayakan hewan laut jika dibuang sembarangan.' },

      { id: 'newspaper', name: 'Koran Bekas', emoji: '📰', type: 'kertas', fact: 'Koran bekas dapat diolah menjadi kertas daur ulang atau kerajinan tangan.' },
      { id: 'cardboard', name: 'Kardus Box', emoji: '📦', type: 'kertas', fact: 'Kardus terbuat dari serat pohon, memilahnya membantu menyelamatkan hutan.' },
      { id: 'book', name: 'Buku Rusak', emoji: '📚', type: 'kertas', fact: 'Kertas bersih bisa dihancurkan dan dibuat kertas baru yang bermanfaat.' },
      
      { id: 'battery', name: 'Baterai Bekas', emoji: '🔋', type: 'b3', fact: 'Baterai mengandung zat kimia berbahaya (B3) yang tidak boleh dibuang sembarangan!' },
      { id: 'bulb', name: 'Lampu Bohlam', emoji: '💡', type: 'b3', fact: 'Lampu bohlam kaca dan gas merkuri memerlukan penanganan khusus limbah B3.' },
      { id: 'spray', name: 'Kaleng Semprotan', emoji: '🧴', type: 'b3', fact: 'Limbah aerosol bertekanan tinggi harus dipisah ke tempat sampah B3 khusus.' }
    ];
  }

  start() {
    this.score = 0;
    this.round = 1;
    this.streak = 0;
    this.updateHUD();
    this.nextRound();
  }

  updateHUD() {
    document.getElementById('eco-round-val').innerText = `${this.round}/${this.maxRounds}`;
    document.getElementById('eco-score-val').innerText = this.score;
  }

  nextRound() {
    if (this.round > this.maxRounds) {
      this.finishGame();
      return;
    }

    this.updateHUD();
    const randomIndex = Math.floor(Math.random() * this.itemsPool.length);
    this.currentItem = this.itemsPool[randomIndex];

    this.render();

    // Narasi suara
    window.speechEngine.speak(`Pilah sampah berikut: ${this.currentItem.name}. Masukkan ke tong yang mana ya?`);
  }

  render() {
    this.container.innerHTML = `
      <div class="helper-speech-bubble">
        <div class="speech-text-wrap">
          <span class="speech-avatar">🦔</span>
          <span class="speech-text">Tarik atau klik tong sampah yang cocok untuk <strong>${this.currentItem.name}</strong>!</span>
        </div>
        <button class="speech-speak-btn" onclick="window.speechEngine.speak('Pilah sampah: ${this.currentItem.name}')" title="Dengarkan Suara">🔊</button>
      </div>

      <div class="eco-game-area">
        <div class="eco-spawn-zone">
          <div class="eco-item-card" draggable="true" id="draggable-trash-item">
            <span class="eco-item-icon">${this.currentItem.emoji}</span>
            <span class="eco-item-name">${this.currentItem.name}</span>
          </div>
        </div>

        <div class="eco-bins-container">
          <div class="eco-bin bin-organik" data-type="organik">
            <div class="bin-icon">🍏</div>
            <div class="bin-title">Organik (Hijau)</div>
            <div class="bin-desc">Sisa makanan, daun, buah</div>
          </div>
          <div class="eco-bin bin-anorganik" data-type="anorganik">
            <div class="bin-icon">🥤</div>
            <div class="bin-title">Anorganik (Kuning)</div>
            <div class="bin-desc">Plastik, kaleng, botol</div>
          </div>
          <div class="eco-bin bin-kertas" data-type="kertas">
            <div class="bin-icon">📦</div>
            <div class="bin-title">Kertas (Biru)</div>
            <div class="bin-desc">Buku, kardus, koran</div>
          </div>
          <div class="eco-bin bin-b3" data-type="b3">
            <div class="bin-icon">⚠️</div>
            <div class="bin-title">B3 Berbahaya (Merah)</div>
            <div class="bin-desc">Baterai, lampu, zat kimia</div>
          </div>
        </div>

        <div id="eco-feedback-box" style="width: 100%; display: flex; justify-content: center;"></div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const trashCard = document.getElementById('draggable-trash-item');
    const bins = this.container.querySelectorAll('.eco-bin');

    trashCard.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', this.currentItem.type);
    });

    bins.forEach((bin) => {
      // Drag events
      bin.addEventListener('dragover', (e) => {
        e.preventDefault();
        bin.classList.add('drag-over');
      });

      bin.addEventListener('dragleave', () => {
        bin.classList.remove('drag-over');
      });

      bin.addEventListener('drop', (e) => {
        e.preventDefault();
        bin.classList.remove('drag-over');
        const binType = bin.getAttribute('data-type');
        this.checkAnswer(binType, bin);
      });

      // Click/Tap event for touch devices
      bin.addEventListener('click', () => {
        const binType = bin.getAttribute('data-type');
        this.checkAnswer(binType, bin);
      });
    });
  }

  checkAnswer(chosenType, binElem) {
    const isCorrect = (chosenType === this.currentItem.type);
    const feedbackBox = document.getElementById('eco-feedback-box');

    if (isCorrect) {
      this.score += 15;
      this.streak++;
      window.soundEngine.playCorrect();
      
      feedbackBox.innerHTML = `
        <div class="eco-fun-fact" style="border-color: #22c55e; background: #ecfdf5; color: #15803d;">
          🎉 <strong>Hebat Sekali! Tepat!</strong><br>${this.currentItem.fact}
        </div>
      `;

      window.speechEngine.speak(`Hebat! ${this.currentItem.name} masuk ke tong ${chosenType}. ${this.currentItem.fact}`);

      setTimeout(() => {
        this.round++;
        this.nextRound();
      }, 2500);

    } else {
      this.streak = 0;
      window.soundEngine.playWrong();

      feedbackBox.innerHTML = `
        <div class="eco-fun-fact" style="border-color: #ef4444; background: #fef2f2; color: #b91c1c;">
          💡 <strong>Kurang Tepat!</strong> Coba lagi ya. ${this.currentItem.name} sebaiknya masuk ke tong yang sesuai!
        </div>
      `;

      window.speechEngine.speak(`Kurang tepat, coba perhatikan lagi jenis ${this.currentItem.name}.`);
    }
  }

  finishGame() {
    window.soundEngine.playVictory();
    const starsEarned = Math.min(5, Math.max(1, Math.floor(this.score / 25)));
    window.appState.addStars(starsEarned);
    window.appState.unlockBadge('eco_warrior');

    window.appState.showCelebrationModal({
      title: 'Pahlawan Lingkungan! 🌿',
      desc: `Kamu berhasil memilah sampah dengan sangat baik dan mendapatkan ${this.score} Poin! Bumi jadi lebih bersih dan asri berkat bantuanmu!`,
      stars: starsEarned,
      gameType: 'eco'
    });
  }
}

window.ecoSorterGame = new EcoSorterGame();
