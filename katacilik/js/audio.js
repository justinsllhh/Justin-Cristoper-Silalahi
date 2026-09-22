// Audio Engine: Web Audio API Synthesizer & Speech Synthesis
class SoundController {
    constructor() {
        this.audioCtx = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.bgmInterval = null;
        this.bgmPlaying = false;
        this.speechVoice = null;
        this.initSpeech();
    }

    initAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    initSpeech() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                // Find Indonesian voice or default
                this.speechVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID')) || null;
            };
        }
    }

    speak(text, rate = 0.9, pitch = 1.1) {
        if (!this.soundEnabled || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel(); // Stop prior speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = rate; // Slightly slower for kids clarity
            utterance.pitch = pitch; // Cheerful friendly pitch
            if (this.speechVoice) {
                utterance.voice = this.speechVoice;
            }
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech synthesis error:', e);
        }
    }

    // --- Synthesized Sound Effects (Pure Web Audio API) ---
    playPop() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    playClick() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playLetterPlace() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    playCorrect() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        
        // Happy arpeggio (C5 - E5 - G5 - C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const noteStart = now + idx * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(0.28, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.26);
        });
    }

    playWrong() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.25);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
    }

    playStar() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    playWin() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        // Fanfare notes
        const fanfare = [
            { f: 523.25, d: 0.12, t: 0 },
            { f: 659.25, d: 0.12, t: 0.12 },
            { f: 783.99, d: 0.15, t: 0.24 },
            { f: 1046.5, d: 0.45, t: 0.42 }
        ];

        fanfare.forEach(item => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const start = now + item.t;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, start);

            gain.gain.setValueAtTime(0.32, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + item.d);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(start);
            osc.stop(start + item.d);
        });
    }

    playStickerUnlock() {
        if (!this.soundEnabled) return;
        this.initAudioContext();
        const now = this.audioCtx.currentTime;
        const freqs = [600, 800, 1000, 1200, 1500];
        freqs.forEach((f, i) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const start = now + i * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.16);
        });
    }

    // Ambient Gentle Background Chimes for Kids
    startBGM() {
        if (!this.musicEnabled || this.bgmPlaying) return;
        this.initAudioContext();
        this.bgmPlaying = true;
        
        const chords = [
            [261.63, 329.63, 392.00], // C major
            [220.00, 261.63, 329.63], // A minor
            [174.61, 220.00, 261.63], // F major
            [196.00, 246.94, 293.66]  // G major
        ];
        let step = 0;

        const playChime = () => {
            if (!this.musicEnabled || !this.bgmPlaying) return;
            try {
                const now = this.audioCtx.currentTime;
                const chord = chords[step % chords.length];
                step++;

                chord.forEach((freq, idx) => {
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    const noteStart = now + idx * 0.18;

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq * 1.5, noteStart);

                    gain.gain.setValueAtTime(0.035, noteStart);
                    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.8);

                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start(noteStart);
                    osc.stop(noteStart + 1.9);
                });
            } catch (e) {}
        };

        playChime();
        this.bgmInterval = setInterval(playChime, 2400);
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startBGM();
        } else {
            this.stopBGM();
        }
        return this.musicEnabled;
    }
}

window.soundCtrl = new SoundController();
