"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goku = void 0;
const BaseFighter_1 = require("../BaseFighter");
class Goku extends BaseFighter_1.BaseFighter {
    constructor() {
        super(...arguments);
        this.id = "goku";
        this.name = "Goku";
        this.greeting = "Let's make this a good fight!";
        this.signatureAttack = "Kamehameha";
        this.attackStyle = "beam";
        this.power = 9000;
        this.speed = 92;
        this.defense = 72;
        this.criticalChance = 0.18;
        this.baseDamage = 19;
        this.nativeFacing = "right";
        this.scale = 1;
        this.palette = {
            skin: "#f2b07b",
            hair: "#17171d",
            primary: "#f47b20",
            secondary: "#173f8a",
            accent: "#f4d34e",
            aura: "#46d9ff"
        };
    }
}
exports.Goku = Goku;
//# sourceMappingURL=Goku.js.map