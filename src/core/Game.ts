import { eventBus } from './EventBus';
import { defaultSettings, type Settings } from '../config/GameConfig';
export class Game {
  settings: Settings = { ...defaultSettings };
  running = false;
  start(): void { this.running = true; }
  stop(): void { this.running = false; }
  applySettings(s: Partial<Settings>): void {
    Object.assign(this.settings, s);
    document.documentElement.style.setProperty('--ui-scale', String(this.settings.uiScale));
    document.documentElement.style.setProperty('--touch-size', this.settings.touchSize + 'px');
    document.documentElement.lang = this.settings.language;
    document.body.classList.toggle('reduced-motion', this.settings.reducedMotion);
    if (this.settings.highContrast) document.body.style.filter = 'contrast(1.4)';
    else document.body.style.filter = '';
    eventBus.emit({ type: 'settings-changed' });
  }
}
export const game = new Game();
