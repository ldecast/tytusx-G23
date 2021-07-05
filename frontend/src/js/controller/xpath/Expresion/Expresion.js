"use strict";
const Enum_1 = require("../../../model/xpath/Enum");
function Expresion(_expresion, _ambito, _contexto, _id) {
    var _a;
    // if (!_expresion) return null;
    let tipo = (Array.isArray(_expresion)) ? Enum_1.Tipos.NONE : _expresion.tipo;
    if (tipo === Enum_1.Tipos.EXPRESION) {
        return Expresion(_expresion.expresion, _ambito, _contexto, _id);
    }
    else if (tipo === Enum_1.Tipos.NODENAME) {
        return { valor: _expresion.nodename, tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.STRING || tipo === Enum_1.Tipos.NUMBER) {
        return _expresion;
    }
    else if (tipo === Enum_1.Tipos.SELECT_CURRENT) {
        let exp = _expresion.expresion;
        if (_id) {
            if (_id === exp)
                return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
            if (((_a = _contexto.atCounter) === null || _a === void 0 ? void 0 : _a.id) === exp) {
                let length = _contexto.getLength();
                for (let i = 1; i <= length; i++) {
                    _contexto.items.push(i);
                }
                return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
            }
            return null;
        }
        if (_contexto.existeVariable(exp) !== -1) {
            let valueFromVar = _contexto.getVar(exp);
            if (valueFromVar === null || valueFromVar === void 0 ? void 0 : valueFromVar.contexto) {
                _ambito.contextFromVar = valueFromVar;
                return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna, contextFromVar: valueFromVar.contexto };
            }
            else if (valueFromVar === null || valueFromVar === void 0 ? void 0 : valueFromVar.valor)
                return valueFromVar === null || valueFromVar === void 0 ? void 0 : valueFromVar.valor;
        }
        if (exp !== ".")
            return null;
        return { valor: ".", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_PARENT) {
        return { valor: "..", tipo: Enum_1.Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_ATTRIBUTES) {
        return { valor: _expresion.expresion, tipo: Enum_1.Tipos.ATRIBUTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.SELECT_AXIS) {
        let nodetest = Expresion(_expresion.nodetest.expresion, _ambito, _contexto, _id);
        if (nodetest.error)
            return nodetest;
        return { axisname: _expresion.axisname, nodetest: nodetest, predicate: _expresion.nodetest.predicate, tipo: Enum_1.Tipos.SELECT_AXIS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.ASTERISCO) {
        return { valor: "*", tipo: Enum_1.Tipos.ASTERISCO, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_NODE) {
        return { valor: "node()", tipo: Enum_1.Tipos.FUNCION_NODE, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_LAST) {
        return { valor: "last()", tipo: Enum_1.Tipos.FUNCION_LAST, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_POSITION) {
        return { valor: "position()", tipo: Enum_1.Tipos.FUNCION_POSITION, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.FUNCION_TEXT) {
        return { valor: "text()", tipo: Enum_1.Tipos.FUNCION_TEXT, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Enum_1.Tipos.OPERACION_SUMA || tipo === Enum_1.Tipos.OPERACION_RESTA || tipo === Enum_1.Tipos.OPERACION_MULTIPLICACION
        || tipo === Enum_1.Tipos.OPERACION_DIVISION || tipo === Enum_1.Tipos.OPERACION_MODULO || tipo === Enum_1.Tipos.OPERACION_NEGACION_UNARIA) {
        const Aritmetica = require("./Operators/Aritmetica");
        return Aritmetica(_expresion, _ambito, _contexto, _id);
    }
    else if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL
        || tipo === Enum_1.Tipos.RELACIONAL_IGUAL || tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
        const Relacional = require("./Operators/Relacional");
        return Relacional(_expresion, _ambito, _contexto, _id);
    }
    else if (tipo === Enum_1.Tipos.LOGICA_AND || tipo === Enum_1.Tipos.LOGICA_OR) {
        const Logica = require("./Operators/Logica");
        return Logica(_expresion, _ambito, _contexto, _id);
    }
    else if (tipo === Enum_1.Tipos.IF_THEN_ELSE) {
        const IfConditional = require("../../xquery/If");
        return IfConditional(_expresion.condicionIf, _expresion.instruccionesThen, _expresion.instruccionesElse, _ambito, _contexto, _id);
    }
    else {
        const ExpresionQuery = require('../../xquery/Expresion/Expresion');
        return ExpresionQuery(_expresion, _ambito, _contexto, _id);
    }
}
module.exports = Expresion;
