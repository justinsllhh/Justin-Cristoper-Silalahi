// ============================================================
// AUDIO SYNTHESIZER & SOUND FX (Web Audio API)
// Tidak membutuhkan file eksternal, anti-delay, 100% responsif
// ============================================================

class AudioManager {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.musicEnabled = false;
        this.bgmTimer = null;
        this.speechEnabled = true;
        this.init();
    }

    init() {
        // Load preference from localStorage
        const savedSound = localStorage.getItem('ksatria_sound');
        const savedMusic = localStorage.getItem('ksatria_music');
        const savedSpeech = localStorage.getItem('ksatria_speech');

        if (savedSound !== null) this.soundEnabled = savedSound === 'true';
        if (savedMusic !== null) this.musicEnabled = savedMusic === 'true';
        if (savedSpeech !== null) this.speechEnabled = savedSpeech === 'true';
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Suara Tombol Klik
    playClick() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    // Suara Benar / Kebaikan (Happy Arpeggio Chime)
    playSuccess() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const startTime = this.ctx.currentTime + idx * 0.07;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    }

    // Suara Peringatan Lembut / Kurang Tepat
    playWrong() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [330, 260]; // E4 -> C4
        notes.forEach((freq, idx) => {
            const startTime = this.ctx.currentTime + idx * 0.12;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    }

    // Suara Bintang Diperoleh (Sparkle Shimmer)
    playStar() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const baseTime = this.ctx.currentTime;
        const freqs = [659.25, 830.61, 987.77, 1318.51, 1567.98];
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = baseTime + i * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.25);
        });
    }

    // Suara Kemenangan / Level Up Fanfare
    playFanfare() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const melody = [
            { f: 523.25, d: 0.12 }, // C
            { f: 523.25, d: 0.12 }, // C
            { f: 523.25, d: 0.12 }, // C
            { f: 659.25, d: 0.35 }, // E
            { f: 783.99, d: 0.2 },  // G
            { f: 1046.50, d: 0.6 }  // High C
        ];

        let currTime = this.ctx.currentTime;
        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, currTime);

            gain.gain.setValueAtTime(0.3, currTime);
            gain.gain.exponentialRampToValueAtTime(0.001, currTime + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(currTime);
            osc.stop(currTime + note.d);

            currTime += note.d * 0.9;
        });
    }

    // Suara Pertumbuhan Pohon Kebaikan (Magic Bloom Sound)
    playMagicBloom() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
    }

    // Background Music Synthesizer Loop (Melodi Kalimba Santai Ramah Anak)
    startBGM() {
        if (this.bgmTimer) return;
        this.ensureContext();
        if (!this.ctx) return;

        const melody = [
            523.25, 0, 659.25, 0, 783.99, 880.00, 783.99, 0,
            659.25, 0, 587.33, 0, 523.25, 0, 392.00, 0,
            440.00, 0, 523.25, 0, 587.33, 0, 659.25, 0,
            587.33, 0, 523.25, 0, 392.00, 0, 523.25, 0
        ];

        let step = 0;
        const tempo = 220; // ms per step

        this.bgmTimer = setInterval(() => {
            if (!this.musicEnabled || !this.ctx) return;

            const freq = melody[step % melody.length];
            if (freq > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.35);
            }
            step++;
        }, tempo);
    }

    stopBGM() {
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('ksatria_sound', this.soundEnabled);
        if (this.soundEnabled) this.playClick();
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        localStorage.setItem('ksatria_music', this.musicEnabled);
        if (this.musicEnabled) {
            this.startBGM();
        } else {
            this.stopBGM();
        }
        return this.musicEnabled;
    }

    toggleSpeech() {
        this.speechEnabled = !this.speechEnabled;
        localStorage.setItem('ksatria_speech', this.speechEnabled);
        if (this.soundEnabled) this.playClick();
        return this.speechEnabled;
    }

    // Text to Speech untuk Membantu Anak Belajar Membaca & Narasi
    speak(text) {
        if (!this.speechEnabled || !window.speechSynthesis) return;
        try {
            window.speechSynthesis.cancel(); // Hentikan yang sedang jalan
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.95;
            utterance.pitch = 1.1;

            // Cari suara bahasa Indonesia jika ada
            const voices = window.speechSynthesis.getVoices();
            const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
            if (idVoice) utterance.voice = idVoice;

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.log('Speech error:', e);
        }
    }
}

window.audioManager = new AudioManager();
