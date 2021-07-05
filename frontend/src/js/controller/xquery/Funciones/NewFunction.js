"use strict";
const Funcion_1 = require("../../Funcion");
function NewFunction(_instr, _ambito, _contexto) {
    let name = _instr.name;
    let parametros = _instr.parametros;
    let tipado = _instr.tipado;
    let sentencias = _instr.instrucciones;
    _ambito.addFunction(new Funcion_1.Funcion(name, parametros, sentencias, tipado, _instr.linea, _instr.columna));
}
module.exports = NewFunction;
