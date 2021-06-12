"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objeto = void 0;
var Enum_1 = require("./Enum");
var Objeto = /** @class */ (function () {
    function Objeto() {
    }
    Objeto.prototype.newValue = function (_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newArithmetic = function (_opIzq, _opDer, _tipo, _linea, _columna) {
        var tipo;
        switch (_tipo) {
            case "+":
                tipo = Enum_1.Tipos.OPERACION_SUMA;
                break;
            case "-":
                tipo = Enum_1.Tipos.OPERACION_RESTA;
                break;
            case "*":
                tipo = Enum_1.Tipos.OPERACION_MULTIPLICACION;
                break;
            case "/":
                tipo = Enum_1.Tipos.OPERACION_DIVISION;
                break;
            case "%":
                tipo = Enum_1.Tipos.OPERACION_MODULO;
                break;
            default:
                tipo = Enum_1.Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newRelation = function (_opIzq, _opDer, _tipo, _linea, _columna) {
        var tipo;
        switch (_tipo) {
            case "==":
                tipo = Enum_1.Tipos.RELACIONAL_IGUAL;
                break;
            case "!=":
                tipo = Enum_1.Tipos.RELACIONAL_DIFERENTE;
                break;
            case "<":
                tipo = Enum_1.Tipos.RELACIONAL_MENOR;
                break;
            case "<=":
                tipo = Enum_1.Tipos.RELACIONAL_MENORIGUAL;
                break;
            case ">":
                tipo = Enum_1.Tipos.RELACIONAL_MAYOR;
                break;
            case ">=":
                tipo = Enum_1.Tipos.RELACIONAL_MAYORIGUAL;
                break;
            default:
                tipo = Enum_1.Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newLogic = function (_opIzq, _opDer, _tipo, _linea, _columna) {
        var tipo;
        switch (_tipo) {
            case "||":
                tipo = Enum_1.Tipos.LOGICA_OR;
                break;
            case "&&":
                tipo = Enum_1.Tipos.LOGICA_AND;
                break;
            default:
                tipo = Enum_1.Tipos.NONE;
                break;
        }
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: tipo,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newNodename = function (_nodename, _linea, _columna) {
        return {
            nodename: _nodename,
            tipo: Enum_1.Tipos.NODENAME,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newAxis = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_ROOT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newDoubleAxis = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_CURRENT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newCurrent = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_CURRENT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newParent = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_PARENT,
            linea: _linea,
            columna: _columna
        };
    };
    Objeto.prototype.newAttribute = function (_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_ATTRIBUTES,
            linea: _linea,
            columna: _columna
        };
    };
    return Objeto;
}());
exports.Objeto = Objeto;
