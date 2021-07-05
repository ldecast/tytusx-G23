"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = void 0;
const Instruccion_1 = require("../OptimizadorAST/Instruccion");
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
class Call extends Instruccion_1.Instruccion {
    constructor(id) {
        super();
        this.id = id;
    }
    optimizarCodigo(reporte) {
        let antes = this.generarAugus(reporte);
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus(reporte) {
        let codigoAugus = this.id + "();\n";
        return codigoAugus;
    }
}
exports.Call = Call;
