import { Ambito } from "../../model/xml/Ambito/Ambito";
import Expresion from "../xpath/Expresion/Expresion";
import { Tipos } from "../../model/xpath/Enum";

function WhereClause(_instruccion: any, _ambito: Ambito, _iterators: Array<any>) {
    let iterators: Array<any> = [];
    for (let i = 0; i < _iterators.length; i++) { // [$x, $y, $z]
        const iterator = _iterators[i]; // { id: $x, iterators: /book/title (contexto) }
        let iters = iterator.iterators;
        if (Array.isArray(iters)) iters = iters[0];
        let _x = Expresion(_instruccion, _ambito, iters, iterator.id); // _instruccion = [comparissons]
        // console.log(_x, 8888888888888888)
        if (_x) {
            _x.forEach((element: any) => {
                iterators.push({ id: iterator.id, iterators: { elementos: [element], cadena: Tipos.ELEMENTOS } });
            });
        }
    }
    if (iterators.length > 0)
        return iterators;
    return null;
}

export = WhereClause;
