import { Goku } from "./characters/Goku";
import { Vegeta } from "./characters/Vegeta";
import { Broly } from "./characters/Broly";
import { Gohan } from "./characters/Gohan";
import { Piccolo } from "./characters/Piccolo";
import { Frieza } from "./characters/Frieza";
import { Trunks } from "./characters/Trunks";
import type { BattlefieldConfig, FighterConfig } from "./types";

export const fighterRoster: FighterConfig[] = [
  new Goku().toConfig(),
  new Vegeta().toConfig(),
  new Broly().toConfig(),
  new Gohan().toConfig(),
  new Piccolo().toConfig(),
  new Frieza().toConfig(),
  new Trunks().toConfig()
];

export const battlefields: BattlefieldConfig[] = [
  { id: "namek", name: "Planet Namek" },
  { id: "tournament", name: "Tournament of Power" }
];
