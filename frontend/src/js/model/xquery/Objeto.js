"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objeto = void 0;
var Enum_1 = require("./Enum");
var Objeto = /** @class */ (function () {
    function Objeto() {
        this.for_loop = this.nuevoFor;
    }
    Objeto.prototype.nuevoFor = function (_variables, _iterators, _at, _where, _orderby, _return, _linea, _columna) {
        return {
            variables: _variables,
            atkey: _at,
            // path: _path, /* xml/tag/[2] */
            iterators: _iterators,
            where: _where,
            orderby: _orderby,
            return: _return,
            tipo: Enum_1.Query.FOR_LOOP,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.nuevoLet = function (_varName, _valor, _linea, _columna) {
        return {
            id: _varName,
            expresion: _valor,
            tipo: Enum_1.Query.LET_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.nuevoWhere = function (_condiciones, _linea, _columna) {
        return {
            condiciones: _condiciones,
            tipo: Enum_1.Query.WHERE_CONDITION,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.nuevoOrderBy = function (_orders, _linea, _columna) {
        return {
            ordenes: _orders,
            tipo: Enum_1.Query.ORDER_BY_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.nuevoReturn = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Query.RETURN_STATEMENT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.nuevoValor = function (_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.nuevoIntervalo = function (_valor1, _valor2, _linea, _columna) {
        return {
            valor1: _valor1,
            valor2: _valor2,
            tipo: Enum_1.Query.INTERVALO,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.nuevosValores = function (_valores, _linea, _columna) {
        return {
            valores: _valores,
            tipo: Enum_1.Query.VALORES,
            linea: _linea,
            columna: _columna
        };
    };
    return Objeto;
}());
exports.Objeto = Objeto;
