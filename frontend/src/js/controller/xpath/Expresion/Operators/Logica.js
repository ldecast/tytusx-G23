"use strict";
var Enum_1 = require("../../../../model/xpath/Enum");
function Logica(_expresion, _contexto) {
    var operators = init(_expresion.opIzq, _expresion.opDer, _contexto, _expresion.tipo);
    if (operators.error)
        return operators;
    switch (operators.tipo) {
        case Enum_1.Tipos.LOGICA_AND:
            return and(operators.op1, operators.op2, _contexto);
        case Enum_1.Tipos.LOGICA_OR:
            return or(operators.op1, operators.op2, _contexto);
        default:
            return null;
    }
}
function init(_opIzq, _opDer, _contexto, _tipo) {
    var Expresion = require("../Expresion");
    var op1 = Expresion(_opIzq, _contexto);
    if (op1.error)
        return op1;
    var op2 = Expresion(_opDer, _contexto);
    if (op2.error)
        return op2;
    var tipo = _tipo;
    // else return { error: "Relación lógica no aceptable.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna }
    return { op1: op1, op2: op2, tipo: tipo };
}
function and(_opIzq, _opDer, _contexto) {
}
function or(_opIzq, _opDer, _contexto) {
}
module.exports = Logica;
