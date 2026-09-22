/**
 * ChemLab Alchemist - Game Engine & Logic
 */

// 1. Data Unsur Kimia (Periodic Elements)
const ELEMENTS = [
  { num: 1, sym: 'H', name: 'Hidrogen', mass: 1.008, cat: 'nonmetal', desc: 'Unsur paling ringan dan paling melimpah di alam semesta.' },
  { num: 2, sym: 'He', name: 'Helium', mass: 4.002, cat: 'halogen', desc: 'Gas mulia ringan tidak berbau dan tidak mudah terbakar.' },
  { num: 3, sym: 'Li', name: 'Litium', mass: 6.94, cat: 'alkali', desc: 'Logam alkali lunak, komponen utama baterai gawai modern.' },
  { num: 6, sym: 'C', name: 'Karbon', mass: 12.011, cat: 'nonmetal', desc: 'Fondasi utama seluruh senyawa organik dan kehidupan di bumi.' },
  { num: 7, sym: 'N', name: 'Nitrogen', mass: 14.007, cat: 'nonmetal', desc: 'Menyusun sekitar 78% atmosfer bumi, bahan baku pupuk.' },
  { num: 8, sym: 'O', name: 'Oksigen', mass: 15.999, cat: 'nonmetal', desc: 'Gas esensial respirasi makhluk hidup dan proses pembakaran.' },
  { num: 9, sym: 'F', name: 'Fluorin', mass: 18.998, cat: 'halogen', desc: 'Halogen sangat reaktif, digunakan pada pasta gigi & pendingin.' },
  { num: 11, sym: 'Na', name: 'Natrium', mass: 22.990, cat: 'alkali', desc: 'Logam reaktif yang membentuk garam dapur bersama klorin.' },
  { num: 12, sym: 'Mg', name: 'Magnesium', mass: 24.305, cat: 'metal', desc: 'Logam ringan untuk kembang api dan struktur paduan kuat.' },
  { num: 13, sym: 'Al', name: 'Aluminium', mass: 26.982, cat: 'metal', desc: 'Logam tahan karat untuk bodi pesawat dan kaleng minuman.' },
  { num: 14, sym: 'Si', name: 'Silikon', mass: 28.085, cat: 'nonmetal', desc: 'Semikonduktor vital pembuatan chip mikroprosesor komputer.' },
  { num: 15, sym: 'P', name: 'Fosfor', mass: 30.974, cat: 'nonmetal', desc: 'Unsur penting DNA/RNA, korek api, dan pupuk fosfat.' },
  { num: 16, sym: 'S', name: 'Belerang', mass: 32.06, cat: 'nonmetal', desc: 'Padatan kuning berbau khas, bahan pembuatan asam sulfat.' },
  { num: 17, sym: 'Cl', name: 'Klorin', mass: 35.45, cat: 'halogen', desc: 'Gas halogen pembersih air dan antiseptik kuat.' },
  { num: 19, sym: 'K', name: 'Kalium', mass: 39.098, cat: 'alkali', desc: 'Mineral esensial fungsi saraf, otot, dan nutrisi tumbuhan.' },
  { num: 20, sym: 'Ca', name: 'Kalsium', mass: 40.078, cat: 'metal', desc: 'Unsur pembentuk tulang, gigi, dan batu kapur / marmer.' },
  { num: 26, sym: 'Fe', name: 'Besi', mass: 55.845, cat: 'metal', desc: 'Logam paling banyak digunakan di bumi untuk konstruksi & baja.' },
  { num: 29, sym: 'Cu', name: 'Tembaga', mass: 63.546, cat: 'metal', desc: 'Konduktor listrik prima untuk kabel dan komponen elektronika.' }
];

