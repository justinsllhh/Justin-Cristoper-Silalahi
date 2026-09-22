/**
 * CodeBot Logic Runner - Game Engine & Virtual Machine
 */

// 1. Level Design Database (8x8 Grids)
// 0: Empty, 1: Wall (🧱), 2: Start Robot (🤖), 3: Portal Goal (🌀), 4: Energy Battery (⚡), 5: Switch (🔘), 6: Closed Gate (🔒)
const LEVELS = [
  {
    id: 1,
    title: "Level 1: Langkah Pertama",
    desc: "Misi: Susun blok 'Maju 1 Langkah' untuk membawa CodeBot ke Portal Hijau!",
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    startDir: 1 // 0: Up, 1: Right, 2: Down, 3: Left
  },
  {
    id: 2,
    title: "Level 2: Belokan Pertama",
    desc: "Misi: Gunakan perintah putar arah untuk menghindari dinding pembatas.",
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 1, 1],
      [1, 1, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    startDir: 1
  },
  {
    id: 3,
    title: "Level 3: Pengisian Energi Listrik",
    desc: "Misi: Ambil baterai energi (⚡) sebelum memasuki portal teleportasi.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 4, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    startDir: 1,
    reqBattery: 1
  },
  {
    id: 4,
    title: "Level 4: Kekuatan Pengulangan (Loop)",
    desc: "Misi: Jalan panjang lurus! Manfaatkan blok 'Ulangi 3x' agar kodemu lebih ringkas & efisien.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    startDir: 1
  },
  {
    id: 5,
    title: "Level 5: Pola Zig-Zag Labirin",
    desc: "Misi: Jalur berliku! Kombinasikan belok kiri dan kanan dengan perhitungan langkah yang cermat.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 4, 3, 1],
      [1, 1, 0, 1, 0, 1, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    startDir: 1,
    reqBattery: 1
  },
  {
    id: 6,
    title: "Level 6: Saklar Pintu Gerbang",
    desc: "Misi: Portal terkunci di balik gerbang! Tekan saklar tombol (🔘) untuk membuka jalan.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 5, 1, 3, 1],
      [1, 1, 0, 1, 6, 0, 1],
      [1, 1, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    startDir: 1
  },
  {
    id: 7,
    title: "Level 7: Panen Energi Ganda",
    desc: "Misi: Kumpulkan 2 baterai energi yang tersebar sebelum mencapai portal akhir.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 4, 1, 1, 4, 3, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    startDir: 1,
    reqBattery: 2
  },
  {
    id: 8,
    title: "Level 8: Master Algoritma",
    desc: "Misi: Ujian pamungkas! Kombinasikan loop, saklar gerbang, dan pengambilan baterai energi!",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 5, 1, 3, 1],
      [1, 1, 1, 1, 0, 6, 0, 1],
      [1, 4, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    startDir: 1,
    reqBattery: 1
  }
];

// 2. Synthesizer Efek Suara
class BotAudio {
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
  playBeep(freq, duration = 0.1, type = 'sine') {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
  stepSound() { this.playBeep(480, 0.08, 'triangle'); }
  turnSound() { this.playBeep(360, 0.08, 'sine'); }
  collectSound() {
    this.playBeep(523, 0.1, 'sine');
    setTimeout(() => this.playBeep(659, 0.15, 'sine'), 80);
    setTimeout(() => this.playBeep(784, 0.2, 'sine'), 160);
  }
  switchSound() { this.playBeep(880, 0.15, 'square'); }
  crashSound() {
    this.playBeep(120, 0.25, 'sawtooth');
  }
  winSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, idx) => setTimeout(() => this.playBeep(f, 0.25, 'triangle'), idx * 100));
  }
}

const botAudio = new BotAudio();

// 3. Virtual Machine & Game Controller
class CodeRunnerGame {
  constructor() {
    this.canvas = document.getElementById('grid-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.currentLevelIdx = 0;
    this.program = []; // Array of instructions
    this.starsCollected = JSON.parse(localStorage.getItem('codebot_stars')) || {};
    
    // Runtime state
    this.botX = 0;
    this.botY = 0;
    this.botDir = 1; // 0: Up, 1: Right, 2: Down, 3: Left
    this.collectedBatteries = 0;
    this.switchActive = false;
    this.activeGrid = [];
    this.isRunning = false;
    this.executingLine = -1;

    this.initDOM();
    this.loadLevel(0);
  }

  initDOM() {
    // Sound Toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      botAudio.enabled = !botAudio.enabled;
      soundBtn.textContent = botAudio.enabled ? '🔊' : '🔇';
    });

