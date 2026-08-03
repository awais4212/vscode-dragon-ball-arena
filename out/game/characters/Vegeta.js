"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vegeta = void 0;
const BaseFighter_1 = require("../BaseFighter");
class Vegeta extends BaseFighter_1.BaseFighter {
    constructor() {
        super(...arguments);
        this.id = "vegeta";
        this.name = "Vegeta";
        this.greeting = "The prince will not lose.";
        this.signatureAttack = "Final Flash";
        this.attackStyle = "beam";
        this.power = 9500;
        this.speed = 89;
        this.defense = 79;
        this.criticalChance = 0.2;
        this.baseDamage = 20;
        this.nativeFacing = "left";
        this.scale = 0.98;
        this.palette = {
            skin: "#e9aa78",
            hair: "#11121b",
            primary: "#1c39a7",
            secondary: "#f2f4f7",
            accent: "#e8be42",
            aura: "#9c70ff"
        };
    }
}
exports.Vegeta = Vegeta;
//# sourceMappingURL=Vegeta.js.map