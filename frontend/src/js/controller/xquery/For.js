"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(require("../xpath/Expresion/Expresion"));
const Enum_1 = require("../../model/xpath/Enum");
const Where_1 = __importDefault(require("./Where"));
const OrderBy_1 = __importDefault(require("./OrderBy"));
const Return_1 = __importDefault(require("./Return"));
const Let_1 = __importDefault(require("./Let"));
const If_1 = __importDefault(require("./If"));
function ForLoop(_instruccion, _ambito, _contexto) {
    // console.log(_instruccion, 'instrucciones For')
    let declaracion = _instruccion.cuerpo;
    let iterators = [];
    for (let i = 0; i < declaracion.length; i++) {
        const _declaracion = declaracion[i];
        let it = Expresion_1.default(_declaracion, _ambito, _contexto);
        if (it === null || it.error)
            return it;
        iterators = iterators.concat(it);
    }
    for (let i = 0; i < _instruccion.instrucciones.length; i++) {
        const instr = _instruccion.instrucciones[i];
        if (instr.tipo === Enum_1.Tipos.LET_CLAUSE) { // Declara una variable y la almacena de primero en el ámbito
            Let_1.default(instr.id, instr.valor, _ambito, _contexto);
        }
        if (instr.tipo === Enum_1.Tipos.WHERE_CONDITION) { // Filtrar los elementos de cada variable
            let where = Where_1.default(instr.condiciones, _ambito, iterators);
            if (where === null || where.error)
                return where;
            iterators = where;
        }
        if (instr.tipo === Enum_1.Tipos.ORDER_BY_CLAUSE) { // Ordenar los elementos según los parámetros
            let filter = OrderBy_1.default(instr.ordenes, _ambito, iterators);
            if (filter.length > 0)
                iterators = filter;
        }
        if (instr.tipo === Enum_1.Tipos.IF_THEN_ELSE) { // En caso venga un if dentro del for
            return If_1.default(instr.condicionIf, instr.instruccionesThen, instr.instruccionesElse, _ambito, _contexto);
        }
        if (instr.tipo === Enum_1.Tipos.RETURN_STATEMENT) { // Retorna la salida
            return Return_1.default(instr.expresion, _ambito, iterators);
        }
    }
}
module.exports = ForLoop;
