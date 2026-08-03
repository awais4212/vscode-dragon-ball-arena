"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broly = void 0;
const BaseFighter_1 = require("../BaseFighter");
class Broly extends BaseFighter_1.BaseFighter {
    constructor() {
        super(...arguments);
        this.id = "broly";
        this.name = "Broly";
        this.greeting = "RAAAAGH!";
        this.signatureAttack = "Gigantic Roar";
        this.attackStyle = "rush";
        this.power = 15000;
        this.speed = 72;
        this.defense = 90;
        this.criticalChance = 0.24;
        this.baseDamage = 25;
        this.nativeFacing = "right";
        this.scale = 1.18;
        this.palette = {
            skin: "#bd815d",
            hair: "#16171c",
            primary: "#6bd14b",
            secondary: "#5c2380",
            accent: "#d3e85b",
            aura: "#6cff45"
        };
    }
}
exports.Broly = Broly;
//# sourceMappingURL=Broly.js.map