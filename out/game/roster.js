"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.battlefields = exports.fighterRoster = void 0;
const Goku_1 = require("./characters/Goku");
const Vegeta_1 = require("./characters/Vegeta");
const Broly_1 = require("./characters/Broly");
const Gohan_1 = require("./characters/Gohan");
const Piccolo_1 = require("./characters/Piccolo");
const Frieza_1 = require("./characters/Frieza");
const Trunks_1 = require("./characters/Trunks");
exports.fighterRoster = [
    new Goku_1.Goku().toConfig(),
    new Vegeta_1.Vegeta().toConfig(),
    new Broly_1.Broly().toConfig(),
    new Gohan_1.Gohan().toConfig(),
    new Piccolo_1.Piccolo().toConfig(),
    new Frieza_1.Frieza().toConfig(),
    new Trunks_1.Trunks().toConfig()
];
exports.battlefields = [
    { id: "namek", name: "Planet Namek" },
    { id: "tournament", name: "Tournament of Power" }
];
//# sourceMappingURL=roster.js.map