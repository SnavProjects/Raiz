// Áudio 100% original sintetizado via Web Audio (sem arquivos externos) — AGENTS §10
export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null; private musicGain: GainNode | null = null; private sfxGain: GainNode | null = null;
  private musicTimer: number | null = null; private step = 0;
  volumeMaster = 0.8; volumeMusic = 0.6; volumeSfx = 0.8;
  ensure(): void {
    if (this.ctx) { if (this.ctx.state === 'suspended') void this.ctx.resume(); return; }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain(); this.master.gain.value = this.volumeMaster; this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = this.volumeMusic; this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = this.volumeSfx; this.sfxGain.connect(this.master);
  }
  setVolumes(m: number, mu: number, s: number): void {
    this.volumeMaster = m; this.volumeMusic = mu; this.volumeSfx = s;
    if (this.master) this.master.gain.value = m;
    if (this.musicGain) this.musicGain.gain.value = mu;
    if (this.sfxGain) this.sfxGain.gain.value = s;
  }
  private tone(freq: number, dur: number, type: OscillatorType, vol: number, dest?: AudioNode): void {
    if (!this.ctx || !this.sfxGain) return;
    const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g); g.connect(dest ?? this.sfxGain);
    o.start(); o.stop(this.ctx.currentTime + dur);
  }
  playSfx(name: string): void {
    this.ensure(); if (!this.ctx) return;
    switch (name) {
      case 'mine': this.tone(180 + Math.random() * 40, 0.08, 'square', 0.15); break;
      case 'place': this.tone(320, 0.07, 'square', 0.12); break;
      case 'collect': this.tone(660, 0.1, 'sine', 0.15); break;
      case 'craft': this.tone(520, 0.12, 'sine', 0.15); setTimeout(() => this.tone(780, 0.12, 'sine', 0.15), 80); break;
      case 'hurt': this.tone(140, 0.2, 'sawtooth', 0.2); break;
      case 'eat': this.tone(440, 0.1, 'sine', 0.12); break;
      case 'ui': this.tone(880, 0.05, 'sine', 0.08); break;
      case 'step': this.tone(90, 0.04, 'sine', 0.05); break;
      case 'creature': this.tone(220, 0.3, 'sawtooth', 0.08); break;
      case 'death': this.tone(110, 0.6, 'sawtooth', 0.2); break;
    }
  }
  startMusic(): void {
    this.ensure(); if (!this.ctx || this.musicTimer !== null) return;
    const scale = [261.6, 293.7, 329.6, 392, 440, 523.3];
    const tick = () => {
      if (!this.ctx || !this.musicGain) return;
      const f = scale[this.step % scale.length]!;
      this.tone(f, 0.5, 'triangle', 0.06, this.musicGain);
      if (this.step % 4 === 0) this.tone(f / 2, 0.8, 'sine', 0.05, this.musicGain);
      this.step++;
    };
    tick(); this.musicTimer = window.setInterval(tick, 600);
  }
  stopMusic(): void { if (this.musicTimer !== null) { clearInterval(this.musicTimer); this.musicTimer = null; } }
}
export const audio = new AudioSystem();
