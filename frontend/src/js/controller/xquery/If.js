"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(require("../xpath/Expresion/Expresion"));
const Contexto_1 = require("../Contexto");
const Enum_1 = require("../../model/xpath/Enum");
function IfConditional(_condicion, _instruccionesThen, _instruccionesElse, _ambito, _contexto, id) {
    let tmp = new Contexto_1.Contexto(_contexto);
    let condicion = Expresion_1.default(_condicion, _ambito, tmp, id);
    if (condicion === null || condicion.error)
        return condicion;
    let cumple = cumpleCondicion(condicion[0], _contexto);
    if (cumple) {
        cumple.tablaVariables = _contexto.tablaVariables;
        let instrucciones = Expresion_1.default(_instruccionesThen, _ambito, cumple, id);
        // console.log(instrucciones, 3383838338)
        return instrucciones;
    }
    else {
        let instrucciones = Expresion_1.default(_instruccionesElse, _ambito, _contexto, id);
        // console.log(instrucciones, 3383838338)
        return instrucciones;
    }
}
function cumpleCondicion(_condicion, _tmp) {
    if (_condicion.constructor.name === "Contexto") {
        if (_condicion.getLength() > 0)
            return _condicion;
        else
            return null;
    }
    else if (_condicion.valor === true && _condicion.tipo === Enum_1.Tipos.BOOLEANO)
        return _tmp;
    else
        return null;
}
module.exports = IfConditional;
