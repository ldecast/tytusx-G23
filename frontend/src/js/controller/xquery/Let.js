"use strict";
const Contexto_1 = require("../Contexto");
const Enum_1 = require("../../model/xpath/Enum");
const Variable_1 = require("../../model/xml/Ambito/Variable");
function LetClause(_id, _valor, _ambito, _contexto, id) {
    const Expresion = require("../xpath/Expresion/Expresion");
    let tmp = new Contexto_1.Contexto(_contexto);
    let variable = new Variable_1.Variable(_id.variable, Enum_1.Tipos.VARIABLE, _id.linea, _id.columna, "local");
    let contexto = Expresion(_valor, _ambito, tmp, id);
    if (contexto === null || contexto.error)
        return contexto;
    if (contexto) {
        variable.setValue(contexto);
        tmp.addVariable(variable);
        _ambito.tablaVariables.push(variable);
    }
    // console.log(variable, 3333333);
}
module.exports = LetClause;
