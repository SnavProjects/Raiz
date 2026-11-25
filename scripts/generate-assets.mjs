// Gera PNGs pixel-art originais (16x16) via encoder PNG puro — sem dependências.
import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1); } return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function png(w, h, rgba) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) { raw[y * (1 + w * 4)] = 0; rgba.copy(raw, y * (1 + w * 4) + 1, y * w * 4, (y + 1) * w * 4); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), 255]; }
function tile(color, accent) {
  const buf = Buffer.alloc(16 * 16 * 4);
  let s = 42; const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const c = rnd() < 0.15 ? accent : color;
    buf.set(c, (y * 16 + x) * 4);
  }
  return png(16, 16, buf);
}
mkdirSync('public/assets/tilesets', { recursive: true });
mkdirSync('public/assets/sprites/player', { recursive: true });
mkdirSync('public/assets/sprites/creatures', { recursive: true });
mkdirSync('public/assets/ui', { recursive: true });
const tiles = { grass: ['#5aa832', '#7ec850'], dirt: ['#8b5a2b', '#6b4220'], stone: ['#8a8a8a', '#5a5a5a'], sand: ['#e8d48a', '#c8b060'], water: ['#2a88c8', '#4ab8e8'], wood: ['#6b4220', '#4a2d14'], leaves: ['#5aa832', '#2d5a1a'], plank: ['#a87840', '#8b5a2b'] };
for (const [name, [c, a]] of Object.entries(tiles)) writeFileSync(`public/assets/tilesets/${name}.png`, tile(hex(c), hex(a)));
// sprite jogador 12x28
{
  const buf = Buffer.alloc(12 * 28 * 4);
  const set = (x, y, c) => { if (x >= 0 && x < 12 && y >= 0 && y < 28) buf.set(c, (y * 12 + x) * 4); };
  const skin = hex('#f0c8a0'), shirt = hex('#3a7a3a'), pants = hex('#4a3a6a'), hair = hex('#6b4220');
  for (let y = 0; y < 8; y++) for (let x = 2; x < 10; x++) set(x, y, y < 2 ? hair : skin);
  for (let y = 8; y < 18; y++) for (let x = 1; x < 11; x++) set(x, y, shirt);
  for (let y = 18; y < 28; y++) { for (let x = 2; x < 5; x++) set(x, y, pants); for (let x = 7; x < 10; x++) set(x, y, pants); }
  writeFileSync('public/assets/sprites/player/player.png', png(12, 28, buf));
}
{
  const buf = Buffer.alloc(16 * 16 * 4);
  const c = hex('#c8a878');
  for (let y = 6; y < 14; y++) for (let x = 2; x < 14; x++) buf.set(c, (y * 16 + x) * 4);
  for (let y = 2; y < 8; y++) for (let x = 4; x < 10; x++) buf.set(c, (y * 16 + x) * 4);
  writeFileSync('public/assets/sprites/creatures/passive.png', png(16, 16, buf));
}
console.log('Assets gerados em public/assets/');
