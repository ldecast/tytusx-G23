"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Imprimir = void 0;
const Instruccion_1 = require("../OptimizadorAST/Instruccion");
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
class Imprimir extends Instruccion_1.Instruccion {
    constructor(cad, cadena, linea, columna) {
        super();
        this.cad = cad;
        this.cadena = cadena;
        this.linea = linea;
        this.columna = columna;
    }
    optimizarCodigo(reporte) {
        let antes = this.generarAugus(reporte);
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus(reporte) {
        let codigoAugus = "printf(" + this.cadena + "," + this.cad.generarAugus() + ");\n";
        return codigoAugus;
    }
}
exports.Imprimir = Imprimir;
