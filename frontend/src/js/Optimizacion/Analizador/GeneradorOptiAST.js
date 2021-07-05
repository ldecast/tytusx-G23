"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorOptiAST = void 0;
const Funcion_1 = require("../OptimizadorAST/Funcion");
const Operacion_1 = require("../OptimizadorValorImplicito/Operacion");
const Exit_1 = require("../OptimizadorPrimitivas/Exit");
const GOTO_1 = require("../OptimizadorAST/GOTO");
const Etiqueta_1 = require("../OptimizadorAST/Etiqueta");
const Asignacion_1 = require("../OptimizadorValorImplicito/Asignacion");
const Primitivo_1 = require("../OptimizadorValorImplicito/Primitivo");
const If_1 = require("../OptimizadorCondicional/If");
const Imprimir_1 = require("../OptimizadorPrimitivas/Imprimir");
const Call_1 = require("../OptimizadorPrimitivas/Call");
class GeneradorOptiAST {
    constructor(arbol) {
        this.funciones = new Array();
        this.generar(arbol);
    }
    generar(raiz) {
        this.funciones = this.analizarNodo(raiz);
    }
    analizarNodo(actual) {
        if (this.compararNodo(actual, "Inicio")) {
            this.head = "";
            this.analizarNodo(actual.hijos[0]);
            return this.analizarNodo(actual.hijos[1]);
        }
        else if (this.compararNodo(actual, "HEAD")) {
            this.head += "#include <stdio.h>\n";
            this.analizarNodo(actual.hijos[5]); //L_VR
            this.analizarNodo(actual.hijos[6]); //G_TMP
        }
        else if (this.compararNodo(actual, "L_VR")) {
            for (let hijo of actual.hijos) {
                this.analizarNodo(hijo);
            }
        }
        else if (this.compararNodo(actual, "VR")) {
            if (actual.hijos.length == 6) {
                this.head += "float " + this.getLexema(actual.hijos[1]) + "[" + this.getLexema(actual.hijos[3]) + "];\n";
            }
            else { //3 HIJOS
                this.head += "float " + this.getLexema(actual.hijos[1]) + ";\n";
            }
        }
        else if (this.compararNodo(actual, "G_TMP")) {
            this.head += "float ";
            this.analizarNodo(actual.hijos[1]);
        }
        else if (this.compararNodo(actual, "L_TMP")) {
            for (let i = 0; i < actual.hijos.length; i++) {
                let temporal = actual.hijos[i];
                let cadtemporal = this.getLexema(temporal);
                if (i + 1 == actual.hijos.length) { //si es el ultimo
                    this.head += cadtemporal + ";\n\n";
                }
                else {
                    if (cadtemporal.endsWith("0"))
                        this.head += cadtemporal + ",\n";
                    else
                        this.head += cadtemporal + ",";
                }
            }
        }
        else if (this.compararNodo(actual, "L_FUN")) {
            let funciones = new Array();
            for (let hijo of actual.hijos) {
                let funcion = this.analizarNodo(hijo);
                funciones.push(funcion);
            }
            return funciones;
        }
        else if (this.compararNodo(actual, "FUN")) {
            let id = this.getLexema(actual.hijos[1]);
            let etiquetas;
            if (actual.hijos.length == 8) {
                let sentencias = this.analizarNodo(actual.hijos[5]);
                let subetiquetas = this.analizarNodo(actual.hijos[6]);
                //Simulo la primera etiqueta
                let primerEtiqueta = new Etiqueta_1.Etiqueta("//PET", sentencias, actual.hijos[0].linea, actual.hijos[0].columna); //poner parametro en el Nodo para linea y columna
                etiquetas = new Array();
                etiquetas.push(primerEtiqueta);
                for (let eti of subetiquetas) {
                    etiquetas.push(eti);
                }
            }
            else { //7 hijos
                if (this.compararNodo(actual.hijos[5], "L_SEN")) {
                    let sentencias = this.analizarNodo(actual.hijos[5]);
                    //Simulo la primera etiqueta
                    let primerEtiqueta = new Etiqueta_1.Etiqueta("//PET", sentencias, actual.hijos[0].linea, actual.hijos[0].columna);
                    etiquetas = new Array();
                    etiquetas.push(primerEtiqueta);
                }
                else { //L_ET
                    etiquetas = this.analizarNodo(actual.hijos[5]);
                }
            }
            return new Funcion_1.Funcion(id, etiquetas);
        }
        else if (this.compararNodo(actual, "L_ET")) {
            let etiquetas = new Array();
            for (let hijo of actual.hijos) {
                let etiqueta = this.analizarNodo(hijo);
                etiquetas.push(etiqueta);
            }
            return etiquetas;
        }
        else if (this.compararNodo(actual, "ET")) {
            let id = this.getLexema(actual.hijos[0]);
            let sentencias;
            if (actual.hijos.length == 3) {
                sentencias = this.analizarNodo(actual.hijos[2]);
            }
            else { //2 HIJOS
                sentencias = new Array();
            } // parametros para lineas y columnas
            return new Etiqueta_1.Etiqueta(id, sentencias, actual.hijos[0].linea, actual.hijos[0].columna);
        }
        else if (this.compararNodo(actual, "L_SEN")) {
            let sentencias = new Array();
            for (let hijo of actual.hijos) {
                let sentencia = this.analizarNodo(hijo);
                sentencias.push(sentencia);
            }
            return sentencias;
        }
        else if (this.compararNodo(actual, "SEN")) {
            return this.analizarNodo(actual.hijos[0]);
        }
        else if (this.compararNodo(actual, "ASIG")) {
            let target = this.analizarNodo(actual.hijos[0]);
            let expresion = this.analizarNodo(actual.hijos[2]); // parametros de fila y columna
            return new Asignacion_1.Asignacion(target, expresion, actual.hijos[1].linea, actual.hijos[1].columna);
        }
        else if (this.compararNodo(actual, "TG")) {
            let target;
            if (actual.hijos.length == 1) {
                target = this.getLexema(actual.hijos[0]);
            }
            else {
                target = this.getLexema(actual.hijos[0]);
                target += "[" + this.analizarNodo(actual.hijos[2]) + "]"; //espero que no de problemas
            }
            return target;
        }
        else if (this.compararNodo(actual, "INDEX")) {
            let index;
            if (actual.hijos.length == 1) {
                index = this.getLexema(actual.hijos[0]);
            }
            else {
                index = "(int)" + this.getLexema(actual.hijos[3]);
            }
            return index;
        }
        else if (this.compararNodo(actual, "EXP")) {
            return this.analizarNodo(actual.hijos[0]);
        }
        else if (this.compararNodo(actual, "EXPNUM")) {
            let opIzq = this.analizarNodo(actual.hijos[0]);
            let operacion = this.analizarNodo(actual.hijos[1]);
            let opDer = this.analizarNodo(actual.hijos[2]);
            let op = new Operacion_1.Operacion();
            op.Operation(opIzq, opDer, operacion, 1, 1);
            return op;
        }
        else if (this.compararNodo(actual, "VALO")) {
            return this.analizarNodo(actual.hijos[0]);
        }
        else if (this.compararNodo(actual, "PUN")) {
            let op = new Operacion_1.Operacion(); //parametros de linea y columna
            op.Identificador(this.getLexema(actual.hijos[0]), actual.hijos[0].linea, actual.hijos[0].columna);
            return op;
        }
        else if (this.compararNodo(actual, "PRIMI")) {
            let op = new Operacion_1.Operacion();
            let valor;
            if (actual.hijos.length == 1) {
                valor = this.getLexema(actual.hijos[0]); //aqui puede dar problemas, espero que no.
                op.Primitivo(new Primitivo_1.Primitivo(valor));
            }
            else {
                valor = "-" + this.getLexema(actual.hijos[1]); //aqui puede dar problemas, espero que no.
                op.Primitivo(new Primitivo_1.Primitivo(valor));
            }
            return op;
        }
        else if (this.compararNodo(actual, "TEMP")) {
            let op = new Operacion_1.Operacion();
            op.Identificador(this.getLexema(actual.hijos[0]), actual.hijos[0].linea, actual.hijos[0].columna);
            return op;
        }
        else if (this.compararNodo(actual, "STR")) {
            let estructura = this.getLexema(actual.hijos[0]);
            estructura += "[" + this.analizarNodo(actual.hijos[2]) + "]";
            let op = new Operacion_1.Operacion(); //parametros de linea y columna para el node
            op.Identificador(estructura, actual.hijos[0].linea, actual.hijos[0].columna);
            return op;
        }
        else if (this.compararNodo(actual, "ARI")) {
            return this.getOperacion(actual.hijos[0]);
        }
        else if (this.compararNodo(actual, "IF")) {
            let condicion = this.analizarNodo(actual.hijos[2]);
            let etiqueta = this.getLexema(actual.hijos[5]); // tambien parametros de fila y columna
            return new If_1.If(condicion, etiqueta, actual.hijos[0].linea, actual.hijos[0].columna);
        }
        else if (this.compararNodo(actual, "COND")) {
            let izq = this.analizarNodo(actual.hijos[0]);
            let operacion = this.analizarNodo(actual.hijos[1]);
            let der = this.analizarNodo(actual.hijos[2]);
            let op = new Operacion_1.Operacion(); //parametros de fila y columna
            op.Operation(izq, der, operacion, actual.hijos[1].hijos[0].linea, actual.hijos[1].hijos[0].columna);
            return op;
        }
        else if (this.compararNodo(actual, "VALI")) {
            return this.analizarNodo(actual.hijos[0]);
        }
        else if (this.compararNodo(actual, "RELA")) {
            return this.getOperacion(actual.hijos[0]);
        }
        else if (this.compararNodo(actual, "GO")) {
            let id = this.getLexema(actual.hijos[1]); // parametros de fila y columna
            return new GOTO_1.GOTO(id, actual.hijos[0].linea, actual.hijos[0].columna);
        }
        else if (this.compararNodo(actual, "PRT")) {
            let cadena = this.getLexema(actual.hijos[2]);
            let value = this.analizarNodo(actual.hijos[4]);
            let op = new Operacion_1.Operacion(); //parametros para fila y columna
            op.Identificador(value, actual.hijos[0].linea, actual.hijos[0].columna);
            return new Imprimir_1.Imprimir(op, cadena, actual.hijos[0].linea, actual.hijos[0].columna);
        }
        else if (this.compararNodo(actual, "VALP")) {
            let valp;
            if (actual.hijos.length == 1) {
                valp = this.getLexema(actual.hijos[0]);
            }
            else if (actual.hijos.length == 2) {
                valp = "-" + this.getLexema(actual.hijos[1]);
            }
            else {
                valp = "(int)" + this.getLexema(actual.hijos[3]);
            }
            return valp;
        }
        else if (this.compararNodo(actual, "RET")) {
            return new Exit_1.Exit();
        }
        else if (this.compararNodo(actual, "CALL")) {
            let id = this.getLexema(actual.hijos[0]);
            return new Call_1.Call(id);
        }
        return null;
    }
    compararNodo(nodo, nombre) {
        return nodo.nombre == nombre;
    }
    getLexema(nodo) {
        return nodo.valor;
    }
    getOperacion(nodo) {
        let nombre = nodo.valor;
        if (nombre.includes(">="))
            return Operacion_1.TIPO_OPERACION.MAYOR_IGUA_QUE;
        else if (nombre.includes("<="))
            return Operacion_1.TIPO_OPERACION.MENOR_IGUA_QUE;
        else if (nombre.includes("!="))
            return Operacion_1.TIPO_OPERACION.DIFERENTE_QUE;
        else if (nombre.includes(">"))
            return Operacion_1.TIPO_OPERACION.MAYOR_QUE;
        else if (nombre.includes("<"))
            return Operacion_1.TIPO_OPERACION.MENOR_QUE;
        else if (nombre.includes("=="))
            return Operacion_1.TIPO_OPERACION.IGUAL_IGUAL;
        else if (nombre.includes("+"))
            return Operacion_1.TIPO_OPERACION.SUMA;
        else if (nombre.includes("-"))
            return Operacion_1.TIPO_OPERACION.RESTA;
        else if (nombre.includes("*"))
            return Operacion_1.TIPO_OPERACION.MULTIPLICACION;
        else if (nombre.includes("/"))
            return Operacion_1.TIPO_OPERACION.DIVISION;
        else
            return Operacion_1.TIPO_OPERACION.MODULO; //MODULO
    }
}
exports.GeneradorOptiAST = GeneradorOptiAST;
