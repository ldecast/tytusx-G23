"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XQObjeto = void 0;
var Enum_1 = require("../xpath/Enum");
var XQObjeto = /** @class */ (function () {
    function XQObjeto() {
    }
    XQObjeto.prototype.nuevoFor = function (_cuerpoDec, _instrucciones, _linea, _columna) {
        return {
            cuerpo: _cuerpoDec,
            instrucciones: _instrucciones,
            tipo: Enum_1.Tipos.FOR_LOOP,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoLet = function (_varName, _valor, _linea, _columna) {
        return {
            id: _varName,
            expresion: _valor,
            tipo: Enum_1.Tipos.LET_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoWhere = function (_condiciones, _linea, _columna) {
        return {
            condiciones: _condiciones,
            tipo: Enum_1.Tipos.WHERE_CONDITION,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoOrderBy = function (_orders, _linea, _columna) {
        return {
            ordenes: _orders,
            tipo: Enum_1.Tipos.ORDER_BY_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoReturn = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.RETURN_STATEMENT,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoValor = function (_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevaDeclaracion = function (_variables, _at, _iterators, _linea, _columna) {
        return {
            variable: _variables,
            atKey: _at,
            iterators: _iterators,
            tipo: Enum_1.Tipos.DECLARACION,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoIntervalo = function (_valor1, _valor2, _linea, _columna) {
        return {
            valor1: _valor1,
            valor2: _valor2,
            tipo: Enum_1.Tipos.INTERVALO,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevosValores = function (_valores, _linea, _columna) {
        return {
            valores: _valores,
            tipo: Enum_1.Tipos.VALORES,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoContenido = function (_valor, _linea, _columna) {
        return {
            contenido: _valor,
            tipo: Enum_1.Tipos.CONTENIDO,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevaInyeccion = function (_valor, _onlyData, _linea, _columna) {
        return {
            path: _valor,
            onlyData: _onlyData,
            tipo: Enum_1.Tipos.INYECCION,
            linea: _linea,
            columna: _columna
        };
    };
    XQObjeto.prototype.nuevoHTML = function (_id_open, _atributos, _contenido, _id_close, _linea, _columna) {
        return {
            id_open: _id_open,
            id_close: _id_close,
            atributos: _atributos,
            value: _contenido,
            tipo: Enum_1.Tipos.HTML,
            linea: _linea,
            columna: _columna
        };
    };
    return XQObjeto;
}());
exports.XQObjeto = XQObjeto;