    // Populate Level Select
    const select = document.getElementById('level-select');
    LEVELS.forEach((lvl, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = lvl.title;
      select.appendChild(opt);
    });
    select.addEventListener('change', (e) => {
      this.loadLevel(parseInt(e.target.value));
    });

    // Command palette buttons
    document.querySelectorAll('.cmd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isRunning) return;
        this.addCommand(btn.dataset.cmd);
      });
    });

    // Clear program
    document.getElementById('btn-clear-code').addEventListener('click', () => {
      if (this.isRunning) return;
      this.program = [];
      this.renderProgramQueue();
      this.log('Program dibersihkan.');
    });

    // Action Controls
    document.getElementById('btn-run').addEventListener('click', () => this.runProgram());
    document.getElementById('btn-step').addEventListener('click', () => this.stepProgram());
    document.getElementById('btn-reset').addEventListener('click', () => this.resetLevelState());

    // Modal
    document.getElementById('btn-next-level').addEventListener('click', () => {
      document.getElementById('level-modal').classList.remove('active');
      if (this.currentLevelIdx + 1 < LEVELS.length) {
        this.loadLevel(this.currentLevelIdx + 1);
        document.getElementById('level-select').value = this.currentLevelIdx;
      }
    });
    document.getElementById('btn-replay-level').addEventListener('click', () => {
      document.getElementById('level-modal').classList.remove('active');
      this.resetLevelState();
    });

    // Speed Slider
    const speedSlider = document.getElementById('speed-slider');
    speedSlider.addEventListener('input', (e) => {
      const v = parseInt(e.target.value);
      const label = document.getElementById('speed-label');
      if (v < 250) label.textContent = 'Cepat ⚡';
      else if (v > 550) label.textContent = 'Lambat 🐢';
      else label.textContent = 'Normal';
    });
  }

  loadLevel(idx) {
    this.currentLevelIdx = idx;
    const lvl = LEVELS[idx];
    document.getElementById('level-title').textContent = lvl.title;
    document.getElementById('mission-goal-text').innerHTML = `🎯 <strong>Misi:</strong> ${lvl.desc}`;
    this.resetLevelState();
    this.updateTotalStars();
  }

  resetLevelState() {
    const lvl = LEVELS[this.currentLevelIdx];
    this.activeGrid = JSON.parse(JSON.stringify(lvl.grid));
    this.botDir = lvl.startDir;
    this.collectedBatteries = 0;
    this.switchActive = false;
    this.isRunning = false;
    this.executingLine = -1;

    // Find Bot initial position
    for (let r = 0; r < this.activeGrid.length; r++) {
      for (let c = 0; c < this.activeGrid[r].length; c++) {
        if (this.activeGrid[r][c] === 2) {
          this.botX = c;
          this.botY = r;
          break;
        }
      }
    }

    this.renderProgramQueue();
    this.drawGrid();
    this.log(`[Level ${lvl.id}] Arena di-reset. CodeBot siap di koordinat (${this.botX}, ${this.botY}).`);
  }

  addCommand(cmd) {
    if (this.program.length >= 25) {
      this.log('Antrean program penuh (maks 25 blok)!');
      return;
    }
    this.program.push(cmd);
    botAudio.stepSound();
    this.renderProgramQueue();
  }

  renderProgramQueue() {
    const container = document.getElementById('code-queue');
    if (this.program.length === 0) {
      container.innerHTML = '<div class="queue-empty">Belum ada blok instruksi. Klik tombol di atas untuk menyusun algoritma!</div>';
      return;
    }

    container.innerHTML = '';
    const cmdNames = {
      forward: '⬆️ Maju 1 Langkah',
      left: '↺ Putar Kiri 90°',
      right: '↻ Putar Kanan 90°',
      collect: '⚡ Ambil Energi',
      switch: '🔘 Tekan Saklar',
      loop2: '🔁 Ulangi 2x [Maju]',
      loop3: '🔁 Ulangi 3x [Maju]'
    };

    this.program.forEach((cmd, idx) => {
      const item = document.createElement('div');
      item.className = `code-item ${this.executingLine === idx ? 'active-executing' : ''}`;
      item.innerHTML = `
        <div>
          <span class="code-item-num">${String(idx + 1).padStart(2, '0')}.</span>
          <span>${cmdNames[cmd] || cmd}</span>
        </div>
        <span class="code-item-del" title="Hapus baris ini">&times;</span>
      `;
      item.querySelector('.code-item-del').addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isRunning) return;
        this.program.splice(idx, 1);
        this.renderProgramQueue();
      });
      container.appendChild(item);
    });

    if (this.executingLine >= 0) {
      const activeEl = container.children[this.executingLine];
      if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  log(msg) {
    const el = document.getElementById('term-log');
    el.innerHTML = `&gt; ${msg}`;
  }

  drawGrid() {
    const rows = this.activeGrid.length;
    const cols = this.activeGrid[0].length;
    const cellW = this.canvas.width / cols;
    const cellH = this.canvas.height / rows;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = this.activeGrid[r][c];
        const x = c * cellW;
        const y = r * cellH;

        // Base cell ground
        this.ctx.fillStyle = (r + c) % 2 === 0 ? '#111827' : '#0f172a';
        this.ctx.fillRect(x, y, cellW, cellH);
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, cellW, cellH);

        // Draw entities
        if (type === 1) {
          // Wall
          this.ctx.fillStyle = '#334155';
          this.ctx.fillRect(x + 4, y + 4, cellW - 8, cellH - 8);
          this.ctx.fillStyle = '#64748b';
          this.ctx.fillRect(x + 8, y + 8, cellW - 16, cellH - 16);
        } else if (type === 3) {
          // Goal Portal
          this.ctx.fillStyle = '#10b981';
          this.ctx.beginPath();
          this.ctx.arc(x + cellW / 2, y + cellH / 2, cellW * 0.35, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.font = `${cellW * 0.4}px Arial`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText('🌀', x + cellW / 2, y + cellH / 2);
        } else if (type === 4) {
          // Battery Energy
          this.ctx.font = `${cellW * 0.5}px Arial`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText('⚡', x + cellW / 2, y + cellH / 2);
        } else if (type === 5) {
          // Switch
          this.ctx.font = `${cellW * 0.5}px Arial`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(this.switchActive ? '🟢' : '🔘', x + cellW / 2, y + cellH / 2);
        } else if (type === 6) {
          // Locked Gate
          this.ctx.fillStyle = '#dc2626';
          this.ctx.fillRect(x + 8, y + 8, cellW - 16, cellH - 16);
          this.ctx.font = `${cellW * 0.4}px Arial`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText('🔒', x + cellW / 2, y + cellH / 2);
        }
      }
    }

    // Draw CodeBot
    const bx = this.botX * cellW + cellW / 2;
    const by = this.botY * cellH + cellH / 2;

    this.ctx.save();
    this.ctx.translate(bx, by);
    const rads = [ -Math.PI / 2, 0, Math.PI / 2, Math.PI ][this.botDir];
    this.ctx.rotate(rads);

    // Bot Glow Body
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, cellW * 0.3, 0, Math.PI * 2);
    this.ctx.fill();

    // Direction Pointer
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.beginPath();
    this.ctx.moveTo(cellW * 0.32, 0);
    this.ctx.lineTo(cellW * 0.15, -cellW * 0.15);
    this.ctx.lineTo(cellW * 0.15, cellW * 0.15);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  expandProgram() {
    const flat = [];
    this.program.forEach(cmd => {
      if (cmd === 'loop2') {
        flat.push('forward', 'forward');
      } else if (cmd === 'loop3') {
        flat.push('forward', 'forward', 'forward');
      } else {
        flat.push(cmd);
      }
    });
    return flat;
  }

  async runProgram() {
    if (this.isRunning) return;
    if (this.program.length === 0) {
      this.log('Silakan susun blok perintah terlebih dahulu!');
      return;
    }

    this.isRunning = true;
    const expanded = this.expandProgram();
    const delay = parseInt(document.getElementById('speed-slider').value);

    for (let i = 0; i < expanded.length; i++) {
      if (!this.isRunning) break;
      this.executingLine = Math.min(i, this.program.length - 1);
      this.renderProgramQueue();

      const success = this.executeInstruction(expanded[i]);
      this.drawGrid();

      if (!success) {
        this.isRunning = false;
        return;
      }

      // Check win condition
      if (this.checkWinCondition()) {
        this.isRunning = false;
        this.handleLevelWin();
        return;
      }

      await new Promise(r => setTimeout(r, delay));
    }

    this.isRunning = false;
    this.executingLine = -1;
    this.renderProgramQueue();
    if (!this.checkWinCondition()) {
      this.log('⚠️ Program selesai, namun CodeBot belum mencapai Portal!');
    }
  }

  executeInstruction(cmd) {
    const dirOffsets = [
      { dx: 0, dy: -1 }, // 0: Up
      { dx: 1, dy: 0 },  // 1: Right
      { dx: 0, dy: 1 },  // 2: Down
      { dx: -1, dy: 0 }  // 3: Left
    ];

    if (cmd === 'forward') {
      const nextX = this.botX + dirOffsets[this.botDir].dx;
      const nextY = this.botY + dirOffsets[this.botDir].dy;

      // Check bounds & wall
      if (nextY < 0 || nextY >= this.activeGrid.length || nextX < 0 || nextX >= this.activeGrid[0].length) {
        botAudio.crashSound();
        this.log('💥 Tabrakan! CodeBot keluar dari batas arena!');
        return false;
      }

      const targetCell = this.activeGrid[nextY][nextX];
      if (targetCell === 1 || targetCell === 6) {
        botAudio.crashSound();
        this.log(targetCell === 6 ? '💥 Pintu terkunci! Aktifkan saklar terlebih dahulu!' : '💥 Tabrakan! CodeBot menabrak dinding rintangan!');
        return false;
      }

      this.botX = nextX;
      this.botY = nextY;
      botAudio.stepSound();
      this.log(`CodeBot maju ke koordinat (${this.botX}, ${this.botY}).`);
      return true;
    } else if (cmd === 'left') {
      this.botDir = (this.botDir + 3) % 4;
      botAudio.turnSound();
      this.log('CodeBot memutar arah ke kiri 90°.');
      return true;
    } else if (cmd === 'right') {
      this.botDir = (this.botDir + 1) % 4;
      botAudio.turnSound();
      this.log('CodeBot memutar arah ke kanan 90°.');
      return true;
    } else if (cmd === 'collect') {
      if (this.activeGrid[this.botY][this.botX] === 4) {
        this.activeGrid[this.botY][this.botX] = 0;
        this.collectedBatteries++;
        botAudio.collectSound();
        this.log(`⚡ Berhasil mengumpulkan baterai energi! Total: ${this.collectedBatteries}`);
        return true;
      } else {
        this.log('Tidak ada baterai energi di posisi ini.');
        return true;
      }
    } else if (cmd === 'switch') {
      if (this.activeGrid[this.botY][this.botX] === 5) {
        this.switchActive = true;
        // Unlock gates
        for (let r = 0; r < this.activeGrid.length; r++) {
          for (let c = 0; c < this.activeGrid[r].length; c++) {
            if (this.activeGrid[r][c] === 6) {
              this.activeGrid[r][c] = 0; // Opened!
            }
          }
        }
        botAudio.switchSound();
        this.log('🔘 Saklar aktif! Semua pintu gerbang terkunci telah terbuka!');
        return true;
      } else {
        this.log('Tidak ada saklar tombol di posisi ini.');
        return true;
      }
    }
    return true;
  }

  checkWinCondition() {
    const curCell = this.activeGrid[this.botY][this.botX];
    const lvl = LEVELS[this.currentLevelIdx];
    const req = lvl.reqBattery || 0;

    if (curCell === 3) {
      if (this.collectedBatteries < req) {
        this.log(`⚠️ Portal menolak masuk: Kumpulkan ${req - this.collectedBatteries} baterai lagi!`);
        return false;
      }
      return true;
    }
    return false;
  }

  handleLevelWin() {
    botAudio.winSound();
    const lvl = LEVELS[this.currentLevelIdx];
    this.starsCollected[lvl.id] = 3;
    localStorage.setItem('codebot_stars', JSON.stringify(this.starsCollected));
    this.updateTotalStars();

    document.getElementById('modal-level-msg').textContent = `Selamat! Algoritma kamu berhasil menyelesaikan ${lvl.title}!`;
    document.getElementById('level-modal').classList.add('active');
  }

  updateTotalStars() {
    const count = Object.values(this.starsCollected).reduce((a, b) => a + b, 0);
    const max = LEVELS.length * 3;
    document.getElementById('star-count').textContent = `⭐ ${count} / ${max}`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.codeBot = new CodeRunnerGame();
});
