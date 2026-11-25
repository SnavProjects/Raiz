import { t } from './i18n';
import { game } from '../core/Game';
import { worldStore } from '../persistence/WorldStore';
import { defaultSettings, defaultBindings, type Difficulty } from '../config/GameConfig';
import { KeyboardControls } from '../controls/Controls';
import { audio } from '../audio/AudioSystem';
import { itemDef } from '../systems/inventory/items';
import type { Inventory } from '../systems/inventory/Inventory';
import type { Crafting } from '../systems/crafting/Crafting';
import { eventBus } from '../core/EventBus';

export interface UIHooks {
  onPlay: (worldId: string) => void;
  onCreateWorld: (name: string, seed: string, difficulty: Difficulty) => Promise<void>;
  onSave: () => void;
  onQuit: () => void;
  onRespawn: () => void;
  getInventory: () => Inventory | null;
  getCrafting: () => Crafting | null;
  getHealth: () => { health: number; hunger: number };
  getTimeLabel: () => string;
  onEat: (itemId: string) => void;
  onSelectSlot: (i: number) => void;
  onCraft: (recipeId: string) => boolean;
  onSort: () => void;
  onDiscard: (i: number) => void;
  onMoveSlot: (from: number, to: number) => void;
  keyboard: KeyboardControls;
}
function el(tag: string, cls = '', text = ''): HTMLElement { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
function btn(label: string, cls = 'btn', onclick?: () => void): HTMLButtonElement { const b = el('button', cls, label) as HTMLButtonElement; if (onclick) b.addEventListener('click', () => { audio.playSfx('ui'); onclick(); }); return b; }

export class UI {
  private root: HTMLElement; private hooks: UIHooks;
  private toastTimer: number | null = null;
  constructor(root: HTMLElement, hooks: UIHooks) { this.root = root; this.hooks = hooks; eventBus.on('inventory-changed', () => this.refreshHotbar()); }
  private lang(): string { return game.settings.language; }
  private clear(): void { this.root.innerHTML = ''; }
  toast(msg: string): void {
    document.getElementById('toast')?.remove();
    const t = el('div', '', msg); t.id = 'toast'; this.root.appendChild(t);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => t.remove(), 2500);
  }
  showMainMenu(): void {
    this.clear();
    const s = el('div', 'screen'); s.id = 'main-menu';
    s.append(el('h1', 'logo', 'RAIZ'), el('p', 'subtitle', 'Sandbox Survival — Pixel Art original'));
    s.append(btn(t('newWorld', this.lang()), 'btn primary', () => this.showCreateWorld()));
    s.append(btn(t('continue_', this.lang()), 'btn', () => this.showWorldList()));
    s.append(btn(t('settings', this.lang()), 'btn', () => this.showSettings(() => this.showMainMenu())));
    s.append(btn(t('credits', this.lang()), 'btn', () => this.showCredits()));
    this.root.appendChild(s);
  }
  private async showWorldList(): Promise<void> {
    this.clear();
    const s = el('div', 'screen'); s.id = 'world-list';
    s.append(el('h1', 'logo', 'RAIZ'), el('h2', '', t('continue_', this.lang())));
    const list = el('div', 'world-list');
    const worlds = await worldStore.listWorlds();
    if (!worlds.length) list.append(el('p', '', t('noWorlds', this.lang())));
    for (const w of worlds) {
      const item = el('div', 'world-item');
      const left = el('div', '', w.name);
      left.append(el('div', 'meta', `Seed: ${w.seed} • ${new Date(w.updatedAt).toLocaleDateString()}`));
      const actions = el('div', '');
      actions.append(btn(t('play', this.lang()), 'btn small primary', () => this.hooks.onPlay(w.id)));
      actions.append(btn(t('rename', this.lang()), 'btn small', () => {
        const n = prompt(t('worldName', this.lang()), w.name);
        if (n) { w.name = n; void worldStore.loadWorld(w.id).then(async sv => { if (sv) { sv.meta.name = n; await worldStore.saveWorld(sv); } this.showWorldList(); }); }
      }));
      actions.append(btn(t('export', this.lang()), 'btn small', () => {
        void worldStore.exportWorld(w.id).then(json => {
          const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = w.name + '.raiz.json'; a.click();
        });
      }));
      actions.append(btn(t('delete', this.lang()), 'btn small danger', () => this.showConfirm(t('confirmDelete', this.lang()), async () => { await worldStore.deleteWorld(w.id); this.showWorldList(); })));
      item.append(left, actions); list.append(item);
    }
    s.append(list);
    const importLabel = el('label', '', t('import', this.lang()));
    const file = document.createElement('input'); file.type = 'file'; file.accept = '.json';
    file.addEventListener('change', () => { const f = file.files?.[0]; if (!f) return; void f.text().then(async json => { try { await worldStore.importWorld(json); this.toast('OK'); this.showWorldList(); } catch { this.toast('Erro na importação'); } }); });
    importLabel.appendChild(file); s.append(importLabel);
    s.append(btn(t('back', this.lang()), 'btn', () => this.showMainMenu()));
    this.root.appendChild(s);
  }
  private showCreateWorld(): void {
    this.clear();
    const s = el('div', 'screen'); s.id = 'create-world';
    s.append(el('h1', 'logo', 'RAIZ'), el('h2', '', t('newWorld', this.lang())));
    const name = document.createElement('input'); name.placeholder = t('worldName', this.lang()); name.id = 'world-name';
    const seed = document.createElement('input'); seed.placeholder = t('seed', this.lang()); seed.id = 'world-seed';
    const diff = document.createElement('select'); diff.id = 'world-difficulty';
    for (const d of ['facil', 'normal', 'dificil']) { const o = document.createElement('option'); o.value = d; o.textContent = d; diff.appendChild(o); }
    s.append(el('label', '', t('worldName', this.lang())), name, el('label', '', t('seed', this.lang())), seed, el('label', '', t('difficulty', this.lang())), diff);
    s.append(btn(t('create', this.lang()), 'btn primary', () => { void this.hooks.onCreateWorld(name.value || 'Meu Mundo', seed.value || String(Date.now()), diff.value as Difficulty); }));
    s.append(btn(t('back', this.lang()), 'btn', () => this.showMainMenu()));
    this.root.appendChild(s);
  }
  private showSettings(back: () => void): void {
    // Preserve HUD e controles touch quando as configurações forem abertas na partida.
    if (!document.getElementById('hud')) this.clear();
    const s = el('div', 'screen'); s.id = 'settings';
    s.append(el('h2', '', t('settings', this.lang())));
    const panel = el('div', 'panel');
    const row = (label: string, input: HTMLElement) => { const r = el('div', 'settings-row'); r.append(el('span', '', label), input); return r; };
    const mkRange = (val: number, min: number, max: number, step: number, cb: (v: number) => void) => { const i = document.createElement('input'); i.type = 'range'; i.min = String(min); i.max = String(max); i.step = String(step); i.value = String(val); i.addEventListener('input', () => cb(Number(i.value))); return i; };
    const mkCheck = (val: boolean, cb: (v: boolean) => void) => { const i = document.createElement('input'); i.type = 'checkbox'; i.checked = val; i.addEventListener('change', () => cb(i.checked)); return i; };
    const st = game.settings;
    panel.append(row(t('volumeMaster', this.lang()), mkRange(st.volumeMaster, 0, 1, 0.05, v => { game.applySettings({ volumeMaster: v }); audio.setVolumes(v, st.volumeMusic, st.volumeSfx); })));
    panel.append(row(t('volumeMusic', this.lang()), mkRange(st.volumeMusic, 0, 1, 0.05, v => { game.applySettings({ volumeMusic: v }); audio.setVolumes(st.volumeMaster, v, st.volumeSfx); })));
    panel.append(row(t('volumeSfx', this.lang()), mkRange(st.volumeSfx, 0, 1, 0.05, v => { game.applySettings({ volumeSfx: v }); audio.setVolumes(st.volumeMaster, st.volumeMusic, v); })));
    panel.append(row(t('uiScale', this.lang()), mkRange(st.uiScale, 0.7, 1.6, 0.1, v => game.applySettings({ uiScale: v }))));
    panel.append(row(t('highContrast', this.lang()), mkCheck(st.highContrast, v => game.applySettings({ highContrast: v }))));
    panel.append(row(t('reducedMotion', this.lang()), mkCheck(st.reducedMotion, v => game.applySettings({ reducedMotion: v }))));
    panel.append(row(t('touchSize', this.lang()), mkRange(st.touchSize, 44, 96, 4, v => game.applySettings({ touchSize: v }))));
    const langSel = document.createElement('select');
    for (const l of ['pt-BR', 'en']) { const o = document.createElement('option'); o.value = l; o.textContent = l; if (l === st.language) o.selected = true; langSel.appendChild(o); }
    langSel.addEventListener('change', () => game.applySettings({ language: langSel.value }));
    panel.append(row(t('language', this.lang()), langSel));
    // controles rebindáveis
    panel.append(el('h3', '', t('controls', this.lang())));
    const kb = this.hooks.keyboard;
    for (const action of ['left', 'right', 'jump', 'interact', 'inventory', 'crafting', 'pause'] as const) {
      const b = btn(`${action}: ${kb.bindings[action]}`, 'btn small', () => {
        b.textContent = '...';
        const handler = (e: KeyboardEvent) => { kb.rebind(action, e.code); b.textContent = `${action}: ${e.code}`; window.removeEventListener('keydown', handler); void this.persistSettings(); };
        window.addEventListener('keydown', handler);
      });
      panel.append(row(action, b));
    }
    panel.append(btn(t('back', this.lang()), 'btn', () => { s.remove(); back(); }));
    s.append(panel); this.root.appendChild(s);
  }
  private async persistSettings(): Promise<void> {
    await worldStore.saveSettings({ settings: { ...game.settings }, bindings: { ...this.hooks.keyboard.bindings } });
  }
  private showCredits(): void {
    this.clear();
    const s = el('div', 'screen'); s.id = 'credits';
    s.append(el('h1', 'logo', 'RAIZ'), el('p', '', t('creditsText', this.lang())), el('p', '', 'Código: MIT • Assets: CC BY 4.0 • SnavProjects/Raiz'));
    s.append(btn(t('back', this.lang()), 'btn', () => this.showMainMenu()));
    this.root.appendChild(s);
  }
  showConfirm(message: string, onYes: () => void): void {
    const bg = el('div', 'modal-bg'); bg.id = 'confirm-modal';
    const m = el('div', 'modal'); m.append(el('p', '', message));
    const row = el('div', ''); row.style.display = 'flex'; row.style.gap = '10px'; row.style.marginTop = '14px';
    row.append(btn(t('yes', this.lang()), 'btn danger', () => { bg.remove(); onYes(); }), btn(t('no', this.lang()), 'btn', () => bg.remove()));
    m.append(row); bg.append(m); this.root.appendChild(bg);
  }
  showHUD(): void {
    this.clear();
    const hud = el('div', ''); hud.id = 'hud';
    const top = el('div', 'hud-top');
    const hpWrap = el('div', 'bar-wrap'); const hp = el('div', 'bar hp'); hp.id = 'hp-bar'; hp.style.width = '100%';
    const hpLabel = el('div', 'bar-label', t('health', this.lang())); hpWrap.append(hp, hpLabel);
    const huWrap = el('div', 'bar-wrap'); const hu = el('div', 'bar hunger'); hu.id = 'hunger-bar'; hu.style.width = '100%';
    const huLabel = el('div', 'bar-label', t('hunger', this.lang())); huWrap.append(hu, huLabel);
    top.append(hpWrap, huWrap);
    const time = el('div', '', ''); time.id = 'time-indicator'; hud.append(time);
    const buttons = el('div', ''); buttons.id = 'hud-buttons';
    buttons.append(btn('Inventário', 'btn small', () => this.showInventory()), btn('Criar', 'btn small', () => this.showCrafting()), btn('Pausa', 'btn small', () => this.showPause()), btn('Salvar', 'btn small', () => this.hooks.onSave()));
    const hotbar = el('div', ''); hotbar.id = 'hotbar';
    for (let i = 0; i < 9; i++) { const slot = el('div', 'slot'); slot.dataset.index = String(i); slot.append(el('span', 'key', String(i + 1)), el('span', 'icon', ''), el('span', 'count', '')); slot.addEventListener('click', () => this.hooks.onSelectSlot(i)); hotbar.append(slot); }
    const cross = el('div', '', '+'); cross.id = 'crosshair';
    hud.append(top, buttons, hotbar, cross);
    this.root.appendChild(hud);
    this.refreshHotbar();
  }
  refreshHotbar(): void {
    const inv = this.hooks.getInventory(); if (!inv) return;
    document.querySelectorAll('#hotbar .slot').forEach((s, i) => {
      const slot = inv.slots[i];
      const icon = s.querySelector('.icon'); const count = s.querySelector('.count');
      if (icon) icon.textContent = slot?.itemId ? itemDef(slot.itemId)?.icon ?? '📦' : '';
      if (count) count.textContent = slot?.itemId ? String(slot.count) : '';
      s.classList.toggle('selected', inv.selected === i);
    });
    const h = this.hooks.getHealth();
    const hp = document.getElementById('hp-bar'); if (hp) hp.style.width = h.health + '%';
    const hu = document.getElementById('hunger-bar'); if (hu) hu.style.width = h.hunger + '%';
    const ti = document.getElementById('time-indicator'); if (ti) ti.textContent = this.hooks.getTimeLabel();
  }
  showInventory(): void {
    const inv = this.hooks.getInventory(); if (!inv) return;
    if (document.getElementById('inventory-modal')) return;
    const bg = el('div', 'modal-bg'); bg.id = 'inventory-modal';
    const m = el('div', 'modal'); m.append(el('h2', '', t('inventory', this.lang())));
    const grid = el('div', 'inv-grid');
    let source: number | null = null;
    const hint = el('p', '', 'Arraste para mover • Shift + clique para dividir • Botão direito para descartar');
    m.append(hint);
    inv.slots.forEach((slot, i) => {
      const s = el('div', 'slot'); s.dataset.index = String(i);
      s.append(el('span', 'icon', slot.itemId ? itemDef(slot.itemId)?.icon ?? '📦' : ''), el('span', 'count', slot.itemId ? String(slot.count) : ''));
      s.title = slot.itemId ? itemDef(slot.itemId)?.name ?? '' : '';
      s.draggable = !!slot.itemId;
      s.addEventListener('dragstart', e => { (e as DragEvent).dataTransfer?.setData('text/plain', String(i)); });
      s.addEventListener('dragover', e => e.preventDefault());
      s.addEventListener('drop', e => { e.preventDefault(); const data = (e as DragEvent).dataTransfer?.getData('text/plain'); if (data) this.hooks.onMoveSlot(Number(data), i); bg.remove(); this.showInventory(); });
      s.addEventListener('click', e => {
        if (e.shiftKey && slot.itemId) { const to = inv.slots.findIndex(s => !s.itemId); if (to >= 0) inv.split(i, to); bg.remove(); this.showInventory(); return; }
        if (source !== null) { this.hooks.onMoveSlot(source, i); bg.remove(); this.showInventory(); return; }
        if (slot.itemId && !itemDef(slot.itemId)?.food) { source = i; s.classList.add('selected'); this.hooks.onSelectSlot(i); return; }
        const def = slot.itemId ? itemDef(slot.itemId) : undefined;
        if (def?.food) { this.hooks.onEat(slot.itemId!); }
        else if (slot.itemId) { this.hooks.onSelectSlot(i); }
        bg.remove(); this.showInventory();
      });
      s.addEventListener('contextmenu', e => { e.preventDefault(); this.hooks.onDiscard(i); bg.remove(); this.showInventory(); });
      grid.append(s);
    });
    m.append(grid);
    const row = el('div', ''); row.style.display = 'flex'; row.style.gap = '8px';
    row.append(btn(t('sort', this.lang()), 'btn small', () => { this.hooks.onSort(); bg.remove(); this.showInventory(); }), btn(t('close', this.lang()), 'btn small', () => bg.remove()));
    m.append(row); bg.append(m); this.root.appendChild(bg);
  }
  showCrafting(): void {
    const crafting = this.hooks.getCrafting(); if (!crafting) return;
    if (document.getElementById('crafting-modal')) return;
    const bg = el('div', 'modal-bg'); bg.id = 'crafting-modal';
    const m = el('div', 'modal'); m.append(el('h2', '', t('crafting', this.lang())));
    const tabs = el('div', 'tabs');
    const list = el('div', 'craft-list');
    const renderList = (cat?: string) => {
      list.innerHTML = '';
      for (const r of crafting.list(cat)) {
        const can = crafting.canCraft(r);
        const item = el('div', 'craft-item' + (can ? '' : ' cant'));
        const needs = r.ingredients.map(i => `${itemDef(i.itemId)?.name ?? i.itemId} ×${i.count}`).join(' + ') + (r.station ? ` • Requer ${r.station === 'furnace' ? 'fornalha' : 'bancada'} próxima` : '');
        item.append(el('span', '', `${itemDef(r.result.itemId)?.icon ?? ''} ${r.name} x${r.result.count}`), el('span', 'needs', needs));
        const b = btn('Criar', 'btn small', () => { const ok = this.hooks.onCraft(r.id); if (ok) { renderList(cat); this.refreshHotbar(); } });
        b.disabled = !can; item.append(b); list.append(item);
      }
    };
    tabs.append(btn('Todas', 'btn small active', () => renderList()));
    for (const c of crafting.categories()) tabs.append(btn(c, 'btn small', () => renderList(c)));
    m.append(tabs, list, btn(t('close', this.lang()), 'btn small', () => bg.remove()));
    bg.append(m); this.root.appendChild(bg); renderList();
  }
  showPause(): void {
    if (document.getElementById('pause-modal')) return;
    const bg = el('div', 'modal-bg'); bg.id = 'pause-modal';
    const m = el('div', 'modal'); m.append(el('h2', '', t('pause', this.lang())));
    const row = el('div', ''); row.style.display = 'flex'; row.style.flexDirection = 'column'; row.style.gap = '8px';
    row.append(btn(t('resume', this.lang()), 'btn', () => bg.remove()), btn(t('save', this.lang()), 'btn', () => this.hooks.onSave()), btn(t('settings', this.lang()), 'btn', () => { bg.remove(); this.showSettings(() => this.showPause()); }), btn(t('quitToMenu', this.lang()), 'btn danger', () => { bg.remove(); this.hooks.onQuit(); }));
    m.append(row); bg.append(m); this.root.appendChild(bg);
  }
  showDeath(): void {
    if (document.getElementById('death-modal')) return;
    const bg = el('div', 'modal-bg'); bg.id = 'death-modal';
    const m = el('div', 'modal'); m.append(el('h2', '', t('died', this.lang())));
    m.append(btn(t('respawn', this.lang()), 'btn primary', () => { bg.remove(); this.hooks.onRespawn(); }));
    bg.append(m); this.root.appendChild(bg);
  }
  showLoading(msg: string): void { this.clear(); const s = el('div', 'screen'); s.append(el('p', '', msg)); this.root.appendChild(s); }
  hideAll(): void { this.clear(); }
}
export { defaultSettings, defaultBindings };
