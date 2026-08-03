import { BaseFighter } from "../BaseFighter";

export class Goku extends BaseFighter {
  readonly id = "goku" as const;
  readonly name = "Goku";
  readonly greeting = "Let's make this a good fight!";
  readonly signatureAttack = "Kamehameha";
  readonly attackStyle = "beam" as const;
  readonly power = 9000;
  readonly speed = 92;
  readonly defense = 72;
  readonly criticalChance = 0.18;
  readonly baseDamage = 19;
  readonly nativeFacing = "right" as const;
  readonly scale = 1;
  readonly palette = {
    skin: "#f2b07b",
    hair: "#17171d",
    primary: "#f47b20",
    secondary: "#173f8a",
    accent: "#f4d34e",
    aura: "#46d9ff"
  };
}
