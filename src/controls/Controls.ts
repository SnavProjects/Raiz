import { defaultBindings, type KeyBindings } from '../config/GameConfig';
export interface InputState { left: boolean; right: boolean; jump: boolean; }
export class KeyboardControls {
  bindings: KeyBindings = { ...defaultBindings };
  private keys = new Set<string>();
  private mouseLeft = false; private mouseRight = false;
  attach(): void {
    window.addEventListener('blur', () => { this.keys.clear(); this.mouseLeft = false; this.mouseRight = false; });
    window.addEventListener('keydown', e => { if ((e.target as HTMLElement).closest('input, select, textarea')) return; this.keys.add(e.code); if (['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)) e.preventDefault(); });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('mousedown', e => { if (e.button === 0) this.mouseLeft = true; if (e.button === 2) this.mouseRight = true; });
    window.addEventListener('mouseup', e => { if (e.button === 0) this.mouseLeft = false; if (e.button === 2) this.mouseRight = false; });
    window.addEventListener('contextmenu', e => e.preventDefault());
  }
  state(): InputState {
    return { left: this.keys.has(this.bindings.left), right: this.keys.has(this.bindings.right), jump: this.keys.has(this.bindings.jump) };
  }
  get mining(): boolean { return this.mouseLeft; }
  get building(): boolean { return this.mouseRight; }
  rebind(action: keyof KeyBindings, code: string): void { this.bindings[action] = code; }
  serialize(): KeyBindings { return { ...this.bindings }; }
  deserialize(b: KeyBindings): void { this.bindings = { ...b }; }
}
export class TouchControls {
  state: InputState = { left: false, right: false, jump: false };
  interactPressed = false; mineHeld = false; buildHeld = false;
  constructor(private root: HTMLElement) {}
  build(): void {
    const wrap = document.createElement('div'); wrap.id = 'touch-controls';
    const mk = (label: string, id: string): HTMLDivElement => { const d = document.createElement('div'); d.className = 'tc-btn'; d.id = id; d.textContent = label; d.setAttribute('role', 'button'); d.setAttribute('aria-label', label); return d; };
    const left = mk('◀', 'tc-left-btn'); const right = mk('▶', 'tc-right-btn'); const jump = mk('⬆', 'tc-jump'); const act = mk('✋', 'tc-act'); const mine = mk('⛏', 'tc-mine'); const build = mk('🧱', 'tc-build');
    const leftWrap = document.createElement('div'); leftWrap.id = 'tc-left'; leftWrap.append(left, right);
    const rightWrap = document.createElement('div'); rightWrap.id = 'tc-right';
    const row = document.createElement('div'); row.className = 'row'; row.append(jump, act);
    rightWrap.append(row, mine, build);
    wrap.append(leftWrap, rightWrap); this.root.appendChild(wrap);
    const bind = (el: HTMLElement, on: () => void, off: () => void) => {
      el.addEventListener('touchstart', e => { e.preventDefault(); on(); }, { passive: false });
      el.addEventListener('touchcancel', off);
      el.addEventListener('mouseleave', off);
      el.addEventListener('touchend', e => { e.preventDefault(); off(); }, { passive: false });
      el.addEventListener('mousedown', on); el.addEventListener('mouseup', off);
    };
    bind(left, () => this.state.left = true, () => this.state.left = false);
    bind(right, () => this.state.right = true, () => this.state.right = false);
    bind(jump, () => this.state.jump = true, () => this.state.jump = false);
    bind(act, () => { this.interactPressed = true; }, () => { this.interactPressed = false; });
    bind(mine, () => this.mineHeld = true, () => this.mineHeld = false);
    bind(build, () => this.buildHeld = true, () => this.buildHeld = false);

  }
  consumeInteract(): boolean { const v = this.interactPressed; this.interactPressed = false; return v; }
}
