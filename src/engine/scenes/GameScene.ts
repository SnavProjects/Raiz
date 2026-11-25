import Phaser from 'phaser';
import { World } from '../../world/World';
import { Player } from '../../player/Player';
import { DayNightCycle } from '../../world/DayNightCycle';
import { EntityManager } from '../../entities/Entities';
import { Building } from '../../systems/building/Building';
import { Interaction } from '../../systems/interaction/Interaction';
import { KeyboardControls, TouchControls } from '../../controls/Controls';
import { tileTextureKey } from '../../rendering/Renderer';
import { tileDef, TileId } from '../../world/tiles/tiles';
import { audio } from '../../audio/AudioSystem';
import { eventBus } from '../../core/EventBus';
import { itemDef } from '../../systems/inventory/items';
import { weaponDamage } from '../../systems/combat/Combat';
import { GameConfig } from '../../config/GameConfig';

export interface GameSceneDeps {
  world: World; player: Player; cycle: DayNightCycle; entities: EntityManager;
  keyboard: KeyboardControls; touch: TouchControls | null;
  onSave: () => void; onQuit: () => void; onDeath: () => void;
}
export class GameScene extends Phaser.Scene {
  deps!: GameSceneDeps;
  private playerSprite!: Phaser.GameObjects.Image;
  private tileLayer = new Map<string, Phaser.GameObjects.Image>();
  private entityLayer = new Map<string, Phaser.GameObjects.Image>();
  private darkness!: Phaser.GameObjects.Rectangle;
  private target!: Phaser.GameObjects.Rectangle;
  private mineProgress = 0; private lastMineTile = '';
  private autosaveTimer = 0; private attackTimer = 0; private hurtTimer = 0;
  constructor() { super('game'); }
  init(data: { deps: GameSceneDeps }): void { this.deps = data.deps; }
  create(): void {
    const { player } = this.deps;
    this.cameras.main.setBackgroundColor('#7ec8f0').setZoom(2);
    this.playerSprite = this.add.image(player.x + 6, player.y + 14, 'player').setDepth(10);
    this.darkness = this.add.rectangle(0, 0, 1, 1, 0x0a1428, 0).setOrigin(0).setDepth(20);
    this.target = this.add.rectangle(0, 0, 16, 16).setStrokeStyle(1, 0xe6e9b0).setDepth(21);
    this.cameras.main.startFollow(this.playerSprite, true, 0.15, 0.15);
    const offDeath = eventBus.on('player-died', () => this.deps.onDeath());
    this.events.once('shutdown', offDeath);
    audio.startMusic();
    if (player.survival.health <= 0) this.deps.onDeath();
    document.querySelector('#game-container canvas')?.setAttribute('data-ready', 'true');
  }
  private actAt(x: number, y: number, mining: boolean, building: boolean, dt: number): void {
    const { world, player, entities } = this.deps;
    if (Math.hypot(x * 16 + 8 - player.x - 6, y * 16 + 8 - player.y - 14) > 96) {
      this.mineProgress = 0; this.target.setVisible(false); return;
    }
    this.target.setVisible(true).setPosition(x * 16 + 8, y * 16 + 8);
    if (mining) {
      const victim = entities.entities.find(e => Math.hypot(e.x - x * 16, e.y - y * 16) < 24);
      if (victim && this.attackTimer <= 0) {
        if (entities.damage(victim.id, weaponDamage(player.inventory.selectedItem()))) player.inventory.add('meat', 1);
        this.attackTimer = 0.35; audio.playSfx('hurt'); return;
      }
      const key = x + ',' + y;
      if (key !== this.lastMineTile) { this.lastMineTile = key; this.mineProgress = 0; }
      this.mineProgress += dt;
      if (this.mineProgress >= tileDef(world.getTile(x, y)).hardness) {
        const res = new Interaction(world).interact(x, y, player.inventory.bestToolTier());
        if (res.kind === 'mine') { for (const d of res.drops) player.inventory.add(d.itemId, d.count); audio.playSfx('mine'); }
        this.mineProgress = 0;
      }
    } else {
      this.mineProgress = 0;
      // Não permita construir dentro da hitbox do jogador.
      const overlaps = x * 16 < player.x + 12 && (x + 1) * 16 > player.x && y * 16 < player.y + 28 && (y + 1) * 16 > player.y;
      const selected = player.inventory.selectedItem();
      if (building && !overlaps && selected && itemDef(selected)?.placeableTile) {
        if (new Building(world, player.inventory).place(x, y, selected)) audio.playSfx('place');
      }
    }
  }
  override update(_time: number, delta: number): void {
    if (!this.deps) return;
    // Menus bloqueiam tanto simulação quanto ações no mundo.
    if (document.querySelector('.modal-bg, #settings') || this.deps.player.survival.dead) { this.target.setVisible(false); return; }
    const dt = Math.min(delta / 1000, 0.05);
    const { world, player, cycle, entities, keyboard, touch } = this.deps;
    cycle.update(dt * 1000);
    world.ensureAround(player.tileX, player.tileY);
    const kb = keyboard.state();
    player.update(dt, { left: kb.left || !!touch?.state.left, right: kb.right || !!touch?.state.right, jump: kb.jump || !!touch?.state.jump });
    entities.update(player.x, player.y, dt);
    this.attackTimer -= dt; this.hurtTimer -= dt;
    if (this.hurtTimer <= 0 && entities.entities.some(e => e.kind === 'hostile' && Math.hypot(e.x - player.x, e.y - player.y) < 24)) {
      player.survival.damage(8); this.hurtTimer = 1; audio.playSfx('hurt');
    }
    this.playerSprite.setPosition(player.x + 6, player.y + 14).setFlipX(player.facing === -1);
    const pointer = this.input.activePointer;
    const overCanvas = pointer.event?.target instanceof HTMLCanvasElement;
    if (touch?.mineHeld || touch?.buildHeld) {
      this.actAt(Math.floor((player.x + 6 + player.facing * 24) / 16), Math.floor((player.y + 20) / 16), touch.mineHeld, touch.buildHeld, dt);
    } else if (overCanvas && pointer.isDown) {
      const pos = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.actAt(Math.floor(pos.x / 16), Math.floor(pos.y / 16), pointer.leftButtonDown(), pointer.rightButtonDown(), dt);
    } else { this.mineProgress = 0; this.target.setVisible(false); }
    this.renderVisibleTiles();
    this.renderEntities();
    const view = this.cameras.main.worldView;
    this.darkness.setPosition(view.x - 32, view.y - 32).setSize(view.width + 64, view.height + 64).setAlpha(cycle.darkness * 0.75);
    this.autosaveTimer += dt * 1000;
    if (this.autosaveTimer > GameConfig.autosaveIntervalMs) { this.autosaveTimer = 0; this.deps.onSave(); }
    if (touch?.consumeInteract()) {
      const station = new Interaction(world).useStation(Math.floor((player.x + player.facing * 20) / 16), Math.floor((player.y + 10) / 16));
      if (station) eventBus.emit({ type: 'toast', message: 'Estação: ' + station });
    }
  }
  private renderEntities(): void {
    const seen = new Set<string>();
    for (const e of this.deps.entities.entities) {
      if (!e.active) continue;
      seen.add(e.id);
      let image = this.entityLayer.get(e.id);
      if (!image) { image = this.add.image(e.x + 8, e.y + 8, 'entity').setDepth(9); this.entityLayer.set(e.id, image); }
      image.setPosition(e.x + 8, e.y + 8).setFlipX(e.vx < 0).setTint(e.kind === 'hostile' ? 0xd278b8 : 0xffffff);
    }
    for (const [key, image] of this.entityLayer) if (!seen.has(key)) { image.destroy(); this.entityLayer.delete(key); }
  }
  private renderVisibleTiles(): void {
    const { world } = this.deps;
    const view = this.cameras.main.worldView;
    const x0 = Math.floor(view.x / 16) - 2; const x1 = Math.ceil(view.right / 16) + 2;
    const y0 = Math.floor(view.y / 16) - 2; const y1 = Math.ceil(view.bottom / 16) + 2;
    const seen = new Set<string>();
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      for (const background of [true, false]) {
        const id = background ? world.getBgTile(x, y) : world.getTile(x, y);
        if (id === TileId.Air) continue;
        const key = `${x},${y},${background}`; seen.add(key);
        let image = this.tileLayer.get(key);
        if (!image) {
          image = this.add.image(x * 16 + 8, y * 16 + 8, tileTextureKey(id)).setDepth(background ? 0 : 1);
          if (background) image.setTint(0x626267);
          this.tileLayer.set(key, image);
        } else if (image.texture.key !== tileTextureKey(id)) image.setTexture(tileTextureKey(id));
      }
    }
    for (const [key, image] of this.tileLayer) if (!seen.has(key)) { image.destroy(); this.tileLayer.delete(key); }
  }
}
