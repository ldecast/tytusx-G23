"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../../model/xpath/Enum");
var Expresion_1 = __importDefault(require("../../Expresion/Expresion"));
var Predicate_1 = require("./Predicate");
function SelectAxis(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: Enum_1.Tipos.NONE, elementos: null };
    var _404 = { notFound: "No se encontraron elementos." };
    var contexto = (_contexto.elementos) ? (_contexto.elementos) : null;
    var expresion = Expresion_1.default(_instruccion, _ambito, contexto);
    if (expresion.error)
        return expresion;
    var root = getAxis(expresion.axisname, expresion.nodetest, expresion.predicate, contexto, _ambito);
    if (root === null || root.error || root.elementos.length === 0)
        return _404;
    if (root.elementos.error)
        return root.elementos;
    retorno = root;
    return retorno;
}
function getAxis(_axisname, _nodetest, _predicate, _contexto, _ambito) {
    if (_contexto)
        return firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito);
    else
        return { error: "Indstrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
}
// Revisa el axisname y extrae los elementos
function firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito) {
    var elements = Array();
    var attributes = Array();
    var cadena = Enum_1.Tipos.ELEMENTOS;
    var flag;
    var index;
    switch (_axisname) {
        case Enum_1.Tipos.AXIS_ANCESTOR: // Selects all ancestors (parent, grandparent, etc.) of the current node
        case Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF: // Selects all ancestors (parent, grandparent, etc.) of the current node and the current node itself
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                if (_axisname === Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF)
                    elements.push(element);
                var dad = element.father;
                if (dad) {
                    elements = _ambito.compareCurrent(element, elements, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_ATTRIBUTE: // Selects all attributes of the current node
            flag = false;
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                if (element.attributes)
                    element.attributes.forEach(function (attribute) {
                        attributes.push(attribute);
                        flag = true;
                    });
                if (flag) {
                    // a.elementos.push(element);
                    elements.push(element);
                    flag = false;
                }
            }
            cadena = Enum_1.Tipos.ATRIBUTOS;
            break;
        case Enum_1.Tipos.AXIS_CHILD: // Selects all children of the current node
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                if (element.childs)
                    element.childs.forEach(function (child) {
                        elements.push(child);
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_DESCENDANT: // Selects all descendants (children, grandchildren, etc.) of the current node
        case Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF: // Selects all descendants (children, grandchildren, etc.) of the current node and the current node itself
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                if (_axisname === Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF)
                    elements.push(element);
                if (element.childs)
                    element.childs.forEach(function (child) {
                        elements = _ambito.searchNodes("*", child, elements);
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_FOLLOWING: // Selects everything in the document after the closing tag of the current node
        case Enum_1.Tipos.AXIS_PRECEDING: // Selects all nodes that appear before the current node in the document
        case Enum_1.Tipos.AXIS_FOLLOWING_SIBLING: // Selects all siblings after the current node:
        case Enum_1.Tipos.AXIS_PRECEDING_SIBLING: // Selects all siblings before the current node
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                var dad = element.father;
                if (dad && (_axisname === Enum_1.Tipos.AXIS_PRECEDING || _axisname === Enum_1.Tipos.AXIS_PRECEDING_SIBLING)) {
                    elements = _ambito.compareCurrent(element, elements, _axisname);
                }
                else if (_axisname === Enum_1.Tipos.AXIS_FOLLOWING || _axisname === Enum_1.Tipos.AXIS_FOLLOWING_SIBLING) {
                    elements = _ambito.compareCurrent(element, elements, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_NAMESPACE: // Selects all namespace nodes of the current node
            return { error: "Error: la funcionalidad 'namespace' no está disponible.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
        case Enum_1.Tipos.AXIS_PARENT: // Selects the parent of the current node
            var _loop_1 = function (i) {
                var element = _contexto[i];
                var dad = element.father;
                if (dad)
                    _ambito.tablaSimbolos.forEach(function (elm) {
                        if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                            elements.push(elm);
                        if (elm.childs)
                            elm.childs.forEach(function (child) {
                                elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                            });
                    });
            };
            for (var i = 0; i < _contexto.length; i++) {
                _loop_1(i);
            }
            break;
        case Enum_1.Tipos.AXIS_SELF: // Selects the current node
            for (var i = 0; i < _contexto.length; i++) {
                var element = _contexto[i];
                elements.push(element);
            }
            break;
        default:
            return { error: "Error: axisname no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }
    return secondFilter(elements, attributes, _nodetest, _predicate, cadena, _ambito);
}
// Revisa el nodetest y busca hacer match
function secondFilter(_elements, _atributos, _nodetest, _predicate, _cadena, _ambito) {
    var elements = Array();
    var attributes = Array();
    var text = Array();
    var valor = _nodetest.valor;
    switch (_nodetest.tipo) {
        case Enum_1.Tipos.ELEMENTOS:
        case Enum_1.Tipos.ASTERISCO:
        case Enum_1.Tipos.FUNCION_TEXT:
            for (var i = 0; i < _elements.length; i++) {
                var element = _elements[i];
                if (_nodetest.tipo === Enum_1.Tipos.FUNCION_TEXT && element.value) {
                    text.push(element.value);
                    elements.push(element);
                    _cadena = Enum_1.Tipos.TEXTOS;
                }
                else if (_atributos.length > 0) {
                    if (element.attributes) {
                        for (var j = 0; j < element.attributes.length; j++) {
                            var attribute = element.attributes[j];
                            if (attribute.id == valor || valor === "*") {
                                elements.push(element);
                                attributes.push(attribute);
                                break; // Sale del ciclo de atributos para pasar al siguiente elemento
                            }
                            if (attribute.value == valor) {
                                elements.push(element);
                                attributes.push(attribute);
                                break;
                            }
                        }
                    }
                }
                else if (element.id_open == valor || valor == "*") {
                    if (_nodetest.tipo === Enum_1.Tipos.FUNCION_TEXT)
                        text.push(element.value);
                    elements.push(element);
                }
                else if (element.value == valor || valor == "*") {
                    if (_nodetest.tipo === Enum_1.Tipos.FUNCION_TEXT)
                        text.push(element.value);
                    elements.push(element);
                }
            }
            break;
        default:
            return { error: "Error: nodetest no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }
    if (_predicate)
        elements = thirdFilter(elements, attributes, _predicate, _ambito);
    return { elementos: elements, atributos: attributes, texto: text, cadena: _cadena };
}
// En caso de tener algún predicado
function thirdFilter(_elements, _atributos, _predicate, _ambito) {
    var filter = new Predicate_1.Predicate(_predicate, _ambito, _elements);
    _elements = filter.filterElements(_elements);
    return _elements;
}
module.exports = { SA: SelectAxis, GetAxis: getAxis };
