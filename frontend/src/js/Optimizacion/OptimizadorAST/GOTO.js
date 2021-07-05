"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOTO = void 0;
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
const Instruccion_1 = require("./Instruccion");
class GOTO extends Instruccion_1.Instruccion {
    constructor(id, linea, columna) {
        super();
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.ast = null;
    }
    GOTO(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.ast = null;
    }
    optimizarCodigo(reporte) {
        let antes = this.generarAugus(reporte);
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus(reporte) {
        let codigoAugus = "goto " + this.id + ";\n";
        return codigoAugus;
    }
}
exports.GOTO = GOTO;
