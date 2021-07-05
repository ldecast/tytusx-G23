"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exit = void 0;
const Instruccion_1 = require("../OptimizadorAST/Instruccion");
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
class Exit extends Instruccion_1.Instruccion {
    constructor() {
        super();
    }
    optimizarCodigo(reporte) {
        let antes = this.generarAugus(reporte);
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus(reporte) {
        let codigoAugus = "return;\n";
        return codigoAugus;
    }
}
exports.Exit = Exit;
