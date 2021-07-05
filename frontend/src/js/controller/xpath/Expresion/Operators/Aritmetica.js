"use strict";
const Enum_1 = require("../../../../model/xpath/Enum");
function Aritmetica(_expresion, _ambito, _contexto, _id) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo, _contexto, _id);
    if (operators === null || operators.error)
        return operators;
    switch (operators.tipo) {
        case Enum_1.Tipos.OPERACION_SUMA:
            return suma(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_RESTA:
            return resta(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_MULTIPLICACION:
            return multiplicacion(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_DIVISION:
            return division(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_MODULO:
            return modulo(operators.op1, operators.op2);
        case Enum_1.Tipos.OPERACION_NEGACION_UNARIA:
            return negacionUnaria(operators.op1);
        default:
            return null;
    }
}
function init(_opIzq, _opDer, _ambito, _tipo, _contexto, _id) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito, _contexto, _id);
    if (op1 === null || op1.error)
        return op1;
    let op2 = Expresion(_opDer, _ambito, _contexto, _id);
    if (op2 === null || op2.error)
        return op2;
    let tipo = _tipo;
    if (op1.constructor.name === "Contexto")
        op1 = _ambito.extractValue(op1);
    if (op2.constructor.name === "Contexto")
        op2 = _ambito.extractValue(op2);
    if (op1.tipo === Enum_1.Tipos.FUNCION_LAST && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = _contexto.getLength();
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_LAST) {
        op1 = Number(op1.valor);
        op2 = _contexto.getLength();
    }
    else if (op1.tipo === Enum_1.Tipos.FUNCION_POSITION && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = _contexto.getLength();
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_POSITION) {
        op1 = Number(op1.valor);
        op2 = _contexto.getLength();
    }
    else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
    }
    else if ((op1.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.STRING) && tipo === Enum_1.Tipos.OPERACION_SUMA) {
        op1 = String(op1.valor);
        op2 = String(op2.valor);
    }
    else
        return { error: "Solamente se pueden operar aritméticamente valores numéricos.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
    return { op1: op1, op2: op2, tipo: tipo };
}
function suma(_opIzq, _opDer) {
    return {
        valor: (_opIzq + _opDer),
        tipo: (typeof (_opIzq) === "number" && typeof (_opDer) === "number") ? (Enum_1.Tipos.NUMBER) : (Enum_1.Tipos.STRING)
    };
}
function resta(_opIzq, _opDer) {
    return {
        valor: (_opIzq - _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function multiplicacion(_opIzq, _opDer) {
    return {
        valor: (_opIzq * _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function division(_opIzq, _opDer) {
    if (_opDer == 0)
        return { error: "No es permitida la división entre 0." };
    return {
        valor: (_opIzq / _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function modulo(_opIzq, _opDer) {
    if (_opDer == 0)
        return { error: "No es permitido módulo entre 0." };
    return {
        valor: (_opIzq % _opDer),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
function negacionUnaria(_opIzq) {
    return {
        valor: (0 - _opIzq),
        tipo: Enum_1.Tipos.NUMBER,
    };
}
module.exports = Aritmetica;
