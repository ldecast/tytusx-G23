"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ambito = void 0;
var Ambito = /** @class */ (function () {
    function Ambito(_anterior, _tipo) {
        this.anterior = _anterior;
        this.tipo = _tipo;
        this.tablaSimbolos = [];
    }
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
    Ambito.prototype.concatenarAtributos = function (attributes) {
        var concat = "";
        attributes.forEach(function (attr) {
            concat = concat + attr.value + "\n";
        });
        return concat.substring(0, concat.length - 2);
    };
    Ambito.prototype.getArraySimbols = function () {
        var _this = this;
        var simbolos = [];
        try {
            this.tablaSimbolos.forEach(function (element) {
                var type = (element.id_close === null ? 'Etiqueta simple' : 'Etiqueta doble');
                var attr = (element.attributes === null ? _this.concatenarAtributos(element.attributes) : '');
                var simb = {
                    id: element.id_open,
                    value: element.value,
                    tipo: type,
                    entorno: element.father,
                    atributos: attr,
                    linea: element.line,
                    columna: element.column
                };
                if (!simbolos.some(function (e) { return e === simb; })) {
                    simbolos.push(simb);
                }
            });
            return simbolos;
        }
        catch (error) {
            return simbolos;
        }
    };
    return Ambito;
}());
exports.Ambito = Ambito;
module.exports = Ambito;
