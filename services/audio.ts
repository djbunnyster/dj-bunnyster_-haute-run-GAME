
class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private beatInterval: any = null;
  private isBeatRunning: boolean = false;
  private trackVariation: number = 0;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      this.analyser.connect(this.ctx.destination);
      this.masterGain.connect(this.analyser);
    }
  }

  getAnalyser() {
    return this.analyser;
  }

  startBeat() {
    if (!this.ctx || this.isBeatRunning) return;
    this.isBeatRunning = true;
    
    const bpm = 138; 
    const stepTime = (60 / bpm) / 4; 
    let step = 0;

    let nextNoteTime = this.ctx.currentTime;

    const scheduler = () => {
      while (nextNoteTime < this.ctx!.currentTime + 0.1) {
        if (step % 64 === 0) {
          this.trackVariation = (this.trackVariation + 1) % 4;
        }

        // PUNCHY INDUSTRIAL KICK
        if (step % 4 === 0) this.playPunchyKick(nextNoteTime);
        
        // CRISP PERCUSSION
        if (step % 8 === 4) this.playDigitalClap(nextNoteTime, 0.07);
        if (step % 2 === 1) this.playBrightHat(nextNoteTime, 0.025);

        // DRIVING MIDI BASSLINE
        const bassTrigger = (step % 4 !== 0);
        if (bassTrigger) {
          const melody = [32.70, 36.71, 38.89, 43.65]; // C1, D1, Eb1, F1
          const freq = melody[Math.floor((step % 16) / 4)];
          this.playMidiBass(nextNoteTime, freq);
        }

        // MIDI TECHNO ARPEGGIO
        if (step % 16 < 12 && step % 2 === 0) {
          const melody = [261.63, 311.13, 349.23, 392.00, 466.16]; // C4 Scale
          const note = melody[(step) % melody.length];
          this.playMidiArp(nextNoteTime, note);
        }

        // HIGH RESONANT GLITCH
        if (this.trackVariation > 1 && step % 32 === 28) {
           this.playHighBeep(nextNoteTime, 1760); // A6
        }

        nextNoteTime += stepTime;
        step = (step + 1) % 512;
      }
      this.beatInterval = setTimeout(scheduler, 25);
    };

    scheduler();
  }

  stopBeat() {
    if (this.beatInterval) {
      clearTimeout(this.beatInterval);
      this.beatInterval = null;
    }
    this.isBeatRunning = false;
  }

  private playPunchyKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(85, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);
    
    gain.gain.setValueAtTime(1.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  private playMidiBass(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square'; // Classic MIDI bass vibe
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(80, time + 0.1);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playMidiArp(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, time);
    filter.frequency.exponentialRampToValueAtTime(500, time + 0.1);
    filter.Q.value = 8;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playHighBeep(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playBrightHat(time: number, vol: number) {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.01, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 13000;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
  }

  private playDigitalClap(time: number, vol: number) {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
  }

  playNoteCollect() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playHit() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(10, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }
}

export const audio = new AudioEngine();
