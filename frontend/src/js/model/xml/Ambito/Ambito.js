"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ambito = void 0;
var Ambito = /** @class */ (function () {
    function Ambito(_anterior, _tipo) {
        this.anterior = _anterior;
        this.tipo = _tipo;
        this.tablaSimbolos = [];
    }
    Ambito.prototype.isGlobal = function () {
        return this.tipo === "global";
    };
    Ambito.prototype.addSimbolo = function (_simbolo) {
        this.tablaSimbolos.push(_simbolo);
    };
    Ambito.prototype.getSimbolo = function (_s) {
        var e;
        for (e = this; e != null; e = e.anterior) {
            var encontrado = e.tablaSimbolos.find(function (element) { return element === _s; });
            if (encontrado)
                return encontrado;
        }
        return null;
    };
    Ambito.prototype.existeSimbolo = function (_s) {
        if (this.getSimbolo(_s) !== null)
            return true;
        else
            return false;
    };
    Ambito.prototype.actualizar = function (_s, _simbolo) {
        var e;
        var i = 0;
        for (e = this; e != null; e = e.anterior) {
            var encontrado = e.tablaSimbolos.find(function (element) { return element === _s; });
            if (encontrado) {
                this.tablaSimbolos[i] = _s;
                break;
            }
            i++;
        }
    };
    Ambito.prototype.getGlobal = function () {
        var e;
        for (e = this; e != null; e = e.anterior) {
            if (e.anterior === null)
                return e;
        }
        return null;
    };
    Ambito.prototype.concatAttributes = function (attributes) {
        var concat = "";
        attributes.forEach(function (attr) {
            concat = concat + attr.id + ": " + attr.value + ", ";
        });
        return concat.substring(0, concat.length - 2);
    };
    Ambito.prototype.getArraySymbols = function () {
        var _this = this;
        var simbolos = [];
        try {
            this.tablaSimbolos.forEach(function (element) {
                if (element.attributes || element.childs) {
                    var dad = _this.createSymbolElement(element, (element.father === null ? "global" : element.father));
                    simbolos.push(dad);
                    if (element.attributes) {
                        element.attributes.forEach(function (attribute) {
                            simbolos.push(_this.createSymbolAttribute(attribute, element.id_open));
                        });
                    }
                    if (element.childs) {
                        simbolos.concat(_this.toRunTree(simbolos, element.childs, dad.id));
                    }
                }
                else {
                    var symb = _this.createSymbolElement(element, (element.father === null ? "global" : element.father));
                    simbolos.push(symb);
                }
            });
            return simbolos;
        }
        catch (error) {
            console.log(error);
            return simbolos;
        }
    };
    Ambito.prototype.toRunTree = function (_symbols, _array, _father) {
        var _this = this;
        _array.forEach(function (element) {
            if (element.attributes || element.childs) {
                var dad = _this.createSymbolElement(element, _father);
                _symbols.push(dad);
                if (element.attributes) {
                    element.attributes.forEach(function (attribute) {
                        _symbols.push(_this.createSymbolAttribute(attribute, _father + "->" + element.id_open));
                    });
                }
                if (element.childs) {
                    var concat = _father + ("->" + dad.id);
                    _symbols.concat(_this.toRunTree(_symbols, element.childs, concat));
                }
            }
            else {
                var symb = _this.createSymbolElement(element, _father);
                _symbols.push(symb);
            }
        });
        return _symbols;
    };
    Ambito.prototype.createSymbolElement = function (_element, _entorno) {
        var type = (_element.id_close === null ? 'Tag simple' : 'Tag doble');
        var symb = {
            id: _element.id_open,
            value: _element.value,
            tipo: type,
            entorno: _entorno,
            linea: _element.line,
            columna: _element.column
        };
        return symb;
    };
    Ambito.prototype.createSymbolAttribute = function (_attribute, _entorno) {
        var symb = {
            id: _attribute.id,
            value: _attribute.value,
            tipo: "Atributo",
            entorno: _entorno,
            linea: _attribute.line,
            columna: _attribute.column
        };
        return symb;
    };
    return Ambito;
}());
exports.Ambito = Ambito;
