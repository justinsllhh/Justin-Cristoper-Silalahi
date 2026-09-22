/**
 * Rimba Pintar - Main Application Controller & State Manager
 */

class AppState {
  constructor() {
    this.player = {
      name: 'Sahabat Pintar',
      avatar: '🦌',
      avatarName: 'Kiki si Kancil',
      stars: 12,
      coins: 60,
      badges: ['starter_adventurer']
    };

    this.currentScreen = 'hub';
    this.loadState();
    this.initConfetti();
    this.attachGlobalEvents();
    this.updateUI();
  }

  loadState() {
    const saved = localStorage.getItem('rimba_pintar_save');
    if (saved) {
      try {
        this.player = JSON.parse(saved);
      } catch (e) {
        console.warn('Could not parse saved game state');
      }
    }
  }

  saveState() {
    localStorage.setItem('rimba_pintar_save', JSON.stringify(this.player));
  }

  addStars(amount) {
    this.player.stars += amount;
    this.player.coins += amount * 10;
    this.saveState();
    this.updateUI();
  }

  unlockBadge(badgeId) {
    if (!this.player.badges.includes(badgeId)) {
      this.player.badges.push(badgeId);
      this.saveState();
      this.updateUI();
    }
  }

  updateUI() {
    // Header Stats
    document.getElementById('header-stars-count').innerText = this.player.stars;
    document.getElementById('header-coins-count').innerText = this.player.coins;
    
    // Player Avatar Spotlight
    document.getElementById('hero-player-avatar').innerText = this.player.avatar;
    document.getElementById('hero-player-name').innerText = this.player.avatarName;

    // Badges UI
    const badges = [
      { id: 'starter_adventurer', name: 'Penjelajah Pemula', icon: '🌟' },
      { id: 'eco_warrior', name: 'Sahabat Alam', icon: '🌿' },
      { id: 'science_explorer', name: 'Penemu Cilik', icon: '🔭' },
      { id: 'logic_master', name: 'Jagoan Kode', icon: '🧩' },
      { id: 'memory_champion', name: 'Otak Cemerlang', icon: '🧠' }
    ];

    const badgesContainer = document.getElementById('badges-row-container');
    if (badgesContainer) {
      badgesContainer.innerHTML = badges.map(b => {
        const isUnlocked = this.player.badges.includes(b.id);
        return `
          <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}">
            <span class="badge-icon">${b.icon}</span>
            <span class="badge-name">${b.name}</span>
          </div>
        `;
      }).join('');
    }
  }

  switchScreen(screenId) {
    window.soundEngine.playClick();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  launchGame(gameKey) {
    window.soundEngine.playClick();
    this.switchScreen(gameKey);

    if (gameKey === 'eco') {
      window.ecoSorterGame.start();
    } else if (gameKey === 'science') {
      window.scienceQuestGame.start();
    } else if (gameKey === 'logic') {
      window.logicMazeGame.start();
    } else if (gameKey === 'memory') {
      window.memoryCardsGame.start();
    }
  }

  showCelebrationModal(data) {
    this.triggerConfetti();
    const modal = document.getElementById('celebration-modal');
    document.getElementById('modal-title-text').innerText = data.title;
    document.getElementById('modal-desc-text').innerText = data.desc;
    document.getElementById('modal-stars-value').innerText = `+${data.stars} ⭐ Bintang`;

    modal.classList.add('active');
    window.speechEngine.speak(`${data.title}. ${data.desc}`);

    document.getElementById('modal-replay-btn').onclick = () => {
      modal.classList.remove('active');
      this.launchGame(data.gameType);
    };

    document.getElementById('modal-home-btn').onclick = () => {
      modal.classList.remove('active');
      this.switchScreen('hub');
    };
  }

  openAvatarSelector() {
    window.soundEngine.playClick();
    const modal = document.getElementById('avatar-modal');
    const avatars = [
      { emoji: '🦌', name: 'Kiki si Kancil Pintar' },
      { emoji: '🐻', name: 'Bimo si Beruang Bijak' },
      { emoji: '🐰', name: 'Rara si Kelinci Cerdas' },
      { emoji: '🦁', name: 'Leo si Singa Pemberani' },
      { emoji: '🦉', name: 'Oli si Burung Hantu Jenius' },
      { emoji: '🐼', name: 'Panda si Sahabat Ceria' }
    ];

    const grid = document.getElementById('avatar-modal-grid');
    grid.innerHTML = avatars.map(a => `
      <div class="avatar-choice ${this.player.avatar === a.emoji ? 'selected' : ''}" data-emoji="${a.emoji}" data-name="${a.name}">
        <span class="avatar-choice-emoji">${a.emoji}</span>
        <span class="avatar-choice-name">${a.name}</span>
      </div>
    `).join('');

    grid.querySelectorAll('.avatar-choice').forEach(choice => {
      choice.onclick = () => {
        window.soundEngine.playClick();
        this.player.avatar = choice.getAttribute('data-emoji');
        this.player.avatarName = choice.getAttribute('data-name');
        this.saveState();
        this.updateUI();
        modal.classList.remove('active');
        window.speechEngine.speak(`Halo! Kamu sekarang bermain sebagai ${this.player.avatarName}!`);
      };
    });

    modal.classList.add('active');
  }

  initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  triggerConfetti() {
    if (!this.ctx) return;
    this.particles = [];
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];

    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10
      });
    }

    const animate = () => {
      if (this.particles.length === 0) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // Gravity
        p.rotation += p.rSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();

        if (p.y > window.innerHeight) {
          this.particles.splice(idx, 1);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  attachGlobalEvents() {
    // Sound Toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    soundBtn.onclick = () => {
      const enabled = window.soundEngine.toggleSound();
      soundBtn.innerHTML = enabled ? '🔊' : '🔇';
    };

    // Speech Toggle
    const speechBtn = document.getElementById('speech-toggle-btn');
    speechBtn.onclick = () => {
      const enabled = window.speechEngine.toggleSpeech();
      speechBtn.innerHTML = enabled ? '🗣️' : '🤐';
    };

    // Avatar spotlight click
    document.getElementById('hero-avatar-box').onclick = () => {
      this.openAvatarSelector();
    };

    // Close avatar modal
    document.getElementById('close-avatar-modal-btn').onclick = () => {
      document.getElementById('avatar-modal').classList.remove('active');
    };
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.appState = new AppState();
});
