using DragonBallArena.Models;

namespace DragonBallArena.Characters;

public sealed class Frieza(string? name = null) : BaseFighter(name)
{
    public override string Id => "frieza";
    public override string DisplayName => "Frieza";
    public override string Greeting => "Try to entertain me.";
    public override string SignatureAttack => "Death Beam";
    public override string AttackStyle => "orb";
    public override double Scale => 0.93;
    public override FighterStats Stats => new(12000, 91, 82, 0.23, 22);
    public override FighterPalette Palette => new(
        "#f2f0f5", "#7136aa", "#f2f0f5", "#743ab2", "#bc8bf1", "#d678ff");
}
