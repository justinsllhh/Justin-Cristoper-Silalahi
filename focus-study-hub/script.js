/**
 * FocusStudy Hub - Core Logic & Synthesizers
 */

// 1. Ambient Sound Synthesizer (Web Audio API)
class AmbientSynthesizer {
  constructor() {
    this.ctx = null;
    this.nodes = {};
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  toggleSound(type, volume = 0.5) {
    this.init();
    if (this.nodes[type]) {
      this.stopSound(type);
      return false; // Stopped
    } else {
      this.playSound(type, volume);
      return true; // Playing
    }
  }

  playSound(type, volume) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.connect(this.ctx.destination);

    if (type === 'whitenoise' || type === 'rain') {
      // Buffer noise
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink / Brown filter for rain effect
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          data[i] = white * 0.3;
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      noise.connect(gain);
      noise.start();
      this.nodes[type] = { source: noise, gain: gain };

    } else if (type === 'alpha') {
      // Binaural Beat: 200 Hz Left, 210 Hz Right (10 Hz Alpha beat)
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(200, this.ctx.currentTime);
      oscR.frequency.setValueAtTime(210, this.ctx.currentTime);

      oscL.connect(gain);
      oscR.connect(gain);
      oscL.start();
      oscR.start();
      this.nodes[type] = { source: [oscL, oscR], gain: gain };

    } else if (type === 'drone') {
      // 528 Hz Solfeggio frequency + subharmonic
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(528, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(264, this.ctx.currentTime);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      osc2.connect(subGain);
      subGain.connect(gain);
      osc1.connect(gain);

      osc1.start();
      osc2.start();
      this.nodes[type] = { source: [osc1, osc2], gain: gain };
    }
  }

  setVolume(type, volume) {
    if (this.nodes[type] && this.nodes[type].gain) {
      this.nodes[type].gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  stopSound(type) {
    if (this.nodes[type]) {
      const node = this.nodes[type];
      if (Array.isArray(node.source)) {
        node.source.forEach(s => s.stop());
      } else {
        node.source.stop();
      }
      delete this.nodes[type];
    }
  }

  playAlarm() {
    this.init();
    if (!this.ctx) return;
    const notes = [659.25, 783.99, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.15);
      g.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.15 + 0.3);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.15);
      osc.stop(this.ctx.currentTime + idx * 0.15 + 0.35);
    });
  }
}

const ambientSynth = new AmbientSynthesizer();

