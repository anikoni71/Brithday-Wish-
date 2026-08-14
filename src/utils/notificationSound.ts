/**
 * Pleasant harmonic notification chime using standard Web Audio API.
 * Synthesizes a warm, cheerful multi-tone chime without external audio assets.
 */
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('Web Audio API not supported or blocked:', e);
    return null;
  }
}

/**
 * Plays a warm 3-note celebration chime (C5 -> E5 -> G5 -> C6)
 */
export function playCelebrationChime(volume = 0.25): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, time: 0, duration: 0.25 },     // C5
      { freq: 659.25, time: 0.12, duration: 0.3 },   // E5
      { freq: 783.99, time: 0.24, duration: 0.35 },  // G5
      { freq: 1046.50, time: 0.36, duration: 0.6 }   // C6
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      // Subtle vibrato / warmth
      noteGain.gain.setValueAtTime(0, ctx.currentTime + time);
      noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + time + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration);
    });
  } catch (err) {
    console.warn('Audio chime playback prevented:', err);
  }
}

/**
 * Plays a gentle reminder alert sound (E5 -> A5)
 */
export function playGentleReminderSound(volume = 0.2): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 659.25, time: 0, duration: 0.2 },      // E5
      { freq: 880.00, time: 0.14, duration: 0.45 }   // A5
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      noteGain.gain.setValueAtTime(0, ctx.currentTime + time);
      noteGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + time + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + duration);
    });
  } catch (err) {
    console.warn('Reminder sound error:', err);
  }
}

/**
 * Helper with sound-enabled check
 */
export function playBirthdayAlertChime(enabled = true): void {
  if (!enabled) return;
  playGentleReminderSound(0.2);
}

export function playSuccessChime(enabled = true): void {
  if (!enabled) return;
  playCelebrationChime(0.25);
}
