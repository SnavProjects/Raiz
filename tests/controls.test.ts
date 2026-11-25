import { describe, it, expect } from 'vitest';
import { KeyboardControls } from '../src/controls/Controls';
import { t } from '../src/ui/i18n';
import { Palette, hexToRgb, lerpColor } from '../src/config/art/palette';
describe('Controls', () => {
  it('rebind funciona', () => { const k = new KeyboardControls(); k.rebind('jump', 'KeyW'); expect(k.bindings.jump).toBe('KeyW'); });
  it('serializa bindings', () => { const k = new KeyboardControls(); const s = k.serialize(); const k2 = new KeyboardControls(); k2.deserialize(s); expect(k2.bindings.left).toBe(s.left); });
});
describe('i18n', () => {
  it('pt-BR e en possuem chaves', () => { expect(t('newWorld', 'pt-BR')).toBe('Novo Mundo'); expect(t('newWorld', 'en')).toBe('New World'); });
  it('fallback para pt-BR', () => { expect(t('newWorld', 'xx')).toBe('Novo Mundo'); });
});
describe('Palette', () => {
  it('hexToRgb converte', () => { expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 }); });
  it('lerpColor interpola', () => { expect(lerpColor('#000000', '#ffffff', 0.5)).toBe('#808080'); });
  it('paleta possui famílias', () => { expect(Palette.vegetation.grassMid).toBeTruthy(); expect(Palette.ui.accent).toBeTruthy(); });
});
