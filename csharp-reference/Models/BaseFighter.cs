namespace DragonBallArena.Models;

/// <summary>
/// VSPets-style character definition. The VS Code runtime mirrors these values
/// in TypeScript because VS Code extensions execute JavaScript/TypeScript.
/// </summary>
public abstract class BaseFighter(string? name = null)
{
    public string Name { get; } = name ?? string.Empty;
    public abstract string Id { get; }
    public abstract string DisplayName { get; }
    public abstract string Greeting { get; }
    public abstract string SignatureAttack { get; }
    public abstract string AttackStyle { get; }
    public abstract double Scale { get; }
    public abstract FighterStats Stats { get; }
    public abstract FighterPalette Palette { get; }
}
