"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trunks = void 0;
const BaseFighter_1 = require("../BaseFighter");
class Trunks extends BaseFighter_1.BaseFighter {
    constructor() {
        super(...arguments);
        this.id = "trunks";
        this.name = "Trunks";
        this.greeting = "I will protect this future.";
        this.signatureAttack = "Burning Attack";
        this.attackStyle = "orb";
        this.power = 10500;
        this.speed = 90;
        this.defense = 77;
        this.criticalChance = 0.22;
        this.baseDamage = 21;
        this.nativeFacing = "right";
        this.scale = 0.98;
        this.palette = {
            skin: "#efae7a",
            hair: "#b58cff",
            primary: "#355fc4",
            secondary: "#202942",
            accent: "#f0d55b",
            aura: "#9fc8ff"
        };
    }
}
exports.Trunks = Trunks;
//# sourceMappingURL=Trunks.js.map