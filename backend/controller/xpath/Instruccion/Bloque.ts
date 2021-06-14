import { Ambito } from "../../../model/xml/Ambito/Ambito";
import { Element } from "../../../model/xml/Element";
import { Atributo } from "../../../model/xml/Atributo";
import { Tipos } from "../../../model/xpath/Enum";
import DobleEje from "./Selecting/DobleEje";
import Eje from "./Selecting/Eje";

let reset: any = { cadena: "", retorno: null };
let output: Array<any> = [];

function Bloque(_instruccion: Array<any>, _ambito: Ambito, _retorno: any) {
    let tmp: any;
    // console.log(_instruccion, 888888);
    for (let i = 0; i < _instruccion.length; i++) {
        const camino = _instruccion[i]; // En caso de tener varios caminos
        for (let j = 0; j < camino.length; j++) {
            const instr = camino[j];
            if (instr.tipo === Tipos.SELECT_FROM_ROOT) {
                tmp = Eje(instr, _ambito, _retorno);
                if (tmp.err) break;
                _retorno = tmp;
            }
            else if (instr.tipo === Tipos.SELECT_FROM_CURRENT) {
                tmp = DobleEje(instr, _ambito, _retorno);
                if (tmp.err) break;
                _retorno = tmp;
            }
        }
        output.push(_retorno);
        _retorno = reset;
    }
    return writeOutput();
}

function writeOutput() {
    let cadena = "";
    for (let i = 0; i < output.length; i++) {
        const path = output[i];
        if (path.cadena === Tipos.TEXTOS) {
            let root: Array<string> = path.retorno;
            root.forEach(txt => {
                cadena += concatText(txt);
            });
        }
        else if (path.cadena === Tipos.ELEMENTOS) {
            let root: Array<Element> = path.retorno;
            root.forEach(element => {
                cadena += concatChilds(element, "");
            });
        }
        else if (path.cadena === Tipos.ATRIBUTOS) {
            // let root: Array<Atributo> = attr; // <-- muestra sólo el atributo
            // root.forEach(attribute => {
            //     cadena += concatAttributes(attribute);
            // });
            let root: Array<Element> = path.retorno.elementos; // <-- muestra toda la etiqueta
            root.forEach(element => {
                cadena += extractAttributes(element, "");
            });
        }
        else if (path.cadena === Tipos.COMBINADO) {
            let root: Array<any> = path.retorno.nodos;
            root.forEach((elemento: any) => {
                if (elemento.elementos) {
                    cadena += concatChilds(elemento.elementos, "");
                }
                else if (elemento.textos) {
                    cadena += concatText(elemento.textos);
                }
            });
        }
    }
    output = [];
    if (cadena) return cadena.substring(1);
    return "No se encontraron elementos.";
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