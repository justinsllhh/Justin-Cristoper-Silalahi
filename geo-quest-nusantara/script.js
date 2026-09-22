/**
 * GeoQuest Nusantara - Game Engine & Logic
 */

// 1. Data Pertanyaan Peta Ekspedisi
const MAP_QUESTIONS = [
  {
    q: "Dimanakah letak wilayah Kepulauan Maluku?",
    target: "maluku",
    hint: "Wilayah kepulauan di timur Sulawesi yang terkenal dengan julukan 'The Spice Islands' (Kepulauan Rempah).",
    fact: "Maluku adalah penghasil utama pala dan cengkeh dunia sejak zaman jalur sutra maritim kuno."
  },
  {
    q: "Tunjukkan letak Pulau Sumatera di peta!",
    target: "sumatera",
    hint: "Pulau paling barat besar di Indonesia, rumah Danau Toba dan habitat Harimau Sumatera.",
    fact: "Sumatera adalah pulau terbesar keenam di dunia dan memiliki kekayaan alam minyak bumi serta kelapa sawit."
  },
  {
    q: "Di manakah letak Pulau Jawa?",
    target: "jawa",
    hint: "Pulau dengan populasi terpadat di Indonesia, pusat ekonomi dan ibu kota negara.",
    fact: "Jawa memiliki lebih dari 40 gunung berapi aktif dan warisan candi Borobudur serta Prambanan."
  },
  {
    q: "Pilih wilayah Pulau Kalimantan!",
    target: "kalimantan",
    hint: "Pulau terbesar di Indonesia dengan hutan hujan tropis lebat, habitat Orangutan dan Bekantan.",
    fact: "Kalimantan dikenal sebagai paru-paru dunia dan dilintasi langsung oleh garis khatulistiwa di Pontianak."
  },
  {
    q: "Manakah wilayah Pulau Sulawesi yang berbentuk huruf K?",
    target: "sulawesi",
    hint: "Pulau yang terkenal dengan keindahan bawah laut Bunaken dan budaya Tana Toraja.",
    fact: "Sulawesi memiliki fauna endemik unik hasil percampuran zona Wallacea seperti Anoa dan Babirusa."
  },
  {
    q: "Tunjukkan gugusan kepulauan Bali & Nusa Tenggara!",
    target: "nusatenggara",
    hint: "Deretan pulau wisata populer dunia, Danau Kelimutu 3 warna, dan habitat Komodo Dragon.",
    fact: "Pulau Komodo dan Rinca di Nusa Tenggara Timur adalah satu-satunya habitat asli komodo di muka bumi."
  },
  {
    q: "Manakah wilayah tanah Papua di ujung timur Indonesia?",
    target: "papua",
    hint: "Pulau paling timur Indonesia yang memiliki puncak bersalju Puncak Jaya dan burung Cendrawasih.",
    fact: "Papua memiliki hutan hujan terluas di Asia Pasifik dan keanekaragaman lebih dari 250 bahasa daerah."
  }
];

