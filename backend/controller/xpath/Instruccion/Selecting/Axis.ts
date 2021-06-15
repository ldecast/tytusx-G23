import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";
import Expresion from "../../Expresion/Expresion";
import { Element } from "../../../../model/xml/Element";
import { Atributo } from "../../../../model/xml/Atributo";
import { Predicate } from "./Predicate";

function SelectAxis(_instruccion: any, _ambito: Ambito, _contexto: any): any {
    let retorno = { cadena: Tipos.NONE, elementos: null }
    let _404 = { notFound: "No se encontraron elementos." };
    let contexto: any = (_contexto.elementos) ? (_contexto.elementos) : null;
    let expresion = Expresion(_instruccion, _ambito, contexto);
    if (expresion.error) return expresion;
    let root: any = getAxis(expresion.axisname, expresion.nodetest, expresion.predicate, contexto, _ambito);
    if (root.error) return root;
    if (root.elementos.error) return root.elementos;
    if (root.atributos.error) return root.atributos;
    if (root.elementos.length === 0 || root.elementos.error || root === null) return _404;
    retorno = root;
    return retorno;
}

function getAxis(_axisname: Tipos, _nodetest: any, _predicate: any, _contexto: Array<Element>, _ambito: Ambito): any {
    if (_contexto)
        return getFromCurrent(_axisname, _nodetest, _predicate, _contexto, _ambito);
    else
        console.log(_nodetest, _contexto, "errax");
}

function getFromCurrent(_axisname: Tipos, _nodetest: any, _predicate: any, _contexto: Array<Element>, _ambito: Ambito): any {
    let elements = Array<Element>();
    let attributes = Array<Atributo>();
    let cadena: Tipos = Tipos.ELEMENTOS;
    let flag: boolean;
    let index: number;
    switch (_axisname) {
        case Tipos.AXIS_ANCESTOR: // Selects all ancestors (parent, grandparent, etc.) of the current node
        case Tipos.AXIS_ANCESTOR_OR_SELF: // Selects all ancestors (parent, grandparent, etc.) of the current node and the current node itself
        case Tipos.AXIS_PRECEDING: // Selects all nodes that appear before the current node in the document, except ancestors, attribute nodes and namespace nodes
            index = 0;
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                if (_axisname === Tipos.AXIS_ANCESTOR_OR_SELF) elements.push(element);
                let dad = element.father;
                if (dad) {
                    index = _ambito.searchIndexElement(_ambito.tablaSimbolos[0], element, index); // -1 ?
                    for (let j = 0; j < index; j++) {
                        const r = _ambito.tablaSimbolos[j];
                        elements.push(r);
                    }
                }
            }
            break;
        case Tipos.AXIS_ATTRIBUTE: // Selects all attributes of the current node
            flag = false;
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                if (element.attributes)
                    element.attributes.forEach((attribute: Atributo) => {
                        attributes.push(attribute);
                        flag = true;
                    });
                if (flag) {
                    // a.elementos.push(element);
                    elements.push(element);
                    flag = false;
                }
            }
            cadena = Tipos.ATRIBUTOS;
            break;
        case Tipos.AXIS_CHILD: // Selects all children of the current node
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                if (element.childs)
                    element.childs.forEach((child: Element) => {
                        elements.push(child);
                    });
            }
            break;
        case Tipos.AXIS_DESCENDANT: // Selects all descendants (children, grandchildren, etc.) of the current node
        case Tipos.AXIS_DESCENDANT_OR_SELF: // Selects all descendants (children, grandchildren, etc.) of the current node and the current node itself
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                if (_axisname === Tipos.AXIS_DESCENDANT_OR_SELF) elements.push(element);
                if (element.childs)
                    element.childs.forEach((child: Element) => {
                        elements = _ambito.searchNodes("*", child, elements);
                    });
            }
            break;
        case Tipos.AXIS_FOLLOWING: // Selects everything in the document after the closing tag of the current node
            index = 0;
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                let dad = element.father;
                if (dad) {
                    index = _ambito.searchIndexElement(_ambito.tablaSimbolos[0], element, index); // -1 ?
                    for (let j = index; j < _ambito.tablaSimbolos.length; j++) {
                        const r = _ambito.tablaSimbolos[j];
                        elements.push(r);
                    }
                }
            }
        case Tipos.AXIS_FOLLOWING_SIBLING: // Selects all siblings after the current node:
            index = 0;
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                let dad = element.father;
                if (dad) {
                    index = _ambito.searchIndexElement(_ambito.tablaSimbolos[0], element, index); // -1 ?
                    for (let j = index; j < _ambito.tablaSimbolos.length; j++) {
                        const r = _ambito.tablaSimbolos[j];
                        if (r.childs) {
                            r.childs.forEach(child => {
                                elements.push(child);
                            });
                        }
                    }
                }
            }
            break;
        case Tipos.AXIS_NAMESPACE: // Selects all namespace nodes of the current node
            return { error: "Error: la funcionalidad 'namespace' no está disponible.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
        case Tipos.AXIS_PARENT: // Selects the parent of the current node
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                let dad = element.father;
                if (dad)
                    _ambito.tablaSimbolos.forEach(elm => {
                        if (elm.id_open === dad.id && elm.line == dad.line && elm.column == dad.column)
                            elements.push(elm);
                        if (elm.childs)
                            elm.childs.forEach(child => {
                                elements = _ambito.searchDad(child, dad.id, dad.line, dad.column, elements);
                            });
                    });
            }
            break;
        case Tipos.AXIS_PRECEDING_SIBLING: // Selects all siblings before the current node
            index = 0;
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                let dad = element.father;
                if (dad) {
                    index = _ambito.searchIndexElement(_ambito.tablaSimbolos[0], element, index); // -1 ?
                    for (let j = 0; j < index; j++) {
                        const r = _ambito.tablaSimbolos[j];
                        if (r.childs) {
                            r.childs.forEach(child => {
                                elements.push(child);
                            });
                        }
                    }
                }
            }
            break;
        case Tipos.AXIS_SELF: // Selects the current node
            for (let i = 0; i < _contexto.length; i++) {
                const element = _contexto[i];
                elements.push(element);
            }
            break;
        default:
            return { error: "Error: axisname no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }
    console.log(elements, 55)
    let elem_aux: Array<Element> = elements;
    let attr_aux: Array<Atributo> = attributes;
    let valor = _nodetest.valor;
    attributes = [];
    elements = [];
    switch (_nodetest.tipo) {
        case Tipos.ELEMENTOS:
        case Tipos.ASTERISCO:
            for (let i = 0; i < elem_aux.length; i++) {
                const element = elem_aux[i];
                console.log(attr_aux, 555, valor);
                if (attr_aux.length > 0) {
                    if (element.attributes) {
                        for (let j = 0; j < element.attributes.length; j++) {
                            const attribute = element.attributes[j];
                            if (attribute.id == valor || valor === "*") {
                                elements.push(element);
                                attributes.push(attribute);
                                break;
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
                    elements.push(element);
                }
                else if (element.value == valor || valor == "*") {
                    elements.push(element);
                }
            }
            break;
        default:
            return { error: "Error: nodetest no válido.", tipo: "Semántico", origen: "Query", linea: _nodetest.linea, columna: _nodetest.columna };
    }

    if (_predicate) {
        let filter = new Predicate(_predicate, _ambito, elements);
        elements = filter.filterElements(elements);
    }
    console.log(elements, 111)
    return { elementos: elements, atributos: attributes, cadena: cadena };
}

export =  { SA: SelectAxis, GetAxis: getAxis };