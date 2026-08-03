import { BaseFighter } from "../BaseFighter";

export class Broly extends BaseFighter {
  readonly id = "broly" as const;
  readonly name = "Broly";
  readonly greeting = "RAAAAGH!";
  readonly signatureAttack = "Gigantic Roar";
  readonly attackStyle = "rush" as const;
  readonly power = 15000;
  readonly speed = 72;
  readonly defense = 90;
  readonly criticalChance = 0.24;
  readonly baseDamage = 25;
  readonly nativeFacing = "right" as const;
  readonly scale = 1.18;
  readonly palette = {
    skin: "#bd815d",
    hair: "#16171c",
    primary: "#6bd14b",
    secondary: "#5c2380",
    accent: "#d3e85b",
    aura: "#6cff45"
  };
}
