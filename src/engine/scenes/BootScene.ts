import Phaser from 'phaser';
import { createTileTextures } from '../../rendering/Renderer';
export class BootScene extends Phaser.Scene {
  constructor() { super('boot'); }
  create(): void {
    createTileTextures(this);
    this.scene.start('game', { deps: this.registry.get('deps') });
  }
}
