"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
const Expresion_1 = require("./Expresion");
class Simbolo extends Expresion_1.Expresion {
    constructor(id, linea, columna) {
        super();
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    optimizarCodigo() {
        let antes = this.generarAugus();
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus() {
        return this.id;
    }
}
exports.Simbolo = Simbolo;
