"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../model/xpath/Enum");
var DobleEje_1 = __importDefault(require("./Selecting/DobleEje"));
var Eje_1 = __importDefault(require("./Selecting/Eje"));
function Bloque(_instruccion, _ambito) {
    var retorno = { cadena: "", retorno: null };
    var tmp;
    console.log(_instruccion, 888888);
    for (var i = 0; i < _instruccion.length; i++) {
        var camino = _instruccion[i]; // En caso de tener varios caminos
        for (var j = 0; j < camino.length; j++) {
            var instr = camino[j];
            console.log(instr, 7777777);
            switch (instr.tipo) {
                case Enum_1.Tipos.SELECT_FROM_ROOT:
                    tmp = Eje_1.default(instr, _ambito, retorno);
                    if (tmp.err)
                        return tmp;
                    retorno = tmp;
                    break;
                case Enum_1.Tipos.SELECT_FROM_CURRENT:
                    tmp = DobleEje_1.default(instr, _ambito, retorno);
                    if (tmp.err)
                        return tmp;
                    retorno = tmp;
                    break;
                default:
                    return { err: "Instrucción no procesada.\n", linea: instr.linea, columna: instr.columna };
            }
        }
    }
    console.log(retorno, 888888888);
    if (retorno.retorno) {
        var cadena_1 = "";
        if (retorno.cadena === Enum_1.Tipos.TEXTOS) {
            var root = retorno.retorno;
            root.forEach(function (txt) {
                cadena_1 += concatText(txt);
            });
        }
        else if (retorno.cadena === Enum_1.Tipos.ELEMENTOS) {
            var root = retorno.retorno;
            root.forEach(function (element) {
                cadena_1 += concatChilds(element, "");
            });
        }
        else if (retorno.cadena === Enum_1.Tipos.ATRIBUTOS) {
            // let root: Array<Atributo> = attr; // <-- muestra sólo el atributo
            // root.forEach(attribute => {
            //     cadena += concatAttributes(attribute);
            // });
            var root = retorno.retorno.elementos; // <-- muestra toda la etiqueta
            root.forEach(function (element) {
                cadena_1 += extractAttributes(element, "");
            });
        }
        else if (retorno.cadena === Enum_1.Tipos.COMBINADO) {
            console.log(retorno, 3523523);
            var root = retorno.retorno.nodos;
            root.forEach(function (elemento) {
                if (elemento.elementos) {
                    cadena_1 += concatChilds(elemento.elementos, "");
                }
                else if (elemento.textos) {
                    cadena_1 += concatText(elemento.textos);
                }
            });
        }
        retorno.cadena = cadena_1.substring(1);
    }
    return retorno;
}
function concatChilds(_element, cadena) {
    cadena = ("\n<" + _element.id_open);
    if (_element.attributes) {
        _element.attributes.forEach(function (attribute) {
            cadena += (" " + attribute.id + "=\"" + attribute.value + "\"");
        });
    }
    if (_element.childs) {
        cadena += ">";
        _element.childs.forEach(function (child) {
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
    return "\n" + _attribute.id + "=\"" + _attribute.value + "\"";
}
function extractAttributes(_element, cadena) {
    if (_element.attributes) {
        _element.attributes.forEach(function (attribute) {
            cadena += "\n" + attribute.id + "=\"" + attribute.value + "\"";
        });
    }
    return cadena;
}
function concatText(_text) {
    return "\n" + _text;
}
module.exports = Bloque;
