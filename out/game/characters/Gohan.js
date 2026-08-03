"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gohan = void 0;
const BaseFighter_1 = require("../BaseFighter");
class Gohan extends BaseFighter_1.BaseFighter {
    constructor() {
        super(...arguments);
        this.id = "gohan";
        this.name = "Gohan";
        this.greeting = "I won't let you hurt anyone.";
        this.signatureAttack = "Masenko";
        this.attackStyle = "orb";
        this.power = 10000;
        this.speed = 86;
        this.defense = 76;
        this.criticalChance = 0.22;
        this.baseDamage = 21;
        this.nativeFacing = "right";
        this.scale = 0.98;
        this.palette = {
            skin: "#efae7a",
            hair: "#17171c",
            primary: "#5d2b8c",
            secondary: "#32225f",
            accent: "#eecf4c",
            aura: "#ffe45a"
        };
    }
}
exports.Gohan = Gohan;
//# sourceMappingURL=Gohan.js.map