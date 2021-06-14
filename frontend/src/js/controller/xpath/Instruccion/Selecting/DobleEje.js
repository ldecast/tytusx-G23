"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../../model/xpath/Enum");
var Expresion_1 = __importDefault(require("../../Expresion/Expresion"));
var Predicate_1 = require("./Predicate");
function DobleEje(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: Enum_1.Tipos.NONE, retorno: Array() };
    var _404 = { notFound: "No se encontraron elementos." };
    var contexto = (_contexto.retorno) ? (_contexto.retorno) : null;
    var expresion = Expresion_1.default(_instruccion.expresion.expresion, _ambito, contexto);
    if (expresion.error)
        return expresion;
    var predicate = _instruccion.expresion.predicate;
    var root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getAllSymbolFromCurrent({ id: expresion.valor, tipo: "@" }, contexto, _ambito, predicate);
        if (root.atributos.length === 0)
            return _404;
        if (root.atributos.error)
            return root.atributos;
        if (root.elementos.error)
            return root.elementos;
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
        if (root.nodos.length === 0)
            return _404;
        if (root.nodos.error)
            return root.nodos;
        retorno.cadena = root.tipo;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito, predicate);
        if (root.texto.length === 0)
            return _404;
        if (root.texto.error)
            return root.texto;
        retorno.cadena = Enum_1.Tipos.TEXTOS;
    }
    else {
        return { error: "Expresión no válida.", tipo: "Semántico", origen: "Query", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root.error)
        return root;
    if (root.length === 0 || root === null)
        return _404;
    retorno.retorno = root;
    return retorno;
}
function getAllSymbolFromCurrent(_nodename, _contexto, _ambito, _condicion) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion);
    else
        return getFromRoot(_nodename, _ambito, _condicion);
}
function getFromCurrent(_id, _contexto, _ambito, _condicion) {
    var elements = Array();
    var attributes = Array();
    var nodes = Array();
    // Selecciona únicamente el texto contenido en el nodo y todos sus descendientes
    if (_id === "text()") {
        var text = Array();
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            text = _ambito.searchAnyText(element, text);
            elements.push(element);
        }
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            text = filter.filterElements(text);
        }
        return { texto: text, elementos: elements };
    }
    // Selecciona todos los descencientes (elementos y/o texto)
    else if (_id === "node()") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs) {
                element.childs.forEach(function (child) {
                    nodes = _ambito.nodesFunction(child, nodes);
                });
            }
            else if (element.value)
                nodes.push({ textos: element.value });
            elements.push(element);
        }
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            nodes = filter.filterElements(nodes);
            elements = filter.contexto;
        }
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes, elementos: elements };
    }
    // Selecciona todos los atributos a partir del contexto
    else if (_id.tipo === "@") {
        var a = { atributos: attributes, elementos: elements };
        if (_id.id === "*") {
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                a = _ambito.searchAnyAttributes(element, attributes, elements);
            }
        }
        else {
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                a = _ambito.searchAttributesFromCurrent(element, _id.id, attributes, elements);
            }
        }
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, a.elementos);
            a.atributos = filter.filterElements(a.atributos);
            a.elementos = filter.contexto;
        }
        return a;
    }
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
            if (_condicion) {
                var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
                elements = filter.filterElements(elements);
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
    // Selecciona todos los descendientes con el id
    else {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs)
                element.childs.forEach(function (child) {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        }
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
}
function getFromRoot(_id, _ambito, _condicion) {
    var elements = Array();
    var attributes = Array();
    // Selecciona únicamente el texto contenido en el nodo y todos sus descendientes
    if (_id === "text()") {
        var text_1 = Array();
        _ambito.tablaSimbolos.forEach(function (element) {
            text_1 = _ambito.searchAnyText(element, text_1);
            elements.push(element);
        });
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            text_1 = filter.filterElements(text_1);
            elements = filter.contexto;
        }
        return { texto: text_1, elementos: elements };
    }
    // Selecciona todos los descencientes (elementos y/o texto)
    else if (_id === "node()") {
        var nodes_1 = Array();
        _ambito.tablaSimbolos.forEach(function (element) {
            nodes_1 = _ambito.nodesFunction(element, nodes_1);
            elements.push(element);
        });
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            nodes_1 = filter.filterElements(nodes_1);
            elements = filter.contexto;
        }
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_1, elementos: elements };
    }
    // Selecciona todos los atributos a partir de la raíz
    else if (_id.tipo === "@") {
        var a_1 = { atributos: attributes, elementos: elements };
        _ambito.tablaSimbolos.forEach(function (element) {
            if (_id.id === "*")
                a_1 = _ambito.searchAnyAttributes(element, attributes, elements);
            else
                a_1 = _ambito.searchAttributesFromCurrent(element, _id.id, attributes, elements);
        });
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, a_1.elementos);
            a_1.atributos = filter.filterElements(a_1.atributos);
            a_1.elementos = filter.contexto;
        }
        return a_1;
    }
    // Selecciona todos los descendientes con el id o si es un *
    else {
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.id_open === _id || _id === "*")
                elements.push(element);
            if (element.childs)
                element.childs.forEach(function (child) {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        });
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
}
module.exports = DobleEje;