// 2. Data Kuis Budaya & Warisan Nusantara
const CULTURE_QUIZ = [
  {
    cat: "Rumah Adat",
    q: "Rumah adat 'Tongkonan' dengan atap melengkung menjulang menyerupai perahu berasal dari suku...",
    options: ["Suku Toraja (Sulawesi Selatan)", "Suku Batak (Sumatera Utara)", "Suku Minangkabau (Sumatera Barat)", "Suku Dayak (Kalimantan Timur)"],
    answer: 0,
    info: "Tongkonan adalah rumah adat orang Toraja. Atapnya melengkung menyerupai perahu kerajaan leluhur masa lampau."
  },
  {
    cat: "Senjata Tradisional",
    q: "Senjata tradisional 'Rencong' yang legendaris dan melambangkan keberanian pejuang berasal dari daerah...",
    options: ["DI Yogyakarta", "Aceh", "Jawa Barat", "Nusa Tenggara Barat"],
    answer: 1,
    info: "Rencong adalah senjata tajam khas Aceh yang bentuknya melambangkan huruf 'Bismillah' dalam aksara Arab."
  },
  {
    cat: "Tarian Tradisional",
    q: "Tari Saman yang diakui UNESCO sebagai Warisan Budaya Takbenda Dunia mengutamakan kekompakan gerakan tepukan tangan dari daerah...",
    options: ["Gayo, Aceh", "Minahasa, Sulawesi Utara", "Asmat, Papua", "Sasak, Lombok"],
    answer: 0,
    info: "Tari Saman diciptakan oleh Syekh Saman pada abad ke-14 dan dimainkan secara serentak tanpa iringan alat musik tambahan."
  },
  {
    cat: "Rumah Adat",
    q: "Rumah tradisional berbentuk bulat beratap jerami/alang-alang khas masyarakat pegunungan Papua bernama...",
    options: ["Honai", "Rumah Gadang", "Joglo", "Lamin"],
    answer: 0,
    info: "Honai dirancang pendek tanpa jendela agar mampu menahan udara dingin kawasan lembah pegunungan Papua."
  },
  {
    cat: "Alat Musik",
    q: "Alat musik petik tradisional berbahan dasar bambu dan daun lontar dari Pulau Rote NTT bernama...",
    options: ["Sasando", "Angklung", "Gamelan", "Kolintang"],
    answer: 0,
    info: "Sasando adalah alat musik dawai petik unik khas Pulau Rote yang menghasilkan alunan nada merdu nan syahdu."
  },
  {
    cat: "Situs Sejarah",
    q: "Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah dan dibangun pada abad ke-8 adalah...",
    options: ["Candi Borobudur", "Candi Muaro Jambi", "Candi Prambanan", "Candi Penataran"],
    answer: 0,
    info: "Candi Borobudur dibangun pada masa Wangsa Syailendra dan memiliki 504 arca Buddha serta ribuan relief batu."
  }
];

// 3. Ensiklopedia Kepulauan
const ENCYCLOPEDIA_DATA = {
  sumatera: {
    title: "Pulau Sumatera (Andalas)",
    area: "473.481 km²",
    fauna: "Harimau Sumatera, Gajah Sumatera, Badak Sumatera, Orangutan Tapanuli",
    landmarks: "Danau Toba (Danau Vulkanik Terbesar), Jembatan Ampera, Jam Gadang, Gunung Kerinci",
    desc: "Sumatera merupakan benteng alam bagian barat nusantara dengan jajaran Pegunungan Bukit Barisan yang kaya hasil bumi, rempah lada, kopi, dan minyak bumi."
  },
  jawa: {
    title: "Pulau Jawa (Javadwipa)",
    area: "128.297 km²",
    fauna: "Badak Jawa (Ujung Kulon), Elang Jawa, Banteng Jawa, Macan Tutul",
    landmarks: "Candi Borobudur, Monumen Nasional (Monas), Gunung Bromo, Kawah Ijen",
    desc: "Pusat peradaban kerajaan-kerajaan besar nusantara (Majapahit, Mataram, Tarumanegara) dan pusat denyut nadi industri serta pendidikan di Indonesia."
  },
  kalimantan: {
    title: "Pulau Kalimantan (Borneo)",
    area: "539.460 km² (Wilayah Indonesia)",
    fauna: "Orangutan Kalimantan, Bekantan Hidung Panjang, Enggang Gading",
    landmarks: "Sungai Mahakam & Kapuas, Pasar Terapung Lok Baintan, IKN Nusantara, Hutan Kayan Mentarang",
    desc: "Pulau tertua dengan hutan hujan tropis berusia lebih dari 140 juta tahun. Menjadi habitat ribuan spesies flora dan fauna endemik Kalimantan."
  },
  sulawesi: {
    title: "Pulau Sulawesi (Celebes)",
    area: "174.600 km²",
    fauna: "Anoa Dataran Rendah, Babirusa, Burung Maleo, Tarsius Spectrum",
    landmarks: "Taman Nasional Bawah Laut Bunaken & Wakatobi, Tana Toraja, Benteng Rotterdam",
    desc: "Pulau dengan keanekaragaman hayati unik garis Wallacea. Dikelilingi palung laut dalam yang menjadikannya surga terumbu karang dunia."
  },
  nusatenggara: {
    title: "Kepulauan Bali & Nusa Tenggara (Sunda Kecil)",
    area: "73.070 km²",
    fauna: "Komodo Dragon (Varanus komodoensis), Jalak Bali, Rusa Timor",
    landmarks: "Taman Nasional Komodo, Danau Kelimutu 3 Warna, Pura Tanah Lot, Gunung Rinjani",
    desc: "Gugusan kepulauan eksotis dengan keindahan pantai, tradisi adat adiluhung, serta keajaiban satwa purba komodo."
  },
  maluku: {
    title: "Kepulauan Maluku (The Spice Islands)",
    area: "78.897 km²",
    fauna: "Burung Nuri Maluku, Kakatua Seram, Kupu-kupu Sayap Burung",
    landmarks: "Benteng Belgica Banda Neira, Pantai Ora Seram, Gunung Gamalama Ternate",
    desc: "Pusat perdagangan rempah-rempah yang mengubah sejarah dunia pelayaran samudra pada abad ke-15 dan ke-16."
  },
  papua: {
    title: "Tanah Papua (Irian)",
    area: "418.707 km² (Wilayah Indonesia)",
    fauna: "Burung Cendrawasih (Bird of Paradise), Kanguru Pohon, Kasuari",
    landmarks: "Kepulauan Raja Ampat, Puncak Carstensz Pyramid (Salju Abadi), Lembah Baliem",
    desc: "Tanah surga di timur nusantara dengan keanekaragaman biologis terpadat, kekayaan mineral emas dan tembaga, serta ratusan suku budaya asli."
  }
};

