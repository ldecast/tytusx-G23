import { Ambito } from "../../model/xml/Ambito/Ambito";
import { Element } from "../../model/xml/Element";
import { Tipos } from "../../model/xpath/Enum";
import Expresion from "../xpath/Expresion/Expresion";

function returnQuery(_expresion: any, _ambito: Ambito, _iterators: Array<any>, _contexto: Array<Element>) {
    let expresion: Array<any> = [];
    if (_expresion.tipo === Tipos.HTML) {
        expresion.push({ valor: '<' + _expresion.id_open + '>' })
    }
    for (let i = 0; i < _iterators.length; i++) {
        const iterator = _iterators[i];
        expresion = expresion.concat(Expresion(_expresion, _ambito, iterator.iterators, iterator.id));
    }
    if (_expresion.tipo === Tipos.HTML) {
        expresion.push({ valor: '</' + _expresion.id_close + '>' })
    }
    return writeReturn(expresion);
}

function writeReturn(_expresion: any): string {
    let cadena = "";
    let max = getMaxLength(_expresion);
    for (let i = 0; i < max; i++) {
        for (let j = 0; j < _expresion.length; j++) {
            var exp = _expresion[j];
            if (exp.valor)
                cadena += exp.valor;
            else {
                let shift = exp.shift();
                cadena += shift;
                exp = exp.push(shift);
            }
        }
        cadena += '\n';
    }
    console.log(cadena)
    return cadena;
}

function getMaxLength(context: Array<any>): number {
    let index = -1;
    context.forEach(element => {
        if (element.length > index)
            index = element.length;
    });
    return index;
}

export = returnQuery;