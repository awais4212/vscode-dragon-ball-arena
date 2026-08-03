using DragonBallArena.Models;

namespace DragonBallArena.Characters;

public sealed class Goku(string? name = null) : BaseFighter(name)
{
    public override string Id => "goku";
    public override string DisplayName => "Goku";
    public override string Greeting => "Let's make this a good fight!";
    public override string SignatureAttack => "Kamehameha";
    public override string AttackStyle => "beam";
    public override double Scale => 1.0;
    public override FighterStats Stats => new(9000, 92, 72, 0.18, 19);
    public override FighterPalette Palette => new(
        "#f2b07b", "#17171d", "#f47b20", "#173f8a", "#f4d34e", "#46d9ff");
}
