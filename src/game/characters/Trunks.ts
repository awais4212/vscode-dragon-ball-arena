import { BaseFighter } from "../BaseFighter";

export class Trunks extends BaseFighter {
  readonly id = "trunks" as const;
  readonly name = "Trunks";
  readonly greeting = "I will protect this future.";
  readonly signatureAttack = "Burning Attack";
  readonly attackStyle = "orb" as const;
  readonly power = 10500;
  readonly speed = 90;
  readonly defense = 77;
  readonly criticalChance = 0.22;
  readonly baseDamage = 21;
  readonly nativeFacing = "right" as const;
  readonly scale = 0.98;
  readonly palette = {
    skin: "#efae7a",
    hair: "#b58cff",
    primary: "#355fc4",
    secondary: "#202942",
    accent: "#f0d55b",
    aura: "#9fc8ff"
  };
}
