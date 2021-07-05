"use strict";
const Enum_1 = require("../../../../model/xpath/Enum");
function filterElements(valor, desigualdad, _contexto, _root) {
    try {
        let condition = false;
        let out = [];
        let array = _contexto.removeDadDuplicates();
        for (let i = 0; i < array.length; i++) {
            const obj = array[i];
            condition = verificarDesigualdad(desigualdad, obj, valor);
            if (condition) { // Si la condición cumple, apilar los elementos en esa posición
                out.push(_root.elementos[i]);
            }
        }
        _root.elementos = out;
        // console.log(_root,33333333333333)
        return [_root];
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
function verificarDesigualdad(_tipo, v1, e1) {
    switch (_tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return (v1.value > e1) || (v1.id > e1);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return (v1.value >= e1) || (v1.id >= e1);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return (v1.value < e1) || (v1.id < e1);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return (v1.value <= e1) || (v1.id <= e1);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return (v1.value == e1) || (v1.id == e1);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return (v1.value != e1) && (v1.id != e1);
        default:
            return false;
    }
}
module.exports = filterElements;
