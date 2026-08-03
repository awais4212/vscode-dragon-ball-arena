import type { FighterConfig, FighterId, FighterPalette, AttackStyle, NativeFacing } from "./types";

export abstract class BaseFighter {
  abstract readonly id: FighterId;
  abstract readonly name: string;
  abstract readonly greeting: string;
  abstract readonly signatureAttack: string;
  abstract readonly attackStyle: AttackStyle;
  abstract readonly power: number;
  abstract readonly speed: number;
  abstract readonly defense: number;
  abstract readonly criticalChance: number;
  abstract readonly baseDamage: number;
  abstract readonly scale: number;
  abstract readonly nativeFacing: NativeFacing;
  abstract readonly palette: FighterPalette;

  toConfig(): FighterConfig {
    return {
      id: this.id,
      name: this.name,
      greeting: this.greeting,
      signatureAttack: this.signatureAttack,
      attackStyle: this.attackStyle,
      power: this.power,
      speed: this.speed,
      defense: this.defense,
      criticalChance: this.criticalChance,
      baseDamage: this.baseDamage,
      scale: this.scale,
      nativeFacing: this.nativeFacing,
      palette: this.palette
    };
  }
}
