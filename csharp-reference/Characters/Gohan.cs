using DragonBallArena.Models;

namespace DragonBallArena.Characters;

public sealed class Gohan(string? name = null) : BaseFighter(name)
{
    public override string Id => "gohan";
    public override string DisplayName => "Gohan";
    public override string Greeting => "I won't let you hurt anyone.";
    public override string SignatureAttack => "Masenko";
    public override string AttackStyle => "orb";
    public override double Scale => 0.98;
    public override FighterStats Stats => new(10000, 86, 76, 0.22, 21);
    public override FighterPalette Palette => new(
        "#efae7a", "#17171c", "#5d2b8c", "#32225f", "#eecf4c", "#ffe45a");
}
