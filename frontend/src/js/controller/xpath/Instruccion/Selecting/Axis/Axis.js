"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = require("../../../../../model/xpath/Enum");
const Expresion_1 = __importDefault(require("../../../Expresion/Expresion"));
const Predicate_1 = require("../Predicate");
const Contexto_1 = require("../../../../Contexto");
const Variable_1 = require("../../../../../model/xml/Ambito/Variable");
function SelectAxis(_instruccion, _ambito, _contexto, id) {
    let _404 = "No se encontraron elementos.";
    let expresion = Expresion_1.default(_instruccion, _ambito, _contexto, id);
    if (expresion === null || expresion.error)
        return expresion;
    let root = getAxis(expresion.axisname, expresion.nodetest, expresion.predicate, _contexto, _ambito, false, id);
    if (root === null || root.error || root.getLength() === 0)
        root.notFound = _404;
    return root;
}
function getAxis(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar, id) {
    if (_contexto.getLength() > 0)
        return firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar, id);
    else {
        _contexto.error = { error: "Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
        return _contexto;
    }
}
// Revisa el axisname y extrae los elementos
function firstFiler(_axisname, _nodetest, _predicate, _contexto, _ambito, _isDoubleBar, id) {
    let retorno = new Contexto_1.Contexto();
    if (id) {
        retorno.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
    }
    retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    switch (_axisname) {
        case Enum_1.Tipos.AXIS_ANCESTOR: // Selects all ancestors (parent, grandparent, etc.) of the current node
        case Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF: // Selects all ancestors (parent, grandparent, etc.) of the current node and the current node itself
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_axisname === Enum_1.Tipos.AXIS_ANCESTOR_OR_SELF) {
                    if (element.father)
                        retorno.elementos.push(element);
                    else
                        retorno.elementos.push(element.childs[0]);
                }
                if (element.father) {
                    retorno.elementos = _ambito.compareCurrent(element, retorno.elementos, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_ATTRIBUTE: // Selects all attributes of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_isDoubleBar) {
                    retorno.atributos = _ambito.searchAnyAttributes("*", element, retorno.atributos);
                }
                else if (element.attributes)
                    element.attributes.forEach((attribute) => {
                        retorno.atributos.push(attribute);
                    });
            }
            retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
            break;
        case Enum_1.Tipos.AXIS_CHILD: // Selects all children of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_isDoubleBar) {
                    if (element.father)
                        retorno.elementos = _ambito.searchNodes("*", element, retorno.elementos);
                    else
                        retorno.elementos = _ambito.searchNodes("*", element.childs[0], retorno.elementos);
                }
                else if (element.childs)
                    element.childs.forEach((child) => {
                        retorno.elementos.push(child);
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_DESCENDANT: // Selects all descendants (children, grandchildren, etc.) of the current node
        case Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF: // Selects all descendants (children, grandchildren, etc.) of the current node and the current node itself
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_axisname === Enum_1.Tipos.AXIS_DESCENDANT_OR_SELF) {
                    if (element.father)
                        retorno.elementos.push(element);
                    // else elements.push(element.childs[0]);
                }
                if (element.father)
                    retorno.elementos = _ambito.searchNodes("*", element, retorno.elementos);
                else
                    retorno.elementos = _ambito.searchNodes("*", element.childs[0], retorno.elementos);
            }
            break;
        case Enum_1.Tipos.AXIS_FOLLOWING: // Selects everything in the document after the closing tag of the current node
        case Enum_1.Tipos.AXIS_PRECEDING: // Selects all nodes that appear before the current node in the document
        case Enum_1.Tipos.AXIS_FOLLOWING_SIBLING: // Selects all siblings after the current node:
        case Enum_1.Tipos.AXIS_PRECEDING_SIBLING: // Selects all siblings before the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                let dad = element.father;
                if (dad && (_axisname === Enum_1.Tipos.AXIS_PRECEDING || _axisname === Enum_1.Tipos.AXIS_PRECEDING_SIBLING)) {
                    retorno.elementos = _ambito.compareCurrent(element, retorno.elementos, _axisname);
                }
                else if (_axisname === Enum_1.Tipos.AXIS_FOLLOWING || _axisname === Enum_1.Tipos.AXIS_FOLLOWING_SIBLING) {
                    retorno.elementos = _ambito.compareCurrent(element, retorno.elementos, _axisname);
                }
            }
            break;
        case Enum_1.Tipos.AXIS_NAMESPACE: // Selects all namespace nodes of the current node
            retorno.error = { error: "Error: la funcionalidad 'namespace' no está disponible.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
            break;
        case Enum_1.Tipos.AXIS_PARENT: // Selects the parent of the current node
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                let dad = element.father;
                if (dad)
                    _ambito.tablaSimbolos.forEach(elm => {
                        if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                            retorno.elementos.push(elm);
                        if (elm.childs)
                            elm.childs.forEach(child => {
                                retorno.elementos = _ambito.searchDad(child, dad.id, dad.line, dad.column, retorno.elementos);
                            });
                    });
            }
            break;
        case Enum_1.Tipos.AXIS_SELF: // Selects the current node
            retorno = _contexto;
            break;
        default:
            retorno.error = { error: "Error: axisname no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
            break;
    }
    return secondFilter(retorno, _nodetest, _predicate, _ambito, _isDoubleBar);
}
// Revisa el nodetest y busca hacer match
function secondFilter(_contexto, _nodetest, _predicate, _ambito, _isDoubleBar, id) {
    let valor = _nodetest.valor;
    let retorno = new Contexto_1.Contexto();
    if (id) {
        retorno.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
    }
    retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    switch (_nodetest.tipo) {
        case Enum_1.Tipos.ELEMENTOS:
        case Enum_1.Tipos.ASTERISCO:
        case Enum_1.Tipos.FUNCION_TEXT:
        case Enum_1.Tipos.FUNCION_NODE:
            if (_contexto.atributos.length > 0) {
                for (let i = 0; i < _contexto.atributos.length; i++) {
                    const attribute = _contexto.atributos[i];
                    if (attribute.id == valor || valor === "*") {
                        retorno.atributos.push(attribute);
                    }
                    else if (attribute.value == valor) {
                        retorno.atributos.push(attribute);
                    }
                }
                retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
            }
            else if (_contexto.texto.length > 0) {
                for (let i = 0; i < _contexto.texto.length; i++) {
                    const text = _contexto.texto[i];
                    if (text == valor || valor === "*") {
                        retorno.texto.push(text);
                    }
                }
                retorno.cadena = Enum_1.Tipos.TEXTOS;
            }
            else if (_contexto.nodos.length > 0) {
                for (let i = 0; i < _contexto.nodos.length; i++) {
                    const node = _contexto.nodos[i];
                    if (node.textos == valor || valor === "*") {
                        retorno.nodos.push(node);
                    }
                    else if (node.elementos.id_open == valor || node.elementos.value == valor) {
                        retorno.nodos.push(node);
                    }
                }
                retorno.cadena = Enum_1.Tipos.COMBINADO;
            }
            for (let i = 0; i < _contexto.elementos.length; i++) {
                const element = _contexto.elementos[i];
                if (_nodetest.tipo === Enum_1.Tipos.FUNCION_TEXT && element.value) {
                    _contexto.texto.push(element.value);
                }
                else if (element.id_open == valor || valor == "*" || _nodetest.tipo === Enum_1.Tipos.FUNCION_NODE) {
                    retorno.elementos.push(element);
                }
                else if (element.childs) {
                    element.childs.forEach(child => {
                        if (child.id_open == valor)
                            retorno.elementos.push(child);
                    });
                }
                retorno.removeDuplicates();
            }
            break;
        default:
            retorno.error = { error: "Error: nodetest no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }
    // En caso de tener algún predicado
    if (_predicate) {
        let filter = new Predicate_1.Predicate(_predicate, _ambito, retorno);
        if (retorno.atributos.length > 0)
            retorno.atributos = filter.filterElements(retorno.atributos);
        else if (retorno.texto.length > 0)
            retorno.texto = filter.filterElements(retorno.texto);
        else
            retorno.elementos = filter.filterElements(retorno.elementos);
    }
    return retorno;
}
module.exports = { SA: SelectAxis, GetAxis: getAxis };
