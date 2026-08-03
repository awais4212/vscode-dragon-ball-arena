using DragonBallArena.Models;

namespace DragonBallArena.Characters;

public sealed class Piccolo(string? name = null) : BaseFighter(name)
{
    public override string Id => "piccolo";
    public override string DisplayName => "Piccolo";
    public override string Greeting => "Stay focused.";
    public override string SignatureAttack => "Special Beam Cannon";
    public override string AttackStyle => "spiral";
    public override double Scale => 1.03;
    public override FighterStats Stats => new(8000, 78, 88, 0.14, 18);
    public override FighterPalette Palette => new(
        "#65b84c", "#ffffff", "#592b7d", "#f1f2ef", "#d36ab0", "#6cff74");
}
