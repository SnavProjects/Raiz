export interface Combatant { id: string; health: number; maxHealth: number; damage: number; }
export function attack(attacker: Combatant, target: Combatant, weaponBonus = 0): number {
  const dmg = Math.max(1, attacker.damage + weaponBonus);
  target.health = Math.max(0, target.health - dmg);
  return dmg;
}
export function isDead(c: Combatant): boolean { return c.health <= 0; }
export function weaponDamage(itemId: string | null): number {
  if (!itemId) return 1;
  if (itemId === 'sword_iron') return 12;
  if (itemId === 'sword_wood') return 5;
  if (itemId.startsWith('pickaxe')) return 3;
  if (itemId.startsWith('axe')) return 4;
  return 1;
}
