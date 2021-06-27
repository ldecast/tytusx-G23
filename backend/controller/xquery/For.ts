import { Ambito } from "../../model/xml/Ambito/Ambito";
import Expresion from "../xpath/Expresion/Expresion";
import { Tipos } from "../../model/xpath/Enum";
import WhereClause from "./Where";
import OrderBy from "./OrderBy";
import returnQuery from "./Return";

function ForLoop(_instruccion: any, _ambito: Ambito, _contexto: any) {
    // console.log(_instruccion, 'instrucciones For')
    let contexto: any = (_contexto.elementos) ? (_contexto.elementos) : null;
    let declaracion = _instruccion.cuerpo;
    let iterators: Array<any> = [];
    declaracion.forEach((_declaracion: any) => {
        let it = Expresion(_declaracion, _ambito, _contexto);
        iterators = iterators.concat(it);
    });
    for (let i = 0; i < _instruccion.instrucciones.length; i++) {
        const instr = _instruccion.instrucciones[i];
        if (instr.tipo === Tipos.WHERE_CONDITION) { // Filtrar los elementos de cada variable
            let filter = WhereClause(instr.condiciones, _ambito, iterators); //, contexto
            if (filter) iterators = filter;
            else iterators = [];
        }
        if (instr.tipo === Tipos.ORDER_BY_CLAUSE) { // Ordenar los elementos según los parámetros
            let filter = OrderBy(instr.ordenes, _ambito, iterators); //, contexto
            if (filter) iterators = filter;
        }
        if (instr.tipo === Tipos.RETURN_STATEMENT) { // Retorna la salida
            return returnQuery(instr.expresion, _ambito, iterators) //, contexto);
        }
    }
}

export = ForLoop;