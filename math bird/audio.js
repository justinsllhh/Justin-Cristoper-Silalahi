/**
 * audio.js - Web Audio API Procedural Sound Engine for Math Bird
 * Menghasilkan efek suara synthesizer tanpa file eksternal (100% responsif dan ringan)
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isBgmPlaying = false;
        this.bgmTimer = null;
        this.initContext();
    }

    initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    }

    ensureContext() {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        }
        return this.isMuted;
    }

    /**
     * Suara Flap / Lompat Sayap (Upward pitch sweep)
     */
    playFlap() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    /**
     * Suara Jawaban Benar (Melodi Ceria C-E-G-C)
     */
    playCorrect() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0, now + idx * 0.07);
            gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.07 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.25);
        });
    }

    /**
     * Suara Combo Streak
     */
    playCombo(streakCount = 1) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const baseFreq = Math.min(1200, 600 + streakCount * 80);
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.18);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Suara Jawaban Salah / Tabrakan
     */
    playWrong() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.25);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.28);
    }

    /**
     * Suara Kemenangan Level (Victory Fanfare)
     */
    playLevelVictory() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);

            gain.gain.setValueAtTime(0, now + idx * 0.1);
            gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.1 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.45);
        });
    }

    /**
     * Suara Bintang Ditambahkan (Ding emas)
     */
    playStarDing(starIndex = 1) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const freq = 800 + starIndex * 300;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    /**
     * Suara Menang Duel (Heroic Fanfare)
     */
    playDuelWin() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98]; // C5, E5, G5, C6, E6, G6
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.45);
        });
    }

    /**
     * Suara Pemulihan Nyawa (Sweet Healing Chime)
     */
    playHeal() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0, now + idx * 0.06);
            gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.3);
        });
    }

    /**
     * Suara Shield / Perisai Aktif
     */
    playShield() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    /**
     * Suara Shield Pecah / Melindungi dari Tabrakan
     */
    playShieldBreak() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    /**
     * Suara Power-Up Umum (2X Score / Slow-Mo)
     */
    playPowerup() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [400, 600, 900, 1200];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.25, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.18);
        });
    }

    /**
     * Suara Game Over
     */
    playGameOver() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [440, 392, 349.23, 293.66];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);

            gain.gain.setValueAtTime(0.25, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.35);
        });
    }

    /**
     * Suara Klik UI Button
     */
    playClick() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    startBGM() {
        if (this.isMuted || this.isBgmPlaying) return;
        this.ensureContext();
        if (!this.ctx) return;

        this.isBgmPlaying = true;
        const melody = [
            261.63, 329.63, 392.00, 523.25, 392.00, 329.63,
            293.66, 349.23, 440.00, 587.33, 440.00, 349.23,
            329.63, 392.00, 523.25, 659.25, 523.25, 392.00,
            261.63, 329.63, 392.00, 523.25, 0, 0
        ];

        let step = 0;
        const stepTime = 180;

        const playStep = () => {
            if (!this.isBgmPlaying || this.isMuted) return;

            const freq = melody[step % melody.length];
            if (freq > 0 && this.ctx) {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.16);
            }

            step++;
            this.bgmTimer = setTimeout(playStep, stepTime);
        };

        playStep();
    }

    stopBGM() {
        this.isBgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

if (typeof window !== 'undefined') {
    window.SoundEngine = SoundEngine;
}
