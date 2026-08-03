"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFighter = void 0;
class BaseFighter {
    toConfig() {
        return {
            id: this.id,
            name: this.name,
            greeting: this.greeting,
            signatureAttack: this.signatureAttack,
            attackStyle: this.attackStyle,
            power: this.power,
            speed: this.speed,
            defense: this.defense,
            criticalChance: this.criticalChance,
            baseDamage: this.baseDamage,
            scale: this.scale,
            nativeFacing: this.nativeFacing,
            palette: this.palette
        };
    }
}
exports.BaseFighter = BaseFighter;
//# sourceMappingURL=BaseFighter.js.map