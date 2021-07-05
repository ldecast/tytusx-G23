"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(require("../xpath/Expresion/Expresion"));
function OrderBy(_instruccion, _ambito, _iterators) {
    var _a;
    let sorted = [];
    try {
        for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
            const iterator = _iterators[i]; // { Contexto }
            let _x = Expresion_1.default(_instruccion, _ambito, iterator, (_a = iterator.variable) === null || _a === void 0 ? void 0 : _a.id); // _instruccion = [comparissons]
            if (_x && !_x.error)
                sorted.push(sortIterators(_x, iterator));
        }
    }
    catch (error) {
        console.log(error);
    }
    return sorted;
}
function sortIterators(_contexto, _root) {
    let array = _contexto.removeDadDuplicates();
    let swapped = true;
    do {
        swapped = false;
        for (let j = 0; j < array.length; j++) {
            if (array[j + 1])
                if (array[j].value.charCodeAt(0) > array[j + 1].value.charCodeAt(0)) { // Compara valor inicial de ASCII
                    let temp = array[j];
                    let tmp = _root.elementos[j];
                    array[j] = array[j + 1];
                    _root.elementos[j] = _root.elementos[j + 1];
                    array[j + 1] = temp;
                    _root.elementos[j + 1] = tmp;
                    swapped = true;
                }
        }
    } while (swapped);
    return _root;
}
module.exports = OrderBy;