// 2. Daftar Resep Reaksi & Molekul (Synthesis Database)
const RECIPES = [
  {
    formula: 'H₂O',
    name: 'Air (Dihidrogen Monoksida)',
    elements: { H: 2, O: 1 },
    equation: '2H + O ➔ H₂O',
    desc: 'Pelarut universal terpenting bagi seluruh metabolisme makhluk hidup.',
    xp: 50,
    color: '#06b6d4'
  },
  {
    formula: 'CO₂',
    name: 'Karbon Dioksida',
    elements: { C: 1, O: 2 },
    equation: 'C + 2O ➔ CO₂',
    desc: 'Gas hasil pernapasan dan bahan baku utama fotosintesis tumbuhan.',
    xp: 60,
    color: '#94a3b8'
  },
  {
    formula: 'NaCl',
    name: 'Garam Dapur (Natrium Klorida)',
    elements: { Na: 1, Cl: 1 },
    equation: 'Na + Cl ➔ NaCl',
    desc: 'Bumbu penyedap masakan dan pengatur keseimbangan cairan elektrolit tubuh.',
    xp: 75,
    color: '#f8fafc'
  },
  {
    formula: 'CH₄',
    name: 'Metana (Gas Alam)',
    elements: { C: 1, H: 4 },
    equation: 'C + 4H ➔ CH₄',
    desc: 'Hidrokarbon paling sederhana, komponen utama gas alam untuk bahan bakar.',
    xp: 80,
    color: '#10b981'
  },
  {
    formula: 'NH₃',
    name: 'Amonia',
    elements: { N: 1, H: 3 },
    equation: 'N + 3H ➔ NH₃',
    desc: 'Senyawa berbau tajam, bahan baku pembuatan pupuk urea dan pembersih.',
    xp: 85,
    color: '#8b5cf6'
  },
  {
    formula: 'O₂',
    name: 'Gas Oksigen Diatomik',
    elements: { O: 2 },
    equation: 'O + O ➔ O₂',
    desc: 'Bentuk molekul gas oksigen yang kita hirup setiap detik.',
    xp: 40,
    color: '#38bdf8'
  },
  {
    formula: 'N₂',
    name: 'Gas Nitrogen Diatomik',
    elements: { N: 2 },
    equation: 'N + N ➔ N₂',
    desc: 'Molekul berikatan kovalen rangkap tiga yang sangat stabil di atmosfer.',
    xp: 45,
    color: '#6366f1'
  },
  {
    formula: 'HCl',
    name: 'Asam Klorida (Asam Lambung)',
    elements: { H: 1, Cl: 1 },
    equation: 'H + Cl ➔ HCl',
    desc: 'Asam kuat yang diproduksi lambung untuk mencerna makanan & bunuh kuman.',
    xp: 90,
    color: '#eab308'
  },
  {
    formula: 'Fe₂O₃',
    name: 'Karat Besi (Besi(III) Oksida)',
    elements: { Fe: 2, O: 3 },
    equation: '2Fe + 3O ➔ Fe₂O₃',
    desc: 'Senyawa oksida kemerahan akibat reaksi korosi besi dengan oksigen lembap.',
    xp: 110,
    color: '#ea580c'
  },
  {
    formula: 'CaCO₃',
    name: 'Kalsium Karbonat (Batu Kapur)',
    elements: { Ca: 1, C: 1, O: 3 },
    equation: 'Ca + C + 3O ➔ CaCO₃',
    desc: 'Komponen cangkang telur, terumbu karang, kapur tulis, dan marmer.',
    xp: 130,
    color: '#cbd5e1'
  },
  {
    formula: 'H₂SO₄',
    name: 'Asam Sulfat (Air Aki)',
    elements: { H: 2, S: 1, O: 4 },
    equation: '2H + S + 4O ➔ H₂SO₄',
    desc: 'Asam mineral kuat komoditas industri terbesar, digunakan pada elektrolit baterai aki.',
    xp: 150,
    color: '#ef4444'
  },
  {
    formula: 'SiO₂',
    name: 'Silikon Dioksida (Pasir Kuarsa)',
    elements: { Si: 1, O: 2 },
    equation: 'Si + 2O ➔ SiO₂',
    desc: 'Bahan utama pembuatan kaca jendela, gelas laboratorium, dan optik.',
    xp: 100,
    color: '#f59e0b'
  }
];

