"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objeto = void 0;
const Enum_1 = require("./Enum");
class Objeto {
    newValue(_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    }
    newOperation(_opIzq, _opDer, _tipo, _linea, _columna) {
        return {
            opIzq: _opIzq,
            opDer: _opDer,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    }
    newNodename(_nodename, _linea, _columna) {
        return {
            nodename: _nodename,
            tipo: Enum_1.Tipos.NODENAME,
            linea: _linea,
            columna: _columna
        };
    }
    newAxis(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_ROOT,
            linea: _linea,
            columna: _columna
        };
    }
    newDoubleAxis(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_FROM_CURRENT,
            linea: _linea,
            columna: _columna
        };
    }
    newCurrent(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_CURRENT,
            linea: _linea,
            columna: _columna
        };
    }
    newParent(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_PARENT,
            linea: _linea,
            columna: _columna
        };
    }
    newAttribute(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.SELECT_ATTRIBUTES,
            linea: _linea,
            columna: _columna
        };
    }
    newAxisObject(_axisname, _nodetest, _linea, _columna) {
        return {
            axisname: _axisname,
            nodetest: _nodetest,
            tipo: Enum_1.Tipos.SELECT_AXIS,
            linea: _linea,
            columna: _columna
        };
    }
    newPredicate(_condicion, _linea, _columna) {
        return {
            condicion: _condicion,
            tipo: Enum_1.Tipos.PREDICATE,
            linea: _linea,
            columna: _columna
        };
    }
    newExpression(_expresion, _predicate, _linea, _columna) {
        return {
            expresion: _expresion,
            predicate: _predicate,
            tipo: Enum_1.Tipos.EXPRESION,
            linea: _linea,
            columna: _columna
        };
    }
}
exports.Objeto = Objeto;
