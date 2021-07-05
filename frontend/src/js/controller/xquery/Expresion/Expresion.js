"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = require("../../../model/xpath/Enum");
const Expresion_1 = __importDefault(require("../../xpath/Expresion/Expresion"));
const Contexto_1 = require("../../Contexto");
const Variable_1 = require("../../../model/xml/Ambito/Variable");
function ExpresionQuery(_expresion, _ambito, _contexto, _id) {
    let tipo = _expresion.tipo;
    if (tipo === Enum_1.Tipos.DECLARACION) {
        let contexto = new Contexto_1.Contexto();
        let id = Expresion_1.default(_expresion.variable, _ambito, _contexto, _id);
        let it = Expresion_1.default(_expresion.iterators, _ambito, _contexto, _id);
        if (id.valor && it) {
            contexto = it;
            let newVar = new Variable_1.Variable(id.valor, Enum_1.Tipos.VARIABLE, _expresion.linea, _expresion.columna, "For");
            contexto.variable = newVar;
            newVar.valor = "For loop variable assigned.";
            _ambito.tablaVariables.push(newVar);
            if (_expresion.atKey) {
                newVar = new Variable_1.Variable(_expresion.atKey.variable, Enum_1.Tipos.VARIABLE, _expresion.linea, _expresion.columna + 5, "At");
                contexto.atCounter = newVar;
                newVar.valor = "At keyword used for counter.";
                _ambito.tablaVariables.push(newVar);
            }
        }
        return contexto;
    }
    if (tipo === Enum_1.Tipos.VARIABLE) {
        if (_id && _contexto.cadena != Enum_1.Tipos.NONE) {
            if (_id === _expresion.variable)
                return _contexto;
            else
                return null;
        }
        return { valor: _expresion.variable };
    }
    if (tipo === Enum_1.Tipos.INTERVALO) {
        let contexto = new Contexto_1.Contexto();
        let val_1 = Expresion_1.default(_expresion.valor1, _ambito, _contexto, _id);
        if (!val_1 || val_1.error)
            return val_1;
        let val_2 = Expresion_1.default(_expresion.valor2, _ambito, _contexto, _id);
        if (!val_2 || val_2.error)
            return val_2;
        for (let i = parseInt(val_1.valor); i <= parseInt(val_2.valor); i++) {
            contexto.items.push(i);
        }
        if (_id)
            contexto.variable = new Variable_1.Variable(_id, Enum_1.Tipos.VARIABLE, _expresion.linea, _expresion.columna);
        contexto.cadena = Enum_1.Tipos.INTERVALO;
        return contexto;
    }
    if (tipo === Enum_1.Tipos.VALORES) {
        let contexto = new Contexto_1.Contexto();
        _expresion.valores.forEach((valor) => {
            const expresion = Expresion_1.default(valor, _ambito, _contexto, _id);
            if (expresion && !expresion.error)
                contexto.items.push(parseInt(expresion.valor));
        });
        if (_id)
            contexto.variable = new Variable_1.Variable(_id, Enum_1.Tipos.VARIABLE, _expresion.linea, _expresion.columna);
        contexto.cadena = Enum_1.Tipos.VALORES;
        return contexto;
    }
    if (tipo === Enum_1.Tipos.HTML) {
        // console.log(_expresion)
        let content = [];
        for (let i = 0; i < _expresion.value.length; i++) {
            const value = Expresion_1.default(_expresion.value[i], _ambito, _contexto, _id);
            // console.log(value)
            if (value && value.texto && value.texto.length > 0) {
                for (let i = 0; i < value.texto.length; i++) {
                    const text = value.texto[i];
                    value.texto[i] = `<${_expresion.id_open}>${text}</${_expresion.id_close}>`;
                }
            }
            if (value && !value.error)
                content = content.concat(value);
            // else content.pop();
        }
        return content;
    }
    if (tipo === Enum_1.Tipos.CONTENIDO) {
        return { valor: _expresion.contenido };
    }
    if (tipo === Enum_1.Tipos.INYECCION) {
        const Bloque = require("../Bloque_XQuery");
        let _x = Bloque.getIterators(_expresion.valor, _ambito, _contexto, _id);
        return _x;
    }
    else if (tipo === Enum_1.Tipos.LLAMADA_FUNCION) {
        const Exec = require("../Funciones/Exec");
        return Exec(_expresion, _ambito, _contexto, _id);
    }
    else if (tipo === Enum_1.Tipos.LLAMADA_NATIVA) {
        const Nativa = require("../Funciones/Nativas");
        return Nativa(_expresion, _ambito, _contexto, _id);
    }
    else {
        // console.log(_expresion, 4444);
        const Bloque = require('../Bloque_XQuery');
        let _iterators = Bloque.getIterators(_expresion, _ambito, _contexto, _id);
        if (_iterators === null)
            return null;
        return _iterators;
    }
}
module.exports = ExpresionQuery;
