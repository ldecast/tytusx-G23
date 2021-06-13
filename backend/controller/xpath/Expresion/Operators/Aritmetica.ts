import { Tipos } from "../../../../model/xpath/Enum";

function Aritmetica(_expresion: any, _ambito: any) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo);
    if (operators.err) return operators;
    switch (operators.tipo) {
        case Tipos.OPERACION_SUMA:
            return suma(operators.op1, operators.op2);
        case Tipos.OPERACION_RESTA:
            return resta(operators.op1, operators.op2);
        case Tipos.OPERACION_MULTIPLICACION:
            return multiplicacion(operators.op1, operators.op2);
        case Tipos.OPERACION_DIVISION:
            return division(operators.op1, operators.op2);
        case Tipos.OPERACION_MODULO:
            return modulo(operators.op1, operators.op2);
        case Tipos.OPERACION_NEGACION_UNARIA:
            return negacionUnaria(operators.op1);
        default:
            return null;
    }
}

function init(_opIzq: any, _opDer: any, _ambito: Array<any>, _tipo: Tipos) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let op2 = Expresion(_opDer, _ambito);
    let tipo: Tipos = _tipo;
    if (op1.tipo === Tipos.FUNCION_LAST && op2.tipo === Tipos.NUMBER) {
        op1 = _ambito.length;
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_LAST) {
        op1 = Number(op1.valor);
        op2 = _ambito.length;
    }
    else if (op1.tipo === Tipos.FUNCION_POSITION && op2.tipo === Tipos.NUMBER) {
        op1 = _ambito.length;
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_POSITION) {
        op1 = Number(op1.valor);
        op2 = _ambito.length;
    }
    else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
    }
    else return { err: "Solamente se pueden operar aritméticamente valores numéricos.\n", linea: _opIzq.linea, columna: _opIzq.columna }
    return { op1: op1, op2: op2, tipo: tipo };
}

function suma(_opIzq: any, _opDer: any) {
    return {
        valor: (_opIzq + _opDer),
        tipo: Tipos.NUMBER,
    }
}

function resta(_opIzq: number, _opDer: number) {
    return {
        valor: (_opIzq - _opDer),
        tipo: Tipos.NUMBER,
    }
}

function multiplicacion(_opIzq: number, _opDer: number) {
    return {
        valor: (_opIzq * _opDer),
        tipo: Tipos.NUMBER,
    }
}

function division(_opIzq: number, _opDer: number) {
    return {
        valor: (_opIzq / _opDer),
        tipo: Tipos.NUMBER,
    }
}

function modulo(_opIzq: number, _opDer: number) {
    return {
        valor: (_opIzq % _opDer),
        tipo: Tipos.NUMBER,
    }
}

function negacionUnaria(_opIzq: number) {
    return {
        valor: (0 - _opIzq),
        tipo: Tipos.NUMBER,
    }
}

export =  Aritmetica;