// 3. Audio Synthesizer (Web Audio API)
class SoundFX {
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
  playTone(freq, type = 'sine', duration = 0.15, vol = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
  addBeep() {
    this.playTone(520, 'sine', 0.1, 0.12);
  }
  removeBeep() {
    this.playTone(320, 'triangle', 0.1, 0.1);
  }
  successSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.15), idx * 80);
    });
  }
  failSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    this.playTone(200, 'sawtooth', 0.25, 0.15);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.35, 0.18), 120);
  }
}

const sfx = new SoundFX();

// 4. Particle System
class ParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.loop = this.loop.bind(this);
  }

  emit(color = '#06b6d4', count = 35) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 + 30;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: Math.random() * 4 + 2,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
    if (!this.animating) {
      this.animating = true;
      requestAnimationFrame(this.loop);
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(this.loop);
    } else {
      this.animating = false;
    }
  }
}

// 5. Game State & Controller
class ChemLabGame {
  constructor() {
    this.beaker = []; // Array of element symbols e.g. ['H', 'H', 'O']
    this.points = parseInt(localStorage.getItem('chemlab_points')) || 0;
    this.discovered = JSON.parse(localStorage.getItem('chemlab_discovered')) || ['H₂O'];
    this.particles = new ParticleCanvas('particle-canvas');
    this.initUI();
    this.renderShelf('all');
    this.renderPeriodicTable();
    this.renderQuests();
    this.renderJournal();
    this.updateStats();
  }

