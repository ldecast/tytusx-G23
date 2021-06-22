import { Element } from "../../model/xml/Element";
import { Atributo } from "../../model/xml/Atributo";
import { Ambito } from "../../model/xml/Ambito/Ambito";
import Expresion from "../xpath/Expresion/Expresion";
import Bloque from "../xpath/Instruccion/Bloque";
import { Tipos } from "../../model/xpath/Enum";
import { Variable } from "../../model/xml/Ambito/Variable";


function ForLoop(_instruccion: any, _ambito: Ambito, _contexto: Array<Element>) {
    // var retorno = { elementos: Array<Element>(), atributos: Array<Atributo>(), texto: Array<string>(), cadena: Tipos.NONE };
    console.log(_instruccion, 'instrucciones For')

    // Procesar las variables de entrada
    let declaracion = _instruccion.cuerpo;
    console.log(declaracion, 444)
    let iterators: any = [];
    declaracion.forEach((_iterators: any) => {
        let id = Expresion(_iterators.variable, _ambito, _contexto);
        let it = Expresion(_iterators.iterators, _ambito, _contexto);
        if (!id.err && !it.err)
            iterators.push({ id: id.valor, iterators: it }); // { id: iterators? }
    });

    let cadena = "<test>$x</test>";
    let exit = "";
    for (let i = 0; i < iterators.length; i++) {
        const iterator = iterators[i];
        for (let j = 0; j < iterator.iterators.length; j++) {
            const element = iterator.iterators[j];
            exit += (cadena.replace(iterator.id, element) + '\n');
        }
    }
    console.log(exit);
    // for (let i = 0; i < iterators.length; i++) {
    //     const variable = _instruccion.variables[i];
    //     const entorno = _instruccion.iterators[i];
    //     let variable_exp = Expresion(variable, _ambito, _contexto);
    //     let contexto_exp = Expresion(entorno, _ambito, _contexto);
    //     let newVar = new Variable(variable_exp, contexto_exp);
    //     _ambito.addVariable(newVar); // Agregar las variables con su entorno asociado
    // }

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