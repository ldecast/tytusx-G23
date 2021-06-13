import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";
import Expresion from "../../Expresion/Expresion";
import { Element } from "../../../../model/xml/Element";
import { Atributo } from "../../../../model/xml/Atributo";
import { Predicate } from "./Predicate";

function Eje(_instruccion: any, _ambito: Ambito, _contexto: any): any {
    let retorno = { cadena: Tipos.NONE, retorno: null }
    let err = { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    let contexto: any = (_contexto.retorno) ? (_contexto.retorno) : null;
    let expresion = Expresion(_instruccion.expresion.expresion, _ambito, contexto);
    if (expresion.err) return expresion;
    let predicate = _instruccion.expresion.predicate;
    let root: any;
    if (expresion.tipo === Tipos.ELEMENTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.ATRIBUTOS) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        if (root.atributos.length === 0) return err;
        retorno.cadena = Tipos.ATRIBUTOS;
    }
    else if (expresion.tipo === Tipos.ASTERISCO) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        retorno.cadena = Tipos.ELEMENTOS;
    }
    else if (expresion.tipo === Tipos.FUNCION_NODE) {
        root = getSymbolFromRoot(expresion.valor, contexto, _ambito, predicate);
        if (root.nodos.length === 0) return err;
        retorno.cadena = root.tipo;
    }
    else {
        return { err: "Expresión no válida.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    }
    if (root.err) return root;
    if (root.length === 0 || root === null) return err;
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            nodes = filter.filterNodes(nodes);
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements();
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
            elements = filter.filterElements();
            attributes = filter.filterAttributes(attributes);
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
            elements = filter.filterElements();
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
            elements = filter.filterElements();
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
            elements = filter.filterElements();
        }
        return elements;
    }
}

// Desde la raíz
function getFromRoot(_id: any, _ambito: Ambito, _condicion: any): any {
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
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            nodes = filter.filterNodes(nodes);
        }
        return { tipo: Tipos.COMBINADO, nodos: nodes };
    }
    // Selecciona todos los hijos (elementos)
    else if (_id === "*") {
        _ambito.tablaSimbolos.forEach(element => {
            elements.push(element);
        });
        if (_condicion) {
            let filter = new Predicate(_condicion, _ambito, elements);
            elements = filter.filterElements();
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
            elements = filter.filterElements();
            attributes = filter.filterAttributes(attributes);
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
            elements = filter.filterElements();
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
            elements = filter.filterElements();
        }
        return elements;
    }
}

export =  Eje;