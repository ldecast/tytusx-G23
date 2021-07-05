"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Contexto_1 = require("../../Contexto");
const Variable_1 = require("../../../model/xml/Ambito/Variable");
const Enum_1 = require("../../../model/xpath/Enum");
const Expresion_1 = __importDefault(require("../../xpath/Expresion/Expresion"));
function Exec(_instr, _ambito, _contexto, _id) {
    let name = _instr.name;
    let parametros = _instr.parametros;
    let funcion = _ambito.getFunction(name, parametros.length);
    if (!funcion)
        return { error: 'La función no existe, o bien, el número de parámetros no coincide.', linea: _instr.linea, columna: _instr.columna, origen: "XQuery", tipo: "Semántico" };
    // Declaración de parámetros
    let a = [];
    a = a.concat(_contexto.tablaVariables);
    let tmp = new Contexto_1.Contexto(_contexto, a);
    let aux = [];
    for (let i = 0; i < parametros.length; i++) {
        const parametro = parametros[i];
        tmp = new Contexto_1.Contexto(_contexto, a);
        let variable = new Variable_1.Variable(funcion.parametros[i].id, Enum_1.Tipos.VARIABLE, parametro.linea, parametro.columna, 'local:' + name);
        let contexto = Expresion_1.default(parametro, _ambito, tmp);
        if (contexto === null || contexto.error)
            return contexto;
        if (contexto.constructor.name === "Contexto")
            contexto = _ambito.extractValue(contexto);
        aux.push({ variable: variable, contexto: contexto });
    }
    // Asignar los valores
    for (let i = 0; i < aux.length; i++) {
        const variable = aux[i].variable;
        const contexto = aux[i].contexto;
        if (contexto) {
            variable.setValue(contexto);
            tmp.addVariable(variable);
        }
    }
    tmp = new Contexto_1.Contexto(_contexto, a);
    // Ejecutar las instrucciones de la función
    const Bloque_XQuery = require("../Bloque_XQuery");
    let _bloque = Bloque_XQuery.getIterators(funcion.sentencias, _ambito, tmp, _id);
    _ambito.tablaVariables = tmp.tablaVariables;
    if (_bloque.parametros)
        return _bloque.parametros[0];
    return _bloque;
}
module.exports = Exec;
