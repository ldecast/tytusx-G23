"use strict";
function Current(_instruccion, _ambito, _contexto) {
    var retorno = { cadena: "", retorno: Array() };
    var contexto;
    if (_contexto.retorno)
        contexto = _contexto.retorno;
    else
        contexto = null;
    var root = _ambito.getSymbolFromCurrent(contexto);
    if (root === null || root.length === 0)
        return { err: "No se encontraron elementos.\n", linea: _instruccion.linea, columna: _instruccion.columna };
    var cadena = "";
    root.forEach(function (element) {
        cadena = concatChilds(element, "");
    });
    retorno.cadena = cadena.substring(1);
    retorno.retorno = root;
    return retorno;
}
function concatChilds(_element, cadena) {
    cadena = ("\n<" + _element.id_open);
    if (_element.attributes) {
        _element.attributes.forEach(function (attribute) {
            cadena += (" " + attribute.id + "=\"" + attribute.value + "\"");
        });
    }
    cadena += ">";
    if (_element.childs) {
        _element.childs.forEach(function (child) {
            cadena += concatChilds(child, cadena);
        });
        cadena += ("\n</" + _element.id_close + ">");
    }
    else {
        if (_element.id_close === null)
            cadena += "/>\n";
        else
            cadena += (_element.value + "</" + _element.id_close + ">");
    }
    return cadena;
}
module.exports = Current;
