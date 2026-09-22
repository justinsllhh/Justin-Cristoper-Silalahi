/**
 * Rimba Pintar - Narator Suara Interaktif (Web Speech API)
 * Membantu membacakan petunjuk, soal, dan apresiasi suara berbahasa Indonesia.
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voice = null;
    this.speechEnabled = true;
    this.initVoice();
  }

  initVoice() {
    if (!this.synth) return;
    
    const setIndonesianVoice = () => {
      const voices = this.synth.getVoices();
      // Cari suara bahasa Indonesia (id-ID)
      this.voice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID')) || voices[0];
    };

    setIndonesianVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = setIndonesianVoice;
    }
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled && this.synth) {
      this.synth.cancel();
    }
    return this.speechEnabled;
  }

  speak(text) {
    if (!this.speechEnabled || !this.synth) return;

    // Batalkan ucapan sebelumnya jika ada yang sedang berjalan
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.rate = 0.95; // Sedikit lebih santai dan jelas untuk anak-anak
    utterance.pitch = 1.15; // Sedikit lebih ceria
    utterance.lang = 'id-ID';

    this.synth.speak(utterance);
  }
}

window.speechEngine = new SpeechEngine();
