import audioMapJson from '../data/audioMap.json';
import type { AccessibilitySettings } from '../types';

export const audioMap: Record<string, string> = audioMapJson;

export class SoundEffects {
  private audioCtx: AudioContext | null = null;

  init() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch {}
  }

  playSuccess() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const t = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.09);
        gain.gain.setValueAtTime(0.2, t + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t + idx * 0.09);
        osc.stop(t + idx * 0.09 + 0.3);
      });
    } catch {}
  }

  playGentleRetry() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const t = this.audioCtx.currentTime;
      [392, 329.63].forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.15);
        gain.gain.setValueAtTime(0.15, t + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.15 + 0.25);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t + idx * 0.15);
        osc.stop(t + idx * 0.15 + 0.25);
      });
    } catch {}
  }

  playEmergencySound() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.linearRampToValueAtTime(900, t + 0.2);
      osc.frequency.linearRampToValueAtTime(600, t + 0.4);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    } catch {}
  }
}

export class SpeechEngine {
  private synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null;
  private audio: HTMLAudioElement | null = null;
  private generation: number = 0;
  private speaking: boolean = false;
  private utterance: SpeechSynthesisUtterance | null = null;
  private callbacks: Set<(speaking: boolean) => void> = new Set();
  private timer: any = null;
  private voiceTimer: any = null;

  notify(isSpeaking: boolean) {
    this.speaking = isSpeaking;
    this.callbacks.forEach((cb) => cb(isSpeaking));
  }

  subscribeState(cb: (speaking: boolean) => void) {
    this.callbacks.add(cb);
    cb(this.speaking);
    return () => {
      this.callbacks.delete(cb);
    };
  }

  getSpeakingState(): boolean {
    return this.speaking;
  }

  stop() {
    this.generation++;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.voiceTimer) {
      clearTimeout(this.voiceTimer);
      this.voiceTimer = null;
    }
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio = null;
    }
    if (this.utterance) {
      this.utterance.onend = null;
      this.utterance.onerror = null;
      this.utterance = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    this.notify(false);
  }

  speak(
    text: string,
    settings?: Partial<AccessibilitySettings>,
    onDone?: () => void
  ) {
    this.speakSequence([text], settings, onDone);
  }

  speakSequence(
    texts: string[],
    settings?: Partial<AccessibilitySettings>,
    onDone?: () => void
  ) {
    this.stop();
    const curGen = this.generation;
    const cleanList = texts.map((t) => t?.trim()).filter(Boolean);

    if (!cleanList.length) {
      onDone?.();
      return;
    }

    this.notify(true);

    const playNext = (index: number) => {
      if (curGen !== this.generation) return;
      if (index >= cleanList.length) {
        this.notify(false);
        onDone?.();
        return;
      }

      const advance = () => {
        if (curGen === this.generation) {
          if (index + 1 < cleanList.length) {
            this.timer = setTimeout(() => playNext(index + 1), 350);
          } else {
            playNext(index + 1);
          }
        }
      };

      const itemText = cleanList[index];
      const audioUrl = audioMap[itemText];

      if (!audioUrl) {
        this.speakDevice(itemText, settings, curGen, advance);
        return;
      }

      const audio = new Audio(audioUrl);
      this.audio = audio;
      audio.playbackRate = Math.max(
        0.6,
        Math.min(1.2, settings?.speechRate ?? 1)
      );
      (audio as any).preservesPitch = true;

      let ended = false;
      audio.onended = () => {
        if (!ended) {
          ended = true;
          advance();
        }
      };

      const fallback = () => {
        if (!ended && curGen === this.generation) {
          ended = true;
          audio.pause();
          audio.onended = null;
          audio.onerror = null;
          this.speakDevice(itemText, settings, curGen, advance);
        }
      };

      audio.onerror = fallback;
      audio.play().catch(fallback);
    };

    playNext(0);
  }

  private speakDevice(
    text: string,
    settings: Partial<AccessibilitySettings> | undefined,
    gen: number,
    onAdvance: () => void,
    retryVoices: boolean = true
  ) {
    if (gen !== this.generation) return;
    if (!this.synth) {
      this.notify(false);
      return;
    }

    const idVoices = this.synth
      .getVoices()
      .filter((v) => /^(id|in)(-|_|$)/i.test(v.lang));

    if (!idVoices.length && retryVoices) {
      this.voiceTimer = setTimeout(() => {
        this.speakDevice(text, settings, gen, onAdvance, false);
      }, 500);
      return;
    }

    const scoreVoice = (v: SpeechSynthesisVoice) =>
      /gadis|natural|neural/i.test(v.name)
        ? 100
        : /google|damayanti/i.test(v.name)
        ? 60
        : 10;
    idVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));

    const cleanText = text
      .replace(/[*_#`]/g, '')
      .replace(/&/g, ' dan ')
      .replace(/\bHP\b/g, 'ponsel');

    const utt = new SpeechSynthesisUtterance(cleanText);
    this.utterance = utt;
    utt.lang = 'id-ID';
    if (idVoices[0]) {
      utt.voice = idVoices[0];
    }
    utt.rate = Math.max(0.6, Math.min(1.2, settings?.speechRate ?? 1));
    utt.pitch = settings?.speechPitch ?? 1;

    utt.onend = () => {
      if (gen === this.generation) {
        onAdvance();
      }
    };
    utt.onerror = () => {
      if (gen === this.generation) {
        this.notify(false);
      }
    };

    try {
      this.synth.speak(utt);
    } catch {
      this.notify(false);
    }
  }
}

export const soundEffects = new SoundEffects();
export const speechEngine = new SpeechEngine();
