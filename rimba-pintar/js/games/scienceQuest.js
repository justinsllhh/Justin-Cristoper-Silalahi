/**
 * Game 2: Science Quest (Eksplorasi Sains, Alam & Luar Angkasa)
 */

class ScienceQuestGame {
  constructor() {
    this.container = document.getElementById('science-game-content');
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.totalQuestions = 6;
    this.activeQuestions = [];

    this.questionsDatabase = [
      {
        topic: 'Tata Surya 🪐',
        visual: '🪐',
        question: 'Planet apakah yang memiliki cincin es paling indah dan besar di Tata Surya kita?',
        options: ['Mars', 'Saturnus', 'Bumi', 'Merkurius'],
        correct: 1,
        explanation: 'Saturnus terkenal karena memiliki ribuan cincin indah yang terbentuk dari partikel es dan batuan luar angkasa!'
      },
      {
        topic: 'Dunia Hewan 🦁',
        visual: '🦁',
        question: 'Singa dan Harimau memakan daging. Mereka termasuk kelompok hewan apa?',
        options: ['Herbivora', 'Karnivora', 'Omnivora', 'Insektivora'],
        correct: 1,
        explanation: 'Karnivora adalah sebutan untuk hewan pemakan daging, memiliki gigi taring yang tajam untuk berburu.'
      },
      {
        topic: 'Tubuh Manusia 🫀',
        visual: '🫀',
        question: 'Organ dalam tubuh kita yang bertugas memompa darah ke seluruh tubuh adalah...?',
        options: ['Lambung', 'Paru-paru', 'Jantung', 'Hati'],
        correct: 2,
        explanation: 'Jantung berdetak setiap detik tanpa henti untuk memompa darah yang kaya oksigen ke seluruh tubuh kita!'
      },
      {
        topic: 'Tumbuhan & Alam 🌱',
        visual: '☀️',
        question: 'Tumbuhan hijau membutuhkan cahaya matahari dan zat hijau daun untuk membuat makanan melalui proses...?',
        options: ['Fotosintesis', 'Metamorfosis', 'Hibernasi', 'Evolusi'],
        correct: 0,
        explanation: 'Fotosintesis adalah proses ajaib tumbuhan membuat energinya sendiri dengan bantuan klorofil dan sinar matahari!'
      },
      {
        topic: 'Sains Benda 🧊',
        visual: '🧊',
        question: 'Jika es batu dibiarkan di tempat panas, es akan mencair menjadi air. Perubahan wujud ini disebut...?',
        options: ['Membeku', 'Mencair / Melebur', 'Menguap', 'Menyublim'],
        correct: 1,
        explanation: 'Mencair terjadi ketika benda padat seperti es batu menyerap panas dan berubah menjadi zat cair.'
      },
      {
        topic: 'Luar Angkasa 🌙',
        visual: '🌕',
        question: 'Apakah nama benda langit yang menjadi satelit alami Bumi dan bersinar di malam hari?',
        options: ['Matahari', 'Bintang Kejora', 'Bulan', 'Komet'],
        correct: 2,
        explanation: 'Bulan mengitari bumi kita dan memantulkan cahaya dari matahari sehingga tampak bercahaya indah di malam hari!'
      },
      {
        topic: 'Sains Hewan 🐬',
        visual: '🐬',
        question: 'Lumba-lumba hidup di air laut, tetapi mereka bukan ikan melainkan...?',
        options: ['Amfibi', 'Reptil', 'Mamalia', 'Unggas'],
        correct: 2,
        explanation: 'Lumba-lumba adalah mamalia yang bernapas dengan paru-paru dan menyusui anaknya!'
      }
    ];
  }

  start() {
    this.score = 0;
    this.currentQuestionIdx = 0;
    // Shuffle & ambil 6 pertanyaan
    this.activeQuestions = [...this.questionsDatabase].sort(() => 0.5 - Math.random()).slice(0, this.totalQuestions);
    this.renderQuestion();
  }

  updateHUD() {
    document.getElementById('science-round-val').innerText = `${this.currentQuestionIdx + 1}/${this.totalQuestions}`;
    document.getElementById('science-score-val').innerText = this.score;
  }

