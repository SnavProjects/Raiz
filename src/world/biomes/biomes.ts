export type BiomeId = 'planicie' | 'floresta' | 'deserto' | 'umido' | 'montanha' | 'neve' | 'caverna';
export interface BiomeDef {
  id: BiomeId; name: string; grassColor: string; dirtColor: string; treeDensity: number; flowerDensity: number;
  surfaceTile: number; subTile: number; hostileChance: number; passiveChance: number;
}
export const BIOMES: Record<BiomeId, BiomeDef> = {
  planicie: { id: 'planicie', name: 'Planície', grassColor: '#7ec850', dirtColor: '#8b5a2b', treeDensity: 0.02, flowerDensity: 0.03, surfaceTile: 1, subTile: 2, hostileChance: 0.1, passiveChance: 0.5 },
  floresta: { id: 'floresta', name: 'Floresta', grassColor: '#5aa832', dirtColor: '#7a4a22', treeDensity: 0.08, flowerDensity: 0.02, surfaceTile: 1, subTile: 2, hostileChance: 0.15, passiveChance: 0.7 },
  deserto: { id: 'deserto', name: 'Deserto', grassColor: '#e8d48a', dirtColor: '#c8b060', treeDensity: 0.0, flowerDensity: 0.0, surfaceTile: 4, subTile: 4, hostileChance: 0.2, passiveChance: 0.05 },
  umido: { id: 'umido', name: 'Região Úmida', grassColor: '#4ab87a', dirtColor: '#6a4a2a', treeDensity: 0.05, flowerDensity: 0.05, surfaceTile: 1, subTile: 21, hostileChance: 0.1, passiveChance: 0.6 },
  montanha: { id: 'montanha', name: 'Montanha', grassColor: '#9ab87a', dirtColor: '#6a6a6a', treeDensity: 0.01, flowerDensity: 0.01, surfaceTile: 3, subTile: 3, hostileChance: 0.25, passiveChance: 0.2 },
  neve: { id: 'neve', name: 'Neve', grassColor: '#e8f4f8', dirtColor: '#8a8a9a', treeDensity: 0.03, flowerDensity: 0.0, surfaceTile: 20, subTile: 2, hostileChance: 0.3, passiveChance: 0.1 },
  caverna: { id: 'caverna', name: 'Caverna', grassColor: '#5a5a5a', dirtColor: '#3a3a3a', treeDensity: 0, flowerDensity: 0, surfaceTile: 3, subTile: 3, hostileChance: 0.5, passiveChance: 0.0 },
};
export function biomeAt(temp: number, humidity: number, height: number): BiomeId {
  if (height > 0.78) return 'neve';
  if (height > 0.62) return 'montanha';
  if (temp < 0.3 && humidity < 0.35) return 'deserto';
  if (humidity > 0.65) return 'umido';
  if (humidity > 0.45) return 'floresta';
  return 'planicie';
}
