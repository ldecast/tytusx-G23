"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const Temporal_1 = require("./Temporal");
class Result {
    constructor() {
        this.codigo3d = "";
        this.temporal = new Temporal_1.Temporal(null);
        this.tipo = null;
    }
}
exports.Result = Result;
