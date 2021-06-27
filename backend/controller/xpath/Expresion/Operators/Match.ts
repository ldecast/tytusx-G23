import { Tipos } from "../../../../model/xpath/Enum";
import { Element } from "../../../../model/xml/Element";
import { Ambito } from "../../../../model/xml/Ambito/Ambito";

function filterElements(valor: any, desigualdad: Tipos, _ambito: Ambito, _contexto: Array<Element>): Array<Element> {
    let condition: boolean = false;
    let tmp: Array<any> = [];
    for (let i = 0; i < _contexto.length; i++) {
        const element = _contexto[i];
        // console.log(element, 555555)
        /* if (element.attributes) { // Hace match con un atributo
            for (let j = 0; j < element.attributes.length; j++) {
                const attribute = element.attributes[j];
                condition = verificarDesigualdad(desigualdad, attribute.value, valor);
                if (condition) {
                    tmp.push(element);
                    break; // Sale del ciclo de atributos para pasar al siguiente elemento
                }
            }
        }
        if (element.childs) { // Hace match con algún hijo
            for (let j = 0; j < element.childs.length; j++) {
                const child = element.childs[j];
                condition = verificarDesigualdad(desigualdad, child.value, valor);
                if (condition) {
                    tmp.push(element);
                    break;
                }
            }
        } */
        condition = verificarDesigualdad(desigualdad, element.value, valor); // Hace match con el elemento
        if (condition) {
            let dad = element.father;
            if (dad)
                tmp = tmp.concat(_ambito.searchDad(_ambito.tablaSimbolos[0], dad.id, dad.line, dad.column, []));
        }

    }
    // console.log(tmp, 133333333333333)
    return tmp;
}

function verificarDesigualdad(_tipo: Tipos, v1: any, e1: any): boolean {
    switch (_tipo) {
        case Tipos.RELACIONAL_MAYOR:
            return (v1 > e1);
        case Tipos.RELACIONAL_MAYORIGUAL:
            return (v1 >= e1);
        case Tipos.RELACIONAL_MENOR:
            return (v1 < e1);
        case Tipos.RELACIONAL_MENORIGUAL:
            return (v1 <= e1);
        case Tipos.RELACIONAL_IGUAL:
            return (v1 == e1);
        case Tipos.RELACIONAL_DIFERENTE:
            return (v1 != e1);
        default:
            return false;
    }
}

export = filterElements;