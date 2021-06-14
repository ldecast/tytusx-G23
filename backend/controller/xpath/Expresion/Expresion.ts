import { Ambito } from "../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../model/xpath/Enum";

function Expresion(_expresion: any, _ambito: Ambito, _contexto: any): any {
    let tipo: Tipos = _expresion.tipo;
    if (tipo === Tipos.EXPRESION) {
        return Expresion(_expresion.expresion, _ambito, _contexto);
    }
    else if (tipo === Tipos.NODENAME) {
        return { valor: _expresion.nodename, tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.STRING || tipo === Tipos.NUMBER) {
        return _expresion;
    }
    else if (tipo === Tipos.SELECT_CURRENT) {
        return { valor: ".", tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_PARENT) {
        return { valor: "..", tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_ATTRIBUTES) {
        return { valor: _expresion.expresion, tipo: Tipos.ATRIBUTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.ASTERISCO) {
        return { valor: "*", tipo: Tipos.ASTERISCO, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_NODE) {
        return { valor: "node()", tipo: Tipos.FUNCION_NODE, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_LAST) {
        return { valor: "last()", tipo: Tipos.FUNCION_LAST, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_POSITION) {
        return { valor: "position()", tipo: Tipos.FUNCION_POSITION, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.OPERACION_SUMA || tipo === Tipos.OPERACION_RESTA || tipo === Tipos.OPERACION_MULTIPLICACION
        || tipo === Tipos.OPERACION_DIVISION || tipo === Tipos.OPERACION_MODULO || tipo === Tipos.OPERACION_NEGACION_UNARIA) {
        const Aritmetica = require("./Operators/Aritmetica");
        return Aritmetica(_expresion, _contexto);
    }
    else if (tipo === Tipos.RELACIONAL_MAYOR || tipo === Tipos.RELACIONAL_MAYORIGUAL
        || tipo === Tipos.RELACIONAL_MENOR || tipo === Tipos.RELACIONAL_MENORIGUAL
        || tipo === Tipos.RELACIONAL_IGUAL || tipo === Tipos.RELACIONAL_DIFERENTE) {
        const Relacional = require("./Operators/Relacional");
        return Relacional(_expresion, _contexto);
    }
    else if (tipo === Tipos.LOGICA_AND || tipo === Tipos.LOGICA_OR) {
        const Logica = require("./Operators/Logica");
        return Logica(_expresion, _contexto);
    }
    else {
        console.log(_expresion, "SSSSSSSS")
        return { err: `Error: Expresión no procesada.\n`, linea: _expresion.linea, columna: _expresion.columna };
    }
}

export = Expresion;