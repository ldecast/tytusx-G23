"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Expresion_1 = require("../OptimizadorAST/Expresion");
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
class Primitivo extends Expresion_1.Expresion {
    constructor(valor) {
        super();
        this.valor = valor;
    }
    optimizarCodigo() {
        let antes = this.generarAugus();
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus() {
        return "" + this.valor;
    }
}
exports.Primitivo = Primitivo;
