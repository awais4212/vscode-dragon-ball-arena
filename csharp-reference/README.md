# C# fighter models

These classes mirror the VSPets-style pattern: one base class and one class per
character. They contain stats, attack identity, scale, and drawing palette.

The running VS Code extension uses matching TypeScript classes because VS Code
extensions and their webviews execute JavaScript/TypeScript. The C# project is
included as a clean reference layer and can compile independently with .NET 8.
