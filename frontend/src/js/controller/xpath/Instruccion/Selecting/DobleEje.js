"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = require("../../../../model/xpath/Enum");
const Expresion_1 = __importDefault(require("../../Expresion/Expresion"));
const Predicate_1 = require("./Predicate");
const Axis_1 = __importDefault(require("./Axis/Axis"));
const Contexto_1 = require("../../../Contexto");
const Variable_1 = require("../../../../model/xml/Ambito/Variable");
function DobleEje(_instruccion, _ambito, _contexto, id) {
    let _404 = "No se encontraron elementos.";
    if (Array.isArray(_contexto))
        _contexto = _contexto[0];
    let expresion = Expresion_1.default(_instruccion, _ambito, _contexto, id);
    if (expresion === null || expresion.error)
        return expresion;
    if (expresion.contextFromVar && _contexto.cadena === Enum_1.Tipos.NONE)
        _contexto = expresion.contextFromVar;
    let predicate = _instruccion.predicate;
    let root = new Contexto_1.Contexto();
    if (expresion.tipo === Enum_1.Tipos.ELEMENTOS || expresion.tipo === Enum_1.Tipos.ASTERISCO) {
        root = getAllSymbolFromCurrent(expresion.valor, _contexto, _ambito, predicate, id);
    }
    else if (expresion.tipo === Enum_1.Tipos.ATRIBUTOS) {
        root = getAllSymbolFromCurrent({ id: expresion.valor, tipo: "@" }, _contexto, _ambito, predicate, id);
        if (root.atributos.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_NODE) {
        root = getAllSymbolFromCurrent(expresion.valor, _contexto, _ambito, predicate, id);
        if (root.nodos.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.FUNCION_TEXT) {
        root = getAllSymbolFromCurrent(expresion.valor, _contexto, _ambito, predicate, id);
        if (root.texto.length === 0)
            root.notFound = _404;
    }
    else if (expresion.tipo === Enum_1.Tipos.SELECT_AXIS) {
        root = Axis_1.default.GetAxis(expresion.axisname, expresion.nodetest, expresion.predicate, _contexto, _ambito, true, id);
        return root;
    }
    else {
        root.error = { error: "Expresión no válida.", tipo: "Semántico", origen: "Query", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root === null || root.error || root.getLength() === 0)
        root.notFound = _404;
    return root;
}
function getAllSymbolFromCurrent(_nodename, _contexto, _ambito, _condicion, id) {
    if (_contexto.getLength() > 0)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion);
    else {
        _contexto.error = { error: "Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: 1, columna: 1 };
        return _contexto;
    }
}
function getFromCurrent(_id, _contexto, _ambito, _condicion, id) {
    let retorno = new Contexto_1.Contexto();
    if (id) {
        retorno.variable = new Variable_1.Variable(id, Enum_1.Tipos.VARIABLE);
    }
    // Selecciona únicamente el texto contenido en el nodo y todos sus descendientes
    if (_id === "text()") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            retorno.texto = _ambito.searchAnyText(element, retorno.texto);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.texto = filter.filterElements(retorno.texto);
        }
        retorno.cadena = Enum_1.Tipos.TEXTOS;
        return retorno;
    }
    // Selecciona todos los descencientes (elementos y/o texto)
    else if (_id === "node()") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            retorno.nodos = _ambito.nodesFunction(_ambito.tablaSimbolos[0], retorno.nodos);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.nodos = filter.filterElements(retorno.nodos);
        }
        retorno.cadena = Enum_1.Tipos.COMBINADO;
        return retorno;
    }
    // Selecciona todos los atributos a partir del contexto
    else if (_id.tipo === "@") {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            retorno.atributos = _ambito.searchAnyAttributes(_id.id, element, retorno.atributos);
        }
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.atributos = filter.filterElements(retorno.atributos);
        }
        retorno.cadena = Enum_1.Tipos.ATRIBUTOS;
        return retorno;
    }
    // Selecciona el padre
    else if (_id === "..") {
        retorno = _contexto;
        retorno.elementos.push(_ambito.tablaSimbolos[0]);
        retorno.removeDuplicates();
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.elementos = filter.filterElements(retorno.elementos);
        }
        retorno.cadena = Enum_1.Tipos.ELEMENTOS;
        return retorno;
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        retorno = _contexto;
        if (_condicion) {
            let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
            retorno.elementos = filter.filterElements(retorno.elementos);
        }
        /* retorno.cadena = Tipos.ELEMENTOS; */
        return retorno;
    }
    // Selecciona todos los descendientes con el id o en el caso que sea //*
    else {
        for (let i = 0; i < _contexto.elementos.length; i++) {
            const element = _contexto.elementos[i];
            if (element.childs)
                element.childs.forEach(child => {
                    retorno.elementos = _ambito.searchNodes(_id, child, retorno.elementos);
                });
        }
    }
    if (_condicion) {
        let filter = new Predicate_1.Predicate(_condicion, _ambito, retorno);
        retorno.elementos = filter.filterElements(retorno.elementos);
    }
    retorno.cadena = Enum_1.Tipos.ELEMENTOS;
    return retorno;
}
module.exports = DobleEje;
