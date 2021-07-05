"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = require("../../../model/xpath/Enum");
const DobleEje_1 = __importDefault(require("./Selecting/DobleEje"));
const Eje_1 = __importDefault(require("./Selecting/Eje"));
const Axis_1 = __importDefault(require("./Selecting/Axis/Axis"));
const For_1 = __importDefault(require("../../xquery/For"));
const Contexto_1 = require("../../Contexto");
let reset;
let output = [];
function Bloque(_instruccion, _ambito, _retorno, id) {
    output = [];
    reset = _retorno;
    let tmp;
    let i;
    // console.log(_instruccion, 272727272727)
    for (i = 0; i < _instruccion.length; i++) {
        const instr = _instruccion[i];
        if (instr.tipo === Enum_1.Tipos.FOR_LOOP) {
            return For_1.default(instr, _ambito, _retorno);
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_ROOT || instr.tipo === Enum_1.Tipos.EXPRESION) {
            tmp = Eje_1.default(instr.expresion, _ambito, _retorno, id);
            // console.log(tmp,8888888888)
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_CURRENT) {
            tmp = DobleEje_1.default(instr, _ambito, _retorno);
        }
        else if (instr.tipo === Enum_1.Tipos.SELECT_AXIS) {
            tmp = Axis_1.default.SA(instr, _ambito, _retorno);
        }
        else {
            return { error: "Error: Instrucción no procesada.", tipo: "Semántico", origen: "Query", linea: instr.linea, columna: instr.columna };
        }
        if (tmp === null || tmp.error)
            return tmp;
        if (tmp.notFound && i + 1 < _instruccion.length) {
            _retorno = reset;
            break;
        }
        _retorno = tmp;
    }
    if (i > 0)
        output.push(_retorno);
}
function getOutput(_instruccion, _ambito, _retorno) {
    Bloque(_instruccion, _ambito, _retorno);
    let cadena = writeOutput();
    let codigo3d = ""; // Agregar función que devuelva código tres direcciones
    return { cadena: cadena, codigo3d: codigo3d };
}
function getIterators(_instruccion, _ambito, _retorno, _id) {
    let _bloque = Bloque(_instruccion, _ambito, _retorno, _id);
    // console.log(_bloque,22222222222)
    if (_bloque)
        return output[0];
    else
        return new Contexto_1.Contexto();
}
function writeOutput() {
    let cadena = "";
    for (let i = 0; i < output.length; i++) {
        const path = output[i];
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            let root = (path.texto) ? (path.texto) : [];
            root.forEach(txt => {
                cadena += concatText(txt);
            });
        }
        else if (path.cadena === Enum_1.Tipos.ELEMENTOS) {
            let root = path.elementos;
            root.forEach(element => {
                cadena += concatChilds(element, "");
            });
        }
        else if (path.cadena === Enum_1.Tipos.ATRIBUTOS) {
            if (path.atributos) {
                let root = path.atributos; // <-- muestra sólo el atributo
                root.forEach(attr => {
                    cadena += concatAttributes(attr);
                });
            }
            else {
                let root = path.elementos; // <-- muestra toda la etiqueta
                root.forEach(element => {
                    cadena += extractAttributes(element, "");
                });
            }
        }
        else if (path.cadena === Enum_1.Tipos.COMBINADO) {
            let root = path.nodos;
            root.forEach((elemento) => {
                if (elemento.elementos) {
                    cadena += concatChilds(elemento.elementos, "");
                }
                else if (elemento.textos) {
                    cadena += concatText(elemento.textos);
                }
            });
        }
    }
    if (cadena)
        return replaceEntity(cadena.substring(1));
    return "No se encontraron elementos.";
}
function replaceEntity(cadena) {
    const _lessThan = /&lt;/gi;
    const _greaterThan = /&gt;/gi;
    const _ampersand = /&amp;/gi;
    const _apostrophe = /&apos;/gi;
    const _quotation = /&quot;/gi;
    var salida = cadena.replace(_lessThan, "<").replace(_greaterThan, ">").replace(_ampersand, "&").replace(_apostrophe, "\'").replace(_quotation, "\"");
    return salida;
}
function concatChilds(_element, cadena) {
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
function concatAttributes(_attribute) {
    return `\n${_attribute.id}="${_attribute.value}"`;
}
function extractAttributes(_element, cadena) {
    if (_element.attributes) {
        _element.attributes.forEach(attribute => {
            cadena += `\n${attribute.id}="${attribute.value}"`;
        });
    }
    return cadena;
}
function concatText(_text) {
    return `\n${_text}`;
}
module.exports = { Bloque: Bloque, getIterators: getIterators, getOutput: getOutput };
