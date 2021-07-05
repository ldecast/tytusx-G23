"use strict";
/* import { Tipos } from "../../../../../model/xpath/Enum";
import { Element } from "../../../../../model/xml/Element";
import { Contexto } from "../../../../Contexto";

// Revisa el nodetest y busca hacer match
function f1(_element: Element, _contexto: Contexto, isDoubleBar: boolean) {
    if (_element.value) {
        _contexto.texto.push(_element.value);
    }
    if (_element.childs && isDoubleBar) {
        _element.childs.forEach(child => {
            _contexto = f1(child, _contexto, isDoubleBar);
        });
    }
    return _contexto;
}

function f2(_element: Element, _contexto: Contexto, valor: any, isDoubleBar: boolean) { // Para atributos
    for (let j = 0; j < _element.attributes.length; j++) {
        const attribute = _element.attributes[j];
        if (attribute.id == valor || valor === "*") {
            _contexto.atributos.push(attribute);
            break; // Sale del ciclo de atributos para pasar al siguiente elemento
        }
        else if (attribute.value == valor) {
            _contexto.elementos.push(_element);
            _contexto.atributos.push(attribute);
            break;
        }
    }
    if (_element.childs && isDoubleBar) {
        _element.childs.forEach(child => {
            f2(child, _contexto, valor, isDoubleBar);
        });
    }
    return { elementos: _contexto.elementos, atributos: _contexto.atributos };
}

function f2(_element: Element, _contexto: Contexto, valor: any, tipo: Tipos, isDoubleBar: boolean) {
    if (_element.id_open == valor || valor == "*") {
        if (tipo === Tipos.FUNCION_TEXT)
            _contexto.texto.push(_element.value);
        else
            _contexto.elementos.push(_element);
    }
    if (_element.childs && isDoubleBar) {
        _element.childs.forEach(child => {
            f2(child, _contexto, valor, tipo, isDoubleBar);
        });
    }
    return { elementos: _contexto.elementos, texto: _contexto.texto };
}

export = { f1: f1, f2: f2 }; */ 
