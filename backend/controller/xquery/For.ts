import { Element } from "../../model/xml/Element";
import { Atributo } from "../../model/xml/Atributo";
import { Ambito } from "../../model/xml/Ambito/Ambito";
import Expresion from "../xpath/Expresion/Expresion";
import Bloque from "../xpath/Instruccion/Bloque";
import { Tipos } from "../../model/xpath/Enum";
import { Variable } from "../../model/xml/Ambito/Variable";
import returnQuery from "./Return";
import WhereClause from "./Where";


function ForLoop(_instruccion: any, _ambito: Ambito, _contexto: any) {
    // var retorno = { elementos: Array<Element>(), atributos: Array<Atributo>(), texto: Array<string>(), cadena: Tipos.NONE };
    // console.log(_instruccion, 'instrucciones For')

    let contexto: any = (_contexto.elementos) ? (_contexto.elementos) : null;
    // Procesar las variables de entrada
    let declaracion = _instruccion.cuerpo;
    // console.log(declaracion, 444)
    let iterators: any = [];
    declaracion.forEach((_iterators: any) => {
        // console.log(_iterators, 2221)
        let id = Expresion(_iterators.variable, _ambito, _contexto);
        let it = Expresion(_iterators.iterators, _ambito, _contexto);
        if (!id.error && !it.error)
            iterators.push({ id: id.valor, iterators: it });
    });
    // console.log(iterators[0].iterators, 6666665) <-- es el contexto []
    for (let i = 0; i < _instruccion.instrucciones.length; i++) {
        const instr = _instruccion.instrucciones[i];
        // if (instr.tipo === Tipos.WHERE_CONDITION) {
        //     _contexto = WhereClause(instr, _ambito, _contexto);
        // }
        if (instr.tipo === Tipos.RETURN_STATEMENT) {
            return returnQuery(instr.expresion[0], _ambito, iterators, contexto);
        }
    }























    if (_instruccion.where) {
        // Filtrar los elementos de cada variable
    }

    if (_instruccion.orderby) {
        // Ordenar los elementos según los parámetros
    }

    if (_instruccion.return) {
        // let retorno = Expresion()
    }

}

export = ForLoop;