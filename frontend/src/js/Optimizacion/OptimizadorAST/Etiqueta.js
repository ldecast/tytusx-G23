"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Etiqueta = void 0;
const Instruccion_1 = require("../OptimizadorAST/Instruccion");
const Asignacion_1 = require("../OptimizadorValorImplicito/Asignacion");
const OPtimizacion_1 = require("../Reporte/OPtimizacion");
const GOTO_1 = require("./GOTO");
const If_1 = require("../OptimizadorCondicional/If");
class Etiqueta extends Instruccion_1.Instruccion {
    constructor(id, instrucciones, linea, columna) {
        super();
        this.id = id;
        this.instrucciones = instrucciones;
        this.linea = linea;
        this.columna = columna;
        this.codigoOptimizado = "";
        this.imprimirEtiqueta = true;
    }
    traducirCodigo(reporte, ast, instrucciones, aplicaBloque) {
        let contador = 0;
        let codigoOptimizado = "";
        let instruccionAnterior;
        let asignacionPrevia;
        let codigoAnterior = "";
        for (let Element of instrucciones) {
            if (Element instanceof Asignacion_1.Asignacion) {
                let asig = Element;
                asig.instruccionPrevia = asignacionPrevia;
                asignacionPrevia = Element;
            }
            else if (Element instanceof GOTO_1.GOTO) {
                let insgoto = Element;
                insgoto.ast = ast;
            }
            else if (Element instanceof If_1.If) {
                let insif = Element;
                for (let i = contador + 1; i < this.instrucciones.length; i++) {
                    insif.instrucciones.push(this.instrucciones[i]);
                }
            }
            let optimizado = "";
            if (Element instanceof If_1.If) {
                let insif = Element;
                insif.ast = ast; //necesario antes de optimizar cada if
                optimizado = insif.optimizarCodigo(reporte).codigo;
            }
            else {
                if (instruccionAnterior instanceof If_1.If && Element instanceof GOTO_1.GOTO) {
                    let antif = instruccionAnterior;
                    if (!antif.seAplicoRegla3)
                        optimizado = Element.optimizarCodigo(reporte).codigo;
                }
                else
                    optimizado = Element.optimizarCodigo(reporte).codigo;
            }
            //Regla 2 Mirilla
            if (Element instanceof GOTO_1.GOTO) {
                if (codigoAnterior.startsWith("goto")) {
                    if (instruccionAnterior instanceof If_1.If) {
                        codigoAnterior = "";
                        continue;
                    }
                }
                let insgoto = Element;
                if (ast.existeEtiqueta(insgoto.id)) {
                    if (optimizado != "") {
                        codigoOptimizado += "   " + optimizado;
                        codigoAnterior = optimizado;
                    }
                    if ((contador + 1) == this.instrucciones.length)
                        continue; //si no existen mas instrucciones no hay optimizacion
                    let optimizacion = new OPtimizacion_1.OPtimizacion(); //si hay optimizacion
                    optimizacion.linea = "" + (insgoto.linea + 1);
                    let codigoOptimizar = "";
                    for (let i = contador + 1; i < this.instrucciones.length; i++) {
                        let instruccion = this.instrucciones[i];
                        if (instruccion instanceof GOTO_1.GOTO) {
                            let mygoto = instruccion;
                            mygoto.ast = ast;
                        }
                        else if (instruccion instanceof If_1.If)
                            continue;
                        codigoOptimizar += instruccion.optimizarCodigo(reporte).codigo;
                    }
                    optimizacion.antes = codigoOptimizar;
                    optimizacion.despues = insgoto.id + ":\n";
                    optimizacion.regla = "Regla 1";
                    optimizacion.tipo = "Mirilla - Eliminación de Código Inalcanzable";
                    reporte.agregarOpt(optimizacion);
                    codigoAnterior = "";
                    break;
                }
                else {
                    if (optimizado != "") {
                        codigoOptimizado += "   " + optimizado;
                        codigoAnterior = optimizado;
                    }
                }
            }
            else {
                if (optimizado != "") {
                    codigoOptimizado += "   " + optimizado;
                    codigoAnterior = optimizado;
                }
            }
            instruccionAnterior = Element;
            contador++;
        }
        //(Instruccion ins in instrucciones) 
        return codigoOptimizado;
    }
    optimizarCodigoo(reporte, ast, aplicaBloque = false) {
        this.codigoOptimizado = "";
        if (this.imprimirEtiqueta)
            this.codigoOptimizado += this.id + ":\n";
        let strResultado = this.traducirCodigo(reporte, ast, this.instrucciones, aplicaBloque);
        this.codigoOptimizado += strResultado;
        return this.codigoOptimizado;
    }
    optimizarCodigo(reporte) {
        return null;
    }
    generarAugus(reporte) {
        return "";
    }
}
exports.Etiqueta = Etiqueta;
