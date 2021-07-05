"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
class Variable {
    constructor(_id, _tipo, _linea, _columna, _entorno) {
        this.id = _id;
        this.tipo = _tipo;
        this.linea = _linea ? _linea : 1;
        this.columna = _columna ? _columna : 1;
        this.entorno = _entorno ? _entorno : "global";
    }
    setValue(_obj) {
        if (_obj.constructor.name === "Contexto") {
            this.contexto = _obj;
        }
        else {
            this.valor = _obj;
        }
    }
}
exports.Variable = Variable;
