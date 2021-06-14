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
    Predicate.prototype.filterElements = function (_resultado) {
        var _this = this;
        var expresion;
        var _loop_1 = function (i) {
            var e = this_1.predicado[i]; // En caso de tener varios predicados seguidos
            console.log(e, "Predicado");
            expresion = Expresion_1.default(e.condicion, this_1.ambito, this_1.contexto);
            console.log(expresion, "Expresion predicado");
            if (expresion.error)
                return { value: expresion };
            if (expresion.tipo === Enum_1.Tipos.NUMBER) {
                var index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _resultado.length)
                    _resultado = [];
                else
                    _resultado = [_resultado[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
                var tmp_1 = [];
                this_1.contexto = [];
                _resultado.forEach(function (element) {
                    if (element.attributes)
                        for (var i_1 = 0; i_1 < element.attributes.length; i_1++) {
                            var attribute = element.attributes[i_1];
                            if (expresion.atributo) { // Es una comparación
                                if (expresion.desigualdad) { // (<,<=,>,>=)
                                    if (expresion.atributo == attribute.id && _this.operarDesigualdad(expresion.desigualdad, expresion.condicion, attribute.value)) {
                                        tmp_1.push(element);
                                        _this.contexto.push(element);
                                        break;
                                    }
                                }
                                else if (expresion.exclude) { // (!=)
                                    if (expresion.atributo == attribute.id && expresion.condicion != attribute.value) {
                                        tmp_1.push(element);
                                        _this.contexto.push(element);
                                        break;
                                    }
                                }
                                else if (expresion.atributo == attribute.id && expresion.condicion == attribute.value) { // (==)
                                    tmp_1.push(element);
                                    _this.contexto.push(element);
                                    break;
                                }
                            }
                            else if (expresion.valor == attribute.id || expresion.valor == "*") { // No compara valor, sólo apila
                                tmp_1.push(element);
                                _this.contexto.push(element);
                                break;
                            }
                        }
                });
                _resultado = tmp_1;
                return { value: _resultado };
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
                this_1.contexto = [];
                for (var i_2 = 0; i_2 < _resultado.length; i_2++) {
                    var element = _resultado[i_2];
                    var text = element.value;
                    if (text) {
                        if (expresion.exclude) {
                            if (text != expresion.condicion) // text() != 'x'
                                this_1.contexto.push(element);
                        }
                        else if (text == expresion.condicion) // text() == 'x'
                            this_1.contexto.push(element);
                    }
                }
                return { value: this_1.contexto };
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_LAST) {
                var index = _resultado.length - 1;
                _resultado = [_resultado[index]];
            }
            else if (expresion.tipo === Enum_1.Tipos.FUNCION_POSITION) {
                return { value: _resultado };
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_MENOR) {
                var index = parseInt(expresion.valor) - 1;
                if (index >= _resultado.length)
                    index = _resultado.length - 1;
                var tmp = [];
                for (var i_3 = index; i_3 <= _resultado.length && i_3 >= 0; i_3--) {
                    var element = _resultado[i_3];
                    tmp.push(element);
                }
                _resultado = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_MAYOR) {
                var index = parseInt(expresion.valor) - 1;
                if (index >= _resultado.length) {
                    _resultado = [];
                    return { value: _resultado };
                }
                if (index <= 0)
                    index = 0;
                var tmp = [];
                for (var i_4 = index; i_4 < _resultado.length; i_4++) {
                    var element = _resultado[i_4];
                    tmp.push(element);
                }
                _resultado = tmp;
            }
            else if (expresion.tipo === Enum_1.Tipos.RELACIONAL_IGUAL || expresion.tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
                var flag = expresion.valor;
                if (!flag)
                    _resultado = [];
            }
            else if (expresion.tipo === Enum_1.Tipos.EXCLUDE) {
                var index = parseInt(expresion.valor) - 1;
                if (index >= 0 && index < _resultado.length) {
                    var tmp = [];
                    for (var i_5 = 0; i_5 < _resultado.length; i_5++) {
                        var element = _resultado[i_5];
                        if (i_5 != index)
                            tmp.push(element);
                    }
                    _resultado = tmp;
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.predicado.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        this.contexto = _resultado;
        return this.contexto;
    };
    Predicate.prototype.operarDesigualdad = function (_tipo, _condicion, _valor) {
        switch (_tipo) {
            case Enum_1.Tipos.RELACIONAL_MAYOR:
                return _valor > _condicion;
            case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
                return _valor >= _condicion;
            case Enum_1.Tipos.RELACIONAL_MENOR:
                return _valor < _condicion;
            case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
                return _valor <= _condicion;
            default:
                return false;
        }
    };
    return Predicate;
}());
exports.Predicate = Predicate;
