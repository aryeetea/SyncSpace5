// Calm, peaceful sound effects using Web Audio API
// Inspired by Japanese slice-of-life anime ambience

class SoundManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      // Check localStorage for mute preference
      const saved = localStorage.getItem('sync-space-muted');
      this.isMuted = saved === 'true';
      
      // Set up listener for first interaction to initialize audio on mobile
      const initAudio = () => {
        if (!this.isInitialized) {
          this.getContext();
          this.isInitialized = true;
        }
      };
      
      // Listen for various interaction events
      document.addEventListener('touchstart', initAudio, { once: true });
      document.addEventListener('click', initAudio, { once: true });
    }
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if it's suspended (iOS requirement)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    }
    return this.audioContext;
  }

  private playTone(
    frequency: number,
    duration: number,
    volume: number = 0.15,
    type: OscillatorType = 'sine'
  ) {
    if (this.isMuted) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Gentle fade in and out for softness
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  }

  // Soft click for time block selection
  softClick() {
    this.playTone(800, 0.08, 0.12, 'sine');
  }

  // Gentle chime for available time selection
  availableChime() {
    this.playTone(660, 0.12, 0.1, 'sine');
    setTimeout(() => this.playTone(880, 0.1, 0.08, 'sine'), 40);
  }

  // Soft bell for remote selection
  remoteChime() {
    this.playTone(550, 0.12, 0.1, 'sine');
    setTimeout(() => this.playTone(770, 0.1, 0.08, 'sine'), 40);
  }

  // Subtle tone for busy selection
  busyTone() {
    this.playTone(440, 0.15, 0.08, 'sine');
  }

  // Peaceful success sound for creating/joining group
  success() {
    this.playTone(523, 0.15, 0.12, 'sine'); // C
    setTimeout(() => this.playTone(659, 0.15, 0.1, 'sine'), 80); // E
    setTimeout(() => this.playTone(784, 0.2, 0.08, 'sine'), 160); // G
  }

  // Gentle confirmation sound for copying
  copy() {
    this.playTone(880, 0.1, 0.1, 'sine');
    setTimeout(() => this.playTone(1047, 0.12, 0.08, 'sine'), 50);
  }

  // Soft whoosh for page transitions
  transition() {
    const ctx = this.getContext();
    if (this.isMuted) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  }

  // Gentle button hover sound
  hover() {
    this.playTone(600, 0.05, 0.06, 'sine');
  }

  // Soft clear/reset sound
  clear() {
    this.playTone(400, 0.2, 0.08, 'sine');
    setTimeout(() => this.playTone(300, 0.15, 0.06, 'sine'), 60);
  }

  // Anime page turn sound
  pageTurn() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.1);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  }

  // Sparkle/magic sound
  sparkle() {
    this.playTone(1200, 0.08, 0.1, 'sine');
    setTimeout(() => this.playTone(1400, 0.06, 0.08, 'sine'), 30);
    setTimeout(() => this.playTone(1600, 0.05, 0.06, 'sine'), 55);
  }

  // Soft pop for selections
  pop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sync-space-muted', this.isMuted.toString());
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }
}

// Singleton instance
export const sounds = new SoundManager();