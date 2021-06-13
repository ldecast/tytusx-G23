"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Predicate = void 0;
var Enum_1 = require("../../../../model/xpath/Enum");
var Expresion_1 = __importDefault(require("../../Expresion/Expresion"));
var Predicate = /** @class */ (function () {
    function Predicate(_predicado, _ambito, _contexto) {
        this.predicado = _predicado;
        this.contexto = _contexto;
        this.ambito = _ambito;
    }
    Object.defineProperty(Predicate.prototype, "setContext", {
        set: function (v) {
            this.contexto = v;
        },
        enumerable: false,
        configurable: true
    });
    Predicate.prototype.filterElements = function () {
        var expresion;
        for (var i = 0; i < this.predicado.length; i++) {
            var e = this.predicado[i];
            console.log(e, 8277237281);
            expresion = Expresion_1.default(e.condicion, this.ambito, this.contexto);
            if (expresion.err)
                return expresion;
            // En caso de ser una posición en los elementos
            if (expresion.tipo === Enum_1.Tipos.NUMBER) {
                var index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= this.contexto.length)
                    this.contexto = [];
                else
                    this.contexto = [this.contexto[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_LAST) {
                var index = this.contexto.length - 1;
                this.contexto = [this.contexto[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_POSITION) {
                return this.contexto;
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_MENOR) {
                var index = parseInt(expresion.valor) - 1;
                if (index >= this.contexto.length)
                    index = this.contexto.length - 1;
                var tmp = [];
                for (var i_1 = index; i_1 <= this.contexto.length && i_1 >= 0; i_1--) {
                    var element = this.contexto[i_1];
                    tmp.push(element);
                }
                this.contexto = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_MAYOR) {
                var index = parseInt(expresion.valor) - 1;
                if (index >= this.contexto.length) {
                    this.contexto = [];
                    return this.contexto;
                }
                if (index <= 0)
                    index = 0;
                var tmp = [];
                for (var i_2 = index; i_2 < this.contexto.length; i_2++) {
                    var element = this.contexto[i_2];
                    tmp.push(element);
                }
                this.contexto = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_IGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
                var flag = expresion.valor;
                if (!flag)
                    this.contexto = [];
            }
            else if (expresion.tipo === Enum_1.Tipos.EXCLUDE) {
                var index = parseInt(expresion.valor) - 1;
                if (index >= 0 && index < this.contexto.length) {
                    var tmp = [];
                    for (var i_3 = 0; i_3 < this.contexto.length; i_3++) {
                        var element = this.contexto[i_3];
                        if (i_3 != index)
                            tmp.push(element);
                    }
                    this.contexto = tmp;
                }
            }
        }
        return this.contexto;
    };
    Predicate.prototype.filterAttributes = function (_attributes) {
        var expresion;
        for (var i = 0; i < this.predicado.length; i++) {
            var e = this.predicado[i];
            expresion = Expresion_1.default(e.condicion, this.ambito, this.contexto);
            if (expresion.err)
                return expresion;
            // En caso de ser una posición en los elementos
            if (expresion.tipo === Enum_1.Tipos.NUMBER) {
                var index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _attributes.length)
                    _attributes = [];
                else
                    _attributes = [_attributes[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_LAST) {
                var index = _attributes.length - 1;
                _attributes = [_attributes[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_POSITION) {
                return _attributes;
            }
        }
        return _attributes;
    };
    Predicate.prototype.filterNodes = function (_nodes) {
        var expresion;
        for (var i = 0; i < this.predicado.length; i++) {
            var e = this.predicado[i];
            expresion = Expresion_1.default(e.condicion, this.ambito, this.contexto);
            if (expresion.err)
                return expresion;
            // En caso de ser una posición en los elementos
            if (expresion.tipo === Enum_1.Tipos.NUMBER) {
                var index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _nodes.length)
                    _nodes = [];
                else
                    _nodes = [_nodes[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_LAST) {
                var index = _nodes.length - 1;
                _nodes = [_nodes[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_POSITION) {
                return _nodes;
            }
        }
        return _nodes;
    };
    return Predicate;
}());
exports.Predicate = Predicate;
