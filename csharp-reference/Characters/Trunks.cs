using DragonBallArena.Characters.Models;

namespace DragonBallArena.Characters.Characters;

public sealed class Trunks : BaseFighter
{
    public override string Id => "trunks";
    public override string Name => "Trunks";
    public override string SignatureAttack => "Burning Attack";
    public override FighterStats Stats => new(10500, 90, 77, 0.22, 21);
    public override FighterPalette Palette => new(
        Skin: "#efae7a",
        Hair: "#b58cff",
        Primary: "#355fc4",
        Secondary: "#202942",
        Accent: "#f0d55b",
        Aura: "#9fc8ff");
}