// 2. Main App State Controller
class FocusStudyApp {
  constructor() {
    // Pomodoro state
    this.mode = 'focus'; // 'focus', 'short', 'long'
    this.durationMinutes = 25;
    this.totalSeconds = 25 * 60;
    this.remainingSeconds = 25 * 60;
    this.isRunning = false;
    this.timerInterval = null;

    // Study statistics
    this.totalFocusMinutes = parseInt(localStorage.getItem('fsh_focus_min')) || 0;
    this.completedSessions = parseInt(localStorage.getItem('fsh_sessions')) || 0;

    // Kanban Tasks
    this.tasks = JSON.parse(localStorage.getItem('fsh_tasks')) || [
      { id: 1, title: 'Menyelesaikan Soal Fisika Hukum Newton', subject: 'Fisika', priority: 'high', est: 2, status: 'in-progress' },
      { id: 2, title: 'Membaca Bab 4 Metabolisme Sel Biologi', subject: 'Biologi', priority: 'medium', est: 1, status: 'todo' },
      { id: 3, title: 'Menghafal 20 Kosakata Bahasa Inggris', subject: 'Bahasa', priority: 'low', est: 1, status: 'done' }
    ];
    this.activeTaskId = 1;

    this.initDOM();
    this.renderKanban();
    this.updateStatsView();
    this.loadNotes();
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
      });
    });

    // Pomodoro Mode Buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isRunning) this.pauseTimer();
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.mode = btn.dataset.mode;
        this.durationMinutes = parseInt(btn.dataset.time);
        this.totalSeconds = this.durationMinutes * 60;
        this.remainingSeconds = this.totalSeconds;
        
        const labels = {
          focus: 'SESI FOKUS BELAJAR',
          short: 'ISTIRAHAT PENDEK',
          long: 'ISTIRAHAT PANJANG'
        };
        document.getElementById('current-mode-label').textContent = labels[this.mode];
        this.updateTimerDisplay();
      });
    });

    // Timer Controls
    document.getElementById('btn-timer-toggle').addEventListener('click', () => this.toggleTimer());
    document.getElementById('btn-timer-reset').addEventListener('click', () => this.resetTimer());
    document.getElementById('btn-timer-skip').addEventListener('click', () => this.skipTimer());

    // Ambient Sound buttons
    document.querySelectorAll('.btn-amb-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sound = btn.dataset.sound;
        const volInput = document.querySelector(`.amb-volume[data-sound="${sound}"]`);
        const vol = parseFloat(volInput.value);
        const isPlaying = ambientSynth.toggleSound(sound, vol);
        btn.classList.toggle('active', isPlaying);
        btn.textContent = isPlaying ? '⏹️ Hentikan' : '▶️ Putar';
        btn.closest('.ambient-card').classList.toggle('active-sound', isPlaying);
      });
    });

    document.querySelectorAll('.amb-volume').forEach(slider => {
      slider.addEventListener('input', (e) => {
        ambientSynth.setVolume(e.target.dataset.sound, parseFloat(e.target.value));
      });
    });

    // Scratchpad notes auto-save
    const notesArea = document.getElementById('study-scratchpad');
    notesArea.addEventListener('input', (e) => {
      localStorage.setItem('fsh_notes', e.target.value);
      const tag = document.getElementById('notes-save-status');
      tag.textContent = 'Menyimpan...';
      setTimeout(() => tag.textContent = 'Tersimpan otomatis di browser ✓', 400);
    });

    // Task Modal
    document.getElementById('btn-open-task-modal').addEventListener('click', () => {
      document.getElementById('task-modal').classList.add('active');
    });
    document.getElementById('btn-close-task-modal').addEventListener('click', () => {
      document.getElementById('task-modal').classList.remove('active');
    });

    document.getElementById('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('task-input-title').value.trim();
      const subject = document.getElementById('task-input-subject').value;
      const priority = document.getElementById('task-input-priority').value;
      const est = parseInt(document.getElementById('task-input-est').value) || 1;

      if (!title) return;

      this.tasks.push({
        id: Date.now(),
        title,
        subject,
        priority,
        est,
        status: 'todo'
      });

      this.saveTasks();
      this.renderKanban();
      document.getElementById('task-form').reset();
      document.getElementById('task-modal').classList.remove('active');
    });
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    const btn = document.getElementById('btn-timer-toggle');
    btn.textContent = '⏸️ Jeda Belajar';
    btn.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateTimerDisplay();

      if (this.remainingSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.handleTimerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    const btn = document.getElementById('btn-timer-toggle');
    btn.textContent = '▶️ Lanjutkan Belajar';
    btn.style.background = 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))';
  }

  resetTimer() {
    this.pauseTimer();
    this.remainingSeconds = this.totalSeconds;
    this.updateTimerDisplay();
  }

  skipTimer() {
    this.pauseTimer();
    this.handleTimerComplete(false);
  }

  handleTimerComplete(countStat = true) {
    ambientSynth.playAlarm();

    if (this.mode === 'focus' && countStat) {
      this.totalFocusMinutes += this.durationMinutes;
      this.completedSessions++;
      localStorage.setItem('fsh_focus_min', this.totalFocusMinutes);
      localStorage.setItem('fsh_sessions', this.completedSessions);
      this.updateStatsView();
      alert(`🎉 Hebat! Sesi Fokus ${this.durationMinutes} menit telah tuntas! Saatnya istirahat sejenak.`);
    } else if (this.mode !== 'focus') {
      alert(`🔔 Waktu istirahat selesai! Siap untuk kembali fokus belajar?`);
    }

    // Auto-switch mode
    if (this.mode === 'focus') {
      const nextBtn = document.querySelector('.mode-btn[data-mode="short"]');
      if (nextBtn) nextBtn.click();
    } else {
      const nextBtn = document.querySelector('.mode-btn[data-mode="focus"]');
      if (nextBtn) nextBtn.click();
    }
  }

  updateTimerDisplay() {
    const min = Math.floor(this.remainingSeconds / 60);
    const sec = this.remainingSeconds % 60;
    const timeStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    document.getElementById('timer-time').textContent = timeStr;
    document.title = `(${timeStr}) FocusStudy Hub`;

    // Radial SVG update
    const circle = document.getElementById('timer-progress-bar');
    const circumference = 2 * Math.PI * 120; // ~753.98
    const fraction = this.remainingSeconds / this.totalSeconds;
    const offset = circumference * (1 - fraction);
    circle.style.strokeDashoffset = offset;
  }

  renderKanban() {
    const cols = {
      'todo': document.getElementById('list-todo'),
      'in-progress': document.getElementById('list-in-progress'),
      'done': document.getElementById('list-done')
    };

    Object.values(cols).forEach(el => el.innerHTML = '');

    const counts = { todo: 0, 'in-progress': 0, done: 0 };

    this.tasks.forEach(task => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      const card = document.createElement('div');
      card.className = 'task-card';
      card.innerHTML = `
        <div class="task-meta">
          <span class="subject-tag">${task.subject}</span>
          <span class="priority-tag ${task.priority}">${task.priority.toUpperCase()}</span>
        </div>
        <div class="task-title">${task.title}</div>
        <div class="task-footer">
          <span>🍅 ${task.est} Pomodoro</span>
          <div class="task-actions">
            ${task.status !== 'todo' ? `<button class="btn-task-action" data-action="prev" title="Kembalikan">◀</button>` : ''}
            ${task.status !== 'done' ? `<button class="btn-task-action" data-action="next" title="Lanjutkan">▶</button>` : ''}
            <button class="btn-task-action" data-action="focus" title="Pilih sebagai Fokus Timer">🎯</button>
            <button class="btn-task-action" data-action="del" style="color: var(--accent-rose);" title="Hapus">🗑️</button>
          </div>
        </div>
      `;

      // Event handlers for actions
      card.querySelector('[data-action="del"]').addEventListener('click', () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.saveTasks();
        this.renderKanban();
      });

      const nextBtn = card.querySelector('[data-action="next"]');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          task.status = task.status === 'todo' ? 'in-progress' : 'done';
          this.saveTasks();
          this.renderKanban();
        });
      }

      const prevBtn = card.querySelector('[data-action="prev"]');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          task.status = task.status === 'done' ? 'in-progress' : 'todo';
          this.saveTasks();
          this.renderKanban();
        });
      }

      card.querySelector('[data-action="focus"]').addEventListener('click', () => {
        this.activeTaskId = task.id;
        document.getElementById('active-task-name').textContent = `${task.subject}: ${task.title}`;
        document.querySelector('.nav-btn[data-tab="timer"]').click();
      });

      if (cols[task.status]) {
        cols[task.status].appendChild(card);
      }
    });

    document.getElementById('count-todo').textContent = counts.todo;
    document.getElementById('count-progress').textContent = counts['in-progress'];
    document.getElementById('count-done').textContent = counts.done;
    this.updateStatsView();
  }

  saveTasks() {
    localStorage.setItem('fsh_tasks', JSON.stringify(this.tasks));
  }

  loadNotes() {
    const saved = localStorage.getItem('fsh_notes');
    if (saved) {
      document.getElementById('study-scratchpad').value = saved;
    }
  }

  updateStatsView() {
    const hours = Math.floor(this.totalFocusMinutes / 60);
    const mins = this.totalFocusMinutes % 60;
    document.getElementById('today-focus-time').textContent = `${hours} Jam ${mins} M`;
    document.getElementById('total-sessions-val').textContent = `${this.completedSessions} Sesi`;

    const doneCount = this.tasks.filter(t => t.status === 'done').length;
    document.getElementById('completed-tasks-val').textContent = `${doneCount} Tugas`;

    document.getElementById('stat-total-minutes').textContent = `${this.totalFocusMinutes} Menit`;
    document.getElementById('stat-sessions-done').textContent = `${this.completedSessions} Sesi`;

    const percent = this.tasks.length > 0 ? Math.round((doneCount / this.tasks.length) * 100) : 0;
    document.getElementById('stat-task-percent').textContent = `${percent}%`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.focusApp = new FocusStudyApp();
});
