"use strict";
var Enum_1 = require("../../../../model/xpath/Enum");
function Aritmetica(_expresion, _ambito) {
    switch (_expresion.tipo) {
        case Enum_1.Tipos.OPERACION_SUMA:
            return suma(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_RESTA:
            return resta(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_MULTIPLICACION:
            return multiplicacion(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_DIVISION:
            return division(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_MODULO:
            return modulo(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.OPERACION_NEGACION_UNARIA:
            return negacionUnaria(_expresion.opIzq, _ambito);
        default:
            break;
    }
}
function suma(_opIzq, _opDer, _ambito) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (op1.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.STRING) {
        op1 = String(op1.valor);
        op2 = String(op2.valor);
        tipo = Enum_1.Tipos.STRING;
    }
    else if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden sumar valores numéricos o concatenar cadenas.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 + op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function resta(_opIzq, _opDer, _ambito) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden restar valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 - op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function multiplicacion(_opIzq, _opDer, _ambito) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden multiplicar valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 * op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function division(_opIzq, _opDer, _ambito) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden dividir valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 / op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function modulo(_opIzq, _opDer, _ambito) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER && _opDer.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se puede realizar módulo con valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = op1 % op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
function negacionUnaria(_opIzq, _ambito) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _ambito);
    var tipo;
    if (_opIzq.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        tipo = Enum_1.Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se puede negar un valor numérico.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        };
    }
    var resultado = 0 - op1;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    };
}
module.exports = Aritmetica;
