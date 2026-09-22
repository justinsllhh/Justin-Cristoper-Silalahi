/**
 * Rimba Pintar - Web Audio Engine (Procedural Sound & Melodies)
 * Generates rich, cheerful 8-bit / cartoon chimes and sound effects directly via Web Audio API.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.bgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopBGM();
    }
    return this.soundEnabled;
  }

  // Play a simple frequency note with envelope
  playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.15, pitchBend = null) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      if (pitchBend) {
        osc.frequency.exponentialRampToValueAtTime(pitchBend, this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // SFX: Button Click / Pop
  playClick() {
    this.playTone(600, 'triangle', 0.08, 0.2, 800);
  }

  // SFX: Correct / Success
  playCorrect() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major arpeggio)
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.18, 0.22);
      }, idx * 70);
    });
  }

  // SFX: Coin / Star Earned
  playCoin() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    this.playTone(987.77, 'sine', 0.1, 0.2); // B5
    setTimeout(() => {
      this.playTone(1318.51, 'sine', 0.25, 0.25); // E6
    }, 80);
  }

  // SFX: Wrong / Boing
  playWrong() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    this.playTone(280, 'sawtooth', 0.25, 0.2, 140);
  }

  // SFX: Victory Level Complete
  playVictory() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const fanfare = [
      { f: 523.25, d: 120 }, // C5
      { f: 659.25, d: 120 }, // E5
      { f: 783.99, d: 120 }, // G5
      { f: 1046.50, d: 250 }, // C6
      { f: 880.00, d: 150 },  // A5
      { f: 1046.50, d: 450 }  // C6
    ];

    let delay = 0;
    fanfare.forEach((item) => {
      setTimeout(() => {
        this.playTone(item.f, 'triangle', item.d / 1000, 0.25);
      }, delay);
      delay += item.d + 30;
    });
  }

  // SFX: Card Flip
  playFlip() {
    this.playTone(440, 'sine', 0.08, 0.15, 660);
  }

  // SFX: Jump / Move Step
  playStep() {
    this.playTone(350, 'triangle', 0.1, 0.12, 500);
  }
}

// Global sound instance
window.soundEngine = new SoundEngine();
