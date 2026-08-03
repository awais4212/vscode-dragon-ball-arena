"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frieza = void 0;
const BaseFighter_1 = require("../BaseFighter");
class Frieza extends BaseFighter_1.BaseFighter {
    constructor() {
        super(...arguments);
        this.id = "frieza";
        this.name = "Frieza";
        this.greeting = "Try to entertain me.";
        this.signatureAttack = "Death Beam";
        this.attackStyle = "orb";
        this.power = 12000;
        this.speed = 91;
        this.defense = 82;
        this.criticalChance = 0.23;
        this.baseDamage = 22;
        this.nativeFacing = "right";
        this.scale = 0.93;
        this.palette = {
            skin: "#f2f0f5",
            hair: "#7136aa",
            primary: "#f2f0f5",
            secondary: "#743ab2",
            accent: "#bc8bf1",
            aura: "#d678ff"
        };
    }
}
exports.Frieza = Frieza;
//# sourceMappingURL=Frieza.js.map