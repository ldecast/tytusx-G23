import { Ambito } from "../../../model/xml/Ambito/Ambito";
import { Element } from "../../../model/xml/Element";
import { Atributo } from "../../../model/xml/Atributo";
import { Tipos } from "../../../model/xpath/Enum";
import DobleEje from "./Selecting/DobleEje";
import Eje from "./Selecting/Eje";

function Bloque(_instruccion: Array<any>, _ambito: Ambito): any { //arreglo de accesos
    let retorno: any = { cadena: "", retorno: null };
    let attr = Array<Atributo>();
    let tmp: any;
    for (let i = 0; i < _instruccion.length; i++) {
        const instr = _instruccion[i];
        console.log(instr, 7777777);
        switch (instr.tipo) {
            case Tipos.SELECT_FROM_ROOT:
                tmp = Eje(instr, _ambito, retorno);
                if (tmp.err) return tmp;
                // if (tmp.retorno.atributos) {
                //     retorno.retorno = tmp.retorno.elementos;
                //     retorno.cadena = tmp.cadena;
                //     attr = tmp.retorno.atributos;
                // }
                // else {
                retorno = tmp;
                // }
                break;
            case Tipos.SELECT_FROM_CURRENT:
                tmp = DobleEje(instr, _ambito, retorno);
                console.log(tmp, 323223);
                if (tmp.err) return tmp;
                // if (tmp.retorno.atributos) {
                //     retorno.retorno = tmp.retorno.elementos;
                //     retorno.cadena = tmp.cadena;
                //     attr = tmp.retorno.atributos;
                // }
                // else {
                retorno = tmp;
                // }
                break;
            default:
                return { err: "Instrucción no procesada.\n", linea: instr.linea, columna: instr.columna };
        }
    }
    console.log(retorno, 888888888)
    if (retorno.retorno) {
        let cadena = "";
        if (retorno.cadena === Tipos.TEXTOS) {
            let root: Array<string> = retorno.retorno;
            root.forEach(txt => {
                cadena += concatText(txt);
            });
        }
        else if (retorno.cadena === Tipos.ELEMENTOS) {
            let root: Array<Element> = retorno.retorno;
            root.forEach(element => {
                cadena += concatChilds(element, "");
            });
        }
        else if (retorno.cadena === Tipos.ATRIBUTOS) {
            // let root: Array<Atributo> = attr; // <-- muestra sólo el atributo
            // root.forEach(attribute => {
            //     cadena += concatAttributes(attribute);
            // });
            let root: Array<Element> = retorno.retorno.elementos; // <-- muestra toda la etiqueta
            root.forEach(element => {
                cadena += extractAttributes(element, "");
            });
        }
        else if (retorno.cadena === Tipos.COMBINADO) {
            console.log(retorno, 3523523);
            let root: Array<any> = retorno.retorno.nodos;
            root.forEach((elemento: any) => {
                if (elemento.elementos) {
                    cadena += concatChilds(elemento.elementos, "");
                }
                else if (elemento.textos) {
                    cadena += concatText(elemento.textos);
                }
            });
        }
        retorno.cadena = cadena.substring(1);
    }

    return retorno;
}

function concatChilds(_element: Element, cadena: string): string {
    cadena = ("\n<" + _element.id_open);
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += (" " + attribute.id + "=\"" + attribute.value + "\"");
        });
    }
    if (_element.childs) {
        cadena += ">";
        _element.childs.forEach(child => {
            cadena += concatChilds(child, cadena);
        });
        cadena += ("\n</" + _element.id_close + ">");
    }
    else {
        if (_element.id_close === null)
            cadena += "/>";
        else {
            cadena += ">";
            cadena += (_element.value + "</" + _element.id_close + ">");
        }
    }
    return cadena;
}

function concatAttributes(_attribute: Atributo): string {
    return `\n${_attribute.id}="${_attribute.value}"`;
}

function extractAttributes(_element: Element, cadena: string): string {
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += `\n${attribute.id}="${attribute.value}"`;
        });
    }
    return cadena;
}

function concatText(_text: string): string {
    return `\n${_text}`;
}

export = Bloque;