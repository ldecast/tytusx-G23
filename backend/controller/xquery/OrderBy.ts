import { Ambito } from "../../model/xml/Ambito/Ambito";
import Expresion from "../xpath/Expresion/Expresion";
import { Tipos } from "../../model/xpath/Enum";
import { Element } from "../../model/xml/Element";

let iterators: Array<any> = [];

function OrderBy(_instruccion: any, _ambito: Ambito, _iterators: Array<any>) {
    iterators = [];
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { id: $x, iterators: /book/title (contexto) }
        let iters = iterator.iterators;
        if (Array.isArray(iters)) iters = iters[0]; // _instruccion = [comparissons]
        let _x = Expresion(_instruccion, _ambito, iters, iterator.id);
        // console.log(_x, 8888888888888888, iters) // iters.elementos sería el padre
        if (_x)
            sortIterators(_x[0].elementos, _ambito, iterator.id);
    }
    if (iterators.length > 0)
        return iterators;
    return null;
}

function sortIterators(_elementos: Array<Element>, _ambito: Ambito, _id: any) {
    let swapped = true;
    do {
        swapped = false;
        for (let j = 0; j < _elementos.length; j++) {
            if (_elementos[j + 1])
                if (_elementos[j].value.charCodeAt(0) > _elementos[j + 1].value.charCodeAt(0)) { // Compara valor inicial de ASCII
                    let temp = _elementos[j];
                    _elementos[j] = _elementos[j + 1];
                    _elementos[j + 1] = temp;
                    swapped = true;
                }
        }
    } while (swapped);
    let tmp: Array<any> = [];
    _elementos.forEach(element => { // ¿buscar del padre a los hijos?
        let dad = element.father;
        if (dad) tmp.push(dad);
    });
    tmp = tmp.filter((v, i, a) => a.findIndex(t => (t.line === v.line && t.column === v.column)) === i) // Elimina duplicados
    tmp.forEach(dad => {
        const element = _ambito.searchDad(_ambito.tablaSimbolos[0], dad.id, dad.line, dad.column, []);
        iterators.push({ id: _id, iterators: { elementos: element, cadena: Tipos.ELEMENTOS } });
    });
}

// function sortElements(_elements: Array<Element>, _id: any) {
//     let tmp: number = 128;
//     let element_tmp: any = null;
//     for (let i = 0; i < _elements.length; i++) {
//         const element = _elements[i];
//         if (element.value) {
//             const ascii_element = element.value.charCodeAt(0);
//             if (ascii_element < tmp) {
//                 tmp = ascii_element;
//                 element_tmp = element;
//             }
//         }
//     }
//     if (element_tmp) sorted.push({ id: _id, elementos: element_tmp });
//     console.log(sorted, 111111111111)
// }

export = OrderBy;
