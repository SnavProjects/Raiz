import Phaser from 'phaser';
export class MenuScene extends Phaser.Scene {
  constructor() { super('menu'); }
  create(): void {
    this.cameras.main.setBackgroundColor('#101a10');
    this.add.text(640, 300, 'RAIZ', { fontSize: '64px', color: '#7ec850' }).setOrigin(0.5);
    this.add.text(640, 360, 'Sandbox Survival', { fontSize: '20px', color: '#e8f0e0' }).setOrigin(0.5);
  }
}
