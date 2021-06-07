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
        console.log("tabla", this.tablaSimbolos);
        try {
            this.tablaSimbolos.forEach(function (element) {
                if (element.childs) {
                    var dad = _this.createSymbol(element, (element.father === null ? "global" : element.father));
                    simbolos.push(dad);
                    simbolos.concat(_this.toRunTree(simbolos, element.childs, dad.id));
                }
                else {
                    var symb = _this.createSymbol(element, (element.father === null ? "global" : element.father));
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
            if (element.childs) {
                var dad = _this.createSymbol(element, _father);
                _symbols.push(dad);
                var concat = _father + ("->" + dad.id);
                _symbols.concat(_this.toRunTree(_symbols, element.childs, concat));
            }
            else {
                var symb = _this.createSymbol(element, _father);
                _symbols.push(symb);
            }
        });
        return _symbols;
    };
    Ambito.prototype.createSymbol = function (_element, _entorno) {
        var type = (_element.id_close === null ? 'Simple' : 'Doble');
        var attr = (_element.attributes === null ? '' : this.concatAttributes(_element.attributes));
        var symb = {
            id: _element.id_open,
            value: _element.value,
            tipo: type,
            entorno: _entorno,
            atributos: attr,
            linea: _element.line,
            columna: _element.column
        };
        return symb;
    };
    return Ambito;
}());
exports.Ambito = Ambito;
