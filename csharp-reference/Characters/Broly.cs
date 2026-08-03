using DragonBallArena.Models;

namespace DragonBallArena.Characters;

public sealed class Broly(string? name = null) : BaseFighter(name)
{
    public override string Id => "broly";
    public override string DisplayName => "Broly";
    public override string Greeting => "RAAAAGH!";
    public override string SignatureAttack => "Gigantic Roar";
    public override string AttackStyle => "rush";
    public override double Scale => 1.18;
    public override FighterStats Stats => new(15000, 72, 90, 0.24, 25);
    public override FighterPalette Palette => new(
        "#bd815d", "#16171c", "#6bd14b", "#5c2380", "#d3e85b", "#6cff45");
}
