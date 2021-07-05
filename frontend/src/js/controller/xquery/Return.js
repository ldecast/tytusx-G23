"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = require("../../model/xpath/Enum");
const Expresion_1 = __importDefault(require("../xpath/Expresion/Expresion"));
const BuildElement_1 = __importDefault(require("./Expresion/BuildElement"));
function returnQuery(_expresion, _ambito, _iterators) {
    var _a;
    let expresion = [];
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { Contexto }
        let _x = Expresion_1.default(_expresion, _ambito, iterator, (_a = iterator.variable) === null || _a === void 0 ? void 0 : _a.id); // _expresion = [XPATH]
        if (_x && !_x.error)
            expresion = expresion.concat(_x);
        // console.log(_x)
    }
    let _str = BuildElement_1.default(expresion);
    if (_expresion.tipo === Enum_1.Tipos.HTML && !String(_str[0]).startsWith('<')) {
        _str.unshift({ valor: '<' + _expresion.id_open + '>' });
        _str.push({ valor: '</' + _expresion.id_close + '>' });
    }
    return { valor: writeReturn(_str), parametros: expresion };
}
function writeReturn(_expresion) {
    // console.log(_expresion, 3444);
    let cadena = "";
    let max = getMaxLength(_expresion);
    // console.log(max);
    for (let i = 0; i < max; i++) {
        for (let j = 0; j < _expresion.length; j++) {
            var exp = _expresion[j];
            if (exp.notFound)
                cadena += exp.notFound;
            if (exp.valor)
                cadena += exp.valor;
            else if (exp.items && exp.items.length > 0) {
                let shift = exp.items.shift();
                cadena += shift;
                exp.items.push(shift);
            }
            else if (Array.isArray(exp) && exp.length > 0) {
                let shift = exp.shift();
                if (shift.item)
                    cadena += shift.item;
                else
                    cadena += shift;
                exp = exp.push(shift);
            }
        }
        cadena += '\n';
    }
    // console.log(cadena)
    return cadena;
}
function getMaxLength(context) {
    let index = 1;
    context.forEach(element => {
        if (element.length > index)
            index = element.length;
        if (element.constructor.name == "Contexto")
            index = element.getLength();
    });
    return index;
}
module.exports = returnQuery;
