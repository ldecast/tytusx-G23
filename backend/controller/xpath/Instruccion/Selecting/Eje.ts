import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";
import Expresion from "../../Expresion/Expresion";
import { Element } from "../../../../model/xml/Element";
import { Atributo } from "../../../../model/xml/Atributo";

function Eje(_instruccion: any, _ambito: Ambito, _contexto: any): any {
    let retorno = { cadena: Tipos.NONE, retorno: null }
    let contexto: any;
    if (_contexto.retorno)
        contexto = _contexto.retorno;
    else
        contexto = null;
    let expresion = Expresion(_instruccion.expresion, _ambito, contexto);
    let root: any;
    if (expresion.tipo === Tipos.ELEMENTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        if (root.atributos.length === 0) {
            return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
        }
        retorno.cadena = Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito);
        retorno.cadena = root.tipo;
    }
    else {
        return { err: "Expresión no válida.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root.length === 0 || root === null)
        return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    retorno.retorno = root; //arreglo de elementos -> el contexto
    return retorno;
}

function getSymbolFromRoot(_nodename: any, _contexto: Array<Element>, _ambito: Ambito): any {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito);
    else
        return getFromRoot(_nodename, _ambito);
}

function getFromCurrent(_id: any, _contexto: any, _ambito: Ambito): any {
    let elements = Array<Element>();
    let attributes = Array<Atributo>();
    let text = Array<string>();
    // Selecciona todos los hijos (elementos o texto)
    if (_id === "node()") {
        let nodes = Array<any>();
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            if (element.childs)
                element.childs.forEach((child: Element) => {
                    nodes.push({ elementos: child });
                });
            else if (element.value)
                nodes.push({ textos: element.value });
        }
        return { tipo: Tipos.COMBINADO, nodos: nodes };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            if (element.childs) {
                element.childs.forEach((child: Element) => {
                    elements.push(child);
                });
            }
        }
        return elements;
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        let flag: boolean = false;
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            if (element.attributes)
                element.attributes.forEach((attribute: Atributo) => {
                    if ((_id.id === attribute.id) || (_id.id === "*")) { // En caso de que sea un id ó @*
                        attributes.push(attribute);
                        flag = true;
                    }
                });
            if (flag) {
                elements.push(element);
                flag = false;
            }
        }
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el padre
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
    // Selecciona el nodo actual
    else if (_id === ".") {
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            elements.push(element);
        }
        return elements;
    }
    // Búsqueda en los hijos por id
    else {
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            if (element.childs) {
                element.childs.forEach((child: Element) => {
                    elements = _ambito.searchSingleNode(_id, child, elements);
                });
            }
        }
        return elements;
    }
}

function getFromRoot(_id: any, _ambito: Ambito): any {
    let elements = Array<Element>();
    let attributes = Array<Atributo>();
    let text = Array<string>();
    // Selecciona todos los hijos (elementos o texto)
    if (_id === "node()") {
        let nodes = Array<any>();
        _ambito.tablaSimbolos.forEach(element => {
            if (element.childs)
                // element.childs.forEach(child => {
                nodes.push({ elementos: element });
            // });
            else if (element.value)
                nodes.push({ textos: element.value });
        });
        return { tipo: Tipos.COMBINADO, nodos: nodes };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(element => {
            elements.push(element);
        });
        return elements;
    }
    // Selecciona los atributos
    else if (_id.tipo === "@") {
        let flag: boolean = false;
        _ambito.tablaSimbolos.forEach(element => {
            if (element.attributes)
                element.attributes.forEach(attribute => {
                    if ((_id.id === attribute.id) || (_id.id === "*")) {
                        flag = true;
                        attributes.push(attribute);
                    }
                });
            if (flag) {
                elements.push(element);
                flag = false;
            }
        });
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        _ambito.tablaSimbolos.forEach(element => {
            elements.push(element);
        });
        return elements;
    }
    // Búsqueda por id
    else {
        _ambito.tablaSimbolos.forEach(element => {
            if (element.id_open === _id)
                elements.push(element);
        });
        return elements;
    }
}

export =  Eje;