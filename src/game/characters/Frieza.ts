import { BaseFighter } from "../BaseFighter";

export class Frieza extends BaseFighter {
  readonly id = "frieza" as const;
  readonly name = "Frieza";
  readonly greeting = "Try to entertain me.";
  readonly signatureAttack = "Death Beam";
  readonly attackStyle = "orb" as const;
  readonly power = 12000;
  readonly speed = 91;
  readonly defense = 82;
  readonly criticalChance = 0.23;
  readonly baseDamage = 22;
  readonly nativeFacing = "right" as const;
  readonly scale = 0.93;
  readonly palette = {
    skin: "#f2f0f5",
    hair: "#7136aa",
    primary: "#f2f0f5",
    secondary: "#743ab2",
    accent: "#bc8bf1",
    aura: "#d678ff"
  };
}