  renderQuestion() {
    if (this.currentQuestionIdx >= this.activeQuestions.length) {
      this.finishGame();
      return;
    }

    this.updateHUD();
    const q = this.activeQuestions[this.currentQuestionIdx];

    this.container.innerHTML = `
      <div class="helper-speech-bubble">
        <div class="speech-text-wrap">
          <span class="speech-avatar">🔬</span>
          <span class="speech-text">Pilihlah satu jawaban yang paling tepat ya adik-adik pintar!</span>
        </div>
        <button class="speech-speak-btn" onclick="window.speechEngine.speak('${q.question}')" title="Bacakan Soal">🔊</button>
      </div>

      <div class="science-game-area">
        <div class="science-question-box">
          <span class="science-badge-topic">${q.topic}</span>
          <div class="science-q-visual">${q.visual}</div>
          <h2 class="science-q-text">${q.question}</h2>
        </div>

        <div class="science-options-grid">
          ${q.options.map((opt, idx) => `
            <button class="science-opt-btn" data-idx="${idx}">
              <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div id="science-explanation-zone"></div>
      </div>
    `;

    // Narasi suara soal
    window.speechEngine.speak(q.question);

    this.attachEvents();
  }

  attachEvents() {
    const buttons = this.container.querySelectorAll('.science-opt-btn');
    const q = this.activeQuestions[this.currentQuestionIdx];

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const chosenIdx = parseInt(btn.getAttribute('data-idx'));
        this.handleAnswer(chosenIdx, btn, buttons);
      });
    });
  }

  handleAnswer(chosenIdx, selectedBtn, allBtns) {
    const q = this.activeQuestions[this.currentQuestionIdx];
    allBtns.forEach(b => b.style.pointerEvents = 'none'); // Disable further clicks

    const explanationZone = document.getElementById('science-explanation-zone');

    if (chosenIdx === q.correct) {
      selectedBtn.classList.add('correct');
      this.score += 20;
      window.soundEngine.playCorrect();

      explanationZone.innerHTML = `
        <div class="science-explanation-card">
          <div>
            <strong>✨ Jawaban Benar!</strong>
            <p style="margin-top: 4px; color: #166534;">${q.explanation}</p>
          </div>
          <button class="btn-primary" id="next-sci-btn" style="padding: 8px 18px; font-size: 0.95rem;">Lanjut ➜</button>
        </div>
      `;

      window.speechEngine.speak(`Luar biasa! Benar. ${q.explanation}`);

    } else {
      selectedBtn.classList.add('wrong');
      allBtns[q.correct].classList.add('correct');
      window.soundEngine.playWrong();

      explanationZone.innerHTML = `
        <div class="science-explanation-card" style="background: #fffbeb; border-color: #fde68a;">
          <div>
            <strong>💡 Tahukah Kamu?</strong>
            <p style="margin-top: 4px; color: #854d0e;">${q.explanation}</p>
          </div>
          <button class="btn-primary" id="next-sci-btn" style="padding: 8px 18px; font-size: 0.95rem;">Lanjut ➜</button>
        </div>
      `;

      window.speechEngine.speak(`Jawaban yang benar adalah ${q.options[q.correct]}. ${q.explanation}`);
    }

    document.getElementById('next-sci-btn').addEventListener('click', () => {
      this.currentQuestionIdx++;
      this.renderQuestion();
    });
  }

  finishGame() {
    window.soundEngine.playVictory();
    const starsEarned = Math.min(5, Math.max(1, Math.floor(this.score / 25)));
    window.appState.addStars(starsEarned);
    window.appState.unlockBadge('science_explorer');

    window.appState.showCelebrationModal({
      title: 'Profesor Rimba Cilik! 🔭',
      desc: `Kamu telah menyelesaikan Ekspedisi Sains dengan skor gemilang ${this.score} Poin! Teruslah penasaran dan menjelajahi keajaiban alam semesta!`,
      stars: starsEarned,
      gameType: 'science'
    });
  }
}

window.scienceQuestGame = new ScienceQuestGame();
