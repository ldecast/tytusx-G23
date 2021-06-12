"use strict";
var Enum_1 = require("../../../../model/xpath/Enum");
function Relacional(_expresion, _ambito) {
    switch (_expresion.tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return mayor(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return mayorigual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return menor(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return menorigual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return igual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return diferente(_expresion.opIzq, _expresion.opDer, _ambito);
        default:
            break;
    }
}
function mayor(_opIzq, _opDer, _ambito) {
}
function mayorigual(_opIzq, _opDer, _ambito) {
}
function menor(_opIzq, _opDer, _ambito) {
}
function menorigual(_opIzq, _opDer, _ambito) {
}
function igual(_opIzq, _opDer, _ambito) {
}
function diferente(_opIzq, _opDer, _ambito) {
}
module.exports = Relacional;
