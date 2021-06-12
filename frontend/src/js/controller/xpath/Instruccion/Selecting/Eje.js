"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../../model/xpath/Enum");
var Expresion_1 = __importDefault(require("../../Expresion/Expresion"));
function Eje(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: Enum_1.Tipos.NONE, retorno: null };
    var contexto;
    if (_contexto.retorno)
        contexto = _contexto.retorno;
    else
        contexto = null;
    var expresion = Expresion_1.default(_instruccion.expresion, _ambito, contexto);
    var root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        if (root.atributos.length === 0) {
            return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
        }
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = root.tipo;
    }
    else {
        return { err: "Expresión no válida.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root.length === 0 || root === null)
        return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    retorno.retorno = root; //arreglo de elementos -> el contexto
    return retorno;
}
function getSymbolFromRoot(_nodename, _contexto, _ambito) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito);
    else
        return getFromRoot(_nodename, _ambito);
}
function getFromCurrent(_id, _contexto, _ambito) {
    var elements = Array();
    var attributes = Array();
    var text = Array();
    // Selecciona todos los hijos (elementos o texto)
    if (_id === "node()") {
        var nodes_1 = Array();
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs)
                element.childs.forEach(function (child) {
                    nodes_1.push({ elementos: child });
                });
            else if (element.value)
                nodes_1.push({ textos: element.value });
        }
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_1 };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs) {
                element.childs.forEach(function (child) {
                    elements.push(child);
                });
            }
        }
        return elements;
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        var flag_1 = false;
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.attributes)
                element.attributes.forEach(function (attribute) {
                    if ((_id.id === attribute.id) || (_id.id === "*")) { // En caso de que sea un id ó @*
                        attributes.push(attribute);
                        flag_1 = true;
                    }
                });
            if (flag_1) {
                elements.push(element);
                flag_1 = false;
            }
        }
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el padre
    else if (_id === "..") {
        if (_contexto.atributos) {
            var _loop_1 = function (i) {
                var attribute = _contexto.atributos[i];
                _ambito.tablaSimbolos.forEach(function (elm) {
                    elements = _ambito.searchDadFromAttribute(elm, attribute, elements);
                });
            };
            for (var i = 0; i < _contexto.atributos.length; i++) {
                _loop_1(i);
            }
            return elements;
        }
        var _loop_2 = function (i) {
            var element = _contexto[i];
            var dad = element.father;
            if (dad) {
                _ambito.tablaSimbolos.forEach(function (elm) {
                    if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                        elements.push(elm);
                    if (elm.childs)
                        elm.childs.forEach(function (child) {
                            elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                        });
                });
            }
        };
        for (var i = 0; i < _contexto.length; i++) {
            _loop_2(i);
        }
        return elements;
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            elements.push(element);
        }
        return elements;
    }
    // Búsqueda en los hijos por id
    else {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs) {
                element.childs.forEach(function (child) {
                    elements = _ambito.searchSingleNode(_id, child, elements);
                });
            }
        }
        return elements;
    }
}
function getFromRoot(_id, _ambito) {
    var elements = Array();
    var attributes = Array();
    var text = Array();
    // Selecciona todos los hijos (elementos o texto)
    if (_id === "node()") {
        var nodes_2 = Array();
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.childs)
                // element.childs.forEach(child => {
                nodes_2.push({ elementos: element });
            // });
            else if (element.value)
                nodes_2.push({ textos: element.value });
        });
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_2 };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        return elements;
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        var flag_2 = false;
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.attributes)
                element.attributes.forEach(function (attribute) {
                    if ((_id.id === attribute.id) || (_id.id === "*")) {
                        flag_2 = true;
                        attributes.push(attribute);
                    }
                });
            if (flag_2) {
                elements.push(element);
                flag_2 = false;
            }
        });
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        return elements;
    }
    // Búsqueda por id
    else {
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.id_open === _id)
                elements.push(element);
        });
        return elements;
    }
}
module.exports = Eje;
