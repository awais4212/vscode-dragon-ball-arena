using DragonBallArena.Models;

namespace DragonBallArena.Characters;

public sealed class Vegeta(string? name = null) : BaseFighter(name)
{
    public override string Id => "vegeta";
    public override string DisplayName => "Vegeta";
    public override string Greeting => "The prince will not lose.";
    public override string SignatureAttack => "Final Flash";
    public override string AttackStyle => "beam";
    public override double Scale => 0.98;
    public override FighterStats Stats => new(9500, 89, 79, 0.20, 20);
    public override FighterPalette Palette => new(
        "#e9aa78", "#11121b", "#1c39a7", "#f2f4f7", "#e8be42", "#9c70ff");
}
