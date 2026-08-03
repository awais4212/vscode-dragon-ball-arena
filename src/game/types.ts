export type FighterId =
  | "goku"
  | "vegeta"
  | "broly"
  | "gohan"
  | "piccolo"
  | "frieza"
  | "trunks";

export type AttackStyle = "beam" | "orb" | "spiral" | "rush";

export type NativeFacing = "left" | "right";

export interface FighterPalette {
  skin: string;
  hair: string;
  primary: string;
  secondary: string;
  accent: string;
  aura: string;
}

export interface FighterConfig {
  id: FighterId;
  name: string;
  greeting: string;
  signatureAttack: string;
  attackStyle: AttackStyle;
  power: number;
  speed: number;
  defense: number;
  criticalChance: number;
  baseDamage: number;
  scale: number;
  nativeFacing: NativeFacing;
  palette: FighterPalette;
}

export interface BattlefieldConfig {
  id: "namek" | "tournament";
  name: string;
}
