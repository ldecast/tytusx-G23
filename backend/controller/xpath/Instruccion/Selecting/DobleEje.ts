import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";
import Expresion from "../../Expresion/Expresion";
import { Element } from "../../../../model/xml/Element";
import { Atributo } from "../../../../model/xml/Atributo";

function DobleEje(_instruccion: any, _ambito: Ambito, _contexto: any): any {
    let retorno = { cadena: Tipos.NONE, retorno: Array<any>() }
    let contexto: any;
    if (_contexto.retorno)
        contexto = _contexto.retorno;
    else
        contexto = null;
    let expresion = Expresion(_instruccion.expresion, _ambito, contexto);
    let root: any;
    if (expresion.tipo === Tipos.ELEMENTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.ATRIBUTOS) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        if (root.atributos.length === 0) {
            return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
        }
        retorno.cadena = Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Tipos.ASTERISCO) {
        root = getAllSymbolFromCurrent(expresion.valor, contexto, _ambito);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.FUNCION_NODE) {
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

function getAllSymbolFromCurrent(_nodename: any, _contexto: Array<Element>, _ambito: Ambito) {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito);
    else
        return getFromRoot(_nodename, _ambito);
}

function getFromCurrent(_id: any, _contexto: any, _ambito: Ambito): any {
    let elements = Array<Element>();
    let attributes = Array<Atributo>();
    let nodes = Array<any>();
    // Selecciona todos los descencientes (elementos y/o texto)
    if (_id === "node()") {
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            if (element.childs) {
                element.childs.forEach((child: Element) => {
                    nodes = _ambito.nodesFunction(child, nodes);
                });
            }
            else if (element.value)
                nodes.push({ textos: element.value });
        }
        return { tipo: Tipos.COMBINADO, nodos: nodes };
    }
    // Selecciona todos los atributos a partir del contexto
    else if (_id.tipo === "@") {
        let a = { atributos: attributes, elementos: elements };
        if (_id.id === "*") {
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                a = _ambito.searchAnyAttributes(element, attributes, elements);
            }
        }
        else {
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                a = _ambito.searchAttributesFromCurrent(element, _id.id, attributes, elements);
            }
        }
        return a;
    }
    else if (_id === "..") {
        if (_contexto.atributos) {
            for (let i = 0; i < _contexto.atributos.length; i++) {
                const attribute = _contexto.atributos[i];
                _ambito.tablaSimbolos.forEach(elm => {
                    elements = _ambito.searchDadFromAttribute(elm, attribute, elements);
                });
            }
            return elements;
        }
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            let dad = element.father;
            if (dad) {
                _ambito.tablaSimbolos.forEach(elm => {
                    if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                        elements.push(elm);
                    if (elm.childs)
                        elm.childs.forEach(child => {
                            elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                        });
                });
            }
        }
        return elements;
    }
    // Selecciona todos los descendientes con el id
    else {
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            if (element.childs)
                element.childs.forEach((child: Element) => {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        }
        return elements;
    }
}

function getFromRoot(_id: any, _ambito: Ambito): any {// ver si puedo mezclar el orden que sea correcto con una nueva array any
    let elements = Array<Element>();
    let attributes = Array<Atributo>();
    let text = Array<string>();
    // Selecciona todos los descencientes (elementos y/o texto)
    if (_id === "node()") {
        let nodes = Array<any>();
        _ambito.tablaSimbolos.forEach(element => {
            // if (element.childs) {
            //     element.childs.forEach(child => {
            nodes = _ambito.nodesFunction(element, nodes);
            // });
            // }
            // else if (element.value)
            //     nodes.push({ textos: element.value });
        });
        return { tipo: Tipos.COMBINADO, nodos: nodes };
    }
    // Selecciona todos los atributos a partir de la raíz
    else if (_id.tipo === "@") {
        let a = { atributos: attributes, elementos: elements };
        _ambito.tablaSimbolos.forEach(element => {
            if (_id.id === "*")
                a = _ambito.searchAnyAttributes(element, attributes, elements);
            else
                a = _ambito.searchAttributesFromCurrent(element, _id.id, attributes, elements);
        });
        return a;
    }
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(element => {
            elements.push(element);
        });
        return elements;
    }
    // Selecciona todos los descendientes con el id
    else {
        _ambito.tablaSimbolos.forEach(element => {
            if (element.id_open === _id)
                elements.push(element);
            if (element.childs)
                element.childs.forEach(child => {
                    elements = _ambito.searchNodes(_id, child, elements);
                });
        });
        return elements;
    }
}

function getAllTexts(_element: Element, _cadena: Array<string>) {
    if (_element.childs) {
        _element.childs.forEach(child => {
            _cadena = getAllTexts(child, _cadena);
        });
    }
    else if (_element.value) _cadena.push(_element.value);
    return _cadena;
}

export =  DobleEje;