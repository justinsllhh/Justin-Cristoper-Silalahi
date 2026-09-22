/**
 * Game 3: Logic Maze (Coding Cilik & Algoritma Rimba)
 * Melatih logika pemrograman anak: urutan (sequence), arah mata angin, dan pemecahan rintangan.
 */

class LogicMazeGame {
  constructor() {
    this.container = document.getElementById('logic-game-content');
    this.currentLevel = 0;
    this.playerPos = { x: 0, y: 0 };
    this.playerDir = 0; // 0: East/Right, 1: South/Down, 2: West/Left, 3: North/Up
    this.commandQueue = [];
    this.isRunning = false;
    this.collectedGems = 0;

    this.levels = [
      {
        gridSize: 5,
        start: { x: 0, y: 2, dir: 0 },
        goal: { x: 4, y: 2 },
        walls: [{ x: 2, y: 1 }, { x: 2, y: 3 }],
        gems: [{ x: 2, y: 2 }],
        hint: 'Jalankan kancil maju lurus ke depan dan ambil kristal permata!'
      },
      {
        gridSize: 5,
        start: { x: 0, y: 0, dir: 0 },
        goal: { x: 4, y: 4 },
        walls: [{ x: 1, y: 0 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
        gems: [{ x: 0, y: 2 }, { x: 4, y: 2 }],
        hint: 'Belokkan arah kancil mengelilingi rintangan batu menuju peti harta karun!'
      },
      {
        gridSize: 5,
        start: { x: 0, y: 4, dir: 3 },
        goal: { x: 4, y: 0 },
        walls: [{ x: 1, y: 4 }, { x: 2, y: 2 }, { x: 3, y: 0 }],
        gems: [{ x: 0, y: 0 }, { x: 2, y: 4 }, { x: 4, y: 2 }],
        hint: 'Susun algoritma cerdas: Maju, Belok Kanan, dan kumpulkan semua kristal!'
      }
    ];
  }

  start() {
    this.currentLevel = 0;
    this.loadLevel(this.currentLevel);
  }

  loadLevel(levelIdx) {
    if (levelIdx >= this.levels.length) {
      this.finishGame();
      return;
    }

    const lvl = this.levels[levelIdx];
    this.playerPos = { ...lvl.start };
    this.playerDir = lvl.start.dir;
    this.commandQueue = [];
    this.isRunning = false;
    this.collectedGems = 0;

    this.updateHUD();
    this.render();

    window.speechEngine.speak(`Level ${levelIdx + 1}. ${lvl.hint}`);
  }

  updateHUD() {
    document.getElementById('logic-round-val').innerText = `${this.currentLevel + 1}/${this.levels.length}`;
    document.getElementById('logic-score-val').innerText = this.collectedGems * 30;
  }

  getDirArrow() {
    // 0: Right (👉), 1: Down (👇), 2: Left (👈), 3: Up (👆)
    const arrows = ['👉', '👇', '👈', '👆'];
    return arrows[this.playerDir];
  }

  render() {
    const lvl = this.levels[this.currentLevel];

    this.container.innerHTML = `
      <div class="helper-speech-bubble">
        <div class="speech-text-wrap">
          <span class="speech-avatar">🤖</span>
          <span class="speech-text">${lvl.hint}</span>
        </div>
        <button class="speech-speak-btn" onclick="window.speechEngine.speak('${lvl.hint}')">🔊</button>
      </div>

      <div class="logic-game-container">
        <!-- Maze Viewport -->
        <div class="maze-viewport-box">
          <div class="maze-grid" id="maze-grid-element" style="grid-template-columns: repeat(${lvl.gridSize}, 58px);">
            ${this.generateGridCells(lvl)}
          </div>
        </div>

        <!-- Logic & Command Controller -->
        <div class="logic-controls-panel">
          <div>
            <strong style="font-size: 1.1rem; color: #1e293b;">Pilih Blok Perintah:</strong>
            <div class="command-toolbox" style="margin-top: 8px;">
              <button class="cmd-btn" id="btn-cmd-forward">
                <span class="cmd-icon">⬆️</span>
                <span>Maju</span>
              </button>
              <button class="cmd-btn" id="btn-cmd-left">
                <span class="cmd-icon">🔄</span>
                <span>Putar Kiri</span>
              </button>
              <button class="cmd-btn" id="btn-cmd-right">
                <span class="cmd-icon">🔃</span>
                <span>Putar Kanan</span>
              </button>
              <button class="cmd-btn" id="btn-cmd-jump">
                <span class="cmd-icon">🦘</span>
                <span>Lompat</span>
              </button>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 0.95rem; color: #475569;">Urutan Algoritma (${this.commandQueue.length}/12):</strong>
              <button id="btn-clear-cmds" style="background: none; border: none; color: #ef4444; font-weight: 700; cursor: pointer; font-size: 0.85rem;">Hapus Semua 🗑️</button>
            </div>
            <div class="command-queue-box" id="command-queue-container">
              ${this.renderQueuePills()}
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn-orange" id="btn-run-code" style="flex: 1; padding: 12px 10px; font-size: 1.05rem;">
              🚀 Jalankan Kode
            </button>
            <button class="btn-secondary" id="btn-reset-pos" style="padding: 12px 16px;">
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  generateGridCells(lvl) {
    let cellsHTML = '';
    for (let y = 0; y < lvl.gridSize; y++) {
      for (let x = 0; x < lvl.gridSize; x++) {
        const isPlayer = (x === this.playerPos.x && y === this.playerPos.y);
        const isGoal = (x === lvl.goal.x && y === lvl.goal.y);
        const isWall = lvl.walls.some(w => w.x === x && w.y === y);
        const hasGem = lvl.gems.some(g => g.x === x && g.y === y);

        let cellClass = 'maze-cell path';
        let content = '';

        if (isWall) {
          cellClass = 'maze-cell wall';
          content = '🪨';
        } else if (isGoal) {
          cellClass = 'maze-cell goal';
          content = '🏆';
        } else if (hasGem) {
          content = '💎';
        }

        if (isPlayer) {
          cellClass += ' player-here';
          content = `<span style="display:inline-block; font-size: 1.6rem;">${window.appState ? window.appState.player.avatar : '🦌'}</span>`;
        }

        cellsHTML += `<div class="${cellClass}" data-x="${x}" data-y="${y}">${content}</div>`;
      }
    }
    return cellsHTML;
  }

  renderQueuePills() {
    if (this.commandQueue.length === 0) {
      return `<div style="color: #94a3b8; font-size: 0.9rem; margin: auto; text-align: center;">Klik blok di atas untuk menambahkan urutan perintah...</div>`;
    }

    const cmdNames = {
      'FORWARD': '⬆️ Maju',
      'TURN_LEFT': '🔄 Putar Kiri',
      'TURN_RIGHT': '🔃 Putar Kanan',
      'JUMP': '🦘 Lompat'
    };

    return this.commandQueue.map((cmd, idx) => `
      <span class="queued-cmd-pill">
        ${idx + 1}. ${cmdNames[cmd]}
        <span class="remove-cmd" data-idx="${idx}">&times;</span>
      </span>
    `).join('');
  }

  attachEvents() {
    const addCmd = (cmd) => {
      if (this.isRunning) return;
      if (this.commandQueue.length >= 12) return;
      window.soundEngine.playClick();
      this.commandQueue.push(cmd);
      document.getElementById('command-queue-container').innerHTML = this.renderQueuePills();
      this.attachRemoveEvents();
    };

    document.getElementById('btn-cmd-forward').onclick = () => addCmd('FORWARD');
    document.getElementById('btn-cmd-left').onclick = () => addCmd('TURN_LEFT');
    document.getElementById('btn-cmd-right').onclick = () => addCmd('TURN_RIGHT');
    document.getElementById('btn-cmd-jump').onclick = () => addCmd('JUMP');

    document.getElementById('btn-clear-cmds').onclick = () => {
      if (this.isRunning) return;
      window.soundEngine.playClick();
      this.commandQueue = [];
      document.getElementById('command-queue-container').innerHTML = this.renderQueuePills();
    };

    document.getElementById('btn-reset-pos').onclick = () => {
      if (this.isRunning) return;
      const lvl = this.levels[this.currentLevel];
      this.playerPos = { ...lvl.start };
      this.playerDir = lvl.start.dir;
      this.renderGridOnly();
    };

    document.getElementById('btn-run-code').onclick = () => {
      if (this.isRunning) return;
      this.executeCommands();
    };

    this.attachRemoveEvents();
  }

  attachRemoveEvents() {
    const removes = this.container.querySelectorAll('.remove-cmd');
    removes.forEach(btn => {
      btn.onclick = (e) => {
        if (this.isRunning) return;
        const idx = parseInt(e.target.getAttribute('data-idx'));
        this.commandQueue.splice(idx, 1);
        document.getElementById('command-queue-container').innerHTML = this.renderQueuePills();
        this.attachRemoveEvents();
      };
    });
  }

  renderGridOnly() {
    const lvl = this.levels[this.currentLevel];
    const gridElem = document.getElementById('maze-grid-element');
    if (gridElem) {
      gridElem.innerHTML = this.generateGridCells(lvl);
    }
  }

  async executeCommands() {
    if (this.commandQueue.length === 0) {
      window.speechEngine.speak('Tambahkan blok perintah terlebih dahulu ya!');
      return;
    }

    this.isRunning = true;
    const lvl = this.levels[this.currentLevel];
    this.playerPos = { ...lvl.start };
    this.playerDir = lvl.start.dir;
    this.renderGridOnly();

    for (let i = 0; i < this.commandQueue.length; i++) {
      const cmd = this.commandQueue[i];
      await new Promise(r => setTimeout(r, 600));

      this.stepCommand(cmd, lvl);
      this.renderGridOnly();
      window.soundEngine.playStep();

      // Check hit wall
      const isWall = lvl.walls.some(w => w.x === this.playerPos.x && w.y === this.playerPos.y);
      if (isWall) {
        window.soundEngine.playWrong();
        window.speechEngine.speak('Aduh! Menabrak rintangan batu. Periksa kembali urutan kodemu ya!');
        this.isRunning = false;
        return;
      }

      // Check collect gem
      const gemIdx = lvl.gems.findIndex(g => g.x === this.playerPos.x && g.y === this.playerPos.y);
      if (gemIdx !== -1) {
        lvl.gems.splice(gemIdx, 1);
        this.collectedGems++;
        window.soundEngine.playCoin();
        this.updateHUD();
      }

      // Check goal
      if (this.playerPos.x === lvl.goal.x && this.playerPos.y === lvl.goal.y) {
        window.soundEngine.playVictory();
        window.speechEngine.speak('Hebat sekali! Algoritma kodemu berhasil mencapai tujuan!');
        this.isRunning = false;
        setTimeout(() => {
          this.currentLevel++;
          this.loadLevel(this.currentLevel);
        }, 1200);
        return;
      }
    }

    this.isRunning = false;
    // If finished queue and not reached goal
    if (this.playerPos.x !== lvl.goal.x || this.playerPos.y !== lvl.goal.y) {
      window.speechEngine.speak('Belum sampai ke tujuan. Coba tambahkan atau perbaiki langkahnya!');
    }
  }

  stepCommand(cmd, lvl) {
    // 0: Right, 1: Down, 2: Left, 3: Up
    const deltas = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 }
    ];

    if (cmd === 'FORWARD') {
      const d = deltas[this.playerDir];
      const newX = Math.max(0, Math.min(lvl.gridSize - 1, this.playerPos.x + d.x));
      const newY = Math.max(0, Math.min(lvl.gridSize - 1, this.playerPos.y + d.y));
      this.playerPos = { x: newX, y: newY };
    } else if (cmd === 'TURN_LEFT') {
      this.playerDir = (this.playerDir + 3) % 4;
    } else if (cmd === 'TURN_RIGHT') {
      this.playerDir = (this.playerDir + 1) % 4;
    } else if (cmd === 'JUMP') {
      const d = deltas[this.playerDir];
      const newX = Math.max(0, Math.min(lvl.gridSize - 1, this.playerPos.x + d.x * 2));
      const newY = Math.max(0, Math.min(lvl.gridSize - 1, this.playerPos.y + d.y * 2));
      this.playerPos = { x: newX, y: newY };
    }
  }

  finishGame() {
    window.soundEngine.playVictory();
    const starsEarned = 5;
    window.appState.addStars(starsEarned);
    window.appState.unlockBadge('logic_master');

    window.appState.showCelebrationModal({
      title: 'Master Logika & Coding! 🧩',
      desc: `Luar biasa! Kamu telah menguasai logika algoritma dan memecahkan semua labirin rintangan!`,
      stars: starsEarned,
      gameType: 'logic'
    });
  }
}

window.logicMazeGame = new LogicMazeGame();
