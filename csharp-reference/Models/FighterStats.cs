namespace DragonBallArena.Models;

public sealed record FighterStats(
    int Power,
    int Speed,
    int Defense,
    double CriticalChance,
    int BaseDamage);
