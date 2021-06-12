"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../model/xpath/Enum");
// import Aritmetica from "./Operators/Aritmetica";
var Relacional_1 = __importDefault(require("./Operators/Relacional"));
var Logica_1 = __importDefault(require("./Operators/Logica"));
function Expresion(_expresion, _ambito, _contexto) {
    var tipo = _expresion.tipo;
    if (tipo === Enum_1.Tipos.NODENAME) {
        // let expresion = _ambito.getSimboloFromRoot(_expresion.nodename, _contexto);
        return { valor: _expresion.nodename, tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_CURRENT) {
        return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_PARENT) {
        return { valor: "..", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_ATTRIBUTES) {
        var valor = { id: _expresion.expresion, tipo: "@" };
        return { valor: valor, tipo: Enum_1.Tipos.ATRIBUTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.ASTERISCO) {
        return { valor: "*", tipo: Enum_1.Tipos.ASTERISCO, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_NODE) {
        return { valor: "node()", tipo: Enum_1.Tipos.FUNCION_NODE, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.STRING || tipo === Enum_1.Tipos.NUMBER) {
        return _expresion;
    }
    else if (tipo === Enum_1.Tipos.OPERACION_SUMA || tipo === Enum_1.Tipos.OPERACION_RESTA || tipo === Enum_1.Tipos.OPERACION_MULTIPLICACION
        || tipo === Enum_1.Tipos.OPERACION_DIVISION || tipo === Enum_1.Tipos.OPERACION_MODULO || tipo === Enum_1.Tipos.OPERACION_NEGACION_UNARIA) {
        var Aritmetica = require("./Operators/Aritmetica");
        return Aritmetica(_expresion, _ambito);
    }
    else if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_IGUAL || tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
        return Relacional_1.default(_expresion, _ambito);
    }
    else if (tipo === Enum_1.Tipos.LOGICA_AND || tipo === Enum_1.Tipos.LOGICA_OR) {
        return Logica_1.default(_expresion, _ambito);
    }
    else {
        console.log(_expresion, "SSSSSSSS");
        return { err: "Error: Expresi\u00F3n no procesada.\n", linea: _expresion.linea, columna: _expresion.columna };
    }
}
module.exports = Expresion;
