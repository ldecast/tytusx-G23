import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";
import Expresion from "../../Expresion/Expresion";
import { Element } from "../../../../model/xml/Element";
import { Atributo } from "../../../../model/xml/Atributo";
import { Predicate } from "./Predicate";

function Eje(_instruccion: any, _ambito: Ambito, _contexto: any): any {
    let retorno = { cadena: Tipos.NONE, retorno: null }
    let _404 = { notFound: "No se encontraron elementos." };
    let contexto: any = (_contexto.retorno) ? (_contexto.retorno) : null;
    let expresion = Expresion(_instruccion.expresion.expresion, _ambito, contexto);
    if (expresion.error) return expresion;
    let predicate = _instruccion.expresion.predicate;
    let root: any;
    if (expresion.tipo === Tipos.ELEMENTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot({ id: expresion.valor, tipo: "@" }, contexto, _ambito, predicate);
        if (root.atributos.length === 0) return _404;
        if (root.atributos.error) return root.atributos;
        if (root.elementos.error) return root.elementos;
        retorno.cadena = Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        if (root.nodos.length === 0) return _404;
        if (root.nodos.error) return root.nodos;
        retorno.cadena = root.tipo;
    }
    else if (expresion.tipo === Tipos.FUNCION_TEXT) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        if (root.texto.length === 0) return _404;
        if (root.texto.error) return root.texto;
        retorno.cadena = Tipos.TEXTOS;
    }
    else {
        return { error: "Expresión no válida.", tipo: "Semántico", origen: "Query", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root.error) return root;
    if (root.length === 0 || root === null) return _404;
    retorno.retorno = root;
    return retorno;
}

function getSymbolFromRoot(_nodename: any, _contexto: Array<Element>, _ambito: Ambito, _condicion: any): any {
    if (_contexto)
        return getFromCurrent(_nodename, _contexto, _ambito, _condicion);
    else
        return getFromRoot(_nodename, _ambito, _condicion);
}

// Desde el ámbito actual
function getFromCurrent(_id: any, _contexto: any, _ambito: Ambito, _condicion: any): any {
    let elements = Array<Element>();
    let attributes = Array<Atributo>();
    // Selecciona el texto contenido únicamente en el nodo
    if (_id === "text()") {
        let text = Array<string>();
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            if (element.value) {
                text.push(element.value);
                elements.push(element);
            }
        }
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            text = filter.filterElements(text);
            elements = filter.contexto;
        }
        return { texto: text, elementos: elements };
    }
    // Selecciona todos los hijos (elementos o texto)
    else if (_id === "node()") {
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            nodes = filter.filterElements(nodes);
        }
        return { tipo: Tipos.COMBINADO, nodos: nodes, elementos: _contexto };
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            attributes = filter.filterElements(attributes);
            elements = filter.contexto;
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        for (let i = 0; i < _contexto.length; i++) {
            const element = _contexto[i];
            elements.push(element);
        }
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
}

// Desde la raíz
function getFromRoot(_id: any, _ambito: Ambito, _condicion: any): any {
    let elements = Array<Element>();
    let attributes = Array<Atributo>();
    // Selecciona únicamente el texto contenido en el nodo y todos sus descendientes
    if (_id === "text()") {
        let text = Array<string>();
        _ambito.tablaSimbolos.forEach(element => {
            if (element.value) {
                text.push(element.value);
                elements.push(element);
            }
        });
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            text = filter.filterElements(text);
        }
        return { texto: text, elementos: elements };
    }
    // Selecciona todos los hijos (elementos o texto)
    else if (_id === "node()") {
        let nodes = Array<any>();
        _ambito.tablaSimbolos.forEach(element => {
            if (element.childs)
                // element.childs.forEach(child => {
                nodes.push({ elementos: element });
            // });
            else if (element.value)
                nodes.push({ textos: element.value });
        });
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            nodes = filter.filterElements(nodes);
        }
        return { tipo: Tipos.COMBINADO, nodos: nodes, elementos: _ambito.tablaSimbolos };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(element => {
            elements.push(element);
        });
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            attributes = filter.filterElements(attributes);
            elements = filter.contexto;
        }
        return { atributos: attributes, elementos: elements };
    }
    // Selecciona el nodo actual
    else if (_id === ".") {
        _ambito.tablaSimbolos.forEach(element => {
            elements.push(element);
        });
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
    // Búsqueda por id
    else {
        _ambito.tablaSimbolos.forEach(element => {
            if (element.id_open === _id)
                elements.push(element);
        });
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements(elements);
        }
        return elements;
    }
}

export =  Eje;