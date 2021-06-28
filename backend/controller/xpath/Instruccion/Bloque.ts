import { Ambito } from "../../../model/xml/Ambito/Ambito";
import { Element } from "../../../model/xml/Element";
import { Atributo } from "../../../model/xml/Atributo";
import { Tipos } from "../../../model/xpath/Enum";
import DobleEje from "./Selecting/DobleEje";
import Eje from "./Selecting/Eje";
import Axis from "./Selecting/Axis/Axis";
import ForLoop from "../../xquery/For";
import { Contexto } from "../../Contexto";

let reset: Contexto;
let output: Array<Contexto> = [];

function Bloque(_instruccion: Array<any>, _ambito: Ambito, _retorno: Contexto, id?: any) {
    output = [];
    reset = _retorno;
    let tmp: Contexto;
    let i;
    // console.log(_instruccion, 272727272727)
    for (i = 0; i < _instruccion.length; i++) {
        const instr = _instruccion[i];
        if (instr.tipo === Tipos.FOR_LOOP) {
            return ForLoop(instr, _ambito, _retorno);
        }
        else if (instr.tipo === Tipos.SELECT_FROM_ROOT || instr.tipo === Tipos.EXPRESION) {
            tmp = Eje(instr.expresion, _ambito, _retorno, id);
            // console.log(tmp,8888888888)
        }
        else if (instr.tipo === Tipos.SELECT_FROM_CURRENT) {
            tmp = DobleEje(instr, _ambito, _retorno);
        }
        else if (instr.tipo === Tipos.SELECT_AXIS) {
            tmp = Axis.SA(instr, _ambito, _retorno);
        }
        else {
            return { error: "Error: Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: instr.linea, columna: instr.columna };
        }
        if (tmp === null || tmp.error) return tmp;
        if (tmp.notFound && i + 1 < _instruccion.length) { _retorno = reset; break; }
        _retorno = tmp;
    }
    if (i > 0)
        output.push(_retorno);
}

function getOutput(_instruccion: Array<any>, _ambito: Ambito, _retorno: Contexto) {
    Bloque(_instruccion, _ambito, _retorno);
    let cadena = writeOutput();
    let codigo3d = ""; // Agregar función que devuelva código tres direcciones
    return { cadena: cadena, codigo3d: codigo3d };
}

function getIterators(_instruccion: Array<any>, _ambito: Ambito, _retorno: any, _id: any): Contexto {
    let _bloque = Bloque(_instruccion, _ambito, _retorno, _id);
    // console.log(_bloque,22222222222)
    if (_bloque) return output[0];
    else return new Contexto();
}

function writeOutput() {
    let cadena = "";
    for (let i = 0; i < output.length; i++) {
        const path = output[i];
        if (path.cadena === Tipos.TEXTOS) {
            let root: Array<string> = (path.texto) ? (path.texto) : [];
            root.forEach(txt => {
                cadena += concatText(txt);
            });
        }
        else if (path.cadena === Tipos.ELEMENTOS) {
            let root: Array<Element> = path.elementos;
            root.forEach(element => {
                cadena += concatChilds(element, "");
            });
        }
        else if (path.cadena === Tipos.ATRIBUTOS) {
            if (path.atributos) {
                let root: Array<Atributo> = path.atributos; // <-- muestra sólo el atributo
                root.forEach(attr => {
                    cadena += concatAttributes(attr);
                });
            }
            else {
                let root: Array<Element> = path.elementos; // <-- muestra toda la etiqueta
                root.forEach(element => {
                    cadena += extractAttributes(element, "");
                });
            }
        }
        else if (path.cadena === Tipos.COMBINADO) {
            let root: Array<any> = path.nodos;
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
    if (cadena) return replaceEntity(cadena.substring(1));
    return "No se encontraron elementos.";
}

function replaceEntity(cadena: string) {
    const _lessThan = /&lt;/gi;
    const _greaterThan = /&gt;/gi;
    const _ampersand = /&amp;/gi;
    const _apostrophe = /&apos;/gi;
    const _quotation = /&quot;/gi;
    var salida = cadena.replace(_lessThan, "<").replace(_greaterThan, ">").replace(_ampersand, "&").replace(_apostrophe, "\'").replace(_quotation, "\"");
    return salida;
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

export = { Bloque: Bloque, getIterators: getIterators, getOutput: getOutput };