  initUI() {
    // Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(`tab-${tab.dataset.tab}`);
        if (target) target.classList.add('active');
      });
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    soundBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      soundBtn.textContent = sfx.enabled ? '🔊' : '🔇';
    });

    // Filter elements
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderShelf(btn.dataset.category);
      });
    });

    // Beaker Buttons
    document.getElementById('btn-react').addEventListener('click', () => this.performReaction());
    document.getElementById('btn-clear').addEventListener('click', () => this.clearBeaker());
    document.getElementById('btn-hint').addEventListener('click', () => this.giveHint());

    // Modal Close
    document.getElementById('btn-modal-close').addEventListener('click', () => {
      document.getElementById('discovery-modal').classList.remove('active');
    });
  }

  addElementToBeaker(sym) {
    if (this.beaker.length >= 8) {
      this.setStatus('Tabung reaksi sudah penuh (maks 8 partikel). Mulai reaksi!', 'fail');
      return;
    }
    this.beaker.push(sym);
    sfx.addBeep();
    this.updateBeakerView();
  }

  removeElementFromBeaker(idx) {
    this.beaker.splice(idx, 1);
    sfx.removeBeep();
    this.updateBeakerView();
  }

  clearBeaker() {
    this.beaker = [];
    sfx.removeBeep();
    this.updateBeakerView();
    this.setStatus('Tabung dibersihkan.', 'ready');
  }

  updateBeakerView() {
    const container = document.getElementById('beaker-elements');
    const liquid = document.getElementById('beaker-liquid');
    const formulaText = document.querySelector('.formula-text');

    if (this.beaker.length === 0) {
      container.innerHTML = '<span class="empty-tip">Tabung masih kosong.<br>Pilih unsur dari rak di samping!</span>';
      liquid.style.height = '0%';
      formulaText.textContent = 'Kosong';
      return;
    }

    // Hitung counts
    const counts = {};
    this.beaker.forEach(s => counts[s] = (counts[s] || 0) + 1);

    // Render chips
    container.innerHTML = '';
    this.beaker.forEach((sym, idx) => {
      const chip = document.createElement('div');
      chip.className = 'beaker-chip';
      chip.innerHTML = `<span>${sym}</span><span class="chip-remove" title="Hapus">&times;</span>`;
      chip.querySelector('.chip-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeElementFromBeaker(idx);
      });
      container.appendChild(chip);
    });

    // Update liquid height
    liquid.style.height = `${Math.min(this.beaker.length * 12 + 10, 85)}%`;

    // Update formula text preview
    const previewStr = Object.entries(counts)
      .map(([sym, count]) => `${sym}${count > 1 ? count : ''}`)
      .join(' + ');
    formulaText.textContent = previewStr;
  }

  performReaction() {
    if (this.beaker.length === 0) {
      this.setStatus('Tambahkan beberapa unsur ke tabung terlebih dahulu!', 'fail');
      sfx.failSound();
      return;
    }

    // Count user elements
    const userCounts = {};
    this.beaker.forEach(s => userCounts[s] = (userCounts[s] || 0) + 1);

    // Cari match di resep
    const match = RECIPES.find(recipe => {
      const req = recipe.elements;
      const reqKeys = Object.keys(req);
      const userKeys = Object.keys(userCounts);

      if (reqKeys.length !== userKeys.length) return false;
      return reqKeys.every(k => req[k] === userCounts[k]);
    });

    if (match) {
      // Reaksi Sukses!
      this.particles.emit(match.color, 45);
      sfx.successSound();
      const isNew = !this.discovered.includes(match.formula);

      if (isNew) {
        this.discovered.push(match.formula);
        this.points += match.xp;
        this.saveProgress();
        this.showDiscoveryModal(match);
      } else {
        this.points += Math.floor(match.xp / 4);
        this.saveProgress();
      }

      this.setStatus(`Reaksi Berhasil! Terbentuk molekul ${match.name} (${match.formula})!`, 'success');
      this.updateStats();
      this.renderQuests();
      this.renderJournal();
      this.clearBeaker();
    } else {
      // Gagal
      this.particles.emit('#ef4444', 20);
      sfx.failSound();
      this.setStatus('Kombinasi tidak stabil atau perbandingan stoikiometri belum tepat. Coba lagi!', 'fail');
    }
  }

  giveHint() {
    // Cari resep yang belum ditemukan
    const undiscovered = RECIPES.find(r => !this.discovered.includes(r.formula));
    if (undiscovered) {
      const hintText = `Petunjuk: Coba sintesis ${undiscovered.name}! Persamaannya: ${undiscovered.equation}`;
      this.setStatus(hintText, 'ready');
    } else {
      this.setStatus('Luar biasa! Kamu sudah menemukan seluruh resep molekul yang tersedia!', 'success');
    }
  }

  setStatus(msg, state) {
    const box = document.getElementById('reaction-result-box');
    const indicator = box.querySelector('.status-indicator');
    const text = document.getElementById('status-message');

    indicator.className = `status-indicator ${state}`;
    text.textContent = msg;
  }

  showDiscoveryModal(recipe) {
    document.getElementById('modal-formula').textContent = recipe.formula;
    document.getElementById('modal-name').textContent = recipe.name;
    document.getElementById('modal-desc').textContent = recipe.desc;
    document.getElementById('discovery-modal').classList.add('active');
  }

  updateStats() {
    document.getElementById('player-points').textContent = `${this.points} XP`;
    document.getElementById('discovered-count').textContent = `${this.discovered.length} / ${RECIPES.length}`;

    // Level calculation
    let lvl = '1 (Asisten Lab)';
    if (this.points >= 500) lvl = '4 (Profesor Kimia)';
    else if (this.points >= 250) lvl = '3 (Alkemis Senior)';
    else if (this.points >= 100) lvl = '2 (Peneliti Muda)';
    document.getElementById('player-level').textContent = lvl;
  }

  saveProgress() {
    localStorage.setItem('chemlab_points', this.points);
    localStorage.setItem('chemlab_discovered', JSON.stringify(this.discovered));
  }

  renderShelf(category) {
    const shelf = document.getElementById('elements-shelf');
    shelf.innerHTML = '';
    const filtered = category === 'all' ? ELEMENTS : ELEMENTS.filter(e => e.cat === category);

    filtered.forEach(el => {
      const card = document.createElement('div');
      card.className = `element-card elem-cat-${el.cat}`;
      card.innerHTML = `
        <span class="elem-num">${el.num}</span>
        <div class="elem-sym">${el.sym}</div>
        <div class="elem-name">${el.name}</div>
      `;
      card.addEventListener('click', () => this.addElementToBeaker(el.sym));
      shelf.appendChild(card);
    });
  }

  renderPeriodicTable() {
    const grid = document.getElementById('ptable-grid');
    grid.innerHTML = '';
    ELEMENTS.forEach(el => {
      const btn = document.createElement('div');
      btn.className = `element-card elem-cat-${el.cat}`;
      btn.innerHTML = `
        <span class="elem-num">${el.num}</span>
        <div class="elem-sym">${el.sym}</div>
      `;
      btn.addEventListener('click', () => this.showElementDetail(el));
      grid.appendChild(btn);
    });
  }

  showElementDetail(el) {
    const container = document.getElementById('element-detail-card');
    container.innerHTML = `
      <div class="detail-header">
        <div class="detail-sym-box elem-cat-${el.cat}">
          <span class="big-sym">${el.sym}</span>
        </div>
        <div>
          <h3>${el.name}</h3>
          <span style="color: var(--text-muted); font-size: 0.85rem;">Kategori: ${el.cat.toUpperCase()}</span>
        </div>
      </div>
      <div class="detail-stat-row">
        <span class="detail-stat-label">Nomor Atom</span>
        <span class="detail-stat-val">${el.num}</span>
      </div>
      <div class="detail-stat-row">
        <span class="detail-stat-label">Massa Atom Relatif</span>
        <span class="detail-stat-val">${el.mass} u</span>
      </div>
      <div class="detail-stat-row" style="flex-direction: column; gap: 6px;">
        <span class="detail-stat-label">Deskripsi & Peran di Alam:</span>
        <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5;">${el.desc}</p>
      </div>
    `;
  }

  renderQuests() {
    const grid = document.getElementById('quest-grid');
    grid.innerHTML = '';
    RECIPES.forEach((r, idx) => {
      const isDone = this.discovered.includes(r.formula);
      const card = document.createElement('div');
      card.className = `quest-card ${isDone ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="quest-header">
          <span class="quest-target">${r.formula}</span>
          <span class="quest-stars">${isDone ? '⭐⭐⭐ Selesai' : '🔒 Terkunci'}</span>
        </div>
        <div class="quest-name">${r.name}</div>
        <div class="quest-desc">${r.desc}</div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
          <span style="color: var(--accent-cyan);">Hadiah: +${r.xp} XP</span>
          <span style="color: ${isDone ? 'var(--accent-emerald)' : 'var(--text-muted)'};">
            ${isDone ? '✓ Ditemukan' : 'Belum'}
          </span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderJournal() {
    const grid = document.getElementById('journal-grid');
    grid.innerHTML = '';
    RECIPES.forEach(r => {
      const isFound = this.discovered.includes(r.formula);
      const card = document.createElement('div');
      card.className = 'journal-card';
      card.style.opacity = isFound ? '1' : '0.4';
      card.innerHTML = `
        <div class="j-formula">${isFound ? r.formula : '???'}</div>
        <div class="j-name">${isFound ? r.name : 'Senyawa Misterius'}</div>
        <div class="j-desc">${isFound ? r.desc : 'Kombinasikan unsur yang tepat di laboratorium reaksi untuk mengungkap data senyawa ini.'}</div>
        <div class="j-equation">${isFound ? r.equation : 'Persamaan: [ Terkunci ]'}</div>
      `;
      grid.appendChild(card);
    });
  }
}

// Start Game on DOM Loaded
window.addEventListener('DOMContentLoaded', () => {
  window.chemLab = new ChemLabGame();
});
