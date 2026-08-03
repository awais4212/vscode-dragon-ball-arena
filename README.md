# Dragon Ball Arena — Final Detailed Animated Edition

This build replaces the blocky placeholder characters with detailed fighter artwork and keeps the game inside the compact VS Code Explorer sidebar.

## Included

- Detailed Goku and Vegeta fighter artwork matching the supplied Tournament of Power reference
- No PNG character files: Goku and Vegeta use transparent WebP; the remaining fighters use SVG
- Embedded sprite data, so VS Code cannot fall back to the old block-character renderer because of a delayed local asset request
- Goku, Vegeta, Gohan, Broly, Piccolo, and Frieza selections
- Tournament of Power and Planet Namek battlefields
- Idle breathing and floating
- Animated aura charging and particles
- Smooth dash/lunge with motion trails
- Kamehameha, Final Flash, Masenko, Special Beam Cannon, Death Beam, and rush effects
- Dodges, critical hits, impact flashes, shockwaves, screen shake, HP bars, rounds, KO, and victory animation
- Fight, Random, Reset, and battle log controls
- Precompiled `out` directory for immediate F5 testing
- C# fighter-class references in `csharp-reference`

## Run

1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Press `F5`.
4. In the Extension Development Host, open **Explorer**.
5. Expand **Dragon Ball Arena — Detailed Animated Edition**.
6. Choose the fighters and battlefield, then press **Fight!**

VS Code extensions and webviews execute TypeScript/JavaScript. The C# files are reference models that mirror the fighter-class architecture.

## Facing fix

Every fighter now uses explicit native-facing metadata. The renderer mirrors each sprite only when needed, so the left fighter looks right and the right fighter looks left during idle, charge, dash, attack, hit, KO, and victory animations.


Update: Piccolo, Broly, Frieza, and Gohan now use the exact appearance PNG sprites derived from the approved reference artwork.
