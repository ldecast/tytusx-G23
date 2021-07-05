"use strict";
const Enum_1 = require("../../../model/xpath/Enum");
function pushIterators(input) {
    let iterators = [];
    // console.log(input, 36363638)
    for (let i = 0; i < input.length; i++) {
        const path = input[i];
        if (path.items && path.items.length > 0) {
            return input;
        }
        if (path.notFound) {
            return [{ notFound: 'No se encontraron elementos.' }];
        }
        if (path.valor !== undefined && path.valor !== null) {
            iterators.unshift(path.valor);
        }
        if (path.cadena === Enum_1.Tipos.TEXTOS) {
            let root = path.texto;
            root.forEach(txt => {
                iterators.push(concatText(txt).substring(1));
            });
        }
        else if (path.cadena === Enum_1.Tipos.ELEMENTOS) {
            let root = path.elementos;
            root.forEach(element => {
                iterators.push(concatChilds(element, "").substring(1));
            });
        }
        else if (path.cadena === Enum_1.Tipos.ATRIBUTOS) {
            if (path.atributos) {
                let root = path.atributos; // <-- muestra sólo el atributo
                root.forEach(attr => {
                    iterators.push(concatAttributes(attr).substring(1));
                });
            }
            else {
                let root = path.elementos; // <-- muestra toda la etiqueta
                root.forEach(element => {
                    iterators.push(extractAttributes(element, "").substring(1));
                });
            }
        }
        else if (path.cadena === Enum_1.Tipos.COMBINADO) {
            let root = path.nodos;
            root.forEach((elemento) => {
                if (elemento.elementos) {
                    iterators.push(concatChilds(elemento.elementos, "").substring(1));
                }
                else if (elemento.textos) {
                    iterators.push(concatText(elemento.textos).substring(1));
                }
            });
        }
    }
    if (iterators.length > 0)
        return [iterators];
    return [{ notFound: 'No se encontraron elementos.' }];
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
        cadena += ("\n</" + _element.id_close + ">\n");
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
module.exports = pushIterators;
