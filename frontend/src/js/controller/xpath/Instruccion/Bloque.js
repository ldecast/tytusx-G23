"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Enum_1 = require("../../../model/xpath/Enum");
var DobleEje_1 = __importDefault(require("./Selecting/DobleEje"));
var Eje_1 = __importDefault(require("./Selecting/Eje"));
var reset = { cadena: "", retorno: null };
var output = [];
function Bloque(_instruccion, _ambito, _retorno) {
    var tmp;
    // console.log(_instruccion, 888888);
    for (var i = 0; i < _instruccion.length; i++) {
        var camino = _instruccion[i]; // En caso de tener varios caminos
        for (var j = 0; j < camino.length; j++) {
            var instr = camino[j];
            if (instr.tipo === Enum_1.Tipos.SELECT_FROM_ROOT) {
                tmp = Eje_1.default(instr, _ambito, _retorno);
                if (tmp.notFound) {
                    _retorno = reset;
                    break;
                }
                if (tmp.error)
                    return tmp;
                if (tmp.retorno.elementos)
                    _retorno.retorno = tmp.retorno.elementos;
                else
                    _retorno = tmp;
            }
            else if (instr.tipo === Enum_1.Tipos.SELECT_FROM_CURRENT) {
                tmp = DobleEje_1.default(instr, _ambito, _retorno);
                if (tmp.notFound) {
                    _retorno = reset;
                    break;
                }
                if (tmp.error)
                    return tmp;
                if (tmp.retorno.elementos)
                    _retorno.retorno = tmp.retorno.elementos;
                else
                    _retorno = tmp;
            }
            else {
                return { error: "Error: Instrucci\u00F3n no procesada.", tipo: "Semántico", linea: instr.linea, columna: instr.columna };
            }
        }
        output.push(tmp);
        _retorno = reset;
    }
    return writeOutput();
}
function writeOutput() {
    var cadena = "";
    for (var i = 0; i < output.length; i++) {
        var path = output[i];
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            var root = (path.retorno.texto) ? (path.retorno.texto) : (path.retorno);
            root.forEach(function (txt) {
                cadena += concatText(txt);
            });
        }
        else if (path.cadena === Enum_1.Tipos.ELEMENTOS) {
            var root = path.retorno;
            root.forEach(function (element) {
                cadena += concatChilds(element, "");
            });
        }
        else if (path.cadena === Enum_1.Tipos.ATRIBUTOS) {
            // let root: Array<Atributo> = attr; // <-- muestra sólo el atributo
            // root.forEach(attribute => {
            //     cadena += concatAttributes(attribute);
            // });
            var root = path.retorno.elementos; // <-- muestra toda la etiqueta
            root.forEach(function (element) {
                cadena += extractAttributes(element, "");
            });
        }
        else if (path.cadena === Enum_1.Tipos.COMBINADO) {
            var root = path.retorno.nodos;
            root.forEach(function (elemento) {
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
    if (cadena)
        return cadena.substring(1);
    return "No se encontraron elementos.";
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
