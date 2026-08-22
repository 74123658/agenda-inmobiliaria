// Web Audio API Sound Synthesizer for Appointments, Alarms and Chatbot Notifications
import { AlarmSoundType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.8;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
    const savedMute = localStorage.getItem('agenda360_sound_enabled');
    if (savedMute !== null) {
      this.soundEnabled = savedMute === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem('agenda360_sound_enabled', enabled ? 'true' : 'false');
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playAlarm(type: AlarmSoundType = 'campana'): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'campana':
        this.playBellChime(ctx, now);
        break;
      case 'digital':
        this.playDigitalBeep(ctx, now);
        break;
      case 'marimba':
        this.playMarimba(ctx, now);
        break;
      case 'urgente':
        this.playUrgentAlarm(ctx, now);
        break;
      default:
        this.playBellChime(ctx, now);
    }
  }

  public playMessagePop(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playSuccess(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const startTime = now + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25 * this.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  }

  // Sound: Campana / Bell Chime
  private playBellChime(ctx: AudioContext, now: number): void {
    const freqs = [1046.5, 1318.51, 1567.98]; // C6, E6, G6 harmonic bell
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.35 * this.volume, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + 1.4);
    });

    // Secondary repeat chime after 350ms
    setTimeout(() => {
      if (ctx.state === 'running') {
        const t2 = ctx.currentTime;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1567.98, t2); // G6
        gain2.gain.setValueAtTime(0.28 * this.volume, t2);
        gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.9);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 1.0);
      }
    }, 350);
  }

  // Sound: Digital Beep
  private playDigitalBeep(ctx: AudioContext, now: number): void {
    const pulses = [0, 0.12, 0.24, 0.36];
    pulses.forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(idx % 2 === 0 ? 880 : 1174.66, now + delay);

      gain.gain.setValueAtTime(0.18 * this.volume, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.09);
    });
  }

  // Sound: Warm Marimba
  private playMarimba(ctx: AudioContext, now: number): void {
    const chord = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.4 * this.volume, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  // Sound: Urgent Multi-Tone Alarm
  private playUrgentAlarm(ctx: AudioContext, now: number): void {
    for (let i = 0; i < 3; i++) {
      const pulseTime = now + i * 0.28;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(784, pulseTime);
      osc.frequency.linearRampToValueAtTime(1046.5, pulseTime + 0.18);

      gain.gain.setValueAtTime(0.22 * this.volume, pulseTime);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(pulseTime);
      osc.stop(pulseTime + 0.23);
    }
  }

  // Voice synthesis announcement (Optional / Fallback)
  public speakText(text: string): void {
    if (!this.soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = this.volume;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synth is not available
    }
  }
}

export const soundEngine = new SoundEngine();
