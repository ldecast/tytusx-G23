"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../../model/xpath/Enum");
var Expresion_1 = __importDefault(require("../../Expresion/Expresion"));
var Predicate_1 = require("./Predicate");
function Eje(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: Enum_1.Tipos.NONE, retorno: null };
    var err = { err: "No se encontraron elementos.", linea: _instruccion.linea, columna: _instruccion.columna };
    var contexto = (_contexto.retorno) ? (_contexto.retorno) : null;
    var expresion = Expresion_1.default(_instruccion.expresion.expresion, _ambito, contexto);
    if (expresion.err)
        return expresion;
    var predicate = _instruccion.expresion.predicate;
    var root;
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot({ id: expresion.valor, tipo: "@" }, contexto, _ambito, predicate);
        if (root.atributos.length === 0)
            return err;
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        if (root.nodos.length === 0)
            return err;
        retorno.cadena = root.tipo;
    }
    else {
        return { err: "Expresión no válida.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root.err)
        return root;
    if (root.length === 0 || root === null)
        return err;
    retorno.retorno = root;
    return retorno;
}
function getSymbolFromRoot(_nodename, _contexto, _ambito, _condicion) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion);
    else
        return getFromRoot(_nodename, _ambito, _condicion);
}
// Desde el ámbito actual
function getFromCurrent(_id, _contexto, _ambito, _condicion) {
    var elements = Array();
    var attributes = Array();
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            nodes_1 = filter.filterElements(nodes_1);
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            attributes = filter.filterElements(attributes);
            elements = filter.contexto;
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        for (var i = 0; i < _contexto.length; i++) {
            var element = _contexto[i];
            elements.push(element);
        }
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
}
// Desde la raíz
function getFromRoot(_id, _ambito, _condicion) {
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            nodes_2 = filter.filterElements(nodes_2);
        }
        return { tipo: Enum_1.Tipos.COMBINADO, nodos: nodes_2 };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
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
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            attributes = filter.filterElements(attributes);
            elements = filter.contexto;
        }
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        _ambito.tablaSimbolos.forEach(function (element) {
            elements.push(element);
        });
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
    // Búsqueda por id
    else {
        _ambito.tablaSimbolos.forEach(function (element) {
            if (element.id_open === _id)
                elements.push(element);
        });
        if (_condicion) {
            var filter = new Predicate_1.Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
}
module.exports = Eje;
