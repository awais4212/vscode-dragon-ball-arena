import { BaseFighter } from "../BaseFighter";

export class Piccolo extends BaseFighter {
  readonly id = "piccolo" as const;
  readonly name = "Piccolo";
  readonly greeting = "Stay focused.";
  readonly signatureAttack = "Special Beam Cannon";
  readonly attackStyle = "spiral" as const;
  readonly power = 8000;
  readonly speed = 78;
  readonly defense = 88;
  readonly criticalChance = 0.14;
  readonly baseDamage = 18;
  readonly nativeFacing = "right" as const;
  readonly scale = 1.03;
  readonly palette = {
    skin: "#65b84c",
    hair: "#ffffff",
    primary: "#592b7d",
    secondary: "#f1f2ef",
    accent: "#d36ab0",
    aura: "#6cff74"
  };
}
