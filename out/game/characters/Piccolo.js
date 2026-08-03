"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piccolo = void 0;
const BaseFighter_1 = require("../BaseFighter");
class Piccolo extends BaseFighter_1.BaseFighter {
    constructor() {
        super(...arguments);
        this.id = "piccolo";
        this.name = "Piccolo";
        this.greeting = "Stay focused.";
        this.signatureAttack = "Special Beam Cannon";
        this.attackStyle = "spiral";
        this.power = 8000;
        this.speed = 78;
        this.defense = 88;
        this.criticalChance = 0.14;
        this.baseDamage = 18;
        this.nativeFacing = "right";
        this.scale = 1.03;
        this.palette = {
            skin: "#65b84c",
            hair: "#ffffff",
            primary: "#592b7d",
            secondary: "#f1f2ef",
            accent: "#d36ab0",
            aura: "#6cff74"
        };
    }
}
exports.Piccolo = Piccolo;
//# sourceMappingURL=Piccolo.js.map