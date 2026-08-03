import { BaseFighter } from "../BaseFighter";

export class Vegeta extends BaseFighter {
  readonly id = "vegeta" as const;
  readonly name = "Vegeta";
  readonly greeting = "The prince will not lose.";
  readonly signatureAttack = "Final Flash";
  readonly attackStyle = "beam" as const;
  readonly power = 9500;
  readonly speed = 89;
  readonly defense = 79;
  readonly criticalChance = 0.2;
  readonly baseDamage = 20;
  readonly nativeFacing = "left" as const;
  readonly scale = 0.98;
  readonly palette = {
    skin: "#e9aa78",
    hair: "#11121b",
    primary: "#1c39a7",
    secondary: "#f2f4f7",
    accent: "#e8be42",
    aura: "#9c70ff"
  };
}
