"use strict";
var Enum_1 = require("../../../../model/xpath/Enum");
function Logica(_expresion, _ambito) {
    switch (_expresion.tipo) {
        case Enum_1.Tipos.LOGICA_AND:
            return and(_expresion.opIzq, _expresion.opDer, _ambito);
        case Enum_1.Tipos.LOGICA_OR:
            return or(_expresion.opIzq, _expresion.opDer, _ambito);
        default:
            break;
    }
}
function and(_opIzq, _opDer, _ambito) {
}
function or(_opIzq, _opDer, _ambito) {
}
module.exports = Logica;
