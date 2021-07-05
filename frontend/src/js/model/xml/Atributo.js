"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atributo = void 0;
class Atributo {
    constructor(id, value, line, column) {
        this.id = id;
        this.value = value;
        this.line = line;
        this.column = column;
    }
    set Cst(value) {
        this.cst = value;
    }
    get Cst() {
        return this.cst;
    }
}
exports.Atributo = Atributo;
