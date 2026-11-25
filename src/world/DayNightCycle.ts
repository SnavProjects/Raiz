import { GameConfig } from '../config/GameConfig';
export type Phase = 'amanhecer' | 'dia' | 'entardecer' | 'noite';
export class DayNightCycle {
  timeMs = 0; day = 1;
  update(dtMs: number): void {
    this.timeMs += dtMs;
    if (this.timeMs >= GameConfig.dayLengthMs) { this.timeMs -= GameConfig.dayLengthMs; this.day++; }
  }
  /** 0..1 dentro do dia */
  get t(): number { return this.timeMs / GameConfig.dayLengthMs; }
  get phase(): Phase {
    const t = this.t;
    if (t < 0.25) return 'amanhecer';
    if (t < 0.5) return 'dia';
    if (t < 0.75) return 'entardecer';
    return 'noite';
  }
  /** Escuridão 0 (dia) .. 1 (noite profunda) para overlay de iluminação */
  get darkness(): number {
    const t = this.t;
    if (t < 0.2) return 0.35 * (1 - t / 0.2);
    if (t < 0.45) return 0;
    if (t < 0.6) return (t - 0.45) / 0.15 * 0.85;
    if (t < 0.95) return 0.85;
    return 0.85 * (1 - (t - 0.95) / 0.05);
  }
  serialize(): { timeMs: number; day: number } { return { timeMs: this.timeMs, day: this.day }; }
  deserialize(d: { timeMs: number; day: number }): void { this.timeMs = d.timeMs; this.day = d.day; }
}