// 4. Synthesizer Efek Suara (Web Audio)
class GamelanAudio {
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
  playGamelanBell(freq, duration = 0.5) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
  correct() {
    this.playGamelanBell(528, 0.4);
    setTimeout(() => this.playGamelanBell(660, 0.5), 100);
    setTimeout(() => this.playGamelanBell(792, 0.6), 200);
  }
  wrong() {
    this.playGamelanBell(220, 0.3);
    setTimeout(() => this.playGamelanBell(180, 0.4), 120);
  }
}

const geoSound = new GamelanAudio();

// 5. Game Controller
class GeoQuestGame {
  constructor() {
    this.score = parseInt(localStorage.getItem('geoquest_score')) || 0;
    this.badges = JSON.parse(localStorage.getItem('geoquest_badges')) || [];
    this.curMapIndex = 0;
    this.curCultureIndex = 0;
    this.combo = 1;
    this.timer = 15;
    this.timerInterval = null;

    this.initDOM();
    this.loadMapQuestion();
    this.loadCultureQuestion();
    this.initEncyclopedia();
    this.renderBadges();
    this.updateHUD();
  }

  initDOM() {
    // Nav tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(`tab-${btn.dataset.tab}`);
        if (target) target.classList.add('active');
      });
    });

    // Sound toggle
    const sBtn = document.getElementById('btn-sound');
    sBtn.addEventListener('click', () => {
      geoSound.enabled = !geoSound.enabled;
      sBtn.textContent = geoSound.enabled ? '🔊' : '🔇';
    });

    // Map Island Click Handlers
    document.querySelectorAll('.map-island').forEach(island => {
      island.addEventListener('click', () => {
        this.handleMapClick(island.dataset.region, island);
      });
    });

    // Culture Quiz Next Button
    document.getElementById('btn-cq-next').addEventListener('click', () => {
      this.curCultureIndex = (this.curCultureIndex + 1) % CULTURE_QUIZ.length;
      this.loadCultureQuestion();
    });
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timer = 15;
    document.getElementById('timer-display').textContent = `${this.timer}s`;
    this.timerInterval = setInterval(() => {
      this.timer--;
      document.getElementById('timer-display').textContent = `${this.timer}s`;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeOut();
      }
    }, 1000);
  }

  loadMapQuestion() {
    const qData = MAP_QUESTIONS[this.curMapIndex];
    document.getElementById('q-counter').textContent = `${this.curMapIndex + 1} / ${MAP_QUESTIONS.length}`;
    document.getElementById('mission-question').textContent = qData.q;
    document.getElementById('mission-hint').textContent = `Petunjuk: ${qData.hint}`;

    const banner = document.getElementById('map-feedback');
    banner.className = 'feedback-banner';
    banner.textContent = 'Pilih salah satu pulau di peta untuk menjawab tantangan!';

    this.startTimer();
  }

  handleMapClick(clickedRegion, elem) {
    clearInterval(this.timerInterval);
    const qData = MAP_QUESTIONS[this.curMapIndex];

    if (clickedRegion === qData.target) {
      // Benar!
      elem.classList.add('correct-flash');
      setTimeout(() => elem.classList.remove('correct-flash'), 1000);

      const added = 50 * this.combo;
      this.score += added;
      this.combo++;
      geoSound.correct();

      this.checkBadge('map_master');
      if (this.combo >= 3) this.checkBadge('combo_streak');

      const banner = document.getElementById('map-feedback');
      banner.className = 'feedback-banner success';
      banner.textContent = `🎉 TEPAT SEKALI! (+${added} Poin). Fakta: ${qData.fact}`;

      setTimeout(() => {
        this.curMapIndex = (this.curMapIndex + 1) % MAP_QUESTIONS.length;
        this.loadMapQuestion();
        this.updateHUD();
      }, 2500);

    } else {
      // Salah!
      elem.classList.add('wrong-flash');
      setTimeout(() => elem.classList.remove('wrong-flash'), 1000);

      this.combo = 1;
      geoSound.wrong();

      const banner = document.getElementById('map-feedback');
      banner.className = 'feedback-banner error';
      banner.textContent = `❌ Kurang tepat. Jawaban benar adalah ${qData.target.toUpperCase()}. Coba perhatikan petunjuknya.`;

      setTimeout(() => {
        this.curMapIndex = (this.curMapIndex + 1) % MAP_QUESTIONS.length;
        this.loadMapQuestion();
        this.updateHUD();
      }, 2500);
    }
    this.updateHUD();
  }

  handleTimeOut() {
    this.combo = 1;
    geoSound.wrong();
    const banner = document.getElementById('map-feedback');
    banner.className = 'feedback-banner error';
    banner.textContent = `⏰ Waktu habis! Tetap semangat, mari lanjut ke pulau berikutnya.`;
    setTimeout(() => {
      this.curMapIndex = (this.curMapIndex + 1) % MAP_QUESTIONS.length;
      this.loadMapQuestion();
      this.updateHUD();
    }, 2000);
  }

  loadCultureQuestion() {
    const q = CULTURE_QUIZ[this.curCultureIndex];
    document.getElementById('cq-category').textContent = `Kategori: ${q.cat}`;
    document.getElementById('cq-question').textContent = q.q;

    const optContainer = document.getElementById('cq-options');
    optContainer.innerHTML = '';
    const expBox = document.getElementById('cq-explanation');
    expBox.style.display = 'none';
    document.getElementById('btn-cq-next').style.display = 'none';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      btn.textContent = `${['A', 'B', 'C', 'D'][idx]}. ${opt}`;
      btn.addEventListener('click', () => this.handleCultureAnswer(idx, q.answer, q.info, btn));
      optContainer.appendChild(btn);
    });
  }

  handleCultureAnswer(chosen, correct, info, btn) {
    const allBtns = document.querySelectorAll('#cq-options .opt-btn');
    allBtns.forEach(b => b.disabled = true);

    const expBox = document.getElementById('cq-explanation');
    expBox.style.display = 'block';

    if (chosen === correct) {
      btn.classList.add('correct');
      geoSound.correct();
      this.score += 40;
      this.checkBadge('culture_sage');
      expBox.style.background = 'rgba(16, 185, 129, 0.2)';
      expBox.style.border = '1px solid #10b981';
      expBox.innerHTML = `<strong>Jawaban Benar! 🎉</strong><br>${info}`;
    } else {
      btn.classList.add('wrong');
      allBtns[correct].classList.add('correct');
      geoSound.wrong();
      expBox.style.background = 'rgba(244, 63, 94, 0.2)';
      expBox.style.border = '1px solid #f43f5e';
      expBox.innerHTML = `<strong>Kurang tepat.</strong><br>${info}`;
    }

    document.getElementById('btn-cq-next').style.display = 'inline-block';
    this.updateHUD();
  }

  initEncyclopedia() {
    const chips = document.getElementById('enc-chips');
    chips.innerHTML = '';
    const keys = Object.keys(ENCYCLOPEDIA_DATA);

    keys.forEach((k, idx) => {
      const btn = document.createElement('button');
      btn.className = `chip-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = ENCYCLOPEDIA_DATA[k].title.split(' ')[1] || ENCYCLOPEDIA_DATA[k].title;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderEncyclopediaDetail(k);
        this.checkBadge('curious_reader');
      });
      chips.appendChild(btn);
    });

    this.renderEncyclopediaDetail(keys[0]);
  }

  renderEncyclopediaDetail(key) {
    const d = ENCYCLOPEDIA_DATA[key];
    const container = document.getElementById('enc-details');
    container.innerHTML = `
      <div class="enc-header">
        <div>
          <h3>${d.title}</h3>
          <span style="color: var(--gold-glow); font-size: 0.85rem;">Luas Wilayah: ${d.area}</span>
        </div>
      </div>
      <p style="line-height: 1.6; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 14px;">${d.desc}</p>
      <div class="enc-grid-stats">
        <div class="enc-stat-item">
          <h4>🦁 Fauna & Flora Endemik</h4>
          <p>${d.fauna}</p>
        </div>
        <div class="enc-stat-item">
          <h4>🏛️ Landmark & Keajaiban Budaya</h4>
          <p>${d.landmarks}</p>
        </div>
      </div>
    `;
  }

  checkBadge(id) {
    if (!this.badges.includes(id)) {
      this.badges.push(id);
      this.save();
      this.renderBadges();
      this.updateHUD();
    }
  }

  updateHUD() {
    document.getElementById('user-score').textContent = `${this.score} Poin`;
    document.getElementById('combo-display').textContent = `x${this.combo} 🔥`;
    document.getElementById('user-badge-count').textContent = `${this.badges.length} / 6`;

    // Rank title
    let rank = 'Pelaut Pemula';
    if (this.score >= 500) rank = 'Laksamana Samudra Nusantara 👑';
    else if (this.score >= 250) rank = 'Penjelajah Pulau Ulung ⛵';
    else if (this.score >= 100) rank = 'Pramuka Bahari 🧭';
    document.getElementById('user-rank').textContent = rank;

    this.save();
  }

  renderBadges() {
    const allBadges = [
      { id: 'map_master', icon: '🧭', title: 'Navigator Peta', desc: 'Berhasil menebak koordinat pulau di peta nusantara.' },
      { id: 'combo_streak', icon: '🔥', title: 'Untaian Kemenangan', desc: 'Mencapai combo streak x3 tanpa kesalahan.' },
      { id: 'culture_sage', icon: '🎭', title: 'Cendekia Budaya', desc: 'Menjawab kuis warisan adat dan tradisi nusantara.' },
      { id: 'curious_reader', icon: '📖', title: 'Pustakawan Alam', desc: 'Membaca ensiklopedia kekayaan kepulauan.' },
      { id: 'master_explorer', icon: '👑', title: 'Ksatria Khatulistiwa', desc: 'Mencapai skor di atas 300 poin.' },
      { id: 'sabang_merauke', icon: '🇮🇩', title: 'Sabang Sampai Merauke', desc: 'Menjelajahi seluruh 7 kawasan pulau Indonesia.' }
    ];

    if (this.score >= 300) this.checkBadge('master_explorer');
    if (this.curMapIndex >= 6) this.checkBadge('sabang_merauke');

    const grid = document.getElementById('badges-grid');
    grid.innerHTML = '';

    allBadges.forEach(b => {
      const isUnlocked = this.badges.includes(b.id);
      const card = document.createElement('div');
      card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-title">${b.title}</div>
        <div class="badge-desc">${b.desc}</div>
        <div style="margin-top: 10px; font-size: 0.75rem; font-weight: 700; color: ${isUnlocked ? 'var(--gold-glow)' : 'var(--text-dim)'};">
          ${isUnlocked ? '✓ TERBUKA' : '🔒 TERKUNCI'}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  save() {
    localStorage.setItem('geoquest_score', this.score);
    localStorage.setItem('geoquest_badges', JSON.stringify(this.badges));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.geoQuest = new GeoQuestGame();
});
