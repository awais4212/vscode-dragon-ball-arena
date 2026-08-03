import { BaseFighter } from "../BaseFighter";

export class Gohan extends BaseFighter {
  readonly id = "gohan" as const;
  readonly name = "Gohan";
  readonly greeting = "I won't let you hurt anyone.";
  readonly signatureAttack = "Masenko";
  readonly attackStyle = "orb" as const;
  readonly power = 10000;
  readonly speed = 86;
  readonly defense = 76;
  readonly criticalChance = 0.22;
  readonly baseDamage = 21;
  readonly nativeFacing = "right" as const;
  readonly scale = 0.98;
  readonly palette = {
    skin: "#efae7a",
    hair: "#17171c",
    primary: "#5d2b8c",
    secondary: "#32225f",
    accent: "#eecf4c",
    aura: "#ffe45a"
  };
}
