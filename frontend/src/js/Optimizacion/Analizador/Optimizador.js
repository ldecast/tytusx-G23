"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimizador = void 0;
const ReporteOptimizacion_1 = require("../Reporte/ReporteOptimizacion");
const GeneradorOptiAST_1 = require("./GeneradorOptiAST");
const AST_1 = require("../OptimizadorAST/AST");
class Optimizador {
    constructor() {
        this.instrucciones = new Array();
        this.reporte = new ReporteOptimizacion_1.ReporteOptimizacion();
        this.codigoOptimizado = "";
        this.codigoAnterior = "";
    }
    inicializar() {
        this.reporte = new ReporteOptimizacion_1.ReporteOptimizacion();
        this.codigoOptimizado = "";
        this.codigoAnterior = "";
        this.instrucciones = new Array();
    }
    optimizar(texto, arbol, aplicaBloques = false) {
        let codFuncion = ""; //mi variable
        let codInstrucciones = ""; //mi variable
        this.codigoAnterior = texto;
        this.codigoOptimizado = "";
        let migenerador = new GeneradorOptiAST_1.GeneradorOptiAST(arbol);
        let funciones = migenerador.funciones;
        this.codigoOptimizado += migenerador.head;
        for (let a = 0; a < funciones.length; a++) {
            codInstrucciones = "";
            let instrucciones = funciones[a].instrucciones;
            this.instrucciones = instrucciones;
            let ast = new AST_1.AST(this.instrucciones);
            //PRIMERA PASADA: PARA GUARDAR TODAS LAS ETIQUETAS
            if (instrucciones != null) {
                for (let i = 0; i < instrucciones.length; i++) {
                    ast.agregarEtiqueta(instrucciones[i]);
                }
            }
            //SEGUNDA PASADA: OPTIMIZAMOS
            if (instrucciones != null) {
                for (let i = 0; i < instrucciones.length; i++) {
                    if (ast.etiquetasBetadas.includes(instrucciones[i].id))
                        continue;
                    codInstrucciones += instrucciones[i].optimizarCodigoo(this.reporte, ast, aplicaBloques);
                }
            }
            codFuncion = "void " + funciones[a].nombre + "(){\n" + codInstrucciones + "}\n\n";
            this.codigoOptimizado += codFuncion;
        }
        return this.codigoOptimizado;
    }
    reportar() {
        this.reporte.generarReporteOptimizacion();
    }
}
exports.Optimizador = Optimizador;
