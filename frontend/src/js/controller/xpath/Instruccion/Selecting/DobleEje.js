"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../../model/xpath/Enum");
var Expresion_1 = __importDefault(require("../../Expresion/Expresion"));
function DobleEje(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: Enum_1.Tipos.NONE, retorno: Array() };
    var contexto;
    if (_contexto.retorno)
        contexto = _contexto.retorno;
    else
        contexto = null;
    var expresion = Expresion_1.default(_instruccion.expresion, _ambito, contexto);
    var root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        if (root.atributos.length === 0) {
            return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
        }
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = root.tipo;
    }
    else {
        return { err: "Expresión no válida.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root === null || root.length === 0)
        return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    retorno.retorno = root; //arreglo de elementos -> el contexto
    // Validar si tiene predicado, arroba antes, etc
    return retorno;
}
function getAllSymbolFromCurrent(_nodename, _contexto, _ambito) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito);
    else
        return getFromRoot(_nodename, _ambito);
}
function getFromCurrent(_id, _contexto, _ambito) {
    var elements = Array();
    var attributes = Array();
    var nodes = Array();
    // Selecciona todos los descencientes (elementos y/o texto)
    if (_id === "node()") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs) {
                element.childs.forEach(function (child) {
                    nodes = _ambito.nodesFunction(child, nodes);
                });
            }
            else if (element.value)
                nodes.push({ textos: element.value });
        }
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes };
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
    // Selecciona todos los descendientes con el id
    else {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            if (element.childs)
                element.childs.forEach(function (child) {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        }
        return elements;
    }
}
function getFromRoot(_id, _ambito) {
    var elements = Array();
    var attributes = Array();
    var text = Array();
    // Selecciona todos los descencientes (elementos y/o texto)
    if (_id === "node()") {
        var nodes_1 = Array();
        _ambito.tablaSimbolos.forEach(function (element) {
            // if (element.childs) {
            //     element.childs.forEach(child => {
            nodes_1 = _ambito.nodesFunction(element, nodes_1);
            // });
            // }
            // else if (element.value)
            //     nodes.push({ textos: element.value });
        });
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_1 };
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
        return a_1;
    }
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        return elements;
    }
    // Selecciona todos los descendientes con el id
    else {
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.id_open === _id)
                elements.push(element);
            if (element.childs)
                element.childs.forEach(function (child) {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        });
        return elements;
    }
}
function getAllTexts(_element, _cadena) {
    if (_element.childs) {
        _element.childs.forEach(function (child) {
            _cadena = getAllTexts(child, _cadena);
        });
    }
    else if (_element.value)
        _cadena.push(_element.value);
    return _cadena;
}
module.exports = DobleEje;
