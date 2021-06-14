"use strict";
var Enum_1 = require("../../../../model/xpath/Enum");
function Relacional(_expresion, _ambito) {
    var operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo);
    if (operators.err)
        return operators;
    switch (operators.tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return mayor(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return mayorigual(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return menor(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return menorigual(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return igual(operators.op1, operators.op2);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return diferente(operators.op1, operators.op2);
        default:
            return null;
    }
}
function init(_opIzq, _opDer, _ambito, _tipo) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _ambito);
    var op2 = Expresion(_opDer, _ambito);
    var tipo = _tipo;
    if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL ||
        tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL) {
        if (op1.tipo === Enum_1.Tipos.FUNCION_LAST && op2.tipo === Enum_1.Tipos.NUMBER) {
            op1 = _ambito.length;
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_LAST) {
            op2 = Number(op1.valor);
            op1 = _ambito.length;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYOR)
                tipo = Enum_1.Tipos.RELACIONAL_MENOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MENORIGUAL;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENOR)
                tipo = Enum_1.Tipos.RELACIONAL_MAYOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MAYORIGUAL;
        }
        else if (op1.tipo === Enum_1.Tipos.FUNCION_POSITION && op2.tipo === Enum_1.Tipos.NUMBER) {
            op1 = _ambito.length;
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_POSITION) {
            op2 = Number(op1.valor);
            op1 = _ambito.length;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYOR)
                tipo = Enum_1.Tipos.RELACIONAL_MENOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MENORIGUAL;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENOR)
                tipo = Enum_1.Tipos.RELACIONAL_MAYOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MAYORIGUAL;
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.NUMBER) {
            op1 = Number(op1.valor);
            op2 = Number(op2.valor);
        }
        else
            return { err: "Solamente se pueden comparar desigualdades entre valores numéricos.\n", linea: _opIzq.linea, columna: _opIzq.columna };
    }
    if (tipo === Enum_1.Tipos.RELACIONAL_IGUAL || tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
        var opIzq = { valor: 0, tipo: op1.tipo };
        var opDer = { valor: 0, tipo: op2.tipo };
        if (op1.tipo === Enum_1.Tipos.FUNCION_LAST && op2.tipo === Enum_1.Tipos.NUMBER) {
            opIzq.valor = _ambito.length;
            opDer.valor = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_LAST) {
            opIzq.valor = Number(op1.valor);
            opDer.valor = _ambito.length;
        }
        else if (op1.tipo === Enum_1.Tipos.FUNCION_POSITION && op2.tipo === Enum_1.Tipos.NUMBER) {
            opIzq.valor = _ambito.length;
            opDer.valor = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.FUNCION_POSITION) {
            opIzq.valor = Number(op1.valor);
            opDer.valor = _ambito.length;
        }
        // else { // Falta
        // op1 = { valor: op1, tipo: tipo };
        // op2 = { valor: op2, tipo: tipo };
        // }
        return { op1: opIzq, op2: opDer, tipo: tipo };
    }
    return { op1: op1, op2: op2, tipo: tipo };
}
function mayor(_opIzq, _opDer) {
    return {
        valor: (_opDer + 1),
        tipo: Enum_1.Tipos.RELACIONAL_MAYOR
    };
}
function mayorigual(_opIzq, _opDer) {
    return {
        valor: _opDer,
        tipo: Enum_1.Tipos.RELACIONAL_MAYORIGUAL
    };
}
function menor(_opIzq, _opDer) {
    return {
        valor: (_opDer - 1),
        tipo: Enum_1.Tipos.RELACIONAL_MENOR
    };
}
function menorigual(_opIzq, _opDer) {
    return {
        valor: _opDer,
        tipo: Enum_1.Tipos.RELACIONAL_MENORIGUAL
    };
}
function igual(_opIzq, _opDer) {
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION || _opDer.tipo === Enum_1.Tipos.FUNCION_POSITION)
        return { valor: ((_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)), tipo: Enum_1.Tipos.NUMBER };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_LAST || _opDer.tipo === Enum_1.Tipos.FUNCION_LAST)
        return { valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)), tipo: Enum_1.Tipos.NUMBER };
    return {
        valor: (_opIzq == _opDer),
        tipo: Enum_1.Tipos.RELACIONAL_IGUAL
    };
}
function diferente(_opIzq, _opDer) {
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION || _opDer.tipo === Enum_1.Tipos.FUNCION_POSITION) {
        return {
            valor: ((_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)),
            tipo: Enum_1.Tipos.EXCLUDE
        };
    }
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_LAST || _opDer.tipo === Enum_1.Tipos.FUNCION_LAST) {
        return {
            valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)),
            tipo: Enum_1.Tipos.EXCLUDE
        };
    }
    return {
        valor: (_opIzq != _opDer),
        tipo: Enum_1.Tipos.RELACIONAL_DIFERENTE
    };
}
module.exports = Relacional;
