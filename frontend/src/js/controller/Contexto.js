"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contexto = void 0;
const Enum_1 = require("../model/xpath/Enum");
class Contexto {
    constructor(_context, _variables) {
        if (_context) {
            this.elementos = _context.elementos;
            this.atributos = _context.atributos;
            this.texto = _context.texto;
            this.nodos = _context.nodos;
            this.cadena = _context.cadena;
            this.items = _context.items;
            if (_context.variable)
                this.variable = _context.variable;
            if (_context.atCounter)
                this.atCounter = _context.atCounter;
            this.tablaVariables = _context.tablaVariables;
        }
        else {
            this.elementos = [];
            this.atributos = [];
            this.texto = [];
            this.nodos = [];
            this.items = [];
            this.cadena = Enum_1.Tipos.NONE;
            this.tablaVariables = [];
        }
        if (_variables) {
            this.tablaVariables = _variables;
        }
        this.error = this.notFound = null;
    }
    addVariable(_variable) {
        let exists = this.existeVariable(_variable.id);
        if (exists !== -1) {
            this.tablaVariables[exists] = _variable;
        }
        else {
            this.tablaVariables.unshift(_variable);
        }
    }
    existeVariable(_id) {
        for (let i = 0; i < this.tablaVariables.length; i++) {
            const variable = this.tablaVariables[i];
            if (_id == variable.id && (variable.contexto || variable.valor))
                return i;
        }
        return -1;
    }
    getVar(_id) {
        for (let i = 0; i < this.tablaVariables.length; i++) {
            const variable = this.tablaVariables[i];
            if (_id == variable.id && (variable.contexto || variable.valor))
                return variable;
        }
        return null;
    }
    pushElement(_v) {
        this.elementos.push(_v);
    }
    pushAttribute(_v) {
        this.atributos.push(_v);
    }
    pushText(_v) {
        this.texto.push(_v);
    }
    pushNode(_v) {
        this.nodos.push(_v);
    }
    pushItem(_v) {
        this.items.push(_v);
    }
    removeDuplicates() {
        if (this.elementos.length > 0) {
            this.elementos = this.elementos.filter((v, i, a) => a.findIndex(t => (t.line === v.line && t.column === v.column)) === i);
        }
    }
    removeDadDuplicates() {
        this.removeDuplicates();
        if (this.atributos.length > 0)
            this.atributos = this.atributos.filter((v, i, a) => a.findIndex(t => (t.line === v.line)) === i);
        this.elementos = this.elementos.filter((v, i, a) => a.findIndex(t => (t.father.line === v.father.line && t.father.column === v.father.column)) === i);
        return this.getArray();
    }
    /* addArray(_array: Array<any>) {
        if (this.atributos.length > 0)
            this.atributos = _array;
        else if (this.elementos.length > 0)
            this.elementos = _array;
        else if (this.texto.length > 0)
            this.texto = _array;
        else if (this.nodos.length > 0)
            this.nodos = _array;
    } */
    getLength() {
        if (this.items.length > 0)
            return this.items.length;
        if (this.atributos.length > 0)
            return this.atributos.length;
        if (this.elementos.length > 0)
            return this.elementos.length;
        if (this.texto.length > 0)
            return this.texto.length;
        if (this.nodos.length > 0)
            return this.nodos.length;
        return 0;
    }
    getArray() {
        if (this.atributos.length > 0)
            return this.atributos;
        if (this.elementos.length > 0)
            return this.elementos;
        if (this.texto.length > 0)
            return this.texto;
        if (this.nodos.length > 0)
            return this.nodos;
        return [];
    }
    set setCadena(v) {
        this.cadena = v;
    }
    set setElements(v) {
        this.elementos = v;
    }
    set setAttributes(v) {
        this.atributos = v;
    }
    set setTexto(v) {
        this.texto = v;
    }
    set setNodos(v) {
        this.nodos = v;
    }
}
exports.Contexto = Contexto;
