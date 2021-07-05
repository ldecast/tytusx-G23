"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Operacion_1 = require("./Operacion");
const Instruccion_1 = require("../OptimizadorAST/Instruccion");
const OptimizacionResultado_1 = require("../Reporte/OptimizacionResultado");
const OPtimizacion_1 = require("../Reporte/OPtimizacion");
class Asignacion extends Instruccion_1.Instruccion {
    constructor(id, valor, linea, columna) {
        super();
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.valor = valor;
        this.instruccionPrevia = null;
    }
    optimizarCodigo(reporte) {
        let antes = this.generarAugus(reporte);
        let resultado = new OptimizacionResultado_1.OptimizacionResultado();
        resultado.codigo = antes;
        return resultado;
    }
    generarAugus(reporte) {
        let codigoAugus = this.id + " = " + this.valor.generarAugus() + ";\n";
        let optimizacion = new OPtimizacion_1.OPtimizacion();
        optimizacion.linea = "" + (this.linea + 1);
        optimizacion.antes = codigoAugus;
        optimizacion.tipo = "Mirilla - Simplificación algebraica y por fuerza";
        if (this.valor.tipo == Operacion_1.TIPO_OPERACION.SUMA) {
            if (this.valor.validarRegla8(this.id)) {
                optimizacion.regla = "Regla 6";
                optimizacion.despues = "";
                reporte.agregarOpt(optimizacion);
                return "";
            }
            else if (this.valor.validarRegla12() != "") {
                codigoAugus = this.id + " = " + this.valor.validarRegla12() + ";\n";
                optimizacion.regla = "Regla 10";
                optimizacion.despues = codigoAugus;
                reporte.agregarOpt(optimizacion);
            }
        }
        else if (this.valor.tipo == Operacion_1.TIPO_OPERACION.RESTA) {
            if (this.valor.validarRegla9(this.id)) {
                optimizacion.regla = "Regla 7";
                optimizacion.despues = "";
                reporte.agregarOpt(optimizacion);
                return "";
            }
            else if (this.valor.validarRegla13() != "") {
                codigoAugus = this.id + " = " + this.valor.validarRegla13() + ";\n";
                optimizacion.regla = "Regla 11";
                optimizacion.despues = codigoAugus;
                reporte.agregarOpt(optimizacion);
            }
        }
        else if (this.valor.tipo == Operacion_1.TIPO_OPERACION.MULTIPLICACION) {
            if (this.valor.validarRegla10(this.id)) {
                optimizacion.regla = "Regla 8";
                optimizacion.despues = "";
                reporte.agregarOpt(optimizacion);
                return "";
            }
            else if (this.valor.validarRegla14() != "") {
                codigoAugus = this.id + " = " + this.valor.validarRegla14() + ";\n";
                optimizacion.regla = "Regla 12";
                optimizacion.despues = codigoAugus;
                reporte.agregarOpt(optimizacion);
            }
            else if (this.valor.validarRegla16() != "") {
                codigoAugus = this.id + " = " + this.valor.validarRegla16() + ";\n";
                optimizacion.regla = "Regla 14";
                optimizacion.despues = codigoAugus;
                reporte.agregarOpt(optimizacion);
            }
            else if (this.valor.validarRegla17() == "") {
                codigoAugus = this.id + " = " + this.valor.validarRegla17() + ";\n";
                optimizacion.regla = "Regla 15";
                optimizacion.despues = codigoAugus;
                reporte.agregarOpt(optimizacion);
            }
        }
        else if (this.valor.tipo == Operacion_1.TIPO_OPERACION.DIVISION) {
            if (this.valor.validarRegla11(this.id)) {
                optimizacion.regla = "Regla 9";
                optimizacion.despues = "";
                reporte.agregarOpt(optimizacion);
                return "";
            }
            else if (this.valor.validarRegla15() != "") {
                codigoAugus = this.id + " = " + this.valor.validarRegla15() + ";\n";
                optimizacion.regla = "Regla 13";
                optimizacion.despues = codigoAugus;
                reporte.agregarOpt(optimizacion);
            }
            else if (this.valor.validarRegla18() != "") {
                codigoAugus = this.id + " = " + this.valor.validarRegla18() + ";\n";
                optimizacion.regla = "Regla 16";
                optimizacion.despues = codigoAugus;
                reporte.agregarOpt(optimizacion);
            }
        }
        else if (this.valor.tipo == Operacion_1.TIPO_OPERACION.ID) {
            codigoAugus = this.id + " = " + this.valor.generarAugus() + ";\n";
            if (this.instruccionPrevia != null) {
                if (this.instruccionPrevia.valor.tipo == Operacion_1.TIPO_OPERACION.ID) {
                    //MI REGLA 5 Revisar estas reglas en caso de...
                    let varA = this.id;
                    let varB = this.instruccionPrevia.id;
                    if (this.valor.validarRegla1(varA, this.valor.valor, varB, this.instruccionPrevia.valor.valor)) {
                        optimizacion.tipo = "Mirilla - Eliminación de Instrucciones Redundantes y de Almacenamiento";
                        optimizacion.regla = "Regla 5";
                        optimizacion.despues = "";
                        reporte.agregarOpt(optimizacion);
                        return "";
                    }
                }
            }
        }
        else
            codigoAugus = this.id + " = " + this.valor.generarAugus() + ";\n";
        return codigoAugus;
    }
}
exports.Asignacion = Asignacion;
