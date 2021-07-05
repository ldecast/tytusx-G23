"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Expresion_1 = __importDefault(require("../xpath/Expresion/Expresion"));
function WhereClause(_instruccion, _ambito, _iterators) {
    var _a;
    let iterators = [];
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { Contexto }
        let _x = Expresion_1.default(_instruccion, _ambito, iterator, (_a = iterator.variable) === null || _a === void 0 ? void 0 : _a.id); // _instruccion = [comparissons]
        if (!_x || _x.error)
            return _x;
        iterators = iterators.concat(_x);
    }
    // console.log(iterators)
    return iterators;
}
module.exports = WhereClause